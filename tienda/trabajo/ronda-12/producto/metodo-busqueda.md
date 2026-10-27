# Ronda 12: método de búsqueda de productos ganadores (27/10/2026)
Autor: investigador-tendencias. Alcance: método + aplicación parcial desde el entorno en la nube. Sin ventas de TikTok Shop ES (FastMoss 429, Kalodata/EchoTik sin acceso). Todo lo "vendido" que aparece abajo es de AliExpress ES (listado, acumulado) y NO es demanda en TikTok Shop.

## 1. Cómo buscan los profesionales (resumen con fuentes)
| Herramienta / método | Qué da | Coste (según fuente) | Desde aquí |
|---|---|---|---|
| TikTok Creative Center > Inspiración > Top Products (solo escritorio; filtros región, categoría, periodo; detalle con tendencia, audiencia y vídeos) | Productos populares en anuncios | Gratis. Disponibilidad de datos para España: no verificado | No (login); la persona sí |
| Kalodata | Ventas, GMV, vídeos y creadores por producto de TikTok Shop | Desde ~45,90 $/mes, prueba 5-7 días; Professional ~99 $ (fuente: Copyfy, competidor; contrastar en web oficial) | No |
| FastMoss | Rankings de productos y creadores por país | ~19,99 $/mes con cuotas diarias restrictivas (Copyfy); su blog público sí sale | Solo blog público; la app da 429 |
| EchoTik | Igual, con informes semanales públicos | No verificado | Solo blog |
| Pipiads / Minea | Espía de anuncios (TikTok, Meta) | Pipiads ~49-77 $/mes, sin plan gratis; Minea ~49 $/mes, TikTok limitado en plan bajo (Copyfy) | No |
| TikTok Shop ES: buscador, "más vendidos" y fichas (ventas mostradas, reseñas, nº de vendedores) | Precio real, ventas visibles, saturación | Gratis | No; la persona sí (acción 1 del backlog) |
| Amazon.es Más vendidos / Novedades | Ancla de precio y demanda constante | Gratis | No (sin acceso); la persona sí |
| Google Trends ES | Estacionalidad y vida útil | Gratis | No (no devuelve nada); la persona sí |
| AliExpress ES por pedidos/Choice, envío desde España | Proveedor y coste; pedidos = señal de oferta, no de TikTok | Gratis | Sí (`barrido.py`), solo listado |

Señales de ganador (EchoTik, fuente de proveedor de herramienta, tómese como heurística; no publica umbrales numéricos): ventas diarias que aceleran y se sostienen tras el pico (no un solo día); varios creadores distintos vendiendo, no uno; zona media de creadores (ninguno = difícil de escalar, demasiados = saturado); intención de compra en comentarios; pocas tiendas con el mismo producto y sin guerra de precios; margen suficiente para pagar promoción.
Fuentes: [EchoTik señales](https://www.echotik.live/blog/data-signals-winning-tiktok-product/), [TikTok ayuda Top Products](https://ads.tiktok.com/help/article/how-to-use-top-products), [Copyfy comparativa](https://www.copyfy.io/es/blog/mejores-herramientas-espionaje-anuncios-tiktok), [FastMoss abril 2026](https://www.fastmoss.com/blog/tiktok-shop-europe-top-products-april-2026/). Consultadas 27/10/2026.

Hallazgo de contexto (FastMoss, abril 2026, instantánea 30 días, TikTok Shop ES): top 5 = leggings yoga (28.787 pedidos, 10,53-11,21 €), camiseta mujer (18.602, 10,99-13,98 €), tiras blanqueadoras dentales (14.309; categoría excluida), camiseta deportiva reflectante hombre (14.045, 6,41-10,12 €), top deportivo (13.714, 4,31 €). Es decir: en España vende ropa barata, belleza y volumen a 4-14 €. No aparecen coche, gaming ni hogar. NielsenIQ/TikTok (mayo 2026): TikTok Shop puesto 16 entre minoristas, impulsado por belleza (dato de la propia plataforma, no verificado de forma independiente; [Bolsamanía](https://www.bolsamania.com/noticias/empresas/economia--tiktok-shop-consolida-su-presencia-en-espana-impulsado-por-la-categoria-de-belleza--22525033.html)).

## 2. Embudo de 5 pasos (criterios numéricos)
Regla común: cada dato con fuente y fecha; sin ancla de precio leída = no se puntúa (aprendizaje 19-20).

**Paso 1. Radar de demanda (persona 30 min/semana, agentes preparan la lista de términos).**
Fuentes: Creative Center Top Products (ES, 30 días), Amazon.es Más vendidos/Novedades de Automoción, Videojuegos, Hogar, TikTok Shop ES "más vendidos". Entrada: categoría de nuestro público. Salida: lista de 30 términos con captura (URL, fecha). Pasa si el producto aparece en 2 de 3 fuentes o es top 20 en una.

**Paso 2. Validación de velocidad en TikTok Shop ES (solo persona; con prueba gratis de Kalodata/FastMoss si quiere).**
Por término: nº de vendedores, ventas visibles de los 3 primeros, PVP, reseñas. Pasa si: PVP modal leído >= 12 €; al menos 3 fichas con >= 500 ventas visibles en 30 días (o >= 1.500 acumuladas); entre 3 y 30 vendedores (menos de 3 = sin demanda probada; más de 30 = saturado); >= 2 creadores distintos con vídeo de > 50.000 visualizaciones. Estos cortes son propuestos por este informe, no benchmarks publicados: ajustar tras la primera tanda. Sin este paso, nada pasa a GO.

**Paso 3. Vida útil y estacionalidad (persona, Google Trends ES, 12 meses).**
Pasa si el interés de las últimas 4 semanas >= 50 % del pico de 12 meses y no hay caída > 40 % frente a las 12 semanas anteriores. Descarta modas de pico único.

**Paso 4. Proveedor y margen (agentes, aquí).**
`barrido.py` con el término, envío desde España, luego `margen_es.py`. Pasa si coste <= 0,62 x P - 4,3 € (P = PVP leído en paso 2), >= 4 €/pedido sin anuncios, rating >= 4,7, >= 1.000 pedidos de listado. Para marca propia o mayorista: coste unitario puesto en España con pedido mínimo <= capital del escenario (500 / 2.000 / 5.000 €) y dos presupuestos de proveedor. Ficha, plazo y stock: la persona los abre (agentes no pueden).

**Paso 5. Prueba mínima (persona + agentes).**
5 vídeos orgánicos con etiqueta IA, tope 30 €. Pasa si en 14 días: >= 3 pedidos orgánicos, o >= 1 vídeo con > 5.000 visualizaciones y CTR de ficha >= 1 %. Si no, parar y no escalar. Después, GMV Max solo en el vídeo que vende.

Qué se hace aquí: pasos 4 y preparar 1, 2, 3, 5 (listas, guiones). Solo la persona: lo que exige login o red que aquí falla (pasos 1-3, abrir fichas, Seller Center).

## 3. Aplicación: 10 candidatas (demanda en España)
Evidencia de este informe: AliExpress ES con filtro de envío desde España, vendidos acumulados del listado, leído el 27/10/2026 con `barrido.py` (`tienda/trabajo/ronda-12/producto/barrido/b1.md`); más FastMoss abril 2026 para la categoría. Ninguna tiene aún evidencia en TikTok Shop ES: todas están en paso 1 superado a medias y deben pasar el 2. PVP mínimo = (coste + 4,3) / 0,62 para llegar a 4 €/pedido sin anuncios (fórmula del crítico, aprendizaje 19); no es PVP de mercado.

| # | Candidata | Evidencia España (fuente, 27/10/2026) | Coste listado | PVP mínimo para 4 € | Modelo | Comentario |
|---|---|---|---|---|---|---|
| 1 | Organizador de cables silicona/escritorio (setup gamer) | AliExpress ES: 1005013054729692 100.000+; 1005013072753056 100.000+; 1005013054703330 80.000+ | 5,69-5,99 € | ~16,3-16,6 € | Marca propia como pack "setup" (con 3 y 4) | Muy saturado suelto (valor 5-6 €). Solo en kit |
| 2 | Red/malla de maletero de coche | AliExpress ES 1005013072641609: 50.000+, 4,9★ | 8,09 € | ~20 € | Dropshipping o marca propia en pack | Mercado probable 8-15 €: sin margen suelto. Falta ancla |
| 3 | Caja organizadora de maletero plegable | AliExpress ES 1005012807765865: 50.000+, 4,9★ | 32,85 € | ~60 € | Marca propia (stock en España) | Coste alto para tienda nueva; Amazon ES lo cubre: ancla sin leer |
| 4 | Soporte de auriculares de pared/escritorio | AliExpress ES 1005013064024500: 20.000+ | 6,29 € | ~17 € | Pack de marca propia | Ya NO en ronda 2 (mercado ~6 €). Solo dentro del kit 1 |
| 5 | Pack 3 cepillos de detalle coche/grietas | AliExpress ES 1005013072547921 y 1005013071463578: 20.000+ cada una | 7,09-7,49 € | ~18,4-19 € | Dropshipping (ya rechazado por poco llamativo) | No repetir salvo como extra de kit coche |
| 6 | Luz LED de maletero/ambiente de coche | AliExpress ES 1005013143921291: 10.000+, 20,39 € | 20,39 € | ~40 € | Dropshipping, con CE | Electrónica: exige CE y GPSR; ancla sin leer. Condicional |
| 7 | Organizador de especias/estante de cocina | AliExpress ES 1005012742986692: 3.000+, 12,00 €; estante microondas 1005010256417006: 4.000+, 27,59 € | 12-27,59 € | ~26-51 € | Dropshipping | Hogar útil; sin ventana de demanda en TikTok. Probar solo si paso 2 sale |
| 8 | Camiseta/sudadera estampada streetwear (diseño propio, sin marcas ni personas reales) | FastMoss ES abril 2026: camiseta deportiva hombre 14.045 pedidos, 6,41-10,12 €; leggings 28.787. Listados AliExpress ES de camisetas estampadas: 200-280 vendidos, algunas con cantantes (marca ajena, descartadas) | no verificado | no verificado | POD | Demanda de ropa confirmada en ES, pero a 6-14 €. POD no se pudo comprobar (Printful, Printify, Gelato sin acceso). Diseños sobre gamer/coche sin marcas |
| 9 | Aspirador de coche inalámbrico | AliExpress ES 1005009522309374: 10.000+, 14,49 € | 14,49 € | ~30 € | Excluido (batería) salvo CE demostrado | No usar sin CE. Descarte por regla |
| 10 | Funda de asientos de coche | AliExpress ES 1005013064606560: 3.000+, 26,19 €; otras 3.000+ a 47-49 € | 26-49 € | ~49-86 € | Marca propia a más largo plazo | Bulto, devoluciones, "universal" no permitido como claim. Dudosa |

Otras mirillas del barrido sin evidencia suficiente (ventas de listado < 500): alfombrilla de ratón grande (485 vendidos, 14,99 €), soporte de portátil de aluminio (330, 12 €), gorras bordadas (< 20). Descartadas por demanda.

Veredicto del método: ninguna candidata alcanza GO. Las que más cerca están de un kit con valor percibido son 1 + 4 + (alfombrilla/soporte), formato "setup gamer" de marca propia; coche: 2 + 5 en "kit maletero". Ambas dependen del paso 2 (que lo hace la persona) y de definir un precio de kit (p. ej. 24,90-29,90 € sería hipótesis, no verificado).

## 4. Límites de este informe
- Sin ventas de TikTok Shop ES por producto. No se pudo abrir Kalodata, Pipiads, Minea, Creative Center ni Google Trends. No se leyó Amazon.es (WebSearch devolvió solo artículos con enlaces de afiliado, sin cifras de 2026).
- Los precios de herramientas vienen de un competidor (Copyfy), no de las webs oficiales.
- "Vendidos" de AliExpress es acumulado y se mide por proveedor, no por producto en TikTok.

## Datos clave
| Producto | ID/URL | Coste € | PVP € (probado o propuesto) | Fuente del precio de mercado y fecha | Verificado | Margen/pedido y supuestos | Veredicto |
|---|---|---|---|---|---|---|---|
| Organizador cables silicona | 1005013054729692 | 5,99 | no verificado (mín. ~16,6 para 4 €) | sin ancla; listado AliExpress ES 27/10/2026 | listado | no calculado con `margen_es.py` | Kit solo; sin GO |
| Red de maletero | 1005013072641609 | 8,09 | no verificado (mín. ~20) | sin ancla; listado 27/10/2026 | listado | no calculado | Pendiente paso 2 |
| Caja maletero plegable | 1005012807765865 | 32,85 | no verificado (mín. ~60) | sin ancla; listado 27/10/2026 | listado | no calculado | Pendiente |
| Soporte auriculares | 1005013064024500 | 6,29 | no verificado | mercado ~6 € (ronda 2) | listado | no calculado | Solo en kit |
| Cepillos detalle coche | 1005013072547921 | 7,09 | 19,90 propuesto antes | sin ancla nueva | listado | ver ronda 8 | HOLD |
| Luz LED maletero | 1005013143921291 | 20,39 | no verificado (mín. ~40) | sin ancla; listado 27/10/2026 | listado | no calculado | Condicional (CE) |
| Organizador especias / estante microondas | 1005012742986692 / 1005010256417006 | 12,00 / 27,59 | no verificado | sin ancla; listado 27/10/2026 | listado | no calculado | Pendiente |
| Camiseta/sudadera POD | sin ID | no verificado | 6-14 € rango de categoría (FastMoss) | FastMoss ES abril 2026 | blog público | no calculado | Pendiente de proveedor POD |
| Aspirador coche | 1005009522309374 | 14,49 | no verificado | listado 27/10/2026 | listado | no calculado | NO (batería, CE) |
| Funda asientos coche | 1005013064606560 | 26,19 | no verificado | listado 27/10/2026 | listado | no calculado | Dudosa |

- **Qué sabemos** (con fuente y fecha): ropa deportiva barata (4-14 €) y belleza dominan TikTok Shop ES en abril 2026 (FastMoss, 27/10/2026); organizadores de cables, redes de maletero y soportes de auriculares tienen decenas de miles de pedidos de listado en AliExpress ES (27/10/2026); herramientas de espía cuestan ~20-100 $/mes y Creative Center es gratis.
- **Qué asumimos** (y cómo se comprobaría): que la oferta de AliExpress refleja demanda en TikTok (se comprueba con el paso 2 por la persona); que los cortes numéricos del embudo sirven (se ajustan tras la primera tanda de 10 términos).
- **Qué cambiaría mi conclusión:** ver en TikTok Shop ES o Kalodata que gaming/coche no vende a >= 12 € (hay que cambiar de nicho hacia ropa/POD); un presupuesto de proveedor de marca propia con coste <= 40 % del PVP leído.
