# Puerta de calidad 1, ronda 14 (preparación de la lectura de canal)

Autor: auditor-calidad. Fecha: 29/10/2026. Revisados: `tienda/trabajo/ronda-14/producto/hoja-lectura-canal.md`, `cumplimiento/preguntas-seller-center-y-gestoria.md`, `finanzas/supuestos-y-tope.md`. Contrastados con `cerebro/condiciones.md`, `CLAUDE.md`, `cerebro/aprendizajes.md`, `tienda/trabajo/ronda-12/decision-ceo.md` y `estado.md`. Cálculos ejecutados hoy con `.claude/skills/proveedor-es/scripts/margen_es.py` y `escalado.py`.

## Veredicto

| Informe | Veredicto | Motivo en una línea |
|---|---|---|
| finanzas/supuestos-y-tope.md | RECHAZADO (corrección de 2 líneas) | El núcleo se reproduce, pero una cifra de la ronda 13 (8,83 / 10,27 €) no sale con el script (condiciones 6 y 8) |
| producto/hoja-lectura-canal.md | RECHAZADO | La regla AGUANTAR contradice el criterio de parada de decision-ceo y los añadidos del agente no están marcados como propuesta (condiciones 5 y 8) |
| cumplimiento/preguntas-seller-center-y-gestoria.md | RECHAZADO (menor) | Sin tiempo estimado, asume una cuenta de Seller Center que la persona quizá no tiene, y las capturas pueden llevar datos personales (condiciones 4, 7 y 12) |

Ninguno exige rehacer el informe; son correcciones de texto.

## 1. Recálculo de finanzas (control 1)

Comando base: `margen_es.py --pvp 24.90 --envio 0 --dias-preparacion 1 --dias-entrega 2 --comision-tiktok 0.09 --devoluciones 0.15 --afiliado 0`.

| Caso | Dice el informe | Recalculado | Resultado |
|---|---|---|---|
| Coste 7,09 | 8,04 € (39,1 %), GO | 8,04 €, 39,1 %, GO; CPA de equilibrio 8,04; PVP mínimo 17,90 | OK |
| Coste 10,09 (7,09 + 3 €) | 5,04 € (24,5 %), HOLD, PVP mínimo 25,20 | 5,04 €, 24,5 %, HOLD, PVP mínimo 25,20 | OK |
| Coste 11,59 (con 1,50 € ilustrativos) | 3,54 € (17,2 %), HOLD | 3,54 €, 17,2 %, HOLD | OK |
| Sensibilidad 2x2x2 (comisión 9/4, devoluciones 15/10, afiliado 0/15) | 8,04 / 5,42 / 9,07 / 6,29 / 9,07 / 6,45 / 10,10 / 7,32 | Idénticas, con los mismos márgenes | OK |
| `escalado.py`, coste 7,09, 500 €, CPA 8 | +2 € (9 %), +67 € (4 %), margen de seguridad 0 % | +2 €, +67 €, 0 %, NO ESCALAR | OK |
| `escalado.py`, coste 10,09 | CPA de equilibrio 5,04 (9 %) y 6,07 (4 %); con CPA 8 pierde en ambos | 5,04 y 6,07; -185 € y -121 €; PARAR | OK |
| Base de la comisión 9 % | No la explica | 1,85 € = 9 % de la base sin IVA (20,58). Es una suposición del script, no una regla de TikTok | Falta aclararlo |
| Devoluciones 0,15 | Producto perdido | Se descuenta el 15 % de la base de ingresos; con envío 0 no suma coste de logística | OK |
| Ronda 13: PVP 34,90, coste 12,50, envío 0, comisión 9 %, afiliado 0 | 8,83 € (dev. 15 %) y 10,27 € (dev. 10 %) | 5,15 € y 6,38 € | NO REPRODUCE |

## 2. Fallos de finanzas

1. `finanzas/supuestos-y-tope.md` línea 37 y línea 158 (fila "Ilustrativo POD"): las cifras 8,83 € y 10,27 € no salen del script con los parámetros que el propio informe declara; salen 5,15 € y 6,38 €. No aparecen en ningún otro informe de `tienda/trabajo`, así que no hay fuente. Incumple la condición 6 (cada dato con fuente) y la 8 (lo generado por IA nace no verificado). La "Alerta 2" depende de esa comparación. Corrección: sustituir por las cifras recalculadas (5,15 y 6,38, diferencia de 1,23 €) citando el comando, o quitar la fila. Además, la fila de la línea 158 lleva veredicto "CERRADO" apoyado en un número no reproducible.
2. Línea 13 y tabla 1: el 9 % se aplica sobre la base sin IVA. Es una convención de `margen_es.py` y no se ha comprobado en Seller Center. Debe aparecer como SUPUESTO en la tabla 1 y como pregunta en A1 de la hoja de cumplimiento. Con el 9 % sobre el PVP con IVA, la comisión sube de 1,85 a 2,24 €.
3. Líneas 77-89 (tabla 2.3): el aviso al 80 % del tope (24 €) y la acción "cada euro nuevo con visto bueno" son añadidos del agente y no figuran en `decision-ceo.md` §4. El texto ya declara que los techos de 20 y 10 € son suyos, pero no declara esto. Marcarlo "propuesta".
4. Línea 111: describe el derecho de 3 € "por envío y línea arancelaria"; la hoja de cumplimiento B3 pregunta "por paquete o por artículo". Las dos versiones son NO VERIFICADO. Basta unificar la redacción y no afirmar ninguna.

Lo que sí está bien: el "5 %" de `estado.md` (línea 38 de ese archivo: "4/5/9 %") se trata como NO VERIFICADO y no se usa; el derecho de 3 €, el flete, el IVA de importación, la tarifa de autónomo (88,64 €, blog) y la gestoría van sin etiqueta OFICIAL; no se toca ningún script; el tope de 30 € se marca como pendiente de las preguntas 1 y 2.

## 3. Datos presentados como verificados sin fuente oficial (control 2)

- Rutas de menú de Seller Center: correcto. El informe de cumplimiento las marca [NO VERIFICADO] en cada pregunta ("Dónde buscar") y pide la ruta real a la persona. La hoja de lectura avisa de que los botones pueden variar. Sin hallazgos.
- Plazo de 5 días: se trata como hipótesis abierta (2 días de CLAUDE.md frente a 5 vistos), pregunta A2 correcta. Sin hallazgos.
- Derecho de 3 €: [NO VERIFICADO] en los tres informes. Sin hallazgos.
- Comisión del 5 %: finanzas lo declara no localizado. El informe de cumplimiento no lo menciona, y la pregunta A1 solo ofrece "9 % / otro". Corrección: añadir en A1 una casilla "4 % / 5 % / 9 %" para que `estado.md` quede resuelto con una sola lectura.
- "Hipótesis del proyecto" en A1 y A2: bien etiquetadas, con origen CLAUDE.md y estado.md.
- La hoja de lectura declara "Cero precios o ventas leídos a 29/10/2026" y no inventa ninguno. Correcto.

## 4. Hoja de lectura frente a decision-ceo §4 (control 3)

Referencia: `decision-ceo.md` líneas 46 y 52 (etapa 1 y criterio de parada), líneas 60-61 (condiciones a-f).

Fallos:
1. `hoja-lectura-canal.md` línea 206 (AGUANTAR): "Hay 1 o 2 fichas ancla" queda en AGUANTAR, y la línea 207 (PARAR) solo se activa con 0 fichas. `decision-ceo.md` (líneas 46 y 52) dice que con menos de 3 fichas a >= 25 € y >= 500 ventas, o si Seller Center no admite stock propio, se cierra la marca propia como canal consumidor. Por tanto 1 o 2 fichas es PARAR, no AGUANTAR. Corrección: mover 1-2 fichas a PARAR, o dejar AGUANTAR y anotar en `decisiones.md` (condición 5) que se cambia el criterio del CEO, con fecha y motivo. Sin esa anotación, la hoja suaviza una regla de parada ya fijada.
2. Línea 206: el "único ajuste" (repetir con 2 búsquedas nuevas, máximo 45 min) es un mecanismo nuevo que no está en decision-ceo. No está marcado como propuesta. La condición 1 (plan y luz verde) obliga a que lo apruebe la persona o el CEO.
3. Líneas 201, 205 y 212-213 (>= 2 vendedores distintos; 3 fichas en la misma búsqueda o público; la variante premium no cuenta; ventas por debajo de 15 € = PARAR): son añadidos del agente. decision-ceo (a) solo exige >= 3 fichas de PVP >= 25 € y >= 500 ventas. La línea 199 dice "Esta regla se fija ahora y no se modifica", lo que presenta los añadidos como norma. Corrección: una columna o nota "Origen" (decision-ceo / aprendizajes / PROPUESTA del agente) en cada criterio. La exclusión de marcas sí tiene origen en CLAUDE.md y puede citarse.
4. Líneas 222-224 (pesos de los 9 criterios): correctamente marcados como "propuesta mía", sin baremo oficial. Verificado que suman 40 (6+3+4+6+5+6+4+3+3) y que el total provisional es 18/40 y el máximo posible hoy 27/40. Mantiene el umbral de 32/40 (aprendizajes 5). Sin fallo. Nota: `proceso.md` puerta 0 pide >= 24/40; no se contradice.
5. Línea 205 (SEGUIR): acierta al decir que cumplir (a) no basta y que (b)-(f) siguen pendientes; marca propia pasa a "SOLO SI", no a GO. Coherente con decision-ceo.
6. Línea 214 (regla auxiliar 5): usa "la mediana de las fichas ancla" como P, mientras que el resumen (líneas 174-183) calcula la mediana de todos los precios. Aclarar que P se calcula solo sobre las fichas ancla.

## 5. Marcas ajenas y categorías excluidas (control 4)

Sin hallazgos. Ninguna marca de juego, coche o moda aparece como idea de producto. La hoja ordena marcar como "de marca" y no usar las fichas de marca como ancla. Menciona "nada de neón rosa-ciudad ni palmeras ni nombres de juego" solo para excluir la estética de GTA. Las sugerencias de búsquedas libres no entran en salud, suplementos, cosmética, electrónica con batería, juguetes ni alimentación, y la hoja repite la lista de excluidos. La cita de "ropa y belleza" de FastMoss es un dato de mercado, no una propuesta. Herramientas citadas (FastMoss, BigBuy, CJ, Printify): proveedores y herramientas, no marcas de producto. Etiqueta IA y 2 días: la hoja y el informe de cumplimiento mantienen "Contenido generado por IA" y 2 días; no cambian CLAUDE.md. Sin reseñas falsas ni clientes IA.

Condición 4 (secretos): búsqueda de correos, IBAN y NIF en `ronda-14/`: ninguno. La plantilla de correo usa corchetes ([NOMBRE], [TELÉFONO]).

## 6. Ejecutable por la persona sin ayuda (control 5)

Hoja de lectura: bien. Es la más clara de las tres (pasos numerados, qué copiar, qué no hacer, cómo devolverlo, cómo calcular la mediana). Problemas:
1. Línea 12 y línea 61: 83 minutos para 6 búsquedas x 6 fichas = 36 fichas, con 8 campos y copiar enlace en cada una, son unos 2 minutos por ficha. Es optimista para una primera vez. decision-ceo (línea 45) estima 2-3 h para la lectura completa (4 búsquedas y Seller Center). Corrección: dar "90-120 min solo la hoja; 4 obligatorias en 60 min" y decir que Seller Center se hace aparte.
2. Línea 210 (regla auxiliar 1) exige >= 4 tablas con >= 5 filas; la línea 61 dice que con las 4 obligatorias basta. Decirlo juntos: si hace solo las 4, las 4 deben estar completas.
3. Falta una línea que diga qué hacer si TikTok Shop ES no está disponible en la app de la persona (ya hay aviso de región; basta una línea sobre la web).

Cumplimiento: no ejecutable sin ayuda tal como está. Correcciones:
1. Añadir tiempo estimado por bloque y total. Hoy no hay ninguno. Con 8 bloques A y 6 bloques B (más de 50 preguntas) y 2 minutos cada una, A son unos 30-45 min si hay acceso al panel. Decir que B (gestoría) no se responde el 02/11: solo se envía el correo ese día; la respuesta llegará después y no es requisito de M0.
2. Condición 7: asume que la persona tiene acceso a un Seller Center ("qué porcentaje muestra el panel para tu categoría", línea 16). Pero el alta de vendedor es la pregunta A7 y la pregunta pendiente 4 de `estado.md`. Falta decir qué hacer si no tiene cuenta: leer el Centro de ayuda público y escribir "no accesible sin cuenta", sin iniciar el alta.
3. Condición 12: registrarse en Seller Center, hablar con una gestoría (puede costar) y mandar el correo obligan a la persona. Falta un aviso explícito del tipo "esto te obliga a: ..., y no es necesario pagar ni darse de alta para responder".
4. Condición 4: se piden capturas del panel de vendedor, que pueden mostrar NIF, IBAN, correo o dirección. Añadir "tapa datos personales antes de guardarlas en el repo".
5. Falta una pregunta a la gestoría o al revisor sobre la preventa: cobro anticipado, plazos prometidos y desistimiento. decision-ceo (línea 47) y finanzas (§6) la tratan como pendiente, y en cumplimiento solo aparece A4 pregunta 4 (Seller Center), no la parte legal. Añadir B7.
6. En A1, la pregunta sobre la base de la comisión (PVP con o sin IVA).
7. Aparte de lo anterior, las preguntas con casilla y "texto literal" son claras; las opciones de A7 (modelo 036/037, RETA, IAE) son terminología del asesor, no verificada; marcarla "NO VERIFICADO" como el resto.

## 7. Resumen de condiciones citadas

- 4: capturas con datos personales (cumplimiento).
- 5: cambio de criterio de decision-ceo sin anotar en `decisiones.md` (hoja, AGUANTAR).
- 6: cifra 8,83 / 10,27 sin fuente ni reproducción (finanzas).
- 7: asume acceso a Seller Center (cumplimiento).
- 8: añadidos del agente no etiquetados como propuesta (hoja, finanzas §2.3); comisión sobre base sin IVA presentada sin etiqueta.
- 10: "terminado" incumplido en cumplimiento (falta tiempo estimado y manejo de errores de acceso).
- 12: avisos de lo que obliga a la persona incompletos (cumplimiento).
- 1, 2, 3, 9, 11, 13: sin hallazgos en esta puerta (los commits los comprueba el curador al cerrar la ronda).
