# Plazos, devoluciones y roturas: cuerda de neón LED RGB con app (Ronda 3)

Fecha: 2026-10-26. Autor: revisor-logistica-plazos. No es asesoramiento jurídico.
Producto: cuerda/tira de neón flexible RGB con app y mando (por título), AliExpress ES 1005009522551027, 15,79 €, 10.000+ vendidos, 4,9 estrellas, etiquetas "Entrega más rápida en 2 días" y "Envío gratis" (mín. 30 días 19,27 €). Fuente: `tienda/trabajo/ronda-2/producto/buscador-proveedores.md`, listado de es.aliexpress.com con filtro shipFromCountry=ES, 2026-10-26. No se abrió la ficha.

## 0. Lo que NO está verificado (todo lo que importa)
- Plazo de preparación del vendedor, hora de corte, transportista, stock, longitud, adaptador, mando, política de devoluciones, garantía, CE/DoC, fabricante/responsable UE, radio (Bluetooth o RF): no verificado. Ninguna ficha abierta (fotos bloqueadas, ficha con anti-bot).
- "Envío desde España" solo por el filtro de búsqueda, no confirmado en la ficha.
- "Entrega más rápida en 2 días" es la promesa de entrega al cliente en AliExpress, NO es el plazo de preparación ni de entrega al transportista. No demuestra cumplir la regla de TikTok.
- Alimentación "USB/adaptador" viene del encargo del director; el listado no lo confirma. Si el adaptador es de red 230 V, aplica LVD a la fuente (ver revisor-normativa-ue.md, Ronda 2, sección 1).
- Umbrales exactos de TikTok Shop ES (LDR, tracking válido, cancelación): solo fuentes terceras, mayormente de otros mercados; confirmar en Seller Center.

## 1. Riesgo de incumplir "entrega al transportista en 2 días laborables con seguimiento válido"

Regla (CLAUDE.md): 2 días laborables con seguimiento válido; comprobar en Seller Center.

Fuentes terceras de búsqueda web 2026-10-26 (no oficiales, no específicas de España; contrastar):
- [Cahoot](https://www.cahoot.ai/tiktok-shop-fulfillment-requirements/): pedido regular debe pasar a "En tránsito" en 2 días laborables desde "Pendiente de envío"; su cómputo de festivos es de EE. UU., no sirve para España.
- [Saltbox](https://www.saltbox.com/blog/tiktok-shop-late-dispatch-rate-ldr-formula): reloj de 2 días laborables desde el pago con primer escaneo del transportista; en 2026 los pedidos sin enviar también cuentan como tardíos. Cita límites de volumen por encima del 10 % de LDR.
- [GeekSeller](https://www.geekseller.com/blog/tiktok-shop-update-late-dispatch-rate-ldr-enforcement-returns-april-6-2026/): objetivo recomendado LDR <= 4 %.
- [Ecommerce Fastlane](https://ecommercefastlane.com/tiktok-shop-hidden-compliance-costs-for-multi-channel-sellers/): LDR >10 % = aviso y sanciones; tracking válido >= 95 %; entrega a tiempo >= 80 %; cancelación por culpa del vendedor < 2,5 %.
Los puntos de inicio del reloj difieren entre fuentes (pago vs. "pendiente de envío"): no verificado cuál aplica en ES.

Análisis del riesgo en dropshipping con AliExpress (razonamiento, no dato):
1. Quien envía es el proveedor, no tú. No controlas la hora de corte ni la recogida. El escaneo del transportista lo hace un tercero.
2. Cadena de eventos que puede romper el plazo: (a) tú recibes el pedido de TikTok, (b) lo pasas al proveedor (manual o automático), (c) el proveedor prepara, (d) el transportista recoge y escanea. Cada eslabón consume horas. Si (b) es manual y el pedido entra viernes tarde, el fin de semana se come el margen de 2 días laborables (el sábado y domingo no cuentan, pero las horas de retraso en (b)-(c) sí pueden empujar el escaneo al martes).
3. Tracking válido: si AliExpress da un número del transportista sin primer escaneo, o un número que TikTok no reconoce como transportista soportado, el pedido cuenta como sin tracking válido. Qué transportistas acepta TikTok ES: no verificado.
4. Picos: un vídeo que vende de golpe crea cola en el proveedor. Ver inventory-spikes abajo.

Nivel de riesgo: MEDIO-ALTO hasta verificar plazo de preparación y transportista; MEDIO si el vendedor confirma por escrito preparación <= 1 día laborable, hora de corte, transportista con tracking y primer escaneo en origen. No hay GO logístico hoy (regla CLAUDE.md: plazos no verificados = sin GO).

Qué puede salvar el plazo (a probar, no verificado):
- Pedido de prueba propio (no es muestra para vídeo; es medir "pago -> primer escaneo" con reloj). Coste = 1 unidad ~15,79 € y es la única forma de medir el plazo real. Decisión del director (el usuario no quiere comprar muestra; aquí el motivo es plazo, no creativo).
- Stock/ventas de 10.000+ indican volumen, no plazo de preparación ni stock actual.
- Si el vendedor no se compromete a escribir "preparación <= 1 día laborable", tratar la ficha como no apta aunque diga "2 días".

## 2. Riesgo de devoluciones y roturas

Base legal (ver revisor-normativa-ue.md, Ronda 2, sección 3, no verificado en texto oficial): desistimiento 14 días naturales, garantía legal 3 años en España. Un neón estándar no tiene excepción de desistimiento (solo el personalizado).

Datos de partida: no hay tasa de devolución verificada para este producto. Reviews, fotos y comentarios de la ficha: no leídos. Búsqueda web 2026-10-26 sobre fallos de adhesivo/neón: sin resultados útiles (solo fichas de producto: [Govee en CSA-IoT](https://csa-iot.org/csa_product/govee-outdoor-neon-rope-light/), [Beyond LED datasheet](https://zoro.com/static/cms/enhanced_pdf/3River%20International%20LLC%20(Beyond%20Solar)_NeonxxRopexxLightsxxNExxSeriesxx7c5a79.pdf)). Por tanto los porcentajes de abajo NO son datos: son categorías de riesgo de criterio.

| Fallo | Causa probable (criterio, no verificado) | Probabilidad | Impacto | Reembolso/devolución | Mitigación |
|---|---|---|---|---|---|
| Adhesivo que se despega | Cinta 3M-tipo de baja calidad; paredes con pintura mate, texturadas o con polvo; peso de la silicona; calor | ALTA | Medio: producto sirve pero no queda pegado; el cliente reclama o devuelve | Reembolso parcial o total; reenvío no resuelve | Pedir si trae clips/tornillos; vídeo y ficha solo prometen superficies lisas y limpias; no mostrar pared irregular; no prometer "sin marcas" |
| Tira no enciende / zonas apagadas | Fuente débil, corte de segmento, conector flojo, defecto de transporte | MEDIA | Alto: DOA, garantía legal; coste de reenvío y devolución a tu cargo | Reemplazo o reembolso completo | Pedir garantía 3 años por escrito del vendedor y reposición sin devolver; prueba en muestra |
| App que no conecta | Bluetooth, app en chino/inglés, emparejamiento, permisos de ubicación Android, app que desaparece de la tienda | ALTA | Medio: producto "funciona" con mando, pero la promesa del vídeo falla; opiniones negativas; atención al cliente | Devolución por "no coincide con la descripción" | Pedir nombre de la app y enlace; comprobar idioma español, iOS/Android; ficha sin promesas de app si no se prueba; incluir guía de emparejamiento en español |
| Rotura en tránsito (silicona rasgada, conector aplastado, tira doblada) | Embalaje de bolsa blanda | BAJA-MEDIA | Medio | Reposición | Preguntar embalaje (caja o bolsa) |
| Color/longitud distinta de lo mostrado | Variante mal elegida (precio mínimo 15,79 € puede ser la variante más corta) | MEDIA | Medio: reclamación por descripción | Devolución | Ficha con medida exacta y variante exacta; fotos propias |
| Seguridad (fuente sin CE, sobrecalentamiento, pila de botón del mando) | Ver normativa | BAJA-MEDIA pero grave | Alto: retirada de ficha, sanción | Retirada | No publicar sin DoC (ver cuestionario) |

Resumen: producto con riesgo de devoluciones MEDIO-ALTO por el trío adhesivo + app + encendido. El 4,9 estrellas con 10.000+ vendidos baja la probabilidad, pero no está verificado qué dicen las reseñas ni qué parte son verificadas.

Efecto en margen (para analista-margenes, no calculo): con coste 15,79 € y envío gratis, un solo reembolso total sin recuperar el producto cuesta más de lo que gana 1 pedido normal. Devolución con transporte a tu cargo = pérdida completa. Los porcentajes de devolución y el coste de transporte inverso no están verificados; el analista debe poner un escenario y marcar "supuesto".

## 3. Picos de ventas y stock (inventory-spikes)
- Stock real del vendedor: no verificado. Ficha de AliExpress con 10.000+ vendidos no garantiza unidades disponibles hoy.
- Si un vídeo se hace viral: 100+ pedidos/día se estrellan contra la hora de corte y el stock de un único vendedor. Un solo proveedor = punto único de fallo.
- Preventa/promesas: no prometer plazos de preparación inferiores a lo confirmado por escrito. Bloquear ofertas flash hasta tener stock confirmado.
- Plan: limitar stock publicado en TikTok Shop a una cifra segura (por ejemplo, menos de lo que el vendedor confirme en 7 días), con un segundo vendedor alternativo (reserva en buscador-proveedores: 1005008641155318, 17,49 €, y 1005012650141412, 16,69 €; ambos con las mismas dudas).

## 4. Dependencias de otros departamentos
- analista-margenes: coste de devolución y rotura, comisión 9 % (4 % durante 60 días si la tienda cumple 5 productos activos en 15 días, comprobar), precio de reenvío.
- revisor-normativa-ue: veredicto CE/GPSR (hoy CONDICIONAL; sin DoC e informes, NO).
- buscador-producto: abrir la ficha (anti-bot) o enviar el cuestionario.
- creativos-ia: no mostrar nada que el producto no haga (app, efectos), y sin marcas de juegos (ver revisor-normativa-ue.md, sección 4).

## 5. Conclusión
- Logística/plazo: NO GO hasta tener por escrito plazo de preparación, hora de corte, transportista y stock. Hoy: no verificado.
- Devoluciones/roturas: riesgo MEDIO-ALTO; aceptable solo con garantía y reposición del vendedor por escrito, ficha sin promesas que no se hayan probado, y margen que absorba un porcentaje de devoluciones.
- Si el vendedor no responde con datos concretos en un plazo razonable (propuesta: 3 días hábiles), descartar y probar la reserva.

---

## CUESTIONARIO ÚNICO PARA EL VENDEDOR (copiar y pegar)

Asunto: Datos para publicar la cuerda de neón LED RGB (ref. AliExpress 1005009522551027)

Hola. Quiero vender este producto en la UE y necesito confirmar por escrito lo siguiente. Si no puede responder alguna pregunta, indíquelo ("no sé"). Gracias.

A. Identificación del artículo
1. Modelo exacto y referencia del fabricante de la variante que aparece a 15,79 €. Enlace a la variante.
2. Contenido exacto de la caja: longitud de la cuerda en metros, número de segmentos, adaptador o cable USB (con o sin fuente de alimentación), mando (sí/no, tipo, pila incluida), clips, tornillos, cinta adhesiva, manual (idioma).
3. Alimentación: tensión y potencia (V, W), conector, longitud del cable. Si hay adaptador de red: tensión de entrada, tipo de enchufe UE, marca/modelo y CE.
4. ¿Lleva batería o pilas (incluido el mando)? Tipo (por ejemplo, CR2032) y modelo.
5. Conectividad: ¿Bluetooth, WiFi, RF 433 MHz o infrarrojos? Nombre exacto de la app, idioma español, iOS y Android, enlace de descarga.
6. Material y protección: silicona/PVC, grado IP, temperatura de uso, tipo de adhesivo (marca/modelo de la cinta), superficies recomendadas.

B. Cumplimiento UE
7. Declaración UE de conformidad firmada de este modelo (EMC 2014/30/UE, RoHS 2011/65/UE; LVD 2014/35/UE si hay fuente de 230 V; RED 2014/53/UE si hay Bluetooth, WiFi o RF).
8. Informes de ensayo de laboratorio acreditado (EMC, RoHS, seguridad eléctrica, y radio si procede), con fecha y número de modelo igual al artículo.
9. Fotos de la etiqueta del producto y del adaptador (CE visible, tipo/lote, tensión/potencia, datos del fabricante).
10. Nombre, dirección postal y email del fabricante.
11. Nombre, dirección postal y email del responsable en la UE (importador o representante autorizado), según el Reglamento (UE) 2023/988 (GPSR). Si el envío sale de España, ¿quién es el importador?
12. Instrucciones y avisos de seguridad en español (PDF).
13. Registro RAEE y de envases en España: ¿quién lo asume?
14. Si lleva batería o pila: UN38.3, IEC 62133 y CE de la batería/cargador.

C. Plazos y logística
15. País y ciudad de salida del almacén. Confirmar que se envía desde España.
16. Tiempo de preparación del pedido (en días laborables desde que recibe la orden) y hora de corte (zona horaria) para salir el mismo día.
17. Días laborables de recogida y festivos del almacén.
18. Transportista(s) usados, servicio contratado, y si el número de seguimiento se genera con el primer escaneo en origen. ¿Se puede entregar el número de seguimiento antes de que el transportista recoja?
19. Plazo de entrega real a península y a Baleares/Canarias (si no envía allí, indicarlo).
20. Embalaje: caja rígida o bolsa; protección del conector y de la tira.
21. Stock actual en España de esta variante (unidades), reposición y plazo. Cantidad máxima que puede enviar por día.
22. ¿Puede enviar sin etiquetas o albaranes con su marca y precio? ¿Admite albarán neutro con mis datos?

D. Garantía y devoluciones
23. Garantía por escrito: ¿3 años como exige la ley española para bienes nuevos? ¿Quién la gestiona y cómo?
24. Política de devolución: plazo, quién paga el transporte de vuelta, ¿acepta devolución a un almacén en España o reembolso sin devolver para producto defectuoso?
25. ¿Reposición gratuita si llega defectuoso (no enciende, tramos apagados, app que no conecta, adhesivo defectuoso)? Plazo de respuesta.
26. Tasa de defectos o devoluciones de este modelo en los últimos 90 días, si la conoce.

E. Comercial
27. Precio por unidad, con IVA incluido o no, y para pedidos de 1, 10 y 50 unidades.
28. ¿Permite usar sus imágenes y vídeos? Si no, ¿puede enviar fotos reales del producto?
29. Persona de contacto y plazo máximo de respuesta (propuesta: 2 días hábiles).

Gracias. Sin esta información no podré publicar el producto.

---
Búsquedas web usadas: 2 de 3 (2026-10-26). Resultados terciarios, no oficiales. Pendiente de verificar en Seller Center: umbrales LDR/tracking válido en España, transportistas soportados, política de devoluciones de plataforma.
