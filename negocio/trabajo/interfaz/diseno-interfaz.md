# Diseño de la interfaz de entrega: «Chief of staff digital»

Fecha: 29/10/2026 · Tarea 11 de la ronda 2 · Depende de `negocio/trabajo/demo/especificacion-mvp.md` (EM), `negocio/trabajo/seguridad/analisis-riesgos.md` (AR), `negocio/trabajo/casos-de-uso/viables-hoy.md` y `negocio/trabajo/verificacion/verificacion-informe.md` (WhatsApp descartado como base: estado litigioso e incierto en la UE, fila 6).

Estado: **No verificado** (condición 8). Documento generado por IA. Todo lo que dice de plataformas de terceros (iOS, Android, Telegram, Signal, Slack, Apple, Google) viene de mi conocimiento general o de las fuentes secundarias de AR, **no de documentación primaria leída**: va marcado **[NV]**. Las puntuaciones y los esfuerzos son juicio mío, sin base medida. Ningún coste tiene cifra verificada. Lo jurídico va marcado **[ABOGADO]**. No hay datos personales: los ejemplos son ficticios.

## 0. Resumen en diez líneas

1. Reglas que no se tocan: el agente propone, el humano decide; nada se envía solo; datos en la UE; «aprobado» significa «listo para que lo envíe una persona», nunca «enviado» (EM 4.6).
2. **Recomendación:** un **panel privado instalable (PWA)** con inicio de sesión por passkey, que es a la vez la interfaz del titular y el **modo asistente** de su EA (misma cola, roles distintos). Es la única opción que cumple a la vez comodidad, control del contenido y residencia (secciones 1 y 2).
3. El móvil recibe un **aviso sin contenido** («Tienes 2 asuntos pendientes»). Todo lo demás se lee dentro del panel, tras desbloquear.
4. El briefing se lee en **60 segundos o menos**: estado, máximo 3 decisiones, agenda, una línea de «sin tocar». El prototipo lo mide (22 s con los datos de la demo).
5. Aprobar es **un toque más la huella** (el segundo paso). No se aprueba deslizando. Aprobar no envía: deja el texto listo para copiar y enviar.
6. Sin conexión: se puede **leer** lo último y **guardar decisiones como intención**; nada cambia de estado hasta volver a conectar, y las aprobaciones de borradores caducan en 12 h [propuesta mía] y piden de nuevo el segundo paso.
7. El apagado es **un gesto en el panel**, sin pedir credenciales para apagar (sí para reanudar), más una vía independiente: revocar el acceso en la cuenta de correo.
8. Voz, widget, reloj y mensajería son **complementos de aviso**, no canales de decisión ni de contenido. Telegram y compañía solo con ID y verbo, como ya fijó EM (D2).
9. Pila mínima: HTML/JS estático + pequeño servidor en la UE + passkeys + aviso push sin contenido (sección 4). **Todo coste, NO VERIFICADO.**
10. Hoy se puede prototipar sin servicios: el panel (`prototipo/`), con 20 pruebas automáticas que pasan (sección 7). Lo que exige tocar un móvil real, contratar o instalar algo queda para la persona (sección 8, condición 12).

## 1. Comparativa de opciones

Puntuación 1 a 5, donde **5 es lo mejor** en cada columna (en coste y esfuerzo, 5 = más barato y más fácil; en dependencia, 5 = menos dependencia de terceros). Es juicio mío **[NV]**.

| Opción | Comodidad | Discreción | Seguridad | Coste | Esfuerzo de construir | Dependencia de terceros | Papel recomendado |
|---|---|---|---|---|---|---|---|
| A. Correo con resumen diario | 4 | 2 | 2 | 5 | 5 | 3 | Copia de seguridad del aviso, sin contenido |
| B1. Telegram con botones | 5 | 2 | 2 | 4 | 4 | 2 | Opcional, solo «hay algo pendiente» |
| B2. Signal | 3 | 5 | 3 | 4 | 2 | 2 | No de inicio (ver nota) |
| B3. iMessage | 5 | 3 | 2 | 3 | 1 | 1 | Descartado de inicio (ver nota) |
| B4. Slack | 4 | 3 | 3 | 3 | 4 | 2 | Solo si el cliente ya lo usa; residencia NV |
| **C. Panel web privado instalable (PWA) con passkey** | 4 | 4 | 5 | 4 | 3 | 4 | **Núcleo** |
| D. Voz (audio de 2 min y respuestas por voz) | 3 | 2 | 3 | 3 | 2 | 3 | Fase 2, solo lectura y modo privado |
| E. Widget / atajo del móvil | 3 | 2 | 3 | 5 | 4 | 4 | Solo atajos: abrir panel y apagar |
| **F. Modo asistente (EA) con cola de aprobaciones** | 5 | 4 | 4 | 5 | 3 | 5 | **Dentro del núcleo** |
| G. Reloj | 2 | 3 | 2 | 4 | 3 | 3 | Háptica de aviso; no decidir |

### Razones y notas por opción

**A. Correo con resumen diario.** Es lo que el cliente ya usa y el aviso llega sin instalar nada. Pero el buzón es precisamente el activo que se protege (AR, «Canal de aprobación»): un resumen con contenido queda indexado, sincronizado en varios dispositivos, con vista previa en pantalla de bloqueo y es suplantable. Aprobar «respondiendo al correo» es un canal sin segundo paso. Uso válido: cuenta de aprobación **distinta** de la principal y **solo con el aviso sin contenido** (EM, S5 «alternativa sin pago»).

**B1. Telegram.** Máxima comodidad (botones en línea). AR: los chats de bots **no tienen cifrado de extremo a extremo** y sus centros de datos no publican ubicación [secundarias]; «no recomendado para contenido». Con solo ID y verbo (decisión D2 de EM) es tolerable como aviso. El riesgo restante es la cuenta del titular: si se roba el móvil o la cuenta, quien pulse «APROBAR» debe seguir sin poder aprobar un borrador (EM 4.6: segundo paso y cuenta vinculada).

**B2. Signal.** Mejor privacidad de contenido, pero, por lo que sé, no ofrece una API oficial para bots y las soluciones son no oficiales **[NV]**: fragilidad y dependencia de un proyecto de terceros. Sin botones de acción. No de inicio.

**B3. iMessage.** Muy cómodo para quien vive en iPhone, pero no conozco una vía oficial para que un servicio envíe iMessage a un particular de forma automatizada; «Apple Messages for Business» está pensado para empresas que atienden clientes y exige alta con Apple **[NV]**. Datos fuera de nuestro control y sin residencia comprobable. Descartado de inicio.

**B4. Slack.** Buenos botones y roles, útil si el family office ya lo usa. Residencia UE **no verificada** (AR sección 4). Añade un subencargado más. Solo por petición del cliente.

**C. PWA.** El contenido nunca sale de un dominio que controlamos en la UE; el aviso es lo único que viaja por terceros. Passkey (WebAuthn) como inicio de sesión fuerte y como segundo paso de aprobación **[NV: comportamiento exacto de passkeys dentro de una PWA instalada en iOS y Android; hay que probarlo en móviles reales]**. Se instala en la pantalla de inicio sin tienda de aplicaciones: no depende de la aprobación de Apple o Google ni de una cuenta de desarrollador de pago. Coste de la comodidad: hay que construirlo y operarlo (EM ya lo contempla como S4, recomendado por AR).

**D. Voz.** Útil en el coche o paseando, y accesibilidad real. Riesgos: se oye en público, el audio con contenido es otro archivo sensible, y la síntesis de voz puede implicar un subencargado más **[NV]**. Reglas de diseño: **modo público** lee solo recuentos y horas; **modo privado** (auriculares conectados, activado a mano) lee también títulos; respuestas por voz solo con un vocabulario cerrado («aprobar», «rechazar», «más tarde», «siguiente») y **nunca** aprobar un borrador solo por voz, porque la voz es imitable (clonación) y la aprobación necesita el segundo paso físico. El prototipo ya genera el guion de voz y comprueba que cabe en 2 minutos (menos de 280 palabras a ritmo de locución, supuesto mío).

**E. Widget / atajo.** Un widget con contenido en la pantalla de bloqueo es el peor escenario de privacidad. Solo dos atajos útiles y sin contenido: «Abrir panel» y «Apagar todo». El atajo de apagado que llame a un servidor necesita un secreto guardado en el móvil: mejor que el atajo **abra la pantalla de apagado del panel** y no que lleve una clave **[NV: capacidades de atajos de iOS y Android]**.

**F. Modo asistente.** La asistente ejecutiva es probablemente quien más usará el sistema (resumen de negocio: se llega por asistentes ejecutivas). No es otra aplicación: es el **mismo panel con otro rol** (sección 3). Cola ordenada, lote, edición de borradores, «pasar al titular» con nota.

**G. Reloj.** La pantalla es demasiado pequeña para decidir con seguridad y la privacidad en muñeca es pobre (se ve de lado). Solo duplica el aviso del móvil con vibración. Nada de aprobar desde el reloj; como máximo «más tarde» y «silenciar 1 h».

### Combinación elegida

| Capa | Qué | Qué viaja por terceros |
|---|---|---|
| Decidir y leer | Panel PWA (titular y asistente) | Nada: dominio propio en la UE |
| Avisar | Notificación push del panel (primera opción) o correo a cuenta aparte o Telegram (opcional) | Solo «hay N pendientes» |
| Escuchar | Voz en fase 2, generada por el panel, modo público por defecto | Nada, si la síntesis es local o en la UE **[NV]** |
| Atajos | «Abrir panel», «Apagar todo» | Nada |
| Reloj | Espejo del aviso | Nada nuevo |

## 2. Experiencia concreta

### 2.1 La primera semana

Principio: **confianza gradual**. Empezar mirando, después proponiendo, y solo al final con aprobaciones. Todo con datos ficticios hasta cerrar el kit legal (EM, Req. 10 y 11-12) **[ABOGADO]**; lo que sigue describe el piloto *cuando* esté autorizado.

| Día | Qué ocurre | Qué ve el cliente | Qué se mide |
|---|---|---|---|
| 0 (sesión de 45 min, en persona o por videollamada) | Instalar el panel, registrar passkey en el móvil del titular y en el de la asistente, probar el aviso, **ensayar el apagado cronometrado**, firmar las carpetas excluidas | Una pantalla en blanco que se llena con el briefing de prueba | Tiempo hasta primer aviso recibido |
| 1 | **Modo sombra:** solo briefing a las 7:00, sin borradores ni cola | Briefing de 60 s | El cliente lo lee entero, ¿cuánto tarda? |
| 2 | Idem; la asistente marca qué sobra y qué falta | Lo mismo con ajustes | Correos importantes que faltaron (la métrica que más importa) |
| 3 | Aparecen borradores solo para correos «Responder» | Cola con 2 a 5 elementos | % aprobados sin editar; rechazados |
| 4 | Primera aprobación real de la asistente, con el titular delante | Cómo se ve «listo para enviar» | Dudas |
| 5 | Dossier de reunión 24 h antes | Una ficha por reunión | ¿Lo abrió antes de la reunión? |
| Cierre (20 min) | Revisar el registro de auditoría juntos y repetir el apagado | Registro exportable | Decisión: seguir, ajustar o parar |

Las métricas son **propuestas mías**; no hay umbral de éxito verificado. Un criterio razonable: si el titular necesita más de 2 minutos para el briefing o ve un correo importante que falta, se corrige antes de pasar al día siguiente.

### 2.2 La mañana tipo (el briefing en 60 segundos)

- **7:00** el sistema genera el briefing con **plantilla determinista** (EM 4.1; el modelo no decide qué se muestra). **7:01** llega el aviso: «Tienes 4 asuntos pendientes.» Nada más.
- El titular abre el panel con huella. Orden fijo, siempre el mismo (la previsibilidad es lo que permite leer rápido):

```
HOY 03/11/2026                                   (Fase de prueba si procede)
10 correos revisados. Nada enviado: tú decides.

NECESITA TU DECISIÓN   (máx. 3; "y N más" si hay más)
 1. RIESGO. Un proveedor pide cambiar la cuenta. Verifica por otro canal.
 2. Responder. La asesora pide confirmar disponibilidad.
 3. Responder. Un familiar propone cena el sábado.
 y 2 más en Aprobaciones

AGENDA
 12:30  Comida con la asesora fiscal
 17:00  Llamada de presentación (organizador no verificado)

SIN TOCAR
 1 informativo; 3 para revisar con cuidado (no se resumen); 1 excluido por regla.
```

- **Regla de los 60 s:** máximo ~210 palabras en pantalla (3,5 palabras por segundo, supuesto de lectura) y tres bloques. El prototipo calcula los segundos y una prueba falla si superan 60. Con los datos ficticios salen 77 palabras, 22 s.
- **Nada se oculta para que quepa:** si hay más de tres decisiones, lo dice («y 2 más»). Los sospechosos y excluidos aparecen como recuento, igual que en EM (invariante: todo correo aparece exactamente una vez).
- Prioridad por **hechos**, no por lo que el correo diga de sí mismo («urgente»): EM 4.2. Un remitente desconocido nunca sube a «alta».
- Si el titular solo mira 15 segundos, ya sabe: cuántos hay, si hay riesgo y la próxima cita. Eso va arriba.
- La asistente tiene su propia vista del mismo briefing, con la cola completa (sección 3).

### 2.3 Aprobar un borrador con un toque

1. Del briefing, un toque en la decisión abre la **tarjeta de revisión** (EM 4.6): destinatario real en grande, el original saneado (plegado), el borrador, y los avisos (importes, enlaces en el original, Reply-To distinto).
2. Dos botones grandes y **separados** (no adyacentes en vertical a un gesto de arrastre): **Aprobar** y **Rechazar**; «Más tarde» discreto debajo. Sin deslizar para aprobar: los deslizamientos se activan por accidente.
3. Al pulsar **Aprobar**, el móvil pide la huella o el rostro (passkey). Es el **segundo paso** de EM para tipos con efecto externo: «un toque» son en realidad dos gestos de menos de un segundo; no lo vendo como un solo toque.
4. Resultado: «Listo para enviar. Nada se ha enviado.» con el botón **Copiar y abrir correo** (opción A de EM 1.1: sin `gmail.compose`). **Aprobar no envía**; el titular o la asistente envían desde el correo.
5. **Deshacer** durante 10 segundos (propuesta mía): como aprobar solo deja el texto listo y no envía, deshacer es seguro.
6. Si el borrador tiene importes, cuentas o destinatarios nuevos: botón Aprobar deshabilitado para la asistente (solo titular) y aviso rojo con texto, no solo color.
7. Cada decisión queda en el registro con actor y hora, sin cuerpos (EM 4.7).

### 2.4 Fuera de línea y de viaje

| Situación | Qué hace el panel | Por qué |
|---|---|---|
| Sin conexión (avión, túnel) | Muestra el **último briefing ya leído** (caché en el dispositivo, caduca a las 24 h y se borra al apagar o cerrar sesión). Se pueden **guardar intenciones** (ID + verbo + hora). El estado no cambia | Una decisión «aprobada» sin servidor no tiene efecto verificable |
| Al volver la conexión | Rechazar y «más tarde» se aplican. Aprobar un borrador **pide de nuevo el segundo paso**. Las intenciones de más de 12 h caducan y se piden otra vez | El contexto pudo cambiar (un correo posterior, un cambio de cuenta) |
| Datos móviles caros en el extranjero | Todo es texto plano de pocos kilobytes (sin imágenes por diseño; cifra no medida **[NV]**) | Cabe en cualquier red |
| Cambio de huso horario | El briefing se genera a las 7:00 **hora de casa** por defecto; ajuste «hora del viaje» con ambas horas visibles en la cabecera | Evitar confusión de agenda |
| Viaje con cruce de frontera | **Modo viaje** (a petición): caché más corta, huella en cada apertura, historial oculto, y un clic en «Cerrar sesiones» que invalida los dispositivos | Revisiones de dispositivos y robo; el kill-switch sigue funcionando desde la asistente |
| Móvil perdido o robado | La asistente o el cliente pulsan «Cerrar sesión de este dispositivo» o «Apagar todo» desde otro; el titular revoca el acceso en su cuenta de correo | Las dos vías independientes de AR sección 6 |
| El servicio no responde | Mensaje claro: qué pasó, que no se ha enviado nada, y a quién llamar (condición 7). El briefing se retrasa y avisa; **no** se omite en silencio | Un briefing que falta sin avisar es peor que uno tarde |

### 2.5 Cómo se apaga todo

- **Un gesto, sin credenciales para apagar**: botón rojo «APAGAR TODO» en Ajustes, siempre visible desde la barra del panel (el prototipo lo implementa). Apagar debe ser más fácil que seguir; en pánico no debe pedir contraseña.
- Efecto (EM 4.7): impide ejecutar flujos, revoca tokens, vacía la cola (pendientes pasan a «cancelado»), borra la caché del dispositivo. El prototipo lo comprueba con pruebas.
- **Reanudar sí exige passkey** del titular. Asimetría deliberada.
- **Vía independiente**: revocar el acceso a la aplicación desde la cuenta de Google o Microsoft del cliente; no depende de nosotros ni de nuestro panel. Mostrar un paso a paso de 3 líneas en la propia pantalla de Ajustes, con el enlace a la página de seguridad de su cuenta **[NV: ruta exacta vigente]**.
- Atajo del móvil: abre directamente la pantalla de apagado (sección 1.E).
- **Ensayo cronometrado** el día 0 y al cerrar la semana (EM 6.4.6). Meta propuesta: menos de 5 minutos de extremo a extremo para tokens, flujos y colas (AR R13).

### 2.6 Idioma y tono

- **Idiomas:** castellano por defecto; catalán disponible (el mercado es Cataluña, resumen de negocio) y, si el cliente trata con correspondencia en inglés, el briefing sigue en su idioma y **cita el original sin traducir** en la tarjeta. Una traducción automática de un mensaje con una petición sensible puede cambiar su sentido. Revisión de las cadenas por un hablante nativo antes de usarlas **[NV: no revisado]**.
- **Tono:** sobrio, breve, sin adornos, sin exclamaciones, sin emojis, sin lenguaje de urgencia («¡urgente!»). Frases en indicativo, sujeto claro: «Un proveedor pide cambiar la cuenta», no «¡Atención!». La palabra «urgente» solo aparece si es un hecho (fecha límite verificable).
- **Tratamiento:** configurable (tú / usted) en el día 0; por defecto, impersonal («Necesita tu decisión» es el límite; evitar «Le recordamos…»). Decisión del cliente.
- El sistema habla de sí mismo con honestidad: «propone», «no leyó», «no se resume». Nunca «he enviado» ni «me encargo».
- Los textos fijos de la interfaz salen de una tabla (no del modelo), para que no puedan ser alterados por una inyección (EM 5.4).

### 2.7 Accesibilidad

Objetivo propuesto: WCAG 2.2 nivel AA **[NV: no he leído la norma; lo que sigue es lo que recuerdo de ella]**, probado con lector de pantalla real (VoiceOver y TalkBack) por una persona.

- Texto base de 18 px o más, escalable hasta 200 % sin romper la maquetación; el prototipo parte de 112,5 % del tamaño de letra del sistema.
- Objetivos táctiles de **al menos 48 px** (el prototipo usa 48 px); botones de decisión separados.
- Contraste alto en claro y oscuro; **nunca solo color** (cada estado lleva texto: «RIESGO», «aprobado»).
- Etiquetas y regiones para lector de pantalla; `aria-live` para los mensajes de estado (el prototipo lo usa); orden de lectura igual al visual.
- Respeta «reducir movimiento» y el tamaño de letra del sistema; sin temporizadores que expulsen al usuario (el deshacer de 10 s no bloquea nada).
- Voz como alternativa real (sección 1.D) para vista reducida o conducción.
- Sin CAPTCHAs ni arrastres obligatorios; todo operable con un dedo y con teclado externo.
- Una EA mayor o con temblor debe poder usar «Aprobar» sin precisión: de ahí botones grandes, no gestos.

### 2.8 Qué NO debe mostrarse nunca en la pantalla de bloqueo

La notificación, el widget, el reloj, el icono y el selector de aplicaciones son **superficies públicas**. Regla: **solo un recuento**.

| Permitido | Prohibido (siempre) |
|---|---|
| «Pendiente. Tienes 2 asuntos pendientes.» | Nombres de personas, empresas, bancos o despachos |
| Una hora fija neutra | Asuntos de correos, títulos de reuniones, lugares |
| Un nombre de aplicación **neutro** (propuesta: sin la palabra «patrimonio», «banca» ni el nombre del cliente) | Importes, cuentas, IBAN, cifras |
| Un solo icono sobrio | Palabras como «riesgo», «cambio de cuenta», «salud», «urgente» (revelan contenido o inducen a pulsar) |
| | Resúmenes, vista previa del texto, botones «Aprobar» en la notificación |
| | Imágenes, enlaces, avatares de remitentes |
| | Contenido en el widget, en el reloj o en el audio de la pantalla de bloqueo |
| | La etiqueta «excluido por regla» o cualquier indicio de categoría especial (AR R10) |

- La función `avisoBloqueo` del prototipo recibe solo un recuento y una prueba comprueba que no filtra ninguno de esos datos aunque se le pase una estructura con asunto, remitente e importe.
- Desactivar la vista previa de notificaciones en bloqueo en los ajustes del móvil, y comprobarlo el día 0 **[NV: ajustes concretos de iOS y Android]**.
- El panel **oculta su contenido** al pasar a segundo plano (el prototipo lo hace al cambiar de visibilidad), y se bloquea tras 60 s de inactividad (propuesta). Hay que verificar en móviles reales qué capturas del selector de apps permiten iOS y Android **[NV]**.
- Sin capturas de pantalla ni compartir: el panel no ofrece botón «compartir».
- Modo público de la voz (sección 1.D): solo recuentos y horas.
- Mensajería (Telegram, Slack, correo auxiliar): el mensaje es el mismo recuento, nunca más (EM 4.6: «Pendiente: borrador A-0001. Revisa en tu panel»).

## 3. Modo asistente (EA)

Mismo panel, otro rol. La asistente suele ser quien tiene el tiempo y el conocimiento del día a día; el titular quien tiene la decisión final.

| Acción | Titular | Asistente | Observaciones |
|---|---|---|---|
| Leer briefing y cola | Sí | Sí | Misma información |
| Editar borrador | Sí | Sí | Queda registrada la edición |
| Rechazar / posponer | Sí | Sí | |
| Aprobar borrador | Sí, con segundo paso | **No por defecto** | Solo con **delegación escrita del titular** para un tipo concreto, y **nunca** si contiene importes, cuentas o destinatarios nuevos, ni si está marcado «solo titular» |
| Aprobar alta de contacto | Sí | Con delegación | |
| Pasar al titular con nota | n/a | Sí | Prioriza la cola del titular |
| Apagar todo | Sí | Sí | Cualquiera de los dos |
| Reanudar tras apagado | Sí, con passkey | No | |
| Ver registro de auditoría | Sí | Sí | Solo lectura, sin cuerpos |
| Cambiar permisos, exclusiones, idioma | Sí | No | |
| **Operador del servicio (nosotros)** | n/a | n/a | **Sin acceso al contenido** por diseño; solo metadatos para el soporte. Acceso excepcional con permiso y registro **[ABOGADO]** |

Experiencia de la asistente: cola ordenada por riesgo y antigüedad, **revisión en lote** (los informativos y altas de CRM se despachan de uno en uno con atajos de teclado en el ordenador), contador de «mis pendientes» y «los pendientes del titular», y un resumen de fin de día (qué se aprobó, qué caducó). Todas las decisiones llevan actor en el registro (EM 4.7), así «aprobó la asistente con delegación» y «aprobó el titular» se distinguen.

Riesgo conocido: la **fatiga de aprobación** (R4 en AR): quien aprueba cien borradores al día deja de mirar. Mitigación en el diseño: avisos visibles en el borrador, destinatario real en grande, nada de «aprobar todo», y la métrica de seguimiento «% aprobados sin abrir el original» como señal de alarma (propuesta mía).

## 4. Pila mínima

Coste **NO VERIFICADO** en todas las filas: no hay precios leídos en fuente primaria (condición 6). Las estimaciones de esfuerzo son mías, sin base.

| Componente | Opción mínima | Estado | Coste | Esfuerzo (estimación mía) | Alternativa |
|---|---|---|---|---|---|
| Panel (interfaz) | HTML/CSS/JS estático servido por nosotros, instalable (manifiesto + service worker) | Prototipo hecho (sin service worker aún) | NO VERIFICADO (alojamiento UE, dominio, TLS) | 4-7 días del panel real sobre el prototipo | Aplicación nativa: mucho más esfuerzo y tienda de aplicaciones |
| Inicio de sesión | Passkeys (WebAuthn) con biblioteca de código abierto; respaldo: TOTP | No construido | NO VERIFICADO (la biblioteca suele ser gratuita; verificar licencia) | 2-4 días | Servicio de identidad externo: coste y subencargado nuevo |
| Servidor del panel | Programa pequeño (cola, sesión, registro) en un proveedor UE | No construido | NO VERIFICADO | 3-5 días | Reutilizar n8n: mezcla orquestación con interfaz, no recomendado |
| Aviso | Web Push con carga vacía/recuento, **o** correo a cuenta aparte **o** Telegram solo con recuento | No probado en móvil real | NO VERIFICADO (el push suele pasar por servicios de Apple/Google sin coste directo **[NV]**) | 1-2 días | Solo correo |
| Base de datos de cola, CRM y registro | La de EM (S6) | Pendiente | NO VERIFICADO | incluido arriba | |
| Voz (fase 2) | Síntesis de voz en el dispositivo o en la UE | No decidido | NO VERIFICADO | 2-3 días | Sin voz |
| Atajos | Dos enlaces que abren el panel | No construido | 0 € de licencias (por diseño) | menos de 1 día | |

**Totales:** sin cifras de coste. Hay un orden de magnitud de esfuerzo de **10 a 20 días de desarrollo** para el panel real con passkeys, servidor, aviso y modo asistente, **suposición mía sin base** que habría que validar con un prototipo en móvil real. No se instala ni se contrata nada (condición 12): el prototipo solo usa HTML y JavaScript sin dependencias, y Node ya instalado para las pruebas.

## 5. Seguridad de la interfaz (qué añade esta capa a EM)

| Riesgo de AR | Control en la interfaz | Probado |
|---|---|---|
| R3 exfiltración por enlaces/imágenes | Todo texto entra por `textContent`; `inerte()` neutraliza `![](…)`, HTML y enlaces; política de contenido (CSP) que prohíbe cargar nada externo | Pruebas de `inerte` y de ausencia de `fetch`, `innerHTML`, `<img>`, `<iframe>` |
| R4 aprobar sin mirar | Destinatario real, avisos, botón de aprobar deshabilitado con importes para la asistente, segundo paso, sin deslizar | Pruebas de roles y segundo paso |
| R9 canal suplantado | Solo cuentas vinculadas con passkey; el canal de aviso no tiene botones de decisión | Diseño; real: pendiente |
| R12 registro | Cada decisión con actor | Diseño; real: pendiente |
| R13 apagado | Gesto único, sin credenciales; reanudar con passkey | Pruebas de apagado y reanudar |
| Robo de dispositivo | Caché corta; cerrar sesión de otro dispositivo; modo viaje | Diseño; móvil real: pendiente |
| Pantalla de bloqueo | Solo recuento | Prueba |
| Secuestro del panel por XSS | CSP estricta, sin HTML dinámico, sin librerías externas | Pruebas de código |

Lo que **no** cubre esta interfaz: robo del dispositivo desbloqueado, coacción al titular, malware en el móvil, un humano que aprueba sin leer (se mitiga, no se elimina; EM sección 8).

## 6. Descartes y lo que no se hace

- WhatsApp: fuera (verificación, fila 6).
- Nada de aprobar por voz, por reloj ni desde una notificación.
- Nada de widgets con contenido.
- Nada de chat libre con el agente en el canal de aprobación en el MVP: ampliaría la superficie de inyección y contradice «alcance cerrado» (condición 11).
- Nada de envío automático ni «aprobar todo».
- Sin aplicación nativa en tienda en el MVP: más coste, revisión de terceros y dependencia.

## 7. Qué se puede prototipar ya (sin red ni credenciales)

Hecho en `negocio/trabajo/interfaz/prototipo/`:

| Archivo | Qué es |
|---|---|
| `index.html` | Panel de una página: Hoy (briefing), Aprobaciones, Bloqueo (simula la pantalla de bloqueo), Apagar. Selectores para rol (titular/asistente), en línea/sin conexión y segundo paso. Letra grande, claro/oscuro, botones de 48 px, política de contenido que bloquea todo lo externo |
| `logica.js` | Lógica pura, sin DOM: aviso de bloqueo, texto inerte, compilación del briefing con tiempo de lectura, cola con roles/segundo paso/sin conexión/caducidad, apagado, reanudar, guion de voz |
| `datos.js` | Datos ficticios (dominios reservados `.example`), alineados con la demo del MVP |
| `app.js` | Pinta con `textContent`; sin red ni almacenamiento |
| `tests/logica.test.js` | 20 pruebas con `node --test` (Node ya instalado; ningún paquete) |

Cómo ejecutarlo: abrir `index.html` en un navegador (funciona con doble clic, sin servidor); pruebas: `cd negocio/trabajo/interfaz/prototipo && node --test tests/logica.test.js`.

**Resultado de las pruebas (29/10/2026, Node 22):** 20 aprobadas, 0 fallos. Cubren: aviso de bloqueo solo con recuento; texto inerte; briefing legible en 60 s, riesgo primero, sin ocultar correos y con recuento exacto; segundo paso; no repetir decisión; inmutabilidad; permisos de asistente y delegación; intenciones sin conexión, sincronización y caducidad; apagado y reanudar; guion de voz de menos de 280 palabras y sin títulos en modo público; ausencia de red/envío/HTML dinámico/secretos en el código; correos solo de dominios reservados.

**Límites honestos:** la lógica está probada; **la interfaz no se ha abierto en un navegador ni en un móvil** (no hay navegador aquí): el código de pintado solo pasó comprobación de sintaxis. Falta: service worker e instalación como PWA, passkeys reales, aviso push real, pruebas con VoiceOver/TalkBack, comprobación de contraste. Nada de ello se puede hacer sin un dispositivo y, en parte, sin servicios (sección 8).

**Qué más se puede prototipar ya** (sin servicios, solo local): la vista de dossier y de radar de vencimientos (casos 3 y 4 de `viables-hoy.md`); un export a texto del briefing para pegar en un correo de prueba; ensayar el guion de voz con la síntesis del propio navegador (comprobando antes si envía audio a un servidor **[NV]**); el modo viaje; el idioma catalán. No lo he hecho: alcance cerrado (condición 11).

## 8. Decisiones y acciones que solo puede hacer la persona (condición 12)

1. **Aprobar el núcleo:** panel PWA con modo asistente (sección 1) y dejar fuera Telegram/Signal/iMessage de inicio. Es una decisión de producto y de gasto.
2. **Abrir `prototipo/index.html` en su móvil y en el ordenador** y decir si el briefing se lee en 60 s; es la única forma de validar la comodidad. También probarlo con una asistente ejecutiva real (conversación, no datos) para ver si el modo asistente tiene sentido.
3. **Decidir hosting UE y dominio** del panel (S4, EM) y si se contrata. Hasta entonces, nada se instala ni se paga.
4. **Elegir el canal de aviso:** push del panel, correo a cuenta aparte o Telegram solo con recuento (D2).
5. **Probar passkeys y notificaciones en un iPhone y un Android reales** (necesita los móviles de la persona o del cliente) y comprobar el comportamiento de la PWA instalada **[NV]**.
6. **Leer fuentes primarias** de lo marcado **[NV]**: web push y passkeys en iOS/Android; ajustes de notificaciones en bloqueo; permisos de atajos; WCAG 2.2.
7. **Abogado:** acceso del operador a contenido, delegación de la asistente como autorización documentada, tratamiento del titular y la asistente como usuarios con datos personales [ABOGADO].
8. **Revisión de las cadenas en castellano y catalán** por un hablante nativo.

## 9. Lo no verificado (resumen)

- Todo comportamiento de iOS, Android, Telegram, Signal, iMessage, Slack, Web Push, WebAuthn en PWA, atajos y relojes.
- Todos los costes; el orden de magnitud de días de desarrollo.
- Las puntuaciones de la comparativa (mi juicio).
- Los umbrales de 60 s, 12 h, 10 s, 24 h, 60 s de inactividad y 5 minutos de apagado (propuestas mías).
- La norma de accesibilidad y los tamaños mínimos de objetivo táctil.
- La residencia de cualquier servicio de aviso o de síntesis de voz (EM 7.2 sigue válido).
- Que el diseño reduzca de verdad el tiempo del cliente: no hay prueba con usuarios.

## 10. Archivos

```
negocio/trabajo/interfaz/
  diseno-interfaz.md             (este documento)
  prototipo/
    index.html  app.js  logica.js  datos.js
    tests/logica.test.js         (20 pruebas, node --test)
```
