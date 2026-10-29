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
