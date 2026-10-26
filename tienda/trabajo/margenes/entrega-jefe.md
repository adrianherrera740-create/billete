# Entrega del jefe de márgenes: set de cepillos de limpieza

Fecha: 2026-10-26. Cifras recalculadas hoy con `.claude/skills/proveedor-es/scripts/margen_es.py` (envío 0, embalaje 0,30 €, otros 1 %, devoluciones 5 %, objetivo 3 €, sin IVA deducido sobre el coste; `--dias-preparacion 2 --dias-entrega 5` son marcadores, no plazos reales). Fuentes de los especialistas: `calculador-escenarios.md`, `auditor-precios-mercado.md`, `simulador-packs.md` (todos 2026-10-26), `producto/buscador-proveedores.md`, `producto/investigador-tendencias.md` (2026-10-26).

## 1. Veredicto: HOLD (no GO)
- El margen sale bien SOLO a PVP 24,90-25,90 €, y ese PVP no está respaldado por mercado: el auditor encontró referencias a 3,17 € (Shein) y 8,99-11,31 € (kit de marca en Amazon), y el investigador de tendencias dice saturación alta y producto de 3-10 € en otros retailers.
- Sin plazos de proveedor verificados (regla del proyecto), sin datos de TikTok Shop ES, sin fotos. Sin GO.
- NO-GO si el mercado obliga a PVP 12-15 € con el coste actual (9,29 €): beneficio negativo o ~1 €.

## 2. Contradicciones entre especialistas (no se elige en silencio)
1. PVP del set: calculador usa 24,90 €; simulador propone 25,90 € "para entrar en el rango 25-45". Ambos cálculos son correctos (24,90 -> 7,90 € a 9 %; 25,90 -> 8,60 €). La diferencia de 1 € de PVP da +0,70 €/pedido. Pero el motivo del simulador (rango 25-45) es una preferencia, no un dato, y el auditor de precios dice que incluso 24,90 € puede estar muy por encima del mercado. Subir a 25,90 va en la dirección contraria de la evidencia de mercado. Decisión del usuario; yo no la tomo.
2. Mercado: calculador y simulador dan GO por margen; el auditor da "no verificado, riesgo alto de estar por encima". No es un error de cálculo: miden cosas distintas (margen vs. demanda a ese precio). Prevalece el auditor para el GO: un margen alto a un precio que nadie paga no vale.
3. Pack de 2 a 39,90 €: simulador lo recomienda como opción principal ("si hay que elegir una: B"); el propio simulador avisa de que si el vendedor no consolida 2 unidades en un paquete, B pierde su ventaja. El calculador muestra que con afiliado 15 % el pack queda en HOLD (13,5 % a 9 %). El investigador dice que el pack "es aún más arriesgado sin prueba de ventas". Conclusión: el pack NO es la opción principal hasta verificar consolidación de envío y precio de mercado.
4. Beneficio con proveedor alternativo: el buscador dice "~10,5 €/set a 24,90 €" (orientativo). El script da 10,72 € solo a comisión 4 % y 9,69 € a 9 %. Su cifra es válida solo en el caso más favorable.
5. Nota de coherencia: el afiliado 15 % es una fracción (0.15). `--afiliado 10` = 1000 % (error de unidad; origen del 219 € absurdo). Confirmado en el código: `afiliado = ingresos * a.afiliado`.

## 3. Tabla final, coste 9,29 € (proveedor actual)

Beneficio y anuncio máximo en € por pedido. Anuncio máximo = beneficio sin anuncios (CPA que deja el pedido a 0). CPA objetivo = deja 3 €.

| Escenario | PVP | Comisión | Afiliado | Beneficio | Margen | Anuncio máx. | CPA obj. | Script |
|---|---|---|---|---|---|---|---|---|
| 1 set, vídeos propios | 24,90 | 4 % | 0 | 8,93 | 43,4 % | 8,93 | 5,93 | GO |
| 1 set, vídeos propios | 24,90 | 9 % | 0 | 7,90 | 38,4 % | 7,90 | 4,90 | GO |
| 1 set, con afiliado 15 % | 24,90 | 4 % | 15 % | 6,00 | 29,1 % | 6,00 | 3,00 | GO |
| 1 set, con afiliado 15 % | 24,90 | 9 % | 15 % | 4,97 | 24,1 % | 4,97 | 1,97 | HOLD |
| 1 set, vídeos propios | 25,90 | 4 % | 0 | 9,67 | 45,2 % | 9,67 | 6,67 | GO |
| 1 set, vídeos propios | 25,90 | 9 % | 0 | 8,60 | 40,2 % | 8,60 | 5,60 | GO |
| 1 set, con afiliado 15 % | 25,90 | 4 % | 15 % | 6,62 | 30,9 % | 6,62 | 3,62 | GO |
| 1 set, con afiliado 15 % | 25,90 | 9 % | 15 % | 5,55 | 25,9 % | 5,55 | 2,55 | GO |
| Pack 2, vídeos propios | 39,90 | 4 % | 0 | 10,80 | 32,7 % | 10,80 | 7,80 | GO |
| Pack 2, vídeos propios | 39,90 | 9 % | 0 | 9,15 | 27,7 % | 9,15 | 6,15 | GO |
| Pack 2, con afiliado 15 % | 39,90 | 4 % | 15 % | 6,10 | 18,5 % | 6,10 | 3,10 | HOLD |
| Pack 2, con afiliado 15 % | 39,90 | 9 % | 15 % | 4,45 | 13,5 % | 4,45 | 1,45 | HOLD |

Los "GO" del script son solo aritméticos (asumen 2 días de preparación no verificados).

## 4. Qué PVP es defendible
- Defendible por margen: desde ~19,40 € (margen 25 %, 9 %, sin afiliado) y ~25,40 € con afiliado 15 % y 9 %.
- Defendible por mercado: NO VERIFICADO. Ningún precio de TikTok Shop ES ni Amazon.es leído. Lo único concreto apunta a 3-11 €.
- Postura prudente: 24,90 € como techo de prueba (no subir a 25,90 €), solo si el vídeo demuestra un diferenciador (más piezas, giratorio, extensible) que aún no se ha confirmado en la ficha. Si 5 precios reales de TikTok/Amazon están por debajo de ~15 €, el 24,90 € no se sostiene.

## 5. Efecto del proveedor alternativo (~7,5 €)
Fuente: `buscador-proveedores.md`. Candidatos: C 7,49 € ("3 uds", 10.000+ vendidos), A 7,69 € (etiqueta "entrega en 2 días"), B 7,99 €, D 7,09 €. Aviso: son listados de búsqueda, no fichas; contenido del set, plazos y origen real no verificados; C y A NO son necesariamente el mismo producto (comparabilidad no probada). El cálculo usa 7,50 €.

| PVP | Comisión | Afiliado | Beneficio (coste 7,50) | Margen | vs coste 9,29 |
|---|---|---|---|---|---|
| 24,90 | 4 % | 0 | 10,72 | 52,1 % | +1,79 |
| 24,90 | 9 % | 0 | 9,69 | 47,1 % | +1,79 |
| 24,90 | 9 % | 15 % | 6,76 | 32,8 % | +1,79 (de HOLD a GO) |
| 39,90 pack 2 (coste 15,00) | 9 % | 0 | 12,73 | 38,6 % | +3,58 |
| 39,90 pack 2 (coste 15,00) | 9 % | 15 % | 8,03 | 24,4 % | HOLD, a 0,6 puntos de GO |

El ahorro es 1,79 €/unidad (1,79 en el set, 3,58 en el pack): mejora el margen pero no resuelve el problema de precio de mercado.

## 6. Escenarios a PVP 12-15 € (tendencias: competencia puede forzar ese rango)
Nota: el texto leído del investigador solo pide comprobar este escenario ("si la competencia fuerza el PVP a 12-15 €"); no aporta un precio de mercado concreto. Envío 0.

| Coste | PVP | Comisión | Afiliado | Beneficio | Margen | Anuncio máx. | Script |
|---|---|---|---|---|---|---|---|
| 9,29 | 12,00 | 4 % | 0 | -0,66 | -6,7 % | 0 (pierde) | NO-GO |
| 9,29 | 15,00 | 4 % | 0 | 1,57 | 12,6 % | 1,57 | HOLD |
| 9,29 | 15,00 | 9 % | 0 | 0,95 | 7,6 % | 0,95 | HOLD |
| 9,29 | 15,00 | 4 % | 15 % | -0,20 | -1,6 % | 0 (pierde) | NO-GO |
| 7,50 | 12,00 | 4 % | 0 | 1,13 | 11,3 % | 1,13 | HOLD |
| 7,50 | 12,00 | 9 % | 0 | 0,63 | 6,4 % | 0,63 | HOLD |
| 7,50 | 13,90 | 4 % | 0 | 2,54 | 22,1 % | 2,54 | HOLD |
| 7,50 | 13,90 | 9 % | 0 | 1,96 | 17,1 % | 1,96 | HOLD |
| 7,50 | 15,00 | 4 % | 0 | 3,36 | 27,1 % | 3,36 | GO (CPA obj. 0,36) |
| 7,50 | 15,00 | 9 % | 0 | 2,74 | 22,1 % | 2,74 | HOLD |
| 7,50 | 15,00 | 4 % | 15 % | 1,59 | 12,8 % | 1,59 | HOLD |
| 7,50 | 15,00 | 9 % | 15 % | 0,97 | 7,8 % | 0,97 | HOLD |
| 7,00 | 15,00 | 9 % | 0 | 3,24 | 26,1 % | 3,24 | GO (CPA obj. 0,24) |

Lectura: a 12-15 € el producto es un negocio de 1-3 € por pedido sin sitio para anuncios (a esos PVP el CPA objetivo es ~0), sin afiliados y sin margen para devoluciones, muestras o cupones. Con el proveedor actual es NO-GO/HOLD. Con ~7,5 € solo funciona a 15 € con comisión 4 %, y los 60 días de 4 % caducan. Con cualquier afiliado, no. Un anuncio de pago es inviable en ese rango.

## 7. Anuncio máximo por pedido (resumen)
- Escenario base realista (24,90 €, coste 9,29, vídeos propios, 9 %): máximo 7,90 €; para ganar 3 €, 4,90 €. Con afiliado 15 %: máximo 4,97 € / 1,97 €.
- Mes 1 sin anuncios; este límite solo aplica al mes 2 (GMV Max) y solo si el PVP de 24,90 € se vende de verdad. El anuncio máximo no tiene sentido hasta que el precio esté validado.
- Pack 2 con afiliado: 1,45-3,10 € de CPA objetivo, prácticamente sin sitio para anuncios.

## 8. No verificado (sin GO hasta cerrarlo)
1. Precios de mercado en TikTok Shop ES y Amazon.es (red bloquea amazon.es y tiktok.com; FastMoss 429). Cierra el usuario en 5 minutos en la app: 5 precios con enlace, fecha y ventas.
2. Plazos de preparación y entrega del proveedor (candidato y alternativos): ninguna ficha leída (anti-bot). Si la preparación fuera 3 días, el script da NO-GO.
3. Precio 9,29 € y 7,5 € y envío gratis: de listados de búsqueda, no de ficha.
4. Consolidación de 2 unidades en un solo paquete (afecta al pack).
5. Comisión 4 % vs 9 % y su aplicación a cupones/descuentos: Seller Center.
6. Contenido del set y comparabilidad con A/C/D: fotos bloqueadas (ae-pic-a1.aliexpress-media.com, ae01.alicdn.com).
7. IVA del coste: el script resta 9,29 € con IVA. Si fuera deducible el beneficio subiría ~1,6 €/set. No verificado.
8. Demanda en TikTok Shop ES: sin datos de ventas.

## 9. Observación técnica
`margen_es.py --help` falla (ValueError por "%" sin escapar en el texto de ayuda de `--comision-tiktok`), pero el cálculo funciona. No lo he arreglado (fuera de alcance); el argumento `--afiliado` en la ayuda no aclara que es una fracción, lo que explica el error del 219 €. Sugerencia para el director: corregir la ayuda ("0.15 = 15 %").
