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
