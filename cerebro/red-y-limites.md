# Qué se puede hacer desde cada entorno (actualizado 27/10/2026, ronda 13)

## Entorno en la nube de Claude Code (donde se ha trabajado hasta ahora)
- Solo responde AliExpress ES. Búsqueda con `.claude/skills/proveedor-es/scripts/aliexpress_es.js "término" ...` (filtro de envío desde España, ordenado por ventas). Se puede barrer en masa: 4 procesos en paralelo con ~12 términos cada uno, sin captcha casi nunca. Salida: `- URL | precio | vendidos | estrellas | título | etiquetas`.
- Las fichas de producto dan verificación anti-bot y los dominios de imagen (`ae-pic-a1.aliexpress-media.com`, `ae01.alicdn.com`) están bloqueados: stock, plazo, origen real, contenido exacto y fotos NO se pueden leer.
- CJ Dropshipping: `cjdropshipping.com` responde pero redirige a `frontend.cjdropshipping.com` (bloqueado). BigBuy: 403 (Cloudflare). VidaXL, Spocket, Syncee, DSers, Zendrop, Printful, Printify, Gelato, Banggood, PcComponentes, Amazon.es, eBay.es: sin acceso.
- FastMoss da 429. Sin datos de ventas de TikTok Shop ES. Google Trends no devuelve nada.
- WebSearch funciona (resúmenes); WebFetch falla con DNS en muchos dominios.
- Un agente no puede lanzar a otros; solo la sesión principal (director).
- Límite de uso de la cuenta: salta con rondas de 25+ agentes. Reanudar con SendMessage.

## Detalle por dominio (ronda 13, 27/10/2026)
- DNS no resuelve (WebFetch falla): printful.com, gelato.com, printify.com, seller-es.tiktok.com, seller.tiktokshop.com y, segun el ultimo intento, las rutas internas de Seller Center. Sin acceso = nada [OFICIAL].
- 403: bigbuy.eu (Cloudflare).
- Legible: cjdropshipping.com (sin www): /service-fee, /integrations/tiktok-shop, /user-agreement, /privacyPolicy, portada, /customPackaging. NO legibles (redirigen a login en frontend.cjdropshipping.com): /dispute-policy.html, /global-warehouses.
- No probados / sin lectura: globomatik.com, dmi.es, faire.com (se piden en la ampliacion).
- Que abre ampliar Network access (la persona, en la configuracion del entorno): bigbuy.eu, cjdropshipping.com, printful.com, gelato.com, printify.com, seller-es.tiktok.com, seller.tiktokshop.com, globomatik.com, dmi.es, faire.com. Abriria leer ayuda oficial de comisiones, plazo y alta, y catalogos. NO abre: cuentas con login (CJ global-warehouses), FastMoss (429), fichas de AliExpress (anti-bot), ni precios de TikTok Shop ES.
- Un WebSearch NO es lectura: no se puede marcar [OFICIAL].

## Entorno local de la persona (por ejemplo con Free Claude Code)
Ver `USAR-EN-FCC.md`. No verificado: si la red local alcanza fichas de AliExpress, CJ o BigBuy. Si es así, el barrido y la comprobación de proveedores mejoran mucho.

## Qué sirve para estar seguro de que un proveedor existe
Doble comprobación independiente (dos búsquedas con términos distintos y cruce de IDs) + catálogo CSV del proveedor (`filtrar_catalogo.py`) + la persona abre la ficha.
