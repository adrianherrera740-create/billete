# ADR-001: stack y estructura

- Estado: aceptada (29/10/2026)
- Contexto: La Nave es una app de escritorio para Windows 11 con terminales reales, Claude Code, un Brain con búsqueda y, más adelante, acceso desde el móvil. Debe ser local-first y verificable con un solo comando.

## Decisión
- **Monorepo con npm workspaces:** `apps/desktop`, `packages/shared`, `packages/core`, `packages/db`. Los paquetes son TypeScript sin compilar y se empaquetan dentro del bundle de `main`.
- **Electron 45.1.0** con **electron-vite 6.0.0** y **vite 8.3.5**. Renderer en React 19 con zustand e i18next (todo el texto en `es.json`).
- **Base de datos:** `node:sqlite` con FTS5. Verificado el 29/10/2026: Electron 45.1.0 incluye Node 24.22.1 y FTS5 funciona dentro de Electron (consulta con `rowid` 1e12+).
- **Terminales:** `node-pty` + xterm.js con WebGL (F3). **Grafo:** d3-force sobre canvas (F6).
- **Calidad:** Vitest (unitarios), Playwright sobre Electron real (e2e), ESLint 9 con typescript-eslint, `tsc`. `npm run verify` = typecheck + lint + test + build, y se ejecuta antes de cada commit.
- **Seguridad desde F0:** `contextIsolation`, `sandbox`, sin `nodeIntegration`, CSP estricta y enlaces externos fuera de la app. El preload se empaqueta en un único archivo CommonJS (requisito del sandbox).
- **IPC:** los canales se definen una sola vez en `@nave/shared`. Una regla de ESLint prohíbe `ipcMain.handle/on` directos; el registro único `ipc.handle/on` llega en F1.

## Consecuencias
- Cada cambio de dependencias se prueba con `verify` y se documenta aquí si altera la decisión.
- No se declaran dependencias con `latest`: todas van con versión exacta.
- Los terminales y los shells de Windows (ConPTY, WSL, PowerShell) no se pueden probar en el contenedor de desarrollo (Linux); se prueban en el PC de la persona.

## Alternativas descartadas
- Tauri: no hay terminal PTY nativo equivalente a `node-pty` en el stack acordado.
- `better-sqlite3`: añade un módulo nativo más; `node:sqlite` cubre FTS5 y evita la compilación.

## Notas de F1 (29/10/2026)
- Migraciones: checksum SHA-256 por migración; si una ya aplicada cambia, o si la BD es más nueva que la app, el arranque se detiene con un mensaje que explica qué hacer.
- Copias con `VACUUM INTO` (consistentes con el WAL). Al arrancar se crea una copia (`arranque`) y se conservan las 10 últimas.
- Arranque seguro: restauración pedida con marcador (`restore-request.json`) aplicada antes de abrir la BD; si la BD está corrupta se aparta como `.corrupt-*` y se recupera la última copia sana, o se crea una nueva.
- `NAVE_USER_DATA` sustituye la carpeta de datos (lo usan los e2e para no tocar datos reales).

## Notas de F2 (29/10/2026)
- Un único registro IPC (`apps/desktop/src/main/ipc.ts`): valida la entrada con el parser del canal, traduce errores a `Result` en español sin filtrar rutas ni trazas, y solo atiende peticiones de la propia página (`senderFrame`).
- Cada canal declara `remote: 'allowed' | 'forbidden'` en `@nave/shared`; un test fija la lista permitida (`project:list`, `board:get`) y exige que todo lo que modifica datos sea `forbidden`.
- Los parsers rechazan claves desconocidas y usan `Object.hasOwn` (un test de seguridad cazó que `key in shape` dejaba pasar `__proto__`).
- Pizarra: lógica pura en `renderer/src/board/geometry.ts`; zoom entre 10 % y 100 %; sin scroll nativo (rueda = mover, Ctrl + rueda = zoom); visión general de solo lectura. Activity se escribe suscrita al bus, siempre redactada.
- Solo se pueden crear notas (`kind='sticky'`) desde la interfaz; el resto de tipos de panel llegan en sus fases.

## Notas de F3 (29/10/2026)
- `node-pty` 1.1.0 es N-API: trae binarios para Windows y no hace falta recompilar para Electron; en Linux se compila con node-gyp. Sigue pendiente `asarUnpack` en F8.
- El renderer solo envía el id del panel (y el tamaño); shell y carpeta salen de la BD. Un test rechaza campos `shell` o `cwd` en `terminal:start`.
- La salida de la terminal viaja por un canal propio (`terminal:event`) y nunca por el bus, Activity ni logs; un test lo comprueba con una contraseña falsa. El renderer ordena la salida con un desplazamiento (`end`) para no duplicar lo ya repintado.
- Detección de shells sin asumir nada: PowerShell, PowerShell 7, CMD, Git Bash y cada distribución de WSL (`wsl -l -q` decodificado de UTF-16). Lo que falta no aparece.
- **No verificado en Windows real:** la detección se prueba con un sistema de ficheros simulado y la terminal con un shell Linux (bash). ConPTY, PowerShell y WSL hay que probarlos en el PC de la persona.
- Los canales `terminal:*` están `forbidden` en remoto (un shell no se expone al móvil).

## Notas de F4 (29/10/2026)
- Se ejecuta el `claude` real en un panel `kind='claude'` (no se reimplementa). Opciones verificadas con `claude --help` (v2.1.312): `--settings <archivo>`, `--session-id <uuid>` y `--resume <id>`. Así La Nave asigna el id de sesión desde el principio.
- Hooks: servidor en `127.0.0.1` (puerto aleatorio) con token aleatorio por ejecución en cabecera `Authorization`, comparado en tiempo constante. Rechaza `Origin` (navegadores), `Host` ajeno (DNS rebinding), cuerpos > 256 KB, JSON roto y eventos fuera de {SessionStart, UserPromptSubmit, Notification, Stop, SessionEnd}. Responde siempre 204 sin cuerpo, así que los hooks solo observan.
- El token viaja en la variable de entorno `NAVE_HOOK_TOKEN` del proceso; el archivo de ajustes y los argumentos solo contienen `$NAVE_HOOK_TOKEN`. Nunca se pasa `--dangerously-skip-permissions` (test + comprobación en el lanzador).
- El contenido de los hooks (prompts, herramientas) no se registra: solo el nombre del evento y el estado.
- Historial: lectura de solo lectura del `.jsonl` bajo `~/.claude/projects`, sin seguir enlaces simbólicos, con parser tolerante, últimos 50 mensajes y secretos redactados.
- Un panel con sesión previa no abre otra sola al arrancar la app: pregunta Reanudar o Nueva sesión.
- **No verificado con un `claude` real autenticado:** el e2e usa `fake-claude` (`apps/desktop/e2e/fixtures`), que imita la ejecución de hooks (JSON por stdin, comando con `sh -c`). Falta confirmar con Claude Code real, en Windows, que la herencia del entorno y `curl` funcionan igual en el shell que use para los hooks.

## Notas de F5 (29/10/2026)
- Las tareas pertenecen siempre a un proyecto (`project_id NOT NULL`, borrado en cascada). Las notas pueden no tener proyecto (la bandeja); si un proyecto desapareciera, sus notas pasan a la bandeja (`ON DELETE SET NULL`) en vez de perderse.
- Enviar texto a Claude (`claude:paste`) solo PEGA: bracketed paste, sin Intro, y únicamente en paneles `kind='claude'` en marcha. El texto se filtra de caracteres de control (ESC, ^C, ^D...) para que no pueda cerrar el pegado antes de tiempo ni inyectar órdenes; hay un test con un texto hostil.
- Canales de lectura (`task:list`, `note:list`) permitidos en remoto; todos los que modifican datos, no.
- Limitación conocida: el e2e usa un `fake-claude` en modo línea; en el Claude real el salto de línea dentro de un pegado forma parte del pegado (por eso el e2e envía una sola línea).

## Notas de F6 (29/10/2026)
- Brain por proyecto: nodos con `confidence` (verified / unverified / deprecated), `source` (user / claude), `source_ref` y enlaces `[[Título]]`. Lo escrito por la persona nace verificado; **lo propuesto por Claude (`Brain.propose`) nace siempre sin verificar**, y el renderer no puede fijar `source` ni `confidence` (un test del parser lo exige). Editar un nodo sin verificar equivale a revisarlo; aceptar lo verifica; rechazar lo deja obsoleto.
- FTS5 con `rowid = 1e12 + rid` y `rid INTEGER PRIMARY KEY` (VACUUM no lo renumera). El índice se mantiene con disparadores que operan SOLO por rowid; nunca por columnas. Tests: el rowid sobrevive a `VACUUM INTO`, el borrado en cascada de un proyecto no deja huérfanos y con 8.000 nodos borrar cuesta < 20 ms.
- `buildFtsQuery` es la única puerta de texto hacia FTS (extrae palabras y las entrecomilla; ignora operadores, `columna:`, paréntesis, `*`). Un test demuestra que la misma entrada cruda SÍ rompe FTS5 y la saneada no.
- El contexto para la IA (`brain:context`) es de UN proyecto, con tope de 8 nodos y 4.000 caracteres, lo verificado primero, lo dudoso marcado «[sin verificar]» y los secretos redactados. Nunca el Brain entero.
- Fuera de V1 (preparado, no implementado): vault de carpetas con watcher, grafo (d3-force), vista previa de Markdown, MCP `brain_remember`. Hoy los enlaces se resuelven por título y hay retroenlaces; el índice `brain_links` se reconstruye al arrancar.

## Notas de F7 (29/10/2026)
- Ajustes: solo se cambian con un parche validado (`parseSettingsPatch`: `theme`, `notifications`, `sideOpen`); lo guardado e inválido se ignora y vale el valor por defecto. El estado de la ventana lo guarda main aparte (clave interna `window`, no accesible desde el renderer) y se restaura solo si la ventana sigue siendo alcanzable en alguna pantalla.
- Tema oscuro, claro o del sistema con variables CSS (`data-theme`) y `nativeTheme.themeSource`. El terminal conserva fondo oscuro en ambos temas.
- Notificaciones nativas solo con TODAS las ventanas sin foco, con el ajuste activado y con un mínimo de 5 s entre avisos por panel; avisan de «espera tu respuesta» o «ha terminado» y nunca llevan contenido de la conversación. **No verificado:** el aspecto real de la notificación en Windows (los tests cubren la lógica, no el sistema operativo).
- Atajos fijos: Ctrl+K, Ctrl+Shift+P/T/A/B (Cmd en macOS); no existe Ctrl+N (test). Se escuchan en captura, así que Ctrl+K también se queda con la tecla dentro de un terminal (en bash borra hasta el final de línea): es la decisión del diseño.
- La paleta de comandos es un registro extensible (`registerCommand`); la búsqueda global (Ctrl+K) cruza proyectos porque la pide la persona de forma explícita (el contexto para la IA nunca lo hace). El texto va como parámetro con `ESCAPE` en LIKE y por `buildFtsQuery` en FTS.
- En producción se quita el menú de la aplicación (evita recargar o abrir herramientas de desarrollo por accidente); en desarrollo se mantiene.
- Bug encontrado por un e2e y corregido: al cerrar la app con una terminal abierta, el aviso de salida del proceso llegaba tras cerrar la BD y lanzaba una excepción (en un PC real, un diálogo que impedía cerrar). Hay un test de regresión y un `uncaughtException` que registra en vez de abrir un diálogo.
