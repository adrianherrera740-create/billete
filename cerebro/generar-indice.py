#!/usr/bin/env python3
"""Genera cerebro/00-inicio.md: índice con enlaces [[wiki]] para Obsidian.

Uso (desde la raíz del repo): python3 cerebro/generar-indice.py
Lo ejecuta `curador-cerebro` al final de cada ronda. Los agentes no necesitan Obsidian: leen los mismos archivos.
"""
from pathlib import Path
import datetime

raiz = Path(__file__).resolve().parent.parent
notas = [
    ("estado", "Dónde estamos y qué sigue"), ("aprendizajes", "Reglas que ya nos costaron caras"),
    ("proceso", "Cómo funciona la empresa: puertas, ritmo, escalado"), ("backlog", "Tareas"),
    ("okrs", "Objetivos"), ("hipotesis", "Hipótesis a probar"), ("riesgos", "Registro de riesgos"),
    ("kpis", "Números"), ("productos", "Todo producto evaluado"), ("decisiones", "Registro de decisiones"),
    ("usuario", "Cómo trabaja la persona"), ("red-y-limites", "Qué se puede hacer desde cada entorno"),
]
l = ["---", "tags: [indice]", f"actualizado: {datetime.date.today().isoformat()}", "---", "",
     "# Cerebro: inicio", "", "Índice generado con `python3 cerebro/generar-indice.py`. Abre la carpeta del repo como bóveda en Obsidian (ver [[cerebro/USAR-CON-OBSIDIAN]]).", "",
     "## Notas del cerebro"]
for n, d in notas:
    if (raiz / "cerebro" / f"{n}.md").exists():
        l.append(f"- [[cerebro/{n}]] — {d}")
l += ["", "## Diario"]
for f in sorted((raiz / "cerebro" / "diario").glob("*.md"), reverse=True):
    l.append(f"- [[cerebro/diario/{f.stem}]]")
l += ["", "## Informes por ronda"]
for r in sorted((raiz / "tienda" / "trabajo").glob("ronda-*"), key=lambda p: int(p.name.split("-")[1])):
    l.append(f"### {r.name}")
    for f in sorted(r.rglob("*.md")):
        l.append(f"- [[{f.relative_to(raiz).with_suffix('').as_posix()}]]")
l += ["", "## Otros informes"]
for f in sorted((raiz / "tienda" / "trabajo").glob("*/*.md")):
    l.append(f"- [[{f.relative_to(raiz).with_suffix('').as_posix()}]]")
for f in sorted((raiz / "creativos").glob("*.md")):
    l.append(f"- [[{f.relative_to(raiz).with_suffix('').as_posix()}]]")
(raiz / "cerebro" / "00-inicio.md").write_text("\n".join(l) + "\n", encoding="utf-8")
print("cerebro/00-inicio.md generado")
