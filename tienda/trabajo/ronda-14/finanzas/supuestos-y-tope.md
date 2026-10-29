# Supuestos únicos, tope de 30 € y propuesta de derechos/flete (ronda 14)

Autor: `cfo-finanzas`. Fecha: 2026-10-29. Fuentes leídas: `ronda-14/CONTEXTO.md`, `cerebro/okrs.md`, `riesgos.md`, `kpis.md`, `estado.md`, `aprendizajes.md` (reglas 7, 8, 23, 25, 32), `proceso.md`, `ronda-12/decision-ceo.md`, `margen_es.py`, `escalado.py`, informes de márgenes de rondas 10 a 13. Los cálculos de abajo salen de `margen_es.py` y `escalado.py` ejecutados hoy; no he reimplementado nada ni tocado los scripts. Sin acceso a webs desde la nube: nada de lo externo está verificado.

Estado de las cifras: lo generado por IA no nace verificado. Ningún valor de la tabla 1 está "confirmado por la persona": la persona solo ha fijado objetivo, 500 €/mes (sin definir), sin muestras y sin stock propio.

## 1. Tabla única de supuestos (la usan todos los informes desde ahora)

Etiquetas: **PERSONA** = confirmado por la persona · **REGLA** = regla escrita del proyecto (CLAUDE.md, proceso.md, script) · **SUPUESTO** = lo pongo yo o un informe, sin medir.

| Parámetro | Valor base | Variante | Etiqueta | Origen y comprobación | Argumento del script |
|---|---|---|---|---|---|
| Comisión TikTok Shop ES | 9 % | 4 % los primeros 60 días de tienda nueva | REGLA (CLAUDE.md; aprendizajes 8) | Confirmar en Seller Center (hoja de preguntas de la persona). El "5 %" que cita `estado.md` no lo he localizado en ningún informe: tratar como NO VERIFICADO y no usarlo | `--comision-tiktok 0.09` / `0.04` (`--tienda-nueva` equivale al 4 %) |
| Afiliado (creadores) | 0 % (vídeos propios) | 15 % (ventas por creadores) | SUPUESTO (15 % es el valor por defecto del script; los 8-10 % de ropa de Beancount son un resumen de blog, no verificado) | Medir en el programa de creadores | `--afiliado 0` / `0.15` (es una FRACCIÓN) |
| Devoluciones (producto perdido) | 15 % | 10 % | 15 % = REGLA (puerta 1 de `proceso.md`, `escalado.py` y aprendizajes 7); 10 % = SUPUESTO (solo como sensibilidad). Parada real del proceso: > 20 % pausa la ficha | Medir en el piloto | `--devoluciones 0.15` / `0.10` |
| CPA de anuncios | 8 € (caso base) | 5 y 12 € | SUPUESTO (ninguno medido) | Solo existe CPA real tras anuncios (mes 2 como pronto) | `escalado.py --cpa 5,8,12 --cpa-base 8` |
| IVA | 21 % sobre PVP con IVA | otros tipos solo si el producto lo tiene | REGLA del script (constante `IVA = 0.21`); no confirmado por gestoría | Preguntar a la gestoría (sección 5) | fijo en el script |
| Envío al cliente | 0 € en `escalado.py` (fijo en el código) | 4 € en el POD de ronda 13; 0 € en ronda 11 | SUPUESTO | Leer la tarifa en la ficha del proveedor o de Seller Center | `--envio` en `margen_es.py` |
| Embalaje | 0,30 € | | REGLA (por defecto del script) | Sin dato propio | `--embalaje` |
| Pago y otros cargos | 1 % de la base | | REGLA (por defecto del script) | Sin dato propio | `--otros` |
| Beneficio objetivo tras anuncios | 3 €/pedido | | REGLA (script) | | `--objetivo` |
| Margen mínimo | 25 % | | REGLA (script y puerta 1) | | `--margen-minimo` |
| Derecho de importación fijo | 3 € por envío y línea arancelaria desde 01/07/2026 | | NO VERIFICADO. Fuentes secundarias en `ronda-12/cumplimiento/requisitos-escalar.md` §3.1, ninguna oficial (EUR-Lex, AEAT) | Gestoría o transitario; no entra en el script hoy (aprendizajes 25) | propuesta en la sección 4 |
| Flete de importación | sin dato | | NO VERIFICADO: no hay tarifa leída | Cotización de agente o transitario | propuesta en la sección 4 |
| IVA de importación | 21 % habitual sobre valor + flete + derechos | | NO VERIFICADO; recuperable solo con alta y derecho a deducción (secundario) | Gestoría. Afecta a la caja, no al margen, si es deducible | fuera del script |
| Retraso de cobro de TikTok | 14 días | | SUPUESTO | Ver Seller Center | `escalado.py --retraso-cobro-dias` |
| Capacidad del proveedor | 40 pedidos/día | | SUPUESTO | Confirmación por escrito del proveedor | `escalado.py --capacidad-dia` |
| Stop-loss por producto en piloto | 150 € | | REGLA (`proceso.md` §4, `riesgos.md`). No vigente hoy: no hay producto en piloto | Reconfirmar con la respuesta de la persona sobre capital | | 

### Qué variante usó cada informe antiguo (para no comparar cifras con supuestos distintos)

| Informe | Comisión | Devoluciones | Afiliado | Nota |
|---|---|---|---|---|
| `tienda/trabajo/margenes/` (ronda previa a la 10) | no consta | 5 % (script por defecto) | 0 y 0,15 | Devoluciones demasiado optimistas; no usar |
| `ronda-11/margenes/calculador-escenarios.md` | 9 % y 4 % | 10 % y 15 % (tablas con ambas) | 0 y 0,15 | Con afiliado 0, "4 % y dev. 15 %" = "9 % y dev. 10 %" (coincidencia aritmética). Escalado con 9 %, dev. 15 % |
| `ronda-12/escalado/modelos-y-escalas.md` y `decision-ceo.md` | 9 % base, 4 % bonus | 15 % | 0 y 15 % | Corregido por calidad en 4 puntos |
| `ronda-13/proveedores/pod-textil-ue.md` y `dropshipping-ue.md` | 9 % (declarado en los informes que lo citan) | 10 % | 0 | Optimista frente a la ronda 12: a PVP 34,90 € y coste 12,50 € el beneficio pasa de 8,83 € (15 %) a 10,27 € (10 %), ambos con envío 0 y comisión 9 % |
| `cerebro/estado.md` | "4 %/5 %/9 %" | "0,10 (ronda 13) frente a 0,15 (ronda 12)" | | El 5 % queda sin fuente; ver arriba |

**Regla de uso:** todo informe nuevo declara en su primera línea "Supuestos: tabla única, comisión X, devoluciones Y, afiliado Z, CPA W". Si cambia uno, lo dice y no compara con cifras de otra variante. Caso base obligatorio: comisión 9 %, devoluciones 15 %, afiliado 0, CPA 8 €. Las sensibilidades (4 %, 10 %, 15 % afiliado, CPA 5/12) van aparte.

### Sensibilidad de referencia (ejecutada hoy con `margen_es.py`; envío 0, producto ilustrativo PVP 24,90 €, coste 7,09 €, el B1 de la ronda 11)

| Comisión | Devoluciones | Afiliado 0 | Afiliado 15 % |
|---|---|---|---|
| 9 % | 15 % | 8,04 € (39,1 %) | 5,42 € (26,3 %) |
| 9 % | 10 % | 9,07 € (44,1 %) | 6,29 € (30,6 %) |
| 4 % | 15 % | 9,07 € (44,1 %) | 6,45 € (31,3 %) |
| 4 % | 10 % | 10,10 € (49,1 %) | 7,32 € (35,6 %) |

Con el caso base, `escalado.py` (500 €, CPA 8 €) da +2 €/mes con comisión 9 % y +67 € con 4 %: el margen de seguridad es 0 %, no se escala. Es un producto de ejemplo sin proveedor homologado; no es una recomendación de compra.

## 2. Tope de gasto de 30 € de la ruta "demanda primero"

Origen del 30 €: juicio del CEO por analogía con el tope orgánico de `backlog.md` (`decision-ceo.md` §4); lo confirma o no `cfo-finanzas` y, sobre todo, la persona. **Estado: PENDIENTE de que la persona responda las preguntas 1 y 2 de `estado.md`** (capital real que podría perder en 90 días y qué son los "500 €/mes"). No supongo ninguna de las dos respuestas. Hasta entonces 30 € es un techo de ejecución, no una asignación de presupuesto.

### 2.1 Desglose por prueba (propuesta mía, ventana 27/10-26/11/2026)

| Prueba | Ventana | Gasto previsto | Techo | Qué entra | Qué no entra |
|---|---|---|---|---|---|
| Preventa / lista de espera (1 maqueta etiquetada IA) | 14 días tras publicar | 0 € si las herramientas son gratuitas | 20 € | Herramienta de formulario o landing de pago, si la gratuita no basta; dominio o extra mínimo. Precios de herramientas: NO VERIFICADO | Stock, muestras, anuncios, cualquier compra de producto |
| B2B (15 mensajes a clubes y tiendas) | 7 días | 0 € | 0 € | Mensajes y maquetas digitales | Impresión o envío de muestras físicas (no se compran muestras) |
| Curación / afiliación | 21 días | 0 € | 0 € | Vídeos IA propios con música de la biblioteca comercial | Productos de curación comprados, anuncios, pagos a creadores |
| Reserva común | 30 días | 0 € | 10 € | Imprevisto de una de las tres pruebas, aprobado antes de gastarlo | Alta fiscal, gestoría, anuncios |
| **Total** | | **0 € previsto** | **30 €** | | |

El techo de la preventa (20 €) y la reserva (10 €) son mías; el CEO fijó 30 € global y "preventa <= 30 €". Si la persona prefiere otro reparto, no cambia el total.

### 2.2 Qué entra y qué no entra en los 30 €

- Entra: herramientas, formularios y extras necesarios para las tres pruebas, con factura o recibo anotado en el estado de cuentas (sección 5).
- No entra, y es decisión aparte de la persona: **alta de autónomo** (tarifa plana ~88,64 €/mes según blogs, NO VERIFICADO, a comprobar en Seguridad Social) y **gestoría** (sin presupuesto; no encontrada). Tampoco entran anuncios (el mes 1 es sin anuncios), stock, muestras ni el stop-loss de 150 € por producto (ese aplica solo en piloto de producto).
- Los cobros de reservas, si se llegan a hacer, son pasivo (dinero que se devolvería), no ingreso, hasta entregar. Solo se cobra con el alta hecha; antes, lista de espera sin pago. Comisiones de pasarela sobre reservas: NO VERIFICADO, se anotan aparte y se vigilan.
- Consecuencia a decir con claridad: el coste fiscal fijo del mes (alta, y gestoría si se contrata) puede superar los 30 € de las pruebas. El tope de pruebas no dice nada sobre si esos costes caben en el capital de la persona.

### 2.3 Condiciones de parada con cifras (de `decision-ceo.md` §4, más las financieras)

| Condición | Cifra | Acción |
|---|---|---|
| Sin respuesta de la persona el 02/11/2026 | 0 respuestas | PAUSAR todo |
| Gasto acumulado | >= 24 € (80 %) | Aviso al director; cada euro nuevo con visto bueno |
| Gasto acumulado | > 30 € sin nueva respuesta de la persona | PARAR |
| B2B | < 2 respuestas de 15 contactos | Un ajuste a otros 15; si repite, cerrar B2B |
| Preventa | < 10 reservas pagadas (o < 40 con depósito simbólico) a >= 25 € en 14 días | Un ajuste de diseño o precio; si repite, cerrar el producto y no comprar stock |
| Curación / afiliación | 0 ventas atribuidas y 0 vídeos > 5.000 vistas en 21 días | PARAR |
| Horas de la persona | < 3 h/semana | PAUSAR |
| Marca ajena, estilo del juego o claim no demostrable en un vídeo | 1 caso | Retirar el vídeo |
| Puerta M1 (09/11) | < 3 fichas con PVP >= 25 € y >= 500 ventas, o Seller Center no admite stock propio con plazo viable | Archivar marca propia como canal consumidor |
| Puerta M2 (26/11) | condiciones a-f de `decision-ceo.md` §4 | Sin ellas, ningún gasto > 30 € |

### 2.4 Qué cambia según lo que responda la persona (sin suponer ninguna)

| Si "500 €/mes" es... | Efecto en el tope |
|---|---|
| A) Tope de anuncios al mes | Mes 1 sin anuncios; el 30 € sigue y no consume ese tope. Subir presupuesto exige M2 |
| B) Gasto total mensual | Alta fiscal y gestoría compiten con los 500 €; ver si caben |
| C) Beneficio mensual deseado | Meta, no capital; hay que preguntar de nuevo por capital |
| D) Capital total de riesgo de 90 días | Los 30 € quedan dentro; los 500 € cubren pruebas + alta + gestoría + 1 lote pequeño tras M2 |

Para el capital real de 90 días (pregunta 1): con < 100 € solo caben las pruebas y la alta se decide con la gestoría; con 100-500 €, pruebas más fiscales; no hay lote de stock ni anuncios sin M2. Cantidades a definir por la persona.

## 3. (Escalones de anuncios, para cuando exista producto)

`proceso.md`: etapas 500 → 1.000 → 2.000 → 5.000 €/mes, solo tras la puerta 3 (>= 30 pedidos con CPA medido, CPA real <= 70 % del de equilibrio 7 días, `escalado.py` en verde, caja >= capital atrapado + 1 semana de anuncios). Hoy: 0 pedidos, 0 escalones, 0 € de anuncios.

## 4. Propuesta (solo texto, sin tocar el script) de `--derechos-importacion` y `--flete-importacion` para `margen_es.py`

Motivo: aprendizajes 25 y `decision-ceo.md` §4 (c): todo margen con origen China o importación es optimista hasta incluir derechos y flete. Hoy se mete a mano sumándolo a `--coste`; funciona pero no queda trazado.

**Qué recibe.** Dos opciones nuevas, en euros por unidad vendida, sin IVA, por defecto 0,0:
- `--derechos-importacion`: derechos de aduana por unidad. El derecho fijo transitorio de 3 € (NO VERIFICADO) es por envío y línea arancelaria; con lotes se prorratea: 3 € ÷ unidades del envío. La persona o la gestoría calculan el prorrateo; el script no lo adivina.
- `--flete-importacion`: transporte internacional por unidad hasta España (cotización de agente o transitario).
- Rechazar valores negativos con el mismo mensaje de error y código de salida 2 que usa hoy el script.

**Qué suma.** Ambos se añaden al diccionario `costes` como `derechos_importacion` y `flete_importacion`, por unidad y sin multiplicar por las devoluciones (el producto devuelto ya se trata como perdido). Entran también en el cálculo de `pvp_minimo_para_margen`, en `cpa_maximo_para_no_perder` y en el veredicto. En `escalado.py`, pasarlos a `unit()` y sumarlos al coste en el cálculo de capital atrapado, porque son dinero pagado antes de cobrar. El IVA de importación no se suma al margen (si es deducible no es coste); se trata en la caja y lo confirma la gestoría. El JSON de salida añade las dos claves y un aviso cuando alguna sea 0 en un producto de origen no UE: "derechos y flete no incluidos".

**Cómo se prueba.**
1. Regresión: sin las opciones nuevas, el JSON de salida es idéntico al actual (comparar byte a byte los casos de las rondas 11 a 13).
2. Equivalencia: `--coste X --derechos-importacion D --flete-importacion F` debe dar lo mismo que `--coste X+D+F`. Ejecutado hoy con el script actual como referencia (PVP 24,90 €, comisión 9 %, dev. 15 %, afiliado 0, envío 0): coste 7,09 € → 8,04 € (39,1 %, GO); coste 10,09 € (7,09 + 3 € de derecho) → 5,04 € (24,5 %, HOLD, PVP mínimo para 25 % de margen 25,20 €); coste 11,59 € (con 1,50 € de flete **ilustrativo, no un dato**) → 3,54 € (17,2 %, HOLD). Con el derecho de 3 € solo, `escalado.py` da CPA de equilibrio 5,04 € con comisión 9 % y 6,07 € con 4 %: con CPA base de 8 € pierde dinero en ambos casos.
3. Casos límite: valores 0, valores negativos (error), `--derechos-importacion` con producto cuyo origen es UE (queda en 0, sin aviso).
4. Quién lo hace: el `director` lanza a un agente de código con aprobación del CEO y la persona; yo no lo modifico (visto bueno pendiente, `decision-ceo.md` §8).

## 5. Plantilla de "estado de cuentas" de 5 líneas (rellenar con datos reales; una fila por movimiento)

Copiar a `cerebro/kpis.md` (sección financiera) y actualizar cada vez que haya un gasto o un cobro. Marcar cada cifra como MEDIDO (con recibo) o SUPUESTO.

| Línea | Qué se anota | Valor (€) | Tipo | Fecha y recibo |
|---|---|---|---|---|
| 1. Gastado en pruebas (dentro del tope de 30 €) | Suma de recibos de preventa, B2B, curación y reserva común | 0 | MEDIDO | |
| 2. Tope restante | 30 € menos la línea 1 | 30 | calculado | |
| 3. Gastos fuera del tope | Alta de autónomo, gestoría, IVA/tasas, cualquier otro (detallar) | 0 | MEDIDO | |
| 4. Cobrado y reservas pendientes de devolver | Reservas cobradas, reembolsos; B2B con anticipo | 0 | MEDIDO | |
| 5. Caja neta del proyecto | Línea 4 menos líneas 1 y 3, y menos reservas por devolver | 0 | calculado | |

Para cuando haya pedidos, añadir en `kpis.md` las líneas de ingresos, comisión, coste de producto, devoluciones, anuncios y beneficio, con los mismos supuestos de la tabla 1.

## 6. Pendientes que no son míos pero tocan el dinero (sin asesoramiento fiscal)

- **Alta fiscal (autónomo):** sin empezar. Sin ella no se cobra una reserva, no se factura a un club (B2B) ni se registra IVA. Preguntar a la gestoría: fecha de alta recomendada antes del primer cobro, qué epígrafe corresponde a la actividad, y si la tarifa plana aplica y por cuánto tiempo.
- **IVA:** qué tipo aplica a cada tipo de producto, cómo se declara el IVA de las ventas de TikTok Shop, si se puede deducir el IVA de importación y cómo se hace en la declaración periódica.
- **Importación:** si hace falta EORI e IOSS, y cómo se aplica el derecho de 3 € de julio 2026 (es NO VERIFICADO).
- **Gestoría:** presupuesto mensual, qué incluye, y si lleva las facturas de un negocio sin ventas aún.
- **Preventa:** si el cobro anticipado y el desistimiento tienen obligaciones concretas (lo revisa `revisor-normativa-ue`, no verificado).

## 7. Alertas y recomendación de gasto

- Recomendación: gasto previsto 0 €; techo 30 €; ningún euro en anuncios ni stock. Sin dato medido no se puede hacer más.
- Alerta 1: si el derecho de 3 € por envío se confirma, el producto de ejemplo cae de GO a HOLD y deja de ganar dinero con CPA 8 €.
- Alerta 2: informes con supuestos distintos (comisión 4/5/9 %, devoluciones 10/15 %) no son comparables; hasta que se use la tabla 1, las cifras de la ronda 13 con devoluciones 0,10 son optimistas frente a la regla del proceso (0,15).
- Alerta 3: el coste fiscal (alta + gestoría) puede ser mayor que todo el gasto de las pruebas y no tiene tope definido.
- Alerta 4: dos preguntas de la persona sin responder (capital y significado de 500 €/mes). Sin ellas el tope es provisional.

## Datos clave

| Producto | ID/URL | Coste € | PVP € (probado o propuesto) | Fuente del precio de mercado y fecha | Verificado (listado/ficha/persona) | Margen/pedido y supuestos | Veredicto |
|---|---|---|---|---|---|---|---|
| Ilustrativo B1 (ronda 11, no recomendado) | no aplica | 7,09 (dato del director, ronda 11) | 24,90 (propuesto) | sin ancla en TikTok Shop ES | No | 8,04 € con comisión 9 %, dev. 15 %, afiliado 0, envío 0 (`margen_es.py`, 29/10/2026); 5,04 € si se suma el derecho de 3 € | Sin GO: no hay proveedor homologado |
| Ilustrativo POD (ronda 12) | no aplica | 12,50 | 34,90 (propuesto) | sin ancla | No | 8,83 € (dev. 15 %) y 10,27 € (dev. 10 %), envío 0, comisión 9 %, afiliado 0 | CERRADO como motor de anuncios |

- **Qué sabemos** (con fuente y fecha): los cálculos de las tablas 1 y 4 (ejecutados hoy con los scripts); que el tope de 30 € y las condiciones de parada son decisión del CEO del 27/10/2026 (`decision-ceo.md`); que el stop-loss de 150 € y las puertas son de `proceso.md`.
- **Qué asumimos** (y cómo se comprobaría): comisión 9 %/4 % (Seller Center), devoluciones y afiliado (piloto o programa de creadores), CPA 5/8/12 (anuncios), derecho de 3 € y flete (gestoría o transitario), tarifa de autónomo y gestoría (Seguridad Social y presupuestos), techos de 20 € y 10 € de mi reparto (decisión de la persona).
- **Qué cambiaría mi conclusión:** que la persona defina "500 €/mes" y su capital de riesgo; que Seller Center muestre una comisión distinta; que el derecho de 3 € no se aplique o se prorratee distinto; que el alta fiscal se haga o se descarte.
