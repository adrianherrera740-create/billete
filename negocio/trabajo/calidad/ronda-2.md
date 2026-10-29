# Puerta de calidad, ronda 2 (negocio «chief of staff digital»)

Fecha: 29/10/2026. Revisor: auditor-calidad. Revisado: `negocio/trabajo/interfaz/` (diseño y prototipo), `negocio/trabajo/casos-de-uso/automatizaciones-por-persona.md` y `negocio/trabajo/critica/pre-mortem-ronda-2.md`, contra `cerebro/condiciones.md` (sobre todo 4, 6, 8, 10 y 12), `cerebro/negocio/resumen.md` y `negocio/trabajo/calidad/ronda-1.md`. No se ha corregido nada ni se ha hecho commit; lo rechazado se devuelve a su autor.

## Veredicto por entrega

| Entrega | Veredicto |
|---|---|
| Interfaz: prototipo (`interfaz/prototipo/`) | **APROBADO** (con 2 observaciones) |
| Interfaz: diseño (`interfaz/diseno-interfaz.md`) | **RECHAZADO** (cond. 8, 10 y regla «solo recuento en bloqueo»): F-I1, F-I2, F-I3 |
| Automatizaciones por persona | **RECHAZADO** (cond. 8): F-A1 |
| Pre-mortem ronda 2 | **RECHAZADO** (cond. 6 y 8): F-P1, F-P2, F-P3 |

## Comprobaciones transversales

- **Pruebas del prototipo (cond. 10):** `cd negocio/trabajo/interfaz/prototipo && node --test tests/logica.test.js` → 20 de 20 pasan, 0 fallos (Node 22.22.0). Coincide con `diseno-interfaz.md:18,262,266`.
- **Cifras recalculadas a mano con el código:** briefing con los datos ficticios = 77 palabras, 22 s (77/3,5 = 22) → coincide con `diseno-interfaz.md:110`. Umbral 60 s = 210 palabras a 3,5 pal/s ✓ (`:110`). Guion de voz: 42 palabras en modo público, 86 en privado, ambos por debajo de 280 ✓. Aviso de bloqueo con la cola de datos.js: «Tienes 4 asuntos pendientes.» ✓ (coincide con `captura-hoy.png`).
- **Datos personales, credenciales, correos reales (cond. 4): sin fallos.** Barrido de correos en `interfaz/`, `automatizaciones-por-persona.md` y `pre-mortem-ronda-2.md`: ninguno fuera de `.example`/`.test` (en `datos.js` no hay ninguno). Sin teléfonos, IBAN reales, claves ni tokens. Los ejemplos son genéricos («la asesora fiscal», «un familiar»). La captura `interfaz/captura-hoy.png` solo muestra datos ficticios.
- **El prototipo no envía ni usa red: confirmado.** Búsqueda propia en `app.js`, `logica.js`, `datos.js`, `index.html` de fetch, XMLHttpRequest, WebSocket, sendBeacon, localStorage/sessionStorage/IndexedDB, innerHTML, eval, mailto, clipboard, window.open, `<img>`, `<iframe>`: 0 coincidencias. Los únicos `<script src>` son locales (`index.html:38-40`). CSP `default-src 'none'; script-src 'self'` (`index.html:6`). `aprobar` solo cambia el estado de la cola en memoria (`logica.js:87`). La prueba `tests/logica.test.js:165-172` lo vigila, aunque solo por patrones (misma limitación que O-D2 de ronda 1).
- **Pantalla de bloqueo en el prototipo: correcto.** `logica.js:14-18` solo recibe un recuento; la prueba `tests/logica.test.js:11-20` pasa una estructura con IBAN, nombre e importe y comprueba que no sale nada. `app.js:66` repite la regla; `app.js:96` oculta el contenido al pasar a segundo plano. (El fallo del diseño está en otra parte: F-I2.)
- **Precios como hipótesis:** `diseno-interfaz.md` no da ningún precio (todos los costes «NO VERIFICADO», `:214-226`). `automatizaciones-por-persona.md:8,98-99,105,111,117` marca los tres paquetes y sus cifras como HIPÓTESIS, sin ancla europea y sin presentarlos a nadie; los rangos coinciden con H3 de `cerebro/negocio/resumen.md:11`. Los ejemplos «1.500-2.000», «2.500-3.500», «3.500-5.000 €/mes» son valores internos de esos rangos, declarados «por ejemplo» bajo el título «todo HIPÓTESIS». Sin fallo. El pre-mortem no añade precios (`:6`).
- **WhatsApp descartado:** coherente (`diseno-interfaz.md:3,245`); no aparece en las otras dos entregas. Sin contradicción.
- **Opción A de `gmail.compose`:** el diseño la usa (`diseno-interfaz.md:121`, «Copiar y abrir correo», aprobar no envía) y el pre-mortem la recuerda como decisión pendiente (`pre-mortem-ronda-2.md:14,157`). Coherente con ronda 1. Observación O-I1.
- **NDA antes de la llamada:** ninguna de las tres entregas lo contradice. El pre-mortem lo cita como fricción pero no propone quitarlo (`:27`); C-05 reconoce que podría perder el control del NDA (`:128`). `automatizaciones-por-persona.md` no trata el NDA.
- **Calendario del pre-mortem recalculado:** sem. 1 = 02/11, sem. 4 = 23/11, sem. 8-9 = 21/12-03/01, sem. 10 = 04/01/2027 ✓; 29/04/2027 = 6 meses ✓; mes 4 ≈ febrero ✓ (`pre-mortem-ronda-2.md:13,156`).
- **AI Act:** la afirmación de `pre-mortem-ronda-2.md:45` («ningún informe lo menciona») es cierta: grep en `negocio/` y `cerebro/` sin coincidencias fuera del propio pre-mortem.
- **Referencias a preguntas del abogado** (`pre-mortem-ronda-2.md:38,47,149`: 15-17, 18, 19, 27, 28, 15-21) coinciden con `legal/05-preguntas-para-el-abogado.md:29-46`.
- **Numeración de automatizaciones** (1-19) de `automatizaciones-por-persona.md` coincide con `automatizaciones-candidatas.md:15-26` y `viables-hoy.md:11-27`; las 18 filas del catálogo cubren todas sin duplicar (6 = 18, dicho en `:92`).

## Fallos devueltos

### Interfaz, diseño: RECHAZADO

- **F-I1 (cond. 8 y 10: texto que contradice lo entregado).** `negocio/trabajo/interfaz/diseno-interfaz.md:268` dice «la interfaz no se ha abierto en un navegador ni en un móvil (no hay navegador aquí); el código de pintado solo pasó comprobación de sintaxis». Pero la entrega incluye `negocio/trabajo/interfaz/captura-hoy.png`, una captura de la vista «Hoy» renderizada (ancho de móvil, lectura 22 s), y el commit `c5f26db` la menciona. Ninguna parte del documento habla de la captura: ni `:254-262` (tabla de archivos) ni `:293-301` (árbol). O el párrafo es falso, o la captura no es de este prototipo. **Corregir:** explicar cómo se obtuvo la captura (qué navegador, qué versión), añadirla a las dos listas de archivos y reescribir `:268` diciendo exactamente qué vista se vio y qué sigue sin verse (Aprobaciones, Bloqueo, Apagar, claro/oscuro, contraste, móvil real).
- **F-I2 (regla de la pantalla de bloqueo; contradicción interna y con EM).** El diseño fija «solo un recuento» (`:11`, `:170`, `:188`), pero:
  - `:16` y `:41` aceptan Telegram «con solo ID y verbo (D2)»;
  - `:188` pone como ejemplo del mensaje «el mismo recuento, nunca más» el texto de EM 4.6 «Pendiente: borrador A-0001. Revisa en tu panel» (`demo/especificacion-mvp.md:56`, que además añade «Responde APROBAR A-0001 o RECHAZAR A-0001»). Eso lleva ID y tipo («borrador») y, en EM, un botón de decisión: justo lo que `:178` y `:234` prohíben («Aprobar» en la notificación; el canal de aviso sin botones de decisión) y `:246` («nada de aprobar desde una notificación»). Las notificaciones de Telegram, Slack y correo aparecen en la pantalla de bloqueo igual que cualquier otra.
  **Corregir:** quitar «ID y verbo» de `:16` y `:41`; en `:188` sustituir el ejemplo por el texto real del prototipo («Tienes N asuntos pendientes»); decir en una línea que esta regla sustituye a la de EM D2/Req. 6 para el aviso (y avisar al arquitecto-agentes para alinear `especificacion-mvp.md:40,56,343`).
- **F-I3 (cond. 8; datos en la UE como hecho, no como objetivo).** `:10` («la única opción que cumple a la vez comodidad, control del contenido y residencia»), `:49` («El contenido nunca sale de un dominio que controlamos en la UE») y `:63` («Nada: dominio propio en la UE») afirman que se cumple la residencia. No existe hosting elegido (`:276`, decisión 3 de la persona), ni proveedor de push ni de voz con residencia confirmada (`:290`), ni el LLM (ronda 1, F-VT2). Es el mismo defecto que ronda 1 rechazó en ventas. **Corregir:** «el diseño exige alojarlo en la UE; aún sin hosting elegido ni confirmación escrita», en las tres líneas.

Observaciones no bloqueantes:
- O-I1 `:121,274`: la opción A es recomendación del arquitecto, no decisión (`cerebro/decisiones.md:15,18`: «solo la persona: opción A/B»). Redactar «opción A (recomendada, pendiente de la persona)» y añadirla a la lista de `:272-281`.
- O-I2 (cond. 11) `:51,259` y `logica.js:122-134`: el guion de voz está implementado y probado aunque el propio diseño lo sitúa en «fase 2» (`:24`, `:65`). No es grave (es lógica sin red), pero conviene dejar dicho que es adelanto y no entra en el MVP.

### Interfaz, prototipo: APROBADO

20/20 pruebas, sin red, sin envío, sin almacenamiento, sin datos reales, bloqueo solo con recuento, roles y segundo paso cubiertos, apagado sin credencial y reanudar con passkey simulada. Observaciones:
- O-I3 `app.js:73-74` y `logica.js:117-120`: la «passkey» se simula con la casilla «segundo paso»; el propio panel lo dice («simula huella/passkey», captura), correcto, pero no debe enseñarse como seguridad real.
- O-I4 `tests/logica.test.js:165-172`: la vigilancia de «sin red ni envío» es por patrones, como la O-D2 de ronda 1; hoy la lectura manual la compensa. Endurecer antes de cualquier piloto.

### Automatizaciones por persona: RECHAZADO

- **F-A1 (cond. 8: atribución a fuentes sin base).** `negocio/trabajo/casos-de-uso/automatizaciones-por-persona.md:52` dice que «la 1 y la 5 coinciden con lo que dicen las fuentes de `automatizaciones-candidatas.md`». La F1 (consolidar informes) sí está en las fuentes (`automatizaciones-candidatas.md:5,23`). La F5 («titular y familia piden cosas por todos lados») **no aparece** en ninguna fuente de `automatizaciones-candidatas.md:4-11`; la que sí está es la F2 (bóvedas de documentos, `:6`). Una hipótesis queda presentada como respaldada. **Corregir:** «la F1 y la F2»; dejar la F5 como [IDEA].

Observaciones no bloqueantes:
- O-A1 `:71-90`, columna «Pregunta que la valida»: las frases entre comillas («qué haces al empezar el día», «la última vez que llegaste sin preparar...», «algo se escapó o llegó tarde», «relación que se enfrió») no son preguntas del guion `ventas/01-guion-descubrimiento.md:21-38`; son paráfrasis (P2/P4/P6 son tareas repetidas, última vez que algo se escapó y qué quitarías). Quitar las comillas o decir «paráfrasis».
- O-A2 `:45`: «ella es también quien puede vetar el servicio» es afirmación sin marca en una sección [IDEA]; añadir [IDEA] en la línea.
- Bien resuelto: todo marcado NO VERIFICADO/[IDEA] y sin sostener GO (`:3-6`), precios como HIPÓTESIS, fase 3 para 9 y 10, «Solo la persona» en `:144-148` (cond. 12).

### Pre-mortem ronda 2: RECHAZADO

- **F-P1 (cond. 6: referencias a línea que no corresponden).** Varias citas de línea apuntan a otro texto, lo que impide comprobar el dato:
  - `pre-mortem-ronda-2.md:63` cita `estudio-mercado.md:38` («Copilot, Gemini: no investigados»); la línea real es `mercado/estudio-mercado.md:45` (la 38 es un encabezado).
  - `:33` cita `estudio-mercado.md:61` (es el encabezado «Estado de hipótesis»; la frase sobre horas no medidas está en `:59`) y `ventas/04:49` (es una tabla; la frase está en `ventas/04-propuesta-diagnostico-piloto-retainer.md:36`).
  - `:142` cita `ventas/04:39` y `:47`; las reglas son `ventas/04:45` (dos opciones de diagnóstico) y `:46` (regla de ajuste).
  - `:13` cita `ventas/05:50` («retainer hacia febrero»); la línea real es `ventas/05-calendario-12-semanas-y-eventos-2027.md:30`.
  Los hechos citados son ciertos; las rutas y líneas no. **Corregir** las seis referencias.
- **F-P2 (cond. 8: afirmaciones sin prueba ni marca).**
  - `:57`: «el 1 % que escapa a las defensas» es una cifra inventada sin fuente (el documento dice en `:6` que no añade cifras). Escribir «algún caso» o marcarla ilustrativa.
  - `:39` (R-04): «el tope de 12 meses ... puede ser inválido para dolo o culpa grave y no oponible a terceros» y «el patrimonio personal responde», y `:87` «notificable (72 h)»: afirmaciones jurídicas sin [ABOGADO]/[NV]. Marcarlas.
  - Los umbrales de «Señal temprana» y «Qué respuesta lo mata» (menos de 5 conversaciones en sem. 5, 10 de 20, menos de 3 de 10, 5 de 20, menos de 10 contactos: `:23,29,24,139,141`) son propuestas del crítico y solo el de `:23` lo dice («umbral mío»). Marcar todos como propuesta a fijar por la persona.
- **F-P3 (propuestas que rompen reglas o cambian el plan sin decirlo).**
  - C-03 (`:113-117`) afirma «ninguna de las 6 reglas se rompe» y que «la 1 y la 2 se cumplen igual o mejor». No hay prueba: si el LLM lo contrata el cliente y se usa Copilot/Gemini, la residencia UE no está verificada (`estudio-mercado.md:45`, «SIN DATO»); la regla 2 incluye contrato de encargado (art. 28), borrado certificado y botón de apagado en manos del cliente, que con C-03 dejan de depender de nuestro diseño o cambian de sentido; el registro auditable propio, parte de la regla 2 y del resumen, se pierde (el propio texto lo admite en `:116`). **Corregir:** decir que C-03 modifica el alcance de la regla 2 (y la arquitectura de `cerebro/negocio/resumen.md:16`), y quitar «igual o mejor» hasta tener la lectura primaria que el propio texto pide en `:117`.
  - C-02 (`:107-111`) usa «datos de ejemplo del cliente anonimizados» y declara que no toca ninguna regla. Esos datos siguen sujetos a la regla 5 (nada de terceros en el repo; trabajo fuera del repo) y a la regla 4 (NDA antes de la llamada). Decirlo.
  - R-01 (`:24`) propone bajar de 20 a 10 conversaciones y cambiar el criterio de parada, y R-03 (`:36`) limitar a 1 piloto simultáneo. Eso cambia la métrica de decisión del resumen (`cerebro/negocio/resumen.md:26-27`); `:158` solo exige luz verde y decisión escrita para C-01 a C-05. Ampliar a R-01 y R-03 (cond. 1 y 5).
  - Sí cumple lo pedido: C-05 declara que toca las reglas 4 y 6 (`:128`); C-01, C-04 «ninguna» (`:104,122`) son razonables; sección 6 (`:160-161`) lista lo que solo hace la persona (cond. 12).
- O-P1 `:3`: «Sin commit» ya no es cierto (el trabajo figura en `264bcb3`); actualizar para no confundir.

## Qué debe hacer cada autor para volver a la puerta

1. arquitecto-agentes / diseñador de interfaz: F-I1, F-I2, F-I3 (y alinear `demo/especificacion-mvp.md:40,56,343`); O-I1, O-I2.
2. autor de casos de uso: F-A1; O-A1, O-A2.
3. critico-escepticismo: F-P1, F-P2, F-P3; O-P1.

## Solo la persona (cond. 12)

Decidir la opción A/B de `gmail.compose`; abrir `interfaz/prototipo/index.html` en su móvil y en el ordenador y decir si el briefing se lee en 60 s (`diseno-interfaz.md:274`); elegir hosting UE y canal de aviso; contratar o no al abogado y cerrar el NDA antes de la primera llamada; decidir cuáles de C-01 a C-05 prueba y si cambia la métrica de 20 conversaciones; abrir las páginas oficiales de Copilot y Gemini y de proveedores de LLM; pedir presupuesto de seguro.

## Segunda pasada

Fecha: 29/10/2026. Revisor: auditor-calidad. Alcance: solo F-I1..F-I3, F-A1, F-P1..F-P3 y la coherencia de `demo/especificacion-mvp.md` con la regla de solo recuento. Sin correcciones ni commit por mi parte.

| Entrega | Veredicto |
|---|---|
| Interfaz: diseño | **APROBADO** (F-I1, F-I2, F-I3 corregidos) |
| Automatizaciones por persona | **APROBADO** (F-A1 corregido) |
| Pre-mortem ronda 2 | **APROBADO** (F-P1, F-P2, F-P3 corregidos; 1 observación) |
| `demo/especificacion-mvp.md` (coherencia con «solo recuento») | **RECHAZADO** (cond. 8: contradicción interna) |

### Verificado
- **F-I1:** `diseno-interfaz.md:269` ya describe la apertura en Chromium 390x844, dice que solo se vio «Hoy», que la versión de Chromium es NO VERIFICADA y lista lo no visto; `captura-hoy.png` está en `:262` y `:302`.
- **F-I2:** `:16` y `:41` sin «ID y verbo»; `:188` usa «Tienes N asuntos pendientes», sin ID, tipo, verbo ni botones, y declara que sustituye a EM 4.6/D2/Req. 6.
- **F-I3:** `:10`, `:49` y `:63` dicen «objetivo, no un hecho», sin hosting elegido ni confirmación escrita. Sin otra residencia UE como hecho en el diseño.
- **F-A1:** `automatizaciones-por-persona.md:52` ahora «F1 y F2» (líneas 5-6 de `automatizaciones-candidatas.md`, comprobadas) y F3-F5 como [IDEA].
- **F-P1, citas de línea una a una (todas correctas):** `estudio-mercado.md:45` (Copilot/Gemini «No investigados») en `:63` y `:116`; `estudio-mercado.md:59` (tiempo por cliente no medido) y `ventas/04...:36` en `:33`; `ventas/04...:45` y `:46` en `:142` y `:77`; `ventas/04...:48` en `:151`; `ventas/05...:30` en `:13`; `ventas/04...:14-18` en `:110`; `resumen.md:16` y `:27` en `:116` y `:24`; preguntas del abogado 15-17, 18, 19, 27, 28 y 15-21 coinciden con `legal/05`. Las cinco citas de `:155` y `:63`, `:11`, `:14` (`especificacion-mvp.md:13,217`, `guion-demo.md:14`) también.
- **F-P2:** la cifra «1 %» ya no existe (grep 0); R-04 y R-12 llevan [ABOGADO, no verificado]; `:6` declara todos los umbrales como PROPUESTA de la persona a fijar.
- **F-P3:** C-03 (`:116`) dice que modifica el alcance de la regla 2 y la arquitectura de `resumen.md:16`, sin «igual o mejor»; C-02 (`:110`) declara reglas 4 y 5 y luz verde; R-01 (`:24`), R-03 (`:36`), `:158` y `:161` exigen luz verde y `decisiones.md` (cond. 1 y 5). O-P1 resuelta («Sin commit» eliminado).

### Fallos que quedan
- **F-E1 (cond. 8: contradicción interna en `negocio/trabajo/demo/especificacion-mvp.md`).** D2 (`:40`) y S5 (`:343`) ya dicen «solo recuento», pero:
  - `:208` (4.6) sigue definiendo como «lo único que sale» el mensaje `Pendiente: <tipo> <ID>... Responde APROBAR <ID> o RECHAZAR <ID>`, con tipo, ID y verbo de decisión;
  - `:362` (tabla de datos que salen) sigue con «Solo ID y verbo»;
  - `:56` (col. 1) todavía titula «solo ID y verbo» (la col. 3 sí lo aclara y admite que el prototipo aún emite ese texto).
  **Corregir:** en `:208` marcar el mensaje como «sustituido por `Tienes N asuntos pendientes`; el texto actual solo dentro del panel» (o reescribirlo), y en `:362` y `:56` cambiar a «Solo recuento». El prototipo Python sigue emitiendo el texto antiguo: dejarlo anotado como pendiente de alinear (ya lo dice `:56`).

### Observaciones no bloqueantes
- O-P2 `pre-mortem-ronda-2.md:53,59`: «2 semanas» y «50+ repeticiones» son propuestas del crítico sin marca propia; las cubre la convención de `:6` solo en parte (habla de «señal temprana» y «qué respuesta lo mata»). Marcar «(propuesta)».
- O-A2 (ronda 1) sigue abierta: `automatizaciones-por-persona.md:45` («ella es también quien puede vetar el servicio») sin marca [IDEA].
- Sin regresiones de cifras inventadas ni de residencia UE como hecho en las tres entregas aprobadas; sin datos personales ni credenciales nuevos.
