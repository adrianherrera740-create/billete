# Calculador de escenarios, ronda 11 (márgenes)

Fecha de cálculo: 2026-10-26. Herramientas: `.claude/skills/proveedor-es/scripts/margen_es.py` y `escalado.py` (ejecutados, no reimplementados). Reglas de `cerebro/aprendizajes.md` leídas (7, 8, 9).

## Supuestos (todos comunes)
- Coste = precio de AliExpress entero (fuente: dato del director, ronda 11); envío al cliente 0; embalaje 0,30 € (por defecto del script); otros cargos 1 %; IVA 21 % (PVP con IVA, el script lo quita).
- `--dias-preparacion 2` puesto a mano solo para que el script no marque NO-GO por plazo: **plazo real del proveedor no verificado**; no afecta a las cifras.
- Afiliado 0 en las tablas principales (vídeos propios + anuncios). Última columna: con afiliado 0,15.
- Devoluciones 10 % y 15 % (el script las trata como producto perdido, prudente). Comisión 9 % (régimen normal) y 4 % (tienda nueva, 60 días; confirmar en Seller Center).
- Nota: con afiliado 0, "4 % y dev. 15 %" da exactamente lo mismo que "9 % y dev. 10 %" (5 puntos de base en ambos lados). No es un error.
- Los productos A (kit limpieza) y "kit ampliado" tienen el mismo coste 6,19 €, así que los números son idénticos. Cualquier diferencia de PVP defendible entre ambos depende del mercado.
- Pedidos/mes con 500 € de anuncios (no dependen de PVP): CPA 5 = 100; CPA 8 = 62; CPA 12 = 41.
- CPA de equilibrio = beneficio por pedido sin anuncios. ROAS de equilibrio = PVP con IVA / CPA de equilibrio (misma definición que escalado.py). Todos los CPA son supuestos, ninguno medido.

## Tablas por producto (beneficio por pedido en €, sin anuncios)

#### A1/A2 kit limpieza altavoz/puerto (y kit ampliado), coste 6.19 €

| PVP € | Ben. 9 % dev 10 % | Ben. 9 % dev 15 % | Ben. 4 % dev 10 % | Ben. 4 % dev 15 % | Margen 9 %/15 % | CPA eq. 9 %/15 % | ROAS eq. 9 %/15 % | Ben. con afiliado 15 % (9 %/15 %) |
|---|---|---|---|---|---|---|---|---|
| 9.9 | 0.06 | -0.35 | 0.46 | 0.06 | -4.3% | 0.00 | sin equilibrio | -1.40 |
| 12.9 | 2.04 | 1.51 | 2.57 | 2.04 | 14.1% | 1.51 | 8.54x | 0.15 |
| 14.9 | 3.36 | 2.75 | 3.98 | 3.36 | 22.3% | 2.75 | 5.42x | 1.18 |
| 19.9 | 6.67 | 5.84 | 7.49 | 6.67 | 35.5% | 5.84 | 3.41x | 3.75 |
| 24.9 | 9.97 | 8.94 | 11.00 | 9.97 | 43.5% | 8.94 | 2.79x | 6.32 |
| 29.9 | 13.28 | 12.04 | 14.51 | 13.28 | 48.7% | 12.04 | 2.48x | 8.89 |

#### B1 extractor abolladuras, coste 7.09 €

| PVP € | Ben. 9 % dev 10 % | Ben. 9 % dev 15 % | Ben. 4 % dev 10 % | Ben. 4 % dev 15 % | Margen 9 %/15 % | CPA eq. 9 %/15 % | ROAS eq. 9 %/15 % | Ben. con afiliado 15 % (9 %/15 %) |
|---|---|---|---|---|---|---|---|---|
| 9.9 | -0.84 | -1.25 | -0.44 | -0.84 | -15.3% | 0.00 | sin equilibrio | -2.30 |
| 12.9 | 1.14 | 0.61 | 1.67 | 1.14 | 5.7% | 0.61 | 21.15x | -0.75 |
| 14.9 | 2.46 | 1.85 | 3.08 | 2.46 | 15.0% | 1.85 | 8.05x | 0.28 |
| 19.9 | 5.77 | 4.94 | 6.59 | 5.77 | 30.1% | 4.94 | 4.03x | 2.85 |
| 24.9 | 9.07 | 8.04 | 10.10 | 9.07 | 39.1% | 8.04 | 3.10x | 5.42 |
| 29.9 | 12.38 | 11.14 | 13.61 | 12.38 | 45.1% | 11.14 | 2.68x | 7.99 |

#### B2 extractor abolladuras, coste 5.89 €

| PVP € | Ben. 9 % dev 10 % | Ben. 9 % dev 15 % | Ben. 4 % dev 10 % | Ben. 4 % dev 15 % | Margen 9 %/15 % | CPA eq. 9 %/15 % | ROAS eq. 9 %/15 % | Ben. con afiliado 15 % (9 %/15 %) |
|---|---|---|---|---|---|---|---|---|
| 9.9 | 0.36 | -0.05 | 0.76 | 0.36 | -0.7% | 0.00 | sin equilibrio | -1.10 |
| 12.9 | 2.34 | 1.81 | 2.87 | 2.34 | 16.9% | 1.81 | 7.13x | 0.45 |
| 14.9 | 3.66 | 3.05 | 4.28 | 3.66 | 24.7% | 3.05 | 4.89x | 1.48 |
| 19.9 | 6.97 | 6.14 | 7.79 | 6.97 | 37.4% | 6.14 | 3.24x | 4.05 |
| 24.9 | 10.27 | 9.24 | 11.30 | 10.27 | 44.9% | 9.24 | 2.69x | 6.62 |
| 29.9 | 13.58 | 12.34 | 14.81 | 13.58 | 50.0% | 12.34 | 2.42x | 9.19 |

#### B3 kit abolladuras, coste 22.59 €

| PVP € | Ben. 9 % dev 10 % | Ben. 9 % dev 15 % | Ben. 4 % dev 10 % | Ben. 4 % dev 15 % | Margen 9 %/15 % | CPA eq. 9 %/15 % | ROAS eq. 9 %/15 % | Ben. con afiliado 15 % (9 %/15 %) |
|---|---|---|---|---|---|---|---|---|
| 9.9 | -16.34 | -16.75 | -15.94 | -16.34 | -204.8% | 0.00 | sin equilibrio | -17.80 |
| 12.9 | -14.36 | -14.89 | -13.83 | -14.36 | -139.7% | 0.00 | sin equilibrio | -16.25 |
| 14.9 | -13.04 | -13.65 | -12.42 | -13.04 | -110.9% | 0.00 | sin equilibrio | -15.22 |
| 19.9 | -9.73 | -10.56 | -8.91 | -9.73 | -64.2% | 0.00 | sin equilibrio | -12.65 |
| 24.9 | -6.43 | -7.46 | -5.40 | -6.43 | -36.2% | 0.00 | sin equilibrio | -10.08 |
| 29.9 | -3.12 | -4.36 | -1.89 | -3.12 | -17.6% | 0.00 | sin equilibrio | -7.51 |
| 39.9 | 3.49 | 1.84 | 5.14 | 3.49 | 5.6% | 1.84 | 21.68x | -2.36 |
| 44.9 | 6.80 | 4.94 | 8.65 | 6.80 | 13.3% | 4.94 | 9.09x | 0.21 |

#### C cepillo desagüe, coste 7.39 €

| PVP € | Ben. 9 % dev 10 % | Ben. 9 % dev 15 % | Ben. 4 % dev 10 % | Ben. 4 % dev 15 % | Margen 9 %/15 % | CPA eq. 9 %/15 % | ROAS eq. 9 %/15 % | Ben. con afiliado 15 % (9 %/15 %) |
|---|---|---|---|---|---|---|---|---|
| 9.9 | -1.14 | -1.55 | -0.74 | -1.14 | -19.0% | 0.00 | sin equilibrio | -2.60 |
| 12.9 | 0.84 | 0.31 | 1.37 | 0.84 | 2.9% | 0.31 | 41.61x | -1.05 |
| 14.9 | 2.16 | 1.55 | 2.78 | 2.16 | 12.6% | 1.55 | 9.61x | -0.02 |
| 19.9 | 5.47 | 4.64 | 6.29 | 5.47 | 28.2% | 4.64 | 4.29x | 2.55 |
| 24.9 | 8.77 | 7.74 | 9.80 | 8.77 | 37.6% | 7.74 | 3.22x | 5.12 |
| 29.9 | 12.08 | 10.84 | 13.31 | 12.08 | 43.9% | 10.84 | 2.76x | 7.69 |

#### D1 escurridor silicona, coste 11.99 €

| PVP € | Ben. 9 % dev 10 % | Ben. 9 % dev 15 % | Ben. 4 % dev 10 % | Ben. 4 % dev 15 % | Margen 9 %/15 % | CPA eq. 9 %/15 % | ROAS eq. 9 %/15 % | Ben. con afiliado 15 % (9 %/15 %) |
|---|---|---|---|---|---|---|---|---|
| 9.9 | -5.74 | -6.15 | -5.34 | -5.74 | -75.2% | 0.00 | sin equilibrio | -7.20 |
| 12.9 | -3.76 | -4.29 | -3.23 | -3.76 | -40.3% | 0.00 | sin equilibrio | -5.65 |
| 14.9 | -2.44 | -3.05 | -1.82 | -2.44 | -24.8% | 0.00 | sin equilibrio | -4.62 |
| 19.9 | 0.87 | 0.04 | 1.69 | 0.87 | 0.3% | 0.04 | 497.50x | -2.05 |
| 24.9 | 4.17 | 3.14 | 5.20 | 4.17 | 15.3% | 3.14 | 7.93x | 0.52 |
| 29.9 | 7.48 | 6.24 | 8.71 | 7.48 | 25.3% | 6.24 | 4.79x | 3.09 |

#### D2 escurridor silicona, coste 8.08 €

| PVP € | Ben. 9 % dev 10 % | Ben. 9 % dev 15 % | Ben. 4 % dev 10 % | Ben. 4 % dev 15 % | Margen 9 %/15 % | CPA eq. 9 %/15 % | ROAS eq. 9 %/15 % | Ben. con afiliado 15 % (9 %/15 %) |
|---|---|---|---|---|---|---|---|---|
| 9.9 | -1.83 | -2.24 | -1.43 | -1.83 | -27.4% | 0.00 | sin equilibrio | -3.29 |
| 12.9 | 0.15 | -0.38 | 0.68 | 0.15 | -3.6% | 0.00 | sin equilibrio | -1.74 |
| 14.9 | 1.47 | 0.86 | 2.09 | 1.47 | 6.9% | 0.86 | 17.33x | -0.71 |
| 19.9 | 4.78 | 3.95 | 5.60 | 4.78 | 24.0% | 3.95 | 5.04x | 1.86 |
| 24.9 | 8.08 | 7.05 | 9.11 | 8.08 | 34.3% | 7.05 | 3.53x | 4.43 |
| 29.9 | 11.39 | 10.15 | 12.62 | 11.39 | 41.1% | 10.15 | 2.95x | 7.00 |

#### E removedor pegatinas, coste 6.09 €

| PVP € | Ben. 9 % dev 10 % | Ben. 9 % dev 15 % | Ben. 4 % dev 10 % | Ben. 4 % dev 15 % | Margen 9 %/15 % | CPA eq. 9 %/15 % | ROAS eq. 9 %/15 % | Ben. con afiliado 15 % (9 %/15 %) |
|---|---|---|---|---|---|---|---|---|
| 9.9 | 0.16 | -0.25 | 0.56 | 0.16 | -3.1% | 0.00 | sin equilibrio | -1.30 |
| 12.9 | 2.14 | 1.61 | 2.67 | 2.14 | 15.1% | 1.61 | 8.01x | 0.25 |
| 14.9 | 3.46 | 2.85 | 4.08 | 3.46 | 23.1% | 2.85 | 5.23x | 1.28 |
| 19.9 | 6.77 | 5.94 | 7.59 | 6.77 | 36.1% | 5.94 | 3.35x | 3.85 |
| 24.9 | 10.07 | 9.04 | 11.10 | 10.07 | 43.9% | 9.04 | 2.75x | 6.42 |
| 29.9 | 13.38 | 12.14 | 14.61 | 13.38 | 49.1% | 12.14 | 2.46x | 8.99 |

## PVP mínimo para 25 % de margen (salida de `pvp_minimo_para_margen`, afiliado 0, comisión 9 %)

| Producto (coste) | Dev. 10 % | Dev. 15 % |
|---|---|---|
| E removedor (6,09) | 14,10 | 15,50 |
| A kit limpieza / ampliado (6,19) | 14,30 | 15,80 |
| B2 extractor (5,89) | 13,70 | 15,00 |
| B1 extractor (7,09) | 16,30 | 17,90 |
| C cepillo (7,39) | 17,00 | 18,70 |
| D2 escurridor (8,08) | 18,50 | 20,30 |
| D1 escurridor (11,99) | 27,10 | 29,80 |
| B3 kit abolladuras (22,59) | 50,40 | 55,40 |

(La cifra con comisión 4 % es unos 1,5 a 2 € más baja; no se ha tabulado.)

## Pedidos/mes con 500 € de anuncios y resultado (escalado.py, comisión 9 %, dev. 15 %, afiliado 0)
Beneficio mensual = pedidos x (beneficio por pedido - CPA). Con CPA 5 / 8 / 12 (100 / 62 / 41 pedidos):

| Producto y PVP | CPA 5 | CPA 8 | CPA 12 |
|---|---|---|---|
| A 24,90 (ben. 8,94) | +394 | +59 | -127 |
| A 29,90 (ben. 12,04) | +704 | +250 | +2 |
| B2 24,90 (ben. 9,24) | +424 | +77 | -115 |
| B2 29,90 (ben. 12,34) | +734 | +270 | +14 |
| B1 24,90 (ben. 8,04) | +304 | +2 | -165 |
| B1 29,90 (ben. 11,14) | +614 | +195 | -36 |
| C 24,90 (ben. 7,74) | +274 | -16 | -176 |
| C 29,90 (ben. 10,84) | +584 | +176 | -48 |
| D2 24,90 (ben. 7,05) | +205 | -59 | -207 |
| D2 29,90 (ben. 10,15) | +515 | +133 | -77 |
| D1 29,90 (ben. 6,24) | +124 | -110 | -240 |
| E 24,90 (ben. 9,04) | +404 | +65 | -121 |
| E 29,90 (ben. 12,14) | +714 | +257 | +6 |
| B3 kit 44,90 (ben. 4,94) | -6 | -190 | -290 |

Redondeo a euros enteros con 62 y 41 pedidos; escalado.py da 62 y 42 (usa 500/12 redondeado). Diferencia de pocos euros.

## Veredicto de escalado (escalado.py, dev. 15 %, comisión 9 %, afiliado 0; CPA base 6 y 8)

| Producto | PVP | Con CPA base 6 | Con CPA base 8 |
|---|---|---|---|
| A kit / kit ampliado | 19,90 | PARAR | PARAR |
| A | 24,90 | AGUANTAR | NO ESCALAR |
| A | 29,90 | ESCALAR por etapas | ESCALAR por etapas |
| B2 extractor 5,89 | 19,90 | NO ESCALAR | PARAR |
| B2 | 24,90 | AGUANTAR | NO ESCALAR |
| B2 | 29,90 | ESCALAR por etapas | ESCALAR por etapas |
| B1 extractor 7,09 | 19,90 | PARAR | PARAR |
| B1 | 24,90 | AGUANTAR | NO ESCALAR |
| B1 | 29,90 | ESCALAR por etapas | AGUANTAR (margen seguridad 28 %) |
| B3 kit 22,59 | 39,90 / 44,90 | PARAR | PARAR |
| C cepillo | 19,90 | PARAR | PARAR |
| C | 24,90 | AGUANTAR | PARAR |
| C | 29,90 | ESCALAR por etapas | AGUANTAR (26 %) |
| D2 escurridor 8,08 | 24,90 | NO ESCALAR | PARAR |
| D2 | 29,90 | ESCALAR por etapas | AGUANTAR (21 %) |
| D1 escurridor 11,99 | 24,90 | PARAR | PARAR |
| D1 | 29,90 | NO ESCALAR | PARAR |
| E removedor | 19,90 | PARAR | PARAR |
| E | 24,90 | AGUANTAR | NO ESCALAR |
| E | 29,90 | ESCALAR por etapas | ESCALAR por etapas |

Con afiliado 15 % (ventas por creadores) el beneficio baja unos 3,1 a 3,3 € por pedido a PVP 29,90 y ningún producto aguanta bien a 24,90 o menos (ver última columna de las tablas).

### Veredicto por producto
- **A kit limpieza (6,19)**: viable solo a PVP >= 24,90 con anuncios; escalable a 29,90. A 19,90 deja 5,84 € y no cubre CPA 6. Sin anuncios (mes 1) funciona a 14,90 a 19,90 (2,75 a 5,84 €), con margen modesto.
- **B2 extractor a 5,89**: el mejor de la lista junto a E. Escalable a 29,90, aguanta a 24,90. B1 a 7,09 es 1,30 € peor por pedido: solo aguanta a 29,90.
- **B3 kit abolladuras (22,59)**: NO viable a ningún PVP probado (hasta 44,90 deja 4,94 €; 25 % de margen exige 55,40 €). Descartar o renegociar coste.
- **C cepillo (7,39)**: solo con PVP 29,90; a 24,90 no cubre CPA 8.
- **D1 escurridor a 11,99**: no viable. D2 a 8,08 solo con PVP 29,90 y CPA <= 8.
- **E removedor (6,09)**: junto a A y B2, escalable a 29,90.

## PVP que deja negocio con CPA 8 (matiz importante)
El beneficio sube con el PVP, así que no existe un PVP máximo por la parte de costes: lo que hay es un PVP mínimo y un techo que pone el mercado. PVP mínimo (afiliado 0, comisión 9 %), calculado como PVP = 1,21 x (T + coste + 0,30) / (1 - dev - 0,10), con T = beneficio objetivo antes de anuncios:

| Producto (coste) | Equilibrio CPA 8, dev 15 % | Equilibrio CPA 8, dev 10 % | CPA 8 y +3 € de beneficio (T=11), dev 15 % | Idem, dev 10 % |
|---|---|---|---|---|
| B2 (5,89) | 22,89 | 21,46 | 27,73 | 26,00 |
| E (6,09) | 23,22 | 21,76 | 28,06 | 26,30 |
| A (6,19) | 23,38 | 21,92 | 28,22 | 26,45 |
| B1 (7,09) | 24,83 | 23,28 | 29,67 | 27,81 |
| C (7,39) | 25,31 | 23,73 | 30,15 | 28,27 |
| D2 (8,08) | 26,43 | 24,77 | 31,27 | 29,31 |
| D1 (11,99) | 32,73 | 30,69 | 37,57 | 35,23 |
| B3 (22,59) | 49,84 | 46,72 | 54,68 | 51,26 |

Lectura: para tener 3 € de beneficio con CPA 8, la mayoría necesita PVP de **28 a 30 €** (D1 y B3 mucho más).

**Comparación con el mercado: PENDIENTE DE CRUZAR.** No tengo precios de mercado leídos (otro agente los lee). Mi hipótesis, sin verificar y sin fuente: productos de 6 a 8 € de coste en AliExpress suelen venderse en España a 8 a 15 € (regla 3 de aprendizajes: lo barato vende mucho porque vale poco). Si esa hipótesis se confirma, **ninguno** alcanza los 28 a 30 € que exige CPA 8 con margen, y el escenario real sería solo orgánico/afiliados o CPA muy bajo (<= 3 a 5 €). Regla de cruce para el director: si el mercado paga menos de 23 a 25 € (según producto, ver columna equilibrio), ese producto es NO-GO con anuncios; sin GO si el precio de mercado queda sin leer (regla 2).

## Recálculo a mano (2 escenarios, coinciden con el script)
**Escenario 1: B1 extractor, coste 7,09, PVP 24,90, comisión 9 %, dev. 15 %, afiliado 0.**
Base = 24,90 / 1,21 = 20,5785. Ingresos tras devoluciones = 20,5785 x 0,85 = 17,4917. Costes: 7,09 + 0,30 + comisión 9 % (1,8521) + otros 1 % (0,2058) = 9,4479. Beneficio = 17,4917 - 9,4479 = **8,04 €** (script 8,04). Margen = 8,04 / 20,5785 = 39,1 %. ROAS equilibrio = 24,90 / 8,04 = 3,10x (coincide). Con CPA 8: +0,04 €/pedido, 62 pedidos = +2 €/mes (coincide con escalado.py).

**Escenario 2: A kit, coste 6,19, PVP 19,90, comisión 4 %, dev. 10 %, afiliado 0.**
Base = 19,90 / 1,21 = 16,4463. Ingresos = 16,4463 x 0,90 = 14,8017. Costes: 6,19 + 0,30 + 4 % (0,6579) + 1 % (0,1645) = 7,3124. Beneficio = **7,49 €** (script 7,49). Coincide.

(Comprobación adicional con el script a 24,90, coste 7,09, dev. 10 %, 9 %: 9,07 en ambos cálculos.)

## Cifras raras y avisos
- B3 kit de abolladuras: margen del 5,6 % a 39,90 y 13,3 % a 44,90 (9 %, dev. 15 %): nunca llega al 25 %. No es error: el coste 22,59 es demasiado alto.
- Dev. 15 % con comisión 4 % da lo mismo que dev. 10 % con 9 %; coincidencia aritmética, ver supuestos.
- `margen_es.py --help` falla (ya anotado en aprendizajes, regla 7); `escalado.py --help` funciona.
- escalado.py da 42 pedidos con CPA 12; yo uso 41 (redondeo hacia abajo). Irrelevante.
- Todos los costes son precio de AliExpress, sin verificar ficha por mí; IVA: el script supone coste sin IVA. Si AliExpress cobra IVA al comprador, el coste sin IVA sería menor (no verificado): cifras prudentes.
- Plazos de entrega/preparación del proveedor no verificados (puesto 2 días solo para ejecutar).

## Datos clave

| Producto | ID/URL | Coste € | PVP € (probado o propuesto) | Fuente del precio de mercado y fecha | Verificado (listado/ficha/persona) | Margen/pedido y supuestos | Veredicto |
|---|---|---|---|---|---|---|---|
| A kit limpieza altavoz/puerto (y ampliado) | no verificado (no recibido) | 6,19 | 29,90 (mín. 28,22 para +3 € con CPA 8) | pendiente de cruzar con agente de mercado | coste dado por el director; ficha no leída por mí | 12,04 € (9 %, dev 15 %, afil 0); 8,94 a 24,90 | Escalable solo a 29,90; condicionado al mercado |
| B2 extractor abolladuras | no verificado | 5,89 | 29,90 (mín. 27,73) | pendiente | idem | 12,34 € a 29,90; 9,24 a 24,90 | Mejor candidato por coste; condicionado al mercado |
| B1 extractor abolladuras | no verificado | 7,09 | 29,90 (mín. 29,67) | pendiente | idem | 11,14 € a 29,90; 8,04 a 24,90 | Solo a 29,90; sin margen a 24,90 |
| B3 kit abolladuras | no verificado | 22,59 | 44,90 máx. probado | pendiente | idem | 4,94 € a 44,90 (13,3 %) | NO-GO |
| C cepillo desagüe | no verificado | 7,39 | 29,90 (mín. 30,15 para +3 €) | pendiente | idem | 10,84 € a 29,90 | Marginal; solo a 29,90 |
| D1 escurridor | no verificado | 11,99 | 29,90 | pendiente | idem | 6,24 € a 29,90 | NO-GO |
| D2 escurridor | no verificado | 8,08 | 29,90 | pendiente | idem | 10,15 € a 29,90 | Marginal; solo a 29,90 y CPA <= 8 |
| E removedor pegatinas | no verificado | 6,09 | 29,90 (mín. 28,06) | pendiente | idem | 12,14 € a 29,90; 9,04 a 24,90 | Escalable a 29,90; condicionado al mercado |

- **Qué sabemos** (con fuente y fecha): las cifras de beneficio, CPA y ROAS de equilibrio salen de `margen_es.py` y `escalado.py` ejecutados el 2026-10-26 con los costes dados por el director; dos escenarios recalculados a mano coinciden.
- **Qué asumimos** (y cómo se comprobaría): costes AliExpress sin envío (comprobar en ficha), devoluciones 10 a 15 % (medir en piloto), CPA 5/8/12 (medir en piloto), embalaje 0,30 € y otros 1 % (por defecto del script), comisión 4 % activa (Seller Center), plazo de 2 días (confirmar con proveedor).
- **Qué cambiaría mi conclusión:** que el mercado pague claramente menos de 23 a 25 € por estos productos (entonces NO-GO con anuncios); un coste real menor (cupones, packs, IVA); un CPA medido <= 4 €; ventas por afiliados (baja ~3 € por pedido).
