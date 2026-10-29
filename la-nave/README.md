# La Nave

Tu escritorio de proyectos con IA para Windows 11: proyectos con pizarra, terminales reales, Claude Code, tareas, notas y un Brain con búsqueda.

**Estado:** fases F0 a F8 construidas y probadas en el contenedor de desarrollo (Linux): 232 tests unitarios y 18 pruebas e2e (Electron real y un navegador con forma de móvil). **Acceso desde el móvil construido** (ver abajo). **Pendiente de verificar en un Windows real** (ver abajo). Plan por fases en el prompt de la persona (`../cerebro/la-nave-prompt-maestro.md`) y decisiones en `docs/adr/`.

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
- **Tailscale real:** `tailscale serve` se probó con un Tailscale simulado; no se ha ejecutado contra uno real.
- **Móvil real:** la web móvil se probó en Chromium con viewport 390x844 y agente de usuario de móvil, no en un teléfono; la instalación como app (PWA) y el uso de la cámara para el QR dependen de tu móvil.
- **Fuera de V1** (preparado, no implementado): vault de carpetas con watcher, grafo, MCP, SSH, navegador en pizarra, notas adhesivas avanzadas y Ollama.

## Acceso desde el móvil
1. Instala Tailscale en el PC y en el móvil (misma cuenta). Es lo que evita abrir nada a internet.
2. En La Nave: Ajustes → Acceso desde el móvil → activar → **Publicar con Tailscale** (ejecuta `tailscale serve`; `tailscale serve reset` quita todo lo que tengas publicado).
3. **Emparejar un móvil** y escanear el QR con la cámara. El código es de un solo uso y caduca; cada móvil tiene su propia llave y se revoca desde la misma lista.
4. Desde el móvil: resumen de proyectos, captura rápida a la bandeja, tareas y notas. Lo que cambies aparece al momento en el PC. Terminales, Claude, copias y ajustes **no** se pueden usar desde el móvil (lista cerrada de canales; el resto da 403).
Diseño y amenazas: `docs/adr/ADR-002-acceso-movil.md`. Capturas: `docs/movil-*.png`.
Pruebas e2e en Linux: `NAVE_E2E_CHROMIUM=/ruta/a/chromium npm run test:e2e`.

## Reglas de trabajo
Fases PHASE → PLAN → IMPLEMENT → TEST → VERIFY → DOCUMENT → NEXT, un commit por cambio, nunca secretos en el repo. Atajos fijos: Ctrl+K, Ctrl+Shift+P, Ctrl+Shift+T, Ctrl+Shift+A, Ctrl+Shift+B (sin Ctrl+N).
