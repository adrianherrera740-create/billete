# Fabricantes de marca blanca / marca propia y agentes de compras (ronda 13)
Fecha de consulta: 27/10/2026. Fechas de publicación: casi ninguna visible en los resultados; cuando se vio, se indica.

## 0. Limitación que condiciona todo el informe (leer primero)
- WebFetch falló con `getaddrinfo ENOTFOUND` en TODAS las webs probadas: yoursocks.com, sourcingmaster.com, supplyia.com, wonnda.com, sourcify.com, leelinesourcing.com, printful.com.
- `curl` por el proxy de la nube devuelve `CONNECT tunnel failed, response 403` en supplyia.com, wonnda.com, sourcify.com, printful.com y alibaba.com.
- Resultado: NINGUNA web de proveedor se ha podido abrir. Cero datos [OFICIAL]. Todo viene de resúmenes de WebSearch (aunque varios resúmenes citan páginas del propio proveedor). Según las reglas de la ronda, eso es [BLOG] y se marca así, con el dominio de origen. No es lectura.
- Cada dato debe abrirse en la web indicada (paso de 0 €) antes de decidir. Ningún dato de este informe justifica un GO.
- No se ha calculado ningún margen: no hay coste unitario verificado de ningún artículo (ni PVP medido), así que `margen_es.py` no tiene entradas legítimas. Se evita inventarlas.

## 1. Tabla resumen (12 fuentes con web; 10 son fabricantes o agentes)
| # | Nombre | Tipo / país | Web oficial (no abierta) | MOQ | Plazo producción | Personalización | Muestras | Envío a España | Estado |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Create Fashion Brand (CFB) | Fabricante textil, Portugal | createfashionbrand.com | 150 uds/estilo-color a medida; 50 (web principal) o 100 (FAQ/PDF) en básicos personalizados; sin mínimo en stock [BLOG: buscador sobre createfashionbrand.com] | 8-10 semanas producción [BLOG] | Marca blanca sobre básicos, a medida desde tech pack [BLOG] | Desde unos 30 € una camiseta, sin tasa de muestreo ni de patrón; máx. 2 a clientes nuevos; 1-4 semanas (páginas discrepan: 4-6 sem, 5-8 días laborables, 2 sem) [BLOG] | NO VERIFICADO (UE, sin aduana a priori) | Páginas contradictorias, algunas antiguas |
| 2 | Wonnda | Marketplace B2B de fabricantes, mayoría Europa | wonnda.com | Por proveedor; referencia apparel UE 300-500/colorway; calcetines "MOQ más altos" sin cifra [BLOG: wonnda.com] | Varía; 6-8 semanas para Portugal [BLOG] | Filtros por país, MOQ y certificación | Según proveedor | Según proveedor | Sirve para contactar; respuesta "en 48 h con brief cualificado" (autodeclarado) [BLOG] |
| 3 | Isbilir Promosyon | Fabricante promocional, Turquía (oficina en Varsovia): calcetines, gorros | NO VERIFICADO (solo perfil en Wonnda) | NO VERIFICADO (campo vacío) | NO VERIFICADO | Productos a medida [BLOG] | NO VERIFICADO | NO VERIFICADO | Candidato a contactar |
| 4 | Pingons | Fabricante, Turquía: camisetas, sudaderas, calcetines, gorros, bolsas | NO VERIFICADO (solo perfil en Wonnda) | NO VERIFICADO | NO VERIFICADO | NO VERIFICADO | NO VERIFICADO | NO VERIFICADO | Candidato a contactar |
| 5 | Sucesores de Géneros de Punto Francés SL | Fabricante de punto y calcetería, España | NO VERIFICADO (solo perfil en Wonnda) | NO VERIFICADO | NO VERIFICADO | NO VERIFICADO | NO VERIFICADO | Nacional | Único fabricante español de calcetines que apareció; contactar |
| 6 | MPY Textile | Fabricante con calcetines y ropa infantil; país NO confirmado | wonnda.com/suppliers/mpy-textile (perfil) | 300 a 30.000 piezas [BLOG: wonnda.com] | NO VERIFICADO | NO VERIFICADO | NO VERIFICADO | NO VERIFICADO | MOQ alto para empezar; ropa infantil fuera de foco |
| 7 | Printful (Barcelona) | POD con producción en España: bordado y estampado | printful.com/print-on-demand-spain | Sin mínimos [BLOG: buscador sobre printful.com/es] | 2-5 días laborables de producción, sin envío [BLOG: support.printful.com]; un blog independiente dice 5-7 días laborables para gorras bordadas y +50-100 % de oct a ene (no verificado) | Gorras bordadas o impresas; calcetines y etiquetas propias: NO VERIFICADO | NO VERIFICADO | "Impreso en Barcelona y entregado en España en 3 días laborables" [BLOG: printful.com/print-on-demand-spain] | Es POD, no marca blanca de fabricante. Contexto: cierre previo de POD como motor de anuncios (estado.md) |
| 8 | Gelato | POD con red local; hub en España | gelato.com/es/print-on-demand/españa | NO VERIFICADO | NO VERIFICADO | Catálogo visto: camisetas, sudaderas, tazas, fundas, pósters; no se confirmaron gorras, calcetines, alfombrillas | NO VERIFICADO | >85 % de pedidos producidos en el país de destino (autodeclarado) [BLOG: support.gelato.com] | No cubre complementos pedidos; verificar catálogo |
| 9 | Supplyia | Agente 1688 / sourcing, China | supplyia.com | Sin mínimo declarado; cargo de gestión si poco valor con muchos enlaces [BLOG: supplyia.com] | NO VERIFICADO | Packaging y personalización según proyecto | Gestiona muestras [BLOG] | Flete internacional aparte, sin tarifa a España; coste = producto + transporte interno + comisión + flete + impuestos estimados [BLOG] | Comisión 5-10 % (página 1688) o 5-9 % (portada), según valor y SKUs. Inspección básica incluida (cantidad, defectos visibles, embalaje); una más exhaustiva puede costar extra [BLOG: supplyia.com] |
| 10 | Leeline Sourcing | Agente 1688, China | leelinesourcing.com | Sin mínimo declarado, pensado para proyectos [BLOG: comparador] | NO VERIFICADO | Sourcing, negociación, QC, embalaje | NO VERIFICADO | Almacén con 1 mes gratis [BLOG: extrabux]; flete NO VERIFICADO | Tarifa: 100 $ fijos bajo 500 $, escala 15 % a 4 % sobre 100.000 $ (comparador de terceros, sin tarifa oficial vista) [BLOG]. No apto para pedidos pequeños según Extrabux |
| 11 | Jingsourcing | Agente 1688, China | jingsourcing.com | NO VERIFICADO | NO VERIFICADO | NO VERIFICADO | NO VERIFICADO | NO VERIFICADO | 5 % con mínimo 100 $ [BLOG: sino-shipping.com, ranking propio de un competidor] |
| 12 | Sino Shipping / Union Source / Yoybuy | Agentes: SINO Shipping (comprar-por-mí y forwarder, tarifa desglosada, sin mínimo), Union Source (5-7 %, orientado a >= 5.000 $), Yoybuy (2-5 % según nivel + 5 % fuera de 1688) | sino-shipping.com, unionsource, yoybuy | Ver columna | NO VERIFICADO | NO VERIFICADO | NO VERIFICADO | NO VERIFICADO | Todo [BLOG]: ranking publicado por SINO Shipping, que se pone primero. Antigüedad: ranking ~117 días, guía ~204 días |

Otros candidatos que se vieron pero NO se pudieron contrastar (sin MOQ ni web leída): Konsey Textile y Last Textile (Turquía, solo mencionados en blogs SEO) y Soeiro (Portugal, ropa y punto, volúmenes > 5.000 piezas según Première Vision; no consta que haga calcetines). Sourcify (marketplace) no figura con Portugal ni Turquía; su tarifa histórica (2018, TechCrunch) era 500 $ + 1-10 %, tarifa actual NO VERIFICADO. Descartados: Alibaba/Made-in-China como "fabricante UE" (no lo son).

## 2. Por categoría (lo que se encontró de verdad)
- Textil y calcetería Portugal: el único fabricante portugués con cifras es CFB (ropa; calcetines NO confirmados). Una búsqueda en portugués ("meias ... private label") no devolvió ningún fabricante de calcetines con MOQ publicado. Un blog de un fabricante portugués de activewear da 60-70 uds white-label y 250-300 a medida (no es calcetería).
- Calcetería España: una pista (n.º 5), sin MOQ.
- Turquía: blogs SEO dan 100-300 uds/estilo (100-200 para camisetas oversize); Wonnda dice 1.000+ para precios competitivos. Los dos datos chocan. Pista concreta: n.º 3 y 4.
- Gorras: búsqueda de fabricantes españoles no halló ninguno con MOQ; solo Printful/Vistaprint (sin mínimos, bordado). En Alibaba los resúmenes muestran MOQ de 10-100 y un trucker con 25, a 1-7 € (listados, sin envío ni impuestos) [BLOG].
- Alfombrillas / desk mats: no apareció ningún fabricante UE. En Alibaba/Global Sources/Made-in-China: sublimación sobre caucho 50-100 uds como entrada común, algunos 5-10 (comerciantes, no fábricas), PU/cuero >= 100, base de caucho impresa 1.000 en un listado [BLOG]. Hongcheng, Shenzhen Huayin y Kunshan Standard Gifts son nombres de listados, no verificados.
- Accesorios de coche pasivos: la búsqueda en español solo devolvió tiendas minoristas y directorios sin relación. Ningún mayorista UE de marca blanca encontrado. Aviso: aparecen organizadores de maletero con licencia de marca (Red Bull Racing), evitar.
- Agentes 1688: comisión típica 3-10 % [BLOG, varias fuentes]; inspección de terceros 200-500 $ (Supplyia) o 300-600 $ por hombre-día (otra fuente); hay conflicto entre cifras. Para exportar desde China hace falta un agente o un transitario con registro aduanero (la mayoría de fábricas pequeñas no lo tiene) [BLOG]. Alto riesgo: comisión oculta del proveedor que infla el precio unitario [BLOG]. Para pruebas pequeñas de producto genérico, comprar directo en Alibaba con Trade Assurance puede salir mejor [BLOG]. Aduanas/IVA/derecho de 3 € de importación a España: sin dato.

## 3. Los 4 mejores (por trazabilidad y encaje, NO por calidad verificada)
1. **Create Fashion Brand (Portugal).** Única con MOQ, plazo y política de muestras publicados para producción UE. MOQ 50-150, 8-10 semanas, muestra ~30 €. Pega: ropa, no complementos; las muestras cuestan dinero (regla "sin comprar muestras" activa) y el plazo de 2 meses rompe el calendario M2. Siguiente paso 0 €: enviar la plantilla del punto 4 y pedir por escrito MOQ de camisetas/sudaderas básicas con etiqueta y de calcetines/gorras.
2. **Wonnda (como puerta a los n.º 3, 4 y 5).** Es el único camino localizado a un fabricante español de calcetines y a dos turcos de calcetines/gorros. Siguiente paso 0 €: abrir los tres perfiles, anotar MOQ y plazo reales y enviar el brief gratuito.
3. **Printful Barcelona.** Para validar demanda sin MOQ ni stock: bordado en gorras con entrega 3 días laborables en España. Pega: es POD, y estado.md ya cerró POD como motor de anuncios (+4,53 €/pedido a 34,90 €). Útil solo como prueba de preventa. Siguiente paso 0 €: ver catálogo y precio base de la gorra y consultar el coste de una etiqueta/packaging propios.
4. **Supplyia (agente 1688).** Para alfombrillas y organizadores de coche, que no tienen opción UE. Comisión 5-10 %, inspección básica incluida, flete a España sin tarifa. Siguiente paso 0 €: mandar un correo con 2 enlaces 1688 y pedir cotización total puesta en España (producto + comisión + flete + IVA + aduana).

## 4. Plantilla de correo de cotización (en español, NO enviada)
Asunto: Solicitud de cotización marca blanca - [PRODUCTO] - pedido de prueba

Buenos días,

Soy [NOMBRE], de [EMPRESA / autónomo con NIF XXXXX]. Preparo el lanzamiento de una marca propia de [CALCETINES / GORRAS / CAMISETAS / ALFOMBRILLAS DE ESCRITORIO / ORGANIZADORES DE COCHE] para venta online en España y la UE. Les pido información por escrito sobre:

1. Producto: [REFERENCIA o descripción: material, medidas, gramaje, colores]. Diseño propio (logotipo, sin marcas ajenas) que aportaré en vector.
2. Pedido mínimo (MOQ) por modelo y por color, y precio unitario a 50, 100, 300 y 500 unidades.
3. Plazo de producción tras aprobar la muestra y tras el pago, y plazo de la muestra.
4. Personalización incluida: etiqueta tejida o impresa con nuestro nombre, packaging (bolsa, caja, tarjeta) y su coste/mínimo.
5. Muestras: coste, si se descuenta del pedido posterior, y plazo.
6. Envío a España (Península) a [CÓDIGO POSTAL]: coste, transportista y plazo; si pueden enviar a un tercero o a un almacén logístico en España.
7. Documentación: composición textil, etiquetado (Reglamento UE 1007/2011 si es textil), marcado CE o conformidad que aplique, y factura con IVA/intracomunitaria.
8. Forma de pago y condiciones (anticipo, saldo).

Si trabajan con intermediarios, indíquenlo. Les agradezco una respuesta con las cifras en euros y las condiciones por escrito.

Un saludo,
[NOMBRE] | [TELÉFONO] | [WEB / EMPRESA]

Variante para agentes 1688: sustituir los puntos 1-8 por: "Adjunto 2-3 enlaces de 1688/Alibaba. Indíquenme: comisión (% y mínimo), coste de inspección previa al envío, coste de consolidación y almacenamiento, tarifa de flete por kg y por m3 a España por mar y por aire, plazo, quién gestiona la exportación en China, y el coste total puesto en España incluyendo IVA y aduana. ¿Aceptan pago por transferencia internacional o Wise?"

## 5. Recuento de etiquetas de fuente
- [OFICIAL]: 0 (ninguna web de proveedor se pudo abrir).
- [BLOG]: 37 apariciones de la etiqueta en el archivo (grep 27/10/2026), incluidas unas 3 en este recuento; unos 34 datos etiquetados.
- NO VERIFICADO: la mayoría de celdas de MOQ, plazo, muestras y envío de los n.º 3, 4, 5, 6, 8, 11 y 12.

## Datos clave
| Producto | ID/URL | Coste € | PVP € (probado o propuesto) | Fuente del precio de mercado y fecha | Verificado (listado/ficha/persona) | Margen/pedido y supuestos | Veredicto |
|---|---|---|---|---|---|---|---|
| Camiseta/sudadera marca blanca Portugal | createfashionbrand.com | muestra ~30 € camiseta; unitario no verificado | no verificado | WebSearch 27/10/2026, resumen [BLOG] | Web no abierta | No calculado: sin coste unitario ni PVP medido | Contactar (0 €), sin GO |
| Calcetines (ES/TR) | Perfiles Wonnda de Isbilir, Pingons y Sucesores de Géneros de Punto Francés | no verificado | no verificado | WebSearch 27/10/2026 [BLOG] | No | No calculado | Contactar, sin GO |
| Gorra bordada POD | printful.com/print-on-demand-spain | no verificado | no verificado | WebSearch 27/10/2026 [BLOG] | No | No calculado | Solo prueba de preventa, sin GO |
| Desk mat / alfombrilla | Listados Alibaba (Shenzhen Huayin, Kunshan Standard Gifts) | 0,26-3 $ (listado, sin envío) | no verificado | WebSearch 27/10/2026 [BLOG] | No | No calculado | Vía agente, sin GO |
| Organizador de coche | ninguno encontrado | no verificado | no verificado | WebSearch 27/10/2026 | No | No calculado | Sin proveedor UE; sin GO |
| Agente 1688 | supplyia.com, leelinesourcing.com | Comisión 5-10 % (Supplyia), 100 $ fijo bajo 500 $ (Leeline) [BLOG] | no aplica | WebSearch 27/10/2026 | No | Flete/IVA/aduana a España sin dato | Pedir cotización total, sin GO |

- **Qué sabemos** (WebSearch 27/10/2026, todo [BLOG]): CFB publica MOQ 50-150, 8-10 semanas y muestra desde ~30 €; Printful produce en Barcelona sin mínimos, 2-5 días de producción y 3 días de entrega en España; los agentes cobran 3-10 %; hay un fabricante español de calcetines y dos turcos localizados, sin cifras.
- **Qué asumimos** (y cómo se comprueba): que las cifras de los resúmenes coinciden con las webs actuales (abrir cada web desde el ordenador de la persona o enviar la plantilla); que los fabricantes de ropa de la lista admiten calcetines/gorras (preguntarlo); que CFB, Wonnda y Supplyia admiten un pedido pequeño de un autónomo sin alta (no verificado).
- **Qué cambiaría mi conclusión:** que la persona abra las webs y las cifras sean otras; un MOQ de calcetines <= 100 en España; una cotización de agente con flete a España para alfombrillas; la lectura de canal de TikTok Shop ES (si no hay demanda, ningún proveedor importa); la respuesta sobre levantar las reglas "sin stock propio" y "sin comprar muestras", que todos estos modelos necesitan.
