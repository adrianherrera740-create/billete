# Modelos de negocio y escalas: viabilidad A / B / C / D (ronda 12)

Fecha: 2026-10-27. Autor: analista-escalado. Herramientas: `margen_es.py` (beneficio por pedido), `escalado.py` (contraste de veredicto y fórmula de capital atrapado) y un driver que importa ambas (`/tmp/claude-0/-home-user-billete/40847db3-03d2-51f9-a366-557bc974ff91/scratchpad/driver.py`; guardado como `modelos-y-escalas.driver.py` junto a este informe). No hay ningún cálculo a mano salvo la regla de decisión (CPA = 70 % del equilibrio).

**AVISO: casi todo lo de abajo es SUPUESTO.** No hay un solo dato medido de TikTok Shop ES, ni proveedor, ni precio de mercado verificado para estos modelos. Los PVP, costes, MOQ, tarifas de 3PL, devoluciones, cuotas fijas y capacidades son rangos razonables de partida que hay que sustituir por datos reales (sección final). Sirve para comparar la ESTRUCTURA de cada modelo, no para prometer euros.

## 1. Supuestos explícitos (todos "supuesto", ninguno verificado)

| Concepto | A Dropshipping stock UE | B Marca propia, stock en 3PL España | C POD UE | D Digital / afiliación |
|---|---|---|---|---|
| Qué se asume que se vende | objeto útil/gadget sin marca, proveedor UE | producto genérico con marca propia (gamer/coche/streetwear), importado a granel, sin salud/batería/juguete | camiseta o sudadera estampada con diseño propio original (sin marcas) | pack de plantillas/recursos descargable para el nicho (precio de ejemplo) |
| PVP con IVA pes / base / opt | 19,90 / 24,90 / 29,90 | 34,90 / 39,90 / 49,90 | 24,90 / 29,90 / 34,90 | 9,90 / 19,00 / 29,00 |
| Coste producto sin IVA | 9,50 / 8,00 / 7,00 | 11,00 / 9,00 / 8,00 (puesto en almacén) | 14,00 / 12,50 / 11,50 | 0,50 (herramientas) |
| Envío al cliente sin IVA | 4,50 / 3,90 / 3,50 | 5,00 / 4,50 / 4,20 (3PL + transportista) | 4,50 / 4,00 / 3,80 | 0 |
| Embalaje | 0,30 | 0,80 (con marca) | 0 (incluido) | 0 |
| Devoluciones | 20 / 15 / 10 % | 18 / 12 / 10 % | 22 / 15 / 10 % (ropa: tallas) | 10 / 5 / 5 % |
| Comisión y cargos | TikTok 9 % + 1 % | TikTok 9 % + 1 % | TikTok 9 % + 1 % | 0 % TikTok + 6 % pagos/plataforma. Vender digital dentro de TikTok Shop: NO VERIFICADO (probablemente no permitido) |
| Plazo preparación (días lab.) | 2 | 1 | 3 (producción bajo demanda, supuesto) | 0 |
| Fijos €/mes (herramientas, gestoría, 3PL mínimo) | 100 | 250 | 100 | 60 |
| Inversión inicial única (alta, marca, EAN/etiquetado/CE si aplica, seguro, diseño) | 150 | 1.000 | 200 | 100 |
| Stock | 0 (se paga el pedido a proveedor) | lote mínimo (MOQ) 200 uds o 2 meses de ventas, lo que sea mayor | 0 | 0 |
| Capacidad del proveedor, pedidos/día | 40 (valor por defecto del script) | 150 | 60 | sin límite |

Supuestos comunes:
- Facturación = ventas con IVA al cliente (GMV). Pedidos = facturación / PVP base.
- **CPA de partida = 70 % del CPA de equilibrio del caso base** (regla de la puerta 3 de `proceso.md`), y se asume que TODOS los pedidos son de pago (caso conservador: cero orgánico). El CPA real es desconocido; en rondas previas se usó 5 / 8 / 12 € como escenarios, sin medir.
- Retraso de cobro de TikTok 14 días (supuesto de `escalado.py`). Caja = stock + capital atrapado + 1 semana de anuncios + 1 mes de fijos + inversión inicial (criterio puerta 3).
- Creativos ganadores necesarios = pedidos/día / 8 (8 pedidos/día por creativo ganador: supuesto sin base, solo para ordenar magnitudes).
- Las etapas se alcanzan reinvirtiendo; cada celda dice si el capital inicial financia esa etapa desde el principio. Con reinversión de beneficios se llega antes a etapas altas con capital pequeño, pero más despacio.
- Saturación: supuesto de que un solo producto en un nicho estrecho empieza a notar fatiga de público hacia 30-50 pedidos/día. NO VERIFICADO.

## 2. Matriz resumen (36 celdas): ¿el capital financia la etapa desde el inicio?

Formato: `SÍ/NO · caja necesaria en €` (SÍ = la caja cabe en el capital y el caso base gana dinero tras anuncios al CPA de partida).

| Modelo | Capital | Etapa 1.000 | Etapa 5.000 | Etapa 20.000 |
|---|---|---|---|---|
| A | 500 € | SÍ · caja 490 | NO · caja 1,452 | NO · caja 5,057 |
| A | 2,000 € | SÍ · caja 490 | SÍ · caja 1,452 | NO · caja 5,057 |
| A | 5,000 € | SÍ · caja 490 | SÍ · caja 1,452 | NO · caja 5,057 |
| B | 500 € | NO · caja 3,157 | NO · caja 4,038 | NO · caja 12,404 |
| B | 2,000 € | NO · caja 3,157 | NO · caja 4,038 | NO · caja 12,404 |
| B | 5,000 € | SÍ · caja 3,157 | SÍ · caja 4,038 | NO · caja 12,404 |
| C | 500 € | NO · caja 565 | NO · caja 1,627 | NO · caja 5,607 |
| C | 2,000 € | SÍ · caja 565 | SÍ · caja 1,627 | NO · caja 5,607 |
| C | 5,000 € | SÍ · caja 565 | SÍ · caja 1,627 | NO · caja 5,607 |
| D | 500 € | SÍ · caja 288 | NO · caja 801 | NO · caja 2,724 |
| D | 2,000 € | SÍ · caja 288 | SÍ · caja 801 | NO · caja 2,724 |
| D | 5,000 € | SÍ · caja 288 | SÍ · caja 801 | SÍ · caja 2,724 |
## 2b. Detalle por modelo (salida de los scripts)

### Modelo A Dropshipping con stock UE

Economía por pedido (`margen_es.py`, PVP con IVA 21 %, costes sin IVA, comisión TikTok 9 %, otros 1 %):

| Caso | PVP € | Coste prod. € | Envío € | Embalaje € | Devol. | Beneficio/pedido sin anuncios € | Margen s/base | CPA equilibrio € | Veredicto script |
|---|---|---|---|---|---|---|---|---|---|
| pes | 19.90 | 9.50 | 4.50 | 0.30 | 20% | -3.69 | -22.4% | -3.69 | NO-GO Margen por debajo del 25%: no deja sitio para anuncios. |
| base | 24.90 | 8.00 | 3.90 | 0.30 | 15% | 2.65 | 12.9% | 2.65 | HOLD Margen por debajo del 25%: no deja sitio para anuncios. |
| opt | 29.90 | 7.00 | 3.50 | 0.30 | 10% | 8.62 | 34.9% | 8.62 | GO  |

CPA de partida del modelo = 70 % del CPA de equilibrio base (regla de la puerta 3) = **1.85 €**. Contraste con `escalado.py` (coste equivalente 12.48 € para reproducir esta estructura de costes): beneficio/pedido al 9 % = 2.65 € frente a 2.65 € de `margen_es.py` (coincide). Veredicto de `escalado.py` con CPA 1.85 €, capacidad 40 pedidos/día y fijos 100 €/mes: _AGUANTAR en 500 €/mes y optimizar creativo y coste antes de escalar._

Etapas (facturación = ventas con IVA al cliente; TODOS los pedidos pagados con anuncios al CPA de partida, caso conservador; contribución mensual = pedidos × (beneficio/pedido − CPA) − fijos 100 €):

| Etapa €/mes | Pedidos/mes (base) | Pedidos/día | Anuncios €/mes | Contribución/mes pes / base / opt € | Pedidos/mes para cubrir fijos | Creativos ganadores (supuesto 8 pedidos/día c/u) | Capacidad proveedor |
|---|---|---|---|---|---|---|---|
| 1,000 | 40 | 1.3 | 74 | -378 / -68 / +126 | 125 | 1 | OK (40/día supuesto) |
| 5,000 | 201 | 6.7 | 371 | -1492 / +61 / +1032 | 125 | 1 | OK (40/día supuesto) |
| 20,000 | 803 | 26.8 | 1486 | -5668 / +543 / +4428 | 125 | 4 | OK (40/día supuesto) |

Caja necesaria = stock + capital atrapado (fórmula de `escalado.py`: pedidos/día × coste × 14 días de retraso de cobro) + 1 semana de anuncios + 1 mes de fijos + inversión inicial única (150 €, supuesto):

| Etapa €/mes | Inversión en stock € | Capital atrapado € | Caja necesaria € | Ticket medio € | Cabe con 500 € | Cabe con 2.000 € | Cabe con 5.000 € |
|---|---|---|---|---|---|---|---|
| 1,000 | 0 | 223 | 490 | 24.90 | SÍ | SÍ | SÍ |
| 5,000 | 0 | 1,115 | 1,452 | 24.90 | NO (faltan 952) | SÍ | SÍ |
| 20,000 | 0 | 4,461 | 5,057 | 24.90 | NO (faltan 4,557) | NO (faltan 3,057) | NO (faltan 57) |


### Modelo B Marca propia, stock en 3PL España

Economía por pedido (`margen_es.py`, PVP con IVA 21 %, costes sin IVA, comisión TikTok 9 %, otros 1 %):

| Caso | PVP € | Coste prod. € | Envío € | Embalaje € | Devol. | Beneficio/pedido sin anuncios € | Margen s/base | CPA equilibrio € | Veredicto script |
|---|---|---|---|---|---|---|---|---|---|
| pes | 34.90 | 11.00 | 5.00 | 0.80 | 18% | 3.07 | 10.6% | 3.07 | HOLD Margen por debajo del 25%: no deja sitio para anuncios. |
| base | 39.90 | 9.00 | 4.50 | 0.80 | 12% | 10.88 | 33.0% | 10.88 | GO  |
| opt | 49.90 | 8.00 | 4.20 | 0.80 | 10% | 19.57 | 47.5% | 19.57 | GO  |

CPA de partida del modelo = 70 % del CPA de equilibrio base (regla de la puerta 3) = **7.62 €**. Contraste con `escalado.py` (coste equivalente 14.54 € para reproducir esta estructura de costes): beneficio/pedido al 9 % = 10.88 € frente a 10.88 € de `margen_es.py` (coincide). Veredicto de `escalado.py` con CPA 7.62 €, capacidad 150 pedidos/día y fijos 250 €/mes: _AGUANTAR en 500 €/mes y optimizar creativo y coste antes de escalar._

Etapas (facturación = ventas con IVA al cliente; TODOS los pedidos pagados con anuncios al CPA de partida, caso conservador; contribución mensual = pedidos × (beneficio/pedido − CPA) − fijos 250 €):

| Etapa €/mes | Pedidos/mes (base) | Pedidos/día | Anuncios €/mes | Contribución/mes pes / base / opt € | Pedidos/mes para cubrir fijos | Creativos ganadores (supuesto 8 pedidos/día c/u) | Capacidad proveedor |
|---|---|---|---|---|---|---|---|
| 1,000 | 25 | 0.8 | 191 | -380 / -168 / -11 | 77 | 1 | OK (150/día supuesto) |
| 5,000 | 125 | 4.2 | 955 | -902 / +159 / +947 | 77 | 1 | OK (150/día supuesto) |
| 20,000 | 501 | 16.7 | 3820 | -2857 / +1384 / +4540 | 77 | 3 | OK (150/día supuesto) |

Caja necesaria = stock + capital atrapado (fórmula de `escalado.py`: pedidos/día × coste × 14 días de retraso de cobro) + 1 semana de anuncios + 1 mes de fijos + inversión inicial única (1000 €, supuesto):

| Etapa €/mes | Inversión en stock € | Capital atrapado € | Caja necesaria € | Ticket medio € | Cabe con 500 € | Cabe con 2.000 € | Cabe con 5.000 € |
|---|---|---|---|---|---|---|---|
| 1,000 | 1,800 | 62 | 3,157 | 39.90 | NO (faltan 2,657) | NO (faltan 1,157) | SÍ |
| 5,000 | 2,256 | 310 | 4,038 | 39.90 | NO (faltan 3,538) | NO (faltan 2,038) | SÍ |
| 20,000 | 9,023 | 1,240 | 12,404 | 39.90 | NO (faltan 11,904) | NO (faltan 10,404) | NO (faltan 7,404) |


### Modelo C Print-on-demand UE

Economía por pedido (`margen_es.py`, PVP con IVA 21 %, costes sin IVA, comisión TikTok 9 %, otros 1 %):

| Caso | PVP € | Coste prod. € | Envío € | Embalaje € | Devol. | Beneficio/pedido sin anuncios € | Margen s/base | CPA equilibrio € | Veredicto script |
|---|---|---|---|---|---|---|---|---|---|
| pes | 24.90 | 14.00 | 4.50 | 0.00 | 22% | -5.50 | -26.7% | -5.50 | NO-GO NO CUMPLE: TikTok Shop UE exige entregar al transportista en 2 días laborables.; Margen por debajo del 25%: no deja sitio para anuncios. |
| base | 29.90 | 12.50 | 4.00 | 0.00 | 15% | 1.43 | 5.8% | 1.43 | NO-GO NO CUMPLE: TikTok Shop UE exige entregar al transportista en 2 días laborables.; Margen por debajo del 25%: no deja sitio para anuncios. |
| opt | 34.90 | 11.50 | 3.80 | 0.00 | 10% | 7.39 | 25.6% | 7.39 | NO-GO NO CUMPLE: TikTok Shop UE exige entregar al transportista en 2 días laborables. |

CPA de partida del modelo = 70 % del CPA de equilibrio base (regla de la puerta 3) = **1.00 €**. Contraste con `escalado.py` (coste equivalente 16.80 € para reproducir esta estructura de costes): beneficio/pedido al 9 % = 1.43 € frente a 1.43 € de `margen_es.py` (coincide). Veredicto de `escalado.py` con CPA 1.00 €, capacidad 60 pedidos/día y fijos 100 €/mes: _AGUANTAR en 500 €/mes y optimizar creativo y coste antes de escalar._

Etapas (facturación = ventas con IVA al cliente; TODOS los pedidos pagados con anuncios al CPA de partida, caso conservador; contribución mensual = pedidos × (beneficio/pedido − CPA) − fijos 100 €):

| Etapa €/mes | Pedidos/mes (base) | Pedidos/día | Anuncios €/mes | Contribución/mes pes / base / opt € | Pedidos/mes para cubrir fijos | Creativos ganadores (supuesto 8 pedidos/día c/u) | Capacidad proveedor |
|---|---|---|---|---|---|---|---|
| 1,000 | 33 | 1.1 | 33 | -361 / -86 / +83 | 233 | 1 | OK (60/día supuesto) |
| 5,000 | 167 | 5.6 | 167 | -1405 / -28 / +815 | 233 | 1 | OK (60/día supuesto) |
| 20,000 | 669 | 22.3 | 669 | -5321 / +188 / +3562 | 233 | 3 | OK (60/día supuesto) |

Caja necesaria = stock + capital atrapado (fórmula de `escalado.py`: pedidos/día × coste × 14 días de retraso de cobro) + 1 semana de anuncios + 1 mes de fijos + inversión inicial única (200 €, supuesto):

| Etapa €/mes | Inversión en stock € | Capital atrapado € | Caja necesaria € | Ticket medio € | Cabe con 500 € | Cabe con 2.000 € | Cabe con 5.000 € |
|---|---|---|---|---|---|---|---|
| 1,000 | 0 | 258 | 565 | 29.90 | NO (faltan 65) | SÍ | SÍ |
| 5,000 | 0 | 1,288 | 1,627 | 29.90 | NO (faltan 1,127) | SÍ | SÍ |
| 20,000 | 0 | 5,151 | 5,607 | 29.90 | NO (faltan 5,107) | NO (faltan 3,607) | NO (faltan 607) |


### Modelo D Producto digital (web propia)

Economía por pedido (`margen_es.py`, PVP con IVA 21 %, costes sin IVA, comisión TikTok 0 %, otros 6 %):

| Caso | PVP € | Coste prod. € | Envío € | Embalaje € | Devol. | Beneficio/pedido sin anuncios € | Margen s/base | CPA equilibrio € | Veredicto script |
|---|---|---|---|---|---|---|---|---|---|
| pes | 9.90 | 0.50 | 0.00 | 0.00 | 10% | 6.37 | 77.9% | 6.37 | GO  |
| base | 19.00 | 0.50 | 0.00 | 0.00 | 5% | 13.48 | 85.8% | 13.48 | GO  |
| opt | 29.00 | 0.50 | 0.00 | 0.00 | 5% | 20.83 | 86.9% | 20.83 | GO  |

CPA de partida del modelo = 70 % del CPA de equilibrio base (regla de la puerta 3) = **9.44 €**. Contraste con `escalado.py` (coste equivalente -0.43 € para reproducir esta estructura de costes): beneficio/pedido al 9 % = 13.48 € frente a 13.48 € de `margen_es.py` (coincide). Veredicto de `escalado.py` con CPA 9.44 €, capacidad 9999 pedidos/día y fijos 60 €/mes: _AGUANTAR en 500 €/mes y optimizar creativo y coste antes de escalar._

Etapas (facturación = ventas con IVA al cliente; TODOS los pedidos pagados con anuncios al CPA de partida, caso conservador; contribución mensual = pedidos × (beneficio/pedido − CPA) − fijos 60 €):

| Etapa €/mes | Pedidos/mes (base) | Pedidos/día | Anuncios €/mes | Contribución/mes pes / base / opt € | Pedidos/mes para cubrir fijos | Creativos ganadores (supuesto 8 pedidos/día c/u) | Capacidad proveedor |
|---|---|---|---|---|---|---|---|
| 1,000 | 53 | 1.8 | 497 | -370 / +153 / +333 | 15 | 1 | OK (9999/día supuesto) |
| 5,000 | 263 | 8.8 | 2484 | -1611 / +1003 / +1904 | 15 | 2 | OK (9999/día supuesto) |
| 20,000 | 1053 | 35.1 | 9937 | -6262 / +4193 / +7795 | 15 | 5 | OK (9999/día supuesto) |

Caja necesaria = stock + capital atrapado (fórmula de `escalado.py`: pedidos/día × coste × 14 días de retraso de cobro) + 1 semana de anuncios + 1 mes de fijos + inversión inicial única (100 €, supuesto):

| Etapa €/mes | Inversión en stock € | Capital atrapado € | Caja necesaria € | Ticket medio € | Cabe con 500 € | Cabe con 2.000 € | Cabe con 5.000 € |
|---|---|---|---|---|---|---|---|
| 1,000 | 0 | 12 | 288 | 19.00 | SÍ | SÍ | SÍ |
| 5,000 | 0 | 61 | 801 | 19.00 | NO (faltan 301) | SÍ | SÍ |
| 20,000 | 0 | 246 | 2,724 | 19.00 | NO (faltan 2,224) | NO (faltan 724) | SÍ |

## 3. Lectura por modelo, con cuellos de botella y punto de parada por etapa

Punto de parada común (reglas de `proceso.md` §4, adaptadas al capital): cerrar el producto si la pérdida acumulada supera el 30 % del capital de ese escenario (150 € con 500; 600 € con 2.000; 1.500 € con 5.000); parar anuncios si CPA real > CPA de equilibrio 7 días seguidos con 3 variantes de creativo; pausar si devoluciones > 20 % o entregas a tiempo < 80 %. Volver un escalón atrás si el CPA real supera el equilibrio 3 días seguidos.

| Modelo | Etapa 1.000 €/mes | Etapa 5.000 €/mes | Etapa 20.000 €/mes |
|---|---|---|---|
| A Dropshipping UE | Cuello: **margen**. Equilibrio 2,65 € (a 4 % comisión: 3,68 €); con CPA 5/8/12 € pierde 2,35 / 5,35 / 9,35 € por pedido. Plataforma: plazo de 2 días justo. Parada: CPA real > 2,65 €. | Cuello: margen y creativos (1 ganador). Caja 1.452 € (falta con 500). Solo gana si el CPA real es < 2,65 €, o sea casi solo con tráfico orgánico o PVP más alto. | Cuello: **caja (5.057 €)**, 4 creativos ganadores, saturación a ~27 pedidos/día en un solo producto, proveedor (40/día supuesto). Contribución base +543 €/mes: no compensa el riesgo. |
| B Marca propia + 3PL | Cuello: **caja inicial** (stock mínimo 1.800 € + 1.000 € de inversión inicial): no cabe con 500 ni 2.000 €. Contribución base -168 €/mes por los fijos (necesita 77 pedidos/mes). Parada: stock sin rotar tras 60 días. | Cuello: caja 4.038 € (solo con 5.000 €), margen sensible al CPA (a CPA 8 € gana 2,88 €/pedido; a 12 € pierde). Contribución base +159 €/mes. | Cuello: **caja 12.404 €** (stock 9.023 €), 3 creativos ganadores, proveedor/lead time (reponer a tiempo evita rotura). Contribución base +1.384 €/mes (rango -2.857 a +4.540). |
| C POD UE | Cuello: **plazo de 2 días** (el script da NO-GO con 3 días de preparación) y margen 5,8 %: equilibrio 1,43 €. Con 500 € faltan 65 € de caja. | Contribución base -28 €/mes: no gana con anuncios. Tallas = devoluciones altas. | Solo +188 €/mes en base; el éxito depende de que el POD cumpla 2 días (NO VERIFICADO). |
| D Digital | Cuello: **canal y confianza**, no capital. Equilibrio 13,48 € por venta; contribución base +153 €/mes. Plataforma: vender digital en TikTok Shop NO VERIFICADO; en web propia se pierde el tráfico nativo de TikTok Shop (hay que llevar al cliente fuera). | Caja 801 € (falta con 500). Necesita 2 creativos ganadores. Contribución base +1.003 €/mes. | Caja 2.724 € (cabe con 5.000). 5 creativos ganadores; saturación de nicho y fatiga del producto digital (se copia/piratea). Contribución base +4.193 €/mes, pero con conversión de web (no medida) distinta al CPA supuesto. |

Sensibilidades calculadas con `margen_es.py`:
- Comisión TikTok 4 % (primeros 60 días, a verificar en Seller Center): A 3,68 €, B 12,53 €, C 2,67 €, D sin cambio (13,48 €, no usa comisión TikTok).
- B con creadores al 15 % de afiliado: beneficio/pedido sin anuncios baja de 10,88 a 6,53 €. A con afiliado 15 %: 0,03 € (no funciona). D con afiliados al 20 %: 10,49 €.
- B según MOQ: 100 uds = 900 € de stock; 200 uds = 1.800 €; 500 uds = 4.500 € (el MOQ real es dato por conseguir; con 100 uds, B cabría en 2.000 € en etapa 1.000).
- Afiliación (variante de D): con 5 % de comisión sobre una venta de 40 €, el ingreso es 2,00 €/venta (`margen_es.py` con 2,42 € con IVA, sin costes). Equilibrio de CPA 2,00 €: con anuncios de pago no se sostiene, solo con contenido orgánico. Tasa de comisión del programa: NO VERIFICADA.

### Contraste con `escalado.py`
Para cada modelo se pasó el coste equivalente a `escalado.py` y el beneficio por pedido coincidió con `margen_es.py` (los 4 casos dicen "coincide"). Veredictos del script con CPA de partida: los 4 dan AGUANTAR (A, B, C y D). El script no mira devoluciones por talla, MOQ ni 3PL: su veredicto es una verificación aritmética, no la decisión. El criterio de cada modelo (arriba) manda.

### Qué dicen los números (sin interpretar más de lo que hay)
- **A**: margen demasiado fino con comisión del 9 % y devoluciones del 15 %; con CPA realista (5-12 €) siempre pierde en el caso base. Coincide con el aprendizaje de rondas previas (ventosa +3,05 €/pedido sin anuncios, pierde con CPA 8 €; fuente: `cerebro/estado.md`, 2026-10-26).
- **B**: es el único modelo físico con CPA de equilibrio > 10 €, pero cuesta 3.000-4.000 € de caja para empezar en serio y pierde con CPA de 12 € o PVP bajo. Es un modelo de más de 2.000 €.
- **C**: el margen en ropa POD UE es el peor y choca con el plazo de 2 días. Descartable como motor principal salvo con diseño de PVP alto o POD más barato (a medir).
- **D**: mejor margen y menor caja, pero el techo lo marcan la conversión fuera de TikTok Shop y la facilidad de copia. Alta dependencia de un dato no verificado (¿se puede vender?).

## 4. Conclusión: relación crecimiento / riesgo para poco capital y proyecto grande

1. **Para empezar con 500 €: D (digital) como motor de aprendizaje y caja, no como proyecto final.** Es el único con caja necesaria < 500 € en la etapa 1.000 (288 €), margen alto (equilibrio 13,48 €) y cero stock. Riesgo: no verificado si se puede vender digital en el canal; techo limitado por el nicho y la copia. A y C no pasan: margen insuficiente.
2. **El modelo con mejor potencial de proyecto grande es B (marca propia con stock en 3PL España)**: único físico con margen real (33 % sobre base, equilibrio 10,88 €) y activo acumulable (marca, creativos, reseñas, recompra). Pero exige 3.000-4.000 € para una validación honesta y 12.000 € para 20.000 €/mes. No es viable con 500 € ni con 2.000 € con MOQ 200.
3. **Ruta recomendada (hipótesis, no decisión)**: D con 500 € durante 60 días para medir CPA y conversión y generar caja y audiencia; con 2.000 € añadir una validación de B con MOQ pequeño (100 uds, 900 €) de UN producto, con preventa si el canal lo permite; con 5.000 € ejecutar B directamente con 2 productos. A y C: no invertir. Punto de decisión: si el CPA real medido en D es > 70 % de su equilibrio (> 9,44 €), el problema es de canal/creativo y no de modelo, y B heredaría el mismo problema.
4. **Riesgo clave del conjunto**: ningún modelo tiene CPA medido. Si el CPA real de TikTok Shop ES para tickets de 25-40 € es de 8-12 € (escenarios previos), solo B base (margen de seguridad 26 % a CPA 8 €) y D (41 %) aguantan; A y C pierden siempre. Esto convierte la medición del CPA en el dato nº 1.

Veredicto de escalado por modelo (criterio `proceso.md` §5, con estos supuestos): A = PARAR como motor de anuncios (solo orgánico). B = AGUANTAR hasta tener capital ≥ 4.000 € y MOQ/precio de 3PL reales; ESCALAR solo con datos. C = PARAR. D = AGUANTAR con piloto barato (500 €) y comprobar canal. Ninguno es ESCALAR: faltan datos medidos.

## 5. Datos reales que harían falta para confirmarlo

1. CPA y ROAS reales en TikTok Shop ES con 2-3 creativos de un producto de 25-40 € (piloto orgánico + GMV Max mínimo): confirma o hunde A, B y C. Quién: la persona, con Seller Center.
2. Precio real de mercado en TikTok Shop ES (ancla) de 5 productos candidatos de B: confirma el PVP de 39,90 €. Quién: la persona (FastMoss falla, 429).
3. Presupuesto real de un proveedor de producto a granel: coste puesto en almacén, MOQ, plazo, muestra (3 ofertas). Confirma 9 € y MOQ 200.
4. Tarifa real de 3PL en España (mínimo mensual, alta, recepción, preparación por pedido, devoluciones) y transportista a 3-4 €: confirma 4,50 € de envío y 250 € de fijos.
5. Seller Center: comisión real (4 % o 9 %), si se admite stock en 3PL de terceros y proveedor UE, si admite productos digitales, política de devoluciones. Sin esto, D y A tienen un punto abierto.
6. Plazo real de producción y envío del proveedor POD UE (cumple 2 días laborables o no) y coste por prenda.
7. Alta fiscal y gestoría: coste real mensual (supuesto: 60-250 €) y si hay obligaciones por IVA intracomunitario (importación para B). NO VERIFICADO.
8. Tasa real de devoluciones por categoría (ropa/gadgets/digital).

Qué cambiaría esta conclusión: CPA real < 5 € (A y C pasan a viables); MOQ ≥ 500 uds o 3PL con mínimo > 400 €/mes (B deja de ser accesible); digital no permitido en el canal y conversión web < 1 % (D se cae); POD con producción de 1-2 días y coste < 10 € (C se rehabilita).

## Datos clave

| Producto | ID/URL | Coste € | PVP € (probado o propuesto) | Fuente del precio de mercado y fecha | Verificado (listado/ficha/persona) | Margen/pedido y supuestos | Veredicto |
|---|---|---|---|---|---|---|---|
| A dropshipping UE (genérico) | no aplica | 8,00 + envío 3,90 | 24,90 propuesto | no verificado | no verificado | 2,65 €/pedido sin anuncios (15 % devol., 9 % comisión); supuesto | PARAR como motor de anuncios |
| B marca propia + 3PL (genérico) | no aplica | 9,00 + envío 4,50 + embalaje 0,80 | 39,90 propuesto | no verificado | no verificado | 10,88 €/pedido sin anuncios (12 % devol.); MOQ 200 supuesto; supuesto | AGUANTAR hasta ≥ 4.000 € y datos |
| C POD UE (genérico) | no aplica | 12,50 + envío 4,00 | 29,90 propuesto | no verificado | no verificado | 1,43 €/pedido; plazo 3 días incumple; supuesto | PARAR |
| D digital/afiliación | no aplica | 0,50 | 19,00 propuesto | no verificado | no verificado | 13,48 €/pedido (6 % cargos); afiliación 2,00 €/venta; supuesto | AGUANTAR, piloto barato |

- **Qué sabemos** (con fuente y fecha): reglas de la plataforma de `CLAUDE.md` (comisión 9 %/4 % 60 días, 2 días laborables, 2026-10-27, a comprobar en Seller Center); el cálculo aritmético de `margen_es.py` y `escalado.py` (coinciden en los 4 modelos); ventosa B2: +3,05 €/pedido sin anuncios y pierde con CPA 8 € (`cerebro/estado.md`, 2026-10-26).
- **Qué asumimos** (y cómo se comprobaría): todos los PVP, costes, MOQ, fijos, devoluciones, capacidad, retraso de cobro de 14 días, 8 pedidos/día por creativo, saturación y que el CPA sea el 70 % del equilibrio; se comprueba con los 8 datos de la sección 5.
- **Qué cambiaría mi conclusión:** CPA real medido; MOQ y tarifa de 3PL reales; si el canal admite digital; plazo real del POD.

## Anexo: salida íntegra de `escalado.py` (caso base de cada modelo, con coste equivalente)

### Modelo A
```
# Escalado: PVP 24.90 € · coste 12.48 € · devoluciones 15% · afiliado 0%

Beneficio por pedido SIN anuncios: 3.68 € (comisión 4 %, primeros 60 días) · 2.65 € (comisión 9 %, después)
- Comisión 4 %: CPA de equilibrio 3.68 € · ROAS de equilibrio 6.77x · ROAS para ganar 3 €/pedido 36.62x
- Comisión 9 %: CPA de equilibrio 2.65 €; no hay margen para ganar 3 €/pedido con anuncios

## Resultado mensual con comisión 9 % (régimen normal)

| Presupuesto de anuncios | CPA | Pedidos/mes | Pedidos/día | Beneficio/mes tras anuncios y fijos | Capital atrapado |
|---|---|---|---|---|---|
| 500 € | 2 € | 270 | 9.0 | +116 € | 1574 € |
| 1000 € | 2 € | 541 | 18.0 | +332 € | 3148 € |
| 2000 € | 2 € | 1081 | 36.0 | +765 € | 6296 € |
| 5000 € | 2 € | 2703 | 90.1 ⚠ supera capacidad | +2062 € | 15741 € |

## Resultado mensual con comisión 4 % (primeros 60 días)

| Presupuesto de anuncios | CPA | Pedidos/mes | Pedidos/día | Beneficio/mes tras anuncios y fijos | Capital atrapado |
|---|---|---|---|---|---|
| 500 € | 2 € | 270 | 9.0 | +395 € | 1574 € |
| 1000 € | 2 € | 541 | 18.0 | +889 € | 3148 € |
| 2000 € | 2 € | 1081 | 36.0 | +1878 € | 6296 € |
| 5000 € | 2 € | 2703 | 90.1 ⚠ supera capacidad | +4846 € | 15741 € |

## Veredicto de escalado (caso base, comisión 9 %)

- CPA base 2 €: beneficio por pedido tras anuncios +0.80 € · margen de seguridad 30% (mínimo 30 %)
- [x] Beneficio positivo tras anuncios con comisión 9 %
- [x] Margen de seguridad ≥ 30 % sobre el CPA base
- [ ] Aguanta al menos 4 € de CPA por encima del base sin perder (CPA base + 4 < CPA de equilibrio)
- [ ] Capacidad del proveedor cubre 5.000 € de anuncios (90 pedidos/día frente a 40)

**Veredicto: AGUANTAR en 500 €/mes y optimizar creativo y coste antes de escalar.**

Supuestos sin medir: CPA, devoluciones, capacidad del proveedor, retraso de cobro de TikTok y que la comisión de 4 % se aplique. Medirlos en el piloto (ver cerebro/proceso.md, puerta 2) y volver a ejecutar este modelo con datos reales.
```

### Modelo B
```
# Escalado: PVP 39.90 € · coste 14.54 € · devoluciones 12% · afiliado 0%

Beneficio por pedido SIN anuncios: 12.53 € (comisión 4 %, primeros 60 días) · 10.88 € (comisión 9 %, después)
- Comisión 4 %: CPA de equilibrio 12.53 € · ROAS de equilibrio 3.18x · ROAS para ganar 3 €/pedido 4.19x
- Comisión 9 %: CPA de equilibrio 10.88 € · ROAS de equilibrio 3.67x · ROAS para ganar 3 €/pedido 5.06x

## Resultado mensual con comisión 9 % (régimen normal)

| Presupuesto de anuncios | CPA | Pedidos/mes | Pedidos/día | Beneficio/mes tras anuncios y fijos | Capital atrapado |
|---|---|---|---|---|---|
| 500 € | 8 € | 66 | 2.2 | -36 € | 445 € |
| 1000 € | 8 € | 131 | 4.4 | +178 € | 890 € |
| 2000 € | 8 € | 262 | 8.7 | +606 € | 1781 € |
| 5000 € | 8 € | 656 | 21.9 | +1889 € | 4452 € |

## Resultado mensual con comisión 4 % (primeros 60 días)

| Presupuesto de anuncios | CPA | Pedidos/mes | Pedidos/día | Beneficio/mes tras anuncios y fijos | Capital atrapado |
|---|---|---|---|---|---|
| 500 € | 8 € | 66 | 2.2 | +72 € | 445 € |
| 1000 € | 8 € | 131 | 4.4 | +394 € | 890 € |
| 2000 € | 8 € | 262 | 8.7 | +1039 € | 1781 € |
| 5000 € | 8 € | 656 | 21.9 | +2972 € | 4452 € |

## Veredicto de escalado (caso base, comisión 9 %)

- CPA base 8 €: beneficio por pedido tras anuncios +3.26 € · margen de seguridad 30% (mínimo 30 %)
- [x] Beneficio positivo tras anuncios con comisión 9 %
- [ ] Margen de seguridad ≥ 30 % sobre el CPA base
- [ ] Aguanta al menos 4 € de CPA por encima del base sin perder (CPA base + 4 < CPA de equilibrio)
- [x] Capacidad del proveedor cubre 5.000 € de anuncios (22 pedidos/día frente a 150)

**Veredicto: AGUANTAR en 500 €/mes y optimizar creativo y coste antes de escalar.**

Supuestos sin medir: CPA, devoluciones, capacidad del proveedor, retraso de cobro de TikTok y que la comisión de 4 % se aplique. Medirlos en el piloto (ver cerebro/proceso.md, puerta 2) y volver a ejecutar este modelo con datos reales.
```

### Modelo C
```
# Escalado: PVP 29.90 € · coste 16.80 € · devoluciones 15% · afiliado 0%

Beneficio por pedido SIN anuncios: 2.67 € (comisión 4 %, primeros 60 días) · 1.43 € (comisión 9 %, después)
- Comisión 4 %: CPA de equilibrio 2.67 €; no hay margen para ganar 3 €/pedido con anuncios
- Comisión 9 %: CPA de equilibrio 1.43 €; no hay margen para ganar 3 €/pedido con anuncios

## Resultado mensual con comisión 9 % (régimen normal)

| Presupuesto de anuncios | CPA | Pedidos/mes | Pedidos/día | Beneficio/mes tras anuncios y fijos | Capital atrapado |
|---|---|---|---|---|---|
| 500 € | 1 € | 500 | 16.7 | +115 € | 3920 € |
| 1000 € | 1 € | 1000 | 33.3 | +330 € | 7840 € |
| 2000 € | 1 € | 2000 | 66.7 ⚠ supera capacidad | +760 € | 15680 € |
| 5000 € | 1 € | 5000 | 166.7 ⚠ supera capacidad | +2050 € | 39200 € |

## Resultado mensual con comisión 4 % (primeros 60 días)

| Presupuesto de anuncios | CPA | Pedidos/mes | Pedidos/día | Beneficio/mes tras anuncios y fijos | Capital atrapado |
|---|---|---|---|---|---|
| 500 € | 1 € | 500 | 16.7 | +735 € | 3920 € |
| 1000 € | 1 € | 1000 | 33.3 | +1570 € | 7840 € |
| 2000 € | 1 € | 2000 | 66.7 ⚠ supera capacidad | +3240 € | 15680 € |
| 5000 € | 1 € | 5000 | 166.7 ⚠ supera capacidad | +8250 € | 39200 € |

## Veredicto de escalado (caso base, comisión 9 %)

- CPA base 1 €: beneficio por pedido tras anuncios +0.43 € · margen de seguridad 30% (mínimo 30 %)
- [x] Beneficio positivo tras anuncios con comisión 9 %
- [x] Margen de seguridad ≥ 30 % sobre el CPA base
- [ ] Aguanta al menos 4 € de CPA por encima del base sin perder (CPA base + 4 < CPA de equilibrio)
- [ ] Capacidad del proveedor cubre 5.000 € de anuncios (167 pedidos/día frente a 60)

**Veredicto: AGUANTAR en 500 €/mes y optimizar creativo y coste antes de escalar.**

Supuestos sin medir: CPA, devoluciones, capacidad del proveedor, retraso de cobro de TikTok y que la comisión de 4 % se aplique. Medirlos en el piloto (ver cerebro/proceso.md, puerta 2) y volver a ejecutar este modelo con datos reales.
```

### Modelo D
```
# Escalado: PVP 19.00 € · coste -0.43 € · devoluciones 5% · afiliado 0%

Beneficio por pedido SIN anuncios: 14.26 € (comisión 4 %, primeros 60 días) · 13.48 € (comisión 9 %, después)
- Comisión 4 %: CPA de equilibrio 14.26 € · ROAS de equilibrio 1.33x · ROAS para ganar 3 €/pedido 1.69x
- Comisión 9 %: CPA de equilibrio 13.48 € · ROAS de equilibrio 1.41x · ROAS para ganar 3 €/pedido 1.81x

## Resultado mensual con comisión 9 % (régimen normal)

| Presupuesto de anuncios | CPA | Pedidos/mes | Pedidos/día | Beneficio/mes tras anuncios y fijos | Capital atrapado |
|---|---|---|---|---|---|
| 500 € | 9 € | 53 | 1.8 | +154 € | -11 € |
| 1000 € | 9 € | 106 | 3.5 | +368 € | -21 € |
| 2000 € | 9 € | 212 | 7.1 | +796 € | -43 € |
| 5000 € | 9 € | 530 | 17.7 | +2080 € | -106 € |

## Resultado mensual con comisión 4 % (primeros 60 días)

| Presupuesto de anuncios | CPA | Pedidos/mes | Pedidos/día | Beneficio/mes tras anuncios y fijos | Capital atrapado |
|---|---|---|---|---|---|
| 500 € | 9 € | 53 | 1.8 | +195 € | -11 € |
| 1000 € | 9 € | 106 | 3.5 | +451 € | -21 € |
| 2000 € | 9 € | 212 | 7.1 | +961 € | -43 € |
| 5000 € | 9 € | 530 | 17.7 | +2493 € | -106 € |

## Veredicto de escalado (caso base, comisión 9 %)

- CPA base 9 €: beneficio por pedido tras anuncios +4.04 € · margen de seguridad 30% (mínimo 30 %)
- [x] Beneficio positivo tras anuncios con comisión 9 %
- [ ] Margen de seguridad ≥ 30 % sobre el CPA base
- [x] Aguanta al menos 4 € de CPA por encima del base sin perder (CPA base + 4 < CPA de equilibrio)
- [x] Capacidad del proveedor cubre 5.000 € de anuncios (18 pedidos/día frente a 9999)

**Veredicto: AGUANTAR en 500 €/mes y optimizar creativo y coste antes de escalar.**

Supuestos sin medir: CPA, devoluciones, capacidad del proveedor, retraso de cobro de TikTok y que la comisión de 4 % se aplique. Medirlos en el piloto (ver cerebro/proceso.md, puerta 2) y volver a ejecutar este modelo con datos reales.
```
