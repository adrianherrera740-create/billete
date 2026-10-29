# Condiciones de trabajo (todo pasa por aquí antes)

Origen: prompt maestro de La Nave, aportado por la persona el 29/10/2026 (texto íntegro en `la-nave-prompt-maestro.md`). Esta lista es su parte aplicable a TODO el proyecto, no solo al código. Si una tarea no cumple una condición, se para y se dice cuál. Las reglas de negocio de `CLAUDE.md` siguen vigentes y no se tocan.

## Las 13 condiciones
1. **Plan antes de actuar.** Cambio grande (modelo de negocio, gasto, código, herramienta nueva): propuesta corta y luz verde de la persona antes de ejecutar. Tarea pequeña: plan de una línea.
2. **Por fases, sin saltar.** FASE → PLAN → HACER → PROBAR → VERIFICAR → DOCUMENTAR → SIGUIENTE. Si una fase base está rota, no se avanza .
3. **Un commit por cambio, con push.** Pequeños y frecuentes; nunca acumular cambios sin commitear.
4. **Cero secretos.** Ni claves, tokens, contraseñas, datos fiscales ni personales en el repo, commits, logs, cerebro, prompts o informes.
5. **Decisiones documentadas.** Toda decisión importante, con fecha y motivo, en `decisiones.md` (en código: `docs/adr/`).
6. **Verificar antes de dar por hecho.** Código: `npm run verify` (tipos, lint, test, build) leído y sin errores antes de commitear. Negocio: cada cifra con fuente y fecha; si no, "no verificado" y sin GO.
7. **No asumir herramientas ni accesos.** Detectar si existen y degradar con gracia. Los errores dicen qué pasó, por qué y qué puede hacer la persona .
8. **Lo generado por IA nunca nace verificado.** Estados: Verificado / No verificado / Obsoleto. La persona acepta, edita o rechaza. En informes: [OFICIAL] solo con URL y cita literal; [BLOG] y [NO VERIFICADO] no sostienen un GO.
9. **Proyecto primero.** Todo pertenece a un proyecto y su contexto no se mezcla con otro (un negocio frente a La Nave) salvo petición explícita.
10. **Terminado significa:** funciona, maneja errores, queda guardado, tiene prueba en lo crítico, está documentado y no rompe lo existente.
11. **Alcance cerrado.** No empezar V2, V3 ni V4. Se pueden preparar abstracciones, pero no implementar extras que no se pidieron.
12. **Avisar de lo que obliga a la persona.** Reinstalar, pagar, abrir una web, firmar o cambiar una regla: se dice de forma explícita y va en la lista de "solo la persona".
13. **Seguridad por defecto.** Validar toda entrada. Nunca saltarse permisos (`--dangerously-skip-permissions`). Lo de solo lectura se hace sin preguntar; lo demás, con permiso.

## Cómo se aplican
- **Director:** antes de cada lote, comprueba 1, 2, 7 y 12 en el plan; al cerrar, 3, 5 y 8.
- **auditor-calidad:** en cada puerta revisa 4, 6, 8 y 10 y rechaza lo que incumpla, citando el número.
- **curador-cerebro:** al cerrar una ronda comprueba 3, 4 y 5.
- **Cualquier agente:** si dudas de una condición, se aplica la más estricta.

## La Nave
Proyecto aparte (app de escritorio para Windows 11). La persona aprobó la propuesta de arquitectura el 29/10/2026 ("haz la nave") y se construye en `la-nave/` (carpeta autocontenida de este repositorio, separable a su propio repo). Estado y decisiones técnicas: `la-nave/README.md` y `la-nave/docs/adr/`. Las 13 condiciones rigen también para su código: `npm run verify` antes de cada commit y un commit por cambio.
