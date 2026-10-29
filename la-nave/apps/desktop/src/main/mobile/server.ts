import { existsSync, readFileSync, realpathSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import type { IncomingMessage, Server, ServerResponse } from 'node:http';
import { extname, join, sep } from 'node:path';
import type { Logger } from '@nave/core';
import { CHANNELS } from '@nave/shared';
import type { ChannelName, ErrorCode, MobileDevice } from '@nave/shared';
import { run } from '../handlers';
import type { Handler, Handlers } from '../handlers';
import type { Devices, Pairing, RateLimiter } from './auth';

const MAX_BODY = 64 * 1024;

const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

const CSP = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; manifest-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'";

export interface MobileServerDeps {
  handlers: Handlers;
  devices: Devices;
  pairing: Pairing;
  /** Carpeta con la web del móvil ya compilada; null si no existe (solo API). */
  staticDir: string | null;
  /** Nombres de host extra permitidos (por ejemplo el de la red privada de Tailscale). */
  extraHosts(): string[];
  log: Logger;
  onError(error: unknown): void;
  pairLimiter: RateLimiter;
  deviceLimiter: RateLimiter;
}

type Failure = { ok: false; error: { code: ErrorCode; message: string } };

/**
 * Servidor del acceso móvil (ADR-002). Solo escucha en 127.0.0.1; la red privada (Tailscale) lo publica por HTTPS.
 * Defensas: comprobación de Host y Origin, token por móvil, lista cerrada de canales, límite de peticiones y de tamaño,
 * cabeceras de seguridad y archivos estáticos sin salir de su carpeta.
 */
export class MobileServer {
  port = 0;
  private server: Server | undefined;

  constructor(private readonly deps: MobileServerDeps) {}

  async start(port: number): Promise<number> {
    const server = createServer((req, res) => {
      try {
        this.handle(req, res);
      } catch (error) {
        this.deps.onError(error);
        this.send(res, 500, fail('INTERNAL', 'Algo ha fallado dentro de La Nave.'));
      }
    });
    this.server = server;
    await new Promise<void>((resolve, reject) => {
      server.once('error', reject);
      server.listen(port, '127.0.0.1', resolve);
    });
    const address = server.address();
    this.port = typeof address === 'object' && address ? address.port : 0;
    return this.port;
  }

  async stop(): Promise<void> {
    const server = this.server;
    this.server = undefined;
    if (!server) return;
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
      server.closeAllConnections();
    });
  }

  get running(): boolean {
    return this.server !== undefined;
  }

  private hosts(): Set<string> {
    const set = new Set([`127.0.0.1:${this.port}`, `localhost:${this.port}`]);
    for (const host of this.deps.extraHosts()) set.add(host.toLowerCase());
    return set;
  }

  private headers(extra: Record<string, string> = {}): Record<string, string> {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'no-referrer',
      'Content-Security-Policy': CSP,
      'Cross-Origin-Resource-Policy': 'same-origin',
      ...extra
    };
  }

  private send(res: ServerResponse, status: number, body: unknown): void {
    if (res.headersSent) return;
    res.writeHead(status, this.headers({ 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }));
    res.end(JSON.stringify(body));
  }

  private handle(req: IncomingMessage, res: ServerResponse): void {
    const hosts = this.hosts();
    if (!hosts.has((req.headers.host ?? '').toLowerCase())) return this.send(res, 403, fail('FORBIDDEN', 'Dirección no permitida.'));

    const url = new URL(req.url ?? '/', 'http://localhost');
    if (!url.pathname.startsWith('/api/')) return this.serveStatic(req, res, url.pathname);

    if (req.method !== 'POST') return this.send(res, 405, fail('FORBIDDEN', 'Método no permitido.'));
    // CSRF: si el navegador manda Origin, tiene que ser una de nuestras direcciones.
    const origin = req.headers.origin;
    if (origin !== undefined) {
      let originHost = '';
      try {
        originHost = new URL(origin).host.toLowerCase();
      } catch {
        /* origen ilegible: se rechaza */
      }
      if (!hosts.has(originHost)) return this.send(res, 403, fail('FORBIDDEN', 'Origen no permitido.'));
    }

    if (url.pathname === '/api/pair') return this.readBody(req, res, 4 * 1024, (raw) => this.pair(res, raw));

    const channelName = /^\/api\/rpc\/([a-z]+:[a-z-]+)$/.exec(url.pathname)?.[1];
    if (!channelName) return this.send(res, 404, fail('NOT_FOUND', 'No existe.'));

    const device = this.authenticate(req);
    if (!device) return this.send(res, 401, fail('FORBIDDEN', 'Este móvil no está emparejado o se ha revocado. Vuelve a escanear el QR.'));
    if (!this.deps.deviceLimiter.allow(device.id)) return this.send(res, 429, fail('FORBIDDEN', 'Demasiadas peticiones. Espera un momento.'));
    // Object.hasOwn: «constructor» o «__proto__» no son canales aunque estén en la cadena de prototipos.
    if (!Object.hasOwn(CHANNELS, channelName)) return this.send(res, 404, fail('NOT_FOUND', 'Ese canal no existe.'));
    const channel = channelName as ChannelName;
    if (CHANNELS[channel].remote !== 'allowed') return this.send(res, 403, fail('FORBIDDEN', 'Esta acción solo se puede hacer desde el PC.'));

    this.readBody(req, res, MAX_BODY, (raw) => {
      let input: unknown;
      if (raw.length > 0) {
        try {
          input = JSON.parse(raw);
        } catch {
          return this.send(res, 400, fail('VALIDATION', 'El cuerpo no es JSON válido.'));
        }
      }
      const result = run(channel, this.deps.handlers[channel] as Handler<typeof channel>, input, this.deps.onError);
      this.send(res, 200, result);
    });
  }

  private authenticate(req: IncomingMessage): MobileDevice | null {
    const header = req.headers.authorization ?? '';
    const match = /^Bearer ([A-Za-z0-9_-]{20,200})$/.exec(header);
    return match?.[1] ? this.deps.devices.authenticate(match[1]) : null;
  }

  private pair(res: ServerResponse, raw: string): void {
    // Límite global: da igual desde dónde llegue, no se puede probar códigos a toda velocidad.
    if (!this.deps.pairLimiter.allow('pair')) return this.send(res, 429, fail('FORBIDDEN', 'Demasiados intentos. Espera un minuto.'));
    let body: { code?: unknown; name?: unknown } = {};
    try {
      const parsed: unknown = JSON.parse(raw);
      if (typeof parsed === 'object' && parsed !== null) body = parsed as typeof body;
    } catch {
      return this.send(res, 400, fail('VALIDATION', 'El cuerpo no es JSON válido.'));
    }
    if (!this.deps.pairing.consume(body.code)) {
      this.deps.log.warn('Intento de emparejamiento rechazado');
      return this.send(res, 401, fail('FORBIDDEN', 'El código no es válido o ha caducado. Genera otro QR en La Nave.'));
    }
    const { device, token } = this.deps.devices.add(typeof body.name === 'string' ? body.name : 'Móvil');
    this.deps.log.info('Móvil emparejado', { dispositivo: device.name });
    this.send(res, 200, { ok: true, data: { token, deviceId: device.id, name: device.name } });
  }

  private readBody(req: IncomingMessage, res: ServerResponse, max: number, then: (raw: string) => void): void {
    const chunks: Buffer[] = [];
    let size = 0;
    let rejected = false;
    req.on('data', (chunk: Buffer) => {
      if (rejected) return;
      size += chunk.length;
      if (size > max) {
        rejected = true;
        res.writeHead(413, this.headers({ 'Content-Type': 'application/json; charset=utf-8', Connection: 'close' }));
        res.end(JSON.stringify(fail('VALIDATION', 'La petición es demasiado grande.')), () => req.destroy());
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      if (!rejected) then(Buffer.concat(chunks).toString('utf8'));
    });
    req.on('error', () => undefined);
  }

  private serveStatic(req: IncomingMessage, res: ServerResponse, pathname: string): void {
    if (req.method !== 'GET' && req.method !== 'HEAD') return this.send(res, 405, fail('FORBIDDEN', 'Método no permitido.'));
    const root = this.deps.staticDir;
    if (!root || !existsSync(root)) return this.send(res, 404, fail('NOT_FOUND', 'La web del móvil no está instalada.'));

    let decoded: string;
    try {
      decoded = decodeURIComponent(pathname);
    } catch {
      return this.send(res, 400, fail('VALIDATION', 'Ruta no válida.'));
    }
    if (decoded.includes('\0') || decoded.includes('\\') || decoded.split('/').includes('..')) return this.send(res, 400, fail('VALIDATION', 'Ruta no válida.'));

    const realRoot = realpathSync(root);
    const resolve = (relative: string): string | null => {
      try {
        const real = realpathSync(join(realRoot, relative));
        return real.startsWith(realRoot + sep) && statSync(real).isFile() ? real : null;
      } catch {
        return null;
      }
    };
    const wanted = decoded === '/' ? 'index.html' : decoded.replace(/^\/+/, '');
    // Una ruta sin extensión es una pantalla de la app (se abre index.html); con extensión, o existe o es 404.
    const file = resolve(wanted) ?? (extname(wanted) === '' ? resolve('index.html') : null);
    if (!file) return this.send(res, 404, fail('NOT_FOUND', 'No existe.'));
    const type = TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream';
    const hashed = file.includes(`${sep}assets${sep}`);
    res.writeHead(200, this.headers({ 'Content-Type': type, 'Cache-Control': hashed ? 'public, max-age=31536000, immutable' : 'no-store' }));
    res.end(req.method === 'HEAD' ? undefined : readFileSync(file));
  }
}

function fail(code: ErrorCode, message: string): Failure {
  return { ok: false, error: { code, message } };
}
