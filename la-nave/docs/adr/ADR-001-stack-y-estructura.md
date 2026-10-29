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
