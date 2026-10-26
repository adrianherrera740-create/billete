# Ronda 7 - Modelo económico por canal (calculador de escenarios)

Fecha: 2026-10-26. Autor: especialista de márgenes (calculador). Motor: `.claude/skills/proveedor-es/scripts/margen_es.py` (función `calcular`, importada con los parámetros de cada canal; modelo reproducible en `scratchpad/modelo.py` y `net.py`, no entregados al repo).

## 0. Metodología y parámetros

- Coste de producto "puesto en cliente" = producto + envío al cliente, por tanto `--envio 0`. PVP con IVA 21 % (el script divide entre 1,21; base = PVP/1,21). Sin afiliado salvo que se diga (vídeos propios). Devoluciones 10 % (script: pierdes ese 10 % de ingresos y el producto; es criterio conservador). Veredicto/GO del script no se usa: aquí solo importan beneficio, margen y límites.
- Porcentajes de plataforma: se aplican sobre la base sin IVA, como hace el script en TikTok. Para B, C, D, que cobran sobre el total con IVA, se multiplican por 1,21 (sensibilidad de A abajo).
- "Beneficio" = beneficio por pedido ANTES de anuncios. Condición de no perder con anuncios: beneficio >= CPA. Pedidos de equilibrio = (500 + cuota mensual) / beneficio. ROAS de equilibrio = PVP / beneficio. ROAS logrado = PVP / CPA.
- Con 500 € de anuncios: CPA 5 -> 100 pedidos (ROAS logrado 3,98 / 4,98 / 5,98 / 6,98 para PVP 19,90 / 24,90 / 29,90 / 34,90); CPA 8 -> 62,5 pedidos (2,49 / 3,11 / 3,74 / 4,36); CPA 12 -> 41,7 pedidos (1,66 / 2,07 / 2,49 / 2,91).

| Canal | Comisión | Pago/otros | Fijo por pedido (embalaje 0,30 incl.) | Devol. | Cuota mensual | Estado de la cifra |
|---|---|---|---|---|---|---|
| A9 TikTok 9 % | 9 % base | 1 % base (default script) | 0,30 | 10 % | 0 | 9 %: edesk abr-2026, "verificar en Seller Center" |
| A4 TikTok 4 % | 4 % base | 1 % | 0,30 | 10 % | 0 | 4 %: CLAUDE.md; NO encontrada en búsqueda web (hace un año se citaba 5 % de lanzamiento, Hipertextual dic-2024) |
| B Tienda propia | 0 | 2,5 % del PVP (=3,025 % base) + 0,25 | 0,55 | 10 % | 32 €/mes (Shopify Basic, mensual) | Plan 32 €: Impulsa feb-2026 / m8d sep-2026; Finom da 36 €. Tarifa de pago para España NO verificada (2,1 % + 0,30 € DE; 1,5 % + 0,25 € FR) |
| C eBay.es | 13 % del total con IVA (=15,73 % base) | 0 | 0,65 (0,30 + 0,35 fijos supuestos) | 10 % | 0 | 13-15 % edesk (genérico); 0,35 € de una calculadora de terceros (Easync, may-2026) contradictoria; reforma jul-2026 solo en Beancount. Todo sin verificar |
| D Miravia | 10 % del total con IVA (=12,1 % base); sensibilidad 6 % y 15 % | 0 | 0,30 | 10 % | 0 | Rango 6-15 % de Lengow; sin tabla oficial ni confirmación 2026 |
| E POD tienda propia | 0 | 2,5 % PVP + 0,25 | 0,25 (embalaje lo hace el proveedor) | 3 % (supuesto: personalizado sin desistimiento, a verificar) | 32 €/mes | Ver notas POD |

## 1. Tabla resumen: beneficio por pedido (EUR) antes de anuncios (margen sobre base entre paréntesis)

### A9 - TikTok Shop ES 9 %
| Coste \ PVP | 19,90 | 24,90 | 29,90 | 34,90 |
|---|---|---|---|---|
| 3 | 9,86 (59,9 %) | 13,16 (64,0 %) | 16,47 (66,6 %) | 19,77 (68,6 %) |
| 5 | 7,86 (47,8 %) | 11,16 (54,2 %) | 14,47 (58,6 %) | 17,77 (61,6 %) |
| 7 | 5,86 (35,6 %) | 9,16 (44,5 %) | 12,47 (50,5 %) | 15,77 (54,7 %) |
| 10 | 2,86 (17,4 %) | 6,16 (29,9 %) | 9,47 (38,3 %) | 12,77 (44,3 %) |
| 14 | **-1,14** (-6,9 %) | 2,16 (10,5 %) | 5,47 (22,1 %) | 8,77 (30,4 %) |

### A4 - TikTok Shop ES 4 %
| Coste \ PVP | 19,90 | 24,90 | 29,90 | 34,90 |
|---|---|---|---|---|
| 3 | 10,68 (64,9 %) | 14,19 (69,0 %) | 17,70 (71,6 %) | 21,22 (73,6 %) |
| 5 | 8,68 (52,8 %) | 12,19 (59,2 %) | 15,70 (63,6 %) | 19,22 (66,6 %) |
| 7 | 6,68 (40,6 %) | 10,19 (49,5 %) | 13,70 (55,5 %) | 17,22 (59,7 %) |
| 10 | 3,68 (22,4 %) | 7,19 (34,9 %) | 10,70 (43,3 %) | 14,22 (49,3 %) |
| 14 | **-0,32** (-1,9 %) | 3,19 (15,5 %) | 6,70 (27,1 %) | 10,22 (35,4 %) |

### B - Tienda propia + pasarela
| Coste \ PVP | 19,90 | 24,90 | 29,90 | 34,90 |
|---|---|---|---|---|
| 3 | 10,75 (65,4 %) | 14,35 (69,7 %) | 17,94 (72,6 %) | 21,54 (74,7 %) |
| 5 | 8,75 (53,2 %) | 12,35 (60,0 %) | 15,94 (64,5 %) | 19,54 (67,7 %) |
| 7 | 6,75 (41,1 %) | 10,35 (50,3 %) | 13,94 (56,4 %) | 17,54 (60,8 %) |
| 10 | 3,75 (22,8 %) | 7,35 (35,7 %) | 10,94 (44,3 %) | 14,54 (50,4 %) |
| 14 | **-0,25** (-1,5 %) | 3,35 (16,3 %) | 6,94 (28,1 %) | 10,54 (36,5 %) |

### C - eBay.es
| Coste \ PVP | 19,90 | 24,90 | 29,90 | 34,90 |
|---|---|---|---|---|
| 3 | 8,56 (52,1 %) | 11,63 (56,5 %) | 14,70 (59,5 %) | 17,77 (61,6 %) |
| 5 | 6,56 (39,9 %) | 9,63 (46,8 %) | 12,70 (51,4 %) | 15,77 (54,7 %) |
| 7 | 4,56 (27,8 %) | 7,63 (37,1 %) | 10,70 (43,3 %) | 13,77 (47,7 %) |
| 10 | 1,56 (9,5 %) | 4,63 (22,5 %) | 7,70 (31,2 %) | 10,77 (37,3 %) |
| 14 | **-2,44** (-14,8 %) | 0,63 (3,1 %) | 3,70 (15,0 %) | 6,77 (23,5 %) |

### D - Miravia (10 %)
| Coste \ PVP | 19,90 | 24,90 | 29,90 | 34,90 |
|---|---|---|---|---|
| 3 | 9,51 (57,8 %) | 12,73 (61,9 %) | 15,95 (64,5 %) | 19,17 (66,5 %) |
| 5 | 7,51 (45,7 %) | 10,73 (52,1 %) | 13,95 (56,5 %) | 17,17 (59,5 %) |
| 7 | 5,51 (33,5 %) | 8,73 (42,4 %) | 11,95 (48,4 %) | 15,17 (52,6 %) |
| 10 | 2,51 (15,3 %) | 5,73 (27,8 %) | 8,95 (36,2 %) | 12,17 (42,2 %) |
| 14 | **-1,49** (-9,0 %) | 1,73 (8,4 %) | 4,95 (20,0 %) | 8,17 (28,3 %) |

Sensibilidad Miravia: a 6 % el beneficio sube ~0,8 a 1,6 €/pedido (coste 5 / PVP 24,90: 11,73); a 15 % baja (coste 5 / PVP 24,90: 9,49).

### E - Impresión bajo demanda en tienda propia
| Coste \ PVP | 19,90 | 24,90 | 29,90 | 34,90 |
|---|---|---|---|---|
| 3 | 12,21 (74,2 %) | 16,09 (78,2 %) | 19,97 (80,8 %) | 23,86 (82,7 %) |
| 5 | 10,21 (62,1 %) | 14,09 (68,5 %) | 17,97 (72,7 %) | 21,86 (75,8 %) |
| 7 | 8,21 (49,9 %) | 12,09 (58,7 %) | 15,97 (64,6 %) | 19,86 (68,8 %) |
| 10 | 5,21 (31,7 %) | 9,09 (44,2 %) | 12,97 (52,5 %) | 16,86 (58,4 %) |
| 14 | 1,21 (7,3 %) | 5,09 (24,7 %) | 8,97 (36,3 %) | 12,86 (44,6 %) |

IMPORTANTE (E): el beneficio alto se debe a devoluciones 3 %, sin embalaje y sin comisión de marketplace, no a que el POD sea mejor. Las filas de coste 3 y 5 € son irreales para POD puesto en España: las búsquedas solo dan precios base en USD de camiseta ~6-9 USD (Printify/Printful, sin envío a España). Coste realista puesto en cliente: no verificado; asumir filas 10 y 14 €.

### Sensibilidad TikTok
- Afiliado 15 % en A9 (coste 5): 5,64 / 8,38 / 11,13 / 13,88 (PVP 19,90 -> 34,90). En A4 (coste 5): 6,46 / 9,41 / 12,37 / 15,32. Coste 14 con afiliado: negativo salvo PVP 29,90+ (A9 2,13) y 34,90.
- Si TikTok cobra 9 % sobre el total con IVA (10,89 % de la base): coste 5 / PVP 24,90 baja de 11,16 a 10,77; coste 10 / PVP 24,90 de 6,16 a 5,77.

## 2. Pedidos y ROAS de equilibrio para cubrir 500 € de anuncios

Formato: ROAS de equilibrio (PVP/beneficio) / pedidos al mes necesarios (500 + cuota)/beneficio. "n/a" = beneficio <= 0, imposible.
Comparar con el ROAS logrado de la sección 0: si el ROAS necesario es mayor que PVP/CPA, pierdes dinero.

### A9 TikTok 9 %
| Coste | 19,90 | 24,90 | 29,90 | 34,90 |
|---|---|---|---|---|
| 3 | 2,02x / 51 | 1,89x / 38 | 1,82x / 30 | 1,77x / 25 |
| 5 | 2,53x / 64 | 2,23x / 45 | 2,07x / 35 | 1,96x / 28 |
| 7 | 3,40x / 85 | 2,72x / 55 | 2,40x / 40 | 2,21x / 32 |
| 10 | 6,96x / 175 | 4,04x / 81 | 3,16x / 53 | 2,73x / 39 |
| 14 | n/a | 11,53x / 231 | 5,47x / 91 | 3,98x / 57 |

### A4 TikTok 4 %
| Coste | 19,90 | 24,90 | 29,90 | 34,90 |
|---|---|---|---|---|
| 3 | 1,86x / 47 | 1,75x / 35 | 1,69x / 28 | 1,64x / 24 |
| 5 | 2,29x / 58 | 2,04x / 41 | 1,90x / 32 | 1,82x / 26 |
| 7 | 2,98x / 75 | 2,44x / 49 | 2,18x / 36 | 2,03x / 29 |
| 10 | 5,41x / 136 | 3,46x / 70 | 2,79x / 47 | 2,45x / 35 |
| 14 | n/a | 7,81x / 157 | 4,46x / 75 | 3,41x / 49 |

### B Tienda propia (incluye 32 € de cuota en pedidos)
| Coste | 19,90 | 24,90 | 29,90 | 34,90 |
|---|---|---|---|---|
| 3 | 1,85x / 49 | 1,74x / 37 | 1,67x / 30 | 1,62x / 25 |
| 5 | 2,27x / 61 | 2,02x / 43 | 1,88x / 33 | 1,79x / 27 |
| 7 | 2,95x / 79 | 2,41x / 51 | 2,14x / 38 | 1,99x / 30 |
| 10 | 5,31x / 142 | 3,39x / 72 | 2,73x / 49 | 2,40x / 37 |
| 14 | n/a | 7,43x / 159 | 4,31x / 77 | 3,31x / 50 |

### C eBay.es
| Coste | 19,90 | 24,90 | 29,90 | 34,90 |
|---|---|---|---|---|
| 3 | 2,32x / 58 | 2,14x / 43 | 2,03x / 34 | 1,96x / 28 |
| 5 | 3,03x / 76 | 2,59x / 52 | 2,35x / 39 | 2,21x / 32 |
| 7 | 4,36x / 110 | 3,26x / 66 | 2,79x / 47 | 2,53x / 36 |
| 10 | 12,76x / 321 | 5,38x / 108 | 3,88x / 65 | 3,24x / 46 |
| 14 | n/a | 39,52x / 794 | 8,08x / 135 | 5,16x / 74 |

### D Miravia 10 %
| Coste | 19,90 | 24,90 | 29,90 | 34,90 |
|---|---|---|---|---|
| 3 | 2,09x / 53 | 1,96x / 39 | 1,87x / 31 | 1,82x / 26 |
| 5 | 2,65x / 67 | 2,32x / 47 | 2,14x / 36 | 2,03x / 29 |
| 7 | 3,61x / 91 | 2,85x / 57 | 2,50x / 42 | 2,30x / 33 |
| 10 | 7,93x / 199 | 4,35x / 87 | 3,34x / 56 | 2,87x / 41 |
| 14 | n/a | 14,39x / 289 | 6,04x / 101 | 4,27x / 61 |

### E POD propia
| Coste | 19,90 | 24,90 | 29,90 | 34,90 |
|---|---|---|---|---|
| 3 | 1,63x / 44 | 1,55x / 33 | 1,50x / 27 | 1,46x / 22 |
| 5 | 1,95x / 52 | 1,77x / 38 | 1,66x / 30 | 1,60x / 24 |
| 7 | 2,42x / 65 | 2,06x / 44 | 1,87x / 33 | 1,76x / 27 |
| 10 | 3,82x / 102 | 2,74x / 59 | 2,31x / 41 | 2,07x / 32 |
| 14 | 16,45x / 440 | 4,89x / 105 | 3,33x / 59 | 2,71x / 41 |

Lectura: los pedidos de equilibrio son pedidos que hay que vender en total al mes; con CPA 8 el gasto de 500 € solo trae 62,5 pedidos y con CPA 12 solo 41,7. Un cuadro con más pedidos de equilibrio que 62,5 (CPA 8) no sale con anuncios.

## 3. Resultado mensual tras gastar 500 € en anuncios (EUR; CPA 5 / CPA 8 / CPA 12; incluye cuota fija)

Fórmula: (500/CPA) x (beneficio - CPA) - cuota mensual. Positivo = viable. Pedidos de ads = 100 / 62,5 / 41,7.

### A9 TikTok 9 %
| Coste | 19,90 | 24,90 | 29,90 | 34,90 |
|---|---|---|---|---|
| 3 | 486 / 116 / -89 | 816 / 322 / 48 | 1147 / 529 / 186 | 1477 / 736 / 324 |
| 5 | 286 / -9 / -172 | 616 / 198 / -35 | 947 / 404 / 103 | 1277 / 611 / 240 |
| 7 | 86 / -134 / -256 | 416 / 73 / -118 | 747 / 279 / 20 | 1077 / 486 / 157 |
| 10 | -214 / -321 / -381 | 116 / -115 / -243 | 447 / 92 / -105 | 777 / 298 / 32 |
| 14 | -614 / -571 / -548 | -284 / -365 / -410 | 47 / -158 / -272 | 377 / 48 / -135 |

### A4 TikTok 4 %
| Coste | 19,90 | 24,90 | 29,90 | 34,90 |
|---|---|---|---|---|
| 3 | 568 / 167 / -55 | 919 / 387 / 91 | 1270 / 606 / 237 | 1622 / 826 / 384 |
| 5 | 368 / 42 / -138 | 719 / 262 / 8 | 1070 / 481 / 154 | 1422 / 701 / 301 |
| 7 | 168 / -83 / -222 | 519 / 137 / -75 | 870 / 356 / 71 | 1222 / 576 / 217 |
| 10 | -132 / -270 / -347 | 219 / -51 / -200 | 570 / 169 / -54 | 922 / 389 / 93 |
| 14 | -532 / -520 / -513 | -181 / -301 / -367 | 170 / -81 / -221 | 522 / 139 / -74 |

### B Tienda propia
| Coste | 19,90 | 24,90 | 29,90 | 34,90 |
|---|---|---|---|---|
| 3 | 543 / 140 / -84 | 903 / 365 / 66 | 1262 / 589 / 216 | 1622 / 814 / 365 |
| 5 | 343 / 15 / -167 | 703 / 240 / -17 | 1062 / 464 / 132 | 1422 / 689 / 282 |
| 7 | 143 / -110 / -251 | 503 / 115 / -101 | 862 / 339 / 49 | 1222 / 564 / 199 |
| 10 | -157 / -298 / -376 | 203 / -73 / -226 | 562 / 152 / -76 | 922 / 377 / 74 |
| 14 | -557 / -548 / -542 | -197 / -323 / -392 | 162 / -98 / -243 | 522 / 127 / -93 |

### C eBay.es
| Coste | 19,90 | 24,90 | 29,90 | 34,90 |
|---|---|---|---|---|
| 3 | 356 / 35 / -143 | 663 / 227 / -15 | 970 / 419 / 112 | 1277 / 611 / 240 |
| 5 | 156 / -90 / -227 | 463 / 102 / -99 | 770 / 294 / 29 | 1077 / 486 / 157 |
| 7 | -44 / -215 / -310 | 263 / -23 / -182 | 570 / 169 / -54 | 877 / 361 / 74 |
| 10 | -344 / -402 / -435 | -37 / -211 / -307 | 270 / -19 / -179 | 577 / 173 / -51 |
| 14 | -744 / -652 / -602 | -437 / -461 / -474 | -130 / -269 / -346 | 177 / -77 / -218 |

### D Miravia 10 %
| Coste | 19,90 | 24,90 | 29,90 | 34,90 |
|---|---|---|---|---|
| 3 | 451 / 94 / -104 | 773 / 296 / 30 | 1095 / 497 / 165 | 1417 / 698 / 299 |
| 5 | 251 / -31 / -187 | 573 / 171 / -53 | 895 / 372 / 81 | 1217 / 573 / 215 |
| 7 | 51 / -156 / -270 | 373 / 46 / -136 | 695 / 247 / -2 | 1017 / 448 / 132 |
| 10 | -249 / -343 / -395 | 73 / -142 / -261 | 395 / 59 / -127 | 717 / 261 / 7 |
| 14 | -649 / -593 / -562 | -327 / -392 / -428 | -5 / -191 / -294 | 317 / 11 / -160 |

### E POD propia
| Coste | 19,90 | 24,90 | 29,90 | 34,90 |
|---|---|---|---|---|
| 3 | 689 / 231 / -23 | 1077 / 474 / 138 | 1465 / 716 / 300 | 1854 / 959 / 462 |
| 5 | 489 / 106 / -107 | 877 / 349 / 55 | 1265 / 591 / 217 | 1654 / 834 / 379 |
| 7 | 289 / -19 / -190 | 677 / 224 / -28 | 1065 / 466 / 133 | 1454 / 709 / 295 |
| 10 | -11 / -206 / -315 | 377 / 36 / -153 | 765 / 279 / 8 | 1154 / 522 / 170 |
| 14 | -411 / -456 / -482 | -23 / -214 / -320 | 365 / 29 / -158 | 754 / 272 / 4 |

Nota: "viable" arriba solo cubre el gasto de anuncios con CPA dado. No incluye tu tiempo, alta fiscal, IVA/IRPF ni el coste de creativos (cero en este plan).

## 4. Perfil de winner por canal

Criterio: beneficio por pedido >= CPA de 8 € + 3 € de objetivo (como el `--objetivo 3` del script) = 11 € ("winner holgado"); y >= 8 € (mínimo para no perder con CPA 8). Fórmulas: coste máximo = base x (1 - devol - comisión - otros) - fijo - beneficio objetivo; PVP mínimo = 1,21 x (coste + fijo + objetivo) / (1 - devol - comisión - otros).

### Coste máximo puesto en cliente (EUR), por PVP 19,90 / 24,90 / 29,90 / 34,90

| Canal | Para beneficio >= 8 (equilibrio CPA 8) | Para beneficio >= 11 (CPA 8 + 3) |
|---|---|---|
| A9 TikTok 9 % | 4,86 / 8,16 / 11,47 / 14,77 | 1,86 / 5,16 / 8,47 / 11,77 |
| A4 TikTok 4 % | 5,68 / 9,19 / 12,70 / 16,22 | 2,68 / 6,19 / 9,70 / 13,22 |
| B Tienda propia | 5,75 / 9,35 / 12,94 / 16,54 | 2,75 / 6,35 / 9,94 / 13,54 |
| C eBay.es | 3,56 / 6,63 / 9,70 / 12,77 | 0,56 / 3,63 / 6,70 / 9,77 |
| D Miravia 10 % | 4,51 / 7,73 / 10,95 / 14,17 | 1,51 / 4,73 / 7,95 / 11,17 |
| E POD (hipótesis) | 7,21 / 11,09 / 14,97 / 18,86 | 4,21 / 8,09 / 11,97 / 15,86 |

### Relación PVP/coste mínima (límite beneficio >= 11), por PVP 19,90 / 24,90 / 29,90 / 34,90
- A9: 10,7 / 4,8 / 3,5 / 3,0 | A4: 7,4 / 4,0 / 3,1 / 2,6 | B: 7,2 / 3,9 / 3,0 / 2,6 | C: 35 / 6,9 / 4,5 / 3,6 | D: 13 / 5,3 / 3,8 / 3,1 | E: 4,7 / 3,1 / 2,5 / 2,2.
- Para beneficio >= 8: A9 4,1 / 3,05 / 2,6 / 2,4; A4 3,5 / 2,7 / 2,35 / 2,15; B 3,5 / 2,7 / 2,3 / 2,1; C 5,6 / 3,75 / 3,1 / 2,7; D 4,4 / 3,2 / 2,7 / 2,5; E 2,8 / 2,25 / 2,0 / 1,85.
- Regla práctica (PVP >= 24,90): para ser winner con holgura hace falta PVP/coste >= ~4 (TikTok 4 %, propia), ~5 (TikTok 9 %, Miravia), ~7 (eBay).

### Ticket (PVP) mínimo por coste, para beneficio >= 11 (y >= 8)
| Coste | 3 | 5 | 7 | 10 | 14 |
|---|---|---|---|---|---|
| A9 TikTok 9 % | 21,63 (17,09) | 24,65 (20,12) | 27,68 (23,14) | 32,22 (27,68) | 38,27 (33,73) |
| A4 TikTok 4 % | 20,36 (16,09) | 23,20 (18,93) | 26,05 (21,78) | 30,32 (26,05) | 36,02 (31,74) |
| B Tienda propia | 20,24 (16,07) | 23,02 (18,85) | 25,81 (21,63) | 29,98 (25,81) | 35,55 (31,37) |
| C eBay.es | 23,87 (18,98) | 27,13 (22,24) | 30,38 (25,50) | 35,27 (30,38) | 41,79 (36,90) |
| D Miravia 10 % | 22,21 (17,55) | 25,32 (20,66) | 28,42 (23,77) | 33,08 (28,42) | 39,30 (34,64) |
| E POD (hipótesis) | 18,35 (14,49) | 20,92 (17,06) | 23,50 (19,64) | 27,36 (23,50) | 32,51 (28,65) |

Multiplicador práctico PVP = coste x k + constante: PVP minimo para beneficio objetivo T = (coste + fijo + T) x factor, factor = 1,512 (A9), 1,424 (A4), 1,391 (B), 1,629 (C), 1,553 (D), 1,288 (E).

## 5. Viable con 500 €/mes vs imposible (resumen)

Viable (positivo con CPA 8 y CPA 12 a la vez) con holgura: coste <= 5 con PVP >= 24,90 en A4/B; coste <= 7 con PVP >= 29,90 en A4/B/A9; coste 10 solo con PVP 34,90 y en TikTok/propia (CPA 12 +32 a +93). TikTok 4 % es la mejor plataforma de pago por comisión; solo dura 60 días y exige 5 productos activos (CLAUDE.md, sin verificar).
- Margen cómodo (CPA 8, resultado >= ~+200 €/mes): coste 3 con PVP >= 24,90 (todos los canales); coste 5 con PVP >= 24,90 en A4/B (A9 +198 en el límite; C y D no); coste 7 con PVP >= 29,90 (A9/A4/B/D; C +169); coste 10 con PVP 34,90 (A9/A4/B/D; C +173).
- Frágil (positivo solo con CPA 5, negativo con CPA 12): coste 7 / PVP 24,90; coste 10 / PVP 29,90 en A9; todo coste 10 en eBay o Miravia salvo PVP 34,90.
- Imposible o negativo: coste 14 con PVP 19,90 en todos los canales (beneficio <= 0 antes de anuncios; POD +1,21 no cubre ningún CPA) y coste 14 con PVP 24,90 en canales marketplace (beneficio 0,6-3,4 €: ROAS necesario 7,4x a 39x); coste 10 con PVP 19,90 con CPA 8 o 12 en cualquier canal (beneficio 1,6-5,2 € < CPA); eBay con coste >= 10 salvo PVP 34,90; coste 14 con PVP 29,90 con CPA 8 o 12 en todos los canales salvo POD (hipótesis: +29 con CPA 8).
- El PVP 19,90 solo da positivo con CPA 8 con coste <= 3 (A9 +116, A4 +167, B +140, D +94, C +35) y coste 5 solo en A4 (+42) y B (+15); con CPA 12 es negativo con coste >= 5 en todos los canales y con coste 3 queda entre -23 y -143 €/mes salvo POD (hipótesis, -23): PVP 19,90 no sirve con CPA 12.
- Caso del proyecto: rodillo (coste 13,30 + envío no desglosado; PVP 27,90): beneficio ~7,15 según CLAUDE.md. En esta rejilla se sitúa entre las columnas 24,90 y 29,90 con coste 14: A9 beneficio 2,16-5,47. No es winner: ROAS de equilibrio 5,5x a 29,90.
- Con CPA 12 (hipótesis de producto sin ventaja) sobreviven: coste 3 con PVP >= 24,90 (salvo eBay 24,90: -15), coste 5 con PVP >= 29,90, coste 7 con PVP >= 29,90 solo A4/B/A9 (+71/+49/+20) y coste 10 con PVP 34,90 (A4 +93, B +74, A9 +32, D +7).

## 6. Dos escenarios recalculados a mano

Escenario 1 (A9 TikTok 9 %, PVP 24,90, coste 7, sin afiliado, devoluciones 10 %):
- base = 24,90 / 1,21 = 20,5785; ingresos = 0,90 x 20,5785 = 18,5207.
- costes: producto 7,00 + embalaje 0,30 + comisión 9 % x 20,5785 = 1,8521 + otros 1 % x 20,5785 = 0,2058 + envío 0 + afiliado 0 = 9,3579.
- beneficio = 18,5207 - 9,3579 = 9,1628 -> 9,16 (script: 9,16; margen 9,1628/20,5785 = 44,5 %, coincide).
- Con CPA 8: 62,5 pedidos x (9,16 - 8) = +72,6 -> 73 (tabla: 73). ROAS equilibrio 24,90/9,16 = 2,72 (tabla: 2,72).

Escenario 2 (B tienda propia, PVP 34,90, coste 10):
- base = 34,90 / 1,21 = 28,8430; ingresos = 0,90 x 28,8430 = 25,9587.
- costes: producto 10,00 + embalaje 0,30 + fijo pasarela 0,25 + pasarela 2,5 % x 34,90 = 0,8725 (=3,025 % x 28,8430, igual que el script) = 11,4225.
- beneficio = 25,9587 - 11,4225 = 14,5362 -> 14,54 (script: 14,54; margen 50,4 %, coincide).
- Pedidos de equilibrio con cuota 32: 532 / 14,54 = 36,6 -> 37 (tabla 37). Con CPA 12: 41,67 x (14,54 - 12) - 32 = 105,7 - 32 = 73,7 -> 74 (tabla 74).

Ambos coinciden con el script; no hay cifras raras de cálculo. Cifras raras de significado (marcadas):
1. El script resta el producto entero cuando hay devolución (devoluciones solo reducen ingresos): conservador, sobreestima la pérdida si el producto vuelve a stock o el proveedor reembolsa.
2. Aplicación de comisión sobre la base sin IVA para TikTok; si TikTok la cobra sobre el total con IVA, baja ~0,4 €/pedido (ver sensibilidad).
3. `--otros 0,01` en TikTok no se ha contrastado (¿pasarela incluida en la comisión?). Lo mantengo por defecto del script; para eBay/Miravia lo dejo a 0 asumiendo pasarela incluida (no verificado).
4. El script dice GO/HOLD con su propio criterio (margen 25 % + objetivo 3 €); aquí no lo uso. Su `pvp_minimo` pide margen sobre base, no es lo mismo que el ticket mínimo calculado arriba.
5. `--help` sigue fallando (línea 88, `%` sin escapar en "4% (60 días...)").

## 7. Supuestos NO verificados

- Comisión TikTok Shop ES 4 % tienda nueva: no confirmada en búsqueda web (sí 9 % general, edesk abr-2026; 5 % de lanzamiento en dic-2024, Hipertextual). Comprobar en Seller Center.
- Si TikTok cobra sobre total con IVA y si incluye envío/descuentos plataforma (edesk dice total del pedido).
- Shopify: 32 €/mes Basic mensual (otra fuente 36 €); tarifa de tarjeta en España; tarjetas extracomunitarias o Shop Pay cobran distinto; coste de dominio, apps, Meta/Google tracking. Sin dominio ni tráfico propio la tienda propia no tiene audiencia: CPA 5-12 € en tienda propia con anuncios fríos no está demostrado.
- eBay.es: comisión 13 % (edesk 13-15 % genérico), tarifa fija 0,35 € por pedido y 0 % hasta 150 anuncios (Easync) y reforma de julio 2026 (Beancount): contradictorias. Promoted Listings (coste extra) no incluidos. Si eBay cobra solo sobre el artículo sin IVA, mejora ~2 pp.
- Miravia: comisión 6-15 % (Lengow); sin cuota mensual; depósito de 3000 yuanes (fuente china, sin confirmar); requisitos de alta de vendedor español y logística propia sin verificar; si los pedidos son vendidos con ads o sin ellos.
- POD: solo precios base en USD (Printify camiseta ~6 USD, Printful 7,25-13,75 USD, planes 19,99-24,99 EUR/mes); envío a España y plazos no encontrados; coste puesto en cliente 10-14 € es hipótesis; devoluciones 3 % es supuesto (la excepción de desistimiento para bienes personalizados en la UE debe verificarse); POD sirve para producto diferenciado, no para producto de catálogo comparable.
- CPA 5, 8 y 12 € son escenarios del encargo; ninguno medido. Con mes 1 sin anuncios (CLAUDE.md) el CPA real no existe aún. El CPA depende de CTR/CVR del vídeo, no del canal; he usado el mismo CPA en todos los canales (en tienda propia, eBay y Miravia el CPA suele ser peor que en TikTok Shop, donde se compra dentro de la app; no verificado).
- Devoluciones 10 % y embalaje 0,30 €: supuestos del encargo/script. Afiliado 0 % (vídeos propios): si hay creadores, restar 15 % de los ingresos (tabla de sensibilidad).
- No incluye: alta autónomos/IVA trimestral, IRPF, coste de muestras (prohibido en esta ronda), contracargos, impuestos de venta cruzada UE (OSS), ni tiempo.
- Fuente de la búsqueda web (máx. 6; usadas 5): edesk.com (cuanto cuesta vender en tiktok shop españa), hipertextual.com (dic-2024), impulsaecommerce.com y m8d.io (Shopify precios), finom.co, digismoothie.com, ebay.es ayuda (tarifas business sellers), edesk.com (comisiones eBay), easync.io, beancount.io, lengow.com, packlink.com, marketing4ecommerce.net, printondemandbusiness.com. Todas leídas el 26/10/2026 solo como resultados de búsqueda, sin abrir las páginas.
