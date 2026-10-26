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
