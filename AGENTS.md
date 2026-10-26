# Instrucciones para cualquier agente de programación (Codex, Aider, OpenCode, Cline, Claude Code...)

Proyecto: tienda de dropshipping en TikTok Shop España. Responde siempre en español.

## Antes de hacer nada
1. Lee `cerebro/README.md`, `cerebro/estado.md`, `cerebro/aprendizajes.md` y `cerebro/usuario.md`.
2. Antes de proponer un producto, busca en `cerebro/productos.md`: si ya está con veredicto NO o HOLD, no lo repitas sin datos nuevos.
3. Mira `cerebro/red-y-limites.md` para saber qué se puede hacer desde tu entorno.

## Reglas que no se negocian
- No inventar precios, proveedores, plazos, ventas ni medidas: lo no verificado se marca "no verificado" y no recibe GO.
- Un producto necesita gancho visual de 3 s, precio defendible con ancla de mercado en España (fuente y fecha) y margen con devoluciones del 10–15 %.
- Sin marcas en fichas, anuncios ni vídeos. Etiqueta de contenido IA, sin reseñas falsas, música comercial permitida.
- Productos excluidos: salud, suplementos, cosmética con promesas, electrónica con batería sin CE, juguetes, alimentación, marcas ajenas.
- TikTok Shop ES: comisión 9 % (4 % 60 días en tienda nueva), entrega al transportista en 2 días laborables con seguimiento válido.
- Pendientes siempre: alta fiscal, GPSR, CE/RAEE si hay electrónica.

## Equipo (roles en `.claude/agents/`)
Cada archivo `.claude/agents/<nombre>.md` define un rol. Si tu herramienta no puede lanzar subagentes, ejecuta los roles tú mismo, uno detrás de otro, leyendo su archivo: `director` (orquesta), dirección y finanzas (`ceo-estratega`, `cfo-finanzas`, `analista-escalado`, `pmo-operaciones`, `critico-escepticismo`), 6 jefes (`buscador-producto`, `analista-margenes`, `operaciones-cumplimiento`, `creativos-ia`, `creadores-muestras`, `crecimiento-anuncios`) con 3 especialistas cada uno, `auditor-calidad`, `gestor-skills` y `curador-cerebro`. El proceso (puertas, ritmo semanal, criterios de parada y escalado) está en `cerebro/proceso.md`; léelo antes de decidir. El método está en `.claude/agents/director.md` ("Modos de trabajo").

## Herramientas del proyecto
- Margen: `python3 .claude/skills/proveedor-es/scripts/margen_es.py --pvp 24.90 --coste 7.09 --envio 0 --dias-preparacion 2 --afiliado 0 --devoluciones 0.10 --tienda-nueva` (`--afiliado` es una fracción).
- Búsqueda en AliExpress ES con envío desde España: `node .claude/skills/proveedor-es/scripts/aliexpress_es.js "término"`.
- Filtro de catálogos CSV de proveedores: `.claude/skills/proveedor-es/scripts/filtrar_catalogo.py`.
- Barrido de AliExpress ES en paralelo con filtro y tabla: `python3 .claude/skills/proveedor-es/scripts/barrido.py terminos.txt --salida tienda/trabajo/ronda-N/barrido`.
- ¿Se puede escalar?: `python3 .claude/skills/proveedor-es/scripts/escalado.py --pvp 24.90 --coste 7.09 --devoluciones 0.15`.

## Al terminar (obligatorio)
Actualiza `cerebro/estado.md` (máx. 60 líneas), `cerebro/backlog.md`, `cerebro/productos.md`, `cerebro/decisiones.md`, `cerebro/aprendizajes.md` si aprendiste algo y `cerebro/diario/AAAA-MM-DD.md`. Después `git add -A`, commit y push. Sin datos personales ni claves.
