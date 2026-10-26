---
name: proveedor-es
description: Encuentra producto y proveedor exacto para vender en TikTok Shop España desde España, con enlace a la ficha del proveedor, coste, días de preparación y entrega, y beneficio por pedido calculado. Úsala cuando el usuario no tiene producto, pide "proveedor exacto", "cuánto gano" o "cuántos días tarda el envío", o tiene un presupuesto mensual pequeño.
---

# Producto y proveedor exacto para TikTok Shop España

Entrega una tabla de 3–5 productos con proveedor real (URL de la ficha), coste, envío, días y beneficio calculado con `scripts/margen_es.py`. **Nunca inventes un precio, un proveedor ni un plazo.** Si no puedes leer un dato en la fuente, escribe "no verificado" y no des GO a ese producto.

## Entradas

Presupuesto mensual (por defecto 500 €), nicho si lo hay, y si la tienda es nueva (comisión del 4% durante 60 días). Si falta el nicho, no preguntes: parte de lo que ya se vende en España (paso 1).

## Flujo

1. **Qué se vende ya en España.** Con WebSearch y WebFetch mira listas recientes (menos de 60 días) de lo más vendido en TikTok Shop España: FastMoss (`fastmoss.com`), Kalodata, Seller Center ES, listas de afiliados españoles. Apunta la fecha de cada fuente. Saca 10 candidatos.
2. **Filtra** y quédate con 5. Requisitos:
   - el resultado se ve en vídeo en 3 segundos;
   - PVP entre 25 y 45 €;
   - pesa menos de 1 kg y no se rompe;
   - no es de salud, suplementos, cosmética con promesas, electrónica con batería sin marcado CE, juguetes ni alimentación (sectores regulados en la UE);
   - no es de marca registrada ajena.
3. **Proveedor exacto, con stock en España o la UE.** Por orden de preferencia:
   - **BigBuy** (`bigbuy.eu`, almacén en Valencia, prepara en 24 h; cuota mensual: compruébala en su web);
   - **CJ Dropshipping** (`cjdropshipping.com`), solo con SKU de almacén ES o DE marcado en la ficha;
   - **AliExpress** con "Envío desde España";
   - mayoristas españoles.

   Para cada producto anota: URL de la ficha, coste sin IVA, envío a la península sin IVA, días de preparación, días de entrega, stock y pedido mínimo. Descarta los que se envían desde China sin almacén en la UE: no cumplen la regla de entregar al transportista en 2 días laborables.
4. **Calcula** cada uno desde el directorio de la skill:
   ```bash
   python3 scripts/margen_es.py --pvp <PVP con IVA> --coste <sin IVA> --envio <sin IVA> --dias-preparacion <n> --dias-entrega <n> [--tienda-nueva] [--afiliado 0]
   ```
   Usa `--afiliado 0` si las ventas vienen de vídeos propios. Fija el PVP mirando a qué precio venden lo mismo en TikTok Shop y Amazon España; no lo subas por encima del mercado para que salga GO.
5. **Tabla final**, ordenada por beneficio por pedido:

   | Producto | Proveedor (URL) | Coste | Envío | Prep./entrega | PVP | Beneficio/pedido | Margen | Anuncio máx./pedido | Veredicto |

   Añade debajo: fuente y fecha de cada dato, qué no se pudo verificar, y cuál pedirías como muestra primero.
6. **Plan con el presupuesto.** Con 500 €/mes:
   - mes 1 sin anuncios: muestra propia (1–2 unidades), cuota del proveedor si la hay, 8–10 muestras a microcreadores y 2–3 vídeos propios al día;
   - mes 2: GMV Max solo en vídeos que ya venden, como máximo lo que diga "Anuncio máx./pedido" × los pedidos esperados.

## Cómo leer a cada proveedor (probado el 20/10/2026)

- **AliExpress ES**: `node scripts/aliexpress_es.js "término"` (Playwright con el Chromium de `/opt/pw-browsers`). Saca precio en €, ventas, valoración y plazo de la búsqueda filtrada por envío desde España. Si sale `CAPTCHA`, repite. Las fichas de producto no cargan sin `alicdn.com`. En la nube, Chromium necesita el CA del proxy en NSS: `certutil -A -d sql:/root/.pki/nssdb -n ccr-agent-proxy -t "C,," -i /root/.ccr/agent-proxy-ca.crt` (paquete `libnss3-tools`).
- **BigBuy**: bloquea navegadores automáticos con Cloudflare. No intentes saltarlo; pide al usuario el precio desde su cuenta.
- **CJ Dropshipping**: necesita `cjdropshipping.com` y `app.cjdropshipping.com` permitidos en la red. Si da `ERR_TUNNEL_CONNECTION_FAILED`, están bloqueados.
- El precio de AliExpress es precio de venta al público con IVA: úsalo entero como coste (prudente) y envío 0 si pone "Envío gratis".

## Catálogos CSV de otros proveedores

Si la persona exporta el catálogo de un proveedor (BigBuy, CJ, VidaXL, Syncee) desde su panel, no hace falta abrir sus webs: `python3 scripts/filtrar_catalogo.py catalogo.csv --pvp-min 25 --pvp-max 45 --marcas-excluidas "sony,nike" --palabras "coche,gaming"` ordena por beneficio por pedido y descarta marcas, peso, falta de stock y márgenes < 25 %. El coste del CSV debe ir sin IVA. Lo que salga sigue necesitando precio de mercado y demanda.

## Si la red bloquea a los proveedores

Si WebFetch o curl fallan con estos dominios, dilo y nombra el dominio. El usuario tiene que permitirlo en la configuración de red del entorno o usar la skill en Claude Code en su PC. Mientras tanto entrega la lista de candidatos (pasos 1–2) y deja los costes como "no verificado". No rellenes con estimaciones.

## Reglas España y UE (compruébalas en el Seller Center; cambian)

- Comisión TikTok Shop ES: 9% general desde enero de 2026; 4% durante 60 días para tiendas nuevas en la UE con 5 productos activos en 15 días.
- Entregar al transportista en 2 días laborables, con un número de seguimiento válido.
- Derecho de desistimiento de 14 días.
- Etiqueta `#publi` en contenido pagado o con muestra gratis.
- El vendedor necesita alta fiscal (autónomo o sociedad) e IVA. Los costes se meten sin IVA en el cálculo.
