# Protocolo de homologación de proveedores (ronda 13)
Fecha de consulta: 27/10/2026. Autor: verificador de fichas. Objetivo: decidir si un proveedor es fiable por pruebas propias y no por blogs.

Etiquetas: [OFICIAL url] = leído con WebFetch en la web oficial; [BLOG] = lo dice un tercero o un resumen de buscador (no es lectura); [NO VERIFICADO] = sin dato. Fecha de consulta no es fecha de publicación: se apuntan ambas cuando se ven.

## Estado de acceso en esta sesión (probado hoy, 27/10/2026)
| Recurso | Resultado |
|---|---|
| cjdropshipping.com (portada) | Se lee. Páginas de política y almacenes redirigen a `frontend.cjdropshipping.com` (bloqueado). Sí se lee `/integrations/tiktok-shop`. |
| bigbuy.eu (es, en, what-is-bigbuy) | HTTP 403 en todas las rutas probadas. |
| printful.com y help.printful.com | DNS no resuelve (ENOTFOUND), con WebFetch y con curl. |
| VIES (ec.europa.eu) | DNS no resuelve. No se pudo consultar ningún VAT. |
| EUIPO eSearch (euipo.europa.eu) | DNS no resuelve. |
| Registradores / BOE (BORME) | curl sin respuesta (000). |
| TikTok Seller Center ES | curl sin respuesta (000). |
| WebSearch | Funciona, pero solo da resúmenes: cuenta como [BLOG]. |

Consecuencia: las comprobaciones 2, 3, 9 y la parte legal de la 1 no se han podido hacer hoy desde la nube. El protocolo las deja a la persona (navegador propio, gratis) y lo dice.

---

## 1. Checklist de 15 comprobaciones puntuables

Puntuación por punto: 0 = no consta o es negativo; 1 = consta solo en fuente [BLOG] o parcialmente; 2 = prueba [OFICIAL] o documento/respuesta recibida del proveedor y contrastada. Máximo 30.
Regla de prueba: un punto solo puede valer 2 con [OFICIAL] o con prueba que tenga la persona. Con [BLOG] el máximo es 1. [NO VERIFICADO] = 0.

| # | Comprobación | Qué cuenta como 2 |
|---|---|---|
| 1 | Empresa real: razón social, forma jurídica y domicilio legal publicados | Aviso legal con razón social, domicilio y registro; coincide con el resto de documentos |
| 2 | CIF/NIF-IVA válido en VIES (crítico) | VIES devuelve "válido" y el nombre/dirección, si los muestra, coincide con la razón social |
| 3 | Inscripción en registro mercantil y antigüedad de la sociedad | Consta en Registro Mercantil (o equivalente del país) con fecha de constitución |
| 4 | Dirección y almacén reales (no buzón ni domicilio particular) | Dirección del almacén publicada, verificable en mapa/vista de calle y que coincide con el remitente de los paquetes |
| 5 | Tiempo en el mercado (>= 2 años de actividad verificable) | Fecha de constitución o histórico comprobable en fuente independiente (archivo web, prensa, registro) |
| 6 | Reseñas independientes (Trustpilot, Google, foros; no solo las de su web) | >= 3 fuentes independientes con volumen y quejas recientes leídas; sin patrón de reseñas falsas |
| 7 | Política de devoluciones y garantías por escrito | Texto que cubre 14 días de desistimiento UE, quién paga el retorno, dirección de devolución en la UE, plazos de reembolso |
| 8 | Factura con IVA a nombre de tu NIF (crítico) | Factura de muestra o confirmación escrita de que emiten factura con IVA español/UE y número de serie |
| 9 | Marca registrada: el producto no es de marca ajena ni infringe (crítico) | Búsqueda en EUIPO/TMview/OEPM sin coincidencia, o autorización escrita del titular |
| 10 | CE / GPSR (crítico) | Declaración de conformidad, responsable en la UE identificado (Reg. UE 2023/988) y etiquetado, si el producto lo exige |
| 11 | Contacto: responde por escrito en <= 24 h laborables | Respuesta útil y concreta en <= 24 h a las 6 preguntas (apartado 4) |
| 12 | Prueba de envío con seguimiento válido (crítico) | Pedido real (o prueba del proveedor) con tracking que se activa y entrega al transportista <= 2 días laborables |
| 13 | Stock y plazo de preparación confirmados por escrito por SKU | Correo con stock, ubicación y plazo de preparación en días laborables |
| 14 | Pago seguro y trazable | IBAN a nombre de la empresa del VIES (mismo país), sin pago a persona física, sin cripto, sin "descuento por pagar hoy" |
| 15 | Condiciones económicas e integración claras | Cuotas, mínimos y costes de envío publicados; integración con TikTok Shop ES o CSV/API documentada; sin exclusividad |

Criterio de paso:
- HOMOLOGADO: >= 24/30, ningún punto crítico (2, 8, 9, 10, 12) en 0 y ninguna red flag roja.
- HOMOLOGADO CONDICIONADO (solo pedidos de prueba, tope 30 € de la regla vigente): 22-23/30, críticos >= 1.
- NO HOMOLOGADO: < 22, o cualquier crítico en 0, o cualquier red flag roja. "No homologado" por falta de evidencia no es lo mismo que "descartado": se puede repetir con más pruebas.
- Un proveedor nuevo nunca pasa solo con [BLOG].

---

## 2. Cómo se comprueba cada punto y quién lo hace

| # | Agente desde este entorno | Solo la persona |
|---|---|---|
| 1 | WebFetch del aviso legal oficial (si abre); WebSearch del nombre legal [BLOG] | Cruzar con el registro (punto 3) |
| 2 | Hoy NO: VIES no resuelve en DNS. Si en otra sesión resuelve: API REST de VIES (`/vies/rest-api/ms/ES/vat/<número>`) | Introducir el VAT en la web de VIES (taxation-customs, servicio gratuito de la Comisión Europea). Para España, VIES suele confirmar válido/no válido, pero no siempre devuelve nombre y dirección |
| 3 | Hoy NO: sin acceso a registros. WebSearch solo da [BLOG] | Registro Mercantil: nota simple o publicidad del BORME (el BORME es de acceso público); para otros países, su registro nacional o el sistema BRIS europeo |
| 4 | WebFetch de la página de contacto/almacén; el agente no puede ver vista de calle | Buscar la dirección en un mapa con vista de calle; preguntar por visita o foto del almacén |
| 5 | WebSearch (archivo, prensa); fecha de fundación [BLOG] salvo página oficial | Cruzar fecha con el registro (punto 3) |
| 6 | WebSearch de reseñas (resúmenes, [BLOG]); WebFetch de Trustpilot si abre | Leer las reseñas de 1-2 estrellas de los últimos 6 meses en 3 sitios; buscar en foros de vendedores |
| 7 | WebFetch de la política oficial (si abre; en CJ hoy redirige a un dominio bloqueado) | Leerla entera y pedir confirmación escrita (pregunta 4) |
| 8 | Solo se puede leer si lo anuncian en la web oficial | Pedir factura de muestra o confirmación por escrito (pregunta 3) |
| 9 | Hoy NO: EUIPO no resuelve. WebSearch de "marca + producto" como pista [BLOG] | EUIPO eSearch / TMview (gratis) por nombre de marca y por logotipo; OEPM para España. Mirar clases 9, 12, 25 y 28 según producto |
| 10 | WebFetch de la ficha oficial (documentos CE, fabricante, responsable UE) | Pedir declaración de conformidad y datos del responsable (pregunta de la plantilla). Comprobar etiquetado en la foto |
| 11 | Puede redactar el correo, no puede enviarlo ni medir la respuesta | Enviar el correo del apartado 4 y apuntar hora de envío y de respuesta |
| 12 | No puede comprar ni rastrear un paquete | Pedido de prueba o, si no se compra muestra (regla vigente), pedir al proveedor un envío real reciente con su tracking y comprobarlo en el transportista |
| 13 | No | Respuesta escrita (pregunta 1 y 2) |
| 14 | Puede revisar los métodos de pago publicados | Comparar el titular del IBAN con la razón social del VIES |
| 15 | WebFetch de la página oficial de precios e integración | Probar el alta gratuita y el alcance del conector con TikTok Shop ES en Seller Center |

Regla: nada que dependa de la persona se puntúa hasta que exista captura, correo o enlace guardado en `tienda/trabajo/ronda-13/proveedores/`.

---

## 3. Red flags típicas de falsos mayoristas y estafas de proveedor (España)

Rojas (descartan al proveedor hasta aclararse):
1. Sin razón social ni CIF/VAT en el aviso legal, o el VAT no es válido en VIES o es de otra empresa.
2. Piden pago por adelantado a una cuenta de persona física, a un IBAN de otro país sin explicación, por Bizum, criptomonedas, gift cards o Western Union.
3. Presionan: "oferta solo hoy", "quedan 3 unidades", "descuento si pagas ya".
4. Precios muy por debajo del mayorista conocido o de AliExpress para el mismo producto, sin explicación.
5. Producto de marca ajena (electrónica, ropa, juegos) a precio de mayorista sin autorización de la marca: falsificación o infracción.
6. Se niegan a emitir factura con IVA o dicen que "no hace falta".
7. Cobran por "acceso a la lista de proveedores" o "directorio de mayoristas verificados". Quien vende listas de proveedores es el negocio, no el proveedor.
8. Dirección que es un buzón, un coworking sin almacén o una vivienda; correo solo Gmail/Hotmail; teléfono solo WhatsApp.
9. Web recién creada, sin historial, con reseñas todas de 5 estrellas en la misma semana o con textos repetidos.
10. Intermediario que se presenta como fabricante o "mayorista oficial" sin documento que lo pruebe.

Amarillas (restan puntos y exigen respuesta escrita):
11. Plazos "5-15 días" sin desglosar preparación y transporte (choca con el requisito de entregar al transportista en 2 días laborables con seguimiento válido).
12. Tracking que no se activa o nunca muestra recogida; envíos agrupados con varios días de retraso.
13. Cuotas mensuales altas antes de ver catálogo, o suscripción difícil de cancelar (quejas de cobros tras cancelar, según Trustpilot citado por blogs en la ronda 12, [BLOG]).
14. Sin política de devoluciones UE o devolución a un almacén en China/EE. UU.
15. Catálogo sin declaración CE ni responsable UE en productos que lo requieren (electrónica, iluminación, juguetes).
16. Soporte que tarda más de 48 h o contesta con plantillas sin responder a las preguntas.
17. Muestra distinta del lote entregado (bait and switch).
18. Contenido de blog o YouTube con enlace de afiliado como única prueba de su fiabilidad.

Nota: esta lista es criterio profesional general, [BLOG]-nivel de evidencia: no se ha citado una fuente oficial por cada punto.

---

## 4. Las 6 preguntas por escrito antes de pagar

1. Stock: ¿cuántas unidades hay hoy de este SKU, en qué almacén (país y ciudad) y cómo se actualiza el stock?
2. Plazo de preparación: ¿en cuántos días laborables entregáis el pedido al transportista desde que se paga, y qué transportista usáis con seguimiento?
3. Factura: ¿emitís factura con IVA a mi NIF? ¿Cuál es vuestro VAT y la razón social que aparecerá?
4. Devoluciones: ¿cuál es vuestra política de devoluciones y reembolsos (14 días UE), quién paga el retorno y a qué dirección en la UE se devuelve?
5. Marca y conformidad: ¿el producto es de marca registrada ajena? ¿Tiene marcado CE y declaración de conformidad? ¿Quién es el responsable en la UE (GPSR)?
6. Seguimiento: ¿podéis enviarme el número de seguimiento de un envío reciente a España de este mismo producto y confirmar cuándo se subirá el tracking en mis pedidos?

### Plantilla de correo (español)

Asunto: Consulta previa de condiciones para vender [categoría] en España

Hola, equipo de [Proveedor]:

Soy [nombre], [autónomo / titular de la tienda X] y quiero trabajar con vosotros para vender [producto/SKU, enlace] en España. Antes de dar de alta nada necesito confirmar por escrito lo siguiente:

1. Stock: unidades disponibles hoy de [SKU], almacén (país y ciudad) y cómo se actualiza.
2. Plazo de preparación: días laborables desde el pago hasta la entrega al transportista y transportista con seguimiento.
3. Factura: si emitís factura con IVA a mi NIF [NIF], vuestro VAT y razón social.
4. Devoluciones: política de devoluciones y reembolsos (14 días UE), quién asume el retorno y la dirección de devolución en la UE.
5. Marca y conformidad: si el producto es de marca registrada ajena, si lleva marcado CE y declaración de conformidad y quién es el responsable en la UE.
6. Seguimiento: un número de seguimiento de un envío reciente a España del mismo producto y cuándo se subirá el tracking.

Si podéis, adjuntad vuestras condiciones generales. Os agradeceré una respuesta por correo en las próximas 24 horas laborables; no haré ningún pago hasta tener estas respuestas.

Gracias, un saludo.
[Nombre y apellidos] · [NIF] · [teléfono]

Cómo puntuar la respuesta: respuesta completa y concreta en <= 24 h laborables = punto 11 en 2; respuesta en 24-72 h o parcial = 1; sin respuesta o evasiva = 0.

---

## 5. Aplicación a BigBuy, CJ Dropshipping y Printful (con lo comprobable hoy)

Puntuación: máx. 2 por punto; [BLOG] máx. 1; no leído = 0. Los puntos 11, 12 y 14 dependen de la persona y están en 0.

### 5.1 BigBuy (bigbuy.eu): 2/30, NO HOMOLOGADO (sin evidencia)
Acceso: WebFetch a `bigbuy.eu/es/`, `/en/` y `/en/what-is-bigbuy.html` dio 403 el 27/10/2026. Todo lo siguiente viene de WebSearch.

| # | Punto | Pts | Dato y etiqueta |
|---|---|---|---|
| 1 | Entidad | 0 | Un directorio (elreferente.es) lo sitúa en Aldaia, Valencia; ninguna fuente confirma la razón social ("Dropshipping Network S.L." no confirmada). [BLOG] / [NO VERIFICADO] la razón social |
| 2 | VIES | 0 | [NO VERIFICADO]: no hay VAT leído y VIES no resuelve hoy |
| 3 | Registro | 0 | [NO VERIFICADO] |
| 4 | Almacén | 1 | "Almacén de 20.000 m2 en Valencia" según un resultado de buscador. [BLOG] |
| 5 | Antigüedad | 1 | Fundación 2010 o 2013 según fuentes distintas; en ambos casos > 2 años. [BLOG] |
| 6 | Reseñas | 0 | Ronda 12 recogió quejas de sincronización de stock y soporte lento (Trendtrack, [BLOG]); no se ha leído ninguna puntuación independiente. [NO VERIFICADO] |
| 7 | Devoluciones | 0 | [NO VERIFICADO] |
| 8 | Factura IVA | 0 | [NO VERIFICADO] |
| 9 | Marca | 0 | [NO VERIFICADO]: depende del SKU |
| 10 | CE/GPSR | 0 | [NO VERIFICADO]: depende del SKU |
| 11 | 24 h | 0 | Persona |
| 12 | Tracking | 0 | Persona |
| 13 | Stock/plazo escrito | 0 | Blogs de la ronda 12 hablan de 24-48 h / 48-72 h (Trendtrack, Copyfy, [BLOG], 27/10/2026); no es compromiso escrito |
| 14 | Pago | 0 | Persona |
| 15 | Condiciones/integración | 0 | Cuotas de 69-120 €/mes y alta 90 € discrepan entre blogs; conector TikTok Shop ES: [NO VERIFICADO] |

Qué falta para subir: leer la web oficial desde el navegador de la persona (aviso legal, tarifas, plazos, devoluciones), VIES, y las 6 preguntas.

### 5.2 CJ Dropshipping (cjdropshipping.com): 5/30, NO HOMOLOGADO
Acceso: portada y `/integrations/tiktok-shop` se leen; `/dispute-policy.html` y `/global-warehouses` redirigen a `frontend.cjdropshipping.com` (bloqueado).

| # | Punto | Pts | Dato y etiqueta |
|---|---|---|---|
| 1 | Entidad | 0 | La portada solo muestra "(c)2026 CJdropshipping.com All Rights Reserved" y el registro ICP chino de sitio web (浙ICP备2020040134号-1), que no identifica la empresa. Sin razón social ni domicilio. [OFICIAL https://cjdropshipping.com/] |
| 2 | VIES | 0 | [NO VERIFICADO]: no hay VAT publicado en lo leído; una empresa china no tiene CIF español |
| 3 | Registro | 0 | [NO VERIFICADO]; WebSearch no identificó la entidad legal |
| 4 | Almacén | 1 | "10+ Global Warehouses" sin ubicaciones [OFICIAL portada]; "Ship from China, US, or EU hubs" [OFICIAL /integrations/tiktok-shop]. Sin dirección ni país UE. Un listado de GetApp cita Alemania entre otros [BLOG] |
| 5 | Antigüedad | 1 | Fundación 2014, 2015 o 2000 según fuentes distintas (edesk, Spocket, GetApp). [BLOG] |
| 6 | Reseñas | 1 | Trustpilot sin puntuación por retirada de reseñas falsas (edesk, consultado 31/07/2026); Shopify App Store 4,9 (2.518) y App Store EE. UU. 4,0 (271) (edesk); RevenueGeeks (jul 2026) 3,5/5. [BLOG] |
| 7 | Devoluciones | 0 | Existe un enlace "Refund, Resend and Returns" [OFICIAL portada] pero la página no se pudo leer. Contenido [NO VERIFICADO] |
| 8 | Factura IVA | 0 | Portada: no se menciona [OFICIAL]. [NO VERIFICADO] |
| 9 | Marca | 0 | [NO VERIFICADO]: depende del SKU |
| 10 | CE/GPSR | 0 | [NO VERIFICADO]: depende del SKU |
| 11 | 24 h | 0 | Persona (la portada anuncia soporte 24/7; no probado) |
| 12 | Tracking | 0 | Persona |
| 13 | Stock/plazo escrito | 1 | Envío exprés 2-5 días o económico 10-20 días [OFICIAL /integrations/tiktok-shop]; son plazos de transporte genéricos, no un compromiso de preparación por SKU |
| 14 | Pago | 0 | Persona |
| 15 | Condiciones/integración | 1 | Integración TikTok Shop: sincroniza pedidos, inventario y precios, se autoriza en Seller Center; no menciona España ni la UE como mercado de venta, ni cuotas [OFICIAL /integrations/tiktok-shop] |

Alerta propia del protocolo: sin entidad europea identificada, la factura con IVA (punto 8) y el responsable GPSR (punto 10) quedan abiertos; sin ellos no puede superar la nota.
Qué falta para subir: leer política de devoluciones y almacenes desde el navegador de la persona, pregunta 3 (factura/VAT) y 5 (responsable UE), y confirmar si hay stock en la UE para el SKU concreto.

### 5.3 Printful (printful.com): 2/30, NO HOMOLOGADO
Acceso: `printful.com`, `www.printful.com` y `help.printful.com` no resuelven (ENOTFOUND) con WebFetch ni curl el 27/10/2026. Todo viene de WebSearch.

| # | Punto | Pts | Dato y etiqueta |
|---|---|---|---|
| 1 | Entidad | 0 | [NO VERIFICADO] (ronda 12: sede en Letonia según blogs, no leída en fuente oficial) |
| 2 | VIES | 0 | [NO VERIFICADO] |
| 3 | Registro | 0 | [NO VERIFICADO] |
| 4 | Almacén | 1 | Producción en Europa, sede en Letonia (ronda 12, [BLOG]); direcciones no leídas |
| 5 | Antigüedad | 1 | Un anuncio de Printful sobre TikTok Shop UK es de 2022 (título y URL en WebSearch, printful.com/news, no leído). [BLOG] |
| 6 | Reseñas | 0 | Ronda 12: una reseña negativa en Shopify (ene 2026) por demoras; sin puntuación leída. [NO VERIFICADO] |
| 7 | Devoluciones | 0 | [NO VERIFICADO] |
| 8 | Factura IVA | 0 | [NO VERIFICADO] |
| 9 | Marca | 0 | [NO VERIFICADO]: el riesgo es del diseño propio, no del proveedor |
| 10 | CE/GPSR | 0 | [NO VERIFICADO] |
| 11 | 24 h | 0 | Persona |
| 12 | Tracking | 0 | Persona |
| 13 | Stock/plazo escrito | 0 | "5 días a España" (blog español 2026, ronda 12, [BLOG]); no se sabe si el plazo de producción cabe en los 2 días laborables de TikTok |
| 14 | Pago | 0 | Persona |
| 15 | Condiciones/integración | 0 | El blog de Printful, vía resumen de WebSearch (no leído), indica que la integración directa con TikTok Shop solo admite cuentas de EE. UU. y Reino Unido; una guía de terceros recomienda la vía Shopify para el resto. Para España: [BLOG] negativo, no hay conector directo documentado |

Qué falta para subir: leer en navegador la ayuda de TikTok Shop de Printful y su lista de países; si no incluye España, la ruta pasa por Shopify (otro coste y otro riesgo de plazo).

### 5.4 Resumen comparado
| Proveedor | Nota hoy | Críticos (2, 8, 9, 10, 12) | Resultado | Siguiente paso de 0 € |
|---|---|---|---|---|
| BigBuy | 2/30 | todos en 0 | NO HOMOLOGADO por falta de evidencia | Persona: abrir aviso legal y tarifas en bigbuy.eu, VIES con su VAT, enviar el correo del apartado 4 |
| CJ Dropshipping | 5/30 | todos en 0 | NO HOMOLOGADO por falta de evidencia | Persona: leer política de devoluciones y almacenes, pedir entidad legal, VAT y responsable GPSR UE |
| Printful | 2/30 | todos en 0 | NO HOMOLOGADO por falta de evidencia | Persona: comprobar en su ayuda si TikTok Shop admite España; si no, valorar la ruta Shopify o descartar |

Nota sobre el alcance: estas notas bajas reflejan que no se ha podido leer ninguna fuente oficial de calidad, no que los proveedores sean fraudulentos. Ninguno muestra hoy una red flag roja leída; sí hay dos amarillas por fuente [BLOG] (Trustpilot de CJ sin puntuación; Printful sin conector directo documentado para ES). Esto cambia al pasar la persona los puntos 2, 3, 7, 8 y 10.

---

## Datos clave

| Producto | ID/URL | Coste € | PVP € (probado o propuesto) | Fuente del precio de mercado y fecha | Verificado (listado/ficha/persona) | Margen/pedido y supuestos | Veredicto |
|---|---|---|---|---|---|---|---|
| Protocolo de homologación (15 puntos, 30 pts) | este documento | 0 € | n/a | n/a | No aplica | n/a | Listo para usar; mínimo 24/30 y críticos > 0 |
| BigBuy (servicio) | https://www.bigbuy.eu (403 el 27/10/2026) | no verificado (69-120 €/mes en blogs, ronda 12) | n/a | no verificado | No (web oficial no abre; solo WebSearch) | No calculado (sin producto) | NO HOMOLOGADO 2/30, sin GO |
| CJ Dropshipping (servicio) | https://cjdropshipping.com/ y /integrations/tiktok-shop (leídas 27/10/2026) | no verificado | n/a | no verificado | Parcial: portada e integración leídas; políticas y almacenes no | No calculado (sin producto) | NO HOMOLOGADO 5/30, sin GO |
| Printful (servicio) | https://www.printful.com (DNS no resuelve el 27/10/2026) | no verificado (plan ~24-25 €/mes en blogs, ronda 12) | n/a | no verificado | No (solo WebSearch) | No calculado (sin producto) | NO HOMOLOGADO 2/30, sin GO |

- **Qué sabemos** (con fuente y fecha): CJ declara "10+ Global Warehouses", envíos desde "China, US, or EU hubs", exprés 2-5 días y económico 10-20 días, y una integración con TikTok Shop que se autoriza en Seller Center sin mencionar España ni la UE (cjdropshipping.com, leído 27/10/2026). La portada de CJ no muestra razón social ni VAT, solo un ICP chino. El resumen del blog de Printful indica integración TikTok solo para EE. UU. y Reino Unido (WebSearch, 27/10/2026, no leído). Trustpilot de CJ aparece sin puntuación (edesk, 31/07/2026, [BLOG]).
- **Qué asumimos** (y cómo se comprobaría): que BigBuy y Printful tienen entidad legal UE y factura con IVA (VIES y registro mercantil por la persona); que los plazos de blog son orientativos (pregunta 2 y pedido de prueba); que VIES y EUIPO funcionarán desde el navegador de la persona, pues esta sesión no los alcanza.
- **Qué cambiaría mi conclusión:** un VAT válido en VIES con razón social coincidente, una factura de muestra con IVA, el aviso legal oficial leído (BigBuy), la política de devoluciones de CJ con dirección UE, o una confirmación escrita de que Printful conecta con TikTok Shop ES. Al revés: un VAT inválido, pago exigido a persona física o la negativa a emitir factura descartan al proveedor.
