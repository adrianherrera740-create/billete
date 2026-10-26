# Skills para la ronda 5 (estudio a fondo de la funda de volante deportiva de polipiel y campaña TikTok Shop ES)

Fecha: 2026-10-26. Fuentes: CLAUDE.md, `.claude/skills/` (22 `sealeap-tiktokshop-*`, `proveedor-es`, utilidades), `.claude/agents/`, `tienda/trabajo/skills/ronda-4.md`, y SearchSkills/ListSkills (consultados hoy). No se ha instalado ni activado nada.

Producto: AliExpress ES 1005008219047604 (13,87 EUR; PVP candidato 29,90-34,90 EUR; referencia de mercado 38,96 EUR, ronda 3). Plazos, stock, tallas y demanda en TikTok Shop ES: no verificado.

## 1. Trabajador -> skills instaladas a cargar

Las `sealeap-*` son marcos de método (MIT, `sealeap-NOTICE`), no fuentes de datos: no dan ventas ni precios de TikTok Shop ES.

### Fase 1 (estudio del producto)

| Trabajador | Cargar | Por qué |
|---|---|---|
| investigador-tendencias | `sealeap-tiktokshop-trend-validation` | Tabla de evidencia, vida de la tendencia y estacionalidad; separa hecho de juicio. |
| | `sealeap-tiktokshop-content-product-fit` | Valor visible y demostrable en 3 s (volante, interior del coche, antes/después). |
| buscador-proveedores | `proveedor-es` (+ `scripts/aliexpress_es.js`) | Listado AliExpress ES con envío desde España y alternativa (1005008315429915 a 9,99 EUR). |
| | `sealeap-tiktokshop-inventory-spikes` | Stock y tallas reales ante un pico de pedidos. |
| verificador-fichas | `proveedor-es` | Reglas de ficha verificada. |
| | `sealeap-tiktokshop-listing-localization` | Atributos, tallas, fotos reales frente a imagen IA, datos de fabricante/responsable UE. |
| | `sealeap-tiktokshop-returns-feedback` | Reseñas negativas (talla, olor, agarre, desgaste) a riesgo de devolución y a promesas prohibidas. |
| calculador-escenarios | `sealeap-tiktokshop-unit-economics` (`scripts/unit_economics.py`) | Contribución por pedido con comisión 9 % / 4 %, devoluciones, afiliado y anuncio. |
| | `proveedor-es` (`scripts/margen_es.py`) | Contraste del cálculo (`--afiliado` fracción, `--devoluciones`; `--help` falla). |
| | `sealeap-tiktokshop-affiliate-commissions` | Escenario de comisión de afiliado sobre PVP 29,90-34,90 EUR. |
| auditor-precios-mercado | `sealeap-tiktokshop-promotion-margin` | Efecto de cupones y envío gratis sobre el PVP comparado. |
| | `sealeap-tiktokshop-content-product-fit` | Si el diferencial (material, costuras, tallas) se puede demostrar. |
| simulador-packs | `sealeap-tiktokshop-promotion-margin` | Apilado de pack/cupón sobre el margen. |
| | `sealeap-tiktokshop-unit-economics` | Contribución de cada pack. |
| revisor-normativa-ue | `sealeap-tiktokshop-listing-localization` | Fabricante/responsable UE, avisos, producto de automoción (airbag: no tapar ni tocar). |
| revisor-logistica-plazos | `sealeap-tiktokshop-fulfillment-service` | 2 días laborables y seguimiento válido; sin plazo escrito no hay GO. |
| | `sealeap-tiktokshop-inventory-spikes` | Rotura de stock tras publicación. |
| revisor-contenido-ia | `sealeap-tiktokshop-listing-localization` | Imagen IA frente a producto real. |
| | `sealeap-tiktokshop-commercial-audio-clearance` | Música solo de la biblioteca comercial. |

### Fase 2 (campaña)

| Trabajador | Cargar | Por qué |
|---|---|---|
| guionista-videos | `sealeap-tiktokshop-short-video-tests` | Matriz de guiones: gancho, demostración, llamada a la acción, hipótesis por vídeo. |
| | `sealeap-tiktokshop-content-calendar` | Matriz de contenido y reutilización de ángulos. |
| redactor-fichas | `sealeap-tiktokshop-listing-localization` | Título y atributos solo con lo verificado; lista de comprobación. |
| | `sealeap-tiktokshop-returns-feedback` | Promesas ajustadas para no provocar devoluciones (compatibilidad por tamaño). |
| prompter-higgsfield | `sealeap-tiktokshop-short-video-tests` | Cada prompt ligado a un guion y una prueba. |
| | `sealeap-tiktokshop-listing-localization` | Imagen IA coherente con el producto real. |
| buscador-creadores | `sealeap-tiktokshop-creator-discovery` | Candidatos anónimos, encaje con tarea y audiencia (coche/tuning). |
| | `sealeap-tiktokshop-affiliate-commissions` | Comisión que el margen permite. |
| redactor-briefs | `sealeap-tiktokshop-creator-brief-rights` | Brief, aprobación y derechos de reutilización/anuncio. |
| | `sealeap-tiktokshop-commercial-audio-clearance` | Audio permitido en anuncio. |
| gestor-muestras | `sealeap-tiktokshop-sample-operations` | Presupuesto y estado de envío de muestras, entrega de vídeo. |
| | `sealeap-tiktokshop-product-link-validation` | Enlace de producto correcto en cada vídeo y creador. |

### Fase 3 (medición y escalado)

| Trabajador | Cargar | Por qué |
|---|---|---|
| analista-metricas | `sealeap-tiktokshop-analytics-attribution` | Diccionario de métricas por vídeo, creador y anuncio sin solapes. |
| | `sealeap-tiktokshop-short-video-tests` | Leer resultados del día 3 contra la hipótesis. |
| planificador-gmvmax | `sealeap-tiktokshop-gmvmax-testing` | Objetivo y presupuesto de prueba; mes 2, solo vídeos que ya venden. |
| | `sealeap-tiktokshop-advertising` | Diagnóstico conjunto de anuncio/creativo/atribución. |
| | `sealeap-tiktokshop-unit-economics` | Anuncio máximo por pedido que deja margen. |
| auditor-atribucion | `sealeap-tiktokshop-analytics-attribution` | Evitar contar doble entre vídeo, afiliado y anuncio. |

Para todos: `investigate-first` (ante un bloqueo, diagnosticar antes de probar variantes) y `verify-and-stop` (cerrar con prueba, sin ampliar). No cargar `sealeap-tiktokshop-live-assortment`, `store-operations` ni `product-selection` (la selección ya está hecha; solo como lista final si el director lo pide). Las `caveman*`, `migration`, `safe-refactor`, `surgical-patch`, `lean-build` no aplican.

## 2. Huecos para el marketing

| # | Hueco | Evidencia | Afecta |
|---|---|---|---|
| H1 | Analítica de tendencias y ventas de TikTok Shop ES (demanda, precio, saturación de fundas de volante) | FastMoss 429, sin datos (CLAUDE.md); ninguna skill de datos instalada. `trend-validation` es método. | investigador-tendencias, auditor-precios-mercado, planificador-gmvmax |
| H2 | Copy en español de España para producto de coche (ficha y guion), sin skill propia | Solo `listing-localization` (verificación) y `short-video-tests` (estructura); no hay skill de redacción en es-ES. | redactor-fichas, guionista-videos |
| H3 | Ficha abierta de AliExpress, fotos reales y plazo | Anti-bot y dominios de imagen rechazados (CLAUDE.md). Es red/acceso, no método. | verificador-fichas, logística, creativos |
| H4 | Reseñas independientes y precio en Amazon.es y otros | Ronda 3: no accesible. Acceso, no método. | auditor-precios-mercado |
| H5 | Compatibilidad por tamaño de volante (tallas) y requisitos UE del accesorio | No verificado; depende de la ficha. | redactor-fichas, revisor-normativa-ue |

H2 es el único hueco que una skill podría cubrir en parte. H1, H3-H5 son acceso a datos: ninguna skill los arregla y saltarse un 429 o un anti-bot no es aceptable.

## 3. Búsqueda externa (2026-10-26)

- SearchSkills, 2 consultas (copywriting, trend analysis, product description, ecommerce; tiktok, marketing campaign, spanish, seo keywords, analytics): 0 resultados. Además, la ronda 4 hizo 3 consultas con 11 palabras clave: 0.
- ListSkills (ronda 4): solo skills genéricas de cuenta, ninguna de copy ni tendencias. SuggestSkills: no disponible.
- Propuestas externas: 0. No hay ninguna skill que leer entera ni cuyo riesgo evaluar. No propongo nada "por si acaso".

## 4. Recomendación

1. Usar solo lo instalado (tablas de la sección 1). Para H2, el redactor de fichas y el guionista trabajan con `listing-localization` y las reglas de CLAUDE.md (solo lo verificado, etiqueta IA, sin marcas ajenas, sin reseñas falsas); el revisor-contenido-ia revisa cada texto. No hace falta skill nueva.
2. Lo que desbloquea la campaña es una decisión de la persona: permitir en red `ae-pic-a1.aliexpress-media.com`, `ae01.alicdn.com`, y quizá `amazon.es`; aportar capturas de FastMoss/Kalodata/Centro de Tendencias; y el plazo escrito del vendedor. Sin ello, demanda, plazo y tallas siguen "no verificado" y sin GO.
3. Si H2 se repite y bloquea, repetir SearchSkills con el hueco concreto y proponer como máximo una, tras leerla entera.
