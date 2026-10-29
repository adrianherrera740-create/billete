# Cerebro del proyecto

Memoria compartida de todos los agentes. Son archivos de texto: funcionan igual en Claude Code y en cualquier otro agente que lea el repo.

## Qué hay aquí
| Archivo | Para qué sirve | Cuándo se lee | Cuándo se escribe |
|---|---|---|---|
| `condiciones.md` | 13 condiciones por las que pasa todo trabajo (plan, fases, commits, secretos, verificación...) | Siempre, al empezar | Solo si la persona las cambia |
| `la-nave-prompt-maestro.md` | Prompt maestro de La Nave (proyecto aparte, en construcción en `la-nave/`): fuente de las condiciones | Al trabajar en La Nave | Nunca (texto de la persona) |
| `estado.md` | Dónde estamos, qué sigue y qué decide la persona. Máx. 60 líneas | Siempre, al empezar | Al terminar cada sesión o paso |
| `aprendizajes.md` | Reglas que ya nos han costado caras. No repetir errores | Siempre, al empezar | Cuando se aprende algo nuevo |
| `decisiones.md` | Registro fechado de decisiones y por qué se tomaron | Cuando haya dudas sobre el pasado | Cada vez que se decide algo |
| `backlog.md` | Tareas pendientes | Al planificar | Cada semana |
| `usuario.md` | Cómo le gusta trabajar a la persona y qué ha rechazado | Siempre, al empezar | Cuando exprese una preferencia |
| `diario/AAAA-MM-DD.md` | Qué se hizo cada día, en orden | Solo si hace falta el detalle | Al final de cada sesión |

## Protocolo (obligatorio)
1. **Al empezar:** leer `estado.md`, `aprendizajes.md`, `usuario.md` . En Claude Code, un hook (`.claude/settings.json`) ya imprime `estado.md` y `aprendizajes.md` al abrir la sesión.
2. **Durante el trabajo:** no repetir lo que ya está descartado en `decisiones.md` sin una razón nueva con datos.
3. **Al terminar:** actualizar `estado.md` (siempre), `decisiones.md`, `aprendizajes.md` si aprendiste algo y `diario/` con la fecha de hoy. Después `git add -A`, commit y push.
4. **Reglas de escritura:** en español, datos con fuente y fecha, lo no verificado marcado como "no verificado", nada inventado, sin datos personales. `estado.md` no pasa de 60 líneas: lo viejo se mueve a `diario/`.
