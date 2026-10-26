# Control de calidad, puerta 1 de la fase 1: set de cepillos de limpieza (AliExpress ES 1005013107637317)

Fecha: 2026-10-26. Revisor: auditor de calidad. Revisadas las 3 entregas de jefe, `margen_es.py`, `CLAUDE.md`, `creativos/set-cepillos-ia.md` y los informes de especialistas de producto (4) y márgenes (3); de cumplimiento he contrastado las citas de línea contra `set-cepillos-ia.md` y leído la parte de logística y normativa (CE, sectores), no los tres informes enteros.

## Resultado por departamento

| Departamento | Decisión | Motivo corto |
|---|---|---|
| Producto (`producto/entrega-jefe.md`) | APROBADO con 2 correcciones menores | HOLD bien fundado, todo dato con fuente y fecha o marcado "no verificado". Dos afirmaciones erróneas o sin resolver (F-P1, F-P2). |
| Márgenes (`margenes/entrega-jefe.md`) | APROBADO con 2 correcciones menores | Cifras recalculadas y exactas. Fallo de diagnóstico del bug del script y un coste de 7,00 € sin fuente (F-M1, F-M2). |
| Cumplimiento (`cumplimiento/entrega-jefe.md`) | RECHAZADO (devolver para corregir texto, no repetir el trabajo) | Afirma "ficha leída" y "sin causa de exclusión" sin base, y se contradice dos veces (F-C1, F-C2, F-C3). |

## 1. Recálculo a mano de cifras clave

Ejecutado `margen_es.py` con `--envio 0 --dias-preparacion 2 --dias-entrega 5` (marcadores) y valores por defecto (embalaje 0,30, otros 1 %, devoluciones 5 %, objetivo 3 €), coste con IVA tal cual, `--afiliado` como fracción.

| Cifra | Entrega | Mi resultado | Estado |
|---|---|---|---|
| Set 24,90 €, coste 9,29, 4 %, afiliado 0 | 8,93 € / 43,4 % (producto L23, márgenes L24, CLAUDE.md) | 8,93 € / 43,4 %, CPA obj. 5,93, PVP mín. 17,90 | OK |
| Set 24,90 €, 9 %, afiliado 0,15 | 4,97 € / 24,1 % / HOLD (márgenes L26) | 4,97 € / 24,1 % / HOLD, PVP mín. 25,40 | OK |
| Pack 39,90 €, coste 18,58, 4 %, afiliado 0 | 10,80 € / 32,7 % (producto L24, márgenes L31) | 10,80 € / 32,7 % | OK |
| Pack 39,90 €, 9 %, afiliado 0,15 | 4,45 € / 13,5 % / HOLD (márgenes L34) | 4,45 € / 13,5 % / HOLD | OK |
| Set 25,90 €, 9 %, afiliado 0 | 8,60 € (márgenes L28) | 8,60 € / 40,2 % | OK |
| Pvp 15 €, coste 7,50, 4 %, afiliado 0 | 3,36 € / CPA obj. 0,36 (márgenes L69) | 3,36 € / 27,1 % / CPA 0,36 | OK |
| Pvp 15 €, coste 9,29, 4 % | 1,57 € / 12,6 % (márgenes L62) | 1,57 € / 12,6 %, CPA obj. -1,43 | OK |
| Alternativa C, 24,90 €, coste 7,49, 4 % | 10,73 € / 52,1 % (producto L21) | 10,73 € / 52,1 %, PVP mín. 14,60 | OK |
| IVA deducible del coste | +~1,6 €/set | 9,29/1,21 = 7,68; diferencia 1,61 | OK |

Prueba manual del 8,93: base 24,90/1,21 = 20,58; ingresos con 5 % de devoluciones = 19,55; costes 9,29 + 0,30 + 0,82 (4 %) + 0,21 = 10,62; 19,55 - 10,62 = 8,93. Cuadra.

Efecto de lectura: los "GO" que imprime el script son solo aritméticos (2 días de preparación son un marcador, no un dato). Ambos jefes lo avisan. Correcto.

## 2. Fallos (con ruta y línea)

### Producto
- **F-P1** `tienda/trabajo/producto/entrega-jefe.md` L31: dice que "el script supone devoluciones = 0". Falso: el valor por defecto es 0,05 (`margen_es.py`, `--devoluciones`) y los 8,93 € ya lo incluyen (ingresos x 0,95). Lo que no hay es coste de retorno logístico (envío 0, por tanto `devoluciones_logistica` = 0) ni recuperación del producto. Corregir la frase: "incluye 5 % de devoluciones sobre ingresos; no incluye coste de retorno ni muestras".
- **F-P2** L12/L57 (PVP) frente a `margenes/entrega-jefe.md` L11 y L41: producto pide decidir 25-27 € o aceptar la excepción; márgenes dice no subir de 24,90 € porque la evidencia de mercado apunta a precios menores. Ninguno de los dos jefes lo contrasta con el otro. No es un error, pero debe aparecer como una sola decisión del usuario (ver sección 4).
- Menor: L35 propone C o A como mejores, pero reconoce que no es el mismo producto; correcto, no hace falta cambiar.

Comprobado sin fallo: todas las URL de proveedor (6 fichas) tienen fuente (listado AliExpress ES, filtro `shipFromCountry=ES`, `aliexpress_es.js`, 26/10/2026) y marcan plazos como no verificados. Las 8 filas del investigador de tendencias llevan URL y fecha; las cifras de Exploding Topics y FastMoss están marcadas como globales o de otro ámbito. El verificador lista 13 afirmaciones prohibidas, coherentes con CLAUDE.md.

### Márgenes
- **F-M1** `margenes/entrega-jefe.md` L93: atribuye el fallo de `margen_es.py --help` al texto de `--comision-tiktok`. Ese texto ya está escapado ("9%%"). El fallo (ValueError) viene de `--tienda-nueva`, línea 88 del script: `help="comisión TikTok del 4% (60 días..."`; el "4% (" sin duplicar el signo rompe el formateo. Corregir el diagnóstico (el simulador, L57 de `simulador-packs.md`, repite la atribución errónea). No se arregla aquí: es del director.
- **F-M2** L73: la fila "coste 7,00 € / PVP 15 €" no sale de ninguna ficha (D = 7,09 €, C = 7,49 €). Marcarla como "hipótesis, no coste real" o sustituir por 7,09.
- Menor: L44 usa 7,50 € como coste de las alternativas (redondeo de 7,49 y 7,69); lo declara. Aceptable.

Comprobado sin fallo: las contradicciones internas (PVP 25,90, pack como opción principal, cifra de 10,5 € del buscador, error de unidad del afiliado) están resueltas con cálculo y sin elegir en silencio. El auditor de precios marca todo como no verificado, con 6 llamadas fallidas descritas y fuentes con fecha para las referencias indirectas.

### Cumplimiento
- **F-C1** `cumplimiento/entrega-jefe.md` L3 y L8: afirma "Ficha del proveedor leída el 25/10/2026" y concluye "No hay causa de exclusión (sin batería, sin electrónica...)". Contradice a `producto/verificador-fichas.md` L5 y `producto/buscador-proveedores.md` L5 (la ficha no se pudo leer, ni título ni fotos ni contenido). El único soporte es `creativos/set-cepillos-ia.md` L3, que respalda precio, ventas y valoración (listado), no el contenido del producto. Sin la ficha no se puede descartar batería, imán, marca ajena ni producto de cocina. Corregir: "exclusión de sectores: sin indicios en el título del listado; contenido no verificado".
- **F-C2** L15 "Hoy no hay ningún OK" frente a L24 B6 "OK condicional". Unificar (B6 pasa a ABIERTO).
- **F-C3** L10 "bloqueos B1 a B8" frente a la tabla con B1 a B12. Aclarar cuáles son bloqueantes (B1, B2, B4, B5, B7, B8 según la columna Estado) y cuáles abiertos.
- **F-C4** (fuente) `revisor-normativa-ue.md` L55 cita para el desistimiento de 14 días una copia en legislation.gov.uk (archivo del Reino Unido) y L56 PwC; el jefe lo marca como "fuentes secundarias, sin cotejar con BOE". Aceptado como cautela, pero la cita primaria de la UE (EUR-Lex) falta. Pendiente, no bloquea.

Comprobado sin fallo:
- Las 13 correcciones C-1 a C-13 se corresponden con los 13 hallazgos SC y las citas de línea (L3, L25, L34, L35, L40, L41, L43, L48, L51, L54-55, L58) coinciden con `creativos/set-cepillos-ia.md`.
- Etiqueta IA: CLAUDE.md la exige; `set-cepillos-ia.md` L25 solo remite al rodillo y su prompt L48 pide "realistic smartphone photo": correctamente marcado como incumplimiento (C-12).
- Sin reseñas falsas ni personas IA: el creativo actual no las incluye, pero el antes/después (L53-55) y "carrito naranja" (L35) sí incumplen "mostrar solo lo que el producto hace"; correctamente listados.
- Regla de 2 días: tratada como BLOQUEO, con cuestionario al vendedor.
- Discrepancia D1 (antes/después IA) resuelta con la lectura más estricta, coherente con CLAUDE.md.

## 3. Contradicciones entre departamentos sin resolver

1. **¿Se leyó la ficha?** Cumplimiento (y `set-cepillos-ia.md` L3, "leído el 25/10/2026") dice que sí; producto dice que nadie pudo leerla. Resolución del revisor: solo hay lectura de listado (precio, ventas, valoración), no de ficha. Hay que corregir cumplimiento (F-C1).
2. **PVP**: producto (25-27 € o excepción) frente a márgenes (techo 24,90 €). Decisión del usuario.
3. **Proveedor**: cumplimiento y creativos trabajan sobre el candidato 1005013107637317; producto y márgenes sugieren que C o A podrían ser mejores (-1,6 a -1,8 €/ud), sin comparabilidad probada. Si se cambia de proveedor, B1-B12 y toda la entrega de cumplimiento se repiten.
4. **Pack de 2 a 39,90 €**: `set-cepillos-ia.md` L11 y simulador lo ven como opción principal; márgenes y tendencias lo desaconsejan hasta verificar consolidación de envío (pregunta 5 del cuestionario) y precio de mercado. Márgenes lo resuelve; creativos aún no.
5. **Escena de cocina** (`set-cepillos-ia.md` L48 "kitchen faucet base") frente a normativa (no sugerir uso alimentario): ya listada como C-12/D4.

No encuentro contradicción de cifras entre los tres jefes.

## 4. Reglas de CLAUDE.md

| Regla | Estado |
|---|---|
| Nunca inventar precios, proveedores ni plazos | Cumple: plazos, origen real, precio de mercado y TikTok Shop ES, todos "no verificado". Único punto dudoso: F-M2 (7,00 €). |
| Etiqueta "Contenido generado por IA" | Pendiente en creativos (C-9, C-12); sin vídeo publicado. |
| Sin reseñas falsas, sin personas IA como clientes | Sin infracción en lo revisado; prohibido usar "5.000 vendidos · 4,9★" como prueba social (C-13). |
| Música de la biblioteca comercial | Pendiente (C-10, C-18). |
| Sectores excluidos | Sin indicios, pero no verificable sin ficha (F-C1). CE: cepillo manual, no exigible en principio (conclusión del revisor, no contrastada con texto oficial). Marca ajena: sin verificar (TMview no hecho). |
| Entrega a transportista en 2 días laborables | No verificada, bloqueo (B1/B2). Con 3 días de preparación el script da NO-GO. |
| Comisión 9 % / 4 % | Se calculan ambas; Seller Center sin comprobar. |

## 5. Puede empezar la fase 2 (creativos y creadores) con este producto?

**No, como GO.** Ninguno de los tres jefes concede GO y los bloqueos son comunes:
- No hay fotos reales ni muestra; el usuario no quiere comprar muestra (B5). Sin eso, creativos solo puede generar vídeo inventando forma, color y número de piezas, que incumple CLAUDE.md. Y creadores no puede enviar muestras ni redactar un brief veraz sin saber qué contiene el set.
- Sin demanda en TikTok Shop ES, sin precio de mercado y con un PVP de 24,90 € frente a referencias de 3-11 €.
- Sin plazos: una regla de CLAUDE.md que no se cumple por defecto.

Lo único que puede hacerse sin riesgo en fase 2 (0 publicaciones): crear la ficha y el outreach del set como plantilla (C-16 a C-22) y aplicar las correcciones C-1 a C-15 al texto de `set-cepillos-ia.md`, con el director autorizando, sin generar vídeos.

### Decisiones y acciones del usuario antes de abrir la fase 2

1. **Demanda y precio (5 min, gratis)**: en la app TikTok o Amazon.es, anotar 5 precios con enlace, fecha y ventas de sets de 2-5 piezas. Si la mayoría está por debajo de 15 €, NO-GO del producto con el PVP actual.
2. **Ficha** (navegador propio): del candidato, C y A: origen "Envío desde España", días de preparación y entrega, nº de piezas, material, marca y fabricante. Enviar el cuestionario de cumplimiento al vendedor.
3. **Imágenes**: permitir `ae-pic-a1.aliexpress-media.com` y `ae01.alicdn.com`, o aportar capturas de reseñas con foto, o aceptar una muestra. Sin ninguna, la fase 2 no puede producir.
4. **PVP**: 24,90 €, 25,90 € o menor tras el punto 1.
5. **Proveedor**: candidato, C o A, solo tras el punto 2.
6. **Alternativa a valorar**: si no se resuelve 1-3 en pocos días, pasar la fase 2 al rodillo quitapelos (producto principal de CLAUDE.md). No he auditado ese producto en esta puerta.
7. Alta fiscal (B8): el usuario confirma su estado.

Una vez corregidos F-C1 a F-C3 y F-P1, F-M1, F-M2, la puerta 1 queda aprobada como HOLD documentado.
