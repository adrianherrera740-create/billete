# Prompt maestro "La Nave" (aportado por la persona, 29/10/2026)

Guardado íntegro y sin cambios. Es un proyecto aparte (app de escritorio para Windows 11), todavía NO construido. Sus reglas de trabajo (secciones 0, 6, 7 y 8) se aplican a todo el proyecto a través de `cerebro/condiciones.md`. Las secciones 1-5 y 9 (stack, arquitectura, fases F0-F8, UI y primera entrega) solo rigen si se construye La Nave, en su propia carpeta o repositorio.

---

Prompt maestro: construir "La Nave" (tu propio escritorio de proyectos con IA)
Pégalo entero en Claude Code, en una carpeta vacía. Está pensado para construir por fases, con un commit por cambio.

0. Rol y reglas de trabajo (obligatorias)
Eres un ingeniero senior. Vas a construir La Nave: una app de escritorio para Windows 11 que actúa como "el escritorio" del usuario. Reúne proyectos, terminales reales (PowerShell, CMD, Git Bash, WSL, SSH), Claude Code, IA local, un Brain (grafo de conocimiento tipo Obsidian), tareas, notas, navegador integrado, notas adhesivas y acceso desde el móvil.

Reglas de flujo:

Antes de escribir código, entrega una propuesta de arquitectura (stack y por qué, estructura de carpetas, modelo de datos, eventos, persistencia, terminales, integración con Claude Code, seguridad, roadmap, V1 acotada) y espera luz verde.
Trabaja por fases: PHASE → PLAN → IMPLEMENT → TEST → VERIFY → DOCUMENT → NEXT. No avances si una fase base está rota.
Un commit por cada fix o cambio (pequeños y frecuentes) y push a GitHub. Nunca acumules cambios sin commitear.
Nunca guardes tokens, claves API, claves SSH ni contraseñas en el repo, en commits, logs, Activity, Brain, prompts ni UI. Usa el credential manager de Git y los mecanismos seguros del SO.
Las decisiones importantes se documentan como ADR en docs/adr/.
Antes de cada commit ejecuta npm run verify (typecheck + lint + test + build) y lee el resultado. No commitees con errores.
No asumas que una herramienta externa (claude, git, ssh, ollama, GPU) está instalada: detéctala y degrada con gracia. Los errores dicen qué pasó, por qué y qué puede hacer el usuario.
Atajos fijos: Ctrl+K búsqueda global, Ctrl+Shift+P paleta de comandos (extensible), Ctrl+Shift+T terminal, Ctrl+Shift+A agente, Ctrl+Shift+B Brain. No añadas Ctrl+N.
Cuando un cambio exija reinstalar la app, avisa explícitamente al usuario.
1. Stack
Monorepo npm workspaces: apps/desktop (Electron + React + TypeScript), packages/shared, packages/core, packages/db.
Electron con electron-vite. Renderer en React 19 con zustand e i18next (todo el texto en es.json).
Terminales: node-pty (desempaquetado del asar con asarUnpack) + xterm.js con WebGL.
Base de datos: node:sqlite (SQLite integrado), con FTS5 para búsqueda.
Grafo: d3-force sobre canvas, fuera de React.
Tests: Vitest (unitarios) y Playwright sobre Electron real (e2e). Lint con ESLint, tipos con tsc.
Instalador: electron-builder (.exe NSIS), con icono propio.
Scripts raíz: dev, build, dist, verify, test, test:e2e.
2. Arquitectura
Nave Core central: proyectos, sesiones, procesos, eventos, configuración, almacenamiento, permisos, contexto y restauración de workspace.
Los módulos (Terminales, Claude, Brain, Tareas, Notas, Navegador, SSH, Actividad…) están desacoplados y solo se comunican por un Event Bus tipado. Los eventos se llaman proyecto.accion, por ejemplo terminal.process_exited o brain.node_created. Un evento nuevo es una entrada nueva en EventMap.
Capas: main (Nave Core) ↔ preload (window.nave) ↔ renderer. Los canales IPC se definen una sola vez en packages/shared.
Registro único de IPC: todos los handlers pasan por ipc.handle/on, nunca ipcMain.handle directo.
createApi(transport): la misma API funciona por IPC (escritorio) o por red (móvil).
Project-first: todo pertenece a un proyecto (pizarras, terminales, tareas, notas, Brain, actividad). El contexto de IA nunca mezcla proyectos salvo petición explícita.
Todo lo que sale de main (logs, Activity, IPC) pasa por redactSecrets.
Persistencia local-first con migraciones solo aditivas (nunca se edita una migración antigua), backups, recuperación de corrupción y restauración al arrancar. Logs separados: app, terminales, seguridad y actividad.
3. Fases (en este orden)
F0 Scaffold. Monorepo, Electron + React, lint, tests, verify, README y ADR-001.

F1 Core y persistencia. @nave/core (EventBus, logging, redactSecrets) y @nave/db (migraciones versionadas, backups).

F2 Proyectos. Crear, editar y archivar proyectos con nombre, icono, color y carpeta raíz. Cada proyecto tiene una pizarra (lienzo con paneles). Las entradas IPC se validan con parsers en shared.

F3 Terminales reales. Un terminal es un panel de pizarra (kind='terminal'). Detecta PowerShell, CMD, Git Bash y WSL. El renderer solo envía el id del panel, y el shell y la carpeta salen de la BD. La salida de las terminales no pasa por el bus, Activity ni logs. Copiar al seleccionar, pegar, scroll y foco deben funcionar bien.

F4 Claude Code. Ejecuta y supervisa el proceso real de claude, sin reimplementarlo (kind='claude').

Un servidor loopback con token recibe los hooks de Claude. Los hooks solo observan.
No pases nunca --dangerously-skip-permissions, y el token no va en la línea de comandos ni en logs.
Muestra el estado de la sesión y permite reanudarla.
El historial se lee en modo solo lectura.
F5 Tareas y Notas. Las tareas pertenecen siempre a un proyecto. Las notas pueden estar sin proyecto (bandeja). Enviar texto a Claude solo lo pega (bracketed paste, sin Intro) y solo en paneles de Claude.

F6 Brain y búsqueda. Nodos con confianza (Verified, Unverified o Deprecated), fuente y relaciones.

Lo generado por Claude nunca nace verificado: requiere Accept, Edit o Reject.
Búsqueda con FTS5 y constructor de contexto que arma solo el paquete relevante, nunca el Brain entero.
El texto del usuario jamás se pasa a FTS sin una función buildFtsQuery.
Importante: las filas de FTS del Brain usan un rowid determinista (1e12 + rowid del nodo). No borres nunca por columnas UNINDEXED (kind/ref_id), porque es un recorrido completo y congela la app.
F7 App shell. Command Center, ajustes (validados con parseSettingsPatch), notificaciones nativas (solo con la ventana sin foco), visión general, estado de ventana persistente, tema claro u oscuro.

F8 Instalador y copias. electron-builder, icono, copias de seguridad y restauración (se pide con un marcador y se aplica al arrancar, antes de abrir la BD).

4. Funciones avanzadas
Pizarra: lienzo con cámara y sin scroll nativo. La lógica va en geometry.ts (pura, con tests). Zoom máximo del 100 % porque xterm falla bajo scale. En vista general los paneles son de solo lectura.
Brain estilo Obsidian:
[[enlaces]] y #etiquetas.
Índice derivado brain_links (se reconstruye al arrancar), grafo y backlinks.
Vista previa de Markdown segura, sin HTML en crudo.
Vault: una carpeta del proyecto entra al Brain.
Escaneo incremental, fs.watch y escritura atómica de .md.
Conflictos detectados por SHA-1.
Nunca indexes .env ni claves, nunca sigas symlinks, y borrar un nodo de archivo lo manda a la papelera.
Los borrados masivos van por tandas (p. ej. 250) cediendo el event loop, para no congelar la UI.
Brain→Claude por MCP: servidor JSON-RPC en POST /mcp/<panel>. Las herramientas siempre se limitan al proyecto de la sesión. Solo las de lectura se permiten sin preguntar, y brain_remember guarda sin verificar.
Uso de Claude: la statusLine hace curl a POST /status/<panel> y se muestra contexto, límite de 5 h y límite semanal. El parser debe ser tolerante (resets_at puede venir como número, fecha o nulo).
Título automático: el hook UserPromptSubmit resume la petición y renombra el panel a "Claude N - tarea". Quita las etiquetas <pastedcontent>, y no renombres si el usuario puso el título a mano.
Navegador en pizarra (kind='browser'): una WebContentsView sin privilegios por pestaña, con sesión en memoria y solo http/https.
Va sobre el DOM, así que se congela con una captura si el panel se mueve, hay zoom distinto de 100 % o algo lo tapa.
Un clic debe devolver el foco del teclado a la app.
Servidores SSH (VPS):
Solo datos de conexión, nunca contraseñas ni claves.
Valida host, usuario y carpeta de forma estricta, y construye los argumentos de ssh.exe como array, nunca como texto.
Un panel terminal o Claude con hostId ejecuta ssh.exe. Claude corre en la VPS, sin hooks ni Brain.
Ofrece configurar acceso por clave sin contraseña y probar la conexión con BatchMode.
Capturas para Claude: Ctrl+V con imagen, o arrastrar al panel de Claude. Valida el tipo por cabecera, guarda en %TEMP%/nave-shots (o sube por stdin a la VPS) y pega la RUTA sin Enter. Si el portapapeles tiene imagen y un texto sin letras ni números, gana la imagen.
Notas adhesivas (kind='sticky'): contenido en config con casillas. Claude las lee, crea y edita por MCP, solo en su pizarra, sin borrar. Ponles un tope de creación por ritmo para que un modelo no las spamee.
IA local (Ollama): botón "Local AI" que lanza un panel de Claude Code con un modelo local.
Detecta Ollama y los modelos con soporte de herramientas, y permite arrancar ollama serve.
Variables de entorno: ANTHROPIC_BASE_URL de Ollama, ANTHROPIC_AUTH_TOKEN=ollama, ANTHROPIC_API_KEY eliminada y el modelo elegido en los DEFAULT_*.
Crea una variante con contexto 16k (nave/<modelo>-ctx16k).
Sesión limpia: pocas herramientas, sin MCP, Brain ni prompt extra, para evitar bucles con modelos pequeños.
Modo "caveman" (opcional): un system prompt corto que reduce tokens de salida, añadido con --append-system-prompt-file.
Acceso móvil: servidor HTTP que escucha solo en 127.0.0.1 y se publica con Tailscale Serve.
Emparejamiento por QR, con la URL pública y no la local.
Cliente móvil con la misma API y diseño propio.
Cada canal IPC nuevo debe clasificarse como permitido en remoto o REMOTE_FORBIDDEN, y un test lo exige. Gestionar servidores y el navegador son solo del PC.
5. UI y diseño
Estilo macOS: glassmorphism minimalista. Blur y translucidez sutiles, jerarquía clara, animaciones suaves, legibilidad primero, modo oscuro y color por proyecto. Todos los botones de acción usan un componente GlassButton. Los diálogos usan un Dialog con portal. Todo texto pasa por i18n en español.

6. Seguridad
Secretos solo por mecanismos seguros del SO.
Los paneles web no tienen privilegios (sin preload, sin Node).
Validación estricta de toda entrada IPC y remota.
Las rutas de vault y capturas se validan, y no se siguen symlinks.
Permisos por agente, con herramientas de solo lectura sin preguntar.
Tests específicos de seguridad: redacción de secretos, validación SSH, clasificación de canales remotos.
7. Tests y calidad (definition of done)
Una función está terminada cuando: funciona, maneja errores, persiste, tiene tests en la lógica crítica, emite eventos si aplica, está documentada y no rompe lo existente.

Fixtures de e2e: un fake-claude (con NAVE_CLAUDE_BIN), un fake-ssh (NAVE_SSH_BIN) y un Ollama falso (NAVE_OLLAMA_URL).
Los tests que reinician la app usan NAVE_NO_RELAUNCH=1.
xterm pinta en WebGL: en e2e lee la salida con attach(...).replay, no del DOM.
Cada migración nueva lleva un test que la aplica sobre una BD antigua y comprueba que no se pierde nada.
8. Alcance
No empieces V2, V3 ni V4. Prepara abstracciones, pero no implementes Discord, Slack, Drive, Notion, multi-agente avanzado, plugins, sync en la nube ni multiusuario.

9. Primera entrega
Responde solo con la propuesta de arquitectura y espera mi aprobación. Después empieza por F0 y avanza fase a fase, con commit y push en cada paso
