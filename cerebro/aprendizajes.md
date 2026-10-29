# Aprendizajes (reglas que ya nos costaron caras)

1. Un dato sin fuente leída (URL y fecha) es "no verificado" y no sostiene una decisión. Un resumen de buscador no es lectura.
2. Si el entorno no llega a una fuente (DNS, 403, login), parar y decirlo a la persona; no rellenar con estimaciones ni saltarse el acceso de otro servicio.
3. Antes de construir, comprobar si el modelo de negocio deja margen con datos reales; no comparar modelos con supuestos distintos.
4. Verificar antes de commitear (`npm run verify` en La Nave) y no dar por hecho lo que solo se probó en simulación (Windows, Tailscale, móvil reales).
5. Un subagente no puede lanzar a otros: solo el director.
