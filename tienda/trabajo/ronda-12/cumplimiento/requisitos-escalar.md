# Requisitos legales, fiscales y de plataforma para escalar (ronda 12)

Fecha de la investigación: 2026-10-27. Autor: revisor-normativa-ue. Método: WebSearch (WebFetch no usado). Casi todas las fuentes son secundarias (blogs, despachos, proveedores de servicios); no se leyó EUR-Lex, BOE, AEAT, EUIPO ni Seller Center directamente. Todo lo que dependa de eso queda marcado "verificar en fuente oficial". No es asesoría legal ni fiscal: lo fiscal lo confirma una gestoría.

Escenarios: (1) importar stock propio de China/UE con marca propia; (2) POD / mayorista UE. Siempre vendiendo en TikTok Shop ES.

## 1. Veredicto corto

- Ambos escenarios exigen alta fiscal (autónomo o sociedad), que hoy NO está cubierta (estado.md, bloqueos vivos). Sin ella no hay ni cuenta de vendedor válida ni IVA ni EORI.
- El dropshipping simple desde China ya no tiene la ventaja arancelaria de antes: desde el 1/7/2026 desaparece la franquicia de derechos para envíos < 150 € y hay un derecho fijo transitorio de 3 € (ver 3). Afecta a todos los escenarios con origen China.
- Riesgo global de pasar a marca propia con stock: ALTO por cumplimiento (GPSR, CE, RAEE/pilas, etiquetado), no por la alta, que es barata.
- Categorías que conviene evitar en esta fase por coste de cumplimiento: electrónica (CE/RED/RAEE/pilas), iluminación LED de coche. Textil y accesorios no eléctricos son los más baratos de cumplir.

## 2. Alta fiscal (autónomo o sociedad)

| Dato | Lo que dice la fuente | Fuente y fecha | Estado |
|---|---|---|---|
| Tarifa plana autónomo | 80 € nominales; fuentes la sitúan en ~88,64 € reales en 2026 por el MEI; 12 meses, ampliable 12 más si ingresos < SMI; hay que pedirla en el momento del alta; sin deudas con SS/Hacienda; no haber sido autónomo en los 2 años previos (3 si ya la disfrutó) | Quipu, Billin, Vodafone Empresas, consulta 2026-10-27 (blogs, no Seguridad Social) | Verificar en Seguridad Social: una fuente dice que la cuantía depende de la ley de presupuestos |
| Epígrafe IAE para venta online | No encontrado | Búsqueda 2026-10-27 sin resultado | NO VERIFICADO. No cito epígrafe. Debe confirmarlo la gestoría/AEAT (modelo 036/037) |
| Sociedad (SL): coste notaría/registro, capital mínimo | No buscado | - | NO VERIFICADO |
| Gestoría mensual | No buscado | - | NO VERIFICADO |
| Plazo del alta | No buscado | - | NO VERIFICADO |

Quién lo hace: SOLO la persona (identidad, certificado digital/Cl@ve, firma). El agente puede preparar la lista de preguntas para la gestoría.

## 3. IVA e importación

### 3.1 Derechos de aduana: fin de la franquicia de 150 €
- El Reglamento (UE) 2026/382 elimina la exención de derechos para envíos < 150 € y aplica un derecho fijo de 3 € por categoría de producto (línea arancelaria), transitorio, desde el 1/7/2026. A partir de julio de 2028 se prevé el régimen estándar con el Centro Aduanero de Datos de la UE. Fuentes: AduanaNews, LexisNexis, Polskie Radio, BDO (marzo 2026), CTT/IPC (29/6/2026), consulta 2026-10-27.
- Discrepancia entre fuentes: "por línea de artículo", "por artículo" o "por categoría de producto". NO VERIFICADO cuál. Importante: un pedido de 2 productos distintos podría pagar 6 €. Verificar en DOUE/AEAT antes de calcular márgenes.
- Una fuente indica que se recauda a plataformas o intermediarios, no al consumidor en la entrega. NO VERIFICADO.
- Por encima de 150 €: derechos estándar (según TARIC, origen y valor). Los aranceles pueden ir del 4 % al 48 % del valor (infoautonomos, consulta 2026-10-27, cifra muy genérica).
- Efecto para la tienda: cualquier coste de producto de AliExpress/CJ debe revisarse; `margen_es.py` hoy no incluye este derecho (aviso para cfo-finanzas, no lo modifico).

### 3.2 IVA de importación e IOSS
- El IVA se aplica a toda importación desde el 1/7/2021 (se eliminó la exención de 22 €). El IOSS cubre ventas a distancia de bienes importados de valor <= 150 € sin impuestos especiales. Un vendedor establecido en España se registra vía AEAT; declaración mensual. Fuente: AEAT folleto IOSS vendedores, Sovos, Stripe, consulta 2026-10-27.
- Una guía antigua (infoautonomos) cita "envíos <= 22 € sin IVA": está desfasada; ignorar.
- Pasos concretos del alta IOSS en la AEAT, documentación y plazo: NO VERIFICADO.
- Importación con stock propio (> 150 € por envío o contenedor/palé): IVA habitual 21 % (10 % o 4 % en algunos productos), recuperable si se tiene derecho a deducción; el arancel no se recupera. Existe diferimiento del IVA en la declaración periódica, pero no está abierto a todos. Fuente: infoautonomos, Quipu, consulta 2026-10-27.
- Con TikTok Shop como plataforma, el papel de la plataforma respecto al IOSS no se ha podido leer: NO VERIFICADO.

### 3.3 Aduanas, EORI y DUA
- Necesarios: número EORI, clasificación TARIC correcta, DUA de importación presentado ante la AEAT (lo hace un agente de aduanas/OEA), y declaración sumaria de entrada (ENS/ICS2) antes de la llegada. Sin EORI no se despacha. Fuente: icontainers, infoautonomos, uc3m, consulta 2026-10-27.
- Honorarios del agente/transitario: ninguna fuente da importes. NO VERIFICADO (pedir presupuesto cerrado).
- Coste del EORI: no buscado. NO VERIFICADO (se tramita ante la AEAT, no se ha leído la tasa).

Quién lo hace: la persona (EORI, IOSS, certificado). El agente puede comparar presupuestos de transitarios si la persona los consigue y recalcular márgenes con la nueva tasa de 3 €.

## 4. GPSR y persona responsable en la UE

- Reglamento (UE) 2023/988, aplicable desde 13/12/2024. Ningún producto de consumo no alimentario puede comercializarse sin un operador económico responsable establecido en la UE (fabricante, importador, representante autorizado o, según algunas fuentes, proveedor de servicios de cumplimiento). Sus datos (nombre, dirección, correo) deben figurar en el producto o embalaje y en la ficha online. Fuente: Baker McKenzie, Squire Patton Boggs, Wikipedia, FiveX, consulta 2026-10-27 (secundarias; discrepan en si el proveedor de cumplimiento vale).
- TikTok Shop pide DNI/datos del responsable UE y del fabricante en el producto (guía de terceros, consulta 2026-10-27; ver 9). El skill sealeap-tiktokshop-listing-localization ya señala el hueco de datos del fabricante.
- Marca propia con stock importado: la persona (o su empresa) pasa a ser importador/responsable. Hay que tener ficha técnica, evaluación de riesgo y trazabilidad (lote/modelo). Detalles de documentación técnica: NO VERIFICADO.
- Dropshipping directo desde un proveedor chino sin responsable UE: la ficha no cumple. Esto afecta a todos los productos hoy en cartera de productos.md.

Riesgo: ALTO para cualquier producto importado sin responsable UE.
Quién lo hace: la persona decide quién actúa de responsable (ella misma si tiene alta, o un servicio de terceros, coste NO VERIFICADO). El agente redacta etiquetas y campos de ficha con los datos que la persona dé.

## 5. Marcado CE y normas por categoría

Fuente única de esta ronda para este apartado: 1 búsqueda sobre iluminación de coche. El resto es marco general que NO se ha verificado con fuente.

| Categoría | Lo verificado | Lo no verificado | Riesgo |
|---|---|---|---|
| Accesorios coche eléctricos/iluminación LED | CE cubre seguridad eléctrica; la legalidad vial exige homologación ECE aparte (blog Alibaba, comercial). Las lámparas se homologan junto con el faro (Autofácil). OSRAM lanzó en 2025 una LED homologada ECE R37 (S&P Global, LEDinside) | Qué directivas CE aplican (EMC, baja tensión, RED), pruebas y coste de laboratorio | ALTO: evitar en esta fase |
| Accesorios coche no eléctricos (fundas, organizadores, soportes) | - | Norma aplicable: probablemente solo GPSR; NO VERIFICADO | BAJO-MEDIO |
| Setup gamer eléctrico (ratones, teclados, auriculares, iluminación RGB, USB) | - | Directivas EMC/RED/baja tensión y RoHS: NO BUSCADO, NO VERIFICADO | ALTO por CE+RAEE+(pilas) |
| Setup gamer pasivo (alfombrillas, soportes, organizadores de cables) | - | Solo GPSR probablemente; NO VERIFICADO | BAJO-MEDIO |
| Textil | Ver 6 | Seguridad de ropa infantil (cordones, etc.): fuera de alcance, y el cerebro excluye juguetes | BAJO-MEDIO |

Regla del cerebro vigente: electrónica con batería sin CE queda excluida. La ronda no la levanta.
Quién lo hace: el agente puede clasificar un producto concreto y listar qué documentos pedir al proveedor (declaración de conformidad, informe de ensayo). Solo la persona o el proveedor consigue y firma la documentación; ensayos de laboratorio, coste NO VERIFICADO.

## 6. Etiquetado textil

- Reglamento (UE) nº 1007/2011 (denominaciones de fibras y etiquetado de composición), DO L 272 de 18/10/2011; consolidada 15/02/2018 (EUR-Lex, WIPO Lex, consulta 2026-10-27).
- Artículo sobre idioma: NO encontrado. Según conocimiento general (NO verificado) debe ser comprensible para el consumidor del país de venta; comprobar si en España se exige castellano.
- Impacto en TikTok Shop: composición en la ficha y etiqueta en la prenda. Etiqueta de cuidados/nombre del fabricante o importador: NO VERIFICADO.
Riesgo: BAJO-MEDIO si el POD o el proveedor etiqueta correctamente. Quién lo hace: el proveedor POD etiqueta; el agente verifica que la ficha coincida.

## 7. RAEE y pilas (solo si hay electrónica)

- RAEE: el productor, incluido quien vende a distancia en España, debe inscribirse en la sección RAEE del Registro Integrado Industrial (RII-AEE), y antes tener un sistema de responsabilidad ampliada (individual o colectivo; el colectivo gestiona trámites y declaraciones trimestrales). Fuente: MITECO, Industria (guía 07/2024), Rhenus, consulta 2026-10-27. Amplió categorías el 15/8/2018.
- Costes del sistema colectivo y plazos de inscripción: NO VERIFICADO.
- Pilas y baterías: Reglamento (UE) 2023/1542. En España el desarrollo está en proyecto de Real Decreto (PwC, junio 2026): quien comercializa por primera vez pilas o baterías es productor y debe inscribirse en una nueva sección del Registro de Productos; el número de registro debe constar en facturas; las plataformas deberían comprobar la inscripción. Una fuente comercial (Eldris) dice que es independiente del RAEE. Estado del Real Decreto: NO VERIFICADO.
Riesgo: ALTO si hay electrónica. Esto refuerza mantener la exclusión de electrónica en el primer año.
Quién lo hace: solo la persona (inscripción con su alta/certificado); el agente prepara la lista de datos.

## 8. Registro de marca

| Vía | Coste oficial | Fuente y fecha | Estado |
|---|---|---|---|
| EUIPO (marca UE), solicitud online | 850 € primera clase, 50 € segunda, 150 € por cada clase desde la tercera (papel ~1.000 €) | Oficina de Patentes de Austria, Harlander, Trama TM, Thaon, consulta 2026-10-27 | Cifras coherentes entre fuentes; confirmar en calculadora EUIPO |
| EUIPO, Fondo PYME 2026 | Reembolso del 75 % de tasas de marca (convocatoria desde el 2/2/2026) | Trama TM, consulta 2026-10-27 | A verificar: puede estar agotado en octubre; requisitos NO VERIFICADOS |
| OEPM (marca nacional), telemática | 125,36 € primera clase + 81,21 € por clase adicional (papel ~150,45 €) | Cohen y Aguirre (despacho), consulta 2026-10-27 | NO oficial; contrastar en tabla OEPM |
| Honorarios de abogado/agente | no encontrados | - | NO VERIFICADO |
| Plazo de concesión | no encontrado | - | NO VERIFICADO |

Notas: antes de pagar, buscar anterioridades en TMview/OEPM (el agente puede hacer una búsqueda previa, no sustituye a un abogado). Las clases relevantes son Niza 25 (ropa), 9 y 12 u otras según producto: NO VERIFICADO, a confirmar. La marca propia debe evitar nombres que recuerden a GTA, Rockstar, etc. (regla del cerebro).
Quién lo hace: la persona paga y firma; el agente puede preparar candidatos de nombre y la búsqueda previa.

## 9. TikTok Shop ES: vendedor, marca propia, almacén y comisión

Fuentes: blogs de terceros (SendPulse, Marketing4eCommerce, Echotik, BigSeller, Lengow, Eurofiscalis, Ship24, ChannelX), consulta 2026-10-27. No se ha leído Seller Center.

- Comisión: del 5 % al 9 % desde el 8/1/2026 en ES, DE, FR, IT, IE (Marketing4eCommerce). Varía según categoría y la base incluye gastos de envío y descuento asumido por TikTok, menos reembolsos. El 4 % de 60 días para tienda nueva (regla del cerebro) NO se ha podido confirmar en esta ronda.
- Requisitos de alta: cuenta de TikTok Business, documentos fiscales (NIF/CIF) y verificación de identidad; una guía exige residencia legal y dirección verificable en España. Otra guía lista: negocio registrado, representante legal local, stock en la UE y despacho rápido (Lengow; puede estar desactualizado). Cuenta individual frente a corporativa: marcas premium restringidas exigen cuenta corporativa (BigSeller).
- Marca propia: la calificación de marca tiene niveles (titular de la marca, distribuidor exclusivo nacional, revendedores). Para titular se pide prueba de marca (registro). Causas de rechazo: entidades legales no coincidentes, cartas de autorización incompletas, facturas poco claras, documentos caducados (Echotik, BigSeller). La marca propia en trámite en EUIPO/OEPM: si TikTok acepta la solicitud en curso, NO VERIFICADO.
- Categorías restringidas ES: no se ha encontrado lista de ES (la fuente de México cita alimentos, juguetes, productos médicos). NO VERIFICADO; leer en Seller Center. Las exclusiones del cerebro ya son más estrictas.
- Entrega: plazo máximo para enviar 5 días hábiles según una guía (SendPulse/ShippyPro), frente a la regla del cerebro de 2 días laborables con seguimiento. NO VERIFICADO cuál manda; comprobar en Seller Center.
- Almacén: Fulfilled by TikTok (FBT) guarda stock en ES, DE y NL (Eurofiscalis, 2026); solicitud en Seller Center; un almacén en otro país genera obligaciones de IVA allí. Alternativa: envío por el vendedor o 3PL. Coste de FBT: NO VERIFICADO.
- Sell Across EU: ChannelX (septiembre 2026) dice que se lanza el 19/10/2026 y permite listar en varios mercados incluida España; elegibilidad según estado y rendimiento de la cuenta. Detalles NO VERIFICADOS.
- Afiliados: desde el 27/5/2026 los creadores europeos pueden añadir productos de afiliado; comisión se paga 15 días después de la entrega (SendPulse/otra guía). Relevante para el plan de microcreadores.

Quién lo hace: SOLO la persona (alta de vendedor, subir documentos, aceptar términos, leer Seller Center). El agente solo prepara fichas y checklist.

## 10. POD y mayorista UE

- POD: Gelato anuncia 140+ socios de producción en 32 países y producción local en España; su integración con TikTok Shop figura para EE. UU. y Reino Unido; ES NO VERIFICADO. Printful: según una comparativa de terceros (Marketing4eCommerce, 2026) produce sobre todo en propias instalaciones, con un centro en Barcelona, e integra con TikTok Shop; la tabla es ambigua, NO VERIFICADO. Printify: marketplace de proveedores con precio base más bajo.
- Precios base, plazos de producción y de entrega: NO VERIFICADO. No hay margen calculable sin ellos (usar solo `margen_es.py`).
- Ventaja de cumplimiento: POD con producción UE reduce aduanas/IOSS/DUA. Marca propia en POD sigue necesitando GPSR (responsable UE en la etiqueta/ficha) y etiquetado textil.
- Mayorista UE (BigBuy, otros): cuentas bloqueadas desde la nube en rondas previas; precios, condiciones y devoluciones NO VERIFICADOS. Hay que comprobar que el mayorista dé factura, datos del fabricante, y no venda marcas ajenas.

## 11. Pasos en orden, con coste y tiempo (solo lo que tiene fuente)

| # | Paso | Escenario | Coste verificado | Tiempo | Quién |
|---|---|---|---|---|---|
| 0 | Decidir capital y qué es "500 €/mes" (pendiente desde estado.md) | ambos | - | - | Persona |
| 1 | Leer Seller Center: origen admitido, categorías restringidas, entrega 2 vs 5 días, comisión real, FBT, calificación de marca | ambos | 0 € | NO VERIFICADO | Persona (agente prepara preguntas) |
| 2 | Alta de autónomo con tarifa plana (o SL); gestoría | ambos | cuota ~88,64 € (80 € nominales), 12 meses; gestoría NO VERIFICADO | NO VERIFICADO | Persona |
| 3 | Elegir epígrafe IAE y régimen de IVA con la gestoría | ambos | NO VERIFICADO | NO VERIFICADO | Persona + gestoría |
| 4 | Alta en TikTok Shop como vendedor (NIF, identidad, dirección en España) | ambos | 0 € verificado (sin cuota de alta localizada) | NO VERIFICADO | Persona |
| 5 | Definir responsable UE (GPSR) y datos del fabricante | ambos | NO VERIFICADO | NO VERIFICADO | Persona decide; agente redacta |
| 6 | Búsqueda previa y registro de marca (EUIPO u OEPM) | (1) y marca propia en (2) | EUIPO 850 € (1 clase) / OEPM ~125 € (1 clase, no oficial); posible reembolso 75 % Fondo PYME | NO VERIFICADO | Persona paga; agente prepara |
| 7 | Brand Qualification en TikTok Shop con la marca | marca propia | NO VERIFICADO | NO VERIFICADO | Persona |
| 8 | EORI y, si importa stock, agente de aduanas / DUA; IOSS si vende envíos <= 150 € desde fuera de la UE | (1) | EORI, IOSS: sin coste localizado; agente: NO VERIFICADO; derecho 3 € por envío/línea (a verificar) | NO VERIFICADO | Persona |
| 9 | Si hay electrónica o pilas: RII-AEE, sistema de responsabilidad ampliada, registro de pilas | solo electrónica | NO VERIFICADO | NO VERIFICADO | Persona |
| 10 | Documentación CE (declaración de conformidad, ensayos) por producto | solo producto sujeto | NO VERIFICADO | NO VERIFICADO | Proveedor + persona |
| 11 | Etiquetado (GPSR, textil), fichas, vídeos IA con etiqueta | ambos | 0 € | - | Agentes redactan; persona aprueba |
| 12 | Elegir almacén: propio, 3PL o FBT; pedido piloto pequeño | (1) | NO VERIFICADO | NO VERIFICADO | Persona |

## 12. Qué puede y qué no puede el agente

Los agentes pueden: preparar preguntas para gestoría y Seller Center, clasificar cada producto por regla (CE/RAEE/pilas/textil), redactar fichas y etiquetas con datos que dé la persona, buscar anterioridades de marca, recalcular márgenes con `margen_es.py` cuando haya costes y aranceles verificados, y mantener esta checklist.
Solo la persona: alta fiscal, certificado digital, firmas, pagos de tasas, alta y verificación en TikTok Shop, EORI/IOSS, contratar responsable UE, agente de aduanas y gestoría, aceptar términos y cualquier gasto.

## 13. Mapa de riesgo

| Tema | Riesgo | Falta comprobar |
|---|---|---|
| Alta fiscal sin hacer | ALTO (bloquea todo) | epígrafe, costes, plazo |
| GPSR / responsable UE | ALTO | quién puede serlo, coste, datos obligatorios en etiqueta |
| Fin franquicia 150 € / derecho 3 € | ALTO para márgenes | base de cálculo (línea/artículo/categoría), quién lo paga |
| CE electrónica + RAEE + pilas | ALTO | directivas aplicables y costes de ensayo; estado del Real Decreto de pilas |
| Iluminación LED coche | ALTO | homologación ECE |
| Marca propia en TikTok | MEDIO | si acepta marca en trámite; documentos exigidos |
| Registro de marca | MEDIO | anterioridades; clases; honorarios |
| Etiquetado textil | BAJO-MEDIO | idioma exigido |
| Comisión | MEDIO | 9 % vs 4 % nueva tienda; categoría |
| POD / mayorista | MEDIO | integración con TikTok ES, precios, plazos |

## Datos clave

| Producto | ID/URL | Coste € | PVP € (probado o propuesto) | Fuente del precio de mercado y fecha | Verificado (listado/ficha/persona) | Margen/pedido y supuestos | Veredicto |
|---|---|---|---|---|---|---|---|
| Revisión de requisitos de escalado (sin producto concreto) | no aplica | no verificado | no verificado | no aplica; costes legales de 2026-10-27, ver secciones 2 a 9 | no verificado en fuente oficial (todo búsqueda secundaria, ninguna ficha ni Seller Center ni persona) | no calculado; margen_es.py no incluye el derecho de 3 € | Sin GO: informe de requisitos. Alta fiscal y GPSR son condición previa para cualquier escenario |

- **Qué sabemos** (con fuente y fecha): derecho aduanero fijo de 3 € desde 1/7/2026 y fin de la franquicia de 150 € (AduanaNews, LexisNexis, BDO, 2026-10-27); GPSR aplicable desde 13/12/2024 con responsable UE obligatorio (Baker McKenzie, 2026-10-27); EUIPO 850/50/150 € (Austria Patentamt y otros, 2026-10-27); tarifa plana ~88,64 € 12 meses (Quipu, Billin, 2026-10-27); comisión 9 % desde 8/1/2026 (Marketing4eCommerce, 2026-10-27); EORI + DUA obligatorios para importar (infoautonomos, 2026-10-27).
- **Qué asumimos** (y cómo se comprobaría): que las fuentes secundarias reflejan la norma vigente (comprobar en DOUE, AEAT, BOE, EUIPO, OEPM y Seller Center); que el 4 % de nueva tienda sigue vigente (Seller Center); que Printful/Gelato permiten TikTok Shop ES (web del proveedor); que textil y pasivos solo necesitan GPSR (norma por producto).
- **Qué cambiaría mi conclusión:** que la base del derecho de 3 € sea por artículo (encarece packs); que TikTok Shop ES acepte vendedores sin responsable UE propio o con marca en trámite; que el Real Decreto de pilas se apruebe con plazos cortos; que el Seller Center exija stock en la UE para listar (apoyaría POD/3PL en UE frente a envíos desde China).
