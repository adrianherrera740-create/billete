# Puerta de calidad, ronda 13 (solo proveedores). Revisión del 27/10/2026

Método: leí los 6 informes y CONTEXTO.md; repetí con WebFetch las páginas [OFICIAL] de CJ (cjdropshipping.com, sin www); re-ejecuté `margen_es.py` (--afiliado 0, --devoluciones 0.10, envío 4, 2 días) con los 6 márgenes y 4 costes máximos de pod-textil-ue.md; cruce de informes y de las reglas de CLAUDE.md.

## 1. Veredicto por informe
| Informe | Veredicto | Motivo corto |
|---|---|---|
| dropshipping-ue.md | APROBADO con 3 correcciones | Los 13 datos [OFICIAL] de CJ se reproducen. Ninguno se apoya en un resumen de buscador. Honesto con BigBuy/Spocket/Syncee/Eprolo/Dropi (todo [BLOG]/[NO VERIFICADO]). |
| mayoristas-es.md | APROBADO como lista de contactos, con 2 correcciones | 0 [OFICIAL] declarado y cierto. No hay GO. Ningún dato sirve de decisión. |
| fabricantes-marca-blanca.md | APROBADO con 3 correcciones | 0 [OFICIAL] declarado. Una contradicción interna de precio y Printful propuesto otra vez. |
| pod-textil-ue.md | APROBADO con 2 correcciones obligatorias | Los 6 márgenes y los 4 costes máximos se reproducen. Falta reconciliar con el cierre de POD y con estado.md. |
| reglas-tiktok-shop-oficial.md | APROBADO (sin correcciones de forma) | Honesto: 0 [OFICIAL]. Su valor es la lista de lo que la persona debe mirar. No sirve como fuente de ninguna regla. |
| protocolo-homologacion.md | APROBADO con 4 correcciones | Buen marco. Tiene una contradicción interna (red flags) y puntúa mal CJ en 2 puntos. Ignora la capa de TikTok Shop. |

## 2. Control 1: etiquetas y [OFICIAL] de CJ
Ninguna [OFICIAL] se apoya en un resumen de buscador. Reproducido hoy con WebFetch (27/10/2026):
- /service-fee: almacenes China, EE. UU., Polonia, Alemania y Reino Unido. MOQ 10 por variante y 100 en total. Tarifa de salida PL 1,01/1,26/1,77/2,27 USD y DE 0,34/0,44/0,85 USD. Reposición CN a PL aéreo 12-15 d y mar 45-60 d. CN a DE aéreo 13-18 d y mar 60-65 d. Sin suscripción citada. La cabecera de la tabla de salida (CN, US, PL, DE, GB) confirma la asignación de columnas, que en una primera lectura era solo una suposición del lector.
- /integrations/tiktok-shop: "2-5 day tracked" o "10-20 day", "Ship from China, US, or EU hubs", colección TikTok Hits. No menciona España. Dato que dropshipping-ue.md omite: los botones "Get Started" apuntan a una autorización TikTok_US.
- /user-agreement: sin empresa ni ID fiscal. Riesgo de propiedad intelectual a cargo del usuario, que renuncia a reclamar a CJ. Indemnización a CJ.
- /privacyPolicy: ley del Reino Unido, sin razón social ni dirección. Solo support@cjdropshipping.com.
- Portada: "10+ Global Warehouses", TikTok Shop en integraciones, enlace "Refund, Resend and Returns", ICP chino 浙ICP备2020040134号-1, sin razón social, dirección ni VAT. /customPackaging: MOQ 1 y "over 500" opciones de embalaje.
- /dispute-policy.html y /global-warehouses: redirigen a login/validación en frontend.cjdropshipping.com. Confirmado que no son legibles desde la nube.
Matiz: "[OFICIAL] Almacén UE: DE y PL" (tabla de dropshipping-ue.md) solo prueba que CJ tiene almacenes en DE y PL para el stock que EL VENDEDOR les envía (MOQ 100). No prueba que los SKU de dropshipping salgan de ahí.
Fechas: ninguna página muestra fecha de publicación. Solo fecha de consulta.

## 3. Control 2: márgenes de pod-textil-ue.md (re-ejecutados)
| PVP | 9 % | 4 % tienda nueva | Resultado |
|---|---|---|---|
| 14,90 | -7,35 NO-GO | -6,73 NO-GO | Coincide |
| 24,90 | -0,74 NO-GO | +0,29 HOLD | Coincide |
| 34,90 | +5,87 HOLD | +7,32 GO | Coincide |
Costes máximos para +4 €: 1,16/1,77, 7,77/8,80 y 14,38/15,82 € dan 3,99-4,00 €. Correctos con redondeo (la tabla debería decir "≈ 4,00").
Observación: estado.md y ronda-12 dan +4,53 € (34,90 €) y -7,86 € (14,90 €) con devoluciones 0,15. Ronda 13 usa 0,10 (CONTEXTO). La diferencia es de supuestos, no un error. Pero pod-textil no lo dice, y el aprendizaje 23 exige declarar la tabla única. Coste 12,50 € = supuesto, no coste de calculadora. Sin derecho de 3 € ni Shopify (aprendizaje 25). Todo margen sigue optimista.

## 4. Control 3: contradicciones entre informes
| Tema | Hallazgo | Resolución |
|---|---|---|
| CJ almacenes DE/PL frente a "hubs China/US/EU" | No se contradicen: /service-fee nombra CN, US, PL, DE, UK y la página TikTok dice "EU hubs". Pero protocolo-homologacion.md puntúa el punto 4 de CJ diciendo "sin país UE" y cita GetApp [BLOG] para Alemania. No usó /service-fee, que sí es [OFICIAL] y se lee. | Actualizar el protocolo. Mantener el matiz de stock propio frente a catálogo de dropshipping. |
| Printful TikTok solo EE. UU./Reino Unido | pod-textil-ue.md y el protocolo coinciden ([BLOG], sin leer ayuda de Printful). reglas-tiktok-shop-oficial.md cita un artículo de 2024 (thepaypers, Irlanda y España) que lista a Printful entre las apps, sin leer. Tensión no reconciliada. | Solo se resuelve con el artículo oficial de ayuda de Printful (comprobación 7). |
| Plazos de Printful | fabricantes: "2-5 d de producción + 3 d de entrega". pod-textil: "~3 d tras fulfillment", producción de prenda NO VERIFICADA. protocolo: "5 días a España". Todo [BLOG] y no concuerda. | Ninguno se usa. Pendiente de leer. |
| Printful tras el cierre de POD | estado.md y decision-ceo.md: POD CERRADO como motor de anuncios, reabrir solo con dato nuevo escrito. pod-textil lo propone como primer proveedor con "abrir cuenta" y no cita el cierre. fabricantes lo nombra #3 y sí reconoce el cierre (solo preventa). | pod-textil debe añadir la nota de cierre y la condición de reapertura. Ningún dato nuevo escrito justifica reabrir. |
| fabricantes, internamente | Alfombrillas/gorras Alibaba: texto "1-7 €" y tabla "0,26-3 $", dos monedas y rangos. MOQ de CFB 50/100/150, muestra 1-4 semanas, declarado como contradictorio. | Unificar o quitar la cifra. |
| protocolo, internamente | La red flag ROJA nº 1 es "sin razón social ni CIF/VAT en el aviso legal". CJ (portada y política leídas) no muestra razón social ni VAT. Aun así la nota final dice "ninguno muestra hoy red flag roja leída". | Corregir: CJ activa la roja 1 en lo leído, "descartado hasta aclararse". |
| mayoristas frente a dropshipping-ue | mayoristas dice que BigBuy "cubre las tres categorías". dropshipping-ue marca las categorías gaming/coche/streetwear como NO VERIFICADO en los cinco proveedores. | Quitar esa afirmación. |

## 5. Control 4: reglas de CLAUDE.md
- Marcas ajenas: no se lista ni propone ninguna marca ajena como producto. Razer, Corsair, SteelSeries y otras aparecen solo como distribuciones descartadas. Red Bull Racing aparece como advertencia. OK. No hay GTA, Rockstar, iPhone ni AirPods.
- Sectores excluidos: Penguin Wax Pro (detailing, productos químicos) lo advierte el propio informe (CLP, promesas). No se debe contactar sin leer composición. Salud, suplementos, juguetes y alimentación: no aparecen.
- Plazo de 2 días: reglas-tiktok-shop-oficial.md dice que no se halló en ninguna fuente. CLAUDE.md manda mientras no se lea Seller Center. Los informes lo respetan.
- "Sin comprar muestras" y "sin stock propio": fabricantes (CFB muestra ~30 €, MOQ 50-150, agentes 1688) los rompe y lo reconoce en "Qué cambiaría". Sin GO. La persona decide levantarlas.
- Ningún informe afirma claims de producto, etiqueta IA ni reseñas (no aplica a proveedores).

## 6. Correcciones exigidas (para devolver a cada autor)
- dropshipping-ue.md: (a) la tabla "Almacén UE: DE y PL [OFICIAL]" debe añadir "stock enviado por el vendedor, no prueba de catálogo"; (b) añadir que los botones de la página TikTok apuntan a TikTok_US; (c) la recomendación nº 1 no debe usar "almacenes DE/PL" como argumento sin ese matiz.
- mayoristas-es.md: (a) eliminar "cubre las tres categorías" de BigBuy; (b) marcar los ítems con fuente anterior a 2023 (2014-2022) como "posiblemente caducado" en la columna del ranking.
- fabricantes-marca-blanca.md: (a) unificar rango y moneda Alibaba; (b) quitar plazos de Printful que contradicen pod-textil, o marcarlos "sin conciliar"; (c) Printful #3 debe decir "solo si se reabre POD con dato nuevo escrito".
- pod-textil-ue.md: (a) añadir al inicio "POD cerrado como motor de anuncios (estado.md); este informe no lo reabre"; (b) explicar por qué sus cifras difieren de +4,53/-7,86 (devoluciones 0,10 frente a 0,15).
- reglas-tiktok-shop-oficial.md: ninguna. Puede citarse solo como lista de comprobaciones.
- protocolo-homologacion.md: (a) la nota de red flags de 5.4 contradice 5.2: CJ activa la roja 1; (b) CJ punto 4: usar /service-fee (OFICIAL, PL y DE) con matiz de stock propio; (c) CJ punto 13: de 1 a 0 (es plazo de transporte genérico, el propio informe dice "no es compromiso"; BigBuy con un plazo de preparación recibió 0). CJ pasa a 4/30; (d) el protocolo no incluye la capa TikTok.

## 7. Conclusión
### 7.1 Qué proveedor tiene algo realmente verificable hoy
| Proveedor | Verificable hoy (leído, 27/10/2026) | No verificable |
|---|---|---|
| CJ Dropshipping | Tarifas de servicio de stock propio (CN/US/PL/DE/UK), MOQ 10/100, reposición CN a PL/DE, páginas con "2-5 d" y "10-20 d", integración TikTok existe, EU hubs, sin ID fiscal en el acuerdo, ley UK, sin razón social, riesgo de marca a cargo del usuario | Precio de un SKU, stock DE/PL por producto, plazo a España, devoluciones, si el conector admite España, entidad legal, VAT |
| BigBuy | Nada ([403]) | Todo (cuota 69-120 €/mes solo [BLOG]) |
| Printful, Gelato, Printify | Nada (DNS) | Todo (coste base, producción UE, conector ES) |
| Spocket, Syncee, Eprolo, Dropi | Nada | Todo; Dropi no encaja con TikTok Shop (contrareembolso, [BLOG]) |
| Mayoristas ES y fabricantes (15 + 12) | Nada | Todo. Las empresas existen solo según terceros |
| Reglas TikTok Shop ES | Nada | Comisión, 4 %, 2 días, origen del stock, conectores, requisitos de alta |
Resultado: solo CJ tiene datos verificables, y casi todos son de tarifas de servicio, no de producto. Ningún proveedor admite GO. El factor limitante es la capa de plataforma (Seller Center) y no la búsqueda de proveedor.

### 7.2 Las 8 comprobaciones de 0 € para la persona (navegador propio)
Guardar captura o enlace en `tienda/trabajo/ronda-13/proveedores/` para pasar a [OFICIAL]. Las rutas internas de Seller Center no las he visto (DNS bloqueado): la URL es de entrada.
| # | URL | Qué apuntar |
|---|---|---|
| 1 | https://seller-es.tiktok.com (Centro de ayuda > comisiones) | Comisión ES y descuento de tienda nueva (porcentaje y duración). Decide 9 % o 4 % |
| 2 | https://seller-es.tiktok.com (Centro de ayuda > envío/logística) | Plazo de entrega al transportista, desde cuándo cuenta, si hay tiempo de gestión ampliado o "Made to Order" |
| 3 | https://seller-es.tiktok.com (Centro de ayuda > política de productos/dropshipping y registro) | Si se admite stock fuera de la UE o dropshipping de terceros, país de origen, documentos de alta (NIF, autónomo), categorías y marcas |
| 4 | https://seller-es.tiktok.com (App & Service Partner Center, filtro España) | Si aparecen CJ, BigBuy, Printful, Gelato, Printify |
| 5 | https://cjdropshipping.com/integrations/tiktok-shop (pulsar "Get Started") | Si deja autorizar una tienda de España o solo TikTok_US |
| 6 | https://cjdropshipping.com/global-warehouses (cuenta gratuita) y https://cjdropshipping.com/calculation.html | SKU gaming/coche/streetwear con stock en DE/PL, precio, plazo a ES, y estas dos políticas: https://cjdropshipping.com/dispute-policy.html |
| 7 | https://www.bigbuy.eu/es/ (aviso legal y planes en el pie, apartado dropshipping) y https://ec.europa.eu/taxation_customs/vies/ | Razón social y VAT; validar en VIES; cuota real, CSV y TikTok. Sin pagar |
| 8 | https://help.printful.com/hc/en-us/articles/29824372231452 (ruta citada por pod-textil, de buscador, no abierta) | Países admitidos para TikTok y condiciones de Made to Order. Solo para cerrar la tensión sobre Printful |
Ordenados por valor: 1 a 4 bloquean todo lo demás. Si 2 o 3 descartan stock fuera de la UE, CJ China queda fuera y el modelo A solo vive con stock DE/PL o BigBuy.

### 7.3 Qué cambia en el protocolo
1. Puerta previa de plataforma: antes de puntuar proveedores, los puntos 1-4 de arriba (origen del stock, plazo, conector ES, alta). Si fallan, el proveedor no se puntúa.
2. Regla [OFICIAL]: cita literal, URL y fecha de consulta. Tablas: confirmar la cabecera de columnas. Un enlace de un buscador no es lectura.
3. Corregir CJ: red flag roja 1 activa, punto 4 con /service-fee, punto 13 a 0, total 4/30. No homologado y descartado hasta aclarar entidad legal y VAT.
4. Distinguir en la nota "almacén de stock propio del vendedor" frente a "almacén del catálogo de dropshipping".
5. Añadir coste de importación (derecho de 3 €, IVA importación, aduana) como punto cuando el origen no es UE (aprendizaje 25).
6. Fase 0 sin puntos: red flags rojas y VIES antes de los 15 puntos, porque son eliminatorias.
