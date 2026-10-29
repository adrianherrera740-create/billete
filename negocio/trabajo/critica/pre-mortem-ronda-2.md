# Pre-mortem del negocio «chief of staff digital» (ronda 2, tarea 10)

Fecha: 29/10/2026. Autor: critico-escepticismo. Estado: **NO VERIFICADO** (cond. 8). Sin datos personales. Revisado tras la puerta de calidad de ronda 2 (F-P1 a F-P3).
Leído: `cerebro/negocio/resumen.md`, `negocio/trabajo/{mercado,ventas,legal,seguridad,demo,casos-de-uso,calidad/ronda-1.md,verificacion}`.

**Convención.** Probabilidad (P) e impacto (I) son **JUICIO MÍO**, no dato: Baja / Media / Alta, sobre el escenario «a fecha 29/04/2027 el negocio no tiene un cliente que pague cuota recurrente». No hay base estadística detrás. Cada cifra que aparece en los informes sigue en NO VERIFICADO; aquí no añado ninguna.

## 0. Lo que más pesa antes de empezar (hechos del propio repo)

1. **Nada del mercado se ha leído en fuente primaria.** `mercado/estudio-mercado.md:8-9`: WebFetch falló en todos los dominios; todo es resumen de buscador. H1-H4 son hipótesis puras. Los precios (H3) vienen de un informe generado por IA con anclas de Londres/EE. UU.
2. **El único activo construido es un simulador.** La demo es un prototipo Python con un «modelo» simulado (`demo/guion-demo.md:14`; `demo/especificacion-mvp.md:13`). Las 62 pruebas prueban las reglas del código propio, no el comportamiento de un LLM real ante inyección. Y la arquitectura prometida al cliente (n8n + LLM UE + Workspace/M365) **no es** lo que se demuestra. Riesgo de venta: se enseña una cosa y se entrega otra.
3. **No se sabe si la persona tiene red en este mundo.** Ningún documento dice cuántos contactos de confianza hay en family offices, banca privada o asistentes ejecutivas. Todo el plan (20 conversaciones, H2 «se llega por intermediarios») presupone una entrada que no está medida. Es el dato que más falta.
4. **El calendario ya se come el semestre.** Sem. 1 = 02/11; conversaciones reales desde sem. 4 (23/11); Navidad sem. 8-9; piloto 1 arranca sem. 10 (04/01) y dura 4 semanas; retainer «hacia febrero» (`ventas/05-calendario-12-semanas-y-eventos-2027.md:30`). A los 6 meses (finales de abril 2027) caben, como mucho, 1 piloto cerrado y 1 decisión de retainer. Un solo fallo de plazo (abogado tarde) y no hay ni eso.
5. **Contradicciones vivas entre informes** (ronda 1 las corrigió en parte; quedan): residencia UE sin confirmar frente a regla 2 «solo en la UE» como regla no negociable; `gmail.compose` puede enviar frente a regla 1 «nada se envía solo» (decisión A/B pendiente); borrado «certificado» prometido frente a copias/logs/LLM no cubiertos (`demo/especificacion-mvp.md:217`); OL-1/OL-2 y O-M1 abiertas.

## 1. Pre-mortem: por qué fallaría en 6 meses

Orden: de mayor a menor riesgo compuesto (mi juicio).

### R-01 Canal: no hay entrada a la clientela (H2 sin base)
- **Fallo:** 20 conversaciones no llegan o son con perfiles que no compran (curiosos, estudiantes de IA, otros proveedores). Los intermediarios no recomiendan a un desconocido sin caso de éxito ni clientes (el guion prohíbe mencionar clientes: «no los hay»).
- **P: Alta. I: Crítico** (es la métrica de decisión del mes 4). *(juicio)*
- **Señal temprana:** a fin de sem. 5 menos de 5 conversaciones hechas, o la mayoría vienen del círculo propio y no de presentaciones; tasa de respuesta a plantillas en frío por debajo de «unas pocas de cada 20» (umbral mío, a fijar antes).
- **Mitigación barata:** antes de escribir a nadie, hacer en 1 hora una lista de contactos *ya existentes* en cada uno de los 4 perfiles y contarlos. Si son menos de 10 en total, el plan de 20 conversaciones en 7 semanas no es creíble: reducir a 10 y cambiar el criterio de parada.

### R-02 Confianza: nadie da acceso al correo de un patrimonio a un proveedor unipersonal sin historial
- **Fallo:** el interlocutor encuentra la idea interesante y no concede ni una prueba con datos reales. Se queda en demos ficticias eternas. NDA previo a la primera llamada (regla 4) añade fricción y retrasa el calor del contacto.
- **P: Alta. I: Crítico.** *(juicio)*
- **Señal temprana:** en las conversaciones la barrera citada es «confidencialidad/control» en 10 o más de 20 (esto confirma H1, pero también anuncia que no comprarán) y, además, ninguno acepta un diagnóstico sin acceso a datos.
- **Mitigación barata:** poner la primera venta fuera del buzón real (ver C-02, C-03). Pedir a cada interlocutor, en la conversación, qué prueba de confianza concreta aceptaría y anotarla literal.

### R-03 Capacidad de una sola persona
- **Fallo:** la persona hace a la vez ventas, legal, seguridad, desarrollo, operación y soporte con un presupuesto de horas desconocido. El tiempo por cliente nunca se ha medido (`mercado/estudio-mercado.md:59`, `ventas/04-propuesta-diagnostico-piloto-retainer.md:36`). Un piloto de 4 semanas con un cliente exigente absorbe todo y las conversaciones se paran. Además, un servicio «alto patrimonio» implica disponibilidad ante incidentes; una persona no puede cubrir vacaciones ni enfermedad.
- **P: Alta. I: Alto.** *(juicio)*
- **Señal temprana:** sem. 2 y 3 sin que el NDA o el material estén listos «por falta de tiempo»; horas reales semanales dedicadas por debajo de lo asumido. Nunca se ha declarado cuántas horas/semana tiene la persona: **ese dato falta**.
- **Mitigación barata:** declarar por escrito horas/semana disponibles, y limitar a 1 piloto simultáneo. Cronometrar horas de cada tarea del prototipo (briefing, triaje) y de las del cliente, desde el primer piloto, para poder hablar de coste real.

### R-04 Responsabilidad legal y falta de seguro
- **Fallo:** un borrador manipulado aprobado a ciegas (R4 del análisis) o un briefing que oculta un correo importante causa un daño económico o reputacional. El tope de «12 meses de cuota» es una propuesta de IA sin base (F-L3) y puede ser inválido para dolo o culpa grave y no oponible a terceros [ABOGADO, no verificado] afectados. Sin seguro de RC/ciber y sin forma jurídica separada (persona física autónoma), el patrimonio personal responde [ABOGADO, no verificado]. La clientela tipo puede litigar.
- **P: Media (en 6 meses, con pocos clientes). I: Crítico.** *(juicio)*
- **Señal temprana:** el abogado no cierra las preguntas 18, 19, 27, 28 (`legal/05`) antes del primer piloto; el seguro no se consigue o excluye IA.
- **Mitigación barata:** no empezar ningún piloto con datos reales sin (a) respuesta escrita del abogado a esas 4 preguntas y (b) presupuesto de seguro en mano, aunque no se contrate. Con eso se decide con información; sin eso se está apostando.

### R-05 Regulación UE y RGPD más pesada de lo asumido
- **Fallo:** el abogado dictamina que hace falta EIPD, que los datos de categoría especial llegan sí o sí en un buzón real y que la exclusión «por regla» no basta, o que el rol no es solo encargado. El coste de cumplir (EIPD, registro, auditorías, seguro) supera la cuota de 1.500 €/mes. Además el Reglamento de IA de la UE y el estado del marco UE-EE. UU. no se han analizado: **ningún informe de `negocio/` ni `cerebro/` menciona el AI Act** (grep hecho). Para un servicio que usa un LLM de tercero con datos personales, cuestiones de transparencia y roles pueden aplicar. Dato que falta: lectura del texto vigente.
- **P: Media. I: Alto.** *(juicio)*
- **Señal temprana:** respuesta del abogado a las preguntas 15-17 (EIPD, categorías especiales) con «sí, obligatoria» y presupuesto de horas alto.
- **Mitigación barata:** incluir el AI Act y el estado actual del marco de transferencias en la primera consulta al abogado; preguntar si hay un camino sin buzón real (ver C-03).

### R-06 Dependencia de LLM y APIs que cambian
- **Fallo:** (a) La residencia UE del LLM sigue sin confirmar; si el proveedor elegido no la ofrece, la regla 2 se rompe y no hay producto. (b) Cambios de versión del modelo alteran el triaje (la batería de pruebas de inyección se hizo con un simulador, no con el modelo real). (c) Google/Microsoft cambian alcances OAuth, exigen verificación de app (CASA) o limitan acceso de terceros; el análisis ya dice que las fuentes discrepan. (d) El coste por token no está estimado en ninguna parte.
- **P: Media-Alta. I: Alto.** *(juicio)*
- **Señal temprana:** respuesta del proveedor de nube/LLM por escrito sobre región de inferencia y retención; si no llega en 2 semanas o es ambigua. Primera ejecución de la batería R1-R4 con un modelo real: cualquier obediencia a una instrucción maliciosa.
- **Mitigación barata:** pedir confirmación por escrito a 2 proveedores en la sem. 1 (es solo un correo). Diseñar el prototipo con una capa de modelo intercambiable (ya hay `modelo.py`) y una batería de regresión que se ejecute cada vez que cambie el modelo.

### R-07 Inyección de prompts: un fallo real o aparente en la primera demo con datos vivos
- **Fallo:** con un modelo real, algún caso que escape a las defensas (no hay garantía, ni siquiera con esquemas de salida; sin cifra, supuesto mío) aparece justo delante de un cliente. La confianza se pierde de golpe. Además, la demo actual puede dar falsa seguridad: el guion dice que el resultado es «el mismo» con un modelo ingenuo, pero eso es consecuencia de reglas deterministas que dejan fuera del modelo la decisión, lo que a su vez limita el valor del producto (el resumen lo compone una plantilla).
- **P: Media. I: Alto.** *(juicio)*
- **Señal temprana:** primera batería con un modelo real y 50+ repeticiones; cualquier fuga de URL/imagen o cambio de prioridad.
- **Mitigación barata:** no usar el argumento «es seguro»; usar el argumento «el diseño no necesita que el modelo se resista» y enseñar cuáles son las 3 patas de la trifecta y cuál se rompe. Endurecer O-D2 (la prueba de no envío mira solo nombres de función) antes de cualquier piloto.

### R-08 Competencia de Microsoft, Google y OpenAI
- **Fallo:** Copilot en Outlook/Teams y Gemini en Workspace traen resúmenes de correo, preparación de reuniones y borradores incluidos en la suscripción que el cliente ya paga. Fyxer ya cuesta decenas de USD/mes. El cliente se pregunta por qué pagar 1.500+ €/mes por lo mismo. Los informes dicen **«Microsoft Copilot, Google Gemini: no investigados, sin dato»** (`mercado/estudio-mercado.md:45`). Estamos juzgando un diferencial contra un competidor al que no hemos mirado.
- **P: Alta (a que se cite como objeción). I: Alto.** *(juicio)*
- **Señal temprana:** en las conversaciones, «ya tengo Copilot/Gemini» o «mi asistente ya usa Fyxer». Contar cuántas veces sale.
- **Mitigación barata:** antes de la conversación 1, una hora leyendo qué hacen Copilot y Gemini hoy con correo, agenda y reuniones (páginas oficiales; requiere abrir dominios, tarea de la persona). Convertir «lo que ellos no hacen» en una sola frase comprobada, o descartar el posicionamiento.

### R-09 Competencia de los bancos y family offices multi-cliente
- **Fallo:** la banca privada y los multi family offices ofrecen «servicios de conserjería/operaciones» a sus clientes con equipos humanos y marca de confianza. Si añaden IA, lo hacen bajo su propio contrato y su propia residencia de datos. Además los intermediarios que se pretende usar como canal (banca privada, abogados, gestores) son, a la vez, competencia potencial y pueden ver a un proveedor externo como riesgo para su propia relación con el cliente.
- **P: Media. I: Medio-Alto.** *(juicio)*
- **Señal temprana:** un intermediario responde «ya lo estamos haciendo dentro» o pide exclusividad / ser el proveedor.
- **Mitigación barata:** preguntar explícitamente en cada conversación con un intermediario «¿esto os ayuda o os compite?» y anotarlo (columna «Intermediario válido» de la hoja).

### R-10 Precio: hipótesis sin ancla en España
- **Fallo:** las conversaciones dicen que 1.500-3.000 € por un diagnóstico es caro para algo sin caso de éxito, o demasiado barato para ser creíble para ese perfil. Los 2-5 clientes del cálculo dependen de cuotas y costes C que son supuestos (500/1.000/1.500 €/mes), sin incluir cuota de autónomos, impuestos, seguro ni abogado recurrente.
- **P: Media-Alta. I: Alto.** *(juicio)*
- **Señal temprana:** 3 o más rangos espontáneos por debajo del extremo bajo (regla de ajuste ya escrita en `ventas/04-propuesta-diagnostico-piloto-retainer.md:46`); pedir «prueba gratis» o «prueba de un mes».
- **Mitigación barata:** la regla de calibración ya existe. Añadir: preguntar siempre cuánto cuesta hoy la asistente humana o el tiempo del cliente, y comparar con la cuota.

### R-11 Estructura de ingresos: demasiado pocos clientes grandes, ciclo de venta largo
- **Fallo:** con 2-5 retainers como objetivo, un abandono o un cliente que tarda 4 meses en decidir deja el negocio en cero. El ciclo de venta a patrimonios por recomendación suele medirse en meses (juicio, sin dato). Plan: primer diagnóstico firmado en sem. 7.
- **P: Alta. I: Alto.** *(juicio)*
- **Señal temprana:** a fin de sem. 7, ningún diagnóstico firmado (hito ya definido).
- **Mitigación barata:** mantener una segunda fuente de ingresos o un colchón declarado; ver C-02 (producto de entrada de ciclo corto).

### R-12 Brecha o incidente en el propio sistema
- **Fallo:** un n8n sin parchear (el análisis cita una vulnerabilidad crítica de una sola fuente), token OAuth robado, canal de aprobación comprometido. Un solo evento acaba con la confianza y es notificable (72 h) [ABOGADO, art. 33 no leído en fuente primaria] con la persona sola.
- **P: Baja-Media (poca exposición temprana). I: Crítico.** *(juicio)*
- **Señal temprana:** simulacro de brecha (R18) sin plan escrito; n8n expuesto.
- **Mitigación barata:** en el piloto, tokens revocables en la cuenta del cliente, un único buzón, sin canal de aprobación con contenido; hacer el simulacro de brecha antes del piloto.

### R-13 Reputación por promesas de la «página de confianza»
- **Fallo:** `legal/04` lista promesas (borrado total, sin salida a internet, residencia UE) que hoy no tienen prueba. Si se publican y algo no se cumple, es publicidad engañosa y pérdida de confianza.
- **P: Baja (está bajo «No publicar»). I: Alto.** *(juicio)*
- **Mitigación barata:** mantener el aviso; ninguna frase pasa a público sin una prueba enlazada.

## 2. Cinco cambios de posicionamiento o de modelo

Para cada uno: qué cambia, por qué sube la probabilidad de éxito (juicio mío), qué regla toca y qué dato falta para creerlo.

### C-01 Cliente primero: la asistente ejecutiva / chief of staff humano, no el titular del patrimonio
- **Cambio:** vender (o regalar un piloto) a la persona que *ya protege* el tiempo del titular, en su propio buzón y agenda, como herramienta de ella. Ella decide qué se comparte con el titular. El titular es el «segundo cliente» más adelante.
- **Por qué ayuda:** baja la barrera de confianza (la persona de confianza decide), acorta el ciclo (puede pagar o proponer un gasto menor) y encaja con el resumen («quien protege el tiempo del patrimonio») y con los hallazgos de herramientas (Fyxer es producto para EAs).
- **Regla que toca:** ninguna. Refuerza la regla 1 (la EA es el humano que decide). Matiz: el buzón de una EA contiene igualmente datos del titular; regla 2 y art. 28 siguen aplicando.
- **Dato que falta:** si las EAs de este segmento tienen presupuesto o autoridad de compra, o si dependen del titular para cualquier gasto. Y si les parece una amenaza a su puesto.

### C-02 Vender el diagnóstico de 2 semanas como producto en sí, sin acceso a datos reales
- **Cambio:** diagnóstico con precio cerrado, entregable útil por sí mismo (mapa de flujos, riesgos de privacidad, 1-2 casos priorizados, plan), basado en entrevistas y en datos de ejemplo del cliente anonimizados o sintéticos. Pasar a piloto es opcional.
- **Por qué ayuda:** primer ingreso en sem. 7 en lugar de sem. 10+; elimina el bloqueo de R-02 (no hay buzón real); da un caso de éxito y aprendizaje sobre horas reales (R-03).
- **Regla que toca:** ninguna; ya está en la propuesta (`ventas/04-propuesta-diagnostico-piloto-retainer.md:14-18`), solo se promociona de «paso previo» a «producto». Cuidado con cond. 6: el valor lo debe confirmar el cliente, no la IA.
- **Dato que falta:** si alguien paga 1.500-3.000 € por un informe de un proveedor sin historial (esto es la H3 con otra cara). Competidor a mirar: las consultoras de IA generalistas.

### C-03 Implantación con las herramientas del cliente, sin infraestructura propia (el cliente es el responsable y el operador técnico)
- **Cambio:** en vez de que la persona opere n8n + base de datos + canal de aprobación y sea encargada, configurar en la cuenta del cliente lo que ya tiene (asistente integrado de su suite, reglas, plantillas de prompts, formación de la EA) y entregar un manual y un protocolo de seguridad. El servicio es consultoría de configuración + supervisión, no un SaaS de operación.
- **Por qué ayuda:** reduce de golpe R-04, R-05, R-12 y parte de R-06 (la persona no custodia datos ni tokens; el LLM lo contrata el cliente, con su propio DPA); cabe en una sola persona; baja el coste C.
- **Regla que toca:** ninguna de las 6 reglas se rompe (n8n y el LLM de nuestra elección son arquitectura propuesta, no regla); la 1 y la 2 se cumplen igual o mejor. Lo que sí rompe es la **arquitectura del prototipo y de la especificación** (n8n + LLM elegido por nosotros) y el **diferencial** «agentes a medida con registro auditable propio»: queda menos que mostrar y más cerca de lo que Copilot/Gemini ya hacen (R-08). Hay que decirlo claro.
- **Dato que falta:** qué hace hoy Copilot/Gemini con permisos y registro, y si cubre lo que el cliente valora. Sin eso no se sabe si C-03 deja un producto con valor.

### C-04 Nicho concreto en vez de «patrimonios altos»: elegir un solo perfil de cliente y una sola tarea
- **Cambio:** por ejemplo, «equipo de apoyo (EA o chief of staff) de un family office pequeño o fundador con exit en Barcelona» y una sola entrega: briefing + dossier de reuniones (la 1 y la 3 de `casos-de-uso`), sin triaje ni CRM al principio. Mensaje de una frase.
- **Por qué ayuda:** el mensaje de ventas es repetible, las conversaciones son comparables (la hoja exige ≥3 por perfil de 4 tipos, lo que con una red pequeña dispersa la señal), y el producto es el de menor riesgo (menos superficie de inyección, ningún borrador que pueda enviar).
- **Regla que toca:** ninguna. Reduce el alcance (cond. 11 a favor).
- **Dato que falta:** cuál de los perfiles tiene el dolor más citado con ejemplo reciente (criterio ya en la hoja: 8 de 20). Elegir el nicho *después* de las primeras 5-8 conversaciones, no antes.

### C-05 Alianzas con gestores y abogados como canal y como cobertura jurídica, no solo como «intermediarios que recomiendan»
- **Cambio:** proponer a 2-3 despachos o gestores de confianza un acuerdo concreto: ellos incluyen el servicio en su relación con el cliente (el cliente contrata con el despacho, o el despacho es co-responsable de la relación); a cambio, el despacho aporta credibilidad, contrato marco, seguro y revisión jurídica. Recomendación pagada a éxito *solo si el abogado lo permite* (conflicto de interés y deontología: [ABOGADO]).
- **Por qué ayuda:** ataca a la vez R-01 (canal), R-02 (confianza heredada) y R-04 (estructura legal compartida).
- **Regla que toca:** puede tocar la **regla 6** (el abogado revisa antes del primer contrato: aquí el abogado es parte comercial, no solo revisor; conflicto de interés a declarar) y **la regla 4** si el despacho exige conocer casos o clientes. Hay que declarar: si el despacho recomienda, la persona no controla el NDA con el cliente final.
- **Dato que falta:** si algún despacho o gestor quiere asociarse y bajo qué condiciones; y si su deontología permite cobrar por recomendar.

(Alternativa descartada por mí: «asistente de consumo barato, tipo Fyxer, en español». No toca reglas pero compite en precio con productos masivos que ya existen.)

## 3. Los 5 supuestos más peligrosos y cómo comprobarlos barato

Todos se comprueban dentro de las 20 conversaciones; añadir a la hoja de seguimiento solo la columna o pregunta indicada, sin datos personales.

| # | Supuesto peligroso | Por qué es peligroso | Forma más barata de comprobarlo en la conversación | Qué respuesta lo mata |
|---|---|---|---|---|
| S1 | **«Hay red y se llega por presentación» (H2) y la persona tiene acceso a ≥10 contactos relevantes.** | Si falla, no hay conversaciones y el resto es irrelevante. | Antes de nada, contar contactos existentes por perfil. En cada conversación, al cierre: «¿A quién conoces que viva esto?» y apuntar *si* da un nombre al instante (sí/no, sin el nombre). | Menos de 3 de 10 conversaciones acaban con una presentación ofrecida. |
| S2 | **«Quien decide es alcanzable y se fía de un proveedor unipersonal con NDA y demo ficticia».** | El mayor freno es la confianza (H1) pero, aun confirmada, puede significar «no compraré nunca» en vez de «compraré si hay garantías». | Pregunta 9 del guion, pero cerrada: «¿Qué tendría que existir, concretamente, para que me dieras acceso de solo lectura a un buzón durante 2 semanas?». Anotar literal si es algo que se puede cumplir (seguro, abogado, UE) o algo imposible (referencias, años de historia). | La mayoría pide referencias de clientes o historial que no existen. |
| S3 | **«El valor es mayor que lo que ya trae su suite (Copilot/Gemini/Fyxer)».** | No se ha investigado el competidor más obvio. Si el cliente ya tiene resúmenes y borradores incluidos, la cuota de 1.500+ € no se sostiene. | Pregunta 7 del guion («¿habéis probado IA?») ampliada: «¿Qué usáis hoy? ¿Qué le falta?» y contar cuántos nombran Copilot, Gemini o Fyxer. | 5 de 20 o más dicen «ya lo hace mi herramienta» y no citan una carencia concreta. |
| S4 | **«Pagarán 1.500-3.000 € por un diagnóstico y 1.500-5.000 €/mes de cuota» (H3), y quien paga es quien conversa.** | Todo el cálculo de 2-5 clientes depende de ello. Los anclas son de Londres/EE. UU. | Preguntas de coste actual (ya están en el guion) y, a partir de la conversación 5-8, presentar dos opciones de diagnóstico y ver cuál se elige (`ventas/04-propuesta-diagnostico-piloto-retainer.md:45`). Añadir: «¿Quién firmaría esto, tú o alguien más?» | Rangos espontáneos por debajo del extremo bajo en 3 o más, o «tengo que consultarlo» sin decir con quién. |
| S5 | **«Una persona puede entregar y operar esto con calidad y con seguridad en ese plazo y con ese coste».** | Nunca se ha medido tiempo por cliente. Incluye legal, seguridad, soporte, y la barrera que reclamarán (seguro, abogado). | Preguntar al cliente cuánto soporte espera («¿qué pasa si falla a las 7:00 un lunes?», «¿quién responde?») para conocer el nivel de servicio exigido; y cronometrar horas propias desde la primera semana. Sin necesidad de un cliente: medirlo con el prototipo ficticio. | El nivel de disponibilidad exigido (24/7, respuesta en horas) no cabe en una persona, o el abogado dice que hace falta estructura societaria y seguro caros antes del primer piloto. |

## 4. Datos que faltan para creer la propuesta (lista de «no creo nada de esto hasta ver…»)
1. Número real de contactos de la persona por perfil, y horas/semana disponibles.
2. Lectura primaria de Copilot y Gemini (qué hacen hoy con correo y agenda, y a qué precio).
3. Confirmación escrita de región UE de inferencia, almacenamiento y retención del LLM elegido.
4. Respuesta escrita del abogado a las preguntas 15-21, 27 y 28 (EIPD, responsabilidad, seguro, forma jurídica) y mención del AI Act.
5. Una batería R1-R4 ejecutada con un modelo real, repetida, con los resultados documentados.
6. Al menos 3 rangos de precio espontáneos de interlocutores reales (regla de `ventas/04-propuesta-diagnostico-piloto-retainer.md:48`).
7. Alguien que, en una conversación, nombre un coste concreto reciente de un fallo operativo (8 de 20, criterio ya definido).

## 5. Observaciones sobre los propios informes (contradicciones y puntos débiles)
- `mercado/estudio-mercado.md:59` sigue diciendo «compatible con H4» cuando H4 no se investigó (O-M1 de ronda 1 sin cerrar).
- El hito de «6 meses» del encargo (abril 2027) es posterior a la métrica de decisión del mes 4 (febrero 2027) y al calendario; si el mes 4 da cero, el negocio ya habría parado antes de los 6 meses. Por eso este pre-mortem trata el mes 4 como el punto donde se decide y los 6 meses como el horizonte de caída.
- La regla 2 («solo en la UE») y la regla 1 («nada se envía solo») se cumplen hoy solo en el prototipo; en el sistema real dependen de decisiones no tomadas (proveedor LLM, opción A/B de `gmail.compose`). Mientras tanto, cualquier frase de venta debe seguir como «objetivo».
- Cualquier cambio de los C-01 a C-05 que modifique el modelo de negocio exige propuesta corta y luz verde de la persona (cond. 1) y entrada en `decisiones.md` (cond. 5). No se ha tomado ninguna decisión aquí.

## 6. Solo la persona (cond. 12)
Decidir cuáles de C-01 a C-05 prueba; contar sus contactos y declarar horas/semana; abrir las páginas oficiales de Copilot y Gemini y de los proveedores de LLM; pedir presupuesto de seguro; incluir AI Act y transferencias en la consulta al abogado.
