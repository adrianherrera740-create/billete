# Preguntas cerradas: Seller Center TikTok Shop ES y gestoría (ronda 14, 29/10/2026)

Para hacer el 02/11/2026 (puerta M0). Estado: BORRADOR de agente. Nada de este documento es dato verificado: lo que figura como "hipótesis del proyecto" viene de `CLAUDE.md` y `cerebro/estado.md` y NO está confirmado. No tengo acceso a Seller Center ni a webs oficiales desde la nube; por eso las rutas de menú van como [NO VERIFICADO] salvo que se diga otra cosa. Cero cifras nuevas: las únicas cifras que aparecen son las ya declaradas por el proyecto como sin confirmar.

Cómo responder: marca una casilla, pega el texto literal del panel (copiar/pegar, no resumir) y adjunta captura con fecha visible. Si no encuentras la respuesta en 2 minutos, escribe "no encontrado" y sigue: eso también es un dato.

Leyenda de prioridad: P1 = bloquea la puerta M1 (09/11); P2 = necesario antes de gastar nada; P3 = útil.

---

## A) Seller Center de TikTok Shop ES

Ruta general en el panel para todas: [NO VERIFICADO] (probar buscador del Seller Center, Centro de ayuda / Academy, y "Reglas" o "Políticas" del vendedor). Anota la ruta real que uses en cada "Dónde lo encontré".

### A1. Comisión real y rebaja de tienda nueva (P1)
- Pregunta 1: ¿Qué porcentaje de comisión de plataforma muestra el panel para tu categoría?  [ ] 9 %  [ ] otro: ____  [ ] no aparece
- Pregunta 2: ¿Hay una rebaja o promoción de comisión para tiendas nuevas?  [ ] Sí  [ ] No  [ ] No aparece
- Pregunta 3 (si Sí): ¿Cuántos días dura y desde qué fecha cuenta (alta, verificación o primer pedido)?  [ ] Días: ____  [ ] Cuenta desde: alta / verificación / primer pedido / otro: ____
- Pregunta 4: ¿Hay comisión adicional (afiliados, pago, envío, tarifa fija por pedido)?  [ ] Sí: ____  [ ] No  [ ] No aparece
- Dónde buscar: [NO VERIFICADO] (probable: sección de tarifas/comisiones en Ayuda o Finanzas).
- Hipótesis del proyecto (sin confirmar): 9 % y 4 % durante 60 días en tienda nueva.
- Texto literal: ______________________  Captura: [ ] adjunta
- Por qué importa: es la entrada de `margen_es.py --comision-tiktok`; decide si un PVP da margen positivo y si el cálculo de margen de las rondas 12-13 se mantiene.

### A2. Plazo de entrega al transportista y desde cuándo cuenta (P1)
- Pregunta 1: ¿Cuál es el plazo máximo para entregar el paquete al transportista?  [ ] 2 días laborables  [ ] 5 días laborables  [ ] otro: ____
- Pregunta 2: ¿Desde cuándo cuenta?  [ ] hora del pedido  [ ] confirmación de pago  [ ] fin de periodo de cancelación  [ ] otro: ____
- Pregunta 3: ¿Se exige número de seguimiento válido y subido a tiempo?  [ ] Sí  [ ] No
- Pregunta 4: ¿Qué penalización o efecto en la puntuación de tienda se indica por incumplirlo?  [ ] Texto literal abajo  [ ] No indicado
- Dónde buscar: [NO VERIFICADO] (probable: política de envío/logística, o puntuación de tienda).
- Hipótesis del proyecto: 2 días laborables con seguimiento; el proyecto ha visto también "5" sin resolver.
- Texto literal: ______________________  Captura: [ ] adjunta
- Por qué importa: si el plazo es 2 días, un proveedor que prepara en 3-7 días o envía desde fuera de la UE no es viable; si es 5, se reabren opciones. Es el filtro principal de la puerta M1.

### A3. Stock fuera de la UE, dropshipping desde terceros y país de origen (P1)
- Pregunta 1: ¿Se permite vender con stock ubicado fuera de la UE (almacén propio o de tercero)?  [ ] Sí  [ ] No  [ ] Solo con condiciones: ____
- Pregunta 2: ¿Se permite el dropshipping (proveedor envía directamente al cliente)?  [ ] Sí  [ ] No  [ ] Solo con condiciones: ____
- Pregunta 3: ¿Debe el vendedor ser quien envía/aparece como remitente?  [ ] Sí  [ ] No  [ ] No indicado
- Pregunta 4: ¿Qué país de origen se declara en la ficha: el de fabricación o el de envío?  [ ] fabricación  [ ] envío  [ ] ambos  [ ] No indicado
- Pregunta 5: ¿Hay campo obligatorio de "ubicación del almacén" o "envío desde"?  [ ] Sí  [ ] No
- Dónde buscar: [NO VERIFICADO] (probable: política de vendedor, "tipos de envío/fulfilment", formulario de alta de producto).
- Texto literal: ______________________  Captura: [ ] adjunta
- Por qué importa: decide si CJ y proveedores asiáticos son utilizables o solo almacén UE/ES; condiciona IVA, aduanas y plazo (ver B2, B3).

### A4. Producto bajo demanda y plazo ampliado (P1)
- Pregunta 1: ¿Existe una política de producto bajo demanda / preventa / plazo de preparación ampliado?  [ ] Sí  [ ] No
- Pregunta 2: (si Sí) ¿Qué plazo máximo de preparación permite y en qué categorías?  Días: ____  Categorías: ____
- Pregunta 3: ¿Hay que marcarlo por producto (campo "plazo de preparación")?  [ ] Sí  [ ] No
- Pregunta 4: ¿Se puede vender preventa (producto aún no fabricado) con fecha de envío futura?  [ ] Sí  [ ] No  [ ] Solo con condiciones: ____
- Dónde buscar: [NO VERIFICADO] (probable: formulario de producto, ajustes de envío).
- Texto literal: ______________________  Captura: [ ] adjunta
- Por qué importa: es la vía de la prueba GO de preventa (14 días, tope 30 €) y la única forma de compatibilizar plazos largos con la regla de 2 días.

### A5. Categorías restringidas, marcas y autorizaciones (P2)
- Pregunta 1: ¿Aparecen como restringidas o prohibidas? (marca cada una)  gaming/accesorios [ ] libre [ ] restringida   coche/accesorios [ ] libre [ ] restringida   ropa/streetwear [ ] libre [ ] restringida   electrónica con batería [ ] libre [ ] exige CE/documentos
- Pregunta 2: ¿Se pide autorización de marca o prueba de propiedad para vender ropa estampada o artículos de marca?  [ ] Sí  [ ] No
- Pregunta 3: ¿Qué documentación exige la categoría elegida (CE, informe de ensayo, ficha técnica, etiqueta, manual)?  Lista literal: ____
- Pregunta 4: ¿Hay política sobre productos con licencias de videojuegos/coches sin autorización?  [ ] Prohibidos  [ ] Permitidos  [ ] No indicado
- Dónde buscar: [NO VERIFICADO] (probable: lista de categorías restringidas / política de propiedad intelectual).
- Texto literal: ______________________  Captura: [ ] adjunta
- Por qué importa: confirma que los tres nichos (gamers, coches, streetwear) son vendibles sin trámites que el proyecto no puede cumplir sin muestras.

### A6. Productos digitales (P3)
- Pregunta 1: ¿Se admiten productos digitales (descargas, plantillas, códigos)?  [ ] Sí  [ ] No  [ ] Solo ciertas categorías: ____
- Dónde buscar: [NO VERIFICADO] (política de categorías prohibidas).
- Texto literal: ______________________  Captura: [ ] adjunta
- Por qué importa: abre o cierra una ruta de coste de producto casi nulo y sin logística; hoy no hay evidencia de que exista.

### A7. Requisitos de alta: NIF, autónomo o sociedad (P1)
- Pregunta 1: ¿Qué tipos de vendedor admite el alta?  [ ] Particular  [ ] Autónomo  [ ] Sociedad  [ ] Solo empresa
- Pregunta 2: ¿Qué documentos pide el formulario de alta?  [ ] NIF/DNI  [ ] Alta en Hacienda (modelo 036/037)  [ ] Alta RETA  [ ] CIF sociedad  [ ] Cuenta bancaria IBAN  [ ] Otros: ____
- Pregunta 3: ¿Pide número de IVA intracomunitario o epígrafe IAE?  [ ] Sí  [ ] No
- Pregunta 4: ¿Puedes iniciar el alta sin tener todo y completarla después?  [ ] Sí  [ ] No
- Pregunta 5: ¿Hay depósito o tarifa de apertura?  [ ] No  [ ] Sí: ____
- Dónde buscar: [NO VERIFICADO] (registro de vendedor / verificación de cuenta; Ayuda "requisitos de registro").
- Texto literal: ______________________  Captura: [ ] adjunta
- Por qué importa: responde a la pregunta pendiente 4 (alta fiscal) y fija si hace falta gestoría antes del 10/11; sin alta no hay tienda.

### A8. FBT (Fulfilled by TikTok) en España (P3)
- Pregunta 1: ¿Aparece FBT disponible para vendedores en España?  [ ] Sí  [ ] No  [ ] Solo por invitación
- Pregunta 2: ¿Requisitos (volumen, ventas mínimas, antigüedad)?  Texto: ____
- Pregunta 3: ¿Admite stock de terceros o solo productos recibidos en su almacén?  [ ] Ambos  [ ] Solo propio  [ ] No indicado
- Dónde buscar: [NO VERIFICADO] (menú de logística/almacén).
- Texto literal: ______________________  Captura: [ ] adjunta
- Por qué importa: si existiera, evitaría la regla de 2 días con un almacén ajeno, pero implica stock propio (regla levantable solo por la persona).

---

## B) Gestoría o asesor fiscal

Ninguna respuesta del asesor sustituye a la fuente oficial: pide que cite la norma o la página de la Agencia Tributaria. Marca [NO VERIFICADO] todo lo que diga de oído.

### B1. Alta de autónomo (P1)
- Pregunta 1: ¿Qué epígrafe del IAE aplica a venta online de productos de terceros sin stock?  Respuesta: ____ [NO VERIFICADO hasta que lo confirme la gestoría]
- Pregunta 2: ¿Cuál es la cuota mensual real de autónomo en mi caso (primer año, tarifa reducida si existe)?  Importe: ____ € [NO VERIFICADO]
- Pregunta 3: ¿Cuál es el coste de gestoría por mes y por el alta?  Alta: ____ € Mes: ____ €
- Pregunta 4: ¿Cuándo debo darme de alta para vender antes del 10/11?  Fecha: ____
- Pregunta 5: ¿Puedo empezar a facturar antes de tener tienda (mientras valido producto)?  [ ] Sí  [ ] No
- Por qué importa: el coste fijo mensual entra en el modelo de 500 €/mes y puede ser mayor que el beneficio por pedido de los primeros meses.

### B2. IVA: ventas a UE e importación (P1)
- Pregunta 1: ¿A qué tipo de IVA vendo a un cliente en España?  [ ] general  [ ] reducido  [ ] depende del producto: ____
- Pregunta 2: Si vendo a clientes de otros países de la UE, ¿tengo que registrarme en el régimen OSS/ventanilla única?  [ ] Sí  [ ] No  [ ] Solo por encima de un umbral: ____
- Pregunta 3: Si el producto entra desde fuera de la UE, ¿quién paga el IVA de importación (yo, el cliente, la plataforma, el transportista) y cómo se declara?  Respuesta: ____
- Pregunta 4: ¿TikTok Shop recauda o liquida IVA por mí en alguno de los casos?  [ ] Sí  [ ] No  [ ] No sé
- Pregunta 5: ¿Necesito número EORI?  [ ] Sí  [ ] No
- Por qué importa: `margen_es.py` trata el IVA, pero la línea de importación está sin verificar; un error aquí vuelve negativo un margen que parece positivo.

### B3. Envíos de menos de 150 € y derecho de 3 € (P1)
- Pregunta 1: ¿Qué cambió con el fin de la franquicia de 150 € para envíos de bajo valor desde fuera de la UE?  Respuesta: ____
- Pregunta 2: ¿Existe hoy un derecho fijo de 3 € por artículo/paquete, desde qué fecha, y quién lo paga?  [ ] Sí, desde ____  [ ] No  [ ] Aún no aplicable  [NO VERIFICADO: lo he visto citado en el proyecto sin fuente oficial]
- Pregunta 3: ¿Se cobra por paquete o por categoría de artículo dentro del paquete?  [ ] paquete  [ ] artículo  [ ] otro: ____
- Pregunta 4: ¿Puede un proveedor con almacén en la UE evitarlo?  [ ] Sí  [ ] No  [ ] Depende: ____
- Pregunta 5: ¿Qué gestiones de aduana corresponden al vendedor (declaración, agente)?  Respuesta: ____
- Por qué importa: el derecho y el flete de importación están fuera de `margen_es.py` (estado.md, bloqueos vivos); si aplica, resta al margen de cada pedido de un producto barato.

### B4. Responsable GPSR (P2)
- Pregunta 1: Para vender productos en la UE bajo el Reglamento de Seguridad General de Productos (GPSR), ¿quién debe figurar como operador económico / responsable en la UE?  [ ] yo  [ ] el proveedor  [ ] un representante autorizado  [ ] depende: ____
- Pregunta 2: Si el fabricante está en China y yo soy el vendedor, ¿qué información mínima debe aparecer en el producto o la ficha (nombre, dirección, contacto, lote)?  Lista: ____
- Pregunta 3: ¿Qué responsabilidad asumo yo si el proveedor no la cumple?  Respuesta: ____
- Por qué importa: sin responsable GPSR, TikTok puede retirar la ficha y la responsabilidad recae sobre la persona.

### B5. Registro de marca (P3)
- Pregunta 1: ¿Compensa registrar una marca antes de vender (marca propia / POD)?  [ ] Sí  [ ] No  [ ] Después de validar
- Pregunta 2: ¿Dónde y cuánto cuesta registrar en España y en la UE (OEPM / EUIPO)?  Importe: ____ [NO VERIFICADO]
- Pregunta 3: ¿Puedo vender sin marca registrada con nombre comercial?  [ ] Sí  [ ] No
- Pregunta 4: ¿Puedo comprobar si mi nombre infringe una marca ajena? ¿Cómo?  Respuesta: ____
- Por qué importa: marca propia está en AGUANTAR; el registro solo se paga si la ruta pasa M2.

### B6. Documentación a pedir a un proveedor (P1)
- Pregunta 1: ¿Qué debe darme el proveedor para poder facturar y justificar IVA? (marca)  [ ] razón social  [ ] NIF/VAT UE verificable (VIES)  [ ] factura con IVA  [ ] contrato o condiciones por escrito
- Pregunta 2: ¿Qué documentos de producto?  [ ] declaración CE  [ ] informe de ensayo  [ ] ficha técnica  [ ] etiquetado en español  [ ] datos del fabricante/GPSR
- Pregunta 3: ¿Cómo compruebo que un número de IVA UE es válido?  Respuesta: ____
- Pregunta 4: ¿Qué cláusulas me protegen si el envío llega tarde o el producto no cumple?  Respuesta: ____
- Por qué importa: CJ no mostraba razón social ni VAT (ronda 13, red flag 1); esta lista decide qué proveedores se descartan sin más.

---

## Plantilla de correo (NO ENVIADA; revisar, rellenar los corchetes y enviar tú)

Asunto: Consulta para alta como autónomo y venta online (dropshipping) en TikTok Shop España

Buenos días,

Me llamo [NOMBRE] y estoy valorando abrir una tienda online en TikTok Shop España vendiendo productos de proveedores, sin stock propio. Antes de darme de alta, necesito resolver varias dudas fiscales y me gustaría saber si podéis ayudarme y cuánto costaría. Mi situación: [EMPLEO ACTUAL / SIN ACTIVIDAD PREVIA], residencia fiscal en [PROVINCIA], plazo deseado de alta: antes del [FECHA].

Mis preguntas son:
1. Epígrafe del IAE adecuado, cuota mensual de autónomo en mi caso y cuándo conviene darse de alta.
2. IVA en ventas a clientes de España y de otros países de la UE, y si necesito registrarme en OSS.
3. IVA y derechos de aduana en productos importados desde fuera de la UE, incluido cualquier derecho fijo por paquete de bajo valor, y si necesito número EORI.
4. Quién debe figurar como responsable de seguridad del producto (GPSR) cuando el fabricante está fuera de la UE.
5. Qué documentos debo pedir a un proveedor (razón social, VAT, factura, declaración CE, datos del fabricante).
6. Si compensa registrar una marca antes de empezar o esperar a validar ventas.
7. Honorarios: alta, cuota mensual de gestoría, presentación trimestral de IVA e IRPF.

Si es posible, indicadme la norma o página oficial en la que se basan las respuestas, para poder guardarla como referencia. ¿Podríamos hacer una llamada breve de [15-20] minutos esta semana? Mi disponibilidad: [DÍAS Y HORAS].

Gracias de antemano,
[NOMBRE]
[TELÉFONO]

---

## Datos clave

| Producto | ID/URL | Coste € | PVP € (probado o propuesto) | Fuente del precio de mercado y fecha | Verificado (listado/ficha/persona) | Margen/pedido y supuestos | Veredicto |
|---|---|---|---|---|---|---|---|
| No aplica (listas de preguntas; no hay producto) | no aplica | no verificado | no verificado | ninguna; sin acceso a Seller Center ni a webs oficiales, 29/10/2026 | ninguno: pendiente de la persona (02/11) | no calculado | Sin GO. Documento de preparación, no de decisión |

- **Qué sabemos** (con fuente y fecha): el proyecto trata como hipótesis 9 % de comisión, 4 % en tienda nueva durante 60 días, y 2 días laborables de entrega al transportista (`CLAUDE.md` y `cerebro/estado.md`, 29/10/2026); ninguna está confirmada. El derecho de 3 € y el flete de importación no están verificados ni incluidos en `margen_es.py` (`estado.md`).
- **Qué asumimos** (y cómo se comprobaría): que las preguntas A1-A8 son respondibles desde el panel de vendedor; se comprueba el 02/11 con texto literal y captura. Las rutas de menú son [NO VERIFICADO]. Las preguntas B se contrastan citando fuente oficial.
- **Qué cambiaría mi conclusión:** que A2 dé 5 días (se abre más ruta de proveedores), que A3 no admita dropshipping ni stock fuera de la UE (se cierra gran parte de CJ), que A1 dé una comisión distinta de la hipótesis (cambia todo margen calculado), o que B3 confirme un derecho fijo por paquete (resta margen a productos baratos).
