# Decisión del CEO - Ronda 11, puerta 1 - 2026-10-26
Autor: ceo-estratega. Leído: estado, proceso, okrs, hipotesis, aprendizajes, decisiones, `tienda/trabajo/calidad/ronda-11-puerta-1.md` (auditor) y `tienda/trabajo/ronda-11/critica/pre-mortem.md` (crítico). No he abierto fuentes nuevas ni inventado cifras. Los precios de mercado son resúmenes de búsqueda del 26/10/2026 (indicativos); los costes son de listado de AliExpress ES, sin ficha abierta.

## 1. Decisión

**Producto (puerta 1): NO GO para los cinco finalistas (A, B, C, D, E).** Auditor y crítico coinciden y yo también.

**Línea de producto actual (envío desde España + utilidad + demostrar sin muestra): PIVOTAR.** No CERRAR: llevamos 0 € gastados, y los dos supuestos que más pesan (precio en el canal real y origen/plazo permitido por Seller Center) nunca se han medido. Cerrar sin medirlos sería repetir el error de decidir por papel. No AGUANTAR esta línea: once rondas con la misma razón de descarte (precio o margen) no se arreglan con una ronda más.

**Ventosa B2 (1005013071285711, 5,89 €): AGUANTAR en validación manual, no GO.** Es el único con beneficio positivo a precio de mercado sin anuncios: 3,05 €/pedido a 14,90 € (devoluciones 15 %, comisión 9 %, sin afiliado; script `margen_es.py`, recalculado por el auditor). Es un producto de entrada, no un ganador: 10 pedidos dejan unos 30 €, y con anuncios CPA 8 € pierde ~5 € por pedido (cálculo del crítico con la misma fórmula).

Aviso franco para la persona: hoy no existe en el cerebro un producto ganador llamativo y útil que cumpla las reglas. Se lo he dicho con datos porque prometerlo sería inventarlo. El resto de la ronda se dedica a averiguar, gastando 0 €, si es el método o el mercado lo que falla.

## 2. Razones (qué sabemos / qué asumimos / qué haría cambiar de opinión)

**Qué sabemos** (fuente y fecha: auditor y pre-mortem, 26/10/2026)
- Condiciones de puerta 1 incumplidas: ancla de precio en TikTok Shop ES (ninguna leída), ficha abierta por la persona (ninguna), puntuación 32/40 (baremo de la ronda era 6 criterios/30; el mejor equivale a ~28/40), margen >= 25 % y CPA de equilibrio >= 8 € al PVP que acepta el mercado.
- El mercado, según resúmenes de tiendas físicas (Leroy, Worten, Carrefour, Shein), paga 8-15 € por estos objetos. El equilibrio con CPA 8 supone PVP 22,89-26,43 €. Con anuncios todos pierden.
- 14 de 25 filas de `productos.md` caen por precio o margen (recuento del crítico, no auditado por mí).
- C no tiene ficha (el ID 1005013082078464 es un cepillo de fregadero); E no está definido; el margen de C del investigador omitía el IVA (6,17 frente a 1,55 €).
- Cero vídeos publicados, cero datos de demanda del canal, cero fichas abiertas por la persona.

**Qué asumimos** (y cómo se comprueba)
- Que TikTok Shop ES también paga 8-15 € (mirar la app, 30 min).
- Que "ES stock" es obligatorio y que China "no cumple 2 días": nunca se leyó la política de Seller Center. Si basta entregar al transportista en 2 días laborables, el coste puede caer 3-6 veces (ronda 7-8: 1,21 frente a 7,59 € en un producto; no verificado para otros).
- Que el listado es el coste final (variante, cupón y envío sin abrir ficha).
- Que "500 €/mes" es tope de anuncios (no definido).

**Qué haría cambiar de opinión**
- Hacia GO en B2 o similares: ancla en TikTok Shop ES con venta habitual >= 20-25 € para el mismo tipo de producto, ficha abierta con coste <= 5,91 € y preparación <= 2 días laborables, contenido confirmado (ventosa sola), y una demostración real con derechos. Con eso reabrir puerta 1.
- Hacia CERRAR el modelo de producto físico: ancla <= 15 € en el canal real + Seller Center exige entrega local rápida + ningún vídeo orgánico pasa de 2.000 vistas en 10 días con 3 ángulos (criterio de `proceso.md` sec. 4). Entonces se propone pasar a digital/afiliación o parar.

## 3. Objetivo y prioridades de la semana (27/10 al 02/11/2026)

**Objetivo único:** conseguir 4 datos reales del canal con 0 € de gasto para saber si el problema es el mercado o el método.

Prioridades (máximo 3)
1. Datos de la persona: precio y ventas en TikTok Shop ES, fichas abiertas, política de Seller Center (sec. 6).
2. Reconstruir el método con la regla "precio manda" (sec. 5) y rediseñar la ronda 12 hacia nicho de identidad (gamers, coches, streetwear), que es lo que pidió la persona.
3. Preparar la prueba orgánica sin tienda (estrategia 2 del crítico, tope 30 €): guiones y vídeos de objetos tal cual, con etiqueta de IA.

**Se deja de hacer:** nuevas rondas del filtro "envío desde España + utilidad"; re-evaluar A, C, D, E y el kit B3 sin dato nuevo; puntuar sobre 30; cualquier plan con anuncios en el mes 1; recomendar "escalar" sin ancla de mercado.

## 4. Hipótesis que se actualizan (`cerebro/hipotesis.md`)

| # | Cambio |
|---|---|
| H1 antes/después de abolladura | Sigue sin probar y queda BLOQUEADA: sin muestra no hay demostración honesta (regla de aprendizajes 11) y B puntúa 2/5 en demostrabilidad. |
| H2 19,90-24,90 € por el extractor | Rebajada. La evidencia de listado (26/10/2026) apunta a 11,99-12,05 € por 2 ventosas y 12,90-14,90 € defendible. Nueva H2b: 12,90-14,90 € con 3,05 €/pedido. La ancla en TikTok Shop ES sigue sin leerse. |
| H3 entrega al transportista <= 2 días | Sin probar; sigue sin plazo leído en ninguna ficha. |
| H4 devoluciones <= 15 % | Sin probar; riesgo subido en B (expectativa de reparar un golpe real). |
| H5 pack digital Miami/80s | Sin probar; pasa a probarse con lista de espera (estrategia 3 del crítico, umbral >= 30 inscritos en 14 días). Sin nombres de marca. |
| H6 público GTA VI | Sin probar; se prueba con los vídeos orgánicos de la estrategia 2. |
| H7 nueva: el canal real paga >= 20 € por estos productos | Es el supuesto central que mataría o salvaría la línea. Prueba: acción 1 de la persona. |
| H8 nueva: Seller Center permite entrega al cliente con plazo mayor (origen distinto) | Prueba: acción 3. Si es falsa, la estrategia 1 del crítico muere sin gasto. |
| H9 nueva: un vídeo orgánico de objeto de identidad llega a >= 5.000 vistas y >= 10 comentarios de compra en 14 días | Estrategia 2 del crítico. Umbral de partida. |

OKR: sin cambios en KR1-KR4 (todos siguen en 0). Se añade el seguimiento de H7-H9 al ritmo semanal. Los umbrales de H9 son de partida y se ajustan con datos.

## 5. Cambios de método para la ronda 12 (máximo 5)

1. **Congelar la búsqueda por listado de AliExpress ES** hasta tener las acciones 1-3 de la persona. Una ronda sin datos nuevos no se lanza.
2. **El precio manda: calcular al revés.** Partir del ancla de precio en el canal real (P) y buscar solo productos con coste <= 0,62 x P - 4,3 € para >= 4 € por pedido sin anuncios (fórmula del crítico; el auditor y yo hemos comprobado la base 3,05 € de B2). Ejemplo: P = 29,90 € admite coste <= 14,2 €; P = 14,90 € admite coste <= 4,9 €. Sin ancla leída no se puntúa el producto.
3. **Un informe integrado por finalista** (gancho + ID + coste + ancla + margen con el script + normativa + cómo se demuestra sin muestra), puntuado con los 9 criterios sobre 40. Ningún margen "a mano": solo `margen_es.py` (aprendizaje 7). Lo hace `buscador-producto` con revisión de `auditor-precios-mercado` y `calculador-escenarios` antes de entregar.
4. **Nicho de identidad como dirección** (gamers, coches, streetwear, estética sin marca): el precio lo fija el diseño y lo único que se puede mostrar con honestidad sin muestra es el objeto tal cual. Prueba orgánica de 14 días, tope 30 €, ya descrita por el crítico.
5. **Reabrir un descartado exige dato nuevo escrito** (en `decisiones.md` o en el informe). Se añade a la puerta 0: "ancla de precio leída en TikTok Shop ES o dos canales con fecha". Cambio de umbrales de la puerta anotado en `decisiones.md`.

## 6. Las 3 acciones que SOLO puede hacer la persona (unas 2 h en total, 0 €)

1. **Mirar el precio real en TikTok Shop ES (30 min).** En la app de TikTok Shop España buscar: "extractor abolladuras coche", "ventosa abolladuras", "limpiador altavoz móvil", "cepillo desagüe pelo ducha", "escurridor". Anotar para cada uno: precio de venta, ventas visibles, número de vendedores y si se vende por encima de 20 €. Es la ancla que falta y el dato que decide la línea (H7). Si ve productos de identidad (gamer, coche, streetwear) que se venden a 25-35 €, anotar 3 enlaces.
2. **Abrir dos fichas y apuntar qué traen (45 min).**
   - B2, ventosa simple: https://es.aliexpress.com/item/1005013071285711.html
   - B1: https://es.aliexpress.com/item/1005013054629715.html
   Para cada una: qué trae la caja (solo ventosa o también pestañas, pegamento o pistola), nombre de la tienda, variante exacta y precio final con envío y sin cupón, stock, días de preparación (debe ser <= 2 laborables), plazo de entrega con seguimiento, medidas y material, y las reseñas de 1-2 estrellas con fotos de compradores. Si queda tiempo, la ficha del ID 1005013082078464 (C): https://es.aliexpress.com/item/1005013082078464.html (el barrido dice que es un cepillo de fregadero). Los enlaces son la forma estándar de URL con el ID del barrido; si alguno no abre, buscar el ID en AliExpress.
3. **Leer Seller Center y responder dos preguntas (45 min).** (a) En la política de envío y entrega para vendedores de España: qué origen de envío se admite, plazo máximo de entrega al cliente y si basta entregar al transportista en 2 días laborables (H8); y la comisión real de tienda nueva (4 % 60 días / 9 %). (b) Responder por escrito qué es "500 €/mes": tope de anuncios, beneficio deseado o gasto total. Además, decisión que solo es suya: si aceptaría, solo para medir plazo y calidad, un pedido de prueba de 5-15 € de un artículo de 1-3 € a su dirección. Es su regla de "sin muestras" y no la toco sin su palabra; lo normal es seguir sin él.

## 7. Qué queda para los agentes (lo lanza el director, en lotes de <= 10)

- `crecimiento-anuncios` / `guionista-videos` / `creativos-ia`: plan de 5 vídeos orgánicos de 14 días para 3 objetos de identidad sin marca, con etiqueta de IA, música de la biblioteca comercial, sin clientes IA y sin claims; incluye texto de lista de espera. Coste máximo 30 € (Higgsfield sin verificar si cobra); `cfo-finanzas` fija el tope.
- `buscador-producto` + `investigador-tendencias`: lista corta de candidatos de nicho de identidad con término de búsqueda y criterio 9/40, SIN costes inventados; los costes solo se rellenan cuando haya ancla de la persona.
- `curador-cerebro` y `pmo-operaciones`: actualizar `hipotesis.md` (H1-H9), `productos.md` (B: PVP 12,90-14,90 y no 19,90-24,90; C no identificado; E sin definir), `backlog.md` con las 3 acciones de la persona y fecha de revisión 02/11/2026, y la nota de `decisiones.md`.
- `auditor-calidad`: exigir a los autores de ronda 11 las correcciones de su informe (márgenes con script, claims, IDs) antes de archivarlos; no se vuelve a rondar sobre esos informes sin corregir.
- `cfo-finanzas`: confirmar tope de gasto de la semana (0 € salvo hasta 30 € de generación de vídeo) cuando la persona responda qué es "500 €/mes".
- Revisión de la decisión: 02/11/2026 o cuando la persona entregue las acciones 1-3, lo que ocurra antes.

## 8. Riesgos nuevos
- Fatiga: la acción de la persona (abrir fichas) lleva pendiente desde la ronda 9 y es la principal causa de fracaso probable del proyecto (crítico, 45 %, juicio propio). Si no hay respuesta el 02/11/2026, no se lanza la ronda 12 y se propone pausar.
- Expectativas: la persona pide un ganador llamativo; hoy no existe. El resumen debe decirlo con claridad para que no se interprete B2 como ganador.
- Generar vídeos de nicho puede rozar marcas (Vice City, GTA): solo estética, sin nombres.
- Producto digital en TikTok Shop ES: no verificado que se pueda vender allí.

## Datos clave

| Producto | ID/URL | Coste € | PVP € (probado o propuesto) | Fuente del precio de mercado y fecha | Verificado (listado/ficha/persona) | Margen/pedido y supuestos | Veredicto |
|---|---|---|---|---|---|---|---|
| B2 extractor ventosa simple | 1005013071285711 | 5,89 | 14,90 máx. | Leroy 11,99-12,05 (pack 2); resumen de búsqueda, 26/10/2026 | listado; ficha no abierta | +3,05 sin anuncios (dev 15 %, com 9 %, afil. 0); -4,95 con CPA 8 (cálculo del crítico) | AGUANTAR, validación manual; no GO |
| B1 extractor | 1005013054629715 | 7,09 | 14,90 máx. | idem | listado; contenido no confirmado | +1,85 sin anuncios (dev 15 %) | NO (alternativa si B2 falla) |
| B3 kit abolladuras | 1005013064104106 | 22,59 | 44,90 propuesto, no defendible | Leroy 22,49 (18 pz), 27,99 (48 pz); 26/10/2026 | listado | +4,94 sin afiliado, +0,21 con afiliado 15 % | NO |
| A kit limpieza altavoz | 1005013082018973 | 6,19 | 9,90 defendible | Worten 10,77-11,20; Shein 3,81; 26/10/2026 | listado | -0,35 a 9,90 (dev 15 %) | NO |
| C cepillo desagüe (no tira de pelo) | 1005013082078464 | 7,39 | no verificado | sin ancla leída | listado; no es el producto buscado | +1,55 a 14,90 sin anuncios | NO, no identificado |
| D escurridor | 1005013072263315 / 1005013081620383 | 11,99 / 8,08 | 9,90-12,90 | Leroy 11,99-14,99 (pack 2); 26/10/2026 | listado | -3,76 / -0,38 a 12,90 | NO |
| E removedor | 1005013080916611 / 1005013071313766 | 6,09 / 10,29 | no verificado | sin precio ES leído | listado; contenido sin confirmar | no calculado sobre el producto correcto | NO, sin definir |

- **Qué sabemos** (con fuente y fecha): auditor y pre-mortem del 26/10/2026 (recálculo con `margen_es.py`, 5 de 5 cifras del calculador coinciden); anclas de precio de tiendas físicas por resumen de búsqueda; costes de listado de AliExpress ES sin ficha; 0 vídeos, 0 fichas abiertas, 0 ventas.
- **Qué asumimos** (y cómo se comprobaría): que el canal real paga 8-15 € (acción 1); que Seller Center exige origen local y entrega rápida (acción 3); que el coste de listado es el final (acción 2); que 500 €/mes es tope de anuncios (acción 3); CPA 8 € (se mide en el mes 2 con GMV Max en un vídeo que ya vende).
- **Qué cambiaría mi conclusión:** TikTok Shop ES vendiendo estos objetos habitualmente a >= 20-25 €; Seller Center permitiendo otro origen con plazo mayor y un coste de 1-3 € verificado; un vídeo orgánico con >= 5.000 vistas y comentarios de compra; un CPA medido <= 4 €. En sentido contrario (ancla <= 15 € + origen local obligatorio + ningún vídeo > 2.000 vistas en 10 días): proponer abandonar el producto físico.
