# Control de calidad, puerta 1 de la ronda 5: funda de volante deportiva de polipiel

Fecha: 2026-10-26. Revisor: auditor de calidad. Revisadas las 3 entregas de jefe (`tienda/trabajo/ronda-5/{producto,margenes,cumplimiento}/entrega-jefe.md`), contrastadas con los 9 informes de especialistas de `tienda/trabajo/ronda-5/*/`, con `CLAUDE.md` y con `ronda-3/producto/buscador-proveedores.md` y `ronda-3/producto/verificador-fichas.md` (origen de la etiqueta "forma D"). No he abierto fichas de AliExpress ni webs: solo verifico lo que consta en los archivos y recalculo con el script.

## Resultado por departamento

| Departamento | Decisión | Motivo corto |
|---|---|---|
| Producto | APROBADO con 4 correcciones menores | HOLD bien fundado, contradicciones A-H declaradas y casi todas bien resueltas. Cuatro afirmaciones erróneas o sin respaldo (F-P1 a F-P4). |
| Márgenes | RECHAZADO (corregir la recomendación, no repetir los cálculos) | Los números son exactos, pero el esquema recomendado (24,90 € con el proveedor de 9,99 €) descansa en una ficha que producto, buscador y la ronda 3 dicen que solo vale para volante en forma D. La entrega no lo menciona (F-M1). |
| Cumplimiento | APROBADO con 3 correcciones menores | HOLD honesto, checklist sin ningún "OK" falso, reglas de CLAUDE.md respetadas. Fallos menores (F-C1 a F-C3). |

## Fase 2 (campaña): NO puede empezar

Motivos, en orden de gravedad:
1. No hay proveedor válido para volante redondo con el coste que exige el precio. El único coste que da 25 % de margen a un PVP dentro del techo de mercado (24,90 €) es 9,99 €, y esa ficha es forma D. Para volante redondo, el coste verificado más bajo en listado de PU es BC Corona 10,85 € (2 ventas): a 24,90 €, 9 %, devoluciones 15 %, da 4,28 € / 20,8 % y necesita PVP 27,0 € para el 25 % (mi cálculo). Kepler 11,74 € necesita 29,20 € y Ariel 13,87 € necesita 34,30 € (tabla de márgenes L21-L25, reproducida por mí).
2. Regla de CLAUDE.md "plazos sin verificar = sin GO": ninguna ficha leída, plazo de preparación, stock, talla y tipo de montaje sin verificar.
3. Ninguna prueba de demanda en TikTok Shop ES ni Google Trends; en AliExpress ES la polipiel vende 1-11 unidades por ficha.
4. Sin fotos reales ni muestra no se puede producir ningún vídeo "del producto" (contenido-ia §3).

Lo que SÍ puede hacerse ya (es verificación, no campaña): abrir fichas a mano, enviar el cuestionario de 20 preguntas a KRAWEHL y BC Corona, Google Trends, mirada manual a TikTok Shop ES y Seller Center.

Condiciones mínimas para abrir la fase 2:
- Producto: funda redonda de polipiel/PU, talla(s) en cm confirmadas por escrito, nunca forma D. Sin claims "universal", "cuero", "fibra de carbono", "instalación en minutos" (salvo variante elástica demostrada).
- Proveedor: una ficha de volante redondo con coste unitario confirmado (con o sin IVA indicado) y respuestas escritas sobre preparación <= 1 día laborable, hora de corte, transportista con seguimiento, stock por talla, GPSR (fabricante y responsable UE) e informe de ensayo.
- Precio: PVP único de lanzamiento <= 24,90 € solo si el coste confirmado es <= 9,99 € (25,0 % justo con devoluciones del 15 %, sin margen de error). Con coste 10,85 € el suelo es 27,0 € y con 11,74 € es 29,20 €: por encima del techo 22-25 € del auditor, así que sin coste <= ~10 € no hay esquema y el veredicto pasa a NO-GO. Sin afiliados, sin packs, sin precio tachado inventado.
- Cualquier cifra de margen ha de usar devoluciones 10 % y 15 % (nunca 5 %) y comisión 9 % como caso base; el 4 % solo como optimista.

Qué dato falta para llamarlo ganador (suma de lo que los jefes ya piden, ordenado):
1. Ficha abierta con coste y plazo reales de un proveedor de volante redondo (lo que decide el margen).
2. Prueba de demanda en España: Google Trends (varios términos, 12 meses mínimo) y ventas visibles de fundas en TikTok Shop ES con su PVP real. Hoy no hay ni una cifra.
3. PVP aceptado por el mercado: una venta o un test real a 24,90 €. El auditor lo ve en 22-25 € por extractos de búsqueda, no por fichas leídas.
4. Tasa real de devoluciones y tipo de montaje (coser o elástica): decide demo, claims y devoluciones.
5. Comisión efectiva en Seller Center (9 % o 4 %) y quién retiene la comisión en reembolsos.
6. Fotos o clip reales del producto.
Aun con todo esto, producto estima 30-32/40 como máximo frente al umbral de 32: "correcto", no ganador.

## 1. Recálculo a mano con `margen_es.py`

Parámetros: `--envio 0 --embalaje 0.30 --otros 0.01 --afiliado 0 --dias-preparacion 2`, `--comision-tiktok` indicado, coste tal cual (el script supone coste sin IVA; las entregas usan el precio de listado sin descontar IVA, y lo declaran como no verificado). Prueba manual de la primera cifra: base 24,90/1,21 = 20,58; ingresos con 10 % de devoluciones = 18,52; costes 9,99 + 0,30 + 1,85 (9 %) + 0,21 = 12,35; 18,52 - 12,35 = 6,17.

| Cifra | Entrega | Mi resultado | Estado |
|---|---|---|---|
| Coste 9,99, PVP 24,90, 9 %, dev 10 % | 6,17 € (márgenes L51) | 6,17 € / 30,0 % / PVP mín. 22,70 | OK |
| Coste 9,99, PVP 24,90, 9 %, dev 15 % | 5,14 € / 25,0 % (márgenes L39) | 5,14 € / 25,0 % (script: HOLD con aviso "margen por debajo del 25 %": real 24,98 %) | OK, ver F-M3 |
| Coste 9,99, PVP 24,90, 4 %, dev 10 % | 7,20 € / 35,0 % (márgenes L47) | 7,20 € / 35,0 % | OK |
| Coste 13,87, PVP 29,90, 9 %, dev 10 % | 5,60 € / 22,7 % (producto L36) | 5,60 € / 22,7 % / PVP mín. 31,20 | OK |
| Coste 13,87, PVP 29,90, 4 %, dev 10 % | 6,83 € / 27,7 % (márgenes L49) | 6,83 € / 27,7 % | OK |
| Coste 13,87, PVP 29,90, 4 %, dev 5 % | 8,07 € / 32,7 % (producto L36) | 8,07 € / 32,7 % | OK |
| Coste 13,87, PVP 29,90, 9 %, dev 5 %, afiliado 15 % | 3,31 € / 13,4 % (producto L36) | 3,31 € / 13,4 % | OK (la entrega no dice que es con dev 5 %) |
| Coste 9,99, PVP 29,90, 9 %, dev 5 % | 43,4 % (producto L26) | 10,71 € / 43,4 % | OK |
| Coste 9,99, PVP 24,90, 9 %, dev 5 % | 35,0 % (producto L26) | 7,20 € / 35,0 % | OK |
| Coste 13,87, PVP 24,90, 9 %, dev 15 % | 1,26 € / 6,1 % (márgenes L41) | 1,26 € / 6,1 % / PVP mín. 34,30 | OK |
| Coste 9,99, PVP 24,90, 9 %, dev 10 %, afiliado 15 % | 3,39 € (márgenes L53) | 3,39 € / 16,5 % | OK |
| Coste 9,99, PVP 29,90, 9 %, dev 10 %, afiliado 15 % | 6,14 € / 24,9 % (márgenes L53) | 6,14 € / 24,9 % | OK |
| Pack 16,38 a 39,90, 9 %, dev 15 % | 8,05 € / 24,4 % (márgenes L85) | 8,05 € / 24,4 % | OK |
| Pack 16,38 a 34,90, 9 %, dev 15 % | 4,95 € / 17,2 % (márgenes L84) | 4,95 € / 17,2 % | OK |
| Mensual: 500 € anuncios, 9,99 a 24,90, 9 %/dev 15 %, CPA 5 y 8 | +14 / -179 € (márgenes L66) | 500/5 x 5,14 - 500 = +14,0; 500/8 x 5,14 - 500 = -178,75 | OK |
| Mensual: 4 %/dev 10 %, CPA 5 y 8 | +220 / -50 € (márgenes L65) | 100 x 7,20 - 500 = +220; 62,5 x 7,20 - 500 = -50 | OK |
| Logística: 8,07 € a PVP 29,90 "con comisión 9 %" (citado en cumplimiento L99) | 8,07 € | Con 9 % el script da 6,83 €; 8,07 € es el resultado a 4 %. Logística lo obtuvo por otro método (comisión sobre PVP con IVA, sin embalaje, sin devoluciones, sin "otros") | FALLO, ver F-C2 |
| Coste 10,85 (BC Corona), PVP 24,90, 9 %, dev 15 % | no calculado en ninguna entrega | 4,28 € / 20,8 % / PVP mín. 27,00 | Hueco, ver F-M1 |

Conclusión del recálculo: las cifras de márgenes y de producto son exactas. Lo que falla es qué coste se les aplica, no la aritmética. La interpretación de márgenes del script (L10: el script sí modela producto perdido en devoluciones, porque ingresos x (1 - tasa) y coste al 100 %) es correcta; el calculador de especialistas se equivocó en ese punto y márgenes lo corrigió bien.

## 2. Fuente y fecha de precios, URL e ID

- Todos los IDs de AliExpress de la tabla de producto (L54-L63) coinciden con `buscador-proveedores.md` y llevan fecha 26/10/2026 y origen "listado es.aliexpress.com con shipFromCountry=ES, ficha no abierta". Correcto. Ninguna entrega presenta un precio de proveedor como verificado en ficha.
- Precios de mercado (auditor): extractos de WebSearch, con la limitación declarada (WebFetch falló por DNS). Márgenes y producto lo repiten. Correcto. Autodoc con fichas de 321 días: declarado.
- Referencia de organizador (9,29 €) y de cuerda (15,79 €, 1005009522551027): vienen de ronda 4 y ronda 2, con ID y dato presentes en esos informes (`ronda-4/producto/buscador-proveedores.md` L28, `ronda-2/producto/buscador-proveedores.md` L29). La entrega de producto los incluye en una tabla sin fecha propia; son datos de rondas anteriores, no de hoy. Ver F-P4.
- Márgenes: costes de CLAUDE.md y especialistas, "ninguna ficha reabierta" (L5, L118). Correcto. IVA del coste declarado como no verificado.
- Supuestos (devoluciones 10/15/20 %, CPA 5/8/12 €): etiquetados como supuestos. Correcto.
- Cumplimiento: 0 puntos en OK; PFAS (Reg. UE 2024/2462, 10/10/2026), GPSR (13/12/2024) y 14 días/3 años salen de fuentes secundarias declaradas; no consultó Seller Center, BOE ni EUR-Lex. Correcto como "no verificado". No he podido confirmar las fechas legales; quedan como secundarias.

## 3. Contradicciones entre jefes

| Tema | Estado | Veredicto del control |
|---|---|---|
| Proveedor de 9,99 € (márgenes) frente a "solo forma D" (producto) | NO RESUELTA | El jefe de márgenes recomienda 1005008315429915 como único esquema (L97) y no menciona la forma D. Producto lo marca "solo forma D, no sustituta" (L26, L42, L63), el buscador (`buscador-proveedores.md` L18 y L39) también, y la ronda 3 ya lo había dicho (`ronda-3/producto/buscador-proveedores.md` L27, `ronda-3/producto/verificador-fichas.md` L9). Cumplimiento lo trata como candidato 2 en el checklist y en el cuestionario (L3, L24, L40) sin la salvedad. Prevalece producto, que cita la ficha. Ver F-M1. |
| 38,96 € (CLAUDE.md) frente a 25,48 € (auditor) | Bien detectada, mal formulada | El 38,96 € (Simoni Racing, Recambioscoche, ronda 3) no está contrastado hoy y debe pasar a "no verificado"; los tres jefes lo dicen. Pero el 25,48 € no es el "máximo": son productos distintos y la propia tabla del auditor trae Sparco 27,99 €, KEGEL 26,99 € y eBay.es 34-60 € + envío (L47-L59). El máximo nuevo leído es 27,99 €; el techo defendible del auditor es 22-25 € por juicio suyo. Márgenes lo expresa bien (L18); producto no (F-P1). CLAUDE.md sigue con el 38,96 € sin corregir (ningún jefe puede editarlo; lo debe hacer el director). |
| "Se coloca en minutos" (contenido-ia L58) frente a 1-2 h de costura (verificador) | Resuelta en prudente | Producto (C) y cumplimiento (C4) coinciden: no usar la frase hasta ver el tipo de montaje. Correcto. Queda sin resolver el dato de fondo: nadie sabe si KRAWEHL es de coser o elástica. |
| PVP 29,90-34,90 (CLAUDE.md, simulador, logística) frente a 22-25 € (auditor) | Resuelta por márgenes (L29) | Depende del coste: solo 9,99 € solapa con el techo. Pero la resolución usa un coste de forma D. Para volante redondo no hay solape. |
| Margen 8,07 € (investigador, cumplimiento C5) | Resuelta por producto B | Producto lo identifica bien (4 % y 5 % de devoluciones). Cumplimiento C5 sigue "pendiente de recalcular" y lo atribuye a 9 %: obsoleto y mal etiquetado (F-C2). |
| Devoluciones 5 % (calculador, producto) frente a 10/15 % (márgenes, logística) | Parcialmente resuelta | Márgenes tiene razón (5 % es optimista, L11). Producto aún cita cifras a 5 % en L26 y L36 sin etiqueta. |
| Organizador mejor que funda (producto L96) | No sustentada por los otros departamentos | Producto recomienda avanzar con el organizador (28/40 frente a 25/40) con diferencia que él mismo califica de no fiable; márgenes y cumplimiento no han calculado ni revisado el organizador en esta ronda (L88: "No calculado"). Es una sugerencia, no una decisión; no cambia la puerta. |
| Envío "en 3 días" frente a 2 días al transportista | Bien resuelta (producto G, cumplimiento) | Es promesa al cliente, no plazo de preparación. |

## 4. Reglas de CLAUDE.md

- Nunca inventar precios, proveedores ni plazos: cumplida en las tres entregas (todo lo no leído va como "no verificado"). Excepciones menores: F-P2 (afirmación de devolución sin fuente).
- Etiqueta "Contenido generado por IA": cumplimiento la recoge (L27, §3 punto 1) y la aplica como regla propia aunque la norma de TikTok sea solo de prensa. Cumplida.
- Sin reseñas falsas ni personas IA haciéndose pasar por clientes: cumplimiento §3 puntos 3-4. Cumplida.
- Sectores excluidos: la funda de volante no cae en salud, suplementos, cosmética, electrónica con batería, juguetes ni alimentación; "marcas ajenas" vigilado (Hibron, Matrix, Tesla descartadas; GTA, Rockstar, marcas de coche excluidas). Cumplida. La cuerda de neón del cuadro comparativo sí tiene la advertencia de electrónica.
- 2 días laborables al transportista: tratado como no verificado en todas las entregas; márgenes y cumplimiento ponen NO GO hasta tener plazo por escrito. Cumplida. Lo que dice CLAUDE.md sobre la comisión del 4 % (60 días, 5 productos en 15 días) se repite correctamente.
- Música: solo biblioteca comercial. Cumplida (§3 punto 7).
- Hallazgo no cubierto por ninguna entrega: alta fiscal (cumplimiento C9 lo declara). Sigue siendo hueco.

## 5. Fallos y qué corregir

### Producto (`tienda/trabajo/ronda-5/producto/entrega-jefe.md`)
- F-P1 (L34 y L104): "el auditor ve 25,48 € como máximo". Falso: el máximo nuevo leído es 27,99 € (Sparco) y hay eBay.es a 34-60 €; el 25,48 € es solo el CARPOINT. Corregir: el 38,96 € queda "no verificado"; máximo nuevo leído 27,99 €; techo defendible del auditor 22-25 €.
- F-P2 (L38): "producto cosido no se devuelve". No hay fuente y contradice cumplimiento C3 (excluir el desistimiento por haber cosido no está respaldado). Quitar la frase o marcarla "supuesto, no verificado".
- F-P3 (L87): la fila "PVP defendible 29,90-34,90 €" contradice la conclusión del propio jefe (L34) y la de márgenes (24,90 €). Corregir a "29,90-34,90 € propuesto por CLAUDE.md; defendible 22-25 € según auditor (extractos)".
- F-P4 (L26, L36, L86-L89): cifras con devoluciones 5 % sin etiquetar (L26 "devoluciones 5 %" sí lo dice; L36 mezcla 4 %/5 %/10 % y la de afiliado 13,4 % es con 5 %) y, en la comparación, datos de rondas 2 y 4 sin su fecha. Etiquetar cada cifra con comisión, devoluciones y fecha de origen y usar 10/15 % como base.
- Observación (no fallo): la recomendación de avanzar con el organizador (L96-L100) pasa por encima de que ni márgenes ni cumplimiento lo han revisado esta ronda. Mantener como hipótesis.

### Márgenes (`tienda/trabajo/ronda-5/margenes/entrega-jefe.md`)
- F-M1 (L97, L102, L107, L113): el esquema recomendado usa 1005008315429915 sin decir que es solo para volante forma D (37-38 cm). Con volante redondo no sirve. Rehacer §6 y §7: o bien (a) declarar que el esquema de 24,90 € solo existe si aparece una ficha de volante redondo con coste <= ~9,99 €, o (b) recalcular con el mejor coste redondo hoy visible (BC Corona 10,85 €: 4,28 € / 20,8 %, PVP mínimo 27,00 €; SEAMETAL 7,29 € es microfibra y, con 9 %/dev 15 %, da 7,84 € / 38,1 %, pero sin PU ni ventas). Incluir la salvedad de forma D en la sección 8 "No verificado". Cuestionario del GO (L113) debe dirigirse a un proveedor redondo.
- F-M2 (L99): "cumple el 25 % solo si las devoluciones son <= 15 % con comisión 9 %". A 15 % el margen real es 24,98 %: el script da HOLD con aviso. Reescribir como "queda en el 25,0 % sin margen de error".
- F-M3 (menor, L18, L128): el techo de mercado 22-25 € se presenta como cierre; es juicio del auditor sobre extractos de búsqueda. Declararlo ya consta en L121; añadir "juicio, no medido en TikTok Shop ES" junto a la conclusión de L29.

### Cumplimiento (`tienda/trabajo/ronda-5/cumplimiento/entrega-jefe.md`)
- F-C1 (L3, L24, L40): el candidato 2 (1005008315429915) se trata como una funda más (talla 37-38 cm "solo del título"). Añadir "forma D según buscador-proveedores L18/L39 y ronda 3" y retirar el ID del asunto del cuestionario hasta resolverlo (el vendedor podría responder por otro producto).
- F-C2 (L99, C5): atribuye 8,07 € / 11,79 € a "comisión 9 %" y lo deja "pendiente de recalcular". Ya recalculado por márgenes; con 9 % y devoluciones 5 % el script da 6,83 € a 29,90 €. Los 8,07 € de logística salen de otro método (comisión sobre PVP con IVA, sin embalaje ni devoluciones). Cerrar C5 remitiendo a `margenes/entrega-jefe.md` §3.
- F-C3 (menor, L21): PFAS "se trata como aplicable ya" con entrada en vigor 10/10/2026 de fuentes secundarias y dudas de alcance. Aceptable por prudencia; añadir que no se ha podido leer el reglamento.

## 6. Qué debe hacer el director

1. Devolver márgenes (F-M1) y aplicar los retoques menores de producto y cumplimiento antes de pasar la puerta.
2. Decidir, con el usuario, la muestra o el permiso de dominios (cumplimiento C2): sin fotos reales y sin plazo medido no hay vídeo ni GO.
3. Corregir CLAUDE.md (solo el director): 38,96 € como no verificado; 1005008315429915 solo forma D; "instalación rápida" prohibida hasta ver la ficha.
4. Lanzar la verificación manual (no es campaña): ficha de Ariel/Dione/Kepler, BC Corona y un proveedor redondo de <= 10 €; Trends; TikTok Shop ES; Seller Center.
