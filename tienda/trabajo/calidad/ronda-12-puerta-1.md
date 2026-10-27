# Calidad, ronda 12, puerta 1 (giro de método) - 2026-10-27

Revisado: los 6 informes de `tienda/trabajo/ronda-12/` (producto/proveedores-serios.md, producto/metodo-busqueda.md + producto/barrido/b1.md y b1.json, producto/marca-propia.md, producto/modelos-alternativos.md, cumplimiento/requisitos-escalar.md, escalado/modelos-y-escalas.md + .driver.py) contra `cerebro/aprendizajes.md` y `CLAUDE.md`. No he corregido nada: cada fallo lleva ruta, línea y qué debe hacer su autor. Rutas relativas a `tienda/trabajo/ronda-12/`.

## Decisión por informe

| Informe | Decisión | Motivo en una línea |
|---|---|---|
| producto/proveedores-serios.md | APROBADO como hipótesis (sin GO), 3 correcciones | Honesto: dice que todo es blog y no da GO; falta fecha de publicación por dato y hay fuentes afiliadas/competidoras sin marcar en la tabla |
| producto/metodo-busqueda.md + barrido/b1.md | APROBADO con 4 correcciones obligatorias | Embudo útil y límites bien declarados; PVP mínimos a mano (no `margen_es.py`), 2 IDs descritos como otro producto, candidata 6 contradice a cumplimiento, marcas ajenas en títulos |
| producto/marca-propia.md | RECHAZADO | Columna "PVP de mercado (leído)" que no es leído (aprendizaje 20); márgenes solo con comisión 4 % y afiliado 15 %; afirma que la marca propia "resuelve" el problema sin dato; exige muestras (regla vigente: sin comprar muestras) |
| producto/modelos-alternativos.md | RECHAZADO | Dice que el POD "escala mejor" mientras el informe de escalado dice PARAR; el script da NO-GO (3 días) y la tabla de datos clave lo rebaja a HOLD; PVP mínimos con la comisión equivocada; cifra del bundle no reproducible |
| cumplimiento/requisitos-escalar.md | APROBADO | Marca casi todo "NO VERIFICADO", no inventa; 2 correcciones menores (nº de reglamento, discrepancias de plazo/comisión sin resolver) |
| escalado/modelos-y-escalas.md + driver | APROBADO en cifras, 4 correcciones obligatorias en conclusiones | Todas las cifras que he recalculado coinciden; pero una afirmación derivada es falsa por su propia fórmula y el criterio "gana dinero" es circular |

## 1. Recálculo (script `margen_es.py` y `escalado.py`, no a mano)

Parámetros: los del propio informe (envío, embalaje, devoluciones y comisión que declara cada uno).

| Cifra pedida | Mi resultado | Informe | Veredicto |
|---|---|---|---|
| Camiseta coste 12,50, PVP 29,90 (envío 4,50, dev 5 %, comisión 4 %, afiliado 15 %) | 1,49 € (6,0 %); afiliado 0: 5,01; comisión 9 % y afiliado 15 %: 0,26 | modelos-alternativos.md L45 = 1,49 / 5,01 / 0,26 | Coincide |
| Camiseta coste 12,50, PVP 34,90 | 4,62 / 8,73 / 3,18 | L46 = 4,62 / 8,73 / 3,18 | Coincide |
| Sudadera coste 26, envío 6, PVP 54,90 | 2,07 / 8,53 / -0,20 | L48 = 2,07 / 8,53 / -0,20 | Coincide |
| Marca propia coste 7 a PVP 34,90 | Esa combinación NO está en el informe. Más cercanas: calcetines (7 a 29,90) = 5,58 y pack setup (9 a 34,90) = 6,33; ambas coinciden con L58-L59. La combinación pedida (envío 3,90, emb 0,80, dev 10 %, afiliado 15 %): 8,53 € (29,6 %, GO) con comisión 4 %; 7,09 € (24,6 %, HOLD) con 9 %; 10,98 € (GO) con 9 % y afiliado 0 | marca-propia.md L8 y L60: "todos HOLD" | Las cifras del informe son correctas, pero su conclusión "ni con marca propia está resuelto el margen" depende de 4 % + afiliado 15 % + coste supuesto. Con coste 7 y PVP 34,90 el veredicto cambia de HOLD a GO según el supuesto: eso es una hipótesis, no un dato |
| Modelo B base (PVP 39,90, coste 9, envío 4,50, emb 0,80, dev 12 %, 9 %, afiliado 0) | 10,88 €; 4 %: 12,53; afiliado 15 %: 6,53; CPA de partida 0,7 x 10,88 = 7,62 | modelos-y-escalas.md L89, L91, L180 | Coincide |
| Celda B etapa 1.000 € (caja 3.157) | 1.800 stock + 62 atrapado + 44,6 anuncios (1 semana) + 250 fijos + 1.000 inicial = 3.156,6 | L105 = 3.157 | Coincide. Etapa 5.000: 4.039 (informe 4.038), etapa 20.000: 12.404, coincide |
| `escalado.py` con coste equivalente 12,48 | 3,68 (4 %) / 2,65 (9 %) | L231-L236 | Coincide |

Otras comprobaciones: tabla de PVP mínimos de metodo-busqueda.md L47-L56 con (coste + 4,3) / 0,62: todas coinciden. Barrido: 16 términos, 128 IDs únicos, 33 con 1-20 € / 500+ / 4,5+ estrellas: coincide con `b1.json`. D afiliado 20 % = 10,49: coincide.

## 2. Fallos con ruta y línea

### producto/proveedores-serios.md (APROBADO como hipótesis)
1. L6-L22: casi todas las celdas citan blog + "27/10/2026", que es la fecha de consulta, no de publicación. Fechas de publicación ausentes o antiguas: AliExpress Choice "Forbes, aniversario" y "nota de prensa jun 2023, desfasada" (L19), Recurly sin fecha. Debe distinguir "consultado" de "publicado" y marcar "sin fecha" donde no la hay.
2. Fuentes afiliadas o interesadas sin etiqueta en la propia fila: BigBuy 69-120 €/mes y 24-72 h solo de Trendtrack y Copyfy (L8, L60, L67); Dropi 2-5 % de un único autor afiliado (L12); Eprolo y la cuota de Zendrop de Eprolo (L13-L14); Spocket de GuiadeSoftware/Hackceleration con cupones (L10); Printify 29 $ y Printful 24-25 € de blogs (L15-L16). Copyfy vende herramientas del sector: es competidor. Hay que añadir columna "tipo de fuente" (oficial / tercero / afiliado / competidor).
3. L47 (marca propia): dice "hace falta stock propio, así que cambia el límite de capital" pero no dice que el cambio solo lo puede decidir la persona (ver 3.3). L40-L41 exige "muestra idéntica al lote", que choca con "sin comprar muestras" (ver 3.4).

### producto/metodo-busqueda.md y barrido/b1.md (APROBADO con correcciones)
1. L43-L56: la columna "PVP mínimo" está hecha a mano con la fórmula del aprendizaje 19, no con `margen_es.py`. Aprendizaje 21 dice margen siempre con el script. Además no se dice si el "coste listado" de AliExpress lleva IVA (el script espera coste sin IVA). Con los valores por defecto del script (afiliado 15 %) la fórmula 0,62 x P - 4,3 no da 4 € (coste 14,2 a PVP 29,90 da 2,23 € sin envío). Debe declarar los supuestos de la fórmula (envío, afiliado, devoluciones, IVA del coste) o pasar cada fila por `margen_es.py`.
2. L47-L56 y b1.md: los IDs 1005012807765865 (caja maletero), 1005013143921291 (luz LED), 1005013064606560 (funda) y 1005010256417006 (microondas) NO están en `barrido/b1.md` (que solo lista 1-20 €); están en `b1.json`. Debe citar `b1.json`. Aprendizaje 21 (verificar qué es cada ID): 1005013072641609 (candidata 2, "red/malla de maletero") es según su título un organizador de malla "para el asiento" (b1.md L10); 1005013064606560 (candidata 10, "funda de asientos") es la funda de UN asiento delantero. Corregir el nombre de producto o decir "no verificado".
3. L52 candidata 6 (luz LED de maletero, "condicional"): requisitos-escalar.md L12 y L65 califican la iluminación LED de coche de riesgo ALTO, "evitar en esta fase". Contradicción entre informes. Debe pasar a "descartada en esta fase" salvo CE y homologación demostrados.
4. Marcas ajenas en títulos de listado (regla CLAUDE.md, aprendizaje 10): Toocki (1005013072753056, usado como candidata 1), Rocoren, SONGMICS, Toker, BELIBUY, Victsing, IPSDI (b1.md L8, L16, L25, L30, L32; b1.json). Una ficha propia no puede llevar esas marcas; anotarlo como "proveedor con marca, sin marca blanca verificada". Claims prohibidos en títulos que no deben pasar a fichas: "Universal" (ID 1005013064024500, aprendizaje 12) y "Antideslizante" (1005013064606560).
5. L29-L38: los cortes del embudo (500 ventas, 3-30 vendedores, 50.000 visualizaciones, Trends 50 %) son propuestas del autor, declarado. Aceptable, pero el embudo puntúa con otro baremo y no con los 9 criterios sobre 40 (aprendizaje 5). Debe decir "ranking relativo, no comparable con 32/40" o reexpresar.
6. L20: FastMoss abril 2026 y Bolsamanía NielsenIQ vienen de blog de herramienta y prensa; correcto que lo marque, pero pone "27/10/2026" como fecha del dato (L81); la fecha del dato es abril/mayo 2026.
7. "Envío desde España" (b1.md L3, metodo L43): `b1.json` no contiene campo de origen; no hay prueba en los datos de que el filtro se aplicara. Marcar "origen no verificado en ficha".

### producto/marca-propia.md (RECHAZADO)
1. L12 (cabecera "PVP de mercado en España (leído)") y filas L14-L19: el propio informe dice en L2 que son resúmenes de buscador, "ancla INDICATIVA, no leída". Aprendizaje 20: eso no es ancla válida. Quitar "(leído)". Los anclas son además de marcas premium o de otra categoría: Stance/Nike/adidas en Zalando (L18) para un pack de calcetines sin marca a 29,90 €; Nilox 10,99 € (L14) frente a PVP propuesto 24,90 € (2,3 veces el ancla, sin dato que lo justifique).
2. L5: "La marca propia sí resuelve el problema de fondo ... permite PVP 25-40 €". Es una afirmación sin dato; L8 y L60 dicen lo contrario (HOLD en todos). Reescribir como hipótesis.
3. L56-L60: los márgenes usan `--tienda-nueva` (comisión 4 %, solo 60 días, no confirmada: requisitos-escalar.md L106). Con comisión 9 % el desk mat baja de 4,82 a 3,79 € (18,4 %). Mostrar ambas columnas. Costes de 5, 7 y 9 € son supuestos (L90) y se declara; bien, pero el veredicto "PVP 32-38 €" se apoya en ellos.
4. L52 y L74: pide "1 muestra de pre-producción (30-60 €)" y cotizaciones con muestra. CLAUDE.md: "sin comprar muestras". CONTEXTO.md (L4-L5) levanta solo "sin stock propio" y "500 €/mes", no las muestras. Debe marcarlo como regla que la persona tendría que levantar.
5. L29: costes de Alibaba en USD "sin envío/aranceles/IVA importación" y el derecho de 3 € / aranceles TARIC de requisitos-escalar.md no entran en ningún margen. Los 5 € "aterrizado" del desk mat no tienen desglose.
6. L47: "Fondo PYME abierto hasta 4/12/2026" frente a requisitos-escalar.md L94 "puede estar agotado en octubre". Contradicción sin resolver; ambas fuentes secundarias.
7. L65: el Reglamento 1007/2011 se cita como "no consultado": bien. L66 GPSR "texto oficial no consultado": bien.

### producto/modelos-alternativos.md (RECHAZADO)
1. L5 y L70: "Escala mejor el POD" y recomienda pruebas POD (L9). modelos-y-escalas.md L200 y L221: C = PARAR; D motor de aprendizaje y B proyecto grande. Dos informes de la misma ronda dicen lo contrario. El director no puede decidir con ambos. Debe retirar la conclusión o reconciliarla con datos.
2. L40-L41: el propio autor ignora el aviso NO-GO por más de 2 días y L78-L79 pone "HOLD, no GO". Debe poner NO-GO o "no verificado: plazo POD sin confirmar" (regla 2 días). Los costes de 3 y 5 días de producción de L16, L18 ya exceden las 48 h.
3. L51: los "PVP mínimo para margen 25 %" (camiseta 41,10 / 32,10 y sudadera 77,10 / 60,20) corresponden a comisión 4 %. Con la comisión normal del 9 % (aprendizaje 8) salen 45,6 / 34,8 y 85,5 / 65,2. Etiquetar la comisión.
4. L55: "bundle camiseta+camiseta coste 25, envío 6 necesita PVP unos 60 € para margen >= 25 %". Con `margen_es.py`: solo se cumple con comisión 4 % y afiliado 0 (58,3 €). Con 9 % y afiliado 0 hacen falta 63,2 €; con afiliado 15 %, 82,8 €. Cifra sin ficha de cálculo.
5. L32: la comisión "9 % desde 8/01/2026" sale de marketing4ecommerce.mx (dominio de México) y no de una fuente de España; requisitos-escalar.md L106 dice "del 5 % al 9 %" según categoría y que el 4 % no está confirmado. Aprendizaje 8: confirmar en Seller Center.
6. L34: Lengow "aceptar en 48 h y enviar en 72 h" es una tercera versión de plazo (junto a 2 días laborables y 5 días hábiles). Ver 3.1.
7. L28: ancla de sudadera 56-84 € son datos de 2023 (neo2.com, marie-claire, L84) de marcas con comunidad; no son ancla válida para una marca nueva. Declarado "ancla débil": bien, pero el rango "50-85 €" de L28 se usa luego como justificación del PVP 54,90.
8. L14 y L16: Printful "centros en España, Letonia y Reino Unido" y "no verificado para vendedor ES" frente a requisitos-escalar.md L119 (integra con TikTok Shop, tabla ambigua). Unificar.

### cumplimiento/requisitos-escalar.md (APROBADO)
1. L29: "Reglamento (UE) 2026/382" y el derecho de 3 € se apoyan en AduanaNews, LexisNexis, Polskie Radio, BDO (blogs y prensa); no hay DOUE. Está marcado y la ambigüedad "línea / artículo / categoría" está bien señalada (L30). Debe quedar como "no verificado" también en el resumen de L10.
2. L18: tarifa plana "~88,64 €" de Quipu, Billin y Vodafone (comerciales); marcado "verificar en Seguridad Social". Correcto.
3. L106 y L110: comisión (5-9 %, 4 % no confirmado) y plazo (5 días hábiles frente a 2 días) quedan como "NO VERIFICADO", sin elegir. Es lo correcto, pero hay que declarar en la cabecera que, mientras tanto, mandan los 2 días y el 9 % de CLAUDE.md para los cálculos.
4. L33: avisa de que `margen_es.py` no incluye el derecho de 3 €. Es hecho real (el script no tiene esa partida). Nadie lo ha incorporado: ver 3.5.

### escalado/modelos-y-escalas.md y driver (APROBADO en cifras, correcciones obligatorias)
1. L181: "con 100 uds, B cabría en 2.000 € en etapa 1.000". Por la fórmula del propio driver (L76-L81) la caja es 900 + 62 + 44,6 + 250 + 1.000 = 2.256,6 €, es decir, faltan unos 257 €. Afirmación falsa; la "ruta recomendada" de L197 (2.000 € con MOQ 100, 900 €) hereda el error. Corregir a "no cabe salvo bajar la inversión inicial o el MOQ".
2. L26 y driver L39: el CPA de partida se fija en el 70 % del CPA de equilibrio, y el criterio de la matriz ("SÍ = el caso base gana dinero tras anuncios", L34) solo comprueba `be - cpa > 0` (driver L80). Esto es verdad por construcción: la matriz no puede decir otra cosa. Además "SÍ" aparece en celdas con contribución mensual negativa (A 1.000: -68 €, B 1.000: -168 €, L69 y L97). Debe renombrar la columna a "cabe la caja" y no usar "gana dinero".
3. L62, L91, L120, L149: "Contraste con `escalado.py` ... coincide" es circular. El driver calcula el "coste equivalente" como `b_s0 - be` (driver L43-L44) y luego comprueba que el script devuelve `be`. Para D el coste equivalente es -0,43 € y el anexo da "capital atrapado -11 €" (L359). `escalado.py` fija envío 0, embalaje 0,30 y otros 1 % (unit(), línea 29-31 del script), de modo que no valida B ni D de forma independiente. Decirlo; no presentarlo como doble comprobación (aprendizaje 15 pide independencia).
4. L72, L101 y driver L73-L74: el texto dice "capital atrapado = pedidos/día x coste x 14" (fórmula de `escalado.py`), pero para B el driver usa (envío + embalaje) x 14 y para A (coste + envío) x 14. Documentar la diferencia.
5. L231-L267 (anexo): la tabla muestra "CPA 2 €", "CPA 8 €", "CPA 1 €", "CPA 9 €" porque el script formatea con `.0f`, pero el CPA real usado es 1,85 / 7,62 / 1,00 / 9,44. Aclarar para no confundir con los escenarios 5/8/12 de rondas previas.
6. L17, L176, L195: D (digital, web propia) se propone como primera medida con 500 €, con el CPA 9,44 € sin dato, PVP 9,90-29 € sin ancla y canal "NO VERIFICADO". Está bien marcado como supuesto, pero se aparta del objetivo de CLAUDE.md (tienda TikTok Shop) y de la ruta "no chapuza"; debe presentarse como opción que la persona decide, no como recomendación.
7. L2 y L5: el aviso "casi todo es SUPUESTO" y "no hay GO" son correctos y suficientes. Las cifras se reproducen.

## 3. Contradicciones entre informes y con el cerebro

1. Plazo de entrega. CLAUDE.md y aprendizajes 7 y 13: 2 días laborables con seguimiento. Cuatro versiones en esta ronda: 2 días (escalado A, `margen_es.py`), "aceptar 48 h y enviar 72 h" (modelos-alternativos.md L34, Lengow), 5 días hábiles (requisitos-escalar.md L110, SendPulse/ShippyPro) y Made to Order 3-14 días (solo EE. UU., modelos-alternativos.md L34). Nadie lo ha leído en Seller Center. Hasta entonces manda CLAUDE.md (2 días): C (POD, 3 días) y toda cifra de CJ (7-16 días, proveedores-serios.md L9) quedan NO-GO/no verificado, y lo mismo el "5-10 días" de Printify/Printful/Gelato.
2. Comisión. CLAUDE.md: 9 %, 4 % 60 días en tienda nueva. marca-propia.md usa 4 %; modelos-y-escalas.md usa 9 % y calcula 4 % como sensibilidad; modelos-alternativos.md mezcla ambas columnas pero etiqueta mal el PVP mínimo; requisitos-escalar.md dice "5 a 9 %" y "el 4 % no confirmado". El mismo producto da HOLD o GO según el informe. Unificar: 9 % como caso base, 4 % como bonus de 60 días.
3. "Sin stock propio" y "500 €/mes" levantados solo para investigar (CONTEXTO.md L4-L5). marca-propia.md (L7, L52-L54) y modelos-y-escalas.md (B, L196-L197) presentan escenarios de 2.000-5.000 € y stock en 3PL sin decir en el veredicto que seguir por ahí exige que la persona cambie CLAUDE.md. Ninguno de los 6 modifica CLAUDE.md (correcto), pero los veredictos deben llevar la frase "requiere decisión de la persona".
4. "Sin comprar muestras" no se ha levantado y aparece exigido: marca-propia.md L52 y L74, proveedores-serios.md L22 (inspección y muestra de lote 1688).
5. Derecho de 3 € por envío: `margen_es.py` no lo incluye (confirmado leyendo el script: solo producto, envío, embalaje, comisión, otros, afiliado y devoluciones). Ni el barrido (candidatas con coste de 5,69-8,29 € para las que 3 € suponen +4,84 € de PVP mínimo según la fórmula del aprendizaje 19), ni CJPacket (7-16 días desde China, proveedores-serios.md L9), ni marca-propia (desk mat importado), ni modelos-y-escalas.md lo incorporan. requisitos-escalar.md L33 lo avisa y lo deja al cfo. Hasta incluirlo y fijar si es por línea/artículo/categoría, cualquier margen con origen China es optimista; no aplica a stock ya despachado en España/UE (origen no verificado en b1.json).
6. Producto concreto: metodo-busqueda.md (candidata 6, LED condicional) frente a requisitos-escalar.md (LED coche ALTO, evitar). marca-propia.md excluye LED/RGB por CE (L65): coherente con requisitos.
7. POD: modelos-alternativos.md "escala mejor" frente a modelos-y-escalas.md "PARAR" (ver fallo modelos-alternativos 1).
8. Fondo PYME: "abierto hasta 4/12/2026" frente a "puede estar agotado" (marca-propia vs requisitos). EUIPO 850 / 50 / 150 € coincide en los dos.

## 4. Reglas de CLAUDE.md

- Marcas ajenas: ningún informe propone usar GTA, Rockstar, Vice City, iPhone ni AirPods. Sí aparecen marcas en títulos de proveedores (Toocki, SONGMICS, Rocoren, Victsing, BELIBUY, Toker) y artistas en camisetas de AliExpress (Omar Courtz, Shakira, The Weeknd, Quevedo, b1.json): metodo-busqueda.md L54 las descarta, correcto. Marcas como Stance, Nike, adidas, Nilox, Battletron solo como ancla de precio, no para vender. modelos-alternativos.md L81 y L9 mencionan un "pack digital Miami/80s" (ronda 7): la estética neón/retro "Miami" roza Vice City; no es violación, pero el diseño debe declararse sin referencias al juego.
- Categorías excluidas: metodo-busqueda.md descarta el aspirador (batería, L55) y las tiras blanqueadoras dentales (L20, solo como contexto). Candidata 6 (LED) pendiente (ver arriba). Ninguna entrega propone salud, suplementos, cosmética, juguetes ni alimentación. El organizador de nevera/recipientes de b1.md L35-L39 (alimentos) no se propone; no hay fallo.
- Vídeos IA y reseñas falsas: ninguno de los informes los incumple; marca-propia.md L15 dice "antes/después de setup (con producto real, sin antes/después fabricado)": correcto.
- Claims: "Universal" y "Antideslizante" en títulos (ver metodo-busqueda fallo 4).
- Nada inventado sin marcar: precios y plazos de blogs van como tales. Faltan solo las correcciones arriba indicadas.

## 5. Qué dato exacto falta para pasar de hipótesis a decisión

1. Seller Center ES (persona): comisión real y si hay 4 % de tienda nueva; plazo máximo de entrega al transportista (2 frente a 5 días hábiles) y si cuenta el tiempo de producción POD; si admite stock de 3PL de terceros o de proveedor en UE; si admite POD con "Made to Order"; categorías restringidas ES; si acepta marca en trámite en Brand Qualification.
2. Precio y ventas reales en TikTok Shop ES (persona, acción 1 del backlog) de: camiseta gráfica gamer/coche, sudadera, desk mat XXL, pack setup, calcetines 3 pares. Sin esa lectura no hay PVP; todos los "propuestos" (24,90 / 29,90 / 34,90 / 39,90 / 54,90) están sin ancla.
3. Coste real puesto en España: cotización escrita de 2-3 fabricantes (desk mat, calcetines, pack) con MOQ, plazo y muestra (esto último pide levantar la regla de muestras), y el coste base en euros con impresión de la camiseta/sudadera en Printify/Printful/Gelato con dirección española (hoy: 12,50 y 26 € supuestos).
4. Tarifa de 3PL en España (mínimo mensual, picking, almacenaje, devoluciones) y envío a cliente: confirma 3,90-4,50 €.
5. Aduana: si el derecho de 3 € es por línea, artículo o categoría, quién lo paga, y arancel TARIC del desk mat/calcetines. Con eso se modifica `margen_es.py` (decisión del cfo-finanzas, no de calidad).
6. Plazo real de entrega y conector TikTok Shop ES de BigBuy y CJ (sitios oficiales) y de Printful/Gelato; plan de pago real de BigBuy (69-120 €/mes: dos fuentes discrepan).
7. CPA real con 2-3 creativos de un producto de 25-40 €: sin él el 70 % del equilibrio de L26 (escalado) es un supuesto y la matriz no decide.
8. Alta fiscal, GPSR (quién es responsable UE y a qué coste) y etiquetado textil: sin ellos ningún escenario con producto propio puede publicarse.
9. Decisión de la persona: capital (500 / 2.000 / 5.000 €), si se levantan "sin stock" y "sin muestras" para el proyecto, y si el producto digital (D) entra en el alcance.

## Resumen de 5 líneas para el director
Véase la respuesta de entrega; en el archivo: 2 informes APROBADOS (proveedores-serios y cumplimiento), 2 APROBADOS con correcciones obligatorias (metodo-busqueda y escalado), 2 RECHAZADOS (marca-propia y modelos-alternativos).
