# Landing de Pedidos por Mensaje — SIMBA Kids UY

Landing para que los clientes que compran por WhatsApp/Instagram elijan el pack,
vean los diseños disponibles (con el stock real de Shopify) y manden la selección
por WhatsApp con un solo botón.

## Cómo probarla ahora mismo

No hace falta instalar nada: abrí `index.html` haciendo doble clic. Funciona
directo en el navegador porque los datos están embebidos en `data/products.js`
y `data/packs.js` (no usa `fetch`, así que no depende de un servidor).

Packs de prueba ya cargados:
- Pack "Descubrimiento" (4 pañales mixtos)
- PACK x8 Pañales Estándar
- Promo Playa (pañales de agua)

## Estructura

```
index.html          -> grilla con todos los packs
pack.html            -> plantilla dinámica (?slug=nombre-del-pack)
data/products.js     -> stock y fotos por diseño, por producto "madre"
data/packs.js        -> qué packs existen y qué productos/cantidades incluyen
assets/js/config.js  -> número de WhatsApp y fuente de datos (local o Shopify)
assets/js/data-source.js -> capa que lee de local o de Shopify Storefront API
```

## Cómo sumar el resto de los packs

En `data/packs.js`, cada pack es un objeto con `slug`, `name`, `price`, `image`
y `components` (qué producto madre usa, con qué `label` y `qty`). Los productos
madre ya identificados (con su handle real de Shopify) son:

- `panal-estandar`, `panal-dryfit-cafe`, `panal-carbon-bambu`
- `bolsa-mediana`, `bolsa-chica`
- `panal-agua`

Para sumar, por ejemplo, "PACK x12 Pañales DryFit Café", se agrega en
`packs.js` un objeto con `components: [{ product: "panal-dryfit-cafe", qty: 12 }, { product: "bolsa-mediana", qty: 1 }]`.
No hace falta tocar `products.js` de nuevo salvo que cambien las fotos/diseños.

## Conectar el stock en vivo de Shopify (pendiente)

Hoy la landing usa una foto fija del stock (tomada el 24/08). Para que se
actualice sola con cada venta hace falta un **Storefront API access token**
(público, de solo lectura — no es información sensible, está pensado para
usarse en el navegador del cliente).

Cómo generarlo vos mismo en el admin de Shopify:
1. **Configuración → Apps y canales de venta → Desarrollar apps**
2. **Crear una app** (ej: "Landing Pedidos DM")
3. En **Configuración de API** → **Storefront API**, activar los scopes
   `unauthenticated_read_product_listings` y `unauthenticated_read_product_inventory`
4. Instalar la app y copiar el **Storefront API access token**

Con ese token y tu dominio `.myshopify.com`, completá `assets/js/config.js`:

```js
dataSource: "shopify",
storefront: {
  domain: "TU-TIENDA.myshopify.com",
  token: "TU_TOKEN_AQUI"
}
```

A partir de ahí, la landing deja de usar la foto fija y lee el stock real de
cada diseño en cada carga de página — igual que hace Infinite Options en la web.

## Publicar gratis en GitHub Pages

1. Crear un repositorio nuevo en GitHub (puede ser público o privado)
2. Subir esta carpeta (`landing-pedidos`) al repo
3. En **Settings → Pages**, elegir la rama `main` y carpeta `/ (root)`
4. GitHub te da una URL tipo `https://tu-usuario.github.io/landing-pedidos/`

Ese link es el que el bot de Otimify o vos le mandarían al cliente que quiere
comprar por WhatsApp.

## Botón "Enviar diseños"

Abre `https://wa.me/59899185641` con el pack, precio y cada diseño elegido ya
escrito en el mensaje — el cliente solo toca "Enviar" en WhatsApp.
