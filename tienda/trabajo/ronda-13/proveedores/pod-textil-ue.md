# POD y textil con producción UE (modelo C) — ronda 13, consulta 27/10/2026

## 0. Resultado de la lectura (leer primero)
- WebFetch FALLÓ (DNS `getaddrinfo ENOTFOUND`) en: www.printful.com/es/precios, help.printful.com, www.gelato.com/pricing, support.gelato.com, printify.com/pricing. Ninguna web oficial se pudo leer.
- Todo lo de abajo viene de resúmenes de WebSearch (5 búsquedas): por regla de CONTEXTO.md es [BLOG] aunque el resumen cite una URL oficial. Datos [OFICIAL] leídos: 0.
- No se obtuvo ningún coste base por prenda de ninguna calculadora. Por tanto el margen NO se puede calcular con costes reales: se da sensibilidad y coste máximo admisible (sección 4). Sin coste leído, sin GO.
- Tampoco se leyó Seller Center ni ayuda oficial de TikTok Shop ES: el plazo de 2 días laborables sigue siendo el de CLAUDE.md, no verificado hoy.

## 1. Fichas de proveedor
Campos no hallados: [NO VERIFICADO].

### Printful
- Web oficial: printful.com (ES: printful.com/es). Modelo: POD (DTG y bordado propios), con marca blanca de etiquetas/inserts. Mínimo: sin pedido mínimo [NO VERIFICADO].
- Producción UE: Barcelona (centro abierto 2019-2020, ~19.350 ft², >15.000 pedidos DTG/bordado a mediados de 2020) [BLOG: resumen de búsqueda de notas de prensa de printful.com, 2019-2020]. Comparador de terceros cita además Letonia y UK [BLOG]. Instalaciones actuales: [NO VERIFICADO].
- Plazo: entrega nacional desde Barcelona "~3 días laborables tras fulfillment" [BLOG, página printful.com/uk/print-on-demand-spain según resumen]. Tiempo de producción de prenda DTG/bordado: [NO VERIFICADO] (el dato de 2,5 días de 2020 es de tazas/posters, no prendas).
- Coste base prenda (calculadora): [NO VERIFICADO]. Tarifa de muestra / descuento de muestras: [NO VERIFICADO].
- Integración TikTok Shop: la app directa solo para cuentas US y UK [BLOG: ecommerce-platforms.com, sin fecha]; su blog la describe como en pruebas para vendedores seleccionados UK/US [BLOG]. Para España: vía Shopify + canal TikTok de Shopify; las páginas por país listan España como disponible para "vender en TikTok" [BLOG]. Requiere tienda Shopify (coste mensual de Shopify: [NO VERIFICADO]).
- Marca blanca: etiquetas de cuello propias e inserts de paquete [BLOG].
- Alta fiscal: [NO VERIFICADO]; asumir que hace falta para vender en TikTok Shop (CLAUDE.md pendiente).
- Alarmas: ruta Shopify añade capa y coste; pruebas de integración directa no abiertas a ES.
- Siguiente paso 0 €: abrir cuenta gratuita, leer calculadora de Gildan 64000 DTG y bordado y el panel "TikTok Made to Order" (artículo help.printful.com/hc/en-us/articles/29824372231452) y pegarlo en este informe como [OFICIAL].

### Gelato
- Web oficial: gelato.com. Modelo: POD con red local (">130 hubs" propios de marketing) [BLOG: resumen de gelato.com/blog, es publicidad propia]. Producción UE concreta en España/Portugal/Polonia/Alemania: [NO VERIFICADO].
- Coste base, producción, envío a España, muestras, devoluciones: [NO VERIFICADO]. Promoción "Gelato+ 20 % + envío gratis en ropa premium" visible en el título de sus páginas [BLOG] (condiciones y cuota de Gelato+: no leídas).
- TikTok Shop: su blog recomienda conexión por API o Shopify y fijar envío "Fulfilled by seller"; no se confirma conector nativo ni alianza oficial con TikTok [BLOG].
- Marca blanca: [NO VERIFICADO].
- Alarma: la guía cita Late Dispatch Rate < 4 % como riesgo (dato del propio Gelato) [BLOG].
- Siguiente paso 0 €: cuenta gratuita, calculadora de camiseta y sudadera con destino ES, anotar hub de producción y plazo.

### Printify
- Web oficial: printify.com. Modelo: marketplace de proveedores de impresión (no produce él); 80+ instalaciones en Europa (Alemania, Países Bajos, UK, Chequia...) [BLOG: resumen de printify.com/cpc/...pod_europe]. España/Portugal/Polonia: [NO VERIFICADO].
- TikTok Shop: la integración nativa es solo US (US + proveedores US) según ayuda de Printify y guía de terceros [BLOG]; su página de EU lista TikTok Shop entre integraciones sin aclarar región, ambigua [BLOG]. Para vendedor ES: no confirmado = tratar como NO.
- Coste base, muestras (Printify suele ofrecer descuento en muestras: [NO VERIFICADO]), marca blanca, devoluciones: [NO VERIFICADO].
- Alarma: depende del proveedor concreto, la calidad y plazo varían por proveedor.
- Siguiente paso 0 €: abrir cuenta, filtrar proveedores UE con bordado/DTG, leer plazo de producción por proveedor, preguntar a soporte si hay TikTok Shop ES.

### Otros europeos (hallazgos)
- Búsqueda de Prodigi, Qstomize, Monster Digital, Stitch, Spreadconnect: sin resultados útiles [NO VERIFICADO]. No se cita ninguno como proveedor.
- Fabricante polaco con serigrafía, bordado y DTG en casa, hoodies incluidos, busca socios UE (anuncio de la red Enterprise Europe Network, een.ec.europa.eu/node/45043; validez hasta 23/04/2026, posiblemente caducado) [BLOG]. Es fabricante, no plataforma POD; mínimos y precios: [NO VERIFICADO]. Siguiente paso 0 €: contactar mediante la red EEN solo si sigue vigente.
- Merchize (merchize.com/print-on-demand-in-eu) aparece en resultados; contenido no leído, [NO VERIFICADO].

## 2. TikTok Shop: ¿cuenta la producción en el plazo de 2 días?
- Resumen de búsqueda de guías de Printful, Printify y terceros (todas orientadas a US, no ES) [BLOG]: existe "Made to Order" con 3-14 días laborables de manejo en vez de los 2 estándar; se activa por listado; requisitos citados: puntuación de tienda >= 3,5, Account Health > 150, sin riesgo alto; la producción cuenta dentro de la ventana de entrega al cliente (estándar 6 días laborables, express 3).
- Aplicabilidad a España: [NO VERIFICADO]. Hay que leer Seller Center ES. Mientras no se lea, un POD con producción de 2-5 días choca con la regla de 2 días de CLAUDE.md; `margen_es.py` marca NO-GO si días de preparación > 2.
- Conclusión: el modelo C solo es viable si Seller Center ES ofrece Made to Order (una tienda nueva puede no cumplir los umbrales de puntuación).

## 3. Supuestos de cálculo (declarados, tabla única, aprendizaje 23)
Coste 12,50 € = SUPUESTO heredado de ronda 12, NO coste de calculadora (no se leyó ninguna). Envío al cliente 4 € supuesto. Afiliado 0. Devoluciones 0,10. Días de preparación 2. Otros y embalaje por defecto del script. No incluye derecho de 3 €, ni Shopify (aprendizaje 25).

## 4. Margen con `margen_es.py` (ejecutado 27/10/2026)
| PVP | Beneficio/pedido, comisión 9 % (coste 12,50 €) | Beneficio/pedido, comisión 4 % tienda nueva | Coste máximo para +4 €/pedido (9 % / 4 %) |
|---|---|---|---|
| 14,90 € | -7,35 € (NO-GO) | -6,73 € (NO-GO) | 1,16 € / 1,77 € |
| 24,90 € | -0,74 € (NO-GO) | +0,29 € (HOLD) | 7,77 € / 8,80 € |
| 34,90 € | +5,87 € (HOLD) | +7,32 € (GO) | 14,38 € / 15,82 € |
Lectura: a 14,90 y 24,90 € ninguna prenda POD con bordado/DTG (la prenda sola costaba 7,30-8,27 € en ronda 12, [BLOG]) deja margen. Solo 34,90 € funciona, y ese PVP no tiene ancla leída en TikTok Shop ES (FastMoss abril 2026: ropa 4-14 €, [BLOG]). Estas cifras no son costes de calculadora.

## Datos clave
| Producto | ID/URL | Coste € | PVP € | Fuente del precio de mercado y fecha | Verificado | Margen/pedido y supuestos | Veredicto |
|---|---|---|---|---|---|---|---|
| Camiseta/sudadera POD UE (Printful) | printful.com/es (no abierta) | no verificado (12,50 supuesto) | 14,90 / 24,90 / 34,90 propuestos | FastMoss abril 2026, blog, 6-14 € | No: solo resumen de búsqueda | -7,35 / -0,74 / +5,87 (9 %); -6,73 / +0,29 / +7,32 (4 %); dev. 0,10, afiliado 0, envío 4 € | HOLD sin GO: sin coste ni plazo oficial |
| Idem (Gelato) | gelato.com (no abierta) | no verificado | idem | idem | No | no calculable con dato propio | HOLD sin GO |
| Idem (Printify) | printify.com (no abierta) | no verificado | idem | idem | No | no calculable | NO para ES hasta confirmar integración |
| Fabricante polaco EEN | een.ec.europa.eu/node/45043 | no verificado | n/a | n/a | No, anuncio posiblemente caducado | n/a | Solo contacto 0 € |

- **Qué sabemos** (27/10/2026): WebFetch no alcanza ninguna web de estos proveedores; según resúmenes [BLOG], Printful produce en Barcelona, sus integraciones TikTok directas son US/UK y España va por Shopify; Printify nativo es US; Gelato no muestra conector nativo.
- **Qué asumimos:** coste 12,50 €, envío 4 € y Made to Order disponible en ES. Se comprueba abriendo las calculadoras gratuitas y Seller Center ES.
- **Qué cambiaría mi conclusión:** leer un coste base <= 8 € con producción <= 2 días, o Made to Order activo en ES, o un PVP >= 29,90 € leído en TikTok Shop ES con ventas.
