# Revisor de logística y plazos: set de cepillos de limpieza

Fecha del informe: 26/10/2026. Producto: AliExpress ES 1005013107637317 (9,29 €, PVP 24,90 €).
Fuentes: CLAUDE.md (regla 2 días laborables, leída hoy); `creativos/set-cepillos-ia.md` (ficha leída el 25/10/2026); skills sealeap fulfillment-service (regla UE: solo índice R127, "cláusulas completas por verificar") y returns-feedback. No se hizo búsqueda web ni se accedió a la ficha: todo lo que no figura como fuente es "no verificado".

## 1. Veredicto: SIN GO logístico

Ningún plazo está verificado (preparación, transportista, seguimiento, stock). Por la regla del proyecto, sin plazos verificados no hay GO.

## 2. Regla de plazo (hecho vs. no verificado)

| Punto | Estado | Fuente |
|---|---|---|
| Entrega al transportista en 2 días laborables con seguimiento válido | Regla del proyecto; "comprobar en Seller Center, cambia" | CLAUDE.md |
| Texto completo de la política UE/ES (cómputo del plazo, sanciones, cuándo cuenta la primera lectura del transportista) | No verificado. La skill solo tiene el índice UE (R127) | skill fulfillment-service, 16/10/2026 |
| Plazo de preparación del vendedor | No verificado | n/d |
| Plazo de entrega al cliente | No verificado | n/d |
| Transportista y seguimiento | No verificado | n/d |

Principio de la skill: subir un número de seguimiento no equivale a que el transportista haya recogido el paquete. Cuenta la primera lectura válida del transportista; una etiqueta sin lectura sigue siendo "no entregado al transportista".

## 3. Riesgo de incumplir los 2 días (estimación, no dato)

Riesgo: ALTO hasta que se verifique, por estas razones:
1. En dropshipping, TikTok mide desde tu pedido, pero el vendedor de AliExpress prepara en su plazo. Si prepara en 1-3 días, entregar al transportista en 2 días laborables es incierto.
2. "Envío desde España" en AliExpress no garantiza almacén propio ni recogida diaria. Puede ser un almacén local que recoge en lotes.
3. El seguimiento de AliExpress puede aparecer tarde o sin lectura inicial, y no equivale al seguimiento válido que exige TikTok.
4. Cortes de fin de semana y festivos: el pedido del viernes por la tarde consume días laborables.
5. Pack de 2: si el vendedor no deja comprar 2 unidades en un pedido, habría dos envíos y dos seguimientos (ya anotado en el archivo de creativos). Duplica el riesgo de retraso y rompe el margen.

Mitigaciones (ninguna aplicada aún): ficha con plazo de entrega conservador; stock limitado al inicio; revisión diaria de pedidos pendientes; comprobar que el vendedor sube seguimiento con lectura del transportista.

## 4. Riesgo de devoluciones y roturas (estimación del modelo, sin datos propios)

No hay datos de devoluciones del producto. Los porcentajes no se inventan: se da nivel cualitativo.

| Riesgo | Nivel | Motivo | Mitigación |
|---|---|---|---|
| Rotura en tránsito | Bajo-medio | Cepillos de plástico/cerdas, ligeros. Si trae bandeja o mango fino, puede doblarse | Pedir embalaje y confirmar en muestra |
| Expectativa vs. vídeo IA | Medio-alto | Los clips IA exageran limpieza. Principal causa de devolución en gadgets de limpieza | Mostrar solo lo que hace; vídeo propio de la muestra; sin "magia" |
| Contenido distinto al anunciado (nº de cepillos, tamaños, color) | Medio | Ficha de AliExpress puede variar por lote | Listar contenido exacto según la muestra |
| Superficies que raya | Medio | Cerdas duras en acero, vitro, grifos cromados | Advertir en ficha; probar en muestra |
| Devolución con coste de retorno | Medio | Sin saber si el vendedor acepta devoluciones, el coste puede ser tuyo | Ver sección 5 |
| Cobertura del cliente EU: política de devolución y 14 días de desistimiento | Hecho legal general, aplicación no verificada | No verificado en Seller Center | Verificar en Seller Center |

Impacto en margen: beneficio 8,93 €/set (43 %). Una devolución con envío de retorno perdido pierde la venta más el coste 9,29 € y la comisión, es decir, unas 1-2 devoluciones por cada 10 pedidos erosionan el margen de forma notable (estimación aritmética, no dato). Pasa a "no verificado" hasta tener la política de devoluciones del vendedor.

## 5. Datos a pedir al vendedor antes de publicar

Pedir por escrito (mensaje de AliExpress) y guardar captura con fecha:
1. Plazo de preparación en días laborables y hora de corte diaria de pedidos.
2. Almacén de origen (ciudad en España) y si es almacén del propio vendedor o de un tercero.
3. Transportista exacto y servicio (Correos, GLS, SEUR, etc.). Si cambia según el pedido, la lista.
4. Seguimiento: cuándo se genera, si se carga con lectura inicial del transportista y si lo ve TikTok. Plazo tras pedido.
5. Stock real y cantidad máxima por pedido (incluye compra de 2 sets en un envío).
6. Tiempo de entrega estimado al cliente final (península y Baleares/Canarias; confirmar si se envía a islas).
7. Embalaje (caja, bolsa, protección) y peso/medidas del paquete.
8. Política de devolución: quién paga el retorno, si aceptan devolución a España, plazo de reembolso.
9. Contenido exacto del set (nº, tamaños, materiales, color) y fotos reales.
10. Facturas, información del fabricante/responsable UE y marcado de conformidad, cuando proceda (la skill de listing marca el hueco de datos de fabricante UE).
11. Si pueden enviar sin publicidad/documentos de AliExpress en el paquete y con el nombre del remitente neutro.

## 6. Qué falta de otros departamentos y de Seller Center

- Muestra o fotos de reseñas (red bloquea ae-pic-a1.aliexpress-media.com y ae01.alicdn.com; bloqueo conocido, CLAUDE.md). Sin ello no hay contenido real verificable.
- Política vigente de cumplimiento y devoluciones de TikTok Shop ES en Seller Center (cómputo exacto del plazo, penalizaciones, protección de pedidos): pendiente de comprobar por el usuario.
- Cálculo de margen con devoluciones: lo hace analista de márgenes, no este informe.

## 7. Siguiente paso

Enviar el cuestionario de la sección 5. Con respuestas verificadas, rehacer este informe; sin ellas, no publicar. Condición de GO logístico: preparación y recogida verificadas que permitan entregar al transportista en ≤2 días laborables con lectura de seguimiento.
