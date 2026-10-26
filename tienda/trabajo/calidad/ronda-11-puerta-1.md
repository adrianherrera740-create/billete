# Calidad, ronda 11, puerta 1 (modo A, problema primero) - 2026-10-26

Revisado: los 6 informes de `tienda/trabajo/ronda-11/` contra `barrido.md`, `barrido.json`, `cerebro/aprendizajes.md`, `cerebro/productos.md` y CLAUDE.md. No he corregido ningún informe: cada fallo va con ruta, línea y qué debe corregir su autor.

## Decisión por informe

| Informe | Decisión | Motivo en una línea |
|---|---|---|
| producto/investigador-tendencias.md | RECHAZADO | C (nº 1 del ranking) se puntúa como "tira de pelo" pero su ID es un cepillo de fregadero; margen de C mal calculado (ignora IVA); PVP de B contradice a precios; ganchos con claims prohibidos |
| producto/buscador-proveedores.md | APROBADO con 2 correcciones menores | Datos con fuente y fecha, límites bien declarados; solo etiqueta "ficha exacta" de C sin base y contadores de ventas distintos a los del verificador |
| producto/verificador-fichas.md | APROBADO con 3 correcciones menores | Independiente y honesto; "VERIFICADA" en C sin base, su "mejor" E/D choca con precios, contadores de ventas distintos |
| margenes/auditor-precios-mercado.md | RECHAZADO | Márgenes calculados a mano sin el script y erróneos (B1, A, B3); anclas con fecha de lectura pero sin ficha abierta; "pack" para 19,90 € sale con margen ~0 |
| margenes/calculador-escenarios.md | APROBADO (cifras) con 1 corrección obligatoria | Las cifras salen del script y las recalculo igual; los veredictos "ESCALAR a 29,90" no tienen ancla de mercado y no pueden quedar así |
| cumplimiento/revisor-normativa-ue.md | RECHAZADO | C marcado "SÍ" sin ficha identificada ni documentos; NO de B-kit sobre un producto (pistola termofusible) que ningún ID finalista ha demostrado ser; fuentes dudosas |

## 1. Recálculo a mano (script `margen_es.py`, `--envio 0`, `--afiliado 0`, IVA 21 %, comisión 9 %, embalaje 0,30, otros 1 %)

Fórmula comprobada a mano: beneficio = base x (1 - dev - 0,10) - coste - 0,30, con base = PVP / 1,21.

| Cifra pedida | Script dev 10 % | Script dev 15 % | Calculador | Resultado |
|---|---|---|---|---|
| Coste 7,09, PVP 14,90 | 2,46 | 1,85 | 2,46 / 1,85 | Coincide |
| Coste 7,09, PVP 24,90 | 9,07 | 8,04 | 9,07 / 8,04 | Coincide (mano: 20,5785 x 0,75 - 7,39 = 8,04) |
| Coste 6,19, PVP 9,90 | 0,06 | -0,35 | 0,06 / -0,35 | Coincide: a 9,90 A pierde dinero con devoluciones al 15 % |
| Coste 7,39, PVP 14,90 | 2,16 | 1,55 | 2,16 / 1,55 | Coincide |
| Coste 22,59, PVP 44,90 | 6,80 | 4,94 | 6,80 / 4,94 | Coincide (margen 13,3 %) |

Extras ejecutados: A a 14,90 con afiliado 0,15 y dev 0,15 = 1,18 (coincide); B2 (5,89) a 14,90 dev 0,15 = 3,05, con afiliado 0,15 = 1,48, sin devoluciones ni afiliado = 4,89; `escalado.py` B1 24,90 CPA 8 = +2 EUR/mes (62 pedidos; con CPA 12 da 42 pedidos, el calculador usa 41, irrelevante). Fórmula de PVP mínimo del calculador (líneas 179-191) comprobada para B2: 22,89 (CPA 8, dev 15 %) y 27,73 (+3 EUR). Calculador: 5 de 5 cifras correctas.

Cifras de otros informes que NO coinciden con el script:
- `margenes/auditor-precios-mercado.md` línea 12 y 50: A a 9,90 "≈ 1,1 EUR/pedido". Script: 0,87 sin devoluciones, 0,06 con dev 10 %, -0,35 con 15 %.
- línea 21 y 51: B1 (7,09) a 14,90 "≈ 3,9 EUR". Script: 3,69 sin devoluciones, 2,46 con dev 10 %, 1,85 con 15 %. Sobrestima 1 a 2 EUR por no usar el script (regla de aprendizajes 7).
- línea 23 y 53: kit B3 (22,59) a 24,90-27,90 "≈ -2 a +0,5 EUR". Script sin devoluciones: -4,37 a 24,90, -2,14 a 27,90, -0,65 a 29,90. El +0,5 no se alcanza ni a 29,90; con devoluciones es peor (-6,43 a 24,90).
- `producto/investigador-tendencias.md` línea 48 y 61: C a 14,90 "~6,17 EUR antes de devoluciones y ads" (14,90 - 1,34 - 7,39). Error: no quita el IVA ni el embalaje. Script: 3,39 sin devoluciones, 2,16 con dev 10 %, 1,55 con 15 %. Línea 57: A "~2-4 EUR" a 9,90-12,90; script sin devoluciones da 0,87 a 9,90 y 3,10 a 12,90.
- `producto/investigador-tendencias.md` y `cerebro/productos.md` (fila Extractor): "margen 5,8-9 EUR/pedido con dev 15 %" para 19,90-24,90. B2 da 6,14-9,24 pero B1 (7,09) da 4,94-8,04: el límite bajo está mal para B1 y, sobre todo, el rango de PVP ya no se defiende (ver 3).

## 2. Fuente y fecha de cada precio, ID y afirmación

IDs: los de A, B (7,09 / 5,89 / 22,59), C, D y E aparecen con el mismo coste en buscador, verificador y barrido (listado AliExpress ES, 26/10/2026), salvo los contadores de ventas (ver 3). Ningún precio de coste está verificado en ficha; ningún plazo de preparación está verificado. Eso es correcto como "no verificado" y ningún informe lo presenta como hecho.

Fallos de fuente:
- `margenes/auditor-precios-mercado.md` línea 3: todos los precios de mercado son de resumen de búsqueda (Leroy Merlin, Worten, Carrefour, MediaMarkt, Shein, ManoMano) sin abrir ficha y sin fecha de publicación. Ponen "leído 26/10/2026", aceptable, pero el PVP defendible queda como indicativo, no como ancla firme. Amazon.es, Temu, eBay.es no leídos (línea 40-42); tampoco el propio TikTok Shop ES, que es el mercado real. Las citas de Motor16 y Compradicción son de segunda mano (el fetch falló).
- línea 17: "Leroy kit 18 ventosas azules 22,49 EUR" se usa como techo de B3 (kit con pegamento) aunque el informe admite que no se sabe si lleva pestañas. Techo del kit "21-29 EUR" = no verificado para ese tipo.
- `producto/investigador-tendencias.md` línea 16: "Amazon 9,99 EUR kit 44 piezas" (Compradicción, sin fecha). Marcado como posiblemente desactualizado: aceptable solo como pista. Línea 33: "Taller: 150 EUR" sin fuente (lo marcan "no verificado", pero queda como gancho propuesto).
- `producto/verificador-fichas.md` línea 29-32 (sección C): "Retira pelo bien: VERIFICADA" apoyada en reseñas de Lowe's y ShopSavvy (EE. UU., agregador, algunas incentivadas) de productos que no son el ID 1005013082078464. No es verificación: debe ser "PARCIAL / fuente no equivalente".
- `producto/verificador-fichas.md` línea 33-34 (A): "Consumer Reports, citado por buscador". El verificador declara en la línea 2 que no leyó el informe de `buscador-proveedores`; si "buscador" es el buscador web, aclararlo; si es el agente, se rompe la doble comprobación independiente (aprendizaje 15). Corregir la redacción o confirmar.
- `cumplimiento/revisor-normativa-ue.md` línea 28: fuentes `probablybest.dedyn.io` (espejo de una ficha de AliExpress) y un foro de coches eléctricos. No son fuentes para normativa. Todas las demás son secundarias y declaradas como tales: correcto. Ningún texto oficial (EUR-Lex, BOE, Seller Center) leído.
- `margenes/calculador-escenarios.md` línea 218-225: columna ID/URL "no verificado (no recibido)" aunque los IDs ya existían en buscador/barrido. Falta el ID por fila.
- `cumplimiento/revisor-normativa-ue.md` línea 74-79: sin IDs ni costes en "Datos clave".
- Comisión 4 %/9 % y entrega en 2 días: ningún informe leyó Seller Center. Todos lo marcan "a confirmar": correcto.

## 3. Contradicciones entre informes

1. C es un cepillo de fregadero, no la tira de pelo. Barrido: ID 1005013082078464 = "cepillo de limpieza de drenaje de fregadero, removedor de obstrucciones" (apareció bajo el término "desatascador pelo ducha"). `verificador-fichas.md` línea 20 y 77 lo dice claramente: "la ficha de la tira de pelo no hallada". Pero:
   - `investigador-tendencias.md` puntúa C (21/30, nº 1) con el gancho "la bola de pelo" y la desagüe de ducha; esa puntuación pertenece a un producto sin ficha. Además "PVP 14,90 (pack)" con coste 7,39 de una unidad: el pack es inventado.
   - `buscador-proveedores.md` línea 36-37 lo llama "única ficha exacta".
   - `calculador-escenarios.md` y `revisor-normativa-ue.md` lo tratan como "desatascador de pelo" y el revisor le da "SÍ".
   - Resultado: C no tiene ficha identificada, ancla de precio (auditor: "no verificado", indicio < 4 EUR para el sustituto) ni demostración definida. No puede avanzar. Estado correcto: BLOQUEADO, producto no identificado.
2. E sin definir. `investigador-tendencias.md` línea 20 y `buscador-proveedores.md` línea 56: por título, 1005013080916611 es un set de aplicación de lámina (raspadores), no un quitapegatinas; contenido sin verificar. El verificador (línea 77, 100-101) recomienda como "el más defendible" el disco de goma 1005013071313766 (10,29 EUR, necesita taladro, cita la marca SIFANG en el título), producto distinto que el calculador no calculó (usó 6,09). Calculador "E escalable a 29,90" se aplica a un producto indefinido. El revisor lo pone en NO/CONDICIONAL. Estado correcto: E no existe como finalista hasta que la persona abra la ficha. Si es el disco de 10,29, hay que recalcular (a 14,90 daría margen negativo con anuncios) y quitar la marca del título.
3. PVP defendible (auditor) frente a PVP necesario (calculador). Auditor: A 7,90-9,90; B ventosa 12,90-14,90 (19,90 solo en pack); kit 17,90-21,90; B3 máx. 24,90-27,90; D 9,90-12,90. Calculador: con CPA 8 hace falta 21,5-26 EUR para equilibrio y 26-31 EUR para +3 EUR de beneficio (B2 21,46-22,89 / 26,00-27,73). Ningún producto tiene mercado que pague eso. Con anuncios, ningún finalista sale: NO-GO con anuncios (regla de cruce del propio calculador, línea 195). El calculador deja sus "ESCALAR por etapas / Escalable a 29,90" sin cruzar; hay que retirarlos o reescribirlos como "NO-GO con anuncios a PVP de mercado" (líneas 148-168, 172-177, 217-225).
4. Pack de B a 19,90 (auditor línea 21): si es un pack de 2 ventosas a coste 2 x 5,89 = 11,78, el beneficio es 0,25 (dev 15 %) y 1,08 (dev 10 %). No se sostiene salvo que exista un pack con coste unitario menor. Y el mercado de 2 ventosas es 11,99-12,05 EUR (Leroy). Contradice también el rango "19,90-24,90" de investigador y de `cerebro/productos.md`.
5. Clasificación de B: tendencias lo pone último (16/30) por no poder fabricar antes/después; precios lo deja como lo único con PVP defendible, pero a 12,90-14,90 y no a 19,90-24,90. Ambos tienen razón en parte y se resuelven así: B es el único con margen positivo a PVP de mercado (B2: 3,05-3,66 EUR sin anuncios a 14,90), pero ni su demostración (no se puede fabricar el resultado) ni su devolución (alto, expectativa de reparar) están resueltas. No es "mejor candidato wow" con PVP 19,90-24,90 como dice `cerebro/productos.md`; ese texto debe actualizarse en el cerebro.
6. Contenido de 1005013054629715 (7,09). Buscador: "kit herramientas de reparación"; auditor lo trata como "ventosa simple"; verificador "con herramientas". Qué lleva la caja (solo ventosa o también pestañas/pegamento/pistola) decide PVP, riesgo y el NO del revisor. No verificado en ningún informe.
7. Contadores de ventas distintos para el mismo ID: 1005013054629715 = 20.000 (barrido, buscador) vs 10.000+ (verificador); 1005013072263315 = 20.000 vs 10.000+; 1005013080916611 = 80.000 (barrido, buscador) vs 50.000+ (verificador). Costes y ★ coinciden. Probablemente cubos del listado en lecturas distintas; deben anotarse como "orden de magnitud, no auditable".
8. Verificador "mejor honestidad/riesgo: E y D" frente a precios: D a 11,99 es negativo y a 8,08 deja ~1,4 EUR; E no tiene ancla. No es un fallo del verificador (su ámbito es el claim) pero no debe leerse como recomendación.
9. Plazos: ningún informe verificó días de preparación. Etiquetas "entrega 2 días" solo en 1005006822360473 (15,39 EUR, 298 vendidos) y 1005010452343392 (12,43 EUR, 4,4★): es entrega, no preparación, y con ventas bajas. El requisito de TikTok es entrega al transportista en 2 días laborables con seguimiento: sin verificar para todos.

## 4. Reglas de CLAUDE.md y aprendizajes

- Nada inventado como hecho; costes y plazos "no verificado": cumple, salvo los fallos de la sección 1 y 2.
- Regla 2 (precio de venta sin ancla leída = sin GO): ningún finalista tiene ancla de TikTok Shop ES; las de otras tiendas son de resumen de búsqueda. Sin GO para ninguno: correcto en todos los informes (los "ESCALAR" del calculador son la excepción a retirar).
- Regla 3 y 4 (barato = saturado; comprobar precio real): confirmadas por los datos. A: ancla 3,81-11,20 EUR para coste 6,19. Ejemplo de lo que ya avisaba el cerebro.
- Regla 9 (coste <= ~7 EUR con PVP >= 29,90 EUR, PVP/coste >= 4-5): ninguno la cumple a PVP de mercado. El mejor ratio es B2: 14,90 / 5,89 = 2,5.
- Regla 11/12 (claims, IA, marcas): ganchos de `investigador-tendencias.md` que rompen reglas: línea 31 A "Llevas meses sin oír bien tu música y no es el móvil" y "tu móvil suena bajo y no es el volumen" (prometen recuperar el sonido, prohibido por verificador y revisor); línea 33 B "esta abolladura ha desaparecido en 10 segundos" (resultado no demostrable sin muestra; lo marcan condicionado); línea 35 C "Antes de llamar al fontanero" (sustituye al fontanero, prohibido por verificador); línea 39 E "quita el pegamento sin tocar la pintura" (prohibido). Líneas 33-39 llevan, correctamente, la nota de "no prometer sin prueba", pero deben reescribirse antes de pasar a creativos. Etiqueta IA y sin clientes IA: declarada en la línea 29, cumple.
- Marcas: buscador y verificador las listan como descarte (Airpods, SIFANG, Rafford, Xiaomi, 3M...), correcto. El disco E con título "SIFANG" y el 1005013109111366 "Rafford" no pueden usarse con ese nombre. El revisor menciona "iPhone, Samsung, AirPods, Lightning" solo como ejemplos de lo que no escribir (interno, aceptable).
- Regla 5 (puntuar con criterios fijos, umbral 32/40): `investigador-tendencias.md` usa 6 criterios sobre 30, no los 9 de la regla ni el umbral 32/40; los totales (16-21/30) no son comparables con productos.md. Hay que reexpresarlos con los criterios fijos o dejar claro que es solo ranking relativo.
- "Sin comprar muestras" + "solo lo que el producto hace de verdad": A y B necesitan una demostración real del efecto (pelusa extraída; abolladura que sale). Sin muestra y sin antes/después fabricado no hay contenido honesto. Ningún informe resuelve cómo se obtiene una demostración real; solo el verificador (líneas 87-92) y el investigador (línea 29) apuntan el problema.
- Sectores excluidos: ninguno de los 5 entra en salud, suplementos, cosmética, juguetes o alimentación. A con masilla/gel sin composición y E con disolvente serían problema (química/CLP) y el revisor lo señala bien. B-kit con pistola eléctrica o batería: excluido si no hay CE (revisor, correcto como regla, pero sin ID asociado).
- Pendientes de cerebro (alta fiscal, GPSR, Seller Center): el revisor los lista como no verificados: cumple.
- Regla 15 (doble comprobación independiente): buscador y verificador declaran no haberse leído; hay discrepancias de contadores (sección 3.7) y coincidencia en costes e IDs. Lo único que rompe la independencia es la frase de la sección 2 (Consumer Reports).

## 5. Lista de correcciones que debe hacer cada autor

producto/investigador-tendencias.md
- Quitar C del puesto 1 y rotularlo "producto no identificado": el ID 1005013082078464 es un cepillo de fregadero. Rehacer la puntuación solo si aparece la ficha de la tira de pelo.
- Rehacer el margen de C y A con `margen_es.py` (líneas 48, 57, 61): C 14,90 = 1,55-2,16 EUR; A 9,90 = 0,06 a -0,35 EUR.
- Retirar "pack" de C si no hay un pack con coste verificado.
- PVP de B 19,90-24,90 (línea 51, 59): ajustar al ancla de precios (12,90-14,90 ventosa).
- Reescribir los ganchos con claims prohibidos (línea 31, 33, 35, 39).
- Aclarar que los totales /30 no son la puntuación fija de 9 criterios.

producto/buscador-proveedores.md
- Línea 36: sustituir "única ficha exacta" por "única ficha candidata; contenido no confirmado como tira de pelo".
- Anotar en la tabla de A/B/D/E que los contadores difieren de la lectura del verificador.

producto/verificador-fichas.md
- Línea 29-32: cambiar "VERIFICADA" por "no verificada (fuentes de EE. UU., no equivalentes)".
- Línea 33-34: aclarar quién es "buscador".
- Veredicto (línea 56-57): añadir que E y D no tienen ancla de precio viable.

margenes/auditor-precios-mercado.md
- Recalcular todos los márgenes con `margen_es.py` (con dev 10 % y 15 %), no con fórmula propia: A, B1, B2, B3, D.
- Quitar el "+0,5" y el "-2" de B3; corregir con el script.
- Quitar o recalcular el "pack varias unidades a 19,90" con coste de pack.
- Abrir al menos las fichas de Amazon.es/Temu/TikTok Shop ES o dejar el PVP defendible marcado "indicativo, de resumen de búsqueda".

margenes/calculador-escenarios.md
- Reescribir los veredictos "ESCALAR por etapas" y "Escalable a 29,90" (líneas 148-177, 217-225): a PVP defendible de mercado son NO-GO con anuncios; 29,90 es solo un escenario hipotético.
- Añadir los IDs.
- Sacar E de "escalable" hasta que esté definido.

cumplimiento/revisor-normativa-ue.md
- C: cambiar "SÍ con comprobaciones" a CONDICIONAL; no hay ficha, materiales ni documentos.
- B-kit: aclarar que el NO se aplica solo si la ficha trae pistola eléctrica/batería, y que ningún ID finalista lo ha demostrado.
- Sustituir `probablybest.dedyn.io` y el foro de coches por una fuente aceptable o marcar "no usable".
- Añadir IDs y costes a "Datos clave".

## 6. ¿Puede algún finalista pasar a validación con la persona?

Solo B, y solo la versión ventosa simple (B2 1005013071285711 a 5,89 EUR; B1 1005013054629715 a 7,09 EUR como alternativa). No es GO: es pasar a que la persona abra la ficha y decida.

Por qué solo B:
- A: 0,06 EUR a 9,90 con dev 10 % (tope de mercado 9,90-11,20). No hay forma de ganar dinero. HOLD de ronda 10 confirmado.
- C: producto sin identificar. No pasa.
- D: 11,99 pierde; 8,08 deja ~1,4 EUR a 12,90 (sin devoluciones). No pasa.
- E: sin definir. No pasa.
- B3 kit 22,59: negativo a cualquier PVP defendible. NO.
- B ventosa: B2 a 14,90 = 3,05 EUR (dev 15 %), 3,66 (dev 10 %), margen 24,7 %; B1 a 14,90 = 1,85-2,46 EUR. Es el único con beneficio positivo a precio de mercado y sin anuncios (mes 1 del plan).

Condiciones exactas para pasar a la persona:
1. PVP máximo 14,90 EUR en ventosa simple. No usar 19,90-24,90 salvo que se pruebe que el mercado lo paga (hoy el ancla es 11,99-12,05 EUR por 2 ventosas).
2. La persona abre 1005013071285711 y 1005013054629715 y anota: qué trae la caja (solo ventosa o pestañas/pegamento/pistola), medidas, material, nombre de la tienda, stock, días de preparación (debe ser <= 2 laborables), plazo de entrega con seguimiento, precio final con cupones, y las reseñas de 1-2 estrellas con fotos de compradores.
3. Margen recalculado con el script y el coste real de la ficha, dev 0,15; afiliado 0 en mes 1 con vídeos propios (3,05 EUR para B2) y con 0,15 si hay microcreadores (1,48 EUR). Si el resultado es < 25 % o < 3 EUR por pedido sin anuncios, vuelve a HOLD.
4. Sin anuncios en el mes 1 (CLAUDE.md); GMV Max solo si el vídeo vende. A PVP 14,90 no hay margen para CPA 8 (equilibrio 1,85-3,05 EUR).
5. Demostración real sin comprar muestras: solo vídeo real del proveedor con derechos, o de un creador con muestra, o un caso real. Etiqueta "Contenido generado por IA" y ningún antes/después fabricado. Mostrar también un caso que no sale (pliegue). Si no hay material real, B no puede producir contenido legítimo: parar.
6. Sin claims: "repara", "como un taller", "sin dejar marcas", "universal", "sin pintar". Texto permitido: "puede ayudar con abolladuras pequeñas y poco profundas en superficies lisas; el resultado depende de la abolladura".
7. Cumplimiento: sin pistola eléctrica ni batería en el kit; datos de fabricante y responsable UE (GPSR) pedidos al proveedor; categoría y comisión (4 % 60 días / 9 %) comprobadas en Seller Center.

## 7. Qué dato falta para llamar ganador a B (o a cualquiera)

- Un PVP de TikTok Shop ES y de Amazon.es/Temu leído con fecha, para ventosa y para kit. Hoy solo hay resúmenes de búsqueda.
- La ficha leída: contenido, coste final, plazo de preparación <= 2 días laborables, tienda, stock.
- Demostración real disponible sin comprar muestra.
- Tasa de devolución real (hoy supuesto 10-15 %) y CPA medido (hoy supuestos 5/8/12).
- Un coste con el que se cumpla la regla 9 (coste <= ~7 EUR con PVP >= 29,90 y PVP/coste >= 4-5). Con ancla 12,90-14,90 EUR no se cumple: B no será "ganador" según los criterios del equipo. A lo sumo es producto de entrada con ~3 EUR por pedido.

Conclusión: la ronda 11 confirma las reglas 3 y 4 de aprendizajes (barato y saturado). Resultado de la puerta 1: ningún GO, ningún ganador; B-ventosa puede pasar a validación manual con la persona bajo las condiciones de la sección 6. Actualizar `cerebro/productos.md` (fila Extractor: PVP 12,90-14,90 y no 19,90-24,90; C no identificado; E sin definir) cuando se corrijan los informes.
