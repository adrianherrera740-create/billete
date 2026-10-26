# Cerebro del proyecto

Memoria compartida de todos los agentes. Son archivos de texto: funcionan igual en Claude Code, en `fcc-claude` (Free Claude Code) y en cualquier otro agente que lea el repo.

## Qué hay aquí
| Archivo | Para qué sirve | Cuándo se lee | Cuándo se escribe |
|---|---|---|---|
| `estado.md` | Dónde estamos, qué sigue y qué decide la persona. Máx. 60 líneas | Siempre, al empezar | Al terminar cada sesión o paso |
| `aprendizajes.md` | Reglas que ya nos han costado caras. No repetir errores | Siempre, al empezar | Cuando se aprende algo nuevo |
| `productos.md` | Tabla de todo producto evaluado: enlace, coste, PVP, veredicto y motivo | Antes de proponer un producto | Al evaluar o cambiar un veredicto |
| `decisiones.md` | Registro fechado de decisiones y por qué se tomaron | Cuando haya dudas sobre el pasado | Cada vez que se decide algo |
| `red-y-limites.md` | Qué se puede y qué no se puede hacer desde cada entorno | Antes de buscar proveedores o datos | Cuando cambie el entorno |
| `usuario.md` | Cómo le gusta trabajar a la persona y qué ha rechazado | Siempre, al empezar | Cuando exprese una preferencia |
| `diario/AAAA-MM-DD.md` | Qué se hizo cada día, en orden | Solo si hace falta el detalle | Al final de cada sesión |
| `USAR-EN-FCC.md` | Cómo usar este proyecto con Free Claude Code | Una vez | Cuando cambie el método |

## Protocolo (obligatorio)
1. **Al empezar:** leer `estado.md`, `aprendizajes.md`, `usuario.md` y la fila de `productos.md` de lo que se vaya a tocar. En Claude Code, un hook (`.claude/settings.json`) ya imprime `estado.md` y `aprendizajes.md` al abrir la sesión.
2. **Durante el trabajo:** no proponer un producto que ya esté en `productos.md` con veredicto NO o HOLD sin una razón nueva con datos.
3. **Al terminar:** actualizar `estado.md` (siempre), `productos.md`, `decisiones.md`, `aprendizajes.md` si aprendiste algo y `diario/` con la fecha de hoy. Después `git add -A`, commit y push.
4. **Reglas de escritura:** en español, datos con fuente y fecha, lo no verificado marcado como "no verificado", nada inventado, sin datos personales. `estado.md` no pasa de 60 líneas: lo viejo se mueve a `diario/`.
