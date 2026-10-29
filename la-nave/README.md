# La Nave

Tu escritorio de proyectos con IA para Windows 11: proyectos con pizarra, terminales reales, Claude Code, tareas, notas y un Brain con búsqueda.

**Estado:** fases F0 a F8 construidas y probadas en el contenedor de desarrollo (Linux): 180 tests unitarios y 17 pruebas e2e sobre Electron real. **Pendiente de verificar en un Windows real** (ver abajo). Plan por fases en el prompt de la persona (`../cerebro/la-nave-prompt-maestro.md`) y decisiones en `docs/adr/`.

## Requisitos
- Node 22 o superior y Git. Windows 11 para la app final.
- Para el instalador `.exe` hace falta **Windows** (el último paso de NSIS ejecuta el instalador; desde Linux exigiría `wine`).

## Primeros pasos en tu PC
```powershell
git clone --depth 1 --branch claude/limpiar-repositorio-o2fihp https://github.com/adrianherrera740-create/billete
cd billete\la-nave
npm install
npm run dev          # abre La Nave en modo desarrollo
npm run verify       # tipos + lint + tests + build (antes de cada commit)
npm run dist         # genera el instalador en apps\desktop\release\La-Nave-Instalador-<versión>.exe
```

## Comandos
| Comando | Qué hace |
|---|---|
| `npm run dev` | Arranca la app en desarrollo |
| `npm run verify` | Tipos + lint + tests + build. Obligatorio antes de cada commit |
| `npm test` | Tests unitarios (Vitest) |
| `npm run test:e2e` | Pruebas sobre Electron real (necesita `npm run build`). En Linux: `xvfb-run -a npm run test:e2e` |
| `npm run dist` | Instalador de Windows (NSIS, x64) |
| `npm run dist:dir -w @nave/desktop` | Solo la carpeta empaquetada, sin instalador (sirve para probar el empaquetado) |

Probar la app **empaquetada** (la que lleva el instalador): `NAVE_E2E_EXECUTABLE=<ruta al ejecutable> npm run test:e2e:packaged -w @nave/desktop`.

## Qué tiene
- **Proyectos y pizarra:** paneles que se mueven y redimensionan, zoom hasta el 100 %, visión general de solo lectura, todo se guarda.
- **Terminales reales:** PowerShell, CMD, Git Bash y cada distribución de WSL (los que no estén instalados no aparecen).
- **Claude Code:** ejecuta el `claude` real; el estado (inactivo, trabajando, espera tu respuesta) llega por hooks; historial de solo lectura; reanudar la misma sesión.
- **Tareas y notas:** tareas siempre de un proyecto; notas con proyecto o en la bandeja; «Enviar a Claude» pega sin pulsar Intro.
- **Brain:** nodos con confianza (verificado / sin verificar / obsoleto), enlaces `[[Título]]`, búsqueda FTS5 y contexto acotado para la IA. Lo que propone Claude nunca nace verificado.
- **App:** Command Center, búsqueda global (Ctrl+K), paleta de comandos (Ctrl+Shift+P), atajos Ctrl+Shift+T/A/B, tema claro/oscuro/sistema, notificaciones con la ventana sin foco, ventana que recuerda tamaño y posición, copias de seguridad con restauración al reiniciar y opción de deshacer.

## Estructura
```
apps/desktop      Electron + React + TypeScript (main, preload, renderer, e2e, build/ con el icono)
packages/shared   contratos: canales IPC, parsers, tipos, clasificación remota
packages/core     EventBus, logging con rotación, redactSecrets
packages/db       migraciones aditivas con checksum, FTS5, copias, recuperación y restauración
docs/adr          decisiones importantes
```

## Lo que NO está verificado todavía
- **Windows real:** ConPTY, PowerShell, WSL y la detección de shells (se probó con un sistema de ficheros simulado y con bash de Linux).
- **Smart App Control / antivirus:** los binarios sin firmar de `node-pty` y el propio `.exe` podrían bloquearse. El instalador no está firmado.
- **El instalador `.exe`:** la configuración (`apps/desktop/electron-builder.yml`) se validó hasta la carpeta `win-unpacked` (ejecutable x64, `node-pty` con binarios de Windows fuera del `.asar`); el NSIS final debe generarse en Windows.
- **Claude Code real con sesión iniciada:** los hooks se probaron con un `claude` falso que imita su comportamiento.
- **Notificaciones nativas:** se prueba la lógica, no cómo se ven en Windows.
- **Fuera de V1** (preparado, no implementado): vault de carpetas con watcher, grafo, MCP, SSH, navegador en pizarra, notas adhesivas avanzadas, Ollama y acceso desde el móvil.

## Reglas de trabajo
Fases PHASE → PLAN → IMPLEMENT → TEST → VERIFY → DOCUMENT → NEXT, un commit por cambio, nunca secretos en el repo. Atajos fijos: Ctrl+K, Ctrl+Shift+P, Ctrl+Shift+T, Ctrl+Shift+A, Ctrl+Shift+B (sin Ctrl+N).
