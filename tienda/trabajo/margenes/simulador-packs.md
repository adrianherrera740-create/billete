# Simulador de packs: set de cepillos de limpieza

Fecha del cálculo: 2026-10-26. Autor: especialista de márgenes (promoción y packs).

## Fuentes y convención
- Coste 9,29 €/set: dato del director/usuario (AliExpress ES 1005013107637317, CLAUDE.md). Ficha NO releída hoy (anti-bot): precio y plazos "no verificado" hoy.
- Cálculo: `.claude/skills/proveedor-es/scripts/margen_es.py`, ejecutado el 2026-10-26. Convención del script: `--pvp` CON IVA; `--coste` y `--envio` SIN IVA; base = PVP/1,21.
- Coherencia: se pasa `--coste 9.29` (x2 = 18.58, x3 = 27.87) tal cual, sin quitar el IVA. Es prudente: si AliExpress factura con IVA deducible, el coste real sin IVA sería 7,68 €/set y el beneficio subiría ~1,6 €/set (no verificado).
- Parámetros: `--envio 0` (supuesto: envío gratis; no verificado), `--afiliado 0` (vídeos propios), devoluciones 5 % (defecto del script, supuesto), embalaje 0,30 €/pedido (defecto; con packs podría ser mayor), pago y otros 1 %, `--dias-preparacion 2` (marcador; plazo real no verificado).
- Comisión: 4 % (tienda nueva, 60 días, 5 productos activos en 15 días) o 9 %. Comprobar en Seller Center.
- PVP de referencia anterior (CLAUDE.md): 24,90 € (1 set) y 39,90 € (pack de 2). El 24,90 queda fuera del rango 25–45, por eso la opción A sube a 25,90 (PVP propuesto, no contrastado con mercado: no verificado).

## Tabla de packs

| Opción | Unidades | PVP cliente (IVA incl.) | Coste producto | Beneficio/pedido com. 4 % | Margen 4 % | Beneficio/pedido com. 9 % | Margen 9 % | Beneficio por unidad (9 %) | Veredicto script (9 %) |
|---|---|---|---|---|---|---|---|---|---|
| A. 1 set | 1 | 25,90 € | 9,29 € | 9,67 € | 45,2 % | 8,60 € | 40,2 % | 8,60 € | GO |
| B. Pack de 2 | 2 | 39,90 € | 18,58 € | 10,80 € | 32,7 % | 9,15 € | 27,7 % | 4,58 € | GO |
| C. Pack de 3 | 3 | 44,90 € | 27,87 € | 5,23 € | 14,1 % | 3,37 € | 9,1 % | 1,12 € | HOLD |
| D. 2x1 con cupón (paga 1, lleva 2) | 2 | 29,90 € efectivo | 18,58 € | 3,36 € | 13,6 % | 2,12 € | 8,6 % | 1,06 € | HOLD |

Detalle (base sin IVA / comisión + otros): A 21,40 € · B 32,98 € · C 37,11 € · D 24,71 €.

Ticket medio (lo que paga el cliente por pedido): A 25,90 · B 39,90 (+54 % vs A) · C 44,90 (+73 %) · D 29,90 (+15 %).

Margen de anuncios (CPA para ganar 3 €/pedido tras anuncios, com. 9 %): A 5,60 € · B 6,15 € · C 0,37 € · D -0,88 €. Mes 1 no hay anuncios; sirve para el mes 2 (GMV Max).

PVP mínimo para margen 25 % (script, com. 9 %): A 19,40 € · B 38,10 € · C 56,90 € (fuera del rango) · D 38,10 € para 2 uds.

## Lectura
- C (pack de 3): para llegar a margen 25 % haría falta ~52,50 € (4 %) o ~56,90 € (9 %), fuera del rango 25–45. A 44,90 € casi todo el descuento se lo come el coste. Descartado.
- D (2x1 con cupón): el cliente paga 1 set y se regala el otro. 29,90 € no cubre 2 sets con margen; con 9 % ya da -0,88 € tras objetivo de anuncios. Para ser igual de rentable que B tendría que cobrarse ~38 €, y entonces es un pack de 2 con otro nombre. Solo valdría como cupón puntual de lanzamiento de pocos pedidos, nunca fijo. Si el cupón lo asume la tienda hay que fijar tope de usos.
- B (pack de 2): mejor beneficio absoluto por pedido (9,15 € a 9 %; 10,80 € a 4 %) y mayor ticket útil. Descuento frente a comprar 2 sets sueltos (51,80 €): 11,90 € (-23 %), mensaje claro en vídeo.
- A (1 set): mayor margen % y menor riesgo de stock/envío, pero menor ticket. Sirve de ancla de precio y de entrada.

## Recomendación
Lanzar con A (25,90 €) y B (39,90 €) como variantes del mismo producto; empujar B en vídeos y portada ("pack de 2"). Descartar C y D como oferta fija. Si hay que elegir solo una: B.
Sensibilidad: si el pack de 2 sube de 5 % a 10 % de devoluciones o el embalaje del pack cuesta 0,60 € en vez de 0,30 €, B baja ~1,5-2 €/pedido (estimación propia, recalcular con el script).

## Riesgos no verificados (a cerrar antes de GO)
1. **Envíos separados (clave):** comprar 2 o 3 unidades en AliExpress puede generar paquetes distintos, con plazos distintos y varios números de seguimiento, o coste de envío extra por unidad. Eso rompería la regla de entregar al transportista en 2 días laborables con seguimiento válido, empeoraría la experiencia del cliente y subiría el coste (cada envío extra sin contar aquí). No verificado: hay que comprobar en la ficha si el vendedor consolida la cantidad >1 en un paquete (con una muestra o consulta al vendedor). Si no consolida, B y C pierden su ventaja y A pasa a ser la única opción fiable.
2. Plazos de preparación/entrega de la ficha: no verificados (CLAUDE.md "Plazos sin verificar"). Se usó 2 días solo como marcador del script.
3. Envío al cliente supuesto 0 (envío gratis): no verificado. Cada 1 € de envío sin IVA que aparezca resta ~1 € al beneficio (más 5 % de ese coste por devoluciones).
4. Precio 9,29 €: no releído hoy. Puede cambiar o variar con la cantidad.
5. Comisión 4 % vs 9 %: comprobar en Seller Center; el 4 % dura 60 días.
6. PVP de mercado: no se ha contrastado con TikTok Shop ES ni Amazon ES (FastMoss 429, sin datos de ventas). Los PVP son propuestas.
7. Cómo se aplican en TikTok Shop los descuentos de pack/variante y cupones (quién los asume, orden de aplicación, si el cupón reduce la base de comisión): no verificado; mirar reglas de campañas en Seller Center.

## Pendiente de otros departamentos
- Operaciones/logística: confirmar consolidación de varias unidades en un paquete y los plazos reales.
- Buscador/proveedor: releer la ficha o conseguir muestra y fotos (dominios de imagen bloqueados).

## Nota técnica
`margen_es.py --help` falla con ValueError (carácter "%" sin escapar en "0.09 = 9%" del argumento --comision-tiktok). No afecta al cálculo; arreglo: usar "9%%".
