# Decisión del CEO, ronda 12 (giro de método) - 27/10/2026

Autor: ceo-estratega. Base: `cerebro/estado.md`, `aprendizajes.md`, `proceso.md`, `okrs.md`, `hipotesis.md`, `decisiones.md`, `ronda-12/CONTEXTO.md`, los seis informes de `ronda-12/`, `ronda-12/critica/pre-mortem.md` y `calidad/ronda-12-puerta-1.md`. No he lanzado búsquedas nuevas ni recalculado: uso las cifras ya recalculadas por calidad y crítico con `margen_es.py` (27/10/2026). Todo lo de abajo que no tenga fuente es juicio mío y va marcado como tal. No se toca CLAUDE.md ni el cerebro: solo propuesta.

## 1. Decisión y razón (3 líneas)

**Decisión: ninguna ruta pasa la puerta 1 hoy. NO se compromete capital (ni 2.000 ni 5.000 €) en esta ronda. Se aprueba una ruta de "demanda primero" de 30 días con tope de 30 € que prueba, por orden de coste, tres vías de demanda real (B2B, preventa/lista de espera, curación/afiliación) y deja la marca propia con 3PL como destino condicionado ("SOLO SI" las 5 condiciones del crítico).**

Razón:
1. **Lo que bloquea no es el método de búsqueda, es que nadie ha leído el canal.** 12 rondas, 0 € gastados, 0 vídeos, 0 precios leídos en TikTok Shop ES (pre-mortem §0; `estado.md`). Cambiar de modelo a uno que exige 3.000-4.000 € de caja (modelo B, `modelos-y-escalas.md`) sin bajar esa incertidumbre es huida hacia delante. Estoy de acuerdo con el crítico.
2. **Ningún modelo grande tiene un solo dato medido.** El "GO 33 %" de marca propia + 3PL sale de asumir PVP 39,90 €: con el mismo script, un dropshipping a 39,90 € da +10,95 € y B da +10,88 € (pre-mortem §3.1). La ventaja es el ticket, no la marca. Y el único dato de canal que tenemos (FastMoss abril 2026, ES, 30 días) dice que en TikTok Shop ES vende ropa y belleza a 4-14 €, sin gaming, coche ni hogar en el top 5 (`metodo-busqueda.md`; dato de blog de herramienta, no verificado en TikTok Shop).
3. **La persona sí quiere un proyecto grande, y eso se respeta construyéndolo por puertas, no por fe.** La marca de nicho (gamers/coches/streetwear) sigue siendo el destino; pero cada euro de stock se libera solo tras demanda demostrada (reservas pagadas, presupuestos B2B aceptados o ventas atribuidas). Es la única forma de que "grande" no signifique "1.800-2.250 € de stock sin rotar" (causa A2 del pre-mortem, 55 %, juicio del crítico).

Criterios de `proceso.md` aplicados: puerta 1 (ancla de precio leída, proveedor con doble comprobación, la persona ha abierto la ficha, pre-mortem, normativa): ninguna ruta cumple ni el primer punto. Stop-loss (pérdida acumulada > 150 €): no se alcanza porque no hay gasto, y se mantiene. Orden de pivote (ángulo, precio/pack, proveedor, producto, canal): con 11 rondas de producto ya estamos en "otro canal/modelo", justificado, pero el cambio solo vale si se acompaña de la lectura del canal.

## 2. Decisión por ruta

| Ruta | Decisión | Razón con dato | Qué haría cambiar de opinión |
|---|---|---|---|
| Marca propia + 3PL (A) | **AGUANTAR sin presupuesto.** Hipótesis nº 1 de largo plazo. Pasa a "SOLO SI" cuando se cumplan las 5 condiciones (abajo) | Pre-mortem: A1 calendario (65 %), A2 PVP inexistente (55 %), A3 persona no ejecuta (50 %), probabilidades de juicio del crítico. Cifras no cotizadas (coste 5 / 9 / 1,70-3,40 USD según informe). Se pierde Black Friday (27/11/2026) con cualquier stock | Las 5 condiciones (sección 4, puerta M2) |
| POD de marca (B) | **CERRAR como motor con anuncios** en esta ronda. Reabrir solo con dato nuevo escrito | `margen_es.py` (crítico, 27/10/2026): camiseta 34,90 € coste 12,50 = +4,53 €/pedido; con afiliado 15 % = +0,85 €; a 14,90 € = -7,86 €. Plazo POD 3 días contra regla de 2 (NO-GO del script). `modelos-y-escalas.md` ya dice PARAR; `modelos-alternativos.md` (que decía "escala mejor") fue rechazado por calidad | Seller Center confirma que admite POD y plazo ampliado (o 5 días hábiles) y se lee un PVP >= 30 € con ventas visibles en ES |
| Drops con preventa (canal propio) | **GO a PRUEBA (no a inversión), tope 30 €, 14 días** | Elimina A1/A2: no se compra stock sin pedidos pagados; no depende de la regla de 2 días ni del origen. Sin precedentes en el proyecto (nunca probada) | Éxito: >= 10 reservas con pago (o >= 40 con depósito simbólico) a >= 25 €. Fracaso: menos, tras un único ajuste de diseño/precio |
| B2B merchandising (clubes eSports, tuning, detailing, gaming cafés) | **GO a PRUEBA, 0 €, 7 días** | Ticket por pedido 300-2.000 € y anticipo 30-50 % son supuestos del crítico (no verificados). Los seis informes solo miraban consumidor final. Útil aunque falle TikTok: da diseños y prueba social | Éxito: >= 2 respuestas pidiendo presupuesto y >= 1 aceptación de rango de precio entre 15 contactos. Sin alta fiscal solo mide interés |
| Curación/afiliación en TikTok Shop | **GO a PRUEBA, 0 €, 21 días, condicionada** | 87 % del GMV del top 50 ES viene de afiliados (Que.es, 13/06/2026, vía resumen); comisión 8-10 % ropa, 8 % accesorios (Beancount, 25/07/2026, resumen). Da el dato de canal que más falta (precio, ventas, CTR reales). Requisito de ~2.000 seguidores: no verificado | Éxito: 1 venta atribuida y >= 1 vídeo > 5.000 vistas. Si el programa no admite la cuenta, se anula sin coste |
| Seguir con dropshipping simple | **CERRAR como motor de anuncios.** Ventosa B2 (1005013071285711, 5,89 €): AGUANTAR congelada, sin presupuesto, solo como dato de las acciones de lectura | A con comisión 9 % y devolución 15 %: +2,65 €/pedido (HOLD, supuesto); pierde con CPA realista 5-12 € (`modelos-y-escalas.md`); ventosa +3,05 €/pedido sin anuncios y pierde con CPA 8 € (`estado.md`, 26/10/2026). El derecho de 3 € por envío (desde 1/07/2026, no verificado) empeora cualquier origen China y no está en `margen_es.py` | CPA real medido < 5 € en cualquier prueba, o catálogo CSV BigBuy/CJ con producto que cumpla coste <= 0,62 x P - 4,3 € con P leído |
| Pausar | **Rama por defecto si la persona no responde el 02/11/2026** (ya decidido en `estado.md`) | Sin las 3 acciones de lectura y las 5 respuestas, ningún agente puede avanzar a nada medible | La respuesta de la persona |
| Digital (pack, D) | **No lo recomiendo como motor.** Opción de la persona | Mejor caja en el modelo (13,48 €/venta, 288 € de caja a etapa 1.000) pero es un modelo de otro canal (web propia, comisión 0 % + 6 % pagos), sin conversión ni CPA, y vender digital en TikTok Shop está sin verificar. Calidad pidió presentarlo como opción, no recomendación | Seller Center admite digital |

## 3. Coherencia que compruebo

- **Presupuesto de 500 €/mes:** la ruta gasta como máximo 30 € en 30 días. Cabe de sobra. El levantamiento de "sin stock" y "500 €/mes" en CONTEXTO.md es solo para investigar; esta decisión no lo extiende: cualquier gasto por encima de 30 € exige puerta M2 y respuesta de la persona.
- **Contradicciones entre rondas:** (a) esta decisión sustituye el "congelado" de la línea "envío desde España + utilidad" de la ronda 11 por CERRAR como motor, con el dato nuevo de la ronda 12 (margen y derecho de 3 €); no es un cambio sin dato. (b) La ventosa B2 sigue AGUANTAR como en la ronda 11. (c) La revisión del 02/11/2026 se mantiene.
- **Informes pendientes de corrección** (calidad los rechazó o condicionó): `marca-propia.md` y `modelos-alternativos.md` (RECHAZADOS) no pueden citarse como evidencia; `metodo-busqueda.md` y `modelos-y-escalas.md` solo con sus correcciones. Mi decisión no se apoya en las cifras de los dos rechazados.
- **Cada decisión va a `cerebro/decisiones.md`:** ver propuesta de entrada en la sección 7 (la escribe el curador cuando la persona acepte).
- **Qué se deja de hacer esta semana:** rondas de búsqueda de producto sin lectura de TikTok Shop ES; nuevas matrices SÍ/NO; recalcular márgenes de producto concreto; hablar de proveedores (BigBuy, CJ, Printful...) sin catálogo ni plazo verificado.

## 4. Ruta recomendada: "Demanda primero" - plan de 30 días (27/10 a 26/11/2026)

**Objetivo de la semana (27/10-02/11):** que la persona entregue los datos de canal y las 5 decisiones. **Prioridades máximas 3:** (1) lectura de TikTok Shop ES y Seller Center; (2) las 5 decisiones de la sección 6; (3) agentes preparan, sin gasto, las tres pruebas (maquetas, mensajes B2B, hoja de lectura).

**Presupuesto tope de los 30 días: 30 € (juicio mío, por analogía con el tope de la prueba orgánica de `backlog.md`; lo confirma `cfo-finanzas`).** Dentro: herramientas gratuitas de landing/lista de espera (0 €), vídeos IA, algún formulario. Fuera del tope, decisión aparte de la persona: alta de autónomo (tarifa plana ~88,64 €/mes según blogs, no verificado, verificar en Seguridad Social) y gestoría (no encontrada). Sin alta no se cobra: antes del alta solo vale lista de espera sin pago (señal más débil).

| Etapa | Fechas | Qué se hace | Quién | Gasto | Puerta de salida |
|---|---|---|---|---|---|
| 0. Datos y decisiones | 27/10-02/11 | 3 acciones de lectura (2-3 h): precio y ventas de 4 búsquedas en TikTok Shop ES (alfombrilla gaming XXL, calcetines diseño, camiseta gamer, organizador maletero), con >= 5 resultados cada una; Seller Center (origen admitido para stock propio, plazo 2 o 5 días hábiles, POD, marca en trámite, comisión de tienda nueva, digital); respuestas a las 5 preguntas. Agentes: ver sección 8 | Persona + agentes | 0 € | **Puerta M0 el 02/11:** respuestas recibidas y lectura hecha. Si no, PAUSAR |
| 1. Elegir un solo nicho y arrancar B2B | 03/11-09/11 | Elegir UN público y UN gancho (hoy hay mezcla desk mat/calcetines/camisetas/organizadores; pre-mortem §3.11). Decidir alta fiscal. Enviar 15 mensajes a clubes/tiendas con 2 maquetas etiquetadas y un rango de precio "por cotizar" (no inventado). Crear cuenta gratuita BigBuy y CJ y descargar catálogo CSV si el acceso lo permite; pasar por `filtrar_catalogo.py` y `margen_es.py` | Persona envía y crea cuentas; agentes preparan | 0 € | **Puerta M1 el 09/11:** hay ancla de precio leída para el nicho elegido (>= 3 fichas con PVP >= 25 € y >= 500 ventas) Y Seller Center no bloquea stock propio/plazo. Si falla: la marca propia en TikTok Shop como canal consumidor se archiva; sigue solo B2B y canal propio |
| 2. Preventa y afiliación | 10/11-23/11 | 5 vídeos IA etiquetados ("Contenido generado por IA") sobre UNA maqueta etiquetada como tal, con lista de espera y precio visible; publicar 10 vídeos de curación de 3 productos de la categoría objetivo si el programa de creadores admite la cuenta; seguimiento B2B. Cobro de reservas solo si el alta está hecha. Derechos de consumo de la preventa (plazos de entrega prometidos, desistimiento): no verificado, lo revisa `revisor-normativa-ue` antes de publicar | Agentes producen; persona publica | <= 30 € | Medición a los 14 días de publicar |
| 3. Puerta M2 | 24/11-26/11 | Medición, pre-mortem, auditor, decisión escrita. Sin avance al siguiente nivel si faltan datos | ceo, crítico, auditor, cfo | 0 € | Decisión el 26/11 (día antes del Black Friday 27/11, que esta ruta no aprovecha: asumido) |

**Criterios de parada (se aplican sin discusión):**
- 02/11/2026 sin respuesta de la persona: PAUSAR todo (ya escrito en `estado.md`).
- Etapa 1: menos de 3 fichas a >= 25 € con >= 500 ventas, o Seller Center no admite stock propio con plazo viable: se cierra marca propia en TikTok Shop como canal consumidor.
- B2B: menos de 2 respuestas de 15 contactos: un solo ajuste de maqueta/mensaje a otros 15; si repite, CERRAR B2B.
- Preventa: menos de 10 reservas pagadas (o 40 con depósito) en 14 días: un ajuste de diseño o precio; si repite, CERRAR el producto y no comprar stock.
- Afiliación: sin 1 venta atribuida ni vídeo > 5.000 vistas en 21 días: PARAR.
- Gasto acumulado > 30 € sin nueva respuesta de la persona: PARAR.
- Persona con menos de 3 h/semana: PAUSAR (la ruta es más trabajo, no menos; pre-mortem A3).
- Cualquier vídeo con marca ajena, estilo del juego o claim no demostrable: se retira (reglas de CLAUDE.md).

**Puerta M2 (condiciones "SOLO SI" de la marca propia + 3PL, tomadas del crítico):**
(a) hoja TikTok Shop ES con >= 3 fichas de PVP >= 25 € y >= 500 ventas; (b) Seller Center admite el origen y el plazo; (c) 2 cotizaciones reales con coste puesto en España <= 40 % del PVP leído (incluye derechos, flete e IVA de importación; hoy no están en `margen_es.py`); (d) alta fiscal hecha o decidida; (e) la persona confirma el capital. **Añado (f):** demanda propia demostrada (>= 10 reservas pagadas, o un pedido B2B aceptado con anticipo). Con las 6, el primer lote sería de UN producto, MOQ mínimo y tope fijado por `cfo-finanzas` (no antes de la respuesta a la pregunta 1).

## 5. Qué cambia en CLAUDE.md y cerebro si la persona acepta (propuesta, sin tocar)

**CLAUDE.md, sección Objetivo (texto propuesto):** "Construir una marca de nicho (público único, por elegir entre gamers, coches o streetwear, sin usar marcas ajenas) con demanda demostrada antes de comprar stock. Vía de pruebas de 30 días: B2B, preventa/lista de espera y curación; dropshipping simple solo como dato. Capital: tope de 30 € en la fase de pruebas; stock solo tras la puerta M2 y con el tope que fije la persona."
**Reglas que se modificarían (cada una solo si la persona dice sí en las preguntas):**
- "Sin stock propio": pasa a "sin stock hasta la puerta M2" (pregunta 5a).
- "Sin comprar muestras": pasa a "una muestra de pre-producción <= 60 € solo tras >= 10 reservas pagadas" (pregunta 5b). La cifra de 30-60 € viene de `marca-propia.md` (rechazado, no verificado).
- "500 €/mes": se redefine según pregunta 2.
- "Mes 1 sin anuncios; mes 2 GMV Max": se mantiene; GMV Max solo en vídeos que ya venden.
- Se mantienen sin cambios: etiqueta IA, categorías excluidas, marcas ajenas, 9 % de comisión (4 % bonus), regla de 2 días hasta que Seller Center diga otra cosa.

**Cerebro:**
- `estado.md`: objetivo nuevo, línea "ronda 12: ninguna ruta pasa; ruta demanda primero", próximo paso = las 3 acciones + 5 respuestas, revisión 02/11.
- `decisiones.md`: entrada del 27/10 (propuesta abajo).
- `okrs.md`: nuevo objetivo del trimestre: "demostrar demanda propia antes de comprar stock". KR1 hoja de canal leída (hoy 0); KR2 >= 10 reservas pagadas o 1 pedido B2B con anticipo (0); KR3 puerta M2 decidida el 26/11 (no hecha); KR4 alta fiscal decidida (sin empezar). Los KR de producto/piloto de 15-25 vídeos se archivan hasta que haya producto.
- `hipotesis.md`: añadir H10 (B2B: >= 2 de 15 piden presupuesto), H11 (preventa: >= 10 reservas pagadas a >= 25 €), H12 (afiliación admitida y 1 venta atribuida en 21 días), H13 (TikTok Shop ES paga >= 25 € por objeto de identidad con >= 500 ventas; ya cubierta en parte por H7), H14 (Seller Center admite stock propio con plazo viable; amplía H8).
- `proceso.md`: añadir una puerta M ("marca") con M0/M1/M2 de arriba y sus criterios de parada; mantener las puertas de producto para el dropshipping residual.
- `aprendizajes.md`: nuevos: "no cambiar de modelo sin leer antes el canal"; "una matriz SÍ/NO sobre supuestos no es un resultado"; "tabla única de supuestos antes de comparar rutas"; "el cuello de botella es la ejecución de la persona".
- `productos.md`: anotar la ventosa B2 como congelada y los candidatos de `metodo-busqueda.md` como no puntuados.
- `backlog.md`, `kpis.md` (reservas, respuestas B2B, ventas atribuidas), `riesgos.md` (ver sección 9).
- Agentes: no se crean nuevos; se reasignan (sección 8).

**Entrada propuesta para `decisiones.md`:** "2026-10-27 - Ronda 12: ninguna ruta pasa la puerta 1. NO a comprometer 2.000-5.000 €. Marca propia + 3PL = AGUANTAR sin presupuesto (SOLO SI a-f); POD de marca y dropshipping simple = CERRAR como motor de anuncios; B2B, preventa y curación = pruebas de <= 30 € y 30 días. Revisión 02/11 y puerta M2 el 26/11. Detalle: `tienda/trabajo/ronda-12/decision-ceo.md`."

## 6. Preguntas que SOLO la persona puede responder (cerradas, con mi recomendación)

Responder con la letra. Plazo: 02/11/2026.

**Pregunta 0. ¿Haces la lectura de canal de 2-3 h (4 búsquedas en TikTok Shop ES + Seller Center) antes del 02/11?**
A) Sí. B) No. **Recomiendo A.** Sin ella ninguna ruta pasa de HOLD (pre-mortem §6) y es la prueba más barata de toda la ronda.

**Pregunta 1. Capital real: ¿cuánto dinero podrías perder en los próximos 90 días sin que te perjudique?**
A) Hasta 100 €. B) 100-500 €. C) 500-2.000 €. D) 2.000-5.000 €. E) Más de 5.000 €.
**Recomiendo que respondas lo que sea cierto, y que hasta la puerta M2 el tope sea 30 € igualmente.** Si tu respuesta es A o B, la marca propia con stock en 3PL no es viable (el modelo B necesita 3.157 € de caja en etapa 1.000; calidad corrigió que ni con MOQ 100 cabe en 2.000 €), y la ruta se queda en B2B + preventa + curación.

**Pregunta 2. ¿Qué son los "500 €/mes"?**
A) Tope de gasto en anuncios al mes. B) Tope de gasto total al mes (anuncios, herramientas y gestoría). C) Beneficio mensual que quieres. D) Capital total de riesgo para toda la fase de pruebas (90 días), no mensual.
**Recomiendo D**, y que el tope de 30 € del plan quede dentro. Es el único sentido que no contradice la fase de pruebas sin anuncios del mes 1.

**Pregunta 3. ¿Cuántas horas por semana puedes dedicar con constancia?**
A) Menos de 3. B) 3-6. C) 6-10. D) Más de 10.
**Recomiendo C como mínimo.** Con A se pausa (criterio de parada). Con B solo se corre la prueba B2B + lectura, sin preventa.

**Pregunta 4. Alta fiscal (autónomo) y gestoría.**
A) Ya estoy dado de alta. B) La hago antes del 10/11/2026. C) No puedo o no quiero darme de alta. D) No lo sé; necesito hablar con una gestoría.
**Recomiendo B (o A).** Sin alta no se puede cobrar una reserva, facturar a un club ni registrar la marca; con C solo queda la lista de espera sin pago (señal débil) y se descarta B2B como negocio. Tarifa plana y costes: no verificados.

**Pregunta 5a. ¿Levantas "sin stock propio"?**
A) No, se mantiene siempre. B) Sí, pero solo tras la puerta M2 (demanda demostrada) y con el tope que yo fije. C) Sí, ya, para empezar a comprar.
**Recomiendo B.** C repite el riesgo A2 (stock sin rotar) sin dato.

**Pregunta 5b. ¿Levantas "sin comprar muestras"?**
A) No: solo maquetas etiquetadas como tales. B) Sí, una muestra de pre-producción de hasta 60 € solo tras >= 10 reservas pagadas. C) Sí, ya.
**Recomiendo B.** Hasta entonces no hay prenda real que enseñar y los vídeos solo pueden ser maqueta etiquetada.

## 7. Qué pido a cada rol (ver también sección 8)

- Persona: preguntas 0 a 5b; lectura de canal; enviar los 15 mensajes B2B; crear cuentas BigBuy/CJ y descargar CSV si es gratis; publicar los vídeos.
- `cfo-finanzas`: tope de 30 €, tabla única de supuestos (9 % base, 4 % bonus 60 días, devoluciones 15 %, afiliado 0 y 15 %, CPA 5/8/12 €), parámetro de derechos/flete/IVA de importación para `margen_es.py` (propuesta, no se toca sin visto bueno del CEO).
- `analista-escalado`: rehacer la matriz como "cabe la caja" (no "gana dinero"), corregir la afirmación del MOQ 100 en 2.000 € y el contraste circular con `escalado.py`.
- `auditor-calidad`: no aceptar como evidencia `marca-propia.md` ni `modelos-alternativos.md` hasta su reescritura; verificar las correcciones de los otros cuatro.
- `critico-escepticismo`: pre-mortem de la puerta M1 y M2.
- `pmo-operaciones`: calendario de 30 días en `backlog.md`.

## 8. Tareas que los agentes pueden hacer YA con 0 € (lotes <= 10; el director las lanza; no esperan a la persona)

| # | Rol | Tarea | Entregable |
|---|---|---|---|
| 1 | `buscador-producto` + `investigador-tendencias` | Hoja plantilla de lectura de TikTok Shop ES (4 búsquedas x 5 resultados: PVP, ventas visibles, vendedores, reseñas, URL, fecha) y propuesta de UN público y UN gancho con los 9 criterios/40 (sin marcas, sin estética de GTA/Vice City) | `ronda-13/producto/hoja-canal.md` (o la carpeta que decida el director) |
| 2 | `operaciones-cumplimiento` + `revisor-normativa-ue` | Lista cerrada de preguntas para Seller Center (origen de stock propio, plazo 2 contra 5 días hábiles, POD, brand qualification, comisión nueva tienda, digital, programa de creadores) y para la gestoría; normativa de preventa y desistimiento (marcada como no verificado hasta fuente oficial) | `cumplimiento/preguntas-seller-center.md` |
| 3 | `cfo-finanzas` | Tabla única de supuestos y tope de 30 €; propuesta de parámetro de derechos para `margen_es.py` | `margenes/supuestos.md` |
| 4 | `analista-escalado` | Corregir `modelos-y-escalas.md` según calidad (4 puntos) y añadir escenario "preventa con reserva" | `escalado/modelos-y-escalas.md` (v2) |
| 5 | `creativos-ia` + `guionista-videos` | Guion de 5 vídeos de preventa y 10 de curación, con etiqueta IA y maqueta etiquetada; sin claims. Aviso: esperar a que la hoja 1 fije nicho | `marketing/guiones.md` |
| 6 | `buscador-creadores` + `redactor-briefs` | Lista de 40 clubes eSports, tiendas de tuning/detailing y gaming cafés con contacto público (WebSearch); 2 mensajes de contacto y brief de maqueta. Sin precios inventados: "rango por cotizar" | `marketing/b2b-lista.md` |
| 7 | `buscador-proveedores` | Borradores de petición de cotización (fabricante de textil/accesorio no eléctrico en UE o Alibaba, y 3 3PL en España): incluir MOQ, plazo, coste puesto en España con derechos, tarifas de 3PL. La persona los envía | `producto/peticiones-cotizacion.md` |
| 8 | `buscador-creadores` | Requisitos del programa de afiliados/creadores de TikTok Shop ES (seguidores, fechas), con fuente oficial si WebSearch la da | `marketing/afiliacion-requisitos.md` |
| 9 | `auditor-calidad` | Aplicar la lista de correcciones de `calidad/ronda-12-puerta-1.md` y marcar el estado de cada informe | `calidad/ronda-12-correcciones.md` |
| 10 | `pmo-operaciones` + `curador-cerebro` | Calendario del plan y, cuando la persona acepte, aplicar la sección 5 | `backlog.md`, cerebro |

Regla de coste: todo lo anterior es 0 € (WebSearch, scripts locales). Tarea de la persona de 15 min: cuentas gratuitas BigBuy y CJ y descarga de catálogo; los agentes pasan el CSV por `filtrar_catalogo.py` y `margen_es.py`. Si pide cuota para descargar, no se paga (no verificado si la exigen).

## 9. Riesgos nuevos

1. **Ejecución de la persona (pre-mortem A3, 50 %, juicio del crítico):** la ruta pide más acciones que el dropshipping. Mitigación: etapa 0 pequeña y con fecha; si no hay respuesta, PAUSAR.
2. **Preventa sin alta fiscal:** señal débil o ilegal de cobrar; mitigación: solo lista de espera antes del alta; normativa de consumo sin verificar.
3. **Propiedad intelectual (B5, 25 %):** estética gamer/coche/neón roza GTA/Vice City; una sanción afecta a toda la tienda. Mitigación: revisión de `revisor-contenido-ia` antes de publicar.
4. **Señal de B2B débil:** 15 mensajes es una muestra pequeña; un fracaso no cierra el B2B para siempre pero sí esta ronda.
5. **Confundir tamaño con calidad:** una ruta "grande" no mejora el dato. El único dato que mueve la decisión es el de canal.
6. **Black Friday (27/11/2026):** esta ruta no lo aprovecha; coste de oportunidad asumido.
7. **Derecho de 3 € y flete de importación:** no están en `margen_es.py`; cualquier margen con origen China o importación es optimista hasta incorporarlos.

## Datos clave

| Producto | ID/URL | Coste € | PVP € (probado o propuesto) | Fuente del precio de mercado y fecha | Verificado (listado/ficha/persona) | Margen/pedido y supuestos | Veredicto |
|---|---|---|---|---|---|---|---|
| Marca propia + 3PL (genérico) | no aplica | 9,00 supuesto; desk mat 5,00 supuesto; listado Alibaba 1,70-3,40 USD sin envío ni aranceles | 39,90 propuesto (ninguna candidata lo propone); ancla leída: Nilox 10,99 €, calcetines 3 pares 26,45-28,15 € (marcas) | `marca-propia.md` (rechazado), 27/10/2026, resumen de búsqueda, no TikTok Shop | No: solo resumen de búsqueda | +10,88 €/pedido (dev. 12 %, comisión 9 %, afiliado 0, `margen_es.py`, crítico 27/10/2026); +6,53 € con afiliado 15 %; ticket supuesto | AGUANTAR sin presupuesto; SOLO SI a-f |
| POD de marca (camiseta) | printify.com/app/products/6 | 12,50 supuesto | 34,90 propuesto; mercado ES 6-14 € (FastMoss abril 2026) | `modelos-alternativos.md` (rechazado) y `metodo-busqueda.md`, 27/10/2026 | No | +4,53 €/pedido; +0,85 € con afiliado 15 %; -7,86 € a 14,90 € (crítico, 27/10/2026) | CERRAR como motor con anuncios |
| Dropshipping UE (genérico) | no aplica | 8,00 + envío 3,90 supuestos | 24,90 propuesto | no verificado | No | +2,65 €/pedido sin anuncios (dev. 15 %, comisión 9 %); supuesto | CERRAR como motor de anuncios |
| Ventosa B2 | 1005013071285711 | 5,89 | 12,90-14,90 (H2b, sin verificar en TikTok Shop ES) | `estado.md`, 26/10/2026 | Listado | +3,05 €/pedido sin anuncios; pierde con CPA 8 € (`estado.md`) | AGUANTAR congelada, sin presupuesto |
| Drop con preventa | no aplica | por cotizar | por probar (>= 25 €) | sin ancla | No | no calculado | GO a prueba (14 días, <= 30 €) |
| B2B merchandising | no aplica | por cotizar | por probar (presupuesto 300-2.000 €, supuesto del crítico) | sin ancla | No | no calculado | GO a prueba (7 días, 0 €) |
| Curación/afiliación | no aplica | 0 | comisión 8-10 % ropa, 8 % accesorios | Beancount 25/07/2026 (resumen de búsqueda) | No | no calculado | GO a prueba (21 días, 0 €), condicionada a requisitos del programa |

- **Qué sabemos** (con fuente y fecha): FastMoss abril 2026, ES: top 5 de 4-14 € en ropa y belleza, sin gaming/coche/hogar (`metodo-busqueda.md`, 27/10/2026, blog de herramienta). `margen_es.py` ejecutado por el crítico y calidad el 27/10/2026: B +10,88 €, dropshipping a 39,90 € +10,95 €, camiseta POD 34,90 € +4,53 €, camiseta a 14,90 € -7,86 €. Calidad rechazó `marca-propia.md` y `modelos-alternativos.md` (27/10/2026). Derecho de 3 € desde 1/07/2026 y fin de la franquicia de 150 €: fuentes secundarias, no verificado (`requisitos-escalar.md`, 27/10/2026). 12 rondas, 0 € gastados, 0 vídeos (`estado.md`, 26/10/2026).
- **Qué asumimos** (y cómo se comprobaría): que existe comprador a >= 25 € en un nicho de identidad en TikTok Shop ES (hoja de lectura, etapa 0); que Seller Center admite stock propio y plazo viable (Seller Center); que B2B tiene ticket y anticipo como supone el crítico (15 mensajes); que la preventa funciona sin marca (14 días, reservas); que el programa de creadores admite la cuenta (requisito de seguidores no verificado); que el tope de 30 € basta (lo confirma `cfo-finanzas`); costes de alta fiscal y gestoría (no verificados).
- **Qué cambiaría mi conclusión:** >= 3 fichas a >= 25 € con >= 500 ventas en TikTok Shop ES y Seller Center admitiendo stock propio (marca propia pasa a SOLO SI con cotizaciones); >= 10 reservas pagadas o un pedido B2B con anticipo (se libera el primer lote de un producto); Seller Center admitiendo POD con plazo ampliado y PVP >= 30 € leído (POD reabre); respuestas A/B en capital o menos de 3 h/semana o ninguna respuesta el 02/11 (se pausa todo); CPA real medido < 5 € (dropshipping vuelve a ser candidato).
