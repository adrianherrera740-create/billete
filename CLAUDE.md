# Proyecto: base de trabajo para nuevos negocios y herramientas

Responde siempre en español. **Antes de nada lee `cerebro/condiciones.md`, `cerebro/estado.md` y `cerebro/aprendizajes.md`** (un hook los imprime al abrir la sesión). Todo trabajo pasa antes por las 13 condiciones de `cerebro/condiciones.md` (plan y luz verde, fases, un commit por cambio, cero secretos, verificar, lo generado por IA nunca nace verificado...). Vienen del prompt maestro de La Nave de la persona (`cerebro/la-nave-prompt-maestro.md`).

## Estado
- El proyecto anterior (tienda de dropshipping en TikTok Shop) está cerrado y borrado. Sigue en la rama `archivo/dropshipping` si hiciera falta consultarlo.
- La Nave (`la-nave/`) es una app de escritorio de Windows 11 con acceso desde el móvil; ver `la-nave/README.md`. Está construida y sin verificar en Windows real.
- Negocio actual: servicio «chief of staff digital» con agentes de IA para patrimonios altos en Cataluña/España. Léelo en `cerebro/negocio/resumen.md` (informe generado por IA, NO VERIFICADO). Reglas: el agente propone y el humano decide; datos en la UE; cero datos personales de terceros ni credenciales en el repo.

## Skills y agentes
- Skills genéricas en `.claude/skills/` (caveman*, cavecrew, investigate-first, lean-build, migration, safe-refactor, surgical-patch, verify-and-stop).
- 8 agentes genéricos en `.claude/agents/`: `director`, `ceo-estratega`, `cfo-finanzas`, `critico-escepticismo`, `auditor-calidad`, `curador-cerebro`, `pmo-operaciones`, `gestor-skills`; y 6 del negocio: `investigador-mercado`, `verificador-fuentes`, `arquitecto-agentes`, `auditor-seguridad-datos`, `redactor-legal-confianza`, `estratega-ventas-confianza`. Trabajo en `negocio/trabajo/`. Un subagente no puede lanzar a otros: solo el director.
- El cerebro (`cerebro/`) es la memoria; al terminar, actualízalo (ver `cerebro/README.md`).
