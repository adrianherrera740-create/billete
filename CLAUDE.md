# Proyecto: tienda dropshipping en TikTok Shop España

Responde siempre en español. **Antes de nada lee `cerebro/condiciones.md`, `cerebro/estado.md` y `cerebro/aprendizajes.md`** (un hook los imprime al abrir la sesión). Todo trabajo pasa antes por las 13 condiciones de `cerebro/condiciones.md` (plan y luz verde, fases, un commit por cambio, cero secretos, verificar, lo generado por IA nunca nace verificado...); vienen del prompt maestro de La Nave de la persona (`cerebro/la-nave-prompt-maestro.md`). El cerebro (`cerebro/`) es la memoria del proyecto; al terminar, actualízalo (ver `cerebro/README.md`). `AGENTS.md` tiene las mismas instrucciones para otras herramientas.

## Objetivo
Primera tienda de dropshipping en TikTok Shop España, sin stock propio, 500 €/mes, sin comprar muestras, vídeos con IA. Mes 1 sin anuncios (vídeos propios y microcreadores); mes 2 GMV Max solo en vídeos que ya venden. Público: gamers, coches, streetwear (sin usar la marca de GTA).

## Reglas que no se negocian
- Nunca inventar precios, proveedores ni plazos: si no se verifica, "no verificado" y sin GO.
- Vídeos: etiqueta "Contenido generado por IA", solo lo que el producto hace de verdad, sin clientes IA, música de la biblioteca comercial.
- Excluidos: salud, suplementos, cosmética con promesas, electrónica con batería sin CE, juguetes, alimentación, marcas ajenas (ni GTA, Rockstar, Vice City, ni iPhone, AirPods...).
- TikTok Shop ES: comisión 9 % (4 % 60 días en tienda nueva), entrega al transportista en 2 días laborables con seguimiento válido. Comprobar en Seller Center.

## Skills y agentes
- `.claude/skills/proveedor-es` (margen, búsqueda en AliExpress ES, filtro de catálogos CSV) y `sealeap-tiktokshop-*` (selección de producto, márgenes, creadores, vídeos, GMV Max, logística, devoluciones).
- 33 agentes en `.claude/agents/`, organizados como una empresa (`cerebro/proceso.md`): `director`; dirección y finanzas (`ceo-estratega`, `cfo-finanzas`, `analista-escalado`, `pmo-operaciones`, `critico-escepticismo`); 6 departamentos con jefe y 3 especialistas; `auditor-calidad`, `gestor-skills` y `curador-cerebro`. Un subagente no puede lanzar a otros: solo el director.
- Proceso: puertas de decisión, ritmo semanal, criterios de parada y modelo de escalado en `cerebro/proceso.md`; tareas en `cerebro/backlog.md`; OKR, hipótesis, riesgos y KPI en `cerebro/`.
- Herramientas: `margen_es.py` (margen), `escalado.py` (¿escalar?), `barrido.py` (barrido de AliExpress en paralelo), `aliexpress_es.js`, `filtrar_catalogo.py`.
- Oficina visual: `tienda/panel-agentes.html` (artefacto privado). Resultados en `tienda/trabajo/ronda-<n>/`.
- Uso con Free Claude Code: `cerebro/USAR-EN-FCC.md`.
