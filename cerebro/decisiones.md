# Decisiones (fechadas, con motivo)

## 2026-10-29 — Cerrar el dropshipping y conservar solo herramientas genéricas y La Nave
La persona decide abandonar el dropshipping de TikTok Shop tras trece rondas sin producto ni proveedor verificados. Se borran `tienda/`, `creativos/`, las skills `sealeap-*` y `proveedor-es`, 25 agentes específicos y los archivos de cerebro del negocio. Se conservan La Nave, las skills genéricas, 8 agentes genéricos y las 13 condiciones. Recuperable con `git checkout archivo-dropshipping`.
## 2026-10-29 — La Nave: acceso desde el móvil
Web móvil propia servida por La Nave sobre Tailscale, lista cerrada de canales; gestión del acceso solo desde el PC. Ver `la-nave/docs/adr/ADR-002-acceso-movil.md`.

## 2026-10-29 — Nuevo negocio: chief of staff digital con agentes de IA para patrimonios altos
La persona elige este negocio a partir del informe PDF. Se vende como servicio boutique con aprobación humana, no como «agencia de agentes». Primer producto: briefing diario + triaje de correo. Se empieza por verificar el informe (nada de él es verificado), construir una demo con datos ficticios y preparar el kit de confianza; cero gasto hasta que haya conversaciones. Reglas en `negocio/resumen.md`.

## 2026-10-29 — Calendario de ventas de 12 semanas (propuesta, pendiente de la persona)
Del 02/11/2026 al 24/01/2027, sin conversaciones nuevas del 21/12 al 03/01; el piloto cae en la semana 10 y la decisión de retainer hacia febrero de 2027. Umbrales de éxito y precios son hipótesis hasta calibrarlos en las conversaciones. Ver `negocio/trabajo/ventas/`.

## 2026-10-29 — Demo: recomendación A para los borradores (pendiente de la persona)
Recomendación del arquitecto, no decisión: la IA no recibe `gmail.compose` (el token solo lee); los borradores viven en el panel de aprobación y el humano los copia. Es más segura aunque más incómoda. La opción B (compose en credencial separada) añade riesgo de envío y posible evaluación de seguridad de Google, sin verificar. Prototipo en `negocio/trabajo/demo/prototipo/` (62 pruebas con modelo simulado, no con un LLM real).

## 2026-10-29 — Ronda 1 del negocio cerrada tras dos pasadas de calidad
Aprobadas: mercado, seguridad, demo, verificación, ventas y legal (con tres observaciones menores ya corregidas). Todo sigue NO VERIFICADO. Abierto: prueba de no envío del prototipo débil (endurecer antes del piloto) y hipótesis H4 sin investigar. Solo la persona: opción A/B de gmail.compose (recomendación A), abogado de protección de datos y NDA, región UE del modelo, dominios de red para fuentes primarias.

## 2026-10-29 — Ronda 2: interfaz y automatizaciones; propuestas del pre-mortem pendientes de la persona
Calidad aprobó en segunda pasada el diseño de la interfaz (panel web privado instalable con passkey; el móvil solo recibe «Tienes N asuntos pendientes»), las automatizaciones por persona y el pre-mortem. NO adoptado: los cambios de oferta del pre-mortem (cliente asistente, diagnóstico como producto, implantación con herramientas del cliente, un solo nicho, alianzas); R-01 y R-03 cambian la métrica de decisión y requieren luz verde de la persona. Todo NO VERIFICADO.

## 2026-10-30 — Cambio de estrategia: asesor personal a medida, poco pero muy útil
Decisión de la persona. Se abandona el enfoque de plataforma de agentes y se pasa a un servicio de asesor personal (organización y operaciones) para 3–5 clientes, con 3 servicios (diagnóstico de continuidad y accesos, protocolo antifraude, guardián de plazos con briefing semanal). La IA es herramienta interna. Plan por pasos y puertas en `cerebro/negocio/estrategia-asesor-personal.md`. Aviso: no presentarse como asesor financiero o fiscal [ABOGADO].

## 2026-10-30 — Respuestas de la persona al Paso 0
(1) Horas: las que vaya pudiendo; la idea es ir desatascando la herramienta poco a poco, sin calendario rígido. (2) Contactos: intentará hablar con Renfe (aclarar en qué sentido: cliente, contacto o vía de entrada). (3) Gasto: sin tope fijo; se decide según si el retorno es relevante. Regla de trabajo mientras no haya tope: gasto 0 € sin preguntar; cada gasto se propone con coste, retorno esperado y cómo se medirá.
