# ADR-002: acceso desde el móvil

- Estado: aceptada (29/10/2026). La persona pidió centrarse en que La Nave funcione en el móvil.
- Contexto: La Nave es una app de escritorio. El móvil debe poder ver el estado y capturar ideas, sin abrir nunca una puerta a las terminales ni a Claude.

## Decisión
- **Red:** un servidor HTTP dentro del proceso principal que escucha SOLO en `127.0.0.1` (puerto estable guardado en ajustes). Se publica con **Tailscale Serve** (HTTPS dentro de la red privada de la persona). Nunca `funnel` (internet público) ni otra interfaz de red.
- **Desactivado por defecto.** La persona lo activa en Ajustes.
- **Emparejamiento por QR:** código aleatorio de 128 bits, de un solo uso, que caduca a los 5 minutos y se invalida tras 5 intentos fallidos. Va en el fragmento de la URL (`#código`), que el navegador no envía al servidor. Al emparejar, el móvil recibe un **token de 256 bits** propio; el servidor solo guarda su hash SHA-256. Cada móvil se puede revocar desde el PC.
- **Qué puede hacer el móvil (lista cerrada, `remote: 'allowed'`):** `overview:summary`, `project:list`, `board:get`, `task:list`, `task:create`, `task:update`, `note:list`, `note:create`, `note:update`. Todo lo demás (borrar, proyectos, terminales, Claude, Brain, ajustes, copias, búsqueda global) queda `forbidden` y el servidor responde 403; un test recorre TODOS los canales para comprobarlo.
- **Misma API, otro transporte:** el servidor reutiliza los mismos parsers y manejadores que el IPC (`createApi(transport)`), así que la validación es idéntica.
- **Defensas del servidor:** comprobación de `Host` (contra DNS rebinding) y de `Origin` (contra CSRF), cuerpo máximo de 64 KB, límite de peticiones por móvil, cabeceras de seguridad (CSP estricta, `nosniff`, sin caché), servidor de archivos estáticos sin salir de su carpeta, tokens comparados por hash y nada de secretos en logs.
- **Cliente:** `apps/mobile` (React + vite), instalable en la pantalla de inicio (manifest), mismo `@nave/shared`, texto en español con i18n. Lo sirve el propio servidor desde `out/mobile`.
- **El PC se entera de lo que cambia el móvil:** los eventos del bus (`task.*`, `note.*`) se empujan al renderer para refrescar al instante.

## No verificado
- La integración con el CLI de Tailscale (`tailscale serve`) no se puede probar en este contenedor: se detecta si está instalado y se muestra el comando exacto; si falla, se enseña la salida. Hay que probarlo en el PC de la persona.
- Cómo se comporta el navegador y la instalación como app en un móvil real (los e2e usan un navegador de escritorio con tamaño y agente de móvil).

## Consecuencias
- Un servidor local más en el proceso principal: más superficie. Por eso la lista cerrada, el desactivado por defecto y los tests de seguridad.
- Desde el móvil no se puede ejecutar nada en el PC: es consulta y captura.
