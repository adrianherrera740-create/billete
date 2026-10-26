#!/usr/bin/env python3
"""Filtra el catálogo CSV de un proveedor (BigBuy, CJ, VidaXL, Syncee...) y ordena por beneficio por pedido.

Uso:
  python3 filtrar_catalogo.py catalogo.csv [--pvp-min 25] [--pvp-max 45] [--peso-max 1.0]
      [--marcas-excluidas "sony,nike,..."] [--palabras "coche,gaming"] [--top 40]
      [--col-coste COL] [--col-pvp COL] [--col-nombre COL] [--col-marca COL] [--col-peso COL] [--col-stock COL]
      [--sep ";"]

El coste del CSV debe ir SIN IVA (precio mayorista). Si el CSV no trae PVP recomendado, se prueba un PVP
objetivo de 4x el coste dentro del rango [pvp-min, pvp-max]. Usa margen_es.py (comisión 4 %, devoluciones
10 %, sin afiliado) y descarta lo que no llega a 25 % de margen. No sustituye comprobar precio de mercado.
"""
import argparse
import csv
import sys
from argparse import Namespace
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from margen_es import calcular  # noqa: E402

ALIAS = {
    "coste": ["wholesale", "wholesale_price", "precio_mayorista", "coste", "cost", "price_wholesale", "net_price", "precio_neto", "price"],
    "pvp": ["retail_price", "pvp", "rrp", "recommended_retail_price", "precio_recomendado", "precio_venta", "msrp", "retail"],
    "nombre": ["name", "nombre", "title", "titulo", "product_name"],
    "marca": ["brand", "marca", "manufacturer", "fabricante"],
    "peso": ["weight", "peso"],
    "stock": ["stock", "quantity", "qty", "inventory", "stock_disponible"],
}


def num(v):
    if v is None:
        return None
    v = str(v).strip().replace("€", "").replace(" ", "")
    if not v:
        return None
    if "," in v and "." in v:
        v = v.replace(".", "").replace(",", ".")
    else:
        v = v.replace(",", ".")
    try:
        return float(v)
    except ValueError:
        return None


def elige(cols, pedido, clave):
    if pedido:
        return pedido
    bajos = {c.lower().strip(): c for c in cols}
    for a in ALIAS[clave]:
        if a in bajos:
            return bajos[a]
    for c in cols:
        if any(a in c.lower() for a in ALIAS[clave]):
            return c
    return None


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("csv")
    p.add_argument("--sep", default=None)
    p.add_argument("--pvp-min", type=float, default=25)
    p.add_argument("--pvp-max", type=float, default=45)
    p.add_argument("--peso-max", type=float, default=1.0, help="kg; 0 desactiva")
    p.add_argument("--marcas-excluidas", default="")
    p.add_argument("--palabras", default="", help="solo nombres que contengan alguna (separadas por coma)")
    p.add_argument("--top", type=int, default=40)
    for k in ["coste", "pvp", "nombre", "marca", "peso", "stock"]:
        p.add_argument(f"--col-{k}")
    a = p.parse_args()

    raw = Path(a.csv).read_text(encoding="utf-8-sig", errors="replace")
    sep = a.sep or (";" if raw.split("\n", 1)[0].count(";") > raw.split("\n", 1)[0].count(",") else ",")
    filas = list(csv.DictReader(raw.splitlines(), delimiter=sep))
    if not filas:
        sys.exit("CSV vacío")
    cols = filas[0].keys()
    c = {k: elige(cols, getattr(a, f"col_{k}"), k) for k in ALIAS}
    print("Columnas usadas:", {k: v for k, v in c.items()}, file=sys.stderr)
    if not c["coste"] or not c["nombre"]:
        sys.exit("No encuentro la columna de coste o de nombre: indícalas con --col-coste y --col-nombre")

    excl = [m.strip().lower() for m in a.marcas_excluidas.split(",") if m.strip()]
    pal = [m.strip().lower() for m in a.palabras.split(",") if m.strip()]
    out, desc = [], {"sin coste": 0, "marca": 0, "peso": 0, "sin stock": 0, "palabras": 0, "fuera de rango": 0, "margen": 0}
    for f in filas:
        coste = num(f.get(c["coste"]))
        nombre = (f.get(c["nombre"]) or "").strip()
        marca = (f.get(c["marca"]) or "").strip() if c["marca"] else ""
        if coste is None or coste <= 0:
            desc["sin coste"] += 1; continue
        txt = (nombre + " " + marca).lower()
        if any(m in txt for m in excl):
            desc["marca"] += 1; continue
        if pal and not any(w in txt for w in pal):
            desc["palabras"] += 1; continue
        peso = num(f.get(c["peso"])) if c["peso"] else None
        if peso and peso > 100:  # gramos
            peso /= 1000
        if a.peso_max and peso is not None and peso > a.peso_max:
            desc["peso"] += 1; continue
        stock = num(f.get(c["stock"])) if c["stock"] else None
        if stock is not None and stock <= 0:
            desc["sin stock"] += 1; continue
        pvp = num(f.get(c["pvp"])) if c["pvp"] else None
        origen = "pvp del csv"
        if pvp is None:
            pvp, origen = min(max(coste * 4, a.pvp_min), a.pvp_max), "supuesto 4x coste"
        if not (a.pvp_min <= pvp <= a.pvp_max):
            desc["fuera de rango"] += 1; continue
        r = calcular(Namespace(pvp=pvp, coste=coste, envio=0.0, dias_preparacion=1, dias_entrega=3, embalaje=0.30,
                               tienda_nueva=True, comision_tiktok=None, otros=0.01, afiliado=0.0,
                               devoluciones=0.10, objetivo=3.0, margen_minimo=0.25))
        if float(r["margen_sobre_base"].strip("%")) < 25:
            desc["margen"] += 1; continue
        out.append((r["beneficio_por_pedido_sin_anuncios"], r["margen_sobre_base"], coste, pvp, origen, peso, nombre[:70], marca))
    out.sort(reverse=True)
    print(f"{len(filas)} filas; descartadas: {desc}; candidatas: {len(out)}\n", file=sys.stderr)
    print("beneficio | margen | coste | PVP | origen PVP | kg | nombre | marca")
    for o in out[: a.top]:
        print(" | ".join(str(x) for x in o))


if __name__ == "__main__":
    main()
