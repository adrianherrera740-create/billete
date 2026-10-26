# Proyecto: tienda dropshipping en TikTok Shop España

Responde siempre en español. **Antes de nada lee `cerebro/estado.md` y `cerebro/aprendizajes.md`** (un hook los imprime al abrir la sesión). El cerebro (`cerebro/`) es la memoria del proyecto; al terminar, actualízalo (ver `cerebro/README.md`). `AGENTS.md` tiene las mismas instrucciones para otras herramientas.

## Objetivo
Primera tienda de dropshipping en TikTok Shop España, sin stock propio, 500 €/mes, sin comprar muestras, vídeos con IA. Mes 1 sin anuncios (vídeos propios y microcreadores); mes 2 GMV Max solo en vídeos que ya venden. Público: gamers, coches, streetwear (sin usar la marca de GTA).

## Reglas que no se negocian
- Nunca inventar precios, proveedores ni plazos: si no se verifica, "no verificado" y sin GO.
- Vídeos: etiqueta "Contenido generado por IA", solo lo que el producto hace de verdad, sin clientes IA, música de la biblioteca comercial.
- Excluidos: salud, suplementos, cosmética con promesas, electrónica con batería sin CE, juguetes, alimentación, marcas ajenas (ni GTA, Rockstar, Vice City, ni iPhone, AirPods...).
- TikTok Shop ES: comisión 9 % (4 % 60 días en tienda nueva), entrega al transportista en 2 días laborables con seguimiento válido. Comprobar en Seller Center.

## Skills y agentes
- `.claude/skills/proveedor-es` (margen, búsqueda en AliExpress ES, filtro de catálogos CSV) y `sealeap-tiktokshop-*` (selección de producto, márgenes, creadores, vídeos, GMV Max, logística, devoluciones).
- 28 agentes en `.claude/agents/`: `director` (orquesta por pasos: especialistas en paralelo → jefes → `auditor-calidad`), 6 jefes con 3 especialistas cada uno, `gestor-skills` y `curador-cerebro`. Un subagente no puede lanzar a otros: solo el director.
- Oficina visual: `tienda/panel-agentes.html` (artefacto privado). Resultados en `tienda/trabajo/ronda-<n>/`.
- Uso con Free Claude Code: `cerebro/USAR-EN-FCC.md`.
