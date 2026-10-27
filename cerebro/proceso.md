# Cómo funciona la empresa (proceso)

Pequeña empresa de dropshipping con 33 agentes. Objetivo: llegar a decisiones coherentes, repetibles y con números, y saber cuándo escalar, aguantar o parar.

## 1. Organigrama
| Área | Roles | Qué decide / entrega |
|---|---|---|
| Dirección | `director` (orquesta), `ceo-estratega` (objetivo, hipótesis, GO/PIVOTE/CIERRE), `critico-escepticismo` (pre-mortem) | Qué se hace esta semana y qué se deja de hacer |
| Finanzas y escalado | `cfo-finanzas` (P&L, caja, topes), `analista-escalado` (¿se puede crecer?) | Cuánto se puede gastar y cuándo subir el presupuesto |
| Operación del proyecto | `pmo-operaciones` (backlog y partes), `gestor-skills`, `curador-cerebro` (memoria) | Orden, herramientas y memoria |
| Producto | `buscador-producto` + `investigador-tendencias`, `buscador-proveedores`, `verificador-fichas` | Qué producto y de qué proveedor |
| Márgenes | `analista-margenes` + `calculador-escenarios`, `auditor-precios-mercado`, `simulador-packs` | Precio y beneficio por pedido |
| Cumplimiento | `operaciones-cumplimiento` + `revisor-normativa-ue`, `revisor-logistica-plazos`, `revisor-contenido-ia` | Qué se puede vender y publicar |
| Marketing | `creativos-ia` + `guionista-videos`, `redactor-fichas`, `prompter-higgsfield`; `creadores-muestras` + `buscador-creadores`, `redactor-briefs`, `gestor-muestras` | Vídeos, fichas y creadores |
| Crecimiento | `crecimiento-anuncios` + `analista-metricas`, `planificador-gmvmax`, `auditor-atribucion` | Qué vídeos funcionan y cuánto invertir |
| Control | `auditor-calidad` | Recalcula cifras y bloquea lo no demostrado |

Un subagente no puede lanzar a otros: lanza el `director`.

## 2. Ritmo semanal (ciclo continuo)
- **Lunes, planificación:** `ceo-estratega` fija el objetivo y las 3 prioridades; `pmo-operaciones` convierte eso en tareas paralelizables en `cerebro/backlog.md`; `cfo-finanzas` fija el tope de gasto.
- **Martes a jueves, ejecución:** el director lanza las tareas en paralelo por departamento (especialistas → jefes). Cada informe termina con "Datos clave".
- **Jueves, puerta:** `critico-escepticismo` (pre-mortem) → `auditor-calidad` (cifras y fuentes) → `ceo-estratega` decide.
- **Viernes, revisión:** `cfo-finanzas` cierra la semana, `analista-escalado` actualiza la viabilidad, `pmo-operaciones` hace el parte y `curador-cerebro` guarda todo en `cerebro/` con commit y push.
- **Cada sesión:** empieza leyendo el cerebro y acaba actualizándolo. Una sesión nueva debe poder continuar donde se quedó la anterior sin que nadie repita nada.

## 3. Puertas de decisión de un producto
Los umbrales de la puerta 2 en adelante son de PARTIDA: se ajustan con datos reales y el cambio se anota en `cerebro/decisiones.md`.

| Puerta | Se pasa si | Quién decide |
|---|---|---|
| 0. Idea | Gancho visual de 3 s, sin marca, no regulado, hay término de búsqueda, no está descartado en `productos.md`, puntuación ≥ 24/40 | `buscador-producto` |
| 1. Validación en papel (sin gastar) | Ancla de precio leída en España; proveedor comprobado por 2 agentes independientes; margen con devoluciones 15 % y comisión 9 % ≥ 25 % y CPA de equilibrio ≥ 8 €; normativa sin NO; puntuación ≥ 32/40; **la persona ha abierto la ficha** (stock, plazo, origen, contenido) y pasa el pre-mortem | `ceo-estratega` con `auditor-calidad` y `critico-escepticismo` |
| 2. Piloto (mes 1, sin anuncios) | 15–25 vídeos orgánicos con 5 ángulos; al menos 1 vídeo ≥ 5.000 vistas; ≥ 10 pedidos en 30 días; devoluciones < 12 %; ≥ 95 % de pedidos entregados al transportista en 2 días laborables; sin reclamaciones de seguridad | `ceo-estratega` con `cfo-finanzas` |
| 3. Escalado por etapas | ≥ 30 pedidos con CPA medido; CPA real ≤ 70 % del CPA de equilibrio durante 7 días; ≥ 2 creativos ganadores; capacidad del proveedor confirmada por escrito; caja ≥ capital atrapado + 1 semana de anuncios; `escalado.py` en verde | `analista-escalado` y `cfo-finanzas`, decide el `ceo-estratega` |
| 4. Consolidación | Segundo proveedor probado, segundo producto o canal en piloto, alta fiscal y gestoría resueltas | `ceo-estratega` |

**Etapas de presupuesto de anuncios:** 500 → 1.000 → 2.000 → 5.000 €/mes. Se sube un escalón solo tras 7 días seguidos por encima del ROAS objetivo y sin superar el 30–50 % de subida cada 3 días (regla práctica sin verificar). Se baja un escalón si el CPA real supera el CPA de equilibrio 3 días seguidos.

## 4. Criterios de parada y pivote (stop-loss)
- Piloto sin ningún vídeo ≥ 2.000 vistas tras 10 días con 3 ángulos distintos → pivotar el ángulo; tras 20 días → cerrar el producto.
- CPA real > CPA de equilibrio durante 7 días con ≥ 3 variantes de creativo → parar anuncios de ese producto.
- Devoluciones > 20 %, alguna reclamación de seguridad o < 80 % de entregas a tiempo → pausar la ficha y revisar proveedor.
- Pérdida acumulada de un producto > 150 € (30 % del presupuesto mensual) → cerrar. El `cfo-finanzas` lo vigila.
- Opciones de pivote por este orden: otro ángulo de vídeo → otro precio o pack → otro proveedor → otro producto del mismo problema → otro canal.

## 5. Viabilidad de escalar
Ejecutar `python3 .claude/skills/proveedor-es/scripts/escalado.py --pvp X --coste Y --devoluciones 0.15` y volver a ejecutarlo con datos reales cuando haya piloto. Mira: beneficio por pedido tras anuncios, CPA y ROAS de equilibrio, pedidos/día frente a la capacidad del proveedor, capital atrapado entre pagar y cobrar, y margen de seguridad (≥ 30 %). Veredicto: ESCALAR (por etapas), AGUANTAR, NO ESCALAR o PARAR. Si no hay negocio escalable con un producto, el `analista-escalado` propone la alternativa con números.

## 6. Calidad de los datos
- Todo informe acaba con el bloque "Datos clave" (`cerebro/plantillas/datos-clave.md`).
- Dos fuentes independientes antes de dar un dato por bueno (doble comprobación de proveedor).
- Distinguir siempre: dato medido, dato leído en un listado y supuesto.

## 7. Límites y riesgos de operación
- El límite de uso salta con rondas de 25+ agentes: planificar en lotes de ≤ 10 agentes en paralelo y guardar tras cada lote (`curador-cerebro`).
- Si salta, parar, commit y push, y reanudar con SendMessage.
- Riesgos abiertos: `cerebro/riesgos.md`. Hipótesis a probar: `cerebro/hipotesis.md`.

## 8. Estrategia de modelos (varios modelos para trabajar de forma continua)
Asignar el modelo más fuerte a quien decide y uno más barato y rápido a quien recoge datos. En Claude Code se puede fijar con `model:` en la cabecera de cada agente; en Free Claude Code se configura por niveles (Fable/Opus/Sonnet/Haiku) en su Admin.
| Nivel | Roles | Motivo |
|---|---|---|
| Fuerte | `director`, `ceo-estratega`, `cfo-finanzas`, `critico-escepticismo`, `auditor-calidad`, `analista-escalado` | Decisiones y razonamiento con números |
| Medio | Jefes y especialistas de producto, márgenes, cumplimiento, creativos y crecimiento | Análisis y redacción con fuentes |
| Rápido/barato | `pmo-operaciones`, `curador-cerebro`, `gestor-skills`, barridos con `barrido.py` | Tareas de orden y recogida mecánica |
Hasta medirlo, no se cambia el modelo de ningún agente: está sin probar qué nivel da menos errores en cada rol.

## PROPUESTA del CEO (27/10/2026) - PENDIENTE DE APROBACIÓN DE LA PERSONA (no vigente)
Añadir una puerta M ("marca") sin sustituir las puertas de producto, que siguen para el dropshipping residual:
- M0 (02/11/2026): respuestas de la persona + lectura de canal. Si no, PAUSAR.
- M1 (09/11/2026): ancla leída (>= 3 fichas PVP >= 25 € y >= 500 ventas) y Seller Center no bloquea stock propio/plazo. Si falla, se archiva marca propia como canal consumidor.
- M2 (26/11/2026): "SOLO SI" a-f: (a) hoja de canal, (b) origen y plazo admitidos, (c) 2 cotizaciones con coste puesto en España <= 40 % del PVP leído, (d) alta fiscal, (e) capital confirmado, (f) >= 10 reservas pagadas o 1 pedido B2B con anticipo.
Criterios de parada: B2B < 2 respuestas de 15 (un ajuste, luego cerrar); preventa < 10 reservas en 14 días (un ajuste, luego cerrar); afiliación sin venta ni vídeo > 5.000 vistas en 21 días; gasto > 30 € sin nueva respuesta; persona < 3 h/semana: pausar.
Fuente: `tienda/trabajo/ronda-12/decision-ceo.md` §4.

## 9. Protocolo de homologacion de proveedores (ronda 13, 27/10/2026) - herramienta, no decision
Fuente: `tienda/trabajo/ronda-13/proveedores/protocolo-homologacion.md` con las correcciones de `calidad/ronda-13-proveedores.md` 7.3.
- Fase 0 (sin puntos, eliminatoria): red flags rojas (p. ej. sin razon social ni CIF/VAT en el aviso legal) y validacion VIES.
- Puerta previa de plataforma: origen del stock admitido, plazo, conector ES y alta en Seller Center; si fallan, el proveedor no se puntua.
- 15 comprobaciones puntuadas sobre 30; minimo 24/30 para homologar. Cada punto exige dato [OFICIAL] (cita literal, URL, fecha); [BLOG] puntua 0.
- Anadir coste de importacion (derecho de 3 EUR, IVA de importacion, aduana) cuando el origen no es UE.
- Estado: CJ corregido a 4/30 (red flag roja 1 activa, punto 4 con /service-fee, punto 13 a 0); BigBuy y resto sin puntuar (sin acceso). Ningun proveedor homologado.
