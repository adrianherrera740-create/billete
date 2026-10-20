#!/usr/bin/env python3
"""Beneficio por pedido de un producto vendido en TikTok Shop España.

Uso:
  python3 margen_es.py --pvp 34.90 --coste 5.20 --envio 3.90 --dias-preparacion 1 [--tienda-nueva]

Todos los costes de proveedor van SIN IVA (el IVA soportado se deduce si el
proveedor factura con IVA). El PVP va CON IVA, como lo ve el cliente.
"""
import argparse
import json
import sys

IVA = 0.21


def calcular(a):
    base = a.pvp / (1 + IVA)
    comision = a.comision_tiktok if a.comision_tiktok is not None else (0.04 if a.tienda_nueva else 0.09)
    ingresos = base * (1 - a.devoluciones)
    costes = {
        "producto": a.coste,
        "envio_al_cliente": a.envio,
        "embalaje": a.embalaje,
        "comision_tiktok": base * comision,
        "pago_y_otros": base * a.otros,
        "afiliado": ingresos * a.afiliado,
        "devoluciones_logistica": a.devoluciones * a.envio,
    }
    beneficio = ingresos - sum(costes.values())
    margen = beneficio / base if base else 0.0
    cpa_maximo = beneficio  # gasto en anuncios por pedido que te deja a cero
    cpa_objetivo = beneficio - a.objetivo

    pvp_minimo = None
    for centimos in range(100, 50001, 10):
        p = centimos / 100
        b = p / (1 + IVA)
        ing = b * (1 - a.devoluciones)
        c = a.coste + a.envio + a.embalaje + b * comision + b * a.otros + ing * a.afiliado + a.devoluciones * a.envio
        if b and (ing - c) / b >= a.margen_minimo:
            pvp_minimo = p
            break

    avisos = []
    if a.dias_preparacion > 2:
        avisos.append("NO CUMPLE: TikTok Shop UE exige entregar al transportista en 2 días laborables.")
    if a.dias_entrega is not None and a.dias_entrega > 5:
        avisos.append("Entrega lenta (>5 días): más cancelaciones y peores reseñas.")
    if margen < a.margen_minimo:
        avisos.append(f"Margen por debajo del {a.margen_minimo:.0%}: no deja sitio para anuncios.")

    if a.dias_preparacion > 2:
        veredicto = "NO-GO"
    elif margen >= a.margen_minimo and cpa_objetivo > 0:
        veredicto = "GO"
    elif beneficio > 0:
        veredicto = "HOLD"
    else:
        veredicto = "NO-GO"

    r = lambda x: round(x, 2)
    return {
        "pvp_con_iva": a.pvp,
        "base_sin_iva": r(base),
        "comision_tiktok_aplicada": comision,
        "costes": {k: r(v) for k, v in costes.items()},
        "beneficio_por_pedido_sin_anuncios": r(beneficio),
        "margen_sobre_base": f"{margen:.1%}",
        "cpa_maximo_para_no_perder": r(cpa_maximo),
        "cpa_para_ganar_objetivo": r(cpa_objetivo),
        "pvp_minimo_para_margen": pvp_minimo,
        "dias_preparacion": a.dias_preparacion,
        "dias_entrega": a.dias_entrega,
        "veredicto": veredicto,
        "avisos": avisos,
    }


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--pvp", type=float, required=True, help="precio de venta con IVA")
    p.add_argument("--coste", type=float, required=True, help="coste del producto sin IVA")
    p.add_argument("--envio", type=float, required=True, help="envío al cliente sin IVA")
    p.add_argument("--dias-preparacion", type=float, required=True, help="días laborables hasta entregarlo al transportista")
    p.add_argument("--dias-entrega", type=float, default=None, help="días totales hasta el cliente")
    p.add_argument("--embalaje", type=float, default=0.30)
    p.add_argument("--tienda-nueva", action="store_true", help="comisión TikTok del 4% (60 días, tiendas nuevas UE)")
    p.add_argument("--comision-tiktok", type=float, default=None, help="sobrescribe la comisión (0.09 = 9%%)")
    p.add_argument("--otros", type=float, default=0.01, help="pago y otros cargos sobre la base")
    p.add_argument("--afiliado", type=float, default=0.15, help="comisión de creadores (0 si vendes con tus vídeos)")
    p.add_argument("--devoluciones", type=float, default=0.05)
    p.add_argument("--objetivo", type=float, default=3.0, help="beneficio mínimo por pedido tras anuncios")
    p.add_argument("--margen-minimo", type=float, default=0.25)
    a = p.parse_args()
    if a.pvp <= 0 or a.coste < 0 or a.envio < 0:
        print("PVP debe ser > 0 y los costes >= 0", file=sys.stderr)
        sys.exit(2)
    print(json.dumps(calcular(a), ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
