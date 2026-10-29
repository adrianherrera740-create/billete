# Puerta de calidad 2, ronda 14 (segunda pasada)

Autor: auditor-calidad. Fecha: 29/10/2026. Revisados: `tienda/trabajo/ronda-14/producto/hoja-lectura-canal.md`, `cumplimiento/preguntas-seller-center-y-gestoria.md`, `finanzas/supuestos-y-tope.md`, contra `calidad/ronda-14-puerta-1.md`, `ronda-12/decision-ceo.md` §4 y `CLAUDE.md`. Recálculos con `.claude/skills/proveedor-es/scripts/margen_es.py` ejecutado hoy.

## Veredicto

| Informe | Veredicto | Motivo |
|---|---|---|
| finanzas/supuestos-y-tope.md | APROBADO (2 menores pendientes) | Las dos cifras cambiadas se reproducen; la base de la comisión ya es SUPUESTO; no queda 8,83 / 10,27 |
| producto/hoja-lectura-canal.md | APROBADO (1 menor a corregir antes de aplicar la regla) | PARAR ya cubre 0, 1 y 2 fichas; AGUANTAR está marcado como cambio propuesto |
| cumplimiento/preguntas-seller-center-y-gestoria.md | APROBADO (menores) | Resueltos tiempo, falta de cuenta, avisos, capturas, B7, 1b y casilla 4/5/9 % |

Ningún pendiente es bloqueante para entregar las hojas a la persona el 02/11. Ninguno incumple las condiciones 4, 6, 7, 8 ni 10 en su forma actual.

## 1. Recálculo de las dos cifras de finanzas

Comando: `margen_es.py --pvp 34.90 --coste 12.50 --envio 4 --dias-preparacion 2 --dias-entrega 2 --comision-tiktok 0.09 --afiliado 0 --devoluciones X`.

| Devoluciones | Informe | Recalculado | Resultado |
|---|---|---|---|
| 0,15 | 4,23 € | 4,23 € (margen 14,7 %, HOLD, CPA de equilibrio 4,23, PVP mínimo 42,20) | OK |
| 0,10 | 5,87 € | 5,87 € (20,4 %, HOLD, PVP mínimo 37,90) | OK |

- 5,87 coincide con `ronda-13/proveedores/pod-textil-ue.md` línea 56 y 62 (dev. 0,10, envío 4, afiliado 0). Verificado.
- `grep` de "8,83" y "10,27" en `ronda-14/`: 0 resultados. Fallo 1 de la puerta 1 resuelto (líneas 38 y 159 del informe de finanzas).
- Nota nueva, menor: `decision-ceo.md` y `ronda-12/critica/pre-mortem.md` líneas 27 y 108 dan +4,53 € con los mismos parámetros. La diferencia de 0,30 € es el embalaje: el script con `--embalaje 0` da 4,53, y con el valor por defecto (0,30) da 4,23. El informe de finanzas usa el valor por defecto de la tabla 1, que es correcto. Conviene una frase que lo explique para que nadie compare 4,53 con 4,23 como si fueran distintos supuestos. No bloquea.
- Las demás cifras de la puerta 1 (8,04 / 5,04 / 3,54 y la sensibilidad 2x2x2) no han cambiado en el texto y siguen siendo las que reproduje.

## 2. Punto por punto de las correcciones pedidas en la puerta 1

### Finanzas
| Corrección pedida | Estado |
|---|---|
| 1. Quitar o recalcular 8,83 / 10,27 | HECHO (4,23 / 5,87 con comando y fecha, líneas 38 y 159) |
| 2. Base de la comisión como SUPUESTO y pregunta en A1 | HECHO (fila nueva en tabla 1, línea 14, etiquetada SUPUESTO; pregunta 1b en cumplimiento) |
| 3. Marcar como propuesta el aviso a 24 € (80 %) | PENDIENTE. Línea 82 de `finanzas/supuestos-y-tope.md`: "Aviso al director; cada euro nuevo con visto bueno" sigue sin etiqueta. `decision-ceo.md` §4 no lo contiene. La cabecera de §2.3 dice "más las financieras", lo que lo declara a medias. Corrección: escribir "(PROPUESTA del cfo, no del CEO)" en esa fila. Menor |
| 4. Unificar el derecho de 3 € | PENDIENTE. Finanzas líneas 24 y 112: "por envío y línea arancelaria". Cumplimiento B3 pregunta 2: "por artículo/paquete"; pregunta 3: "paquete o categoría de artículo"; correo (punto 3): "por paquete de bajo valor". Las tres son NO VERIFICADO, así que no se presenta como hecho, pero hay tres redacciones. Corrección: una sola frase en los tres sitios, p. ej. "derecho fijo de 3 € (unidad de cobro: NO VERIFICADO)". Menor |

### Hoja de lectura
| Corrección pedida | Estado |
|---|---|
| 1. 1-2 fichas ancla es PARAR, no AGUANTAR | HECHO (línea 206: "0, 1 o 2 fichas ancla", cita el criterio de parada de decision-ceo §4) |
| 2. "Único ajuste" de 45 min marcado como propuesta con aprobación | HECHO (línea 207: "CAMBIO PROPUESTO, requiere aprobación de la persona y anotación en `decisiones.md`; mientras no haya aprobación, estos casos son PARAR") |
| 3. Origen de cada criterio; añadidos como propuesta | HECHO en lo esencial: >= 2 vendedores, misma búsqueda y corte de 15 € llevan "PROPUESTA del investigador" (líneas 205, 206, 190, 192); la exclusión de marcas cita CLAUDE.md; la línea 199 ya no dice "no se modifica" a secas y remite a `decisiones.md` |
| 4. Pesos 6-3-4-6-5-6-4-3-3 | Sin cambios, siguen sumando 40 |
| 5. SEGUIR no es GO | Sin cambios, correcto |
| 6. P solo sobre fichas ancla | CASI. Línea 214 ya dice "la mediana de las fichas ancla", pero la tabla de resumen (líneas 174-182) solo calcula la mediana de todos los precios. Falta una casilla o una frase "calcula P con los precios de las fichas ancla". Menor |
| Tiempo 90-120 min / 60 min las 4 obligatorias, Seller Center aparte | HECHO (líneas 12 y 61, coherentes entre sí) |
| Regla auxiliar 1 y "4 obligatorias bastan" | Coherente: con 4 tablas completas se cumple "al menos 4 de 6", pero no lo dice. Menor |
| Qué hacer si no hay TikTok Shop ES | HECHO a medias (líneas 18 y 23: cambiar región o usar la web; si no se puede, parar y anotar). Aceptable |

Comprobación de §4 de `decision-ceo.md`: la hoja ya no contradice la regla de parada (menos de 3 fichas a >= 25 € y >= 500 ventas, o Seller Center sin stock propio, cierra marca propia como canal consumidor). SEGUIR con >= 3 fichas y (a) en verde deja (b)-(f) pendientes, igual que decision-ceo. Lo que es cambio propuesto está marcado como tal: AGUANTAR completo, el filtro de 2 vendedores, el de la misma búsqueda y el corte de 15 €.

Fallo menor nuevo (línea 206 frente a línea 281 y regla auxiliar 1): el caso "la persona no pudo ver precios ni ventas en la mayoría de fichas" es PARAR en la línea 206, pero "la lectura no cuenta, se repite o se pausa" en la línea 281 y en la regla 1. Además esa condición de PARAR no lleva etiqueta de propuesta. Corrección: dejarla como "lectura no válida: repetir o pausar (M0)", fuera de PARAR, y marcarla propuesta. No bloquea la entrega de la hoja; hay que arreglarlo antes de aplicar la regla a datos reales.

### Cumplimiento
| Corrección pedida | Estado |
|---|---|
| Tiempo estimado por bloque y total; B no se responde el 02/11 | HECHO (líneas 11-13), marcado "propuesta del agente, sin medir". Ver menor 3 |
| Qué hacer sin cuenta de Seller Center (condición 7) | HECHO (líneas 15-19: no iniciar alta, leer ayuda pública, "no accesible sin cuenta", pendiente de cuenta) |
| Qué te obliga (condición 12) | HECHO (líneas 21-26, incluye "no es necesario pagar ni darse de alta") |
| Capturas con datos personales (condición 4) | HECHO (línea 28). `grep` de correos e IBAN en `ronda-14/`: nada |
| B7 preventa | HECHO (líneas 159-165, con punto 7 en el correo) |
| Base de la comisión en A1 | HECHO (pregunta 1b, línea 38; 1,85 y 2,24 € reproducidos: 9 % de 20,58 y de 24,90) |
| Casilla 4 % / 5 % / 9 % en A1 | HECHO (línea 37, con la nota de que el 5 % no tiene fuente). La pendiente de la puerta 1 queda cerrada |
| A7 terminología marcada NO VERIFICADO | HECHO (línea 93) |

Menor 3 (cumplimiento): la parte A tiene 31 preguntas (A1 5, A2 4, A3 5, A4 4, A5 4, A6 1, A7 5, A8 3). Con la propia base de "2 minutos por pregunta" salen unos 62 minutos, no 30-45. El error de partida fue mío en la puerta 1, que sugirió 30-45 min sin contarlas. Corrección: "45-60 min" o "30-45 solo las P1". Menor.

## 3. Cifras sin fuente

Ninguna cifra colada. Las nuevas (4,23, 5,87, 14,7 %, 20,4 %) llevan comando, parámetros y fecha. Las estimaciones de tiempo (90-120 min, 60 min, 30-45 min, 10-15 min) van etiquetadas como orientativas o propuesta del agente. 24 € y 80 % son aritmética de 30 € (ver pendiente 3). La conexión con `ronda-13` (5,87) está comprobada.

## 4. Pendientes, ordenados

| Nº | Informe y línea | Pendiente | Bloqueante |
|---|---|---|---|
| 1 | hoja, línea 206 frente a 281 y regla 1 | Contradicción sobre "no visible en la mayoría" y falta etiqueta propuesta | No para entregar; sí antes de aplicar la regla |
| 2 | finanzas, línea 82 | Marcar aviso a 24 € como propuesta | No (condición 8, texto) |
| 3 | finanzas 24 y 112, cumplimiento B3 y correo | Unificar redacción del derecho de 3 € | No (todo NO VERIFICADO) |
| 4 | cumplimiento, línea 12 | Tiempo de la parte A: 45-60 min | No |
| 5 | hoja, líneas 174-182 y 214 | Casilla para P sobre fichas ancla | No |
| 6 | finanzas, línea 38 | Una frase que explique 4,53 (embalaje 0) frente a 4,23 | No |

Condiciones citadas: 4, 6, 7, 8 y 10 comprobadas sin incumplimiento; 5 cubierta por la anotación exigida en `decisiones.md` antes de aplicar AGUANTAR (esa anotación todavía no existe y no hace falta hasta que se apruebe el cambio). Commits (1, 3): los comprueba el curador al cerrar la ronda.
