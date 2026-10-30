# Nuevas automatizaciones para implantar (30/10/2026)
Estado: NO VERIFICADO. Fuentes = resúmenes de buscador de páginas de vendedores (no leídas en primaria); lo marcado [IDEA] es mío. Regla del negocio: el agente lee, resume y propone; el humano decide. Complementa `viables-hoy.md`.

## Resumen
| # | Automatización | Evidencia | Datos | Riesgo | Implantable con lo que ya hay |
|---|---|---|---|---|---|
| 20 | Entrada y triaje de peticiones de donaciones y filantropía | [Submittable](https://www.submittable.com/solutions/foundations), [Foundant](https://www.foundant.com/solutions/private-family-foundation-software/), [Sensible Philanthropy](https://www.ncfp.org/people/sensible-philanthropy-support-systems) (vendedores) | correo del cliente, formulario web | medio | Sí |
| 21 | Calendario de cumplimiento del servicio doméstico (altas, cuotas, horas, vencimientos de contratos) | guías comerciales: [Grupo2000](https://www.grupo2000.es/category/empleadas-de-hogar/), [ASEST](https://asest.es/story/alta-empresario-empleada-hogar/), [OIE](https://www.oie.es/alta-empleada-de-hogar-seguridad-social/) | contratos y calendario | medio (datos personales del personal) | Sí, solo avisos |
| 22 | Escudo de suplantación: detecta mensajes que se hacen pasar por el titular, su familia, su banco o proveedores y avisa | [BlackCloak](https://blackcloak.io/news-media/blackcloak-revolutionizing-online-privacy-by-adding-enhanced-continuous-data-removal-actions-to-its-digital-executive-protection-platform/), [Agency](https://blog.getagency.com/articles/personal-information-removal-for-executives) (vendedores) | correo del cliente | bajo | Sí, ampliación del triaje |
| 23 | Índice de documentos para reuniones y auditorías con búsqueda | [Citi](https://www.citigroup.com/rcs/citigpa/storage/public/ai_in_the_family_office.pdf), [andsimple](https://andsimple.co/insights/ai-agents-the-next-frontier-in-family-office-digitization) | Drive del cliente | medio | Sí, solo lectura |
| 24 | Pre-clasificación de facturas de proveedores para que las apruebe una persona | misma familia de fuentes; ejemplo de app que registra, aprueba y paga | facturas | alto (financiero) | Fase 3, solo propuesta de codificación |

## Detalle de implantación
### 20 · Peticiones de donaciones y filantropía
- **Dolor:** una familia recibe peticiones constantes; el equipo dedica tiempo a leerlas y decir que no con educación. Una fundación familiar describió ahorros de tiempo al encaminar propuestas (caso publicado por su proveedor, no verificado).
- **Qué hace:** identifica la petición, resume en 3 líneas, comprueba faltas (importe, organización, plazo), la compara con criterios que fija el cliente (causas, importes, geografía) y propone «aceptar a estudio / declinar con texto / reenviar al fundación». Redacta la respuesta; la envía una persona.
- **Controles:** reglas escritas por el cliente; no verifica la entidad (esto lo hace una persona); sin enlaces ni adjuntos abiertos; registro de decisiones para su historial de donaciones.
- **Métrica:** minutos por petición y % de respuestas educadas enviadas en 5 días [IDEA].
- **Pregunta de validación:** «¿Cuántas peticiones recibe al mes y quién las contesta hoy?»

### 21 · Servicio doméstico (España)
- **Lo que dicen las guías (comerciales, sin verificar):** desde 2023 la familia es responsable de tramitar el alta e ingresar las cuotas; el alta es obligatoria con independencia de las horas, se presenta hasta 60 días antes del inicio y a más tardar el día de comienzo; no darla de alta puede ser infracción grave.
- **Qué hace el agente:** mantiene un calendario de vencimientos (fin de contrato, revisión salarial, cambios de horas, pagos de cuotas) y avisa con tiempo. NO tramita ni calcula cuotas: eso queda para la gestoría o la persona (condiciones 12 y 13).
- **Controles:** minimizar datos (iniciales y fechas, sin documentos de identidad en el repositorio ni en el prompt); el cliente confirma cada fecha.
- **Pendiente [ABOGADO/gestoría]:** qué obligaciones aplican a casas con varios empleados y a empleados contratados por sociedades; cifras de 2026 por leer en la sede de la Seguridad Social.

### 22 · Escudo de suplantación
- **Dolor:** el titular es objetivo de fraude por correo (falsas facturas, cambios de cuenta, falsos familiares). Los vendedores del sector lo ligan al riesgo físico y reputacional; una fuente escéptica avisa de que los programas completos solo compensan con amenaza real.
- **Qué hace:** dentro del triaje, marca mensajes con señales de suplantación (dominio parecido, urgencia, cambio de cuenta bancaria, petición de no avisar a nadie) y los lleva al panel con una advertencia y la regla «verifica por un canal que ya conocías».
- **Fuera del alcance:** retirada de datos en intermediarios de datos (servicio de terceros, precios de vendedor sin verificar) y vigilancia física.
- **Métrica:** casos señalados y confirmados por el cliente como intento real [IDEA]. Ya existe un caso de ejemplo en la demo (proveedor que pide cambiar la cuenta).
- **Pregunta de validación:** «¿Le han intentado alguna vez engañar por correo con un cambio de cuenta o un falso familiar?»

### 23 · Índice de documentos
- **Qué hace:** indexa lo que el cliente autoriza (pólizas, escrituras, contratos), responde con cita de la página y fecha de vencimiento, y propone recordatorios. Solo lectura.
- **Controles:** carpeta autorizada, sin documentos de salud, registro de consultas, borrado certificado.

### 24 · Facturas de proveedores (fase 3)
- Solo propuesta de codificación y alerta de duplicados o importes raros; nunca registra ni paga. Entra después del primer caso de éxito y del kit legal firmado.

## Orden recomendado para implantar (propuesta mía)
1. **22 Escudo de suplantación:** casi gratis sobre lo ya prototipado, se enseña en una demo y toca un miedo real.
2. **20 Peticiones de donaciones:** concreto, visible a la semana, bajo riesgo si solo propone.
3. **21 Calendario del servicio doméstico:** útil y sin acceso a datos financieros, con cuidado de datos personales.
4. **23 Índice de documentos:** potente pero con documentos sensibles; tras el kit legal.
5. **24:** fase 3.

## Qué NO hacer
- Prometer retirada de datos en intermediarios de datos o protección física: es otro servicio.
- Tramitar nada ante la Seguridad Social o la Agencia Tributaria.
- Usar las cifras de las páginas de vendedores como argumento de venta.

## Siguiente paso propuesto
Prototipar 22, 20 y 21 con datos ficticios en el mismo prototipo (reglas de detección y de triaje, con pruebas de abuso) y añadir las tres preguntas de validación al guion de conversaciones.
