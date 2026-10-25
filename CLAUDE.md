# Contexto del proyecto: tienda dropshipping en TikTok Shop España

Resumen de lo ya decidido y construido en sesiones anteriores. Léelo antes de empezar.

## Objetivo

Lanzar la primera tienda de dropshipping en **TikTok Shop España**, vendiendo desde España, con presupuesto pequeño (**500 €/mes por defecto**). Mes 1 sin anuncios (muestras, microcreadores, 2–3 vídeos propios al día); mes 2 GMV Max solo en vídeos que ya venden.

## Producto actual: rodillo quitapelos

- Proveedor: [AliExpress ES 1005012948478747](https://es.aliexpress.com/item/1005012948478747.html), envío desde España.
- Coste 13,30 € · PVP 27,90 € · beneficio ~7,15 €/pedido con vídeos propios.
- Creativos 100 % IA (Higgsfield + Kling/Veo + CapCut): `creativos/rodillo-quitapelos-ia.md` (fotos, reglas, estructura de vídeo, 5 ángulos, prompts, calendario de 2 semanas).

## Reglas que no se negocian

- Nunca inventar precios, proveedores ni plazos: si no se verifica, "no verificado" y sin GO.
- Vídeos: activar "Contenido generado por IA"; mostrar solo lo que el producto hace de verdad; sin personas IA haciéndose pasar por clientes; música solo de la biblioteca comercial de TikTok.
- Productos excluidos: salud, suplementos, cosmética con promesas, electrónica con batería sin CE, juguetes, alimentación, marcas ajenas.
- TikTok Shop ES: comisión 9 % (4 % durante 60 días en tienda nueva con 5 productos activos en 15 días); entrega al transportista en 2 días laborables con seguimiento válido. Comprobar en Seller Center, cambia.

## Skills (`.claude/skills/`)

- `proveedor-es`: producto + proveedor exacto + margen (`scripts/margen_es.py`, `scripts/aliexpress_es.js`). BigBuy bloquea bots (Cloudflare); CJ necesita dominios permitidos en la red.
- `sealeap-tiktokshop-*` (MIT): selección de producto, unit economics, creadores, muestras, vídeos, GMV Max, logística, devoluciones, etc.
- `caveman*`, `cavecrew`, `investigate-first`, `lean-build`, `migration`, `safe-refactor`, `surgical-patch`, `verify-and-stop`: utilidades generales.

## Idioma

Responder siempre en español.
