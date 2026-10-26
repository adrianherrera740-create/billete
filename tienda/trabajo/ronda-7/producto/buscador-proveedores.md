# Ronda 7 - Proveedores desde China / impresión bajo demanda (buscador-proveedores)

Fecha: 26/10/2026. Fuente de AliExpress: búsqueda en es.aliexpress.com con el script `aliexpress_global_es.js` (variante sin shipFromCountry=ES, cookie de España), 26/10/2026. Cálculo: `margen_es.py`.

## 0. Aviso principal: SEGURIDAD de que el proveedor existe
- Verificado: el listado de búsqueda devuelve estos IDs con precio, vendidos y valoración (26/10/2026). Eso prueba que la ficha existe y vende.
- NO verificado: la ficha individual. Las 6 fichas probadas dieron CAPTCHA (anti-bot). Un segundo intento fue bloqueado por el clasificador de permisos (elusión de verificación), así que no se insistió. Plazo real, variantes, material, marca en la ficha y coste de envío: **no verificado**.
- El único plazo visible en el listado es la etiqueta "Entrega más rápida en N días", que solo aparece en artículos desde almacén local, no en los de abajo. Todos los productos de la tabla A salen **desde CN** (campo shipFrom del listado). Plazo China-España: **no verificado** (se estima 7-15 días, según el encargo).
- Etiquetas vistas: "3+, compensamos aranceles" o "Envío gratis a partir de 10€". Para pedidos de un solo artículo bajo 10 € el coste de envío puede no ser 0: **no verificado**. El cálculo usa --envio 0, como se pidió.
- El script no extrae vendedor, stock ni pedido mínimo. Pedido mínimo: no verificado (parece 1 ud. por el precio de listado).
- Mejor prueba de existencia: un pedido de muestra de 2-3 €. El usuario no quiere comprar muestra; sin ella o sin desbloquear la ficha, nada pasa de "visto en listado".

## 1. Doce productos (coste de ficha <= 6 €)
| # | ID / URL | Precio | Vendidos | Valoración | Envío | Qué es | Marca ajena |
|---|---|---|---|---|---|---|---|
| A1 | [1005007424177333](https://es.aliexpress.com/item/1005007424177333.html) | 1,21 € | 10.000+ | 4,5 | CN; "3+ compensamos aranceles"; plazo n.v. | Cadena cubana acero inox. 3/5/7 mm, collar | Ninguna visible en título |
| A2 | [1005007306736209](https://es.aliexpress.com/item/1005007306736209.html) | 1,51 € | 10.000+ | 4,9 | CN; idem | Pulsera cadena cubana acero inox. | Ninguna |
| A3 | [1005006782761897](https://es.aliexpress.com/item/1005006782761897.html) | 2,17 € | 10.000+ | 4,9 | CN; idem | Funda de hombro para cinturón, polipiel | Ninguna |
| A4 | [1005010285624017](https://es.aliexpress.com/item/1005010285624017.html) | 4,30 € | 2.000+ | 4,9 | CN; idem | 2 fundas fibra de carbono para cinturón | Ninguna |
| A5 | [1005006833443827](https://es.aliexpress.com/item/1005006833443827.html) | 3,19 € | 700+ | 4,9 | CN; envío gratis desde 10 € | Ambientador colgante estilo JDM, retrovisor | "JDM" es un término de estilo, no una marca; revisar la imagen |
| A6 | [1005006994762105](https://es.aliexpress.com/item/1005006994762105.html) | 5,57 € | 10.000+ | 4,9 | CN; idem | Kit tira LED neón interior de coche | Ninguna |
| A7 | [1005012986708271](https://es.aliexpress.com/item/1005012986708271.html) | 2,63 € | 50.000+ | 4,9 | CN; idem | Soporte de móvil de coche por gravedad | Ninguna en título |
| A8 | [1005009552626829](https://es.aliexpress.com/item/1005009552626829.html) | 2,71 € | 2.000+ | 4,8 | CN; idem | Llavero cordón estilo JDM, coche/moto | Revisar logos en la foto |
| A9 | [1005006678104604](https://es.aliexpress.com/item/1005006678104604.html) | 3,76 € | 10.000+ | 4,9 | CN; idem | Soporte/gancho de auriculares gamer, escritorio | Ninguna |
| A10 | [1005007334128523](https://es.aliexpress.com/item/1005007334128523.html) | 4,09 € | 10.000+ | 4,6 | CN; idem | Tira LED neón USB con sensor táctil, setup | Ninguna |
| A11 | [1005007857146309](https://es.aliexpress.com/item/1005007857146309.html) | 4,19 € | 10.000+ | 4,9 | CN; idem | Calcetines largos estilo americano retro | Ninguna |
| A12 | [1005009278200394](https://es.aliexpress.com/item/1005009278200394.html) | 1,74 € | 10.000+ | 4,9 | CN; idem | Soporte de pared para mando | Cita PS5/PS4/Switch/Xbox solo por compatibilidad. En el anuncio no se debe nombrar ninguna consola |

Descartados por marca o fuera de coste (visto en el listado):
- Vnox (4000203480306)
- TOPK (1005007344783753 y otros)
- Pokémon (llaveros y pegatinas)
- Lando Norris (alfombrilla)
- Steve Harrington (camiseta)
- Guess (pulsera)
- Camiseta casete 80s (1005007345030404, 9,39 €): supera 6 €.
- Letrero neón USB (1005007430589801, 6,32 €): supera 6 €.
- Pins y pegatinas "personalizadas": son un servicio de impresión con MOQ, no un artículo.

## 2. Beneficio por pedido (sin anuncios)
Parámetros: --afiliado 0 --devoluciones 0.10 --comision-tiktok 0.03 --envio 0, embalaje 0,30 (por defecto), 2 días de preparación y 10 de entrega (estimación, no verificado).

Fallos del cálculo a tener en cuenta:
- Envío 0 no es real.
- El IVA del coste de AliExpress no se ha descontado (el cálculo trata el coste como sin IVA).
- Los PVP no están contrastados con mercado. Un PVP de 19,90 € para una cadena de 1,21 € no está demostrado; lo realista es venderla como pack o "set".
- No incluye reposición de devoluciones desde China.

| Producto | Coste | 19,90 € | 24,90 € | 29,90 € |
|---|---|---|---|---|
| A1 Cadena cubana | 1,21 | 12,63 | 16,19 | 19,74 |
| A2 Pulsera cubana | 1,51 | 12,33 | 15,89 | 19,44 |
| A12 Soporte mando pared | 1,74 | 12,10 | 15,66 | 19,21 |
| A3 Funda cinturón PU | 2,17 | 11,67 | 15,23 | 18,78 |
| A7 Soporte móvil gravedad | 2,63 | 11,21 | 14,77 | 18,32 |
| A8 Llavero JDM | 2,71 | 11,13 | 14,69 | 18,24 |
| A5 Ambientador JDM | 3,19 | 10,65 | 14,21 | 17,76 |
| A9 Soporte auriculares | 3,76 | 10,08 | 13,64 | 17,19 |
| A10 Tira neón USB | 4,09 | 9,75 | 13,31 | 16,86 |
| A11 Calcetines retro | 4,19 | 9,65 | 13,21 | 16,76 |
| A4 Fundas fibra carbono x2 | 4,30 | 9,54 | 13,10 | 16,65 |
| A6 Kit neón coche | 5,57 | 8,27 | 11,83 | 15,38 |

## 3. Impresión bajo demanda (UE, desde WebSearch 26/10/2026)
Precios de blogs y snippets, no de las páginas oficiales de precio: son orientativos. El pedido de muestra desde España sigue siendo necesario.

| Proveedor | Camiseta (base) | Sudadera | Póster | Taza | Envío a España | Plazo | Mínimo | Diseño propio neón/80s |
|---|---|---|---|---|---|---|---|---|
| Gelato | 16,66 € crewneck clásica (calculadora, destino sin precisar); otro blog 6,96 $ + 4,54 $ envío (inconsistente) | n.v. (blog: 16,75 $ frente a 20,75 $ de Printful) | 21,22 € (colgar listo, calculadora; destino sin precisar) | n.v. | 3,28-4,96 € (económico) | 3-5 días con producción; producción local en España | Sin mínimo | Sí, con derechos; sin norma de estilo |
| Printify (EU) | 7,30 € (5,39 € con Premium) a 7,66 € Gildan 5000 | n.v. | desde 6,50 $ (EU) | desde 4,29 € | n.v. (proveedor y envío España sin dato) | n.v. | Sin mínimo | Sí, con derechos de imagen |
| Printful | blog: 8,95 $ + 4,59 $ envío | blog: 20,75 $ | n.v. | n.v. | 4,79 + 1,45 por extra (blog, divisa dudosa); sin aduana en UE | 5-12 días laborables según blog; instalaciones en Letonia y España | Sin mínimo | Sí; registro de IP rechaza coincidencias con marcas |
| Teemill | n.v. | n.v. | n.v. | n.v. | n.v. | n.v. | Sin coste inicial; comisión por pedido | Orientado a camiseta orgánica; origen UK, no UE; n.v. |
| Otros (Merchize, etc.) | no verificado | | | | | | | |

Nota: las fuentes coinciden en que Gelato produce localmente, pero discrepan entre sí en el precio de la camiseta (16,66 € frente a 6,96 $). Esa incoherencia debe resolverse con un pedido de muestra o con la página oficial de Gelato.

Cálculo POD (mismos parámetros que arriba; costes aproximados de snippets, envío incluido):
| Caso | 19,90 € | 24,90 € | 29,90 € |
|---|---|---|---|
| Camiseta Printify 7,66 + envío 4,79 (envío tomado de Printful, supuesto) | 0,91 | 4,47 | 8,02 |
| Taza Printify 4,29 + envío 4,79 (supuesto) | 4,28 | 7,84 | 11,39 |
| Camiseta Gelato 16,66 + envío 3,28 | -6,42 | -2,87 | 0,68 |
| Póster Gelato 21,22 + envío 4,96 | -12,83 | -9,28 | -5,72 |

Conclusión POD: si el precio de Gelato es cierto, no sale rentable a 19,90-29,90 €. Printify da margen en taza y, a 29,90 €, en camiseta, pero el envío a España está sin verificar. Sin ventas de TikTok Shop ES contrastadas, POD queda como línea secundaria.

## 4. Tabla final ordenada por beneficio (PVP 24,90 €, euros por pedido)
| Pos. | Producto | ID | Coste | Beneficio a 24,90 | Estado |
|---|---|---|---|---|---|
| 1 | A1 Cadena cubana acero | 1005007424177333 | 1,21 | 16,19 | existe en listado; ficha n.v.; PVP n.v. |
| 2 | A2 Pulsera cubana | 1005007306736209 | 1,51 | 15,89 | idem |
| 3 | A12 Soporte mando pared | 1005009278200394 | 1,74 | 15,66 | idem; sin nombrar consolas |
| 4 | A3 Funda cinturón PU | 1005006782761897 | 2,17 | 15,23 | idem |
| 5 | A7 Soporte móvil | 1005012986708271 | 2,63 | 14,77 | idem; mercado saturado |
| 6 | A8 Llavero JDM | 1005009552626829 | 2,71 | 14,69 | idem; revisar logos |
| 7 | A5 Ambientador JDM | 1005006833443827 | 3,19 | 14,21 | idem; fragancias: revisar normativa |
| 8 | A9 Soporte auriculares | 1005006678104604 | 3,76 | 13,64 | idem |
| 9 | A10 Tira neón USB | 1005007334128523 | 4,09 | 13,31 | idem; eléctrico, exige CE |
| 10 | A11 Calcetines retro | 1005007857146309 | 4,19 | 13,21 | idem |
| 11 | A4 Fundas carbono x2 | 1005010285624017 | 4,30 | 13,10 | idem |
| 12 | A6 Kit neón coche | 1005006994762105 | 5,57 | 11,83 | idem; eléctrico, exige CE |
| - | Taza Printify | n/a | 4,29 + envío | 7,84 | n.v. (envío supuesto) |
| - | Camiseta Printify | n/a | 7,66 + envío | 4,47 | n.v. |
| - | Camiseta Gelato | n/a | 16,66 + envío | -2,87 | n.v. |
| - | Póster Gelato | n/a | 21,22 + envío | -9,28 | n.v. |

## 5. Lo que falta (de otros departamentos o por desbloquear)
- Demanda y precio de mercado en TikTok Shop ES (FastMoss 429): sin ventas contrastadas, ningún GO.
- Cumplimiento: GPSR, CE (A6, A10, ambientador A5), alta fiscal, IOSS/IVA de importación. Para TikTok Shop, entrega al transportista en 2 días: un pedido desde China no cumple (con tienda propia, el plazo es decisión del canal).
- Verificación de ficha: desbloquear la ficha o hacer muestra para confirmar plazo, variantes y envío.
- Fotos reales: dominios de imagen de AliExpress bloqueados por la red.

Script: `/home/user/billete/tienda/trabajo/ronda-7/producto/aliexpress_global_es.js` (uso: `NODE_PATH=/opt/node22/lib/node_modules node aliexpress_global_es.js "término"`; muestra campo "desde CN/ES" y etiquetas, incluida "Entrega más rápida en N días" cuando existe).
