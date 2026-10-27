# Modelo A: dropshipping con stock UE, contraste con webs oficiales (ronda 13)
Fecha de consulta: 27/10/2026 (fecha de publicación: no visible en ninguna página leída). Agente: buscador-proveedores.

Etiquetas: [OFICIAL url] = leído con WebFetch en la web del proveedor. [BLOG] = solo resumen de WebSearch o tercero. [NO VERIFICADO] = sin dato.

## 0. Qué se pudo abrir y qué no (honestidad de método)
| Dominio | Resultado WebFetch |
|---|---|
| cjdropshipping.com (sin www): home, /service-fee, /integrations/tiktok-shop, /customPackaging, /user-agreement, /privacyPolicy, /help-center | Abre y se leyó |
| cjdropshipping.com: /global-warehouses, /calculation.html (envío y plazos), /dispute-policy.html (devoluciones), /warehouses.html | Redirige al muro de login/validación; frontend.cjdropshipping.com da DNS error. No leído |
| developers.cjdropshipping.cn y developers.cjdropshipping.com (API) | DNS error. No leído |
| www.cjdropshipping.com (blog) | DNS error |
| bigbuy.eu / www.bigbuy.eu (home, /dropshipping, /what-is-bigbuy, blog) | 403 Cloudflare en las 4 URLs. No leído |
| api.bigbuy.eu | DNS error |
| spocket.co, help.spocket.co | DNS error |
| syncee.com, syncee.io | DNS error |
| eprolo.com / www.eprolo.com | DNS error |
| dropi.co, dropi.es | DNS error |
| apps.shopify.com, wordpress.org (conectores BigBuy), atlassian (Fruugo), andreybusiness.com | DNS error |

Consecuencia: solo CJ tiene datos [OFICIAL]. BigBuy, Spocket, Syncee, Eprolo y Dropi quedan en [BLOG] o [NO VERIFICADO]. Esto es una limitación del entorno de nube (ver cerebro/red-y-limites.md), no una prueba de que esos proveedores no existan o no sirvan.

## 1. Fichas por proveedor

### 1.1 CJ Dropshipping
- Web oficial: https://cjdropshipping.com [OFICIAL https://cjdropshipping.com/]
- Qué vende: catálogo generalista de dropshipping, marca propia (embalaje), impresión bajo demanda, ODM [OFICIAL https://cjdropshipping.com/]. Colección "TikTok Hits" [OFICIAL https://cjdropshipping.com/integrations/tiktok-shop].
- Modelo: dropshipping + servicio de envío de stock propio al almacén de CJ + marca propia/POD.
- Cuota o pedido mínimo: la página de tarifas no menciona suscripción ni comisión por venta, solo tarifas de servicio (envío, almacenamiento, inspección, etiquetado, salida) [OFICIAL https://cjdropshipping.com/service-fee]. Importante: las tablas (MOQ de 10 piezas por variante y 100 en total) son para enviar TU propio stock desde China a un almacén en el extranjero, no para el dropshipping normal [OFICIAL https://cjdropshipping.com/service-fee]. El precio unitario del producto de dropshipping no está en ninguna página leída [NO VERIFICADO].
- Almacén y plazo a España:
  - Almacenes citados en las tarifas: China, EE. UU., Polonia, Alemania y Reino Unido [OFICIAL https://cjdropshipping.com/service-fee]. La home dice "10+ Global Warehouses" [OFICIAL https://cjdropshipping.com/].
  - España no aparece como almacén en ninguna página leída. Lista completa de almacenes y stock por producto: no leída (login) [NO VERIFICADO].
  - Plazo de reposición de stock del vendedor CN a PL: aéreo 12-15 días, marítimo 45-60; CN a DE: aéreo 13-18, marítimo 60-65 [OFICIAL https://cjdropshipping.com/service-fee]. Esto NO es el plazo al cliente.
  - Plazo al cliente final: la página TikTok anuncia envío express 2-5 días o económico 10-20 días, sin decir desde qué almacén ni a qué país [OFICIAL https://cjdropshipping.com/integrations/tiktok-shop]. Plazo concreto a España desde DE/PL: [NO VERIFICADO] (la calculadora /calculation.html está tras login).
  - Tarifa de salida (preparación y envío local desde almacén propio de CJ para stock que tú envías): PL 0,5 kg 1,01 USD, 1-3 kg 1,26 USD; DE 0,5 kg 0,34 USD, 1-3 kg 0,44 USD. Almacenaje gratis 0-30 días; de 30 a 60 días PL 0,40 y DE 0,44 USD/CBM/día [OFICIAL https://cjdropshipping.com/service-fee]. Estas tarifas aplican al modelo de stock propio en almacén CJ, no al dropshipping estándar.
- Integración TikTok Shop ES: hay página de integración con TikTok Shop; se autoriza desde el Seller Center, los pedidos se sincronizan, hay inventario y precios en tiempo real [OFICIAL https://cjdropshipping.com/integrations/tiktok-shop]. La página NO indica si España o Europa están admitidos [OFICIAL mismo URL, ausencia]. La home lista TikTok Shop entre las integraciones [OFICIAL https://cjdropshipping.com/]. Una búsqueda mostró que el blog de CJ se declara socio oficial de TikTok Shop y que sus ejemplos son de EE. UU. [BLOG, resumen de WebSearch]. Autorización TikTok Shop UE: hay que usar la cuenta principal del vendedor, no una subcuenta [BLOG, ayuda de Lengow vía WebSearch].
- Alta y fiscalidad: el acuerdo de usuario no exige empresa ni identificación fiscal, solo capacidad civil y datos veraces [OFICIAL https://cjdropshipping.com/user-agreement]. La política de privacidad pide nombre, dirección y teléfono, además de datos de pago [OFICIAL https://cjdropshipping.com/privacyPolicy]. Eso es sobre CJ; TikTok Shop sí tiene sus propios requisitos para el vendedor (ver reglas-tiktok-shop-oficial.md).
- Devoluciones: existe la política "Refund, Resend and Returns" en /dispute-policy.html [OFICIAL https://cjdropshipping.com/], contenido NO leído (login) [NO VERIFICADO]. Derecho de desistimiento de 14 días del cliente en UE lo asume el vendedor frente al consumidor; cómo devuelve CJ: [NO VERIFICADO].
- Marca: el acuerdo no tiene política específica de marcas; el usuario asume el riesgo de que productos transfronterizos infrinjan propiedad intelectual en su país, renuncia a reclamar a CJ, y debe indemnizar a CJ si infringe [OFICIAL https://cjdropshipping.com/user-agreement]. Traducción: el filtro de marcas ajenas lo tenemos que hacer nosotros, CJ no nos protege.
- Marca propia: embalaje propio desde 1 unidad, más de 500 opciones, sin precios publicados, no todos los productos son compatibles [OFICIAL https://cjdropshipping.com/customPackaging].
- CSV/API: la home enlaza a una API de desarrolladores [OFICIAL https://cjdropshipping.com/]; exportación CSV no se menciona en la home [OFICIAL ausencia]. Según guías de plugins, la clave API se genera en la cuenta (Authorization > API Key) y existe el endpoint "Product List v2"; el token permite aprox. 1 llamada por segundo [BLOG, WebSearch sobre docs de CJ, VillaTheme y paquete de terceros]. Si API gratis: [NO VERIFICADO].
- Categorías gaming/coche/streetwear: no se pudo ver el árbol de categorías [NO VERIFICADO]. Hay que mirarlo ya dentro de la cuenta.
- Señales de alarma: plazo 10-20 días en la opción económica choca con el requisito de entrega al transportista en 2 días laborables solo si el stock está en China (el plazo de entrega al cliente no es el mismo que el de entrega al transportista, comprobar en Seller Center); sin garantía de marca; reseñas Trustpilot dudosas (ronda 12, [BLOG]); sede legal no indicada en la política de privacidad (marco legal UK) [OFICIAL https://cjdropshipping.com/privacyPolicy].
- Siguiente paso de 0 €: crear cuenta gratuita en cjdropshipping.com (no pide NIF/CIF según el acuerdo), abrir /global-warehouses y filtrar por almacén Alemania o Polonia, anotar 5 SKU de gaming/coche/streetwear con stock DE/PL, precio y plazo a ES en la calculadora; generar API key y descargar lista de productos para filtrar_catalogo.py.

### 1.2 BigBuy
- Web oficial: https://www.bigbuy.eu. Las 4 URLs probadas devuelven 403 Cloudflare. NADA de lo siguiente es [OFICIAL].
- Qué vende: proveedor B2B de dropshipping y mayorista generalista, catálogo de más de 400.000 productos, gestiona almacenaje, empaquetado y envío [BLOG, Trendtrack vía WebSearch].
- Modelo: dropshipping/mayorista, orientado a venta transfronteriza dentro de la UE [BLOG, Minea vía WebSearch].
- Cuota: suscripción 69-99 €/mes + 90 € de alta + coste de conectores [BLOG, Trendtrack, competidor comercial]. Ronda 12 citaba 120 €/mes (Copyfy) [BLOG]. Cifra oficial: [NO VERIFICADO].
- Almacén y plazo a España: empresa de origen español, plazos 24-72 h citados en ronda 12 [BLOG]. Almacén y plazo reales [NO VERIFICADO].
- Integración TikTok Shop ES: no hay ninguna fuente. Los conectores confirmados por resultados de búsqueda son WooCommerce (plugin propio), Shopify (app), Shopware y la plataforma propia MIP que publica catálogo en software de ecommerce y marketplaces europeos [BLOG, listados de plugins y Emprendedores vía WebSearch]. TikTok Shop ES: [NO VERIFICADO].
- Alta y fiscalidad: ninguna fuente dice si exige CIF/alta de autónomo [NO VERIFICADO]. Los mayoristas B2B en España suelen pedir alta fiscal, pero eso es una suposición, no un dato. Hay que preguntarlo.
- Devoluciones y marca: [NO VERIFICADO].
- CSV/feed: BigBuy ofrece API y, según un plugin de Shopware, fuentes CSV/XML [BLOG, listado Shopware vía WebSearch]. Cómo descargar el catálogo CSV: la Academy o el panel de la plataforma MIP; el procedimiento exacto [NO VERIFICADO]. Probable que exija cuenta de pago activa [NO VERIFICADO].
- Categorías gaming/coche/streetwear: [NO VERIFICADO].
- Señales de alarma: problemas de sincronización de stock y conector (Minea y Trendtrack, [BLOG]); app de Shopify con valoración dispar según idioma (4,1 de 5 en alemán, 1,2 en finés) [BLOG]; la cuota del primer mes se come parte de los 500 € de capital.
- Siguiente paso de 0 €: desde un navegador personal (no la nube), abrir bigbuy.eu, mirar planes y registrarse sin pagar si lo permite; escribir al soporte con tres preguntas: ¿piden CIF o autónomo?, ¿hay CSV/feed del catálogo con la cuenta gratuita o de prueba?, ¿hay integración con TikTok Shop ES o hay que subir CSV?

### 1.3 Spocket
- Web oficial: spocket.co. DNS error en 3 URLs. Todo [BLOG] o [NO VERIFICADO].
- Datos de ronda 12 (sin contrastar): Starter 39,99 $/mes, Pro 59,99 $, Empire 99,99 $, Unicorn 299 $ [BLOG]; quejas de cobros tras cancelar (Trustpilot, [BLOG]). Almacenes UE, plazos a España, integración TikTok ES, alta fiscal, devoluciones, marca, CSV: [NO VERIFICADO].
- Siguiente paso de 0 €: abrir spocket.co y su centro de ayuda desde un navegador personal; confirmar si hay TikTok Shop y si hay prueba gratuita. No pagar sin esas respuestas.

### 1.4 Syncee
- Web oficial: syncee.com. DNS error. Una búsqueda devolvió páginas de comparación de Syncee que dicen tener un plan de 0 $ con acceso a proveedores y precios mayoristas [BLOG, marketing propio vía WebSearch, sin leer]. Exportación: describe una función de exportación automática para generar feeds, no prueba CSV libre en el plan gratuito [BLOG]. Integración TikTok Shop: no apareció [BLOG, ausencia]. El resto [NO VERIFICADO].
- Siguiente paso de 0 €: crear cuenta gratuita, navegar proveedores con envío desde la UE y ver si exportan CSV.

### 1.5 Eprolo
- Web oficial: eprolo.com. DNS error. Todo [NO VERIFICADO]; lo único que hay son datos de ronda 12 de fuentes autopromocionales [BLOG]. Sin evidencia nueva.
- Siguiente paso de 0 €: ninguno prioritario. Solo mirar si muestra almacén UE con stock por SKU.

### 1.6 Dropi (España)
- Web oficial: dropi.co y dropi.es dan DNS error. Un blog de terceros dice que Dropi opera en 12 países incluido España, con comisión 5 % que baja si se registra con un mentor, retiradas por SEPA en 3-7 días hábiles y mensajeros Correos Express, MRW, GLS y SEUR [BLOG, andreybusiness.com vía WebSearch, probable afiliación]. Ronda 12 daba comisión 2-5 % [BLOG]. Es contrareembolso, mal ajuste con TikTok Shop (pago en la plataforma). Apps de Shopify que lo conectan tienen valoración 2,0 sobre 5 [BLOG]. Competidor local mencionado: dropea España y Portugal [BLOG].
- Veredicto: descartado para TikTok Shop salvo prueba en contrario.

## 2. Tabla comparativa

| Proveedor | Cuota | Almacén UE | Plazo a España | TikTok Shop ES | Alta (NIF/CIF) | CSV/feed | Calidad de datos |
|---|---|---|---|---|---|---|---|
| CJ Dropshipping | Sin suscripción citada; tarifas de servicio solo para stock propio [OFICIAL] | DE y PL (tarifas); España no [OFICIAL] | Express 2-5 d, económico 10-20 d (origen no indicado) [OFICIAL]; a ES desde DE/PL [NO VERIFICADO] | Integración existe; ES/Europa no confirmada [OFICIAL] | No exige empresa ni ID fiscal en el acuerdo [OFICIAL] | API con clave; CSV [NO VERIFICADO] | Parcial [OFICIAL] |
| BigBuy | 69-99 €/mes + 90 € [BLOG] | Origen España [BLOG] | 24-72 h [BLOG] | Sin fuente [NO VERIFICADO] | [NO VERIFICADO] | API, CSV/XML probable [BLOG] | Solo [BLOG] (web 403) |
| Spocket | 39,99-299 $/mes [BLOG] | Proveedores UE [BLOG] | [NO VERIFICADO] | [NO VERIFICADO] | [NO VERIFICADO] | [NO VERIFICADO] | Solo [BLOG] |
| Syncee | Plan 0 $ anunciado [BLOG] | Proveedores UE sin detalle [BLOG] | [NO VERIFICADO] | Sin fuente | [NO VERIFICADO] | Feeds [BLOG] | Solo [BLOG] |
| Eprolo | [NO VERIFICADO] | [NO VERIFICADO] | [NO VERIFICADO] | [NO VERIFICADO] | [NO VERIFICADO] | [NO VERIFICADO] | Nada nuevo |
| Dropi ES | 2-5 % comisión [BLOG] | Mensajeros locales [BLOG] | [NO VERIFICADO] | Incompatible por contrareembolso | [NO VERIFICADO] | [NO VERIFICADO] | Solo [BLOG], afiliado |

## 3. Cómo descargar el catálogo CSV gratis y pasarlo por filtrar_catalogo.py
El script espera columnas tipo coste/wholesale/price, pvp/rrp, nombre/title, marca/brand, peso/weight, stock/quantity (alias en el propio script) y coste SIN IVA. Uso: `python3 -I .claude/skills/proveedor-es/scripts/filtrar_catalogo.py catalogo.csv --pvp-min 25 --pvp-max 45 --palabras "gaming,coche" --marcas-excluidas "..."`.
- CJ: no hay CSV oficial confirmado. Ruta probable: generar API key en la cuenta y llamar a "Product List v2" con un script propio que escriba CSV con las columnas del alias [BLOG para el endpoint y la clave; el CSV directo [NO VERIFICADO]]. Esto requiere que la persona o un entorno con acceso a developers.cjdropshipping.cn lo ejecute; la nube no lo alcanza.
- BigBuy: CSV/XML y API existen según terceros; descarga en el panel de la cuenta o Academy [BLOG]. No confirmado si es gratis. Paso: registrarse y preguntar a soporte.
- Syncee: exportación de feeds descrita en su marketing [BLOG]. No confirmado en plan gratis.
- Categorías gaming, coche, streetwear en cada proveedor: [NO VERIFICADO] en los cinco. Tampoco se debe dar por hecha la existencia de categorías de streetwear sin marca ajena.

## 4. Recomendación: los 2 con los que abrir cuenta ya
1. CJ Dropshipping. Único con datos oficiales: sin suscripción visible, alta sin documento fiscal según su acuerdo, integración TikTok Shop existente y almacenes DE/PL. Falta confirmar: que el conector admita vendedores de España, plazo real a España desde DE/PL y devoluciones. Abrir cuenta cuesta 0 € y permite ver warehouses y calculadora.
2. BigBuy. Mejor encaje geográfico (origen español, plazo corto) según terceros, pero con cuota de 69-120 €/mes que es una parte grande de 500 €. Abrir cuenta o pedir información sin pagar y exigir por escrito: alta fiscal, CSV gratuito y TikTok Shop. No pagar la cuota hasta tener un producto con margen verificado.
Los demás (Spocket, Syncee, Eprolo, Dropi) quedan en reserva sin datos oficiales. Sin GO a ningún proveedor hasta verificar producto concreto.

## 5. Qué falta de otros departamentos
- Reglas de Seller Center sobre origen de stock y plazo: ver tienda/trabajo/ronda-13/proveedores/reglas-tiktok-shop-oficial.md (no duplicado aquí).
- Márgenes: no calculados; no hay coste de producto leído. Se harán con margen_es.py (comisión 9 % y 4 %, devoluciones 0.10) cuando haya CSV.

## Datos clave

| Producto | ID/URL | Coste € | PVP € (probado o propuesto) | Fuente del precio de mercado y fecha | Verificado (listado/ficha/persona) | Margen/pedido y supuestos | Veredicto |
|---|---|---|---|---|---|---|---|
| CJ Dropshipping (servicio) | https://cjdropshipping.com (/service-fee, /integrations/tiktok-shop, /user-agreement) | Sin suscripción citada; tarifa salida DE 0,34-0,44 USD y PL 1,01-1,26 USD (solo stock propio); producto: no verificado | n/a | cjdropshipping.com, 27/10/2026 | Web oficial leída parcialmente; plazo a ES y devoluciones no leídos | No calculado: sin coste de producto | Abrir cuenta gratuita, sin GO |
| BigBuy (servicio) | https://www.bigbuy.eu (403) | 69-99 €/mes + 90 € alta (blog) | n/a | Trendtrack vía WebSearch, 27/10/2026 | No verificado (web 403) | No calculado | Preguntar condiciones, sin GO |
| Spocket / Syncee / Eprolo / Dropi | webs no resuelven (DNS) | 39,99-299 $/mes (Spocket, blog); resto no verificado | n/a | WebSearch, 27/10/2026 | No verificado | No calculado | En reserva, sin GO |

- **Qué sabemos** (con fuente y fecha): CJ no pide empresa ni ID fiscal en su acuerdo y tiene integración TikTok Shop; sus tarifas publicadas son de servicio para stock propio (cjdropshipping.com, 27/10/2026). Almacenes CJ en DE y PL aparecen en esas tarifas. Cuota BigBuy 69-99 €/mes según blog (Trendtrack, 27/10/2026).
- **Qué asumimos** (y cómo se comprobaría): que CJ sirve a vendedores de TikTok Shop ES y entrega desde DE/PL a España en pocos días (comprobar en calculadora y en Seller Center tras login); que BigBuy tiene CSV y conector utilizable (preguntar a soporte).
- **Qué cambiaría mi conclusión:** que CJ no soporte TikTok Shop ES o que su stock DE/PL no cubra nuestro nicho; que BigBuy exija CIF o cuota prohibitiva; cualquier CSV real que dé márgenes por debajo del 25 %.

Recuento de datos etiquetados en este archivo: [OFICIAL] 13 (todos de cjdropshipping.com), [BLOG] 17, [NO VERIFICADO] 25 aproximadamente (conteo manual de afirmaciones por ficha y tabla, puede variar en 2-3).
