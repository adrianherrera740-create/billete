# La Nave

Tu escritorio de proyectos con IA para Windows 11: proyectos, terminales reales, Claude Code, un Brain con búsqueda, tareas y notas.

Estado: **F0 a F5 completadas** (andamiaje, núcleo y persistencia, proyectos y pizarra, terminales reales, Claude Code, tareas y notas). Plan completo por fases en `docs/adr/` y en el prompt maestro de la persona (`../cerebro/la-nave-prompt-maestro.md`).

## Requisitos
- Node 22 o superior y Git.
- Windows 11 para la app final. En Linux se puede construir, pasar `verify` y ejecutar el e2e (`xvfb-run -a npm run test:e2e`), pero no probar los terminales de Windows.

## Comandos
| Comando | Qué hace |
|---|---|
| `npm install` | Instala todo el monorepo |
| `npm run dev` | Arranca la app en modo desarrollo |
| `npm run verify` | Tipos + lint + tests + build. Obligatorio antes de cada commit |
| `npm test` | Tests unitarios (Vitest) |
| `npm run test:e2e` | Prueba sobre Electron real (necesita `npm run build` antes) |
| `npm run dist` | Instalador `.exe` (F8) |

## Estructura
```
apps/desktop      Electron + React + TypeScript (main, preload, renderer, e2e)
packages/shared   contratos: canales IPC, parsers, tipos
packages/core     EventBus, logging con rotación, redactSecrets
packages/db       migraciones aditivas con checksum, backups, recuperación y restauración
docs/adr          decisiones importantes
```

## Reglas de trabajo
Fases PHASE → PLAN → IMPLEMENT → TEST → VERIFY → DOCUMENT → NEXT, un commit por cambio, nunca secretos en el repo. Atajos fijos: Ctrl+K, Ctrl+Shift+P, Ctrl+Shift+T, Ctrl+Shift+A, Ctrl+Shift+B (sin Ctrl+N).
