# Puerta de calidad: kit del asesor personal (ronda kit-1)

Fecha: 30/10/2026. Revisor: auditor-calidad. Alcance: `negocio/trabajo/kit/` completo (4 documentos + 6 plantillas). Contrastado con `cerebro/condiciones.md` (4, 6, 8, 10, 12) y `cerebro/negocio/estrategia-asesor-personal.md`. No se ha corregido nada ni hecho commit. Todo el kit sigue NO VERIFICADO (correcto, condición 8).

## Resultado global: RECHAZADO (5 de 10 documentos devueltos; fallos menores, ninguno de secretos)

| Documento | Veredicto |
|---|---|
| `kit/guion-entrevista-diagnostico-90min.md` | APROBADO |
| `kit/propuesta-una-pagina.md` | RECHAZADO |
| `kit/guion-5-conversaciones.md` | RECHAZADO |
| `kit/nota-renfe.md` | RECHAZADO |
| `kit/plantillas/libro-de-operaciones.md` | RECHAZADO |
| `kit/plantillas/protocolo-antifraude.md` | RECHAZADO |
| `kit/plantillas/muestra-anonimizada-de-entregable.md` | RECHAZADO |
| `kit/plantillas/inventario-de-accesos-y-bajas.md` | APROBADO |
| `kit/plantillas/sobre-de-emergencia.md` | APROBADO |
| `kit/plantillas/calendario-de-plazos.md` | APROBADO |

(Son 6 rechazados y 4 aprobados.)

## Comprobaciones transversales que PASAN
- Condición 4: búsqueda de correos, URL, IBAN, DNI y dominios en todo el kit. Solo aparecen dominios `.example` y teléfonos `+34 600 000 00X` ficticios. Ninguna contraseña, clave, PIN ni combinación; las plantillas lo prohíben expresamente (inventario l.6, libro l.5, sobre l.9, protocolo l.34).
- Condición 8: todos los documentos llevan NO VERIFICADO y [IDEA]/[ABOGADO]/[CONFIRMAR CON ASESOR] donde toca.
- Fechas fiscales y umbrales: `calendario-de-plazos.md` (l.3, 23-28, 34-36, 74-76), `libro-de-operaciones.md` (l.56, 122) y `sobre-de-emergencia.md` (l.54, 109) no contienen ninguna fecha fiscal real; todo va como [CONFIRMAR CON ASESOR]. Las fechas de la Parte A (1/3/2027, 20/5/2027...) son no fiscales y marcadas ficticias.
- Nada se presenta como asesoramiento: avisos explícitos en todos los documentos (propuesta l.16, entrevista l.13 y 73, muestra l.108).
- Nota de Renfe: no contiene datos sobre Renfe (l.3 lo declara; todo son preguntas e hipótesis [IDEA]).
- Coherencia con solo recuento (`interfaz/diseno-interfaz.md` l.16, 170) y con la opción A de Gmail (`cerebro/decisiones.md` l.15, 18): el kit no define ningún canal de aviso ni da acceso a buzón (propuesta l.24, muestra l.12), así que no contradice nada. Hueco: ver observación O1.

## Fallos por documento

### kit/propuesta-una-pagina.md: RECHAZADO
1. **Cond. 6/8, cifra sin marcar como propuesta.** L.44: «la regla de partida es no más de 8 horas al mes por cliente» se presenta como regla firme. En la estrategia (Paso 4, Puerta 3) es «[PROPUESTA mía]». Corregir: marcarla [PROPUESTA] y decidir si un tope interno de horas debe aparecer en un documento que se enseña al cliente.
2. **Contradicción en el orden del NDA (condición 12 y estrategia Paso 3).** L.47 dice que la conversación inicial es «tras NDA» y l.48 sitúa NDA y encargo en el paso 2 (después de esa conversación); l.33 dice «antes de empezar» y l.36 «antes de la primera conversación sustantiva». Unificar: NDA antes de la conversación inicial; encargo antes de ver nada.
3. **Encargo demasiado tardío.** L.37: el encargo (art. 28) se exige «antes de ver datos personales». La estrategia (Paso 3) exige NDA y encargo firmados «antes de ver nada». Corregir a «antes de ver cualquier documento o dato».
4. **Promesa implícita (regla «ayuda, no garantiza»).** L.8: «que un pago falso no pase y que ningún plazo se escape» se lee como resultado garantizado y choca con l.20 («No garantizo resultados»). Reformular como «reducir la probabilidad de que...».
5. Precio (l.43-44) bien marcado HIPÓTESIS y «no oferta»; lista «Qué NO hago» (l.15-20) completa. Sin fallo.

### kit/guion-5-conversaciones.md: RECHAZADO
1. **Cond. 6/10, medición incoherente en una puerta de decisión.** L.49: «un "me interesaría" sin ejemplo cuenta como 0», pero la escala de la misma línea define 1 = «lo reconoce sin ejemplo». Además l.63 cuenta «dolor ≥ 2» y l.6 exige «ejemplo real»; con la contradicción la Puerta 1 no es medible. Corregir una de las dos reglas.
2. **Cond. 12 / estrategia Paso 3, NDA ambiguo.** L.13: la primera frase permite «solo llamada previa de 10 min» y la segunda describe una conversación de 20 min «con NDA o sin intercambio de información confidencial», pero la sección pide incidentes reales (l.28-29, 49: «cita literal de un incidente concreto»), que son información del interlocutor. Aclarar qué pasa con el ejemplo concreto si no hay NDA (por ejemplo, solo relatos sin nombres, sin importes, y anotados sin identificar) [ABOGADO].
3. Menor: l.6 usa V1, V2, V3, V5 sin remitir a su definición (`negocio/trabajo/casos-de-uso/servicios-vitales.md`).
4. Sin fallo en: no precio (l.14), no accesos (l.15), no asesor financiero (l.16), notas sin nombres (l.17, 52).

### kit/nota-renfe.md: RECHAZADO
1. **Cond. 4 / estrategia Paso 3 (NDA y encargo antes de ver datos), práctica gratis sin cautelas.** L.56: «2 o 3 compañeros... una versión corta del diagnóstico» implica entrevistar y ver datos de familias reales. No exige NDA ni encargo, ni recuerda que no se pasan datos reales a ninguna IA (estrategia, «Herramientas al empezar»), ni anonimizar las notas. Corregir añadiendo las tres condiciones, o decir que la práctica se hace solo con datos ficticios o propios.
2. **Contradicción con la propia nota y con la propuesta.** L.58: «con la propuesta de una página en la mano», pero esa propuesta incluye un precio hipótesis (propuesta l.43-44) y consta como pendiente de abogado antes de enviar nada (propuesta l.52-54); la nota dice en l.36 «No ofrecer precio» y el guion-5 l.14 «No dar precio». Corregir: mostrar solo el mapa de ejemplo con datos ficticios, no la propuesta con precio.
3. **Cond. 12, aviso del contrato laboral mal colocado.** El aviso existe (l.57, con [ABOGADO] y la regla de no usar correo, teléfono, tiempo ni contactos del empleador), pero aparece en el último punto de la aclaración y las secciones l.19-50 (preguntas a una persona de dentro) se leen como operativas sin esa condición. Subirlo a la cabecera (junto a l.3) como requisito previo bloqueante. Coincide con `cerebro/decisiones.md` l.30 («Antes de nada»).
4. Observación (no fallo): l.54 deja constancia del empleador de la persona (una subcontrata, sin nombre). Es dato personal de la propia persona; revisar si debe quedar en el repo (condición 4) o bastaría la referencia a `cerebro/decisiones.md`.

### kit/guion-entrevista-diagnostico-90min.md: APROBADO
Cumple: NDA y encargo antes de la entrevista (l.5, 11); sin contraseñas ni cifras de patrimonio (l.39, 79-86); «ayuda, no garantiza» (l.72); no asesoría (l.13, 73); tiempos suman 90 (5+30+20+15+15+5); fechas y umbrales los confirma el asesor (l.59). Observación menor: l.11 cita «[regla 4 del negocio]»; la condición 4 es «cero secretos», no la de NDA; citar la regla correcta (`CLAUDE.md`/estrategia Paso 3).

### kit/plantillas/protocolo-antifraude.md: RECHAZADO
1. **Cond. 6/8, cifra sin marcar como propuesta.** L.15: «pasadas **24 h** desde la verificación» va en negrita como regla. Sí está marcada la cifra de 3.000 € (l.16, «importe del ejemplo; lo fija el titular»), la de 24 h no. En la Parte B (l.66) sí queda en blanco. Corregir: «24 h (plazo propuesto; lo fija el titular)».
2. Menor, mismo criterio: «30 min» (l.18, 35), «60 minutos» (l.38), «48 h» (l.46) son valores sin etiqueta de propuesta.

### kit/plantillas/libro-de-operaciones.md: RECHAZADO
1. **Cond. 6/8, cifra sin marcar como propuesta.** L.31: «Hasta 3.000 €» como límite de pagos en ausencia, sin la etiqueta «importe propuesto» que sí tiene en `muestra-anonimizada-de-entregable.md` l.48 y `protocolo-antifraude.md` l.16. Tampoco «Presupuestos > 500 €» (l.21). Aunque la Parte A es ficticia (l.3), la cifra de 3.000 € debe llevar el mismo tratamiento en los tres sitios.
2. Observación: l.31 ya lleva [ABOGADO] para el apoderamiento; correcto.

### kit/plantillas/muestra-anonimizada-de-entregable.md: RECHAZADO
1. **Cond. 6/8, cifra sin marcar.** L.79 (H2): «espera de 24 h» sin etiqueta de propuesta (la de 3.000 € sí la tiene en l.48). Añadir «(plazo propuesto)».
2. **Cond. 6, cifra que no cuadra.** L.86: «8 servicios digitales y 5 elementos físicos». El inventario de acceso del mismo kit (`inventario-de-accesos-y-bajas.md` l.21-28 y 33-38) tiene 8 servicios y **6** elementos físicos (llaves Barcelona, llaves Sitges, alarma Barcelona, alarma Sitges, garaje, caja fuerte). Corregir a 6 o ajustar el inventario.
3. **Inconsistencia con propuesta y guion.** L.12: la asistente es entrevistada 90 min; la propuesta (l.29) y el guion (l.15) prevén 45 min para la persona del día a día. Alinear.
4. Observación: l.15 («Marta es la única que puede aprobar pagos») frente a `libro-de-operaciones.md` l.31 (Rafael aprueba hasta 3.000 € en su ausencia), anexo A de la misma muestra. Aclarar que el anexo A refleja el estado «después» de las recomendaciones.

### kit/plantillas/inventario-de-accesos-y-bajas.md: APROBADO
Sin contraseñas ni combinaciones (l.6, 38, 79); ejecuta la persona del cliente, no el asesor ni una IA (l.7); [ABOGADO] en la baja laboral (l.10, 69, 70). Observación: «30 días» (l.68, 123) sin etiqueta de propuesta; no es una de las cifras exigidas, pero conviene unificar con el criterio de la condición 6.

### kit/plantillas/sobre-de-emergencia.md: APROBADO
Sin secretos; solo ubicaciones (l.9); no da poderes (l.11); [ABOGADO] en acceso de emergencia, legado digital y operaciones; sin datos de salud (l.45).

### kit/plantillas/calendario-de-plazos.md: APROBADO
Cumple la condición pedida en su totalidad: ninguna fecha fiscal o umbral real, todo [CONFIRMAR CON ASESOR]; sin confirmación la fila no genera avisos (l.8); el guardián solo avisa (l.9).

## Observaciones sin rechazo
- **O1 (coherencia con solo recuento).** Ni la propuesta (l.13), ni el calendario (l.8-9, 36) ni el guion definen qué lleva un aviso de vencimiento. Cuando se implemente el canal, el aviso de bloqueo o notificación pública debe ser solo recuento (`diseno-interfaz.md` l.170). Dejar una línea en `calendario-de-plazos.md` que lo diga evitaría una derivación futura.
- **O2.** Nombres con apariencia de reales sin el sufijo «Ejemplo»: Núria Pons, Elena Soler, Pere Roig, Oriol Vila (`libro-de-operaciones.md` l.63-66, 79-80; `sobre-de-emergencia.md` l.54-55). Están declarados ficticios en la cabecera, pero conviene añadir «Ejemplo» como al resto para evitar coincidencias.
- **O3 (condición 12).** El kit no contiene una lista «solo la persona». Los pendientes están dispersos como [ABOGADO] (propuesta l.52-54). Recomendable recogerlos en `cerebro/estado.md` o `backlog.md`: abogado (NDA, encargo, fórmula «asesor personal de organización y operaciones»), gestoría (epígrafe, contrato laboral), seguro, y revisión del contrato de la subcontrata.
- Estado del repo: no se ha tocado nada fuera de este informe.

## Qué devolver y a quién
- `estratega-ventas-confianza`: propuesta (puntos 1-4), guion-5 (1-3), nota-renfe (1-3), libro (1), protocolo (1-2), muestra (1-3).
- Tras corregir, nueva pasada de calidad solo sobre los 6 documentos rechazados.
