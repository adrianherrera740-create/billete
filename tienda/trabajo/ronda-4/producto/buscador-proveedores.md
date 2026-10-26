# Ronda 4 - Proveedores para público GTA VI (buscador-proveedores)

Fecha de los datos: 26/10/2026. Fuente única: búsqueda de AliExpress ES con filtro `shipFromCountry=ES`, orden por ventas, vía `.claude/skills/proveedor-es/scripts/aliexpress_es.js` (24 búsquedas, 2 variantes por término, sin CAPTCHA). Cálculo con `scripts/margen_es.py --tienda-nueva --afiliado 0 --devoluciones 0.05 --dias-preparacion 2 --dias-entrega 5`.

## Qué se puede y qué NO se puede verificar (vale para todas las fichas)

Verificado (de la página de resultados, 26/10/2026): URL con ID, precio en €, vendidos, valoración, etiquetas de entrega/envío y título (cortado a ~80 caracteres).
NO verificado:
- La ficha individual no se abre (`alicdn.com`/anti-bot bloqueados, ver CLAUDE.md). Por tanto no se ha leído: almacén real de origen (solo consta que aparece bajo el filtro "envío desde España"), stock, pedido mínimo, variantes, fotos, descripción ni IVA/factura del vendedor.
- Días de preparación: no verificado. Los 2 de preparación y los 5 de entrega del cálculo son ESTIMACIÓN. Etiquetas leídas: "Entrega más rápida en 2-4 días" (promesa del buscador) y "Envío: 30 OCT - 02 NOV" / "01 - 06 NOV" (fecha estimada, 4-11 días desde hoy).
- "Envío gratis" aparece solo en algunas fichas. Donde pone "Envío gratis a partir de 10,9 €" o no hay etiqueta, el coste de envío del pedido unitario es no verificado; en el cálculo se usó envío 0 y se marca.
- El precio de AliExpress incluye IVA; se usa entero como coste (criterio prudente de la skill). Los "vendidos" suman todas las variantes y el histórico, no son ventas en TikTok Shop (FastMoss sigue bloqueado: sin datos de ventas de TikTok ES).
- Marcado CE, composición y seguridad: no verificables sin la ficha. Las joyas "acero inoxidable" y los productos de contacto con la piel necesitan documentación del vendedor.
- El filtro parece dejar pasar fichas dudosas (p. ej. un kit con "100K+ vendidos" a 6,19 €). Hasta tener una muestra o captura de la ficha con "Envío desde España", no hay GO.

Criterio de marca: descarto fichas cuyo título cita fabricante/marca ajena (Mars Gaming, Savage Raven, Blackfire, Victsing, IPSDI, KROM, Totto, Ewent, Zimmy, Almalux, TEMCO, TOPK, Sanda, Ociodual, JARAPA, REINO MANSIDI, SucceBuy, PDP, Playseat, Coronel Tapiocca, Carttiya, Purpura Home), "licencia oficial" o nombre de plataforma de la que dependen. Los nombres de consola (PS5, PlayStation, Sony, Nintendo, MagSafe) en el título se tratan como marca ajena: se anotan y se descarta la ficha.

## Resultados por término (2 mejores fichas)

Formato: URL | precio | vendidos | valoración | etiquetas | notas.

### 1. Mochila antirrobo USB (búsquedas: "mochila antirrobo usb", "mochila antirrobo")
- MEJOR https://es.aliexpress.com/item/1005010137877255.html | 17,99 € | 52 | 4,9 | Precio más bajo 30 días 19,99 € · Envío gratis | Título: "Mochila Portátil Mujer, 15.6 Pulgadas Impermeable Antirrobo". No consta USB en el título visible: USB no verificado. Sin marca. Pocas ventas.
- https://es.aliexpress.com/item/1005007717286068.html | 20,75 € | 91 | 4,8 | Entrega más rápida en 3 días (envío no indicado) | "Mochila antirrobo impermeable para mujer 14,8 L, convertible en bolso". Sin USB visible. Sin marca.
- Descartadas: 1005008198259636 (puerto USB pero título cita "Coronel Tapiocca"); 1005007584126174 / 1005007588641304 (3.000+ vendidos, pero son mochilas de cabina y el título cita Vueling, EasyJet, Ryanair; no son antirrobo). Ninguna es un modelo "gaming/urbano" con USB verificado. Una mochila con puerto USB no lleva batería propia, pero hay que confirmarlo en ficha.

### 2. Organizador hueco asiento coche (búsquedas: "organizador hueco asiento coche", "organizador asiento coche")
- MEJOR https://es.aliexpress.com/item/1005013081040964.html | 9,29 € | 900+ | 4,9 | Envío gratis | "2 organizadores para espacio entre asientos de coche, de PU, universales, anti-f..." Son 2 unidades por 9,29 €: confirmar en ficha que el precio es del pack. Sin marca.
- https://es.aliexpress.com/item/1005013118368479.html | 13,90 € | 3.000+ | 4,9 | "3+, compensamos aranceles" · Envío gratis | Caja de almacenamiento para hendidura de asiento con organizador de consola. La etiqueta de aranceles sugiere importación: origen no verificado. Sin marca.

### 3. Soporte móvil coche magnético (búsquedas: "soporte móvil coche magnético", "soporte magnético coche")
- MEJOR https://es.aliexpress.com/item/1005012807945039.html | 11,66 € | 21 | 4,9 | Precio más bajo 30 días 12,26 € · Entrega más rápida en 2 días · Envío gratis | Soporte magnético con ventosa para salpicadero. Sin marca visible. Pocas ventas (21).
- https://es.aliexpress.com/item/1005012586096403.html | 12,26 € | 21 | 4,8 | Entrega más rápida en 2 días · Envío gratis | Mismo producto/otro vendedor. Sin marca visible.
- Descartada: 1005013056808551 (10,99 €, 26 vendidos) cita "MagSafe" (marca Apple); TEMCO, TOPK, Sanda con marca.

### 4. Cadena cubana acero inoxidable (búsquedas: "cadena cubana acero inoxidable", "collar cadena cubana")
No hay ficha exacta de cadena cubana (eslabón cubano) con envío desde España y datos fiables. Lo único con "cadena cubana" en el título es 1005007577263125 (collar corazón, 38,33 €, 3 vendidos, sin valoración): descartada por precio y falta de prueba.
- MEJOR (no exacta) https://es.aliexpress.com/item/1005013081772929.html | 7,29 € | 5.000+ | 4,9 | Envío gratis | Colgante de cruz de acero inoxidable, hombre y mujer. NO es cadena cubana; el eslabón no se ve en el título.
- https://es.aliexpress.com/item/1005013119690840.html | 8,39 € | 5.000+ | 4,9 | Envío gratis | "10 uds de cadenas de eslabones de acero inoxidable dorado de 50 cm y 2 m": es material de bisutería a granel, no un collar. Tipo de eslabón no verificado.
- Material "acero inoxidable" y grado (316L solo lo afirma DIEYURO, con marca): no verificado. Hace falta una ficha con foto del eslabón cubano antes de decidir.

### 5. Reposamuñecas teclado gaming (búsquedas: "reposamuñecas teclado gaming", "reposamuñecas teclado")
No hay un reposamuñecas de teclado puro; solo alfombrillas con reposamuñecas y bandejas.
- MEJOR (débil) https://es.aliexpress.com/item/1005007723074524.html | 5,15 € | 33 | 3,0 | Envío gratis a partir de 10,9 € (envío unitario no verificado) | Alfombrilla ergonómica con reposamuñecas. Valoración baja (3,0).
- Descartada: https://es.aliexpress.com/item/1005007613839224.html (5,87 €, 42 vendidos, sin valoración, entrega 2 días) cita "Ociodual". Victsing, IPSDI, UNICO, KROM también con marca. Bandeja SucceBuy 41,59 €: marca y precio.

### 6. Soporte pared consola mandos (búsquedas: "soporte pared consola mandos", "soporte pared mando ps5")
- MEJOR https://es.aliexpress.com/item/1005013119636665.html | 20,79 € | 5.000+ | 4,9 | Envío gratis | "Soporte universal para controlador de 3 capas y soporte para auriculares". Sin marca visible. Caro como coste.
- https://es.aliexpress.com/item/1005013153554335.html | 7,09 € | 50.000+ | 4,9 | Envío gratis | Estante de almacenamiento colgante de pared (título cortado; no confirma que sirva para consola/mandos). Sin marca.
- Descartadas: 1005013064024500 (soporte de auriculares básico, ya descartado); 1005007768195632 (cita PlayStation).

### 7. Cojín lumbar silla gaming (búsquedas: "cojín lumbar silla gaming", "cojín lumbar silla")
Ninguna ficha es un cojín lumbar gaming. No hay etiquetas de envío en esas fichas: envío y origen no verificados. No calculo margen.
- Más cercana, descartada por marca: https://es.aliexpress.com/item/1005009157750608.html | 16,89 € | 83 | 4,8 | sin etiqueta de envío | "Carttiya cojín coxis ergonómico 45x38x10 viscoelástico" (cojín de coxis, no lumbar; marca Carttiya).
- https://es.aliexpress.com/item/1005007616632802.html | 22,89 € | 114 | 4,8 | sin etiqueta | "Purpura Home" cojín antiescaras: marca y producto médico (excluido).

### 8. Kit limpieza teclado/consola (búsquedas: "kit limpieza teclado consola", "kit limpieza teclado")
La primera variante devuelve teclados, no kits. No hay kit de teclado/consola específico.
- MEJOR (no exacta) https://es.aliexpress.com/item/1005013082018973.html | 6,19 € | 100K+ | 4,9 | Envío gratis | "Juego de limpieza de puerto de carga para altavoz de teléfono móvil...": limpieza de puertos/altavoz de móvil, no de teclado. Sin marca. Cifra de 100K+ dudosa para un filtro "desde España".
- https://es.aliexpress.com/item/1005013081766361.html | 16,79 € | 50.000+ | 4,9 | Envío gratis | Paños de microfibra premium (teléfonos, gafas...). Sin marca; el precio sugiere pack grande, no verificado.
- Descartados: aire comprimido (Ewent, Zimmy y 1005007917081076 sin etiqueta de envío): aerosol presurizado, restricciones de transporte y marca.

### 9. Agarres funda mando (búsquedas: "agarres funda mando", "grips mando ps5")
Los resultados son fundas de Nintendo Switch (marca) y piezas de repuesto.
- MEJOR (débil) https://es.aliexpress.com/item/1005012732398490.html | 7,50 € | 6 | 5,0 | Envío gratis a partir de 10,9 € (envío unitario no verificado) | "Tapa de joystick convexa, juego de agarre para pulgar, cubierta para PS5, PS4, N..." Cita consolas en el título (compatibilidad). Solo 6 vendidos.
- https://es.aliexpress.com/item/1005013108097905.html | 11,69 € | 2.000+ | 4,9 | Envío gratis | "Joystick de efecto Hall analógico 3D para controlador PS5": es recambio electrónico interno, no un agarre; cita PS5; instalación por el cliente. No encaja.
- Descartadas: Savage Raven (marca), Blackfire/"Licencia Oficial" (marca/licencia), PDP Mario.

### 10. Funda asiento coche deportiva (búsquedas: "funda asiento coche deportiva", "fundas asientos coche")
Ninguna es verificable como "deportiva"; todas son universales. Coste demasiado alto para PVP 29,90-34,90.
- MEJOR https://es.aliexpress.com/item/1005013064606560.html | 25,99 € | 3.000+ | 4,9 | Envío gratis | Funda para asiento delantero, antideslizante, absorbe sudor. Probablemente 1-2 asientos: no verificado.
- https://es.aliexpress.com/item/1005013055155920.html | 31,99 € | 2.000+ | 4,9 | Envío gratis · 6 plazos sin intereses | Fundas universales de cinco plazas.
- Descartadas por marca: JARAPA, Dacada2005 ("Jarapas"), ENERFERO.

### 11. Soporte PS5 vertical (búsquedas: "soporte ps5 vertical", "soporte vertical ps5")
Las dos fichas viables citan marca ajena en el título, por lo que quedan descartadas; el margen se calcula solo como referencia.
- Referencia (DESCARTADA) https://es.aliexpress.com/item/1005007785981483.html | 10,13 € | 2 | sin valoración | Precio más bajo 30 días 11,95 € · Envío gratis a partir de 10,9 € · Entrega más rápida en 2 días | Título: "SOPORTE VERTICAL PARA SONY PLAYSTATION 5 PS5 ULTRA HD STAND REFRIGERACION". Cita SONY/PlayStation. 2 ventas: sin prueba de demanda.
- Referencia (DESCARTADA) https://es.aliexpress.com/item/1005007768195632.html | 28,08 € | 156 | 5,0 | Entrega más rápida en 2 días · Envío gratis a partir de 10,9 € | "Soporte vertical para consolas PS5 - PlayStation". Cita PlayStation. Coste incompatible con el PVP.
- Descartadas: Mars Gaming MPS5-B2 (marca, ventilador RGB con alimentación), Almalux (marca, refrigeración), Playseat (marca).

### 12. Mochila táctica (búsquedas: "mochila táctica", "mochila militar")
- MEJOR https://es.aliexpress.com/item/1005011558872150.html | 24,99 € | 2.000+ | 4,9 | Precio más bajo 30 días 26,51 € · Envío: 30 OCT - 02 NOV · Envío gratis | Mochila táctica 25 L, senderismo/viaje. Sin marca visible.
- https://es.aliexpress.com/item/1005012105556170.html | 31,59 € | 10.000+ (30K+ en la segunda búsqueda) | 4,9 | Precio más bajo 30 días 34,93 € · Entrega más rápida en 2 días · Envío gratis | Nylon 1000D 25L/50L. Sin marca visible. La ficha más vendida y rápida, pero coste alto.
- Otras sin marca: 1005010170622051 (25,51 €, 2.000+), 1005007576982804 (28,19 €, 1.000+, "Prowalk": marca, descartada).

## Beneficio por pedido (margen_es.py; envío 0; sin anuncios)

Supuestos comunes: tienda nueva (comisión 4 %), afiliado 0, devoluciones 5 %, embalaje 0,30 € (por defecto), preparación 2 días y entrega 5 días como ESTIMACIÓN. Nota: con envío 0 la partida de devoluciones del script sale 0,00; si hay devoluciones reales hay que restar el coste del producto devuelto y no recuperado. Coste = precio AliExpress con IVA entero.

## Tabla final (mejor ficha por término, ordenada por beneficio a PVP 29,90 €)

| # | Término | Mejor ficha | Coste | Vend./valor. | Benef. PVP 29,90 | Benef. PVP 34,90 | Veredicto del script (29,90/34,90) | Situación real |
|---|---------|-------------|------:|--------------|-----------------:|-----------------:|------------------------------------|----------------|
| 5 | Reposamuñecas | 1005007723074524 | 5,15 | 33 / 3,0 | 16,79 | 20,51 | GO/GO | Débil: 3,0 estrellas, envío no verificado; PVP 29,90 no creíble para un producto de 5 € |
| 8 | Kit limpieza | 1005013082018973 | 6,19 | 100K+ / 4,9 | 15,75 | 19,47 | GO/GO | No es kit de teclado/consola; cifra de ventas dudosa; PVP irreal |
| 4 | Cadena cubana | 1005013081772929 | 7,29 | 5.000+ / 4,9 | 14,65 | 18,37 | GO/GO | NO es cadena cubana (es colgante de cruz); sin ficha exacta |
| 9 | Agarres mando | 1005012732398490 | 7,50 | 6 / 5,0 | 14,44 | 18,16 | GO/GO | 6 ventas, cita PS5/Nintendo, envío no verificado |
| 2 | Organizador hueco asiento | 1005013081040964 | 9,29 | 900+ / 4,9 | 12,65 | 16,37 | GO/GO | Mejor candidato real: encaja con coches, 2 uds por 9,29 € (a confirmar), envío gratis |
| 11 | Soporte PS5 vertical | 1005007785981483 | 10,13 | 2 / sin valor. | 11,81 | 15,53 | GO/GO | DESCARTADA: cita SONY/PlayStation; 2 ventas |
| 3 | Soporte móvil magnético | 1005012807945039 | 11,66 | 21 / 4,9 | 10,28 | 14,00 | GO/GO | Viable; entrega 2 días; pocas ventas (21) |
| 1 | Mochila antirrobo | 1005010137877255 | 17,99 | 52 / 4,9 | 3,95 | 7,67 | HOLD/GO | Solo viable a 34,90 €; USB no verificado |
| 6 | Soporte pared mandos | 1005013119636665 | 20,79 | 5.000+ / 4,9 | 1,15 | 4,87 | HOLD/HOLD | Margen insuficiente; la alternativa 1005013153554335 (7,09 €) deja 14,85/18,57 pero no confirma ser soporte de mandos |
| 12 | Mochila táctica | 1005011558872150 | 24,99 | 2.000+ / 4,9 | -3,05 | 0,67 | NO-GO/HOLD | Coste demasiado alto para ese PVP |
| 10 | Funda asiento coche | 1005013064606560 | 25,99 | 3.000+ / 4,9 | -4,05 | -0,33 | NO-GO/NO-GO | Pierde dinero |
| 7 | Cojín lumbar gaming | (ninguna válida) | - | - | no calculado | no calculado | - | Sin ficha exacta, sin etiqueta de envío, marca en la única cercana |

### Segundas fichas (mismo cálculo, PVP 29,90 / 34,90)
- T1 1005007717286068 (20,75 €): 1,19 / 4,91 (HOLD/HOLD)
- T2 1005013118368479 (13,90 €): 8,04 / 11,76 (GO/GO)
- T3 1005012586096403 (12,26 €): 9,68 / 13,40 (GO/GO)
- T4 1005013119690840 (8,39 €): 13,55 / 17,27 (GO/GO), pero es bisutería a granel
- T6 1005013153554335 (7,09 €): 14,85 / 18,57 (GO/GO)
- T8 1005013081766361 (16,79 €): 5,15 / 8,87 (HOLD/GO)
- T9 1005013108097905 (11,69 €): 10,25 / 13,97 (GO/GO), recambio electrónico, no encaja
- T10 1005013055155920 (31,99 €): -10,05 / -6,33 (NO-GO/NO-GO)
- T11 1005007768195632 (28,08 €): -6,14 / -2,42 (NO-GO/NO-GO), descartada
- T12 1005012105556170 (31,59 €): -9,65 / -5,93 (NO-GO/NO-GO)

## Conclusión y qué falta

- Ningún proveedor está confirmado como existente con stock en España: solo se ha visto la búsqueda filtrada, no la ficha. Para estar SEGUROS hace falta, por ficha: captura o texto de la ficha con "Envío desde España", stock y plazo; o 1 muestra. Sin eso: sin GO.
- Candidatos más sólidos por datos de búsqueda (precio, 4,8-4,9 estrellas, envío gratis, sin marca): organizador hueco asiento (1005013081040964 y 1005013118368479) y soporte móvil magnético (1005012807945039 / 1005012586096403). Mochila antirrobo solo a 34,90 € y si se confirma el USB.
- Sin ficha exacta con los criterios: cadena cubana, reposamuñecas, cojín lumbar gaming, kit de limpieza de teclado, agarres de mando, funda deportiva. Soporte PS5 queda descartado por marca.
- Pendiente de otros departamentos: demanda real en TikTok Shop ES (FastMoss 429), PVP de mercado (analista-margenes) y marcado CE/seguridad (operaciones-cumplimiento). BigBuy (403) y CJ no se han intentado en esta ronda; las fichas de AliExpress no se pudieron abrir por los dominios de imágenes bloqueados.
