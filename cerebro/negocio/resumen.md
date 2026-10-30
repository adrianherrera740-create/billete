# Negocio: «Chief of staff digital» para patrimonios altos (Barcelona/Cataluña)

> **30/10/2026: la persona cambia la estrategia a «asesor personal a medida, poco pero muy útil».** Manda `estrategia-asesor-personal.md`; lo de abajo es el planteamiento inicial (plataforma de agentes) y queda como contexto.


Fuente: informe en PDF aportado por la persona el 29/10/2026 («Agentes de IA a medida para grandes patrimonios»). Generado por IA: estado **No verificado** (condición 8). Cada cifra necesita su fuente leída antes de sostener una decisión.

## Idea
No se vende «agentes a millonarios»: se monta un servicio privado de operaciones con IA para quien protege el tiempo del patrimonio (asistente ejecutiva, chief of staff, family office, asesor). Producto inicial de bajo riesgo: briefing diario + triaje de correo y agenda, con aprobación humana en toda acción con efecto externo.

## Hipótesis a validar (según el informe, no verificadas)
- H1 Hay hueco: pocos family offices usan IA en operaciones y la privacidad es la barrera.
- H2 Se llega por intermediarios (asistentes ejecutivas, family offices pequeños, banca privada, abogados/fiscalistas, fundadores con exit), no en frío.
- H3 Precios orientativos: diagnóstico 1.500–3.000 €, piloto 3.000–6.000 €, implantación 8.000–25.000 €, cuota 1.500–5.000 €/mes (el informe avisa de que los anclas son de Londres/EEUU).
- H4 Tamaño: cientos de clientes potenciales directos y pocas decenas de intermediarios; negocio de 5–15 clientes de cuota alta.

## MVP (4 semanas, un cliente)
Briefing a las 7:00, triaje de correo con borradores (nunca envío automático), dossier 24 h antes de reuniones, CRM personal ligero, canal de aprobaciones. Fuera: pagos, banca, firmas, salud, actuar frente a terceros.
Arquitectura propuesta: Google Workspace/Microsoft 365 del cliente + n8n alojado en la UE + LLM con residencia de datos en la UE + aprobación humana por Telegram/Slack/correo + registro auditable.

## Reglas propias del negocio (no se negocian)
1. El agente lee, resume, prioriza y propone; el humano decide y envía. Nada se envía, paga o firma solo.
2. Datos del cliente: solo en la UE, mínimo privilegio, contrato de encargado (art. 28 RGPD), borrado certificado, botón de apagado en manos del cliente.
3. Todo contenido entrante es no fiable (inyección de prompts): sin enlaces ni imágenes externas en las salidas, aprobación en toda acción externa.
4. Discreción: NDA antes de la primera llamada; casos anonimizados; ningún nombre de cliente en el repo.
5. Cero datos personales de terceros en el repo. El repo no contiene credenciales ni correos reales (condición 4); las demos usan datos ficticios.
6. Lo jurídico (NDA, encargo, limitación de responsabilidad, seguros) lo revisa un abogado de protección de datos antes del primer contrato: es cosa de la persona (condición 12).

## Métrica de decisión (mes 4)
Si tras 20 conversaciones no hay ni un piloto pagado, el problema es el canal o el posicionamiento. Si hay 2 pilotos y 1 pasa a retainer, el negocio queda validado.

## Plan de 90 días (del informe, fechas por fijar)
Sem 1–2 demo · Sem 2–3 kit legal y de confianza · Sem 3–6 20 conversaciones · Sem 6–10 1–2 pilotos pagados · Sem 10–12 caso de éxito y conversión a retainer · Mes 4 escalar por intermediarios.
