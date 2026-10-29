# Puerta de calidad, ronda 1 (negocio «chief of staff digital»)

Fecha: 29/10/2026. Revisor: auditor-calidad. Revisado: todo `negocio/trabajo/` contra `cerebro/condiciones.md` (sobre todo 4, 6, 8, 10) y `cerebro/negocio/resumen.md`. No se ha corregido nada ni se ha hecho commit; lo rechazado se devuelve a su autor.

## Veredicto por departamento

| Departamento | Veredicto |
|---|---|
| Verificación | **RECHAZADO** (cond. 8 y 6) |
| Mercado | **APROBADO** (con 2 observaciones) |
| Seguridad | **APROBADO** (con 1 observación) |
| Demo y prototipo | **APROBADO** (con 3 observaciones; 1 de ellas a corregir en el texto) |
| Legal | **RECHAZADO** (cond. 8 y 6) |
| Ventas | **RECHAZADO** (cond. 8 y regla 4 del negocio) |

## Comprobaciones transversales (resultado)

- **Datos personales, credenciales, correos reales (cond. 4): sin fallos.** Búsqueda en `negocio/` de correos fuera de `.example`/`.test`, teléfonos, DNI/NIE, IBAN, claves y tokens: nada. Los únicos IBAN son ficticios (`ES00 0000 ...`, `datos/correos.json:77`, `chief/modelo.py:97`). Los nombres «Marta Soler» y «Pablo Demo» son ficticios y el CRM los marca así (`datos/crm_inicial.json`). Sin `__pycache__` versionado (`.gitignore` los excluye; `git ls-files negocio` no los lista).
- **Prototipo sin función de envío: confirmado.** `python3 -B -m unittest discover -s tests -t .` → `Ran 62 tests ... OK` (coincide con `especificacion-mvp.md:381`). Búsqueda manual en `chief/*.py` de send/enviar/smtp/socket/urlopen/subprocess/eval/exec/open(: solo aparecen comentarios y el patrón de detección en `chief/deteccion.py:17`. Ninguna función de envío ni de red. `demo.py` y `demo.py --ingenuo` ejecutados: 0 coincidencias de `http`, `![` o `atacante` en la salida ingenua; la salida normal coincide con lo que dice `guion-demo.md`.
- **Recálculo de clientes para 5.000 €/mes** (`mercado/estudio-mercado.md:49-59`): clientes = ⌈(5.000 + C) / cuota⌉. Recalculado celda a celda: 1.500 €: 5.500/1.500 = 3,67 → 4; 6.000/1.500 = 4,00 → 4; 6.500/1.500 = 4,33 → 5. 2.500 €: 2,2 / 2,4 / 2,6 → 3 / 3 / 3. 3.500 €: 1,57 / 1,71 / 1,86 → 2 / 2 / 2. 5.000 €: 1,1 / 1,2 / 1,3 → 2 / 2 / 2. **Las 12 celdas son correctas**, el rango «2 a 5» también, y `ventas/04-propuesta-diagnostico-piloto-retainer.md:36` lo repite igual. Comprobación de borde: 4 clientes × 1.500 − 1.000 = 5.000 justos. Nota: la tabla interpreta 5.000 € como beneficio tras costes C (supuestos sin verificar, bien declarado). Si fuera facturación bruta, saldría 4/2/2/1.
- **Precios coherentes con el resumen:** 1.500–3.000 / 3.000–6.000 / 8.000–25.000 / 1.500–5.000 €/mes en `ventas/04:18,27,34,35` (todos marcados HIPÓTESIS) igual que `cerebro/negocio/resumen.md` H3. Sin precio inventado.
- **WhatsApp:** coherente en todo (descartado como canal): `verificacion:17`, `ventas/01:12`, `ventas/02:10`, `ventas/04:11`, `demo/guion-demo.md:25`, `especificacion-mvp.md:6,40`. Sin contradicción.
- **Calendario** (`ventas/05`): 29/10/2026 es jueves, sem. 1 = 02/11, sem. 12 termina 24/01/2027, sem. 8-9 = 21/12-03/01. Fechas correctas.
- **Artículos inventados en legal:** ninguno. Los citados (art. 28 RGPD, art. 33/72 h, art. 9/10, Decisión de ejecución 2021/915) vienen del análisis de seguridad y van marcados [NV] o [ABOGADO]. Ver F-L3 por una cifra.

## Fallos por departamento (lo devuelto)

### Verificación: RECHAZADO

- **F-V1 (cond. 8 y 6).** `negocio/trabajo/verificacion/verificacion-informe.md:16` (fila 5) marca «Verificado en lo esencial (fuente secundaria)»; `:19` (fila 8) «Verificado (matizado)»; `:22` (fila 11) «Verificado en fechas y sede». Pero `:6` del propio informe dice que **ninguna cita se leyó en la fuente primaria**, y la condición 8 reserva [OFICIAL] a URL con cita literal; [BLOG]/secundaria no sostiene un GO. Fila 5 se apoya en The Register y Neowin (no oficiales), por lo que ni cumple el criterio que el propio `:6` fija («página oficial del proveedor»). Fila 11 se apoya en RankiaPro. **Corregir:** pasar las filas 5 y 11 a «No verificado (fuente secundaria)»; fila 8 a «No verificado, pendiente de leer la página oficial».
- **F-V2 (cond. 6, contradicción entre informes).** Estado de Fyxer: `verificacion-informe.md:19` lo da por «Verificado», pero `mercado/estudio-mercado.md:41-42` lo da por NO VERIFICADO. Tras F-V1 deben coincidir (los dos «No verificado»). Efecto en cadena: `verificacion-informe.md:28` («el único ancla verificable»), `ventas/04-propuesta-diagnostico-piloto-retainer.md:3` («el único precio verificable») y `demo/especificacion-mvp.md:332` («La única cifra verificada del proyecto») heredan el «verificado» y hay que reescribirlos.
- **F-V3 (cond. 6, contradicción de datos).** Fila 11 (`:22`) afirma «Verificado en sede» y «100 gratuitas para family offices»; `mercado/estudio-mercado.md:31` dice que las fuentes discrepan en sede (Hotel Miramar vs. por anunciar) y que es «solo por invitación». Una de las dos lecturas no vale; no puede constar «Verificado» la sede.

### Mercado: APROBADO

Cada dato tiene URL y fecha 2026-10-29 y todo está marcado NO VERIFICADO sin sostener GO (`:4`, `:8`). Aritmética correcta (ver arriba). Observaciones, no bloqueantes:
- O-M1 `mercado/estudio-mercado.md:59`: dice «coherente con H4 (5–15 clientes)», mientras `:65` admite que H4 «no investigado». La coherencia es con el texto del resumen, no con un dato. Reformular.
- O-M2 `:31` y `:41-42`: alinear con lo que decida Verificación (F-V2, F-V3).

### Seguridad: APROBADO

Todo lo de terceros lleva [V]/[NV]/[ABOGADO]; `gmail.compose` está bien tratado (`seguridad/analisis-riesgos.md:47-48`: puede enviar, [NV], decisión de la persona). Residencia UE de Anthropic marcada en conflicto (`:65`). Sin secretos ni datos personales. Observación:
- O-S1 `:29` cifra CVSS 10 / 100.000 instancias de una sola fuente (marcada [NV], correcto). Mantener fuera de cualquier argumento de venta.

### Demo y prototipo: APROBADO

Pruebas 62/62 ejecutadas por mí; sin función de envío ni red; datos solo `.example`/`.test`; la especificación reconoce que no demuestra nada con un LLM real (`especificacion-mvp.md:13`, `:368-379`) y que Req. 5 y 7 están pendientes. Observaciones:
- O-D1 (corregir texto) `demo/especificacion-mvp.md:332` llama a Fyxer «única cifra verificada del proyecto»; ver F-V2.
- O-D2 `demo/prototipo/tests/test_codigo.py:18-22` solo vigila el **nombre** de las funciones (`send`, `enviar`, ...). Es débil como garantía de «no envío»: un envío con otro nombre pasaría. El resto de la prueba (imports prohibidos, `:24-33`) y la lectura manual lo compensan hoy; se recomienda endurecerla antes del piloto.
- O-D3 `demo/guion-demo.md:6` ejecuta las pruebas sin `-B` (genera `__pycache__`, ya ignorado por git). Cosmético.

### Legal: RECHAZADO

- **F-L1 (cond. 8, contradicción con seguridad y especificación).** `negocio/trabajo/legal/03-condiciones-del-servicio.md:23` afirma como hecho «permisos mínimos (lectura y creación de borradores, sin envío ni borrado)». Según `seguridad/analisis-riesgos.md:47-48` y `demo/especificacion-mvp.md:19-31`, crear borradores exige `gmail.compose`, que **también envía** [NV], y `Mail.ReadWrite` permite borrar; la opción A (recomendada) no crea borradores en Gmail. Está pendiente de decisión de la persona. **Corregir:** quitar la afirmación o condicionarla a la opción elegida con [PENDIENTE]/[ABOGADO], como ya hace bien `legal/04-pagina-como-protegemos-tus-datos.md:14` y `legal/02-contrato-encargado-tratamiento.md:86`.
- **F-L2 (cond. 8 y 6, contradicción).** `legal/04-pagina-como-protegemos-tus-datos.md:41` promete «lo borramos todo, incluidos proveedores y copias»; `legal/02-contrato-encargado-tratamiento.md:101` admite copias de seguridad con ventana de caducidad, y `demo/especificacion-mvp.md:217` lista como no cubierto el borrado en copias, logs de n8n, LLM y canal. Promesa pública sin prueba y contradictoria.
- **F-L3 (cond. 8, cifra sin fuente).** `legal/03-condiciones-del-servicio.md:40` fija el tope de responsabilidad en «12 meses» de cuotas (y se repite en `legal/02:53` y `legal/05-preguntas-para-el-abogado.md:34,36`). No viene del resumen ni de ninguna fuente. Va con [ABOGADO], pero está redactado como cláusula, no como pregunta. **Corregir:** poner `[PLAZO: por decidir con abogado]` o declarar explícitamente «cifra propuesta por la IA, sin base».
- **F-L4 (cond. 8).** `legal/04-pagina-como-protegemos-tus-datos.md:3` dice que solo lo marcado [PENDIENTE] es no verificado, lo que sugiere que el resto sí lo está. Afirmaciones sin marca y sin prueba: `:28` («no puede enviar nada ni salir a internet»), `:32` («no pasan al modelo»), `:35` («Puedes exportarlo»), `:41` (ver F-L2), `:44-45` (NDA y contrato firmados antes). Marcar cada una [PENDIENTE] o aclarar en `:3` que todo es no verificado. La única salvaguarda real es el aviso «No publicar» (`:3`), correcto.
- **F-L5 (contradicción con ventas).** `legal/04:44` y la regla 4 del negocio: NDA antes de la primera conversación. Ver F-VT1.

### Ventas: RECHAZADO

- **F-VT1 (regla 4 del negocio, cond. 12).** `negocio/trabajo/ventas/01-guion-descubrimiento.md:9` dice «NDA ... acordado por escrito **si la otra parte lo pide**». La regla 4 de `cerebro/negocio/resumen.md` y `ventas/04-propuesta-diagnostico-piloto-retainer.md:10` y `legal/04:44` dicen NDA **antes de la primera llamada**. Además `ventas/05-calendario-12-semanas-y-eventos-2027.md:15-17` programa las primeras conversaciones (sem. 3-4) con el abogado solo «contratado o en proceso»: no hay NDA revisado a tiempo. **Corregir:** alinear el guion con la regla y añadir al calendario el hito «NDA revisado y listo» antes de la primera conversación (o declarar a la persona que incumple la regla 4 si lo mantiene).
- **F-VT2 (cond. 8, contradicción con la demo).** Se hacen afirmaciones de residencia UE a terceros sin verificar: `ventas/01:48` («datos en la UE», texto para decir en voz alta), `ventas/02-plantillas-primer-contacto.md:30` («con datos en la UE») y `:48` («tratamiento de datos en la UE»), `ventas/04:25` («LLM con residencia de datos en la UE» como parte del piloto). `demo/guion-demo.md:23-24` prohíbe decir «los datos están en la UE» y `seguridad/analisis-riesgos.md:65` y `especificacion-mvp.md:359` dejan la residencia del LLM sin verificar y en conflicto. **Corregir:** reformular como objetivo («el diseño exige datos en la UE; aún sin confirmar por escrito») o quitar la afirmación.
- **F-VT3 (cond. 6/8).** `ventas/04:3` repite que Fyxer es «el único precio verificable»; ver F-V2.
- Sin fallos en: datos personales (hoja con códigos C01–C20, sin nombres), WhatsApp, precios (todos HIPÓTESIS), calendario, umbrales marcados HIPÓTESIS (`ventas/03:48`).

## Qué debe hacer cada autor para volver a la puerta

1. verificador-fuentes: F-V1, F-V2, F-V3.
2. redactor-legal-confianza: F-L1, F-L2, F-L3, F-L4.
3. estratega-ventas-confianza: F-VT1, F-VT2, F-VT3 (y coordinarse con arquitecto-agentes para O-D1).
4. arquitecto-agentes: O-D1 (texto de `especificacion-mvp.md:332`), recomendado O-D2.

## Solo la persona (cond. 12)

Decidir opción A/B de `gmail.compose`; cerrar NDA con abogado antes de la primera conversación o aceptar saltarse la regla 4; confirmar por escrito la región UE del LLM; permitir dominios de fuentes primarias para repetir la verificación.

## Segunda pasada

Fecha: 29/10/2026. Revisor: auditor-calidad. Alcance: solo comprobar los fallos F-V1 a F-VT3 y las referencias cruzadas, más regresiones (commits `c354785`, `94f9b9c`, `c8e109d`). No se ha corregido nada ni se ha hecho commit.

| Departamento | Veredicto |
|---|---|
| Verificación | **APROBADO** |
| Legal | **APROBADO** (con 2 observaciones a corregir) |
| Ventas | **APROBADO** |

### Verificación: APROBADO
- F-V1 corregido: el informe ya no contiene ningún «Verificado» (`verificacion/verificacion-informe.md:6` lo declara; filas 5, 8 y 11 pasan a «No verificado»). Un barrido de «verificad» en todo `negocio/trabajo/` solo devuelve usos negados o hipótesis.
- F-V2 corregido y cruzado: `verificacion:19` y `mercado/estudio-mercado.md:41-42` coinciden (NO VERIFICADO); `verificacion:28`, `ventas/04:3` y `demo/especificacion-mvp.md:332` ya dicen «fuente secundaria / NO VERIFICADO / vista en un resumen de buscador».
- F-V3 corregido: `verificacion:22` recoge la discrepancia de sede y plazas, y `mercado/estudio-mercado.md:31` queda alineado.

### Legal: APROBADO (observaciones)
- F-L1 corregido: `legal/03-condiciones-del-servicio.md:23` pasa a opción A recomendada / opción B condicionada, con [NV], [ABOGADO] y [PENDIENTE: decisión A/B]; admite que `gmail.compose` también envía.
- F-L2 corregido: `legal/04-pagina-como-protegemos-tus-datos.md:41` admite la ventana de caducidad de copias y deja [PENDIENTE] el borrado en copias, logs, modelo y canal.
- F-L3 corregido: el tope de 12 meses va como «PROPUESTA sin base verificada» (`legal/03:40`, `legal/02:53`, `legal/05:34`).
- F-L4 corregido: `legal/04:3` declara que todo el texto es no verificado, y `:28`, `:32`, `:35`, `:44-45` llevan [PENDIENTE]. F-L5 resuelto con F-VT1.
- Observación OL-1 (corregir): `legal/02-contrato-encargado-tratamiento.md:32` afirma «Los datos se tratan y almacenan en la UE» sin [NV]/[PENDIENTE], cuando el Anexo III (`:76-77`) tiene la residencia del LLM y de n8n sin confirmar. Es un contrato borrador, pero conviene condicionarlo como ya hace `legal/03:31`.
- Observación OL-2 (corregir): `legal/02:86` sigue diciendo «solo lectura más creación de borradores; sin envío ni borrado» como regla. Lleva el aviso sobre `gmail.compose`, pero `Mail.ReadWrite` también permite borrar y la opción A no crea borradores en el buzón. Alinear con `legal/03:23`.

### Ventas: APROBADO
- F-VT1 corregido: `ventas/01-guion-descubrimiento.md:7-8` exige NDA firmado antes de la llamada y limita lo previo a 10 minutos sin información confidencial; `ventas/02:13`, `ventas/04:10` y `ventas/05:15-16` (puerta «NDA revisado antes de la primera llamada») coinciden con la regla 4.
- F-VT2 corregido: «datos en la UE» pasa a objetivo a confirmar por escrito en `ventas/01:48`, `ventas/02:31,49` y `ventas/04:7,25`. Sin afirmaciones residuales en ventas.
- F-VT3 corregido (ver F-V2).

### Regresiones
- Sin «Verificado» sin lectura primaria, sin artículos nuevos (solo el art. 28 ya existente, marcado no leído), sin cifras nuevas con apariencia de dato (el «10 minutos» es una propuesta de procedimiento). Sin datos personales nuevos. Promesas públicas de `legal/04` todas con [PENDIENTE] o bajo el aviso «No publicar».

### Lo que queda
- OL-1 y OL-2 (redactor-legal-confianza), no bloqueantes pero a corregir antes de enseñar el contrato.
- O-M1 sin tocar: `mercado/estudio-mercado.md:59` sigue diciendo «coherente con H4 (5–15 clientes)» pese a que H4 está «no investigado» (`:65`). Reformular.
- O-D2 (prueba de no envío por nombre de función) sigue abierta, recomendada antes del piloto.
- Sigue pendiente solo de la persona: decisión A/B de `gmail.compose`, NDA revisado por abogado antes de la primera llamada, confirmación escrita de la región UE del LLM, abrir dominios de fuentes primarias para pasar de «No verificado» a «Verificado».
