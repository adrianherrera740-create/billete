# Ronda 6 (high ticket 120-400 €): proveedores con envío desde España

Fecha de los datos: 26/10/2026. Fuente de todas las fichas: AliExpress ES, buscador con filtro `shipFromCountry=ES`, ordenado por ventas, script `.claude/skills/proveedor-es/scripts/aliexpress_es.js` (8 términos, 2 variantes cada uno; el CAPTCHA no saltó). Margen: `margen_es.py` con `--envio 0 --afiliado 0 --devoluciones 0.10 --dias-preparacion 2 --dias-entrega 5`. **Los 2 días de preparación y los 5 de entrega son ESTIMACIÓN, no dato del proveedor.** Embalaje 0,30 € (valor por defecto del script). El precio de AliExpress se usa como coste tal cual (con IVA, sin deducir; no verificado si factura con IVA deducible).

## Conclusión corta

1. Sí hay fichas con envío desde España y ventas, pero **ninguna es una ficha "sin marca" pura**: casi todas llevan marca del vendedor (Magcubic, WOLFBOX, SucceBuy, HOMCOM, DUPI, Mars Gaming...). Marcas reconocidas (SONGMICS, VASAGLE, VEVOR, REDTIGER, DDPAI) las he descartado como marca ajena. Las demás las marco como "marca del vendedor: riesgo a decidir".
2. El coste real de lo que vende bien está en 25-130 €, no en 60-200 €. Con PVP = 2× coste sale ticket de 100-264 €; con 1,6× casi todo cae por debajo de 120 € y el margen se queda en ~9 % con comisión del 4 % y ~4 % con la del 9 % (ver tabla).
3. **Stock, plazo de preparación, peso real, mínimo y garantía: no verificados en ninguna ficha.** "Seguro de que el proveedor existe con stock en España" NO se puede dar solo con la búsqueda; solo se vería con un pedido de prueba.

## Fichas por término (2 mejores por término)

Etiquetas = las que muestra el listado. "Envío gratis" y "Entrega más rápida en N días" son del listado de AliExpress, no un compromiso de envío del vendedor ni plazo de preparación. Peso/medidas/potencia = solo lo que dice el título (visible); si no aparece, "no indica".

| Término | # | ID / URL | Precio | Vendidos | Valoración | Etiquetas envío/entrega | Título: peso/medidas/potencia | Notas |
|---|---|---|---|---|---|---|---|---|
| silla gaming ergonómica | 1 | [1005007588510992](https://es.aliexpress.com/item/1005007588510992.html) | 66,66 € | 4.000+ | 4,4 | Top ventas, Envío gratis | no indica | Genérica, polipiel. Mínimo en 30 días 79,99 € |
| silla gaming ergonómica | 2 | [1005007576945921](https://es.aliexpress.com/item/1005007576945921.html) | 57,76 € | 3.000+ | 4,6 | Top ventas, Envío gratis | no indica | Marca vendedor T-Lovendo |
| escritorio gaming | 1 | [1005007953913317](https://es.aliexpress.com/item/1005007953913317.html) | 49,89 € | 677 | 4,5 | Envío gratis desde 10,9 €, entrega más rápida 4 días | 120x60 cm | Marca vendedor DUPI; LED no indicado |
| escritorio gaming | 2 | [1005007606330688](https://es.aliexpress.com/item/1005007606330688.html) | 74,90 € | 321 | 4,6 | Envío gratis | no indica | Marca vendedor Habitdesign |
| escritorio elevable eléctrico | 1 | [1005012461300422](https://es.aliexpress.com/item/1005012461300422.html) | 88,11 € | 173 | 4,4 | Envío gratis | no indica (motor/potencia no dicho; panel con memorias) | Genérica. Mínimo 30 días 109,99 € |
| escritorio elevable eléctrico | 2 | [1005007702935471](https://es.aliexpress.com/item/1005007702935471.html) | 60,87 € | 98 | 3,0 | no indica | altura 63-90 cm | Valoración baja; no confirmo que sea eléctrico |
| cockpit / soporte volante | 1 | [1005009131465136](https://es.aliexpress.com/item/1005009131465136.html) | 64,69 € | 1.000+ | 4,7 | Top ventas, entrega más rápida 2 días | no indica | Es SOPORTE plegable, no cockpit. El título cita Logitech G27/G29 solo por compatibilidad (volante no incluido): hay que reescribir el título. Marca vendedor SucceBuy |
| cockpit / soporte volante | 2 | [1005008293881382](https://es.aliexpress.com/item/1005008293881382.html) | 68,39 € | 196 | 4,5 | Entrega más rápida 4 días, Envío gratis | no indica | Universal plegable, SucceBuy |
| proyector 1080p | 1 | [1005008385216265](https://es.aliexpress.com/item/1005008385216265.html) | 90,69 € | 50.000+ | 4,9 | Envío 30 oct-2 nov, Envío gratis | 1080P nativo; potencia en vatios no indica | Marca Magcubic. Mínimo 30 días 111,46 €. CE y batería no verificados |
| proyector 1080p | 2 | [1005012939939735](https://es.aliexpress.com/item/1005012939939735.html) | 95,81 € | 10.000+ | 4,9 | Envío 30 oct-2 nov, Envío gratis | 900 ANSI, 1080P nativo | Magcubic HY350Max. CE y batería no verificados |
| dashcam coche 4K | 1 | [1005012471498009](https://es.aliexpress.com/item/1005012471498009.html) | 131,99 € | 391 | 5,0 | Entrega más rápida 2 días, Envío gratis | pantalla 10", 4K, FOV 140 | WOLFBOX (marca): **ojo, posible marca ajena**. Batería/supercondensador y CE no verificados: por tu regla, descartable |
| dashcam coche 4K | 2 | [1005005637558036](https://es.aliexpress.com/item/1005005637558036.html) | 141,39 € | 121 | 4,1 | Entrega más rápida 4 días, Envío gratis | 4K, sensor STARVIS 2 | REDTIGER (marca ajena): descartada por marca; batería no verificada |
| soporte monitor doble brazo | 1 | [1005012536313733](https://es.aliexpress.com/item/1005012536313733.html) | 25,76 € | 196 | 4,9 | Entrega más rápida 2 días, Envío gratis | 13-27", portátil hasta 17", máx. 8 kg | Genérica. Sin batería |
| soporte monitor doble brazo | 2 | [1005007709615380](https://es.aliexpress.com/item/1005007709615380.html) | 32,89 € | 480 | 4,7 | Envío gratis | hasta 27", VESA 75/100 | Marca Mars Gaming (marca de terceros: riesgo) |
| mesa gaming con led | 1 | [1005008515883197](https://es.aliexpress.com/item/1005008515883197.html) | 74,15 € | 20 | 4,0 | Entrega más rápida 2 días, Envío gratis | 100x60 cm, luces LED, tomas | HOMCOM (marca ajena): descartable. Ventas muy bajas |
| mesa gaming con led | 2 | [1005007953913317](https://es.aliexpress.com/item/1005007953913317.html) | 49,89 € | 677 | 4,5 | ver arriba | 120x60 cm | Repetida del escritorio gaming; LED NO indicado en el título. No hay otra mesa con LED con ventas |

Descartados por marca ajena: SONGMICS (IDs 1005008223594996, 1005008223972151, 1005009680024228), VASAGLE (1005010416290561, 1005010568281075), VEVOR (1005007271302189, 1005010658794472, 1005011608627610), DDPAI (1005013010621000), Logitech (no aparece como producto). También aparecen WOLTU, NOX y NB (North Bayou) como marcas con identidad propia.

Cockpits completos (las únicas fichas de 190-290 €): Indeca PRO RACER GTR [1005010590720711](https://es.aliexpress.com/item/1005010590720711.html) 269,95 €, 7 vendidos, 4,5 estrellas; NANORS [1005007974800518](https://es.aliexpress.com/item/1005007974800518.html) 289,89 €, sin ventas ni valoración. Demasiado poca prueba de venta para proponerlos.

## Margen de la mejor ficha de cada término

Beneficio por pedido en €, sin anuncios, entrega 0 €. Comisión 4 % (tienda nueva) / 9 %. Pedidos/mes para cubrir 500 € de anuncios = 500 / beneficio, redondeado hacia arriba (cubre SOLO los anuncios, sin ganar nada).

| Mejor ficha | Coste | PVP 1,6× | Benef. 4 % / 9 % | Pedidos/mes (4 % / 9 %) | PVP 2× | Benef. 4 % / 9 % | Pedidos/mes (4 % / 9 %) |
|---|---|---|---|---|---|---|---|
| silla gaming 1005007588510992 | 66,66 | 106,66 | 7,97 / 3,56 | 63 / 141 | 133,32 | 26,69 / 21,19 | 19 / 24 |
| escritorio gaming DUPI 1005007953913317 | 49,89 | 79,82 | 5,88 / 2,58 | 86 / 194 | 99,78 | 19,90 / 15,78 | 26 / 32 |
| elevable 1005012461300422 | 88,11 | 140,98 | 10,63 / 4,80 | 48 / 105 | 176,22 | 35,38 / 28,10 | 15 / 18 |
| soporte volante 1005009131465136 | 64,69 | 103,50 | 7,72 / 3,44 | 65 / 146 | 129,38 | 25,90 / 20,55 | 20 / 25 |
| proyector L018 1005008385216265 | 90,69 | 145,10 | 10,94 / 4,94 | 46 / 102 | 181,38 | 36,43 / 28,93 | 14 / 18 |
| dashcam WOLFBOX 1005012471498009 | 131,99 | 211,18 | 16,06 / 7,33 | 32 / 69 | 263,98 | 53,15 / 42,24 | 10 / 12 |
| doble brazo 1005012536313733 | 25,76 | 41,22 | 2,90 / 1,19 | 173 / 421 | 51,52 | 10,13 / 8,00 | 50 / 63 |
| mesa LED HOMCOM 1005008515883197 | 74,15 | 118,64 | 8,89 / 3,99 | 57 / 126 | 148,30 | 29,73 / 23,60 | 17 / 22 |

A 1,6× el margen es ~9 % (4 % de comisión) o ~4 % (9 %): no deja sitio para anuncios (mínimo del proyecto 25 %). Solo a 2× se llega a ~24 % / ~19 %. Con 500 € de anuncios hacen falta 10-25 pedidos al mes a 2× en el mejor caso, pero con CPA real: ese número solo cubre la inversión, no es beneficio.

## Tabla final, ordenada por beneficio (PVP 2×, tienda nueva 4 %)

| # | Producto (mejor ficha) | ID | Coste | PVP 2× | Beneficio/pedido (4 % / 9 %) | Pedidos para 500 € | Riesgos |
|---|---|---|---|---|---|---|---|
| 1 | Dashcam 4K WOLFBOX G930 | 1005012471498009 | 131,99 | 263,98 | 53,15 / 42,24 | 10 / 12 | Marca ajena posible; electrónica con posible batería y CE sin verificar. PVP > 150 € sobre un precio de AliExpress de 131,99 €, que el cliente puede comparar |
| 2 | Proyector Magcubic L018 | 1005008385216265 | 90,69 | 181,38 | 36,43 / 28,93 | 14 / 18 | Marca del vendedor; CE sin verificar; 50.000+ ventas en AliExpress = precio de referencia visible |
| 3 | Escritorio elevable eléctrico | 1005012461300422 | 88,11 | 176,22 | 35,38 / 28,10 | 15 / 18 | Sin peso ni medidas en el título; 173 ventas; voluminoso (devoluciones y transporte no verificados) |
| 4 | Mesa gaming LED HOMCOM | 1005008515883197 | 74,15 | 148,30 | 29,73 / 23,60 | 17 / 22 | Marca ajena, 20 ventas |
| 5 | Silla gaming ergonómica | 1005007588510992 | 66,66 | 133,32 | 26,69 / 21,19 | 19 / 24 | Genérica, 4.000+ ventas, 4,4 estrellas; voluminosa |
| 6 | Soporte de volante plegable | 1005009131465136 | 64,69 | 129,38 | 25,90 / 20,55 | 20 / 25 | Título cita Logitech; es soporte, no cockpit |
| 7 | Escritorio gaming DUPI | 1005007953913317 | 49,89 | 99,78 | 19,90 / 15,78 | 26 / 32 | PVP < 120 € a 2×; sin LED |
| 8 | Soporte monitor doble brazo | 1005012536313733 | 25,76 | 51,52 | 10,13 / 8,00 | 50 / 63 | No es high ticket (PVP 52 €) |

Solo 1-5 llegan a PVP >= 120 € a 2×. Ninguna ficha llega a 120 € con 1,6× excepto dashcam, proyector y elevable (141-211 €), con margen del 9 %.

## Acceso a proveedores (solo acceso, con HTTPS_PROXY, 26/10/2026)

- `https://www.bigbuy.eu`: **403** con `cf-mitigated: challenge` (Cloudflare). Bloqueado para bots, no verificable.
- `https://www.cjdropshipping.com`: el proxy rechaza el túnel (curl 56, CONNECT 403). `https://cjdropshipping.com` (sin www): **HTTP 200** en cabeceras. Responde, pero solo he comprobado acceso; no he leído catálogo, stock en almacén UE ni precios.

## Lo que NO puedo verificar

- Stock real en España de cada ficha (el filtro `shipFromCountry=ES` solo indica origen declarado).
- Plazo de preparación (los "2 días" del margen son estimación) y plazo de entrega real (las etiquetas de AliExpress son del listado).
- Peso real, medidas completas y potencia: solo lo que dice el título (arriba); el resto, no verificado.
- Pedido mínimo, garantía legal de 3 años en la UE, factura con IVA deducible, GPSR/CE de electrónica y política de devoluciones del vendedor.
- Demanda en TikTok Shop ES y precio de mercado en España (FastMoss sigue sin datos; no consultado en esta ronda).
- Que cada vendedor acepte dropshipping con tu marca blanca/sin factura de AliExpress en el paquete.

Para tener certeza de que el proveedor existe y tiene stock hace falta: un pedido de prueba o mensaje al vendedor con respuesta por escrito (stock, preparación, factura). Eso es de operaciones, no lo he hecho.
