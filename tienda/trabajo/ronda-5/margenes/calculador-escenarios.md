# Calculador de escenarios - funda de volante deportiva de polipiel (Ronda 5)

Fecha: 26/10/2026. Fuente de cifras: `.claude/skills/proveedor-es/scripts/margen_es.py` ejecutado 96 veces (3 costes x 4 PVP x afiliado 0/0.15 x devoluciones 0.05/0.10 x comisión 4 %/9 %). Costes de proveedor facilitados por el director (AliExpress ES, envío 0). Ningún precio ha sido reverificado en la ficha por mí: **no verificado** frente a AliExpress hoy.

## Supuestos del script (léelos)

- PVP con IVA 21 %; base = PVP/1,21. Margen = beneficio / base sin IVA.
- El script trata el coste como **sin IVA**. El precio de AliExpress probablemente incluye IVA y no hay factura deducible (no verificado). Si el IVA no es deducible, el coste real es igual al precio mostrado, que es lo que se usa aquí: es el caso conservador respecto a una factura con IVA, pero el script no modela IVA no deducible en el PVP; el margen es el del script.
- Defaults: envío 0 (dado), embalaje 0,30 €, pago y otros 1 % de la base, objetivo 3 € de beneficio tras anuncios, margen mínimo 25 %. Comisión TikTok 9 % o 4 % (`--tienda-nueva`).
- Devoluciones: el script resta ingresos x tasa y logística de devolución, pero **no modela producto devuelto no recuperable**; 10 % puede ser optimista si la funda vuelve dañada.
- Plazos: se pasó `--dias-preparacion 2 --dias-entrega 5`. **Son estimación, no verificada** (ver nota abajo). Con ellos el script no emite aviso de plazos; con 3 días de preparación sería NO-GO.
- Comisión 4 %: solo 60 días en tienda nueva con 5 productos activos en 15 días (CLAUDE.md; comprobar en Seller Center). En el mes 2 puede seguir al 4 % o ya al 9 %: se dan ambos.
- No incluye costes fijos (muestras, herramientas IA, CapCut, etc.).

## Tablas: beneficio por pedido / margen / anuncio máximo (CPA de equilibrio)

Formato de celda: `beneficio € / margen % / anuncio máx €`. Anuncio máx = beneficio antes de anuncios (a ese CPA ganas 0). Entre paréntesis: CPA para ganar el objetivo de 3 €. Sin afiliado = vídeos propios; 15 % = creadores.

### Comisión 9 %, devoluciones 5 %

| Coste | PVP | Sin afiliado | Afiliado 15 % |
|---|---|---|---|
| 9,99 | 24,90 | 7,20 / 35.0% / 7,20 (4,20) | 4,27 / 20.7% / 4,27 (1,27) |
| 9,99 | 29,90 | 10,71 / 43.4% / 10,71 (7,71) | 7,19 / 29.1% / 7,19 (4,19) |
| 9,99 | 34,90 | 14,23 / 49.3% / 14,23 (11,23) | 10,12 / 35.1% / 10,12 (7,12) |
| 9,99 | 39,90 | 17,74 / 53.8% / 17,74 (14,74) | 13,04 / 39.5% / 13,04 (10,04) |
| 13,87 | 24,90 | 3,32 / 16.1% / 3,32 (0,32) | 0,39 / 1.9% / 0,39 (-2,61) |
| 13,87 | 29,90 | 6,83 / 27.7% / 6,83 (3,83) | 3,31 / 13.4% / 3,31 (0,31) |
| 13,87 | 34,90 | 10,35 / 35.9% / 10,35 (7,35) | 6,24 / 21.6% / 6,24 (3,24) |
| 13,87 | 39,90 | 13,86 / 42.0% / 13,86 (10,86) | 9,16 / 27.8% / 9,16 (6,16) |
| 16,99 | 24,90 | 0,20 / 1.0% / 0,20 (-2,80) | -2,73 / -13.3% / -2,73 (-5,73) |
| 16,99 | 29,90 | 3,71 / 15.0% / 3,71 (0,71) | 0,19 / 0.8% / 0,19 (-2,81) |
| 16,99 | 34,90 | 7,23 / 25.1% / 7,23 (4,23) | 3,12 / 10.8% / 3,12 (0,12) |
| 16,99 | 39,90 | 10,74 / 32.6% / 10,74 (7,74) | 6,04 / 18.3% / 6,04 (3,04) |

### Comisión 9 %, devoluciones 10 %

| Coste | PVP | Sin afiliado | Afiliado 15 % |
|---|---|---|---|
| 9,99 | 24,90 | 6,17 / 30.0% / 6,17 (3,17) | 3,39 / 16.5% / 3,39 (0,39) |
| 9,99 | 29,90 | 9,48 / 38.4% / 9,48 (6,48) | 6,14 / 24.9% / 6,14 (3,14) |
| 9,99 | 34,90 | 12,78 / 44.3% / 12,78 (9,78) | 8,89 / 30.8% / 8,89 (5,89) |
| 9,99 | 39,90 | 16,09 / 48.8% / 16,09 (13,09) | 11,64 / 35.3% / 11,64 (8,64) |
| 13,87 | 24,90 | 2,29 / 11.1% / 2,29 (-0,71) | -0,49 / -2.4% / -0,49 (-3,49) |
| 13,87 | 29,90 | 5,60 / 22.7% / 5,60 (2,60) | 2,26 / 9.2% / 2,26 (-0,74) |
| 13,87 | 34,90 | 8,90 / 30.9% / 8,90 (5,90) | 5,01 / 17.4% / 5,01 (2,01) |
| 13,87 | 39,90 | 12,21 / 37.0% / 12,21 (9,21) | 7,76 / 23.5% / 7,76 (4,76) |
| 16,99 | 24,90 | -0,83 / -4.0% / -0,83 (-3,83) | -3,61 / -17.5% / -3,61 (-6,61) |
| 16,99 | 29,90 | 2,48 / 10.0% / 2,48 (-0,52) | -0,86 / -3.5% / -0,86 (-3,86) |
| 16,99 | 34,90 | 5,78 / 20.1% / 5,78 (2,78) | 1,89 / 6.6% / 1,89 (-1,11) |
| 16,99 | 39,90 | 9,09 / 27.6% / 9,09 (6,09) | 4,64 / 14.1% / 4,64 (1,64) |

### Comisión 4 % (tienda nueva), devoluciones 5 %

| Coste | PVP | Sin afiliado | Afiliado 15 % |
|---|---|---|---|
| 9,99 | 24,90 | 8,23 / 40.0% / 8,23 (5,23) | 5,30 / 25.7% / 5,30 (2,30) |
| 9,99 | 29,90 | 11,95 / 48.4% / 11,95 (8,95) | 8,43 / 34.1% / 8,43 (5,43) |
| 9,99 | 34,90 | 15,67 / 54.3% / 15,67 (12,67) | 11,56 / 40.1% / 11,56 (8,56) |
| 9,99 | 39,90 | 19,39 / 58.8% / 19,39 (16,39) | 14,69 / 44.5% / 14,69 (11,69) |
| 13,87 | 24,90 | 4,35 / 21.1% / 4,35 (1,35) | 1,42 / 6.9% / 1,42 (-1,58) |
| 13,87 | 29,90 | 8,07 / 32.7% / 8,07 (5,07) | 4,55 / 18.4% / 4,55 (1,55) |
| 13,87 | 34,90 | 11,79 / 40.9% / 11,79 (8,79) | 7,68 / 26.6% / 7,68 (4,68) |
| 13,87 | 39,90 | 15,51 / 47.0% / 15,51 (12,51) | 10,81 / 32.8% / 10,81 (7,81) |
| 16,99 | 24,90 | 1,23 / 6.0% / 1,23 (-1,77) | -1,70 / -8.3% / -1,70 (-4,70) |
| 16,99 | 29,90 | 4,95 / 20.0% / 4,95 (1,95) | 1,43 / 5.8% / 1,43 (-1,57) |
| 16,99 | 34,90 | 8,67 / 30.1% / 8,67 (5,67) | 4,56 / 15.8% / 4,56 (1,56) |
| 16,99 | 39,90 | 12,39 / 37.6% / 12,39 (9,39) | 7,69 / 23.3% / 7,69 (4,69) |

### Comisión 4 % (tienda nueva), devoluciones 10 %

| Coste | PVP | Sin afiliado | Afiliado 15 % |
|---|---|---|---|
| 9,99 | 24,90 | 7,20 / 35.0% / 7,20 (4,20) | 4,42 / 21.5% / 4,42 (1,42) |
| 9,99 | 29,90 | 10,71 / 43.4% / 10,71 (7,71) | 7,38 / 29.9% / 7,38 (4,38) |
| 9,99 | 34,90 | 14,23 / 49.3% / 14,23 (11,23) | 10,33 / 35.8% / 10,33 (7,33) |
| 9,99 | 39,90 | 17,74 / 53.8% / 17,74 (14,74) | 13,29 / 40.3% / 13,29 (10,29) |
| 13,87 | 24,90 | 3,32 / 16.1% / 3,32 (0,32) | 0,54 / 2.6% / 0,54 (-2,46) |
| 13,87 | 29,90 | 6,83 / 27.7% / 6,83 (3,83) | 3,50 / 14.2% / 3,50 (0,50) |
| 13,87 | 34,90 | 10,35 / 35.9% / 10,35 (7,35) | 6,45 / 22.4% / 6,45 (3,45) |
| 13,87 | 39,90 | 13,86 / 42.0% / 13,86 (10,86) | 9,41 / 28.5% / 9,41 (6,41) |
| 16,99 | 24,90 | 0,20 / 1.0% / 0,20 (-2,80) | -2,58 / -12.5% / -2,58 (-5,58) |
| 16,99 | 29,90 | 3,71 / 15.0% / 3,71 (0,71) | 0,38 / 1.5% / 0,38 (-2,62) |
| 16,99 | 34,90 | 7,23 / 25.1% / 7,23 (4,23) | 3,33 / 11.6% / 3,33 (0,33) |
| 16,99 | 39,90 | 10,74 / 32.6% / 10,74 (7,74) | 6,29 / 19.1% / 6,29 (3,29) |

## PVP mínimo para 25 % de margen (con IVA)

No depende del PVP elegido; solo de coste, afiliado, devoluciones y comisión (búsqueda del script en pasos de 0,10 €).

| Coste | Afiliado | Dev. | Comisión 9 % | Comisión 4 % |
|---|---|---|---|---|
| 9,99 | 0 % | 5 % | 20,80 | 19,20 |
| 9,99 | 0 % | 10 % | 22,70 | 20,80 |
| 9,99 | 15 % | 5 % | 27,30 | 24,60 |
| 9,99 | 15 % | 10 % | 30,10 | 26,80 |
| 13,87 | 0 % | 5 % | 28,60 | 26,40 |
| 13,87 | 0 % | 10 % | 31,20 | 28,60 |
| 13,87 | 15 % | 5 % | 37,50 | 33,80 |
| 13,87 | 15 % | 10 % | 41,40 | 36,90 |
| 16,99 | 0 % | 5 % | 34,90 | 32,20 |
| 16,99 | 0 % | 10 % | 38,10 | 34,90 |
| 16,99 | 15 % | 5 % | 45,80 | 41,30 |
| 16,99 | 15 % | 10 % | 50,50 | 45,00 |

## Plan de 500 EUR/mes en anuncios (mes 2, GMV Max)

Definiciones: **pedidos necesarios** = 500 / beneficio por pedido (pedidos cuyo beneficio antes de anuncios paga justo 500 EUR de anuncios). **ROAS de equilibrio** = PVP (con IVA, como GMV) / beneficio. **ROAS objetivo** = PVP / (beneficio - 3 EUR). Columnas CPA: resultado neto mensual con 500 EUR de anuncios y ese CPA real, = (500/CPA) x beneficio - 500; negativo = pierdes dinero. Comisión 9 % (caso prudente). Si ROAS objetivo = n/a, no se alcanza el objetivo de 3 EUR a ningún CPA positivo.

| Coste | PVP | Afil. | Dev. | Benef. | Pedidos/mes | ROAS equil. | ROAS obj. | Neto CPA 5 | Neto CPA 8 | Neto CPA 12 |
|---|---|---|---|---|---|---|---|---|---|---|
| 9,99 | 24,90 | 0 % | 5 % | 7,20 | 70 | 3,46 | 5,93 | 220,00 | -50,00 | -200,00 |
| 9,99 | 24,90 | 0 % | 10 % | 6,17 | 82 | 4,04 | 7,85 | 117,00 | -114,38 | -242,92 |
| 9,99 | 24,90 | 15 % | 5 % | 4,27 | 118 | 5,83 | 19,61 | -73,00 | -233,12 | -322,08 |
| 9,99 | 24,90 | 15 % | 10 % | 3,39 | 148 | 7,35 | 63,85 | -161,00 | -288,12 | -358,75 |
| 9,99 | 29,90 | 0 % | 5 % | 10,71 | 47 | 2,79 | 3,88 | 571,00 | 169,38 | -53,75 |
| 9,99 | 29,90 | 0 % | 10 % | 9,48 | 53 | 3,15 | 4,61 | 448,00 | 92,50 | -105,00 |
| 9,99 | 29,90 | 15 % | 5 % | 7,19 | 70 | 4,16 | 7,14 | 219,00 | -50,62 | -200,42 |
| 9,99 | 29,90 | 15 % | 10 % | 6,14 | 82 | 4,87 | 9,52 | 114,00 | -116,25 | -244,17 |
| 9,99 | 34,90 | 0 % | 5 % | 14,23 | 36 | 2,45 | 3,11 | 923,00 | 389,38 | 92,92 |
| 9,99 | 34,90 | 0 % | 10 % | 12,78 | 40 | 2,73 | 3,57 | 778,00 | 298,75 | 32,50 |
| 9,99 | 34,90 | 15 % | 5 % | 10,12 | 50 | 3,45 | 4,90 | 512,00 | 132,50 | -78,33 |
| 9,99 | 34,90 | 15 % | 10 % | 8,89 | 57 | 3,93 | 5,93 | 389,00 | 55,62 | -129,58 |
| 9,99 | 39,90 | 0 % | 5 % | 17,74 | 29 | 2,25 | 2,71 | 1274,00 | 608,75 | 239,17 |
| 9,99 | 39,90 | 0 % | 10 % | 16,09 | 32 | 2,48 | 3,05 | 1109,00 | 505,62 | 170,42 |
| 9,99 | 39,90 | 15 % | 5 % | 13,04 | 39 | 3,06 | 3,97 | 804,00 | 315,00 | 43,33 |
| 9,99 | 39,90 | 15 % | 10 % | 11,64 | 43 | 3,43 | 4,62 | 664,00 | 227,50 | -15,00 |
| 13,87 | 24,90 | 0 % | 5 % | 3,32 | 151 | 7,50 | 77,81 | -168,00 | -292,50 | -361,67 |
| 13,87 | 24,90 | 0 % | 10 % | 2,29 | 219 | 10,87 | n/a | -271,00 | -356,88 | -404,58 |
| 13,87 | 24,90 | 15 % | 5 % | 0,39 | 1283 | 63,85 | n/a | -461,00 | -475,62 | -483,75 |
| 13,87 | 24,90 | 15 % | 10 % | -0,49 | no hay | n/a | n/a | -549,00 | -530,62 | -520,42 |
| 13,87 | 29,90 | 0 % | 5 % | 6,83 | 74 | 4,38 | 7,81 | 183,00 | -73,12 | -215,42 |
| 13,87 | 29,90 | 0 % | 10 % | 5,60 | 90 | 5,34 | 11,50 | 60,00 | -150,00 | -266,67 |
| 13,87 | 29,90 | 15 % | 5 % | 3,31 | 152 | 9,03 | 96,45 | -169,00 | -293,12 | -362,08 |
| 13,87 | 29,90 | 15 % | 10 % | 2,26 | 222 | 13,23 | n/a | -274,00 | -358,75 | -405,83 |
| 13,87 | 34,90 | 0 % | 5 % | 10,35 | 49 | 3,37 | 4,75 | 535,00 | 146,88 | -68,75 |
| 13,87 | 34,90 | 0 % | 10 % | 8,90 | 57 | 3,92 | 5,92 | 390,00 | 56,25 | -129,17 |
| 13,87 | 34,90 | 15 % | 5 % | 6,24 | 81 | 5,59 | 10,77 | 124,00 | -110,00 | -240,00 |
| 13,87 | 34,90 | 15 % | 10 % | 5,01 | 100 | 6,97 | 17,36 | 1,00 | -186,88 | -291,25 |
| 13,87 | 39,90 | 0 % | 5 % | 13,86 | 37 | 2,88 | 3,67 | 886,00 | 366,25 | 77,50 |
| 13,87 | 39,90 | 0 % | 10 % | 12,21 | 41 | 3,27 | 4,33 | 721,00 | 263,12 | 8,75 |
| 13,87 | 39,90 | 15 % | 5 % | 9,16 | 55 | 4,36 | 6,48 | 416,00 | 72,50 | -118,33 |
| 13,87 | 39,90 | 15 % | 10 % | 7,76 | 65 | 5,14 | 8,38 | 276,00 | -15,00 | -176,67 |
| 16,99 | 24,90 | 0 % | 5 % | 0,20 | 2500 | 124,50 | n/a | -480,00 | -487,50 | -491,67 |
| 16,99 | 24,90 | 0 % | 10 % | -0,83 | no hay | n/a | n/a | -583,00 | -551,88 | -534,58 |
| 16,99 | 24,90 | 15 % | 5 % | -2,73 | no hay | n/a | n/a | -773,00 | -670,62 | -613,75 |
| 16,99 | 24,90 | 15 % | 10 % | -3,61 | no hay | n/a | n/a | -861,00 | -725,62 | -650,42 |
| 16,99 | 29,90 | 0 % | 5 % | 3,71 | 135 | 8,06 | 42,11 | -129,00 | -268,12 | -345,42 |
| 16,99 | 29,90 | 0 % | 10 % | 2,48 | 202 | 12,06 | n/a | -252,00 | -345,00 | -396,67 |
| 16,99 | 29,90 | 15 % | 5 % | 0,19 | 2632 | 157,37 | n/a | -481,00 | -488,12 | -492,08 |
| 16,99 | 29,90 | 15 % | 10 % | -0,86 | no hay | n/a | n/a | -586,00 | -553,75 | -535,83 |
| 16,99 | 34,90 | 0 % | 5 % | 7,23 | 70 | 4,83 | 8,25 | 223,00 | -48,12 | -198,75 |
| 16,99 | 34,90 | 0 % | 10 % | 5,78 | 87 | 6,04 | 12,55 | 78,00 | -138,75 | -259,17 |
| 16,99 | 34,90 | 15 % | 5 % | 3,12 | 161 | 11,19 | 290,83 | -188,00 | -305,00 | -370,00 |
| 16,99 | 34,90 | 15 % | 10 % | 1,89 | 265 | 18,47 | n/a | -311,00 | -381,88 | -421,25 |
| 16,99 | 39,90 | 0 % | 5 % | 10,74 | 47 | 3,72 | 5,16 | 574,00 | 171,25 | -52,50 |
| 16,99 | 39,90 | 0 % | 10 % | 9,09 | 56 | 4,39 | 6,55 | 409,00 | 68,12 | -121,25 |
| 16,99 | 39,90 | 15 % | 5 % | 6,04 | 83 | 6,61 | 13,12 | 104,00 | -122,50 | -248,33 |
| 16,99 | 39,90 | 15 % | 10 % | 4,64 | 108 | 8,60 | 24,33 | -36,00 | -210,00 | -306,67 |

Lectura de CPA (hay negocio si beneficio por pedido > CPA, es decir neto > 0):

- CPA 5 EUR: hay negocio en casi todas las celdas con beneficio > 5 (p. ej. 9,99 EUR a 29,90 PVP: ROAS real = 29,90/5 = 6,0). Un CPA de 5 EUR sobre un PVP de 25-40 EUR exige ROAS 5-8: es un supuesto optimista, **no verificado** para TikTok Shop ES.
- CPA 8 EUR: hay negocio solo si beneficio > 8. Coste 9,99: PVP 29,90 sin afiliado (9,48-10,71) y PVP >= 34,90 con o sin afiliado. Coste 13,87: PVP 34,90 sin afiliado (8,90-10,35) y 39,90 con o sin afiliado (salvo 39,90 con afiliado y dev 10 %: 7,76, pierde). Coste 16,99: solo PVP 39,90 sin afiliado (9,09-10,74).
- CPA 12 EUR (9 %, caso prudente): solo hay negocio con coste 9,99 y PVP 34,90 sin afiliado (12,78-14,23), coste 9,99 y PVP 39,90 (11,64 con afiliado y dev 10 % no llega; el resto sí) y coste 13,87 / PVP 39,90 sin afiliado (12,21-13,86). El resto pierde: a 500 EUR son ~42 pedidos.
- Conclusión: el negocio con anuncios solo es defendible con coste 9,99 y PVP >= 29,90, o coste 13,87 con PVP >= 34,90 sin afiliado. Con coste 16,99 apenas hay margen para anuncios por debajo de PVP 39,90. Todo depende de que el PVP sea defendible en TikTok Shop ES (referencia de mercado 38,96 EUR según CLAUDE.md; demanda **no verificada**).

## Comprobación a mano (2 escenarios)

**A) coste 13,87, PVP 29,90, afiliado 15 %, dev 5 %, comisión 9 %** (script: 3,31 / 13,4 % / CPA máx 3,31)

- base = 29,90/1,21 = 24,7107; ingresos = 24,7107 x 0,95 = 23,4752
- costes: producto 13,87 + embalaje 0,30 + comisión 9 % x 24,7107 = 2,2240 + otros 1 % = 0,2471 + afiliado 15 % x 23,4752 = 3,5213 + logística devolución 0 = 20,1624
- beneficio = 23,4752 - 20,1624 = 3,3128 -> **3,31**; margen = 3,3128/24,7107 = **13,4 %**. Coincide con el script.

**B) coste 9,99, PVP 34,90, afiliado 0, dev 10 %, comisión 4 %** (script: 14,23 / 49,3 %)

- base = 34,90/1,21 = 28,8430; ingresos = 28,8430 x 0,90 = 25,9587
- costes: 9,99 + 0,30 + 4 % x 28,8430 = 1,1537 + 1 % = 0,2884 = 11,7321
- beneficio = 25,9587 - 11,7321 = 14,2266 -> **14,23**; margen = 14,2266/28,8430 = **49,3 %**. Coincide.

Comprobación extra del PVP mínimo: coste 13,87, afil 15 %, dev 5 %, 9 %: coste variable = 13,87 + 0,30 + p'(0,09 + 0,01 + 0,15 x 0,95) = 14,17 + 0,2425 p'; con margen 25 %: 0,95 p' - 14,17 - 0,2425 p' = 0,25 p' -> p' = 14,17/0,4575 = 30,97 base -> PVP 37,48 (script 37,5). Coincide.

## Cifras raras

- Coste 13,87 / PVP 29,90 / afiliado 15 %: margen 13,4 % (no llega a 25 %); el PVP mínimo es 37,50 EUR. El PVP 29,90 de CLAUDE.md para 1005008219047604 no es viable con creadores al 9 %.
- Coste 16,99: PVP 24,90 da pérdida con afiliado (-1,70 a -3,61) y con 10 % de devoluciones y 9 % sin afiliado (-0,83). NO-GO.
- Coincidencias aparentes: 'comisión 9 %, dev 5 %' da el mismo beneficio que 'comisión 4 %, dev 10 %' cuando no hay afiliado (p. ej. 9,99 / 24,90: 7,20 y 7,20). No es un error: pasar de 4 % a 9 % cuesta 5 % de la base y pasar de 5 % a 10 % de devoluciones resta 5 % de ingresos, casi igual.
- El veredicto GO del script solo exige margen >= 25 % y CPA objetivo > 0; no evalúa demanda ni plazos reales.
- Con 15 % de afiliado se descuenta de los ingresos netos de devoluciones (no de la base), correcto pero es una convención del script.
- `--help` del script falla (`%` sin escapar en el texto de `--tienda-nueva`, línea 88); no afecta a los cálculos.

## Plazos y datos pendientes de otros departamentos

- Preparación 2 días y entrega 5 días: **estimación, no verificada**. Necesita ficha del proveedor / `operaciones-cumplimiento`. Regla: entrega al transportista en 2 días laborables.
- Demanda y precio de mercado en TikTok Shop ES (FastMoss 429), stock, tallas: no verificado (`buscador-producto`).
- IVA deducible de la compra en AliExpress: no verificado.