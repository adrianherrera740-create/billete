# Calculador de escenarios - ronda 3 (cuerda de neón RGB con app)

Fecha: 2026-10-26. Autor: calculador-escenarios. Herramienta: `.claude/skills/proveedor-es/scripts/margen_es.py` (python3, ejecutado desde su carpeta).

## Fuentes y entradas
- Costes: AliExpress ES 1005009522551027 a 15,79 € (10.000+ vendidos, 4,9 estrellas, entrega 2 días, envío gratis) y 1005008641155318 a 17,49 € (2.000+, 4,7). Fuente: `tienda/trabajo/ronda-2/producto/buscador-proveedores.md`, listado leído el 2026-10-26. Fichas NO abiertas: variantes, longitud, CE, adhesivo y plazo real = no verificado.
- Rango de mercado de tira RGB genérica sin marca: ~12-15 € (Ofertitas, fecha no verificada). Fuente: `tienda/trabajo/ronda-2/margenes/auditor-precios-mercado.md`. Todos los PVP de 24,90-39,90 € están POR ENCIMA de ese rango; precio en TikTok Shop ES: no verificado.
- Cumplimiento: candidato B es CONDICIONAL (EMC + RoHS; RED si app/Bluetooth; pila de botón del mando; GPSR; DoC e informes pendientes). Fuente: `tienda/trabajo/ronda-2/cumplimiento/revisor-normativa-ue.md`.

## Cómo se ejecutó
`python3 margen_es.py --pvp P --coste C --envio 0 --dias-preparacion 1 --afiliado A --devoluciones D [--tienda-nueva]`
- `--afiliado` es fracción (0 o 0.15). `--devoluciones` es fracción (0.05 por defecto, 0.10 en el escenario de rotura/adhesivo). El script SÍ lo permite.
- Coste = precio de AliExpress entero; envío 0; embalaje 0,30 € y pago/otros 1 % de la base (defectos del script, no verificados). `--dias-preparacion 1` es un valor de relleno solo para que corra el script: plazo real no verificado; solo afecta al veredicto.
- Comisión 4 % con `--tienda-nueva`; 9 % sin ella. Comisión vigente: comprobar en Seller Center.
- Margen = beneficio / base sin IVA (PVP / 1,21). Anuncio máximo = beneficio por pedido (CPA que deja a cero). "CPA para ganar 3 €" = beneficio - 3 (objetivo por defecto del script); negativo = no hay hueco.

## Cómo modela el script las devoluciones (cifra a vigilar)
Ingresos = base x (1 - dev). El coste del producto se paga entero en todos los pedidos, es decir se asume que el producto devuelto NO se recupera (rotura/adhesivo usado), y la comisión de TikTok y el embalaje se cobran sobre el 100 %. Con envío 0, el coste logístico de devolución es 0. Es un supuesto pesimista pero razonable para rotura; no incluye reembolso de comisión por parte de TikTok (no verificado). Además el margen se divide entre la base completa, no entre los ingresos netos.

## Resultados
Las tablas completas (32 escenarios por bloque de devolución) están abajo.

### Devoluciones 5 % (defecto del script) - coste 15,79 €

| PVP | Comisión | Afiliado | Base sin IVA | Beneficio | Margen | Anuncio máx. (CPA 0) | CPA para ganar 3 € | PVP mín. 25 % | Veredicto script |
|---|---|---|---|---|---|---|---|---|---|
| 24,9 | 4 % | 0 % | 20,58 | 2,43 | 11,8 % | 2,43 | -0,57 | 30,0 | HOLD |
| 29,9 | 4 % | 0 % | 24,71 | 6,15 | 24,9 % | 6,15 | 3,15 | 30,0 | HOLD |
| 34,9 | 4 % | 0 % | 28,84 | 9,87 | 34,2 % | 9,87 | 6,87 | 30,0 | GO |
| 39,9 | 4 % | 0 % | 32,98 | 13,59 | 41,2 % | 13,59 | 10,59 | 30,0 | GO |
| 24,9 | 9 % | 0 % | 20,58 | 1,4 | 6,8 % | 1,4 | -1,6 | 32,5 | HOLD |
| 29,9 | 9 % | 0 % | 24,71 | 4,91 | 19,9 % | 4,91 | 1,91 | 32,5 | HOLD |
| 34,9 | 9 % | 0 % | 28,84 | 8,43 | 29,2 % | 8,43 | 5,43 | 32,5 | GO |
| 39,9 | 9 % | 0 % | 32,98 | 11,94 | 36,2 % | 11,94 | 8,94 | 32,5 | GO |
| 24,9 | 4 % | 15 % | 20,58 | -0,5 | -2,4 % | -0,5 | -3,5 | 38,4 | NO-GO |
| 29,9 | 4 % | 15 % | 24,71 | 2,63 | 10,6 % | 2,63 | -0,37 | 38,4 | HOLD |
| 34,9 | 4 % | 15 % | 28,84 | 5,76 | 20,0 % | 5,76 | 2,76 | 38,4 | HOLD |
| 39,9 | 4 % | 15 % | 32,98 | 8,89 | 27,0 % | 8,89 | 5,89 | 38,4 | GO |
| 24,9 | 9 % | 15 % | 20,58 | -1,53 | -7,4 % | -1,53 | -4,53 | 42,6 | NO-GO |
| 29,9 | 9 % | 15 % | 24,71 | 1,39 | 5,6 % | 1,39 | -1,61 | 42,6 | HOLD |
| 34,9 | 9 % | 15 % | 28,84 | 4,32 | 15,0 % | 4,32 | 1,32 | 42,6 | HOLD |
| 39,9 | 9 % | 15 % | 32,98 | 7,24 | 22,0 % | 7,24 | 4,24 | 42,6 | HOLD |

### Devoluciones 5 % (defecto del script) - coste 17,49 €

| PVP | Comisión | Afiliado | Base sin IVA | Beneficio | Margen | Anuncio máx. (CPA 0) | CPA para ganar 3 € | PVP mín. 25 % | Veredicto script |
|---|---|---|---|---|---|---|---|---|---|
| 24,9 | 4 % | 0 % | 20,58 | 0,73 | 3,6 % | 0,73 | -2,27 | 33,2 | HOLD |
| 29,9 | 4 % | 0 % | 24,71 | 4,45 | 18,0 % | 4,45 | 1,45 | 33,2 | HOLD |
| 34,9 | 4 % | 0 % | 28,84 | 8,17 | 28,3 % | 8,17 | 5,17 | 33,2 | GO |
| 39,9 | 4 % | 0 % | 32,98 | 11,89 | 36,1 % | 11,89 | 8,89 | 33,2 | GO |
| 24,9 | 9 % | 0 % | 20,58 | -0,3 | -1,4 % | -0,3 | -3,3 | 35,9 | NO-GO |
| 29,9 | 9 % | 0 % | 24,71 | 3,21 | 13,0 % | 3,21 | 0,21 | 35,9 | HOLD |
| 34,9 | 9 % | 0 % | 28,84 | 6,73 | 23,3 % | 6,73 | 3,73 | 35,9 | HOLD |
| 39,9 | 9 % | 0 % | 32,98 | 10,24 | 31,1 % | 10,24 | 7,24 | 35,9 | GO |
| 24,9 | 4 % | 15 % | 20,58 | -2,2 | -10,7 % | -2,2 | -5,2 | 42,5 | NO-GO |
| 29,9 | 4 % | 15 % | 24,71 | 0,93 | 3,8 % | 0,93 | -2,07 | 42,5 | HOLD |
| 34,9 | 4 % | 15 % | 28,84 | 4,06 | 14,1 % | 4,06 | 1,06 | 42,5 | HOLD |
| 39,9 | 4 % | 15 % | 32,98 | 7,19 | 21,8 % | 7,19 | 4,19 | 42,5 | HOLD |
| 24,9 | 9 % | 15 % | 20,58 | -3,23 | -15,7 % | -3,23 | -6,23 | 47,1 | NO-GO |
| 29,9 | 9 % | 15 % | 24,71 | -0,31 | -1,2 % | -0,31 | -3,31 | 47,1 | NO-GO |
| 34,9 | 9 % | 15 % | 28,84 | 2,62 | 9,1 % | 2,62 | -0,38 | 47,1 | HOLD |
| 39,9 | 9 % | 15 % | 32,98 | 5,54 | 16,8 % | 5,54 | 2,54 | 47,1 | HOLD |

### Devoluciones 10 % (rotura/adhesivo) - coste 15,79 €

| PVP | Comisión | Afiliado | Base sin IVA | Beneficio | Margen | Anuncio máx. (CPA 0) | CPA para ganar 3 € | PVP mín. 25 % | Veredicto script |
|---|---|---|---|---|---|---|---|---|---|
| 24,9 | 4 % | 0 % | 20,58 | 1,4 | 6,8 % | 1,4 | -1,6 | 32,5 | HOLD |
| 29,9 | 4 % | 0 % | 24,71 | 4,91 | 19,9 % | 4,91 | 1,91 | 32,5 | HOLD |
| 34,9 | 4 % | 0 % | 28,84 | 8,43 | 29,2 % | 8,43 | 5,43 | 32,5 | GO |
| 39,9 | 4 % | 0 % | 32,98 | 11,94 | 36,2 % | 11,94 | 8,94 | 32,5 | GO |
| 24,9 | 9 % | 0 % | 20,58 | 0,37 | 1,8 % | 0,37 | -2,63 | 35,4 | HOLD |
| 29,9 | 9 % | 0 % | 24,71 | 3,68 | 14,9 % | 3,68 | 0,68 | 35,4 | HOLD |
| 34,9 | 9 % | 0 % | 28,84 | 6,98 | 24,2 % | 6,98 | 3,98 | 35,4 | HOLD |
| 39,9 | 9 % | 0 % | 32,98 | 10,29 | 31,2 % | 10,29 | 7,29 | 35,4 | GO |
| 24,9 | 4 % | 15 % | 20,58 | -1,38 | -6,7 % | -1,38 | -4,38 | 41,9 | NO-GO |
| 29,9 | 4 % | 15 % | 24,71 | 1,58 | 6,4 % | 1,58 | -1,42 | 41,9 | HOLD |
| 34,9 | 4 % | 15 % | 28,84 | 4,53 | 15,7 % | 4,53 | 1,53 | 41,9 | HOLD |
| 39,9 | 4 % | 15 % | 32,98 | 7,49 | 22,7 % | 7,49 | 4,49 | 41,9 | HOLD |
| 24,9 | 9 % | 15 % | 20,58 | -2,41 | -11,7 % | -2,41 | -5,41 | 47,0 | NO-GO |
| 29,9 | 9 % | 15 % | 24,71 | 0,34 | 1,4 % | 0,34 | -2,66 | 47,0 | HOLD |
| 34,9 | 9 % | 15 % | 28,84 | 3,09 | 10,7 % | 3,09 | 0,09 | 47,0 | HOLD |
| 39,9 | 9 % | 15 % | 32,98 | 5,84 | 17,7 % | 5,84 | 2,84 | 47,0 | HOLD |

### Devoluciones 10 % (rotura/adhesivo) - coste 17,49 €

| PVP | Comisión | Afiliado | Base sin IVA | Beneficio | Margen | Anuncio máx. (CPA 0) | CPA para ganar 3 € | PVP mín. 25 % | Veredicto script |
|---|---|---|---|---|---|---|---|---|---|
| 24,9 | 4 % | 0 % | 20,58 | -0,3 | -1,4 % | -0,3 | -3,3 | 35,9 | NO-GO |
| 29,9 | 4 % | 0 % | 24,71 | 3,21 | 13,0 % | 3,21 | 0,21 | 35,9 | HOLD |
| 34,9 | 4 % | 0 % | 28,84 | 6,73 | 23,3 % | 6,73 | 3,73 | 35,9 | HOLD |
| 39,9 | 4 % | 0 % | 32,98 | 10,24 | 31,1 % | 10,24 | 7,24 | 35,9 | GO |
| 24,9 | 9 % | 0 % | 20,58 | -1,33 | -6,4 % | -1,33 | -4,33 | 39,2 | NO-GO |
| 29,9 | 9 % | 0 % | 24,71 | 1,98 | 8,0 % | 1,98 | -1,02 | 39,2 | HOLD |
| 34,9 | 9 % | 0 % | 28,84 | 5,28 | 18,3 % | 5,28 | 2,28 | 39,2 | HOLD |
| 39,9 | 9 % | 0 % | 32,98 | 8,59 | 26,1 % | 8,59 | 5,59 | 39,2 | GO |
| 24,9 | 4 % | 15 % | 20,58 | -3,08 | -14,9 % | -3,08 | -6,08 | 46,3 | NO-GO |
| 29,9 | 4 % | 15 % | 24,71 | -0,12 | -0,5 % | -0,12 | -3,12 | 46,3 | NO-GO |
| 34,9 | 4 % | 15 % | 28,84 | 2,83 | 9,8 % | 2,83 | -0,17 | 46,3 | HOLD |
| 39,9 | 4 % | 15 % | 32,98 | 5,79 | 17,6 % | 5,79 | 2,79 | 46,3 | HOLD |
| 24,9 | 9 % | 15 % | 20,58 | -4,11 | -19,9 % | -4,11 | -7,11 | 51,9 | NO-GO |
| 29,9 | 9 % | 15 % | 24,71 | -1,36 | -5,5 % | -1,36 | -4,36 | 51,9 | NO-GO |
| 34,9 | 9 % | 15 % | 28,84 | 1,39 | 4,8 % | 1,39 | -1,61 | 51,9 | HOLD |
| 39,9 | 9 % | 15 % | 32,98 | 4,14 | 12,6 % | 4,14 | 1,14 | 51,9 | HOLD |


## PVP mínimo para 25 % de margen (salida del script, paso de 0,10 €)
| Coste | Comisión | Afiliado | Dev. 5 % | Dev. 10 % |
|---|---|---|---|---|
| 15,79 | 4 % | 0 % | 30,00 | 32,50 |
| 15,79 | 9 % | 0 % | 32,50 | 35,40 |
| 15,79 | 4 % | 15 % | 38,40 | 41,90 |
| 15,79 | 9 % | 15 % | 42,60 | 47,00 |
| 17,49 | 4 % | 0 % | 33,20 | 35,90 |
| 17,49 | 9 % | 0 % | 35,90 | 39,20 |
| 17,49 | 4 % | 15 % | 42,50 | 46,30 |
| 17,49 | 9 % | 15 % | 47,10 | 51,90 |

## Anuncio máximo por pedido (CPA que deja beneficio 0) - casos clave, dev. 5 %
- Coste 15,79, PVP 34,90, sin afiliado: 9,87 € (4 %) / 8,43 € (9 %). Con afiliado 15 %: 5,76 € / 4,32 €.
- Coste 15,79, PVP 29,90, sin afiliado: 6,15 € (4 %) / 4,91 € (9 %). Con afiliado 15 %: 2,63 € / 1,39 €.
- Coste 15,79, PVP 24,90: 2,43 € / 1,40 € sin afiliado; negativo con afiliado.
- Coste 17,49, PVP 34,90, sin afiliado: 8,17 € (4 %) / 6,73 € (9 %). Con afiliado: 4,06 € / 2,62 €.
- Con devoluciones 10 % cada cifra baja ~1,0-1,5 € (ver tablas). Si el CPA real de anuncios supera el máximo, cada venta pierde dinero. Objetivo 3 € de beneficio tras anuncios: solo cabe con el coste 15,79 y PVP 34,90+ sin afiliado, o 39,90.

## Comprobación a mano (2 escenarios)
Escenario 1: PVP 34,90, coste 15,79, 4 %, afiliado 0, dev 5 %.
- Base = 34,90 / 1,21 = 28,843. Ingresos = 28,843 x 0,95 = 27,401.
- Costes: producto 15,79 + embalaje 0,30 + comisión 28,843 x 0,04 = 1,154 + otros 28,843 x 0,01 = 0,288 + afiliado 0 + log. devolución 0 = 17,532.
- Beneficio = 27,401 - 17,532 = 9,869 -> 9,87 (script 9,87). Margen = 9,869 / 28,843 = 34,2 % (script 34,2 %). Cuadra.

Escenario 2: PVP 29,90, coste 17,49, 9 %, afiliado 15 %, dev 10 %.
- Base = 29,90 / 1,21 = 24,711. Ingresos = 24,711 x 0,90 = 22,240.
- Costes: 17,49 + 0,30 + comisión 24,711 x 0,09 = 2,224 + otros 0,247 + afiliado 22,240 x 0,15 = 3,336 = 23,597.
- Beneficio = 22,240 - 23,597 = -1,357 -> -1,36 (script -1,36). Margen -5,5 % (script -5,5 %). Cuadra.

## Cifras raras y avisos
1. El veredicto GO del script solo exige margen >= 25 % y CPA objetivo > 0; no mira que el PVP esté fuera de mercado. Un GO a 34,90-39,90 € NO es defendible: el mercado genérico está en ~12-15 € (auditor, fuentes sin fecha). Ni un solo escenario a 24,90 €, el único cercano al mercado, llega al margen mínimo; pierde dinero con afiliado.
2. Coste tratado como sin IVA por el script. El precio de AliExpress, si incluye IVA, no se puede deducir salvo factura con IVA a nombre de la tienda: no verificado. Si fuera deducible, el coste real sería 13,05 € (15,79 / 1,21) y el margen subiría; no calculado aquí porque no está confirmado.
3. Con afiliado del 15 % y comisión 9 %, el coste 17,49 € necesita 47,10 € para 25 % (51,90 € con 10 % de devoluciones): inviable. El coste 17,49 € es peor en todos los escenarios y tiene menos ventas (2.000+) y 4,7 estrellas; solo alternativa.
4. Embalaje 0,30 € y "otros" 1 %: supuestos del script, sin dato real. Envío 0 supone envío gratis del proveedor sin coste para la tienda; no verificado en ficha.
5. Rotura/adhesivo 10 %: es un supuesto del director, no una tasa observada. Tasa real: no verificada.
6. El precio de AliExpress "mín. 30 días" fue 19,27 € para 1005009522551027 (18,21 € para la alternativa), más alto que el actual. Con 19,27 € el margen es peor; el precio actual podría ser promocional. Fuente: buscador-proveedores, 2026-10-26. No recalculado.
7. `--help` falla por un `%` sin escapar en la ayuda de `--afiliado`/`--margen-minimo`; el flujo normal con argumentos funciona. Es un fallo del script, no corregido por no ser mi tarea.

## Conclusión
- Cuerda 15,79 €, tienda nueva (4 %), vídeos propios (sin afiliado): viable desde 30,00 € (25 % de margen; 32,50 € con 10 % devoluciones), pero ese PVP duplica el rango genérico verificado.
- Con afiliado 15 % hacen falta 38-47 €; fuera de mercado.
- Sin dato de demanda ni de precio en TikTok Shop ES (FastMoss bloqueado). Recomendación del cálculo: HOLD, no GO, hasta tener ficha abierta, CE/DoC y precio de mercado en TikTok Shop.

## Falta de otros departamentos
Comisión vigente y reglas de devolución de TikTok (Seller Center); plazo real y DoC de la ficha (buscador-producto / operaciones-cumplimiento); demanda y precio de TikTok Shop ES (crecimiento-anuncios).
