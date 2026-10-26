# Entrega del jefe de márgenes: funda de volante deportiva de polipiel (Ronda 5)

Fecha: 2026-10-26. Autor: analista-margenes. Fuentes: `calculador-escenarios.md`, `auditor-precios-mercado.md`, `simulador-packs.md`, `ronda-5/cumplimiento/revisor-logistica-plazos.md` (todos 2026-10-26) y `.claude/skills/proveedor-es/scripts/margen_es.py`, ejecutado de nuevo hoy (180 combinaciones, envío 0, embalaje 0,30 €, otros 1 %, `--dias-preparacion 2 --dias-entrega 5`).

Costes y PVP son datos de CLAUDE.md y de los especialistas; ninguna ficha de AliExpress se ha reabierto. Costes usados: 9,99 € (1005008315429915), 11,74 € (1005008218948760, modelo de reserva citado en logística) y 13,87 € (1005008219047604).

## 1. Cómo calcula el script (verificado leyendo el código)

- `--afiliado` es una fracción (0.15 = 15 %), se aplica a los ingresos ya netos de devoluciones. `--afiliado 0` = vídeos propios.
- Devoluciones (`calcular`, líneas 439-449): los ingresos se reducen en `base x tasa`, pero el coste del producto, el embalaje, la comisión y "otros" se siguen pagando por el 100 % de los pedidos. Es decir, **cada devolución equivale a producto perdido (no recuperado) y comisión no reembolsada**. El calculador afirmó que el script "no modela producto devuelto no recuperable": es lo contrario, ya lo modela, y es el escenario B de logística (el prudente). Por eso estas cifras son prudentes; si TikTok devuelve la comisión o el producto se revende, el margen real mejora (no verificado).
- Las tasas de devolución 10 / 15 / 20 % son SUPUESTOS (logística: 7-14 % mitigado, 13-25 % sin mitigar, también supuestos, sin datos de mercado). El calculador usó 5 %, que queda por debajo de cualquier rango razonado: no usarlo.
- El veredicto GO del script solo mira margen >= 25 % y beneficio > 3 €; no mira demanda, plazos reales ni precio de mercado.

## 2. Resolución de la contradicción

Las dos posturas son correctas, pero hablan de costes distintos:

- El auditor fija el techo de **mercado**: PVP defendible ≈ 22-25 € (seguro 19,90-22,90 €). Evidencia: lo más caro nuevo leído es 27,99 € (Sparco, caucho), 26,99 € (KEGEL), 25,48 € (CARPOINT, cuero imitación), 22,88 € (Lampa, piel auténtica); la polipiel genérica compite con 9,50-12 €. Origen: extractos de búsqueda, no fichas leídas; el 38,96 € de CLAUDE.md no se pudo contrastar.
- Calculador y logística fijan el piso de **margen**: PVP mínimo para 25 % de margen sin afiliado (script):

| Coste | 4 % dev 10 % | 9 % dev 10 % | 9 % dev 15 % | 9 % dev 20 % |
|---|---|---|---|---|
| 9,99 | 20,80 | 22,70 | 25,00 | 27,70 |
| 11,74 | 24,30 | 26,50 | 29,20 | 32,40 |
| 13,87 | 28,60 | 31,20 | 34,30 | 38,20 |

Con afiliado 15 % y coste 9,99 el mínimo sube a 26,80 (4 %, dev 10 %) - 30,10 (9 %, dev 10 %) y a 33,50 (9 %, dev 15 %): con creadores no hay margen dentro del techo de mercado con ningún coste.

**Solape con el techo 22-25 €:** solo existe con el coste de **9,99 €** (mínimo 22,70-25,00 €, depende de la tasa de devolución). Con 11,74 € el mínimo (26,50-29,20 €) queda por encima del techo; con 13,87 € (28,60-38,20 €) queda muy por encima. La petición de PVP 29,90-34,90 € que hacen calculador y logística nace de usar 13,87 €. No existe un PVP defendible que además deje margen del 25 % con el proveedor de 13,87 €.

## 3. Beneficio por pedido / margen (sin afiliado, vídeos propios)

Formato `€ / % margen`. Columnas = PVP. Pérdida del producto en devoluciones incluida (ver sección 1). Comisión 9 % con dev 15 % es el caso prudente de referencia; comisión 4 % con dev 10 % el optimista (mes 1-2 en tienda nueva, a confirmar en Seller Center).

**Prudente: comisión 9 %, devoluciones 15 % (supuesto)**

| Coste | 19,90 | 22,90 | 24,90 | 27,90 | 29,90 |
|---|---|---|---|---|---|
| 9,99 | 2,04 / 12,4 % | 3,90 / 20,6 % | 5,14 / 25,0 % | 7,00 / 30,4 % | 8,24 / 33,4 % |
| 11,74 | 0,29 / 1,8 % | 2,15 / 11,4 % | 3,39 / 16,5 % | 5,25 / 22,8 % | 6,49 / 26,3 % |
| 13,87 | -1,84 / -11,2 % | 0,02 / 0,1 % | 1,26 / 6,1 % | 3,12 / 13,5 % | 4,36 / 17,7 % |

**Optimista: comisión 4 %, devoluciones 10 % (supuesto)**

| Coste | 19,90 | 22,90 | 24,90 | 27,90 | 29,90 |
|---|---|---|---|---|---|
| 9,99 | 3,69 / 22,4 % | 5,80 / 30,6 % | 7,20 / 35,0 % | 9,31 / 40,4 % | 10,71 / 43,4 % |
| 11,74 | 1,94 / 11,8 % | 4,05 / 21,4 % | 5,45 / 26,5 % | 7,56 / 32,8 % | 8,96 / 36,3 % |
| 13,87 | -0,19 / -1,2 % | 1,92 / 10,1 % | 3,32 / 16,1 % | 5,43 / 23,5 % | 6,83 / 27,7 % |

Curiosidad comprobada: "9 % con dev 10 %" da lo mismo que "4 % con dev 15 %" (p. ej. 9,99 / 24,90 = 6,17), porque pasar del 4 al 9 % cuesta 5 puntos de la base y 5 puntos más de devoluciones restan casi lo mismo.

Con afiliado 15 % (creadores), coste 9,99, PVP 24,90: 3,39 € (9 %, dev 10 %), 2,52 € (9 %, dev 15 %), 4,42 € (4 %, dev 10 %). Con coste 13,87 a 24,90: negativo en todos los casos. Los creadores solo tienen sentido con PVP >= 29,90 y coste 9,99 (6,14 € a 9 %/dev 10 %, margen 24,9 %), fuera del techo de mercado.

Resto de combinaciones con afiliado 15 % (4 %): coste 9,99 a 29,90 da 7,38 / 29,9 % (dev 10 %) y 5,28 / 21,4 % (dev 20 %); coste 13,87 a 29,90 da 3,50 / 14,2 % (dev 10 %).

## 4. ¿Hay negocio con 500 €/mes de anuncios?

Regla: un pedido es rentable con anuncios si beneficio > CPA. Neto mensual = (500 / CPA) x beneficio - 500. ROAS necesario = PVP / beneficio. Todo sin afiliado; CPA 5 / 8 / 12 € son supuestos del encargo, ninguno medido en TikTok Shop ES (no verificado).

Resultado neto mensual en € con 500 € de anuncios (CPA 5 / 8 / 12):

| Escenario | 9,99 a 24,90 | 9,99 a 27,90 | 9,99 a 29,90 | 11,74 a 24,90 | 11,74 a 29,90 | 13,87 a 24,90 | 13,87 a 29,90 |
|---|---|---|---|---|---|---|---|
| 4 % dev 10 % | +220 / -50 / -200 | +431 / +82 / -112 | +571 / +169 / -54 | +45 / -159 / -273 | +396 / +60 / -127 | -168 / -292 / -362 | +183 / -73 / -215 |
| 9 % dev 15 % (prudente) | +14 / -179 / -286 | +200 / -62 / -208 | +324 / +15 / -157 | -161 / -288 / -359 | +149 / -94 / -230 | -374 / -421 / -448 | -64 / -228 / -318 |
| 9 % dev 20 % (estrés) | -89 / -243 / -329 | +85 / -134 / -256 | +201 / -62 / -208 | -264 / -352 / -402 | +26 / -171 / -281 | -477 / -486 / -490 | -187 / -304 / -370 |

Lectura:
- **CPA 12 €**: no hay negocio en ninguna combinación con PVP <= 29,90 €. Pierde dinero siempre dentro del techo de mercado.
- **CPA 8 €**: solo hay negocio con coste 9,99 y PVP >= 27,90 € (+10 a +169 € al mes, margen minúsculo), o 11,74 a 29,90 € solo con comisión 4 %. A 24,90 € pierde en todos los casos.
- **CPA 5 €**: es la única frontera con negocio a un PVP defendible, y solo con coste 9,99: 24,90 € deja +14 € (prudente) a +220 € (optimista) al mes. Con 13,87 € a 24,90 € pierde en todos los casos. CPA 5 € sobre un ticket de 24,90 € exige ROAS 5; es un supuesto optimista, no verificado.
- Anuncio máximo por pedido (el beneficio antes de anuncios) en el esquema recomendado (coste 9,99, PVP 24,90, sin afiliado): 5,14 € (9 %, dev 15 %), 6,17 € (9 %, dev 10 % o 4 %, dev 15 %), 7,20 € (4 %, dev 10 %). Para ganar el objetivo de 3 € por pedido, CPA <= 2,14 a 4,20 €. Es decir, con 500 € solo salen 100 pedidos si el CPA es 5 €, y el beneficio mensual tras anuncios queda entre 14 y 220 €. Negocio muy fino.
- Conclusión: dentro del techo de mercado, el mes 1 (sin anuncios, vídeos propios, 5,1-7,2 € por pedido) es rentable; el mes 2 con GMV Max solo si el CPA real queda por debajo de ~5 €. Mejor no escalar con anuncios hasta medirlo.

## 5. ¿Es realista el pack con cubre cinturones a 39,90 €?

No encuentro en los archivos ningún pack "funda + cubre cinturones a 39,90 €" de otro vendedor; la cifra viene de la nota de CLAUDE.md (38,96 € para la funda sola, no contrastado por el auditor) y del simulador (ancla). No verificado: sin enlace, sin fecha, sin saber si es el mismo producto ni si se vende.

Cálculo (script, sin afiliado; cubre cinturones 6,39 € del listado 1005013109335632, ficha no abierta):

| Pack | Coste | PVP | 4 %, dev 10 % | 9 %, dev 15 % | 9 %, dev 20 % |
|---|---|---|---|---|---|
| Funda 9,99 + cinturones | 16,38 | 34,90 | 7,84 / 27,2 % | 4,95 / 17,2 % | 3,51 / 12,2 % |
| Funda 9,99 + cinturones | 16,38 | 39,90 | 11,35 / 34,4 % | 8,05 / 24,4 % | 6,40 / 19,4 % |
| Funda 13,87 + cinturones | 20,26 | 34,90 | 3,96 / 13,7 % | 1,07 / 3,7 % | -0,37 / -1,3 % |
| Funda 13,87 + cinturones | 20,26 | 39,90 | 7,47 / 22,7 % | 4,17 / 12,7 % | 2,52 / 7,7 % |

Conclusión:
- A 34,90 € el pack gana igual o menos que la funda sola a 24,90 € con coste 9,99 (4,95 frente a 5,14 € en caso prudente), con más piezas, más riesgo y más devoluciones: no merece la pena.
- Solo a 39,90 € el pack añade 2,9 a 4,2 € de beneficio. Pero 39,90 € es 1,6 veces el techo de la funda (24,90) y 12 € por encima del máximo nuevo leído (27,99 €); los cubre cinturones de goma de 2 piezas añaden poco valor percibido (precio de mercado de la pieza: no verificado). Con la funda de 13,87 € no llega al 25 % de margen. No es realista como esquema base.
- Riesgo operativo: dos fichas de AliExpress casi seguro de vendedores distintos (no verificado), envíos partidos contra el plazo de 2 días laborables; un cubre cinturones no debe sugerir efecto en la seguridad del cinturón.
- Posición: probarlo como variante solo después de vender la funda sola, con el mismo vendedor confirmado por escrito.

## 6. Esquema de precio recomendado (uno solo)

**Funda sola, un único precio de lanzamiento de 24,90 €, solo con el proveedor de 9,99 € (1005008315429915), solo vídeos propios (sin afiliados), sin packs ni ofertas.**

- Beneficio 5,14-7,20 € por pedido (margen 25,0-35,0 %) según comisión y devoluciones; cumple el 25 % solo si las devoluciones son <= 15 % con comisión 9 % (con 20 %, 20,0 %).
- Queda en el borde alto del "seguro" del auditor (19,90-22,90 €) y dentro de su techo (22-25 €); a 22,90 € el margen cae a 20,6 % (prudente) y 3,90 € por pedido: es el suelo, no el objetivo.
- No subir a 29,90 € para forzar margen: el auditor no lo considera defendible y no hay referencia de polipiel por encima de ~20 €. Si en las primeras ventas el precio no frena la conversión, subir a 27,90 € (7,00 €, 30,4 %) es una prueba posterior, no un supuesto.
- Con el proveedor de 13,87 € o 11,74 € no hay esquema viable dentro del techo (mínimo 26,50-34,30 €). Si el único proveedor verificado resulta ser el de 13,87 €, el veredicto pasa a NO-GO a 24,90 € y a HOLD a 31-35 €, precio que el auditor no defiende.
- Para la etiqueta de oferta de TikTok: nunca poner un precio tachado inventado (regla de no inventar precios).

## 7. Veredicto

**HOLD (condicional a favor del proveedor de 9,99 €). No GO hoy.**

Motivos:
- Margen solo viable con coste 9,99 € a 24,90 €; nada viable con 13,87 € dentro del techo de mercado.
- El negocio con anuncios existe únicamente con CPA <= ~5 €, no medido.
- Regla de CLAUDE.md: plazos sin verificar = sin GO. Logística pone el riesgo ALTO y "NO GO hasta tener por escrito plazo, hora de corte, transportista y stock".
- Para GO hacen falta: respuesta del vendedor de 9,99 € a las 20 preguntas del cuestionario con preparación <= 1 día laborable, tallas con medidas en cm, stock y GPSR/responsable UE; pedido de prueba que confirme tallas, olor, material (PU o no) y plazo pago -> primer escaneo; y comprobar en Seller Center la comisión efectiva (4 % o 9 %) y quién retiene la comisión en reembolsos.
- NO-GO para: PVP 29,90-34,90 € presentado como "defendible", cualquier PVP <= 24,90 € con coste 13,87 €, afiliados al 15 % con cualquier coste dentro del techo, y el kit de 3 piezas.

## 8. No verificado

- Precios de AliExpress de las tres fundas y del cubre cinturones (listado, ficha no abierta); IVA deducible de la compra (el script lo ignora y usa el precio mostrado como coste).
- Plazo de preparación, hora de corte, transportista, stock, tallas, material, si es de coser o elástica, olor, GPSR.
- Tasas de devolución 10 / 15 / 20 % (supuestos), CPA 5 / 8 / 12 € (supuestos del encargo), quién retiene la comisión en reembolsos.
- Techo de mercado: precios sacados de extractos de búsqueda (WebFetch falló por DNS en ebay.es, action.com, motor16.com, recambioscoche.es, amazon.es); sin datos de TikTok Shop ES, Temu o Shein (FastMoss 429); el 38,96 € de CLAUDE.md sin contrastar.
- Existencia y precio del supuesto pack con cubre cinturones a 39,90 € de otro vendedor.
- Condiciones de la comisión del 4 % (60 días, 5 productos en 15 días): comprobar en Seller Center.
- Demanda de la funda en TikTok Shop ES.

## 9. Contradicciones entre especialistas

- Auditor (PVP máximo 22-25 €) frente a calculador y logística (PVP 29,90-34,90 € para margen): resuelta en la sección 2 (depende del coste; solo 9,99 € encaja). No elijo en silencio: el auditor se apoya en precios de mercado de extractos de búsqueda, los otros dos en el coste 13,87 € y no en el de 9,99 €.
- Calculador (devoluciones 5 %, "no modela producto no recuperable") frente a logística (13-25 % sin mitigar): el 5 % es optimista; el script sí modela producto no recuperable (sección 1).
- Simulador (empujar A a 29,90 €, ancla pack a 39,90 €) frente a auditor: 29,90 € sobrepasa el techo; el ancla de 39,90 € depende de un 38,96 € no verificado.
- Logística calcula la comisión sobre el PVP con IVA (9 % de 29,90 = 2,69 €); el script la calcula sobre la base sin IVA. Diferencia pequeña, no cambia las conclusiones.
