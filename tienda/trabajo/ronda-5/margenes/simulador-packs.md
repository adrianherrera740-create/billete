# Simulador de packs - ronda 5 (kit de interior sobre funda de volante)

Fecha: 2026-10-26. Autor: simulador de packs (analista-margenes).

## 1. Fuentes y límites
- Fichas: listados de AliExpress ES con envío desde España (filtro `shipFromCountry=ES`), ejecutando `.claude/skills/proveedor-es/scripts/aliexpress_es.js` el 2026-10-26. Solo se leyó el listado: las fichas NO se abrieron, así que variantes, tallas, compatibilidad, plazo real, CE/GPSR y marca real = no verificado.
- Funda de volante: AliExpress ES 1005008219047604 a 13,87 € y 1005008315429915 a 9,99 € (CLAUDE.md, estado ronda 3). Referencia de mercado de la funda sola: 38,96 € (CLAUDE.md, ronda 3; fecha no verificada).
- Cálculo: `margen_es.py` (python3, desde su carpeta) con `--envio 0 --dias-preparacion 2 --dias-entrega 5 --tienda-nueva --afiliado 0 --devoluciones 0.05`. Los días 2 y 5 son ESTIMACIÓN mía, no verificados; solo afectan al veredicto. Coste = precio entero de AliExpress (conservador, igual que en ronda 3). Comisión 4 % por tienda nueva (comprobar en Seller Center; al 9 % el margen baja unos 1,2-1,6 puntos de beneficio por pedido... cifra orientativa, no recalculada). Embalaje 0,30 €/pedido (defecto del script).
- Ambientador sin marca: no se buscó (fuera del encargo); queda fuera de los packs. Sin precio = no verificado.

## 2. Fichas encontradas
| Pieza | ID | Precio | Vendidos | Valoración | Marca ajena | Notas |
|---|---|---|---|---|---|---|
| Cubre cinturón (2 uds, goma, antiarañazos) | [1005013109335632](https://es.aliexpress.com/item/1005013109335632.html) | 6,39 € | 5.000+ | 4,9 | No en el título | Envío gratis. Elegida para los packs. |
| Cubre hebilla cinturón (2 uds) "BLALION" | [1005013081192406](https://es.aliexpress.com/item/1005013081192406.html) | 7,39 € | 10.000+ | 4,9 | "BLALION" parece marca del vendedor, no conocida; no verificado | Envío gratis. Alternativa con más ventas. |
| Perilla/cubierta silicona palanca universal | [1005013119138107](https://es.aliexpress.com/item/1005013119138107.html) | 12,72 € | 2.000+ | 4,9 | No en el título | Envío gratis; etiqueta "3+, compensamos aranceles" (sugiere que NO es stock en España: no verificado). Ajuste a palanca manual/automática = no verificado. Elegida para el kit. |
| Funda palanca (título mal traducido) | [1005006116721755](https://es.aliexpress.com/item/1005006116721755.html) | 2,99 € | sin dato | sin dato | No verificado | Envío "01-06 de NOV", sin ventas ni valoración: descartada. |
| Cubre freno de mano | - | - | - | - | - | La búsqueda solo devolvió herramientas de freno y piezas de simulador: NO hay ficha válida. El kit se hace sin esta pieza. |

Aviso: el listado también devolvió productos ajenos (juguetes, arneses); ignorados. Los juguetes están excluidos por regla.

## 3. Packs y margen
Coste de pack = suma de precios de AliExpress. PVP en 25-45 €. Margen sobre base sin IVA. Veredicto = el del script (GO si margen >= 25 % y beneficio suficiente).

### Con funda a 13,87 €
| Pack | Piezas | Coste | PVP | Beneficio/pedido | Margen | Margen para anuncio (beneficio - 3 €) | Veredicto |
|---|---|---|---|---|---|---|---|
| A. Solo funda | funda | 13,87 | 29,90 | 8,07 | 32,7 % | 5,07 | GO |
| A. Solo funda | funda | 13,87 | 34,90 | 11,79 | 40,9 % | 8,79 | GO |
| B. Funda + cubre cinturones | + 6,39 | 20,26 | 34,90 | 5,40 | 18,7 % | 2,40 | HOLD |
| B. Funda + cubre cinturones | + 6,39 | 20,26 | 39,90 | 9,12 | 27,7 % | 6,12 | GO (PVP mín. 25 %: 38,3) |
| C. Kit 3 piezas | + 6,39 + 12,72 | 32,98 | 39,90 | -3,60 | -10,9 % | -6,60 | NO-GO |
| C. Kit 3 piezas | idem | 32,98 | 44,90 | 0,12 | 0,3 % | -2,88 | HOLD (PVP mín. 25 %: 62,0) |

### Con funda a 9,99 €
| Pack | Coste | PVP | Beneficio/pedido | Margen | Margen para anuncio (beneficio - 3 €) | Veredicto |
|---|---|---|---|---|---|---|
| A. Solo funda | 9,99 | 29,90 | 11,95 | 48,4 % | 8,95 | GO |
| A. Solo funda | 9,99 | 34,90 | 15,67 | 54,3 % | 12,67 | GO |
| B. Funda + cinturones | 16,38 | 34,90 | 9,28 | 32,2 % | 6,28 | GO |
| B. Funda + cinturones | 16,38 | 39,90 | 13,00 | 39,4 % | 10,00 | GO |
| C. Kit 3 piezas | 29,10 | 39,90 | 0,28 | 0,8 % | -2,72 | HOLD |
| C. Kit 3 piezas | 29,10 | 44,90 | 4,00 | 10,8 % | 1,00 | HOLD (PVP mín. 25 %: 54,8) |

### Efecto en ticket medio y beneficio absoluto (funda 9,99 €)
- A 29,90 -> B 34,90: ticket +5,00 €, beneficio 11,95 -> 9,28 (baja 2,67 €). Subir el ticket NO sube el beneficio; solo lo sube B a 39,90 (13,00 €, +1,05 sobre A a 29,90) y ahí el PVP supera lo que se defiende por una funda.
- Con funda a 13,87 €: A 29,90 (8,07 €) frente a B 39,90 (9,12 €): +1,05 € de beneficio por +10 € de ticket.

## 4. Recomendación
- Pack que se empuja en vídeo: **A, solo funda** (29,90 €). Una sola pieza, una demostración clara, un solo vendedor, sin riesgo de envíos partidos. Es el único con margen sólido con las dos fundas.
- Ancla de precio: **B funda + cubre cinturones a 39,90 €** (poca diferencia con la referencia de mercado de la funda sola, 38,96 €: el cliente percibe el cubre cinturones "casi gratis"). Solo es válido con la funda de 9,99 € (39,4 %); con la de 13,87 € queda justo (27,7 %).
- Kit de 3 piezas: **no lanzar**. No llega al 25 % ni a 45 € con ninguna funda (haría falta PVP 54,8-62 €, fuera del rango). Solo reconsiderar si se consigue la palanca bastante por debajo de 12,72 € con ficha verificada.
- Condición previa: los números dependen de que la funda de 9,99 € (1005008315429915) pase verificación (plazo, stock, tallas). Sin eso, GO solo para A.

## 5. Riesgo de envíos separados
- Las tres piezas son de listados distintos de AliExpress, casi seguro de vendedores distintos (no verificado). Cada vendedor envía por su cuenta: el cliente recibe 2-3 paquetes en fechas distintas, con seguimientos distintos.
- TikTok Shop exige entrega al transportista en 2 días laborables con seguimiento válido (CLAUDE.md; comprobar en Seller Center). Un pedido con piezas de vendedores distintos puede incumplir el plazo en una pieza y penalizar la tienda; además una pieza que llega tarde dispara devoluciones/cancelaciones de todo el pack.
- Coste oculto: el script cuenta 0,30 € de embalaje por pedido; con piezas separadas no se ahorra nada y la devolución parcial no está modelada (el 5 % asume reembolso completo).
- Etiqueta "3+, compensamos aranceles" en la palanca indica posible origen fuera de España: no mezclarla con piezas de stock España.
- Mitigación: solo vender B si funda y cubre cinturones salen del MISMO vendedor, o abastecerse de un almacén propio/dropshipper único. Si no, vender A y B como productos separados de "añadir al carrito" no resuelve el problema, pero reduce el daño a una pieza. Plazos reales de cada vendedor: no verificado.

## 6. Pendiente de otros departamentos
- Operaciones/cumplimiento: confirmar vendedor único, plazos, GPSR/CE de las piezas y seguro de que los cubre cinturones no alteran la seguridad (un cubre que impide el cierre de la hebilla sería un riesgo legal: no se promete nada de seguridad en la ficha).
- Buscador: ficha abierta de 1005013109335632 y 1005013081192406 (mismo vendedor que la funda, variantes, fotos).
- Demanda de packs en TikTok Shop ES: no verificado (FastMoss 429).
