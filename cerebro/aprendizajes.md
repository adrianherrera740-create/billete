# Aprendizajes (reglas que ya nos costaron caras)

## Cómo elegir producto
1. No se elige por margen solo. Tiene que llamar la atención en 3 segundos en un vídeo, resolver un dolor real o ser regalo fácil, y tener precio defendible.
2. Un precio de venta sin ancla de mercado leída (con fuente y fecha) es "no verificado" y sin GO. Lo que el mercado paga manda, no el margen que se quiere.
3. Productos que venden miles de unidades con envío desde España suelen ser baratos (5–8 €): venden mucho porque valen poco. Con PVP de 12–19 € casi nada llega a PVP/coste ≥ 4.
4. El método "problema primero" (un dolor que tenga todo el mundo) mejora el gancho, pero el mercado de esos productos suele estar saturado y barato: comprobar siempre el precio real en España antes de entusiasmarse.
5. Puntuar con criterios fijos (gancho, novedad, regalo, demostrabilidad, saturación, margen, devoluciones, logística, normativa). Umbral de ganador del equipo: 32/40. No se puntúa con otros baremos (la ronda 11 usó 6 criterios sobre 30 y no era comparable); si se usa otro, reexpresar a los 9 sobre 40 o decir que es solo ranking relativo.
6. High ticket (120–400 €) no es viable para tienda nueva con 500 €/mes: sin marca no se defiende el precio, la electrónica exige alta RAEE y CE, y una devolución de bulto borra decenas de pedidos.
19. Calcular al revés: partir del precio P leído en el canal real y buscar solo productos con coste <= 0,62 × P − 4,3 € (>= 4 € por pedido sin anuncios; fórmula del crítico, ronda 11). P = 29,90 € admite coste <= 14,2 €; P = 14,90 € admite <= 4,9 €. Sin ancla leída no se puntúa el producto.
20. Los precios de mercado sacados de resúmenes de búsqueda (Leroy, Worten, Carrefour, Shein) son indicativos, no ancla válida: hasta leer el precio real en TikTok Shop ES el PVP sigue "no verificado" (el PVP de 19,90–24,90 € del extractor cayó a 12,90–14,90 € por esto).
21. Verificar qué producto es cada ID antes de calcular o puntuar: el ID 1005013082078464, puntuado como "desatascador de pelo", es un cepillo de fregadero. Margen siempre con `margen_es.py` (el cálculo a mano omitió el IVA).

## Cálculo
7. `margen_es.py`: `--afiliado` es una FRACCIÓN (0.15 = 15 %); `--devoluciones` existe (usar 0.10–0.15 como caso base); `--comision-tiktok` sobrescribe la comisión; `--help` falla (línea 88). Plazos 2 y 5 días = estimación marcada. El script trata el producto devuelto como perdido (prudente).
8. Comisión TikTok Shop ES: 9 % (4 % 60 días en tienda nueva). Confirmar en Seller Center.
9. Un winner necesita coste puesto en cliente ≤ ~7 € con PVP ≥ 29,90 € (PVP/coste ≥ 4–5) y anuncio máximo por pedido ≥ CPA esperado + 3 €.

## Contenido y cumplimiento
10. Nunca marcas en fichas ni anuncios: ni GTA, Rockstar, Vice City, ni iPhone, AirPods, PlayStation, ni marcas de coche. Describir sin nombrarlas.
11. Etiqueta "contenido generado por IA", sin clientes IA, sin antes/después fabricado, sin reseñas falsas, música solo de la biblioteca comercial, #publi en muestras.
12. Claims que NO se pueden hacer sin prueba: "repara", "recupera", "universal", "cuero genuino", "antideslizante garantizado", "homologado".
13. Pendientes siempre: alta fiscal (autónomo), GPSR (responsable en la UE), CE/RAEE si hay electrónica, regla de entregar al transportista en 2 días laborables con seguimiento válido.

## Cómo trabajan los agentes
14. Un subagente no puede lanzar a otros: solo el director lanza agentes. Cada paso: especialistas en paralelo → jefes consolidan → `auditor-calidad` aprueba o rechaza.
15. Doble comprobación independiente de proveedor (dos agentes que no lean el informe del otro) y cruzar los IDs: ha cazado errores de ficha.
16. Calidad ha cazado contradicciones reales (p. ej. recomendar una ficha solo válida para volante en forma D): no saltarse la puerta.
17. Si un dato no se puede leer (fichas, FastMoss, otros proveedores), decirlo y no rellenar con estimaciones.
18. Si salta el límite de uso: parar, hacer commit y push, y decir hasta dónde se llegó. Reanudar el agente con SendMessage.

## Modelos de negocio y comparación (ronda 12)
22. No puntuar ni comparar un modelo con un PVP supuesto: sin ancla leída en el canal el "GO" es artefacto del supuesto (marca propia a 39,90 € = +10,88 €; dropshipping a 39,90 € = +10,95 €; la ventaja era el ticket, no la marca).
23. Antes de comparar rutas, tabla única de supuestos (comisión 9 % y 4 % bonus, afiliado 0 y 15 %, devoluciones, CPA 5/8/12 €) y declarar cuál usa cada cifra. Informes con comisión/afiliado distintos no son comparables.
24. Plazo de entrega: 2 días laborables (CLAUDE.md) frente a 5 días hábiles frente a 72 h (blogs): no se resuelve hasta leer Seller Center. Mientras, mandan 2 días y 9 % en los cálculos.
25. `margen_es.py` NO incluye el derecho de 3 € por envío (desde 1/07/2026, no verificado), ni flete, aranceles o IVA de importación: todo margen con origen China o importación es optimista hasta añadirlos.
26. Un CPA fijado como porcentaje del equilibrio del propio producto es circular ("gana dinero" porque el CPA se fijó para que gane): usar CPA medido o rango externo marcado como supuesto.
27. No cambiar de modelo sin leer antes el canal: una matriz SÍ/NO sobre supuestos no es un resultado. El cuello de botella es la ejecución de la persona (pre-mortem A3), no la búsqueda.
28. Un informe con columna "leído" cuyo contenido es un resumen de buscador se rechaza (refuerza la 20). Si dos informes de la misma ronda se contradicen (POD "escala mejor" frente a PARAR), el director no decide con ambos: calidad los reconcilia o rechaza.
