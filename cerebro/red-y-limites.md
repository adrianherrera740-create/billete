# Qué se puede hacer desde cada entorno (26/10/2026)

## Entorno en la nube de Claude Code (donde se ha trabajado hasta ahora)
- Solo responde AliExpress ES. Búsqueda con `.claude/skills/proveedor-es/scripts/aliexpress_es.js "término" ...` (filtro de envío desde España, ordenado por ventas). Se puede barrer en masa: 4 procesos en paralelo con ~12 términos cada uno, sin captcha casi nunca. Salida: `- URL | precio | vendidos | estrellas | título | etiquetas`.
- Las fichas de producto dan verificación anti-bot y los dominios de imagen (`ae-pic-a1.aliexpress-media.com`, `ae01.alicdn.com`) están bloqueados: stock, plazo, origen real, contenido exacto y fotos NO se pueden leer.
- CJ Dropshipping: `cjdropshipping.com` responde pero redirige a `frontend.cjdropshipping.com` (bloqueado). BigBuy: 403 (Cloudflare). VidaXL, Spocket, Syncee, DSers, Zendrop, Printful, Printify, Gelato, Banggood, PcComponentes, Amazon.es, eBay.es: sin acceso.
- FastMoss da 429. Sin datos de ventas de TikTok Shop ES. Google Trends no devuelve nada.
- WebSearch funciona (resúmenes); WebFetch falla con DNS en muchos dominios.
- Un agente no puede lanzar a otros; solo la sesión principal (director).
- Límite de uso de la cuenta: salta con rondas de 25+ agentes. Reanudar con SendMessage.

## Entorno local de la persona (por ejemplo con Free Claude Code)
Ver `USAR-EN-FCC.md`. No verificado: si la red local alcanza fichas de AliExpress, CJ o BigBuy. Si es así, el barrido y la comprobación de proveedores mejoran mucho.

## Qué sirve para estar seguro de que un proveedor existe
Doble comprobación independiente (dos búsquedas con términos distintos y cruce de IDs) + catálogo CSV del proveedor (`filtrar_catalogo.py`) + la persona abre la ficha.
