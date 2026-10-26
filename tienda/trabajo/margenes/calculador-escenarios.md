# Calculador de escenarios: set de cepillos de limpieza

Fecha: 2026-10-26. Fuente de cifras: `.claude/skills/proveedor-es/scripts/margen_es.py` ejecutado hoy. Coste 9,29 € (precio AliExpress ES 1005013107637317 con IVA, envío gratis; dato aportado por el director, no re-verificado en la ficha). Pack de 2: coste 18,58 € (2 x 9,29).

## Cómo interpreta el script `--afiliado`
Es una FRACCIÓN, no un % ni euros: `afiliado = ingresos x --afiliado` (línea 27). `--afiliado 0.15` = 15 %. Con `--afiliado 10` calcula 1000 % de los ingresos: la prueba previa de 219 € cuadra con PVP 27,90 (ingresos 27,90/1,21 x 0,95 = 21,90 x 10 = 219 €). Con PVP 24,90 sale 195,50 €. Usar 0 (vídeos propios) y 0.15 (defecto del script).

## Supuestos (todos por defecto del script salvo lo indicado)
- Envío al cliente 0 € (gratis en la ficha; no verificado para pedidos reales). Embalaje 0,30 €. Pago y otros 1 % de la base. Devoluciones 5 %. Objetivo tras anuncios 3 €. Margen mínimo 25 %.
- `--dias-preparacion 2 --dias-entrega 5`: ESTIMACIONES, plazos reales del proveedor NO VERIFICADOS. Con 2 días el script no avisa; si fueran 3, daría NO-GO.
- El script resta el coste 9,29 € entero (con IVA), como pedido; es conservador (el script espera coste sin IVA; si el IVA fuera deducible, el coste neto sería 7,68 € y el beneficio subiría ~1,6 €/set).
- Comisión 4 % = `--tienda-nueva` (60 días, requisitos en Seller Center, a comprobar); 9 % = normal.
- Margen = beneficio / base sin IVA. Anuncio máximo = CPA máximo para no perder (= beneficio por pedido sin anuncios). "CPA obj." = anuncio máximo dejando 3 € de beneficio.

## Tabla (beneficio y anuncio máx. en € por pedido)

| Producto | PVP | Comisión | Afiliado | Base s/IVA | Beneficio | Margen | Anuncio máx. | CPA obj. (deja 3 €) | PVP mín. 25 % | Veredicto |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 set | 24,90 | 9 % | 0 | 20,58 | 7,90 | 38,4 % | 7,90 | 4,90 | 19,40 | GO |
| 1 set | 24,90 | 9 % | 15 % | 20,58 | 4,97 | 24,1 % | 4,97 | 1,97 | 25,40 | HOLD |
| 1 set | 24,90 | 4 % | 0 | 20,58 | 8,93 | 43,4 % | 8,93 | 5,93 | 17,90 | GO |
| 1 set | 24,90 | 4 % | 15 % | 20,58 | 6,00 | 29,1 % | 6,00 | 3,00 | 22,90 | GO |
| 1 set | 29,90 | 9 % | 0 | 24,71 | 11,41 | 46,2 % | 11,41 | 8,41 | 19,40 | GO |
| 1 set | 29,90 | 9 % | 15 % | 24,71 | 7,89 | 31,9 % | 7,89 | 4,89 | 25,40 | GO |
| 1 set | 29,90 | 4 % | 0 | 24,71 | 12,65 | 51,2 % | 12,65 | 9,65 | 17,90 | GO |
| 1 set | 29,90 | 4 % | 15 % | 24,71 | 9,13 | 36,9 % | 9,13 | 6,13 | 22,90 | GO |
| Pack 2 | 39,90 | 9 % | 0 | 32,98 | 9,15 | 27,7 % | 9,15 | 6,15 | 38,10 | GO |
| Pack 2 | 39,90 | 9 % | 15 % | 32,98 | 4,45 | 13,5 % | 4,45 | 1,45 | 50,00 | HOLD |
| Pack 2 | 39,90 | 4 % | 0 | 32,98 | 10,80 | 32,7 % | 10,80 | 7,80 | 35,20 | GO |
| Pack 2 | 39,90 | 4 % | 15 % | 32,98 | 6,10 | 18,5 % | 6,10 | 3,10 | 45,10 | HOLD |
| Pack 2 | 44,90 | 9 % | 0 | 37,11 | 12,66 | 34,1 % | 12,66 | 9,66 | 38,10 | GO |
| Pack 2 | 44,90 | 9 % | 15 % | 37,11 | 7,37 | 19,9 % | 7,37 | 4,37 | 50,00 | HOLD |
| Pack 2 | 44,90 | 4 % | 0 | 37,11 | 14,52 | 39,1 % | 14,52 | 11,52 | 35,20 | GO |
| Pack 2 | 44,90 | 4 % | 15 % | 37,11 | 9,23 | 24,9 % | 9,23 | 6,23 | 45,10 | HOLD |

Los veredictos GO/HOLD son del script y dependen de plazos estimados; sin plazos verificados no hay GO real (regla del proyecto).

## Comprobación a mano (IVA 21 %, devoluciones 5 %)
1. 1 set 24,90 €, 4 %, afiliado 15 %: base 24,90/1,21 = 20,578; ingresos = 20,578 x 0,95 = 19,550. Costes: 9,29 + 0,30 + comisión 0,823 + otros 0,206 + afiliado 0,15 x 19,550 = 2,932 = 13,551. Beneficio = 19,550 - 13,551 = 5,998, es decir 6,00 (script 6,00). Margen 5,998/20,578 = 29,1 % (coincide).
2. Pack 44,90 €, 9 %, afiliado 0: base 37,107; ingresos 35,252. Costes: 18,58 + 0,30 + 3,340 + 0,371 = 22,591. Beneficio 12,661 (script 12,66). Margen 34,1 % (coincide).
3. Extra, 1 set 24,90 €, 9 %, afiliado 0: 19,550 - (9,29+0,30+1,852+0,206) = 7,90 (coincide).
Todas cuadran al céntimo.

## Cifras raras y observaciones
- `--afiliado 10` es un error de unidad (ver arriba), no un resultado real.
- Pack a 39,90 € y 44,90 € con afiliado 15 % cae en HOLD en 5 de 6 casos (margen 13,5 a 24,9 %); el pack solo aguanta afiliado con PVP 44,90 y 4 %, y aun así por 0,1 puntos. El pack tiene PVP mínimo 45-50 € con afiliado 15 %.
- Los 8,93 € de CLAUDE.md coinciden con 1 set 24,90 €, 4 %, afiliado 0. Con comisión 9 % baja a 7,90 € y con afiliado 15 % a 4,97 €. El "10,80 €" del pack también coincide (39,90 €, 4 %, afiliado 0).
- El script no devuelve el coste del producto en devoluciones (supone pérdida total del 5 %): conservador. Tampoco incluye muestras, ni IVA del coste, ni descuentos/cupones de TikTok.
- No verificado: plazos del proveedor, envío gratis real, comisión vigente en Seller Center, fotos del producto (dominios bloqueados, ver CLAUDE.md).
