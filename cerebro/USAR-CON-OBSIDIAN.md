# Usar el cerebro con Obsidian

**Idea:** Obsidian no es la memoria de los agentes; es la forma cómoda de que TÚ leas y edites esa memoria. Los agentes leen y escriben los mismos archivos Markdown con git. Obsidian solo los muestra.

## Qué te da
- Buscar en todo el proyecto, ver enlaces entre notas (retroenlaces) y el grafo de relaciones.
- Editar `estado.md`, `usuario.md` o `backlog.md` a mano y que el equipo lo lea en la siguiente sesión.
- Verlo en el móvil si lo sincronizas.

## Cómo abrirlo
1. Instala Obsidian (https://obsidian.md) y clona el repo en tu ordenador.
2. En Obsidian: "Abrir carpeta como bóveda" y elige la carpeta del repo (no solo `cerebro/`, para que se vean también los informes de `tienda/trabajo/`). Obsidian ignora las carpetas que empiezan por punto (`.claude/`).
3. Empieza por [[cerebro/00-inicio]]. Se regenera con `python3 cerebro/generar-indice.py`.

## Cómo sincronizarlo con los agentes
- Antes de abrir una sesión de agentes: `git pull`. Después de editar tú: commit y `git push`.
- Opción cómoda: el plugin comunitario "Obsidian Git" hace pull y push automáticos. No lo he probado.
- Si editas a la vez que un agente puede haber conflictos: edita cuando no haya una ronda en marcha.

## Plugins útiles (opcionales, sin probar aquí)
- Kanban o Dataview para ver `backlog.md` y `productos.md` como tablero o consulta.
- No hacen falta para que el cerebro funcione.

## Cuándo NO bastaría con esto
Si algún día hay miles de notas y los agentes necesitan búsqueda por significado, habría que añadir una memoria con índice vectorial. Con unas decenas de archivos, texto plano y git es más simple y más fiable.
