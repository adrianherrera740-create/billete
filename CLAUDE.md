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

## Segundo candidato: set de cepillos de limpieza

- [AliExpress ES 1005013107637317](https://es.aliexpress.com/item/1005013107637317.html) · 9,29 € · PVP 24,90 € (pack de 2: 39,90 €). Beneficio ~8,93 € por set / ~10,80 € por pack de 2. Plazos sin verificar.
- Creativos: `creativos/set-cepillos-ia.md`. Pendiente: muestra.

## Agentes (`.claude/agents/`)

27 agentes. `gestor-skills` asigna las skills justas a cada trabajador antes de cada fase y propone (sin instalar) las que falten. `director` orquesta por fases (tres pasos: especialistas en paralelo, jefes consolidan, `auditor-calidad` aprueba la puerta). 6 jefes: `buscador-producto`, `analista-margenes`, `operaciones-cumplimiento`, `creativos-ia`, `creadores-muestras`, `crecimiento-anuncios`, cada uno con 3 especialistas (tabla en `director.md`). Los especialistas escriben en `tienda/trabajo/<carpeta>/`. Un subagente no puede lanzar a otros: solo el director (sesión principal) lanza agentes. Panel: `tienda/panel-agentes.html`.

## Bloqueos conocidos

- Sin fotos reales del set de cepillos: la red rechaza `ae-pic-a1.aliexpress-media.com` y `ae01.alicdn.com`, y la ficha pide verificación anti-bot. El usuario no quiere comprar muestra: hay que sacar fotos de reseñas o permitir esos dominios.
- Sin datos de ventas de TikTok Shop ES (FastMoss 429); BigBuy 403.

## Estado de la búsqueda de producto (26/10/2026)

- Set de cepillos: HOLD (sin demanda ni precio de mercado demostrados). Ver `tienda/trabajo/` y `tienda/trabajo/calidad/fase-1.md`.
- Ronda 2 (tirón GTA VI sin marca; nunca usar GTA, Rockstar, Vice City ni "estilo GTA"): lámpara de atardecer, alfombrilla, soporte de mandos y letrero neón descartados; cuerda de neón RGB en HOLD (PVP defendible ≈ 25 € frente a 30 € necesarios para 25 % de margen). Ver `tienda/trabajo/ronda-2/`.
- Ronda 3 (ideas nuevas): mejor candidato hasta ahora = funda de volante deportiva de polipiel (AliExpress ES 1005008219047604 a 13,87 €; ojo: 1005008315429915 a 9,99 € es SOLO para volante en forma D; PVP 29,90–34,90 €; referencia de mercado 38,96 € (NO VERIFICADA: el auditor lee 12–28 € en tiendas españolas y hasta 34–60 € en eBay con piel perforada)). Condicional: plazos, stock, tallas y demanda en TikTok Shop ES sin verificar. Ver `tienda/trabajo/ronda-3/`.
- El script `margen_es.py`: `--afiliado` es una fracción (0.15 = 15 %); `--devoluciones` existe; `--help` falla por un `%` sin escapar (línea 88).

- Ronda 5 (estudio a fondo de la funda de volante, 14 trabajadores; ver `tienda/trabajo/ronda-5/` y `tienda/trabajo/calidad/ronda-5-fase-1.md`): HOLD. Puntúa 25/40 (umbral de ganador 32; el organizador de asiento 28/40). Precio de mercado defendible ≈ 22–25 €; para volante redondo el mejor coste visible es 10,85 € (BC Corona 1005007569228985), que necesita ≈ 27 € para 25 % de margen. Calidad bloquea la fase 2 (campaña) hasta tener por escrito: funda redonda con tallas en cm, preparación ≤ 1 día laborable, GPSR y stock, y coste ≤ ~10 € con PVP ≤ 24,90 €. Alta fiscal: ningún informe la cubre.

- Ronda 6 (high ticket 120–400 €): NO recomendable para una tienda nueva con 500 €/mes. Ningún producto >100 € visible en TikTok Shop ES; los genéricos ya están por debajo de 120 €; casi todo lo que vende lleva marca; vender electrónica a hogares exige alta RAEE con representante autorizado; la devolución de un voluminoso borra el margen de decenas de pedidos. Ver `tienda/trabajo/ronda-6/`.
- Ronda 7 (otros canales, `tienda/trabajo/ronda-7/`): ranking sobre 40 = productos digitales 33, afiliación Amazon/tiendas ES 31, TikTok Shop afiliado 30, impresión bajo demanda 29, tienda propia con envío largo 23, reventa 22, Miravia 21, eBay.es 20. Perfil de winner: coste puesto en cliente ≤ ~7 € con PVP ≥ 29,90 € (PVP/coste ≥ 4–5). Con envío desde almacén español (obligatorio por la regla de 2 días de TikTok Shop) ese perfil no se ha encontrado. Alta fiscal: ningún informe la cubre; pedir cita en gestoría antes de cobrar de forma recurrente.

- Red del entorno (26/10/2026): solo AliExpress ES responde; `cjdropshipping.com` responde pero redirige a `frontend.cjdropshipping.com` (bloqueado); BigBuy da 403 (Cloudflare); VidaXL, Spocket, Syncee, DSers, Zendrop, Printful, Printify, Gelato y otros: sin acceso. Para otros proveedores: exportar el catálogo CSV desde su panel y usar `.claude/skills/proveedor-es/scripts/filtrar_catalogo.py`, o permitir los dominios en los ajustes del entorno.

## Decisión del usuario (26/10/2026)

Va a vender **sin stock (dropshipping desde España)** y pide que el equipo decida el producto. Elegido: set de 3 cepillos de detalle para el coche, AliExpress ES [1005013072547921](https://es.aliexpress.com/item/1005013072547921.html) (7,09 €, 10.000+ vendidos, 4,9★); reserva: 3 cepillos de grietas para coche y cocina [1005013071463578](https://es.aliexpress.com/item/1005013071463578.html) (7,49 €, 20.000+, 4,9★). PVP de partida 19,90 € (≈ 6,1 € por pedido con comisión 4 % y devoluciones 10 %, sin anuncios; con comisión 9 %, menos). Sin verificar: ficha abierta, plazo real, stock, precio de mercado, demanda en TikTok Shop ES, GPSR y alta fiscal. No ha pasado por el control de calidad.
