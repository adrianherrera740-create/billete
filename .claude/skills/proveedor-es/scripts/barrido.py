#!/usr/bin/env python3
"""Barrido de AliExpress ES (envío desde España) en paralelo, con filtro y tabla lista para pegar.

Uso:
  python3 barrido.py terminos.txt --salida tienda/trabajo/ronda-11/barrido [--workers 4]
      [--coste-min 3] [--coste-max 14] [--ventas-min 1000] [--rating-min 4.7] [--top 60]
  python3 barrido.py --terminos "extractor abolladuras" "limpiador faros" --salida /tmp/barrido

terminos.txt: un término por línea. Lanza `aliexpress_es.js` en N procesos, une los resultados, quita duplicados,
filtra por coste, ventas y valoración y escribe SALIDA.json (todo) y SALIDA.md (tabla filtrada).
Requiere Node + Playwright (ver cerebro/USAR-EN-FCC.md). Solo son datos de listado, no de ficha.
"""
import argparse
import json
import os
import re
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

AQUI = Path(__file__).resolve().parent
LINEA = re.compile(r"- (https\S+) \| ([\d.,]+) € \| (.*?) \| (\S+)★ \| (.*?) \| (.*)$")


def ventas_num(txt):
    m = re.match(r"([\d.]+)(K?)\+?", txt.replace(" vendidos", "").replace(".", "", txt.count(".") if "K" not in txt else 0))
    if not m:
        return 0
    return int(float(m.group(1)) * (1000 if m.group(2) else 1))


def correr(lote):
    env = dict(os.environ)
    r = subprocess.run(["node", str(AQUI / "aliexpress_es.js"), *lote], capture_output=True, text=True, env=env, timeout=900)
    return r.stdout


def parsear(salida):
    filas, termino = [], None
    for l in salida.splitlines():
        if l.startswith("### "):
            termino = l[4:]
        elif l.strip() == "CAPTCHA" or l.startswith("ERR"):
            filas.append({"termino": termino, "error": l.strip()})
        else:
            m = LINEA.match(l)
            if m:
                url, precio, ventas, rating, titulo, tags = m.groups()
                precio = float(precio.replace(".", "").replace(",", ".")) if "," in precio else float(precio)
                try:
                    rating = float(rating)
                except ValueError:
                    rating = 0.0
                filas.append({"termino": termino, "url": url, "id": url.rsplit("/", 1)[1][:-5], "precio": precio,
                              "ventas": ventas_num(ventas), "rating": rating, "titulo": titulo, "etiquetas": tags})
    return filas


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("archivo", nargs="?")
    p.add_argument("--terminos", nargs="*")
    p.add_argument("--salida", required=True)
    p.add_argument("--workers", type=int, default=4)
    p.add_argument("--coste-min", type=float, default=3)
    p.add_argument("--coste-max", type=float, default=14)
    p.add_argument("--ventas-min", type=int, default=1000)
    p.add_argument("--rating-min", type=float, default=4.7)
    p.add_argument("--top", type=int, default=60)
    a = p.parse_args()
    terminos = list(a.terminos or [])
    if a.archivo:
        terminos += [t.strip() for t in Path(a.archivo).read_text(encoding="utf-8").splitlines() if t.strip() and not t.startswith("#")]
    if not terminos:
        sys.exit("Sin términos")
    lotes = [terminos[i::a.workers] for i in range(a.workers) if terminos[i::a.workers]]
    with ThreadPoolExecutor(len(lotes)) as ex:
        salidas = list(ex.map(correr, lotes))
    filas = [f for s in salidas for f in parsear(s)]
    errores = sorted({f["termino"] for f in filas if "error" in f})
    datos = [f for f in filas if "error" not in f]
    vistos, unicos = set(), []
    for f in sorted(datos, key=lambda x: -x["ventas"]):
        if f["id"] not in vistos:
            vistos.add(f["id"]); unicos.append(f)
    sel = [f for f in unicos if a.coste_min <= f["precio"] <= a.coste_max and f["ventas"] >= a.ventas_min and f["rating"] >= a.rating_min]
    out = Path(a.salida)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.with_suffix(".json").write_text(json.dumps(unicos, ensure_ascii=False), encoding="utf-8")
    md = [f"# Barrido AliExpress ES (envío desde España)\n",
          f"{len(terminos)} términos, {len(unicos)} fichas únicas, {len(sel)} con coste {a.coste_min:g}–{a.coste_max:g} €, {a.ventas_min}+ vendidos y ≥ {a.rating_min}★. "
          f"Términos con captcha o error (repetir): {', '.join(errores) if errores else 'ninguno'}. Solo datos de listado: ficha, plazo y stock sin verificar.\n",
          "| Coste € | Vendidos | ★ | Término | Título | ID |", "|---|---|---|---|---|---|"]
    for f in sel[:a.top]:
        md.append(f"| {f['precio']:.2f} | {f['ventas']} | {f['rating']} | {f['termino']} | {f['titulo'][:70]} | {f['id']} |")
    out.with_suffix(".md").write_text("\n".join(md) + "\n", encoding="utf-8")
    print("\n".join(md[:2] + md[2:12]))
    print(f"\nGuardado: {out.with_suffix('.md')} y {out.with_suffix('.json')}")


if __name__ == "__main__":
    main()
