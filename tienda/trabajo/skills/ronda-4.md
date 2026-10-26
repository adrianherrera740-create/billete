# Skills para la ronda 4 (búsqueda de producto, público GTA VI sin marca)

Fecha: 2026-10-26. Fuentes: CLAUDE.md, `.claude/skills/` (22 `sealeap-tiktokshop-*`, `proveedor-es`, utilidades), informes en `tienda/trabajo/ronda-2/` y `ronda-3/`, y SearchSkills/ListSkills (consultados hoy). No se ha instalado ni activado nada.

## 1. Trabajador -> skills ya instaladas

| Trabajador | Cargar | Para qué en esta ronda |
|---|---|---|
| investigador-tendencias | `sealeap-tiktokshop-trend-validation` | Tabla de evidencia, vida de la tendencia y estacionalidad (GTA VI sale el 19-11-2026 según ronda 2: pico y caída). Obliga a separar hecho de juicio. |
| | `sealeap-tiktokshop-content-product-fit` | Filtrar por "se demuestra en 3 s" y valor visible (coche, setup, streetwear). |
| | `sealeap-tiktokshop-product-selection` | Solo como lista de comprobación final de la idea; no sustituye a las dos anteriores. |
| buscador-proveedores | `proveedor-es` (+ `scripts/aliexpress_es.js`) | Listado AliExpress ES con filtro envío desde España. Ya funciona sin CAPTCHA (rondas 2-3); solo da listado, no ficha. |
| | `sealeap-tiktokshop-inventory-spikes` | Evaluar stock real frente a un pico de pedidos (10.000+ vendidos no garantiza unidades hoy). |
| verificador-fichas | `proveedor-es` | Reglas de qué cuenta como ficha verificada. |
| | `sealeap-tiktokshop-listing-localization` | Atributos, fotos reales frente a imagen IA, datos de fabricante/responsable UE que faltan. |
| | `sealeap-tiktokshop-returns-feedback` | Convertir reseñas de 1-2 estrellas en riesgo de devolución y en promesas que no se pueden hacer. |
| auditor-precios-mercado | `sealeap-tiktokshop-promotion-margin` | Efecto de cupones, envío gratis y campañas sobre el PVP que se compara con el mercado. |
| | `sealeap-tiktokshop-content-product-fit` | Comprobar si el diferencial (pack, longitud, diseño) es demostrable; los precios en sí no los da ninguna skill. |
| calculador-escenarios | `sealeap-tiktokshop-unit-economics` (`scripts/unit_economics.py`, offline) | Contribución por SKU con comisión, devoluciones, afiliado y anuncio. Contrastar con `proveedor-es/scripts/margen_es.py` (ronda 3 usó este). |
| | `sealeap-tiktokshop-affiliate-commissions` | Escenario de comisión de afiliado (en ronda 3, con 15 % hacen falta PVP de 38-47 EUR). |
| | `sealeap-tiktokshop-promotion-margin` | Apilado de cupones sobre el margen. |
| revisor-normativa-ue | `sealeap-tiktokshop-listing-localization` | Campos de fabricante/responsable UE y avisos en ficha. |
| | `sealeap-tiktokshop-commercial-audio-clearance` | Solo si algún vídeo de prueba usa música (biblioteca comercial). |
| | `sealeap-tiktokshop-fulfillment-service` | Plazo 2 días laborables y tracking válido: bloquea GO logístico mientras no haya plazo escrito (ronda 3). |

Para todos: `investigate-first` (diagnosticar un bloqueo antes de probar variantes) y `verify-and-stop` (cerrar con prueba y no ampliar). El resto de skills `sealeap-*` (live, creadores, muestras, GMV Max, calendario, audio, enlaces) no aplican a la búsqueda de producto; no cargarlas.

Limitación de las `sealeap-*`: son marcos de método (licencia MIT, `sealeap-NOTICE`), no fuentes de datos. No aportan ventas ni precios de TikTok Shop ES.

## 2. Huecos reales (rondas 2-3)

| # | Hueco | Evidencia | Bloquea |
|---|---|---|---|
| H1 | Ventas, precios y saturación en TikTok Shop ES | FastMoss 429; EchoTik, Kalodata y Centro de Tendencias no consultados (ronda 2 investigador-tendencias; repetido en ronda 3). Ningún candidato tiene dato de demanda. | investigador-tendencias, auditor-precios-mercado, GO |
| H2 | Fichas de AliExpress abiertas (variantes, plazo, stock, medidas, CE) y fotos reales | Anti-bot en ficha; `ae-pic-a1.aliexpress-media.com` y `ae01.alicdn.com` rechazados (rondas 2-3, CLAUDE.md). Solo se lee el listado. | verificador-fichas, buscador-proveedores, revisor-normativa-ue, logística |
| H3 | Precio de mercado en Amazon.es, PcComponentes, eBay.es, Leroy Merlin, Carrefour | WebFetch ENOTFOUND (rondas 2-3); precios sacados de extractos de WebSearch, con fecha a veces no visible. | auditor-precios-mercado |
| H4 | Reseñas independientes con foto | Ronda 3: búsquedas devuelven fichas de tienda, no reseñas; imágenes bloqueadas. | verificador-fichas |
| H5 | Texto oficial UE/TikTok (DOUE, Seller Center) | Ronda 2: todo "no verificado en texto oficial"; solo fuentes secundarias. | revisor-normativa-ue |
| H6 | Comisión de categoría, plazo de preparación y transportista aceptado | Depende de Seller Center y del vendedor; no accesible desde la red. | calculador-escenarios, logística |

Observación: H1-H3 y H6 son problemas de acceso a datos o de red, no de método. Ninguna skill instalable arregla un 429, un DNS bloqueado ni el anti-bot. H5 se arregla con WebFetch a EUR-Lex si el dominio está permitido (no probado: no verificado).

## 3. Búsqueda de skills

- ListSkills (2026-10-26): devuelve solo skills genéricas de la cuenta (docs, xlsx, pdf, pptx, docx, google-workspace, morning, import-memory, skill-creator, lead-research-assistant). Ninguna cubre H1-H6.
- SearchSkills con 11 palabras clave en 3 consultas (tiktok shop, ecommerce, product research, trend analysis, reviews, web scraping, amazon, market research, spanish copywriting, EU compliance, price comparison): 0 resultados cada una.
- SuggestSkills: no disponible.

Propuestas: 0. No hay ninguna skill que leer entera ni cuyo riesgo evaluar. No propongo una skill de scraping general "por si acaso": aunque existiera, saltarse un 429 o un anti-bot viola los términos de las plataformas y no lo permite el entorno, y la regla de CLAUDE.md es no inventar datos.

## 4. Recomendación

Lo que desbloquea la ronda no es una skill, es una decisión del usuario (no tomada por mí):
1. Permitir en la red `ae-pic-a1.aliexpress-media.com`, `ae01.alicdn.com` y, si procede, `amazon.es`, `pccomponentes.com`, `ebay.es` (cierra H2, H3, H4 parcialmente). Sin esto, ningún candidato pasa a GO.
2. Aportar a mano capturas del Centro de Tendencias de TikTok Shop ES o de FastMoss/Kalodata con su sesión (cierra H1); si no, todo queda "sin datos de ventas" y sin GO.
3. Dar el plazo de preparación y el transportista por escrito del vendedor (H6), o comprar muestra (el usuario dijo que no).
4. Mientras tanto, cada trabajador con las skills de la sección 1 y marcando "no verificado" lo que dependa de H1-H6.

Pendiente: si el usuario habilita nuevas fuentes, repetir SearchSkills con el hueco concreto.
