#!/usr/bin/env python3
"""Modelo de viabilidad de escalado de un producto en TikTok Shop ES.

Uso:
  python3 escalado.py --pvp 24.90 --coste 7.09 [--devoluciones 0.15] [--cpa 5,8,12] [--presupuestos 500,1000,2000,5000]
      [--cpa-base 8] [--capacidad-dia 40] [--retraso-cobro-dias 14] [--fijos 0] [--afiliado 0]

Responde a: ¿gano dinero con anuncios?, ¿cuánto puedo gastar y vender al mes?, ¿qué capital queda atrapado?
y ¿escalo, aguanto o paro? Usa margen_es.calcular (comisión 4 % tienda nueva y 9 % después, devoluciones como
producto perdido). Todo son escenarios: CPA, devoluciones, capacidad y retraso de cobro son supuestos hasta medirlos.
"""
import argparse
import sys
from argparse import Namespace
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from margen_es import calcular  # noqa: E402


def unit(pvp, coste, dev, comision, afiliado):
    r = calcular(Namespace(pvp=pvp, coste=coste, envio=0.0, dias_preparacion=1, dias_entrega=3, embalaje=0.30,
                           tienda_nueva=False, comision_tiktok=comision, otros=0.01, afiliado=afiliado,
                           devoluciones=dev, objetivo=3.0, margen_minimo=0.25))
    return r["beneficio_por_pedido_sin_anuncios"]


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--pvp", type=float, required=True)
    p.add_argument("--coste", type=float, required=True, help="coste puesto en cliente, sin IVA si el proveedor factura con IVA")
    p.add_argument("--devoluciones", type=float, default=0.15)
    p.add_argument("--afiliado", type=float, default=0.0)
    p.add_argument("--cpa", default="5,8,12")
    p.add_argument("--presupuestos", default="500,1000,2000,5000")
    p.add_argument("--cpa-base", type=float, default=8.0)
    p.add_argument("--capacidad-dia", type=float, default=40.0, help="pedidos/día que aguanta el proveedor (supuesto)")
    p.add_argument("--retraso-cobro-dias", type=float, default=14.0, help="días entre pagar al proveedor y cobrar de TikTok (supuesto)")
    p.add_argument("--fijos", type=float, default=0.0, help="costes fijos al mes (herramientas, gestoría...)")
    a = p.parse_args()
    cpas = [float(x) for x in a.cpa.split(",")]
    pres = [float(x) for x in a.presupuestos.split(",")]

    b4 = unit(a.pvp, a.coste, a.devoluciones, 0.04, a.afiliado)
    b9 = unit(a.pvp, a.coste, a.devoluciones, 0.09, a.afiliado)
    print(f"# Escalado: PVP {a.pvp:.2f} € · coste {a.coste:.2f} € · devoluciones {a.devoluciones:.0%} · afiliado {a.afiliado:.0%}\n")
    print(f"Beneficio por pedido SIN anuncios: {b4:.2f} € (comisión 4 %, primeros 60 días) · {b9:.2f} € (comisión 9 %, después)")
    for nombre, b in (("4 %", b4), ("9 %", b9)):
        if b > 0:
            print(f"- Comisión {nombre}: CPA de equilibrio {b:.2f} € · ROAS de equilibrio {a.pvp / b:.2f}x · ROAS para ganar 3 €/pedido {a.pvp / (b - 3):.2f}x" if b > 3 else f"- Comisión {nombre}: CPA de equilibrio {b:.2f} €; no hay margen para ganar 3 €/pedido con anuncios")
        else:
            print(f"- Comisión {nombre}: pierde dinero antes de anuncios")
    print()
    for nombre, b in (("comisión 9 % (régimen normal)", b9), ("comisión 4 % (primeros 60 días)", b4)):
        print(f"## Resultado mensual con {nombre}\n")
        print("| Presupuesto de anuncios | CPA | Pedidos/mes | Pedidos/día | Beneficio/mes tras anuncios y fijos | Capital atrapado |")
        print("|---|---|---|---|---|---|")
        for pr in pres:
            for c in cpas:
                ped = pr / c
                dia = ped / 30
                ben = ped * (b - c) - a.fijos
                cap = dia * a.coste * a.retraso_cobro_dias
                aviso = " ⚠ supera capacidad" if dia > a.capacidad_dia else ""
                print(f"| {pr:.0f} € | {c:.0f} € | {ped:.0f} | {dia:.1f}{aviso} | {ben:+.0f} € | {cap:.0f} € |")
        print()
    # veredicto sobre el caso base
    margen_seg = (b9 - a.cpa_base) / b9 if b9 > 0 else -1
    ped_dia_500 = 500 / a.cpa_base / 30
    print("## Veredicto de escalado (caso base, comisión 9 %)\n")
    print(f"- CPA base {a.cpa_base:.0f} €: beneficio por pedido tras anuncios {b9 - a.cpa_base:+.2f} € · margen de seguridad {margen_seg:.0%} (mínimo 30 %)")
    checks = [
        ("Beneficio positivo tras anuncios con comisión 9 %", b9 - a.cpa_base > 0),
        ("Margen de seguridad ≥ 30 % sobre el CPA base", margen_seg >= 0.30),
        ("Aguanta al menos 4 € de CPA por encima del base sin perder (CPA base + 4 < CPA de equilibrio)", a.cpa_base + 4 < b9),
        (f"Capacidad del proveedor cubre 5.000 € de anuncios ({5000 / a.cpa_base / 30:.0f} pedidos/día frente a {a.capacidad_dia:.0f})", 5000 / a.cpa_base / 30 <= a.capacidad_dia),
    ]
    for t, ok in checks:
        print(f"- [{'x' if ok else ' '}] {t}")
    if b9 - a.cpa_base <= 0:
        v = "PARAR: no hay negocio con anuncios en el caso base. Solo orgánico o cambiar producto/precio/coste."
    elif all(ok for _, ok in checks):
        v = "ESCALAR por etapas (500 → 1.000 → 2.000 €) mientras el CPA real se mantenga por debajo del CPA base."
    elif margen_seg >= 0.15:
        v = "AGUANTAR en 500 €/mes y optimizar creativo y coste antes de escalar."
    else:
        v = "NO ESCALAR: el margen de seguridad es demasiado fino."
    print(f"\n**Veredicto: {v}**")
    print("\nSupuestos sin medir: CPA, devoluciones, capacidad del proveedor, retraso de cobro de TikTok y que la comisión de 4 % se aplique. Medirlos en el piloto (ver cerebro/proceso.md, puerta 2) y volver a ejecutar este modelo con datos reales.")


if __name__ == "__main__":
    main()
