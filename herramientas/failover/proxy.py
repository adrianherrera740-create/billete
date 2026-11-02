#!/usr/bin/env python3
"""Proxy local con cadena de proveedores compatibles con la API de Anthropic.

Reenvía cada petición al primer proveedor disponible. Si responde con límite
(429), error de servidor (5xx, 529) o no conecta, lo aparta un tiempo y prueba
el siguiente. Un proveedor aparece una sola vez por cuenta: no rota cuentas.

Uso: python proxy.py [config.json]
"""
import http.client
import json
import os
import sys
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit

FAILOVER_STATUS = {429, 500, 502, 503, 504, 529}
HOP = {"connection", "keep-alive", "transfer-encoding", "te", "trailer", "upgrade",
       "proxy-authorization", "proxy-authenticate", "content-length", "host"}

cfg = {}
down_until = {}
lock = threading.Lock()


def log(msg):
    print(time.strftime("%H:%M:%S"), msg, flush=True)


def available(p):
    with lock:
        return down_until.get(p["name"], 0) <= time.time()


def mark_down(p, seconds):
    with lock:
        down_until[p["name"]] = time.time() + seconds


def retry_after(headers, default):
    try:
        return max(1, min(int(headers.get("retry-after", default)), 3600))
    except ValueError:
        return default


class Handler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def log_message(self, *a):
        pass

    def do_GET(self):
        self.forward()

    def do_POST(self):
        self.forward()

    def forward(self):
        n = int(self.headers.get("content-length") or 0)
        body = self.rfile.read(n) if n else b""
        providers = [p for p in cfg["providers"] if available(p)] or cfg["providers"][-1:]
        last = None
        for p in providers:
            conn, resp = self.try_provider(p, body)
            if resp is None:
                continue
            if resp.status in FAILOVER_STATUS and p is not providers[-1]:
                last = (resp.status, resp.read())
                mark_down(p, retry_after(dict(resp.getheaders()), cfg.get("cooldown", 300)))
                log(f"{p['name']}: HTTP {resp.status}, salto al siguiente")
                conn.close()
                continue
            log(f"{self.command} {self.path} -> {p['name']} ({resp.status})")
            self.relay(conn, resp)
            return
        status, data = last or (502, b'{"error":"ningun proveedor disponible"}')
        self.send_response(status)
        self.send_header("content-type", "application/json")
        self.send_header("content-length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def try_provider(self, p, body):
        u = urlsplit(p["base_url"])
        cls = http.client.HTTPSConnection if u.scheme == "https" else http.client.HTTPConnection
        headers = {k: v for k, v in self.headers.items() if k.lower() not in HOP}
        headers["host"] = u.netloc
        if p.get("api_key_env"):
            key = os.environ.get(p["api_key_env"], "")
            for h in ("authorization", "x-api-key"):
                headers.pop(h, None)
            headers["x-api-key"] = key
            headers["authorization"] = f"Bearer {key}"
        data = body
        if body and p.get("models"):
            try:
                j = json.loads(body)
                j["model"] = p["models"].get(j.get("model"), p["models"].get("*", j.get("model")))
                data = json.dumps(j).encode()
            except ValueError:
                pass
        if data:
            headers["content-length"] = str(len(data))
        try:
            conn = cls(u.netloc, timeout=cfg.get("timeout", 600))
            conn.request(self.command, u.path.rstrip("/") + self.path, data, headers)
            return conn, conn.getresponse()
        except OSError as e:
            mark_down(p, 30)
            log(f"{p['name']}: sin conexion ({e}), salto al siguiente")
            return None, None

    def relay(self, conn, resp):
        self.send_response(resp.status)
        for k, v in resp.getheaders():
            if k.lower() not in HOP:
                self.send_header(k, v)
        self.send_header("transfer-encoding", "chunked")
        self.end_headers()
        try:
            while chunk := resp.read1(8192):
                self.wfile.write(f"{len(chunk):x}\r\n".encode() + chunk + b"\r\n")
                self.wfile.flush()
            self.wfile.write(b"0\r\n\r\n")
        except (BrokenPipeError, ConnectionResetError):
            pass
        finally:
            conn.close()


def main():
    global cfg
    path = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), "config.json")
    cfg = json.load(open(path, encoding="utf-8"))
    host, port = cfg.get("host", "127.0.0.1"), cfg.get("port", 8787)
    log(f"escuchando en http://{host}:{port} -> " + " > ".join(p["name"] for p in cfg["providers"]))
    ThreadingHTTPServer((host, port), Handler).serve_forever()


if __name__ == "__main__":
    main()
