// Configuración general de la landing de pedidos por mensaje directo (SIMBA Kids UY).
window.SIMBA_CONFIG = {
  whatsappNumber: "59899185641", // +598 99 185 641, formato internacional sin "+" para wa.me
  storeName: "SIMBA Kids UY",

  // --- Fuente de datos de stock ---
  // "local"  -> usa data/products.json (snapshot manual, útil para probar sin token)
  // "shopify" -> consulta en vivo la Storefront API de Shopify (requiere storefront.domain + storefront.token)
  dataSource: "shopify",
  storefront: {
    domain: "8p1zvz-77.myshopify.com",
    token: "3c6fabb69246bdc73dd6c8ac634aba14", // Storefront API access token (público, de solo lectura)
    apiVersion: "2026-04"
  }
};
