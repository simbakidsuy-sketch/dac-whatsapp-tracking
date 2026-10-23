// Capa de datos: expone getProducts() y getPacks() sin importar de dónde vengan.
// Hoy lee window.SIMBA_PRODUCTS / window.SIMBA_PACKS (snapshot manual embebido en
// data/products.js y data/packs.js). El día que tengas el token de Storefront API,
// cambiá dataSource a "shopify" en config.js y esto empieza a leer el stock en vivo,
// sin tocar el resto del sitio.

async function getPacks() {
  return window.SIMBA_PACKS;
}

async function getProducts() {
  const { dataSource, storefront } = window.SIMBA_CONFIG;

  if (dataSource === "shopify" && storefront.domain && storefront.token) {
    return getProductsFromShopify(storefront);
  }

  return window.SIMBA_PRODUCTS;
}

async function getProductsFromShopify(storefront) {
  // Trae, para cada producto madre de products.js, sus variantes con imagen y stock real,
  // usando productByHandle (la API de Storefront no filtra products(query:"handle:...")).
  const baseProducts = window.SIMBA_PRODUCTS;
  const keys = Object.keys(baseProducts);

  const fields = keys.map((key, i) => `
    p${i}: productByHandle(handle: "${baseProducts[key].shopifyHandle}") {
      title
      variants(first: 100) {
        edges { node { title availableForSale quantityAvailable image { url } } }
      }
    }`).join("\n");

  const query = `query ProductsByHandle { ${fields} }`;

  const resp = await fetch(`https://${storefront.domain}/api/${storefront.apiVersion}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": storefront.token
    },
    body: JSON.stringify({ query })
  });

  const json = await resp.json();
  const data = json.data || {};

  const merged = {};
  keys.forEach((key, i) => {
    const live = data[`p${i}`];
    const base = baseProducts[key];
    if (!live) { merged[key] = base; return; }
    merged[key] = {
      title: live.title,
      shopifyHandle: base.shopifyHandle,
      variants: live.variants.edges.map(({ node: v }) => ({
        title: v.title,
        image: v.image ? v.image.url : "",
        // quantityAvailable puede venir null si la tienda no habilitó cantidades exactas
        // para este storefront: en ese caso usamos 99 (disponible, sin alarma de "últimas
        // unidades") en vez de asumir que queda 1 sola unidad.
        stock: v.availableForSale ? (v.quantityAvailable ?? 99) : 0
      }))
    };
  });
  return merged;
}
