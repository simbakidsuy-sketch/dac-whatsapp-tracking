// Solo los productos madre necesarios para la landing de Preventa Exclusiva.
// Actualizado con el catálogo real de Shopify (diseños y stock) el 16/09.
// El stock de acá abajo es solo un respaldo — en vivo (dataSource:"shopify" en config.js)
// se lee siempre el stock real de Shopify.
//
// panal-agua, bolsa-chica y bolsa-mediana apuntan a productos DUPLICADOS en Shopify
// (shopifyHandle distinto al del resto de las landings, "no listados" pero publicados
// en el canal de la app), creados el 01/10 para que el stock de los regalos de la
// preventa sea independiente del stock real de esos productos — así no se "habilitan"
// por error la Promo Playa, la Promo Matro ni la venta suelta en panales-agua/el sitio
// principal, que usan los productos originales. Esto afecta solo a esta carpeta.
window.SIMBA_PRODUCTS = {
  "panal-estandar": {
    "title": "Pañal Estándar (DryFit)",
    "shopifyHandle": "panal-de-bolsillo-estandar-dryfit-doble-barrera",
    "variants": [
      { "title": "ANIMALES", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/2_PANALES_DE_TELA_ESTANDAR_ANIMALES.png?v=1767980084", "stock": 0 },
      { "title": "ARCOIRIS", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/25_PANALES_DE_TELA_ESTANDAR_ARCOIRIS.png?v=1767980084", "stock": 0 },
      { "title": "AUSTRALIA", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/22_PANALES_DE_TELA_ESTANDAR_AUSTRALIA.png?v=1767980084", "stock": 0 },
      { "title": "CAMIONCITOS", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/8_PANALES_DE_TELA_ESTANDAR_CAMIONCITOS.png?v=1767980084", "stock": 6 },
      { "title": "COCODRILOS", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/4_PANALES_DE_TELA_ESTANDAR_COCODRILOS.png?v=1789564468", "stock": 0 },
      { "title": "CUADRADOS", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/27_PANALES_DE_TELA_ESTANDAR_CUADRADOS.png?v=1767980084", "stock": 0 },
      { "title": "ELEFANTES", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/7_PANALES_DE_TELA_ESTANDAR_ELEFANTES.png?v=1767980084", "stock": 0 },
      { "title": "ESPACIAL", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/15_PANALES_DE_TELA_ESTANDAR_ESPACIAL.png?v=1767980084", "stock": 0 },
      { "title": "ESTRELLAS", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/5_PANALES_DE_TELA_ESTANDAR_ESTRELLAS.png?v=1767980084", "stock": 0 },
      { "title": "FLORCITAS", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/10_PANALES_DE_TELA_ESTANDAR_FLORCITAS.png?v=1767980084", "stock": 0 },
      { "title": "GRANJA", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/21_PANALES_DE_TELA_ESTANDAR_GRANJA.png?v=1767980084", "stock": 0 },
      { "title": "HOJAS", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/16_PANALES_DE_TELA_ESTANDAR_HOJAS.png?v=1767980084", "stock": 0 },
      { "title": "JIRAFAS", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/23_PANALES_DE_TELA_ESTANDAR_JIRAFAS.png?v=1767980084", "stock": 0 },
      { "title": "LISO CELESTE", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/3_PANALES_DE_TELA_ESTANDAR_LISO_CELESTE.png?v=1767980084", "stock": 0 },
      { "title": "LISO CREMA", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/17_PANALES_DE_TELA_ESTANDAR_LISO_CREMA.png?v=1767980084", "stock": 0 },
      { "title": "LISO GRIS CLARITO", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/19_PANALES_DE_TELA_ESTANDAR_LISO_GRIS_CLARO.png?v=1767980084", "stock": 0 },
      { "title": "LISO LILA", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/9_PANALES_DE_TELA_ESTANDAR_LISO_LILA.png?v=1767980084", "stock": 0 },
      { "title": "LISO MOSTAZA", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/20_PANALES_DE_TELA_ESTANDAR_LISO_MOSTAZA.png?v=1767980084", "stock": 0 },
      { "title": "LISO VERDE", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/18_PANALES_DE_TELA_ESTANDAR_LISO_VERDE_ac21c580-bd82-452f-b5cc-0eba4a3c0522.png?v=1789564717", "stock": 0 },
      { "title": "NUBES", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/11_PANALES_DE_TELA_ESTANDAR_NUBES.png?v=1767980084", "stock": 0 },
      { "title": "ONDAS", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/14_PANALES_DE_TELA_ESTANDAR_ONDAS.png?v=1767980084", "stock": 0 },
      { "title": "OSITOS GRISES", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/13_PANALES_DE_TELA_ESTANDAR_OSITOS_GRIS.png?v=1767980084", "stock": 0 },
      { "title": "PERRITOS", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/12_PANALES_DE_TELA_ESTANDAR_PERRITOS.png?v=1767980084", "stock": 0 },
      { "title": "PIRATAS", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/6_PANALES_DE_TELA_ESTANDAR_PIRATAS.png?v=1767980084", "stock": 4 },
      { "title": "PLANETAS", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/28_PANALES_DE_TELA_ESTANDAR_PLANETAS.png?v=1767980084", "stock": 0 },
      { "title": "SAFARI", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/26_PANALES_DE_TELA_ESTANDAR_SAFARI.png?v=1767980084", "stock": 0 },
      { "title": "SOLCITOS", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/24_PANALES_DE_TELA_ESTANDAR_SOLCITOS.png?v=1767980084", "stock": 0 },
      { "title": "ZORRITOS", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/1_PANALES_DE_TELA_ESTANDAR_ZORRITOS.png?v=1767980084", "stock": 0 }
    ]
  },
  "panal-dryfit-cafe": {
    "title": "Pañal Premium (DryFit Café)",
    "shopifyHandle": "panal-de-bolsillo-plus-dryfit-cafe-simba",
    "variants": [
      { "title": "AFRICA LILA", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/22_PANAL_ECOLOGICO_DRYFIT_AFRICA.png?v=1789568935", "stock": 0 },
      { "title": "ARCOÍRIS", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/07_PANAL_ECOLOGICO_DRYFIT_ARCOIRIS.png?v=1770417996", "stock": 0 },
      { "title": "BOSQUE", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/11_PANAL_ECOLOGICO_DRYFIT_BOSQUE.png?v=1770417996", "stock": 0 },
      { "title": "CIRCO", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/13_PANAL_ECOLOGICO_DRYFIT_CIRCO.png?v=1770417996", "stock": 0 },
      { "title": "CONEJOS AZUL", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/24_PANAL_ECOLOGICO_DRYFIT_CONEJOS_AZUL.png?v=1789568935", "stock": 0 },
      { "title": "CONEJOS ROSA", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/04_PANAL_ECOLOGICO_DRYFIT_CONEJOS.png?v=1770417996", "stock": 0 },
      { "title": "ESPACIO", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/10_PANAL_ECOLOGICO_DRYFIT_ESPACIO.png?v=1770417996", "stock": 0 },
      { "title": "JIRAFAS", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/14_PANAL_ECOLOGICO_DRYFIT_JIRAFAS.png?v=1770417996", "stock": 0 },
      { "title": "LISO AZUL", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/26_PANAL_ECOLOGICO_DRYFIT_LISO_AZUL.png?v=1789568935", "stock": 0 },
      { "title": "LISO LILA", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/02_PANAL_ECOLOGICO_DRYFIT_LISO_LILA.png?v=1770417996", "stock": 0 },
      { "title": "LISO ROSADO", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/25_PANAL_ECOLOGICO_DRYFIT_LISO_ROSADO.png?v=1789568935", "stock": 0 },
      { "title": "MOUNSTRUOS", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/06_PANAL_ECOLOGICO_DRYFIT_MOUNTRUOS.png?v=1770417996", "stock": 0 },
      { "title": "RAYITAS VERDE", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/05_PANAL_ECOLOGICO_DRYFIT_VERDE_AGUA.png?v=1770417996", "stock": 0 },
      { "title": "SELVA", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/23_PANAL_ECOLOGICO_DRYFIT_SELVA.png?v=1789568935", "stock": 0 },
      { "title": "TRENES", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/15_PANAL_ECOLOGICO_DRYFIT_TRENES.png?v=1764269329", "stock": 0 },
      { "title": "ZOO", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/03_PANAL_ECOLOGICO_DRYFIT_ZOO.png?v=1770417996", "stock": 0 }
    ]
  },
  "panal-carbon-bambu": {
    "title": "Pañal Premium (Carbón de Bambú)",
    "shopifyHandle": "panal-de-bolsillo-premium-fibra-de-carbon-de-bambu",
    "variants": [
      { "title": "ARCOIRIS", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/23_PANAL_REUTILIZABLE_FIBRA_DE_CARBON_ARCOIRIS.png?v=1789569471", "stock": 0 },
      { "title": "AUSTRALIANO", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/15_PANAL_REUTILIZABLE_FIBRA_DE_CARBON_AUTRALIANO.png?v=1789569473", "stock": 0 },
      { "title": "BABY SELVA", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/10_PANAL_REUTILIZABLE_FIBRA_DE_CARBON_BABY_SELVA.png?v=1770417865", "stock": 0 },
      { "title": "BOSQUE", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/11_PANAL_REUTILIZABLE_FIBRA_DE_CARBON_BOSQUE.png?v=1770417865", "stock": 0 },
      { "title": "CUADRADOS", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/22_PANAL_REUTILIZABLE_FIBRA_DE_CARBON_CUADRADOS.png?v=1789569472", "stock": 0 },
      { "title": "DINOS AZUL", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/02_PANAL_REUTILIZABLE_FIBRA_DE_CARBON_DINOS_AZUL_68030387-6c0e-4a79-9cdf-f8e3fcb49b75.png?v=1789569473", "stock": 0 },
      { "title": "DINOS BLANCO", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/09_PANAL_REUTILIZABLE_FIBRA_DE_CARBON_DINOS_BLANCO.png?v=1770417865", "stock": 0 },
      { "title": "ESTRELLAS", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/01_PANAL_REUTILIZABLE_FIBRA_DE_CARBON_ESTRELLAS_83dafe64-d7e7-4aee-93e5-e515fe84355b.png?v=1789569473", "stock": 0 },
      { "title": "GLOBOS", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/19_PANAL_REUTILIZABLE_FIBRA_DE_CARBON_GLOBOS.png?v=1789569473", "stock": 0 },
      { "title": "LISO LILA", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/14_PANAL_REUTILIZABLE_FIBRA_DE_CARBON_LISO_LILA.png?v=1770417865", "stock": 0 },
      { "title": "LISO ROSADO", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/21_PANAL_REUTILIZABLE_FIBRA_DE_CARBON_LISO_ROSADO.png?v=1789569473", "stock": 0 },
      { "title": "LISO VERDE", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/04_PANAL_REUTILIZABLE_FIBRA_DE_CARBON_LISO_VERDE.png?v=1770417865", "stock": 0 },
      { "title": "MARGARITAS", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/08_PANAL_REUTILIZABLE_FIBRA_DE_CARBON_MARGARITAS.png?v=1770417865", "stock": 0 },
      { "title": "OSITOS", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/05_PANAL_REUTILIZABLE_FIBRA_DE_CARBON_OSITOS.png?v=1770417865", "stock": 0 },
      { "title": "OVEJITAS", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/06_PANAL_REUTILIZABLE_FIBRA_DE_CARBON_OVEJITAS.png?v=1770417865", "stock": 0 },
      { "title": "PLUMAS", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/13_PANAL_REUTILIZABLE_FIBRA_DE_CARBON_PLUMAS.png?v=1770417865", "stock": 0 }
    ]
  },
  "bolsa-mediana": {
    "title": "Bolsa Impermeable Mediana 30x40 (Preventa)",
    "shopifyHandle": "bolsa-impermeable-mediana-30x40-copia",
    "variants": [
      { "title": "AUSTRALIANA", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/AUSTRALIA.png?v=1785934249", "stock": 100 },
      { "title": "CORALES", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/CORALES.png?v=1789563614", "stock": 100 },
      { "title": "HOJAS SALMON", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/HOJAS_SALMON.png?v=1789563613", "stock": 100 },
      { "title": "ESTRELLAS", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/ESTRELLAS.png?v=1785934249", "stock": 100 },
      { "title": "OCEANO", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/OCEANO.png?v=1789563614", "stock": 100 },
      { "title": "OSITOS OSCURA", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/OSITOS.png?v=1785934249", "stock": 100 },
      { "title": "PLAYA", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/PLAYA_3009b323-32f9-4263-8331-63877ca5dddf.png?v=1785934377", "stock": 100 },
      { "title": "SAFARI", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/SAFARI.png?v=1785934254", "stock": 100 },
      { "title": "TORTUGUITAS", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/TORTUGUITAS.png?v=1789563613", "stock": 100 },
      { "title": "ZOOLOGICO", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/ZOOLOGICO.png?v=1785934249", "stock": 100 }
    ]
  },
  "bolsa-chica": {
    "title": "Bolsa Impermeable Chica 20x25 (Preventa)",
    "shopifyHandle": "base-bolsa-impermeable-chica-20x25-preventa",
    "variants": [
      { "title": "ANIMALES TERRA", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/BOLSAS_IMPERMEABLES_CHICAS_PARA_PANALES_PARA_EL_AGUA_ANIMALES_TERRA.png?v=1786708133", "stock": 100 },
      { "title": "ARCOIRIS", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/BOLSAS_IMPERMEABLES_CHICAS_PARA_PANALES_PARA_EL_AGUA_ARCOIRIS.png?v=1786708133", "stock": 100 },
      { "title": "AUSTRALIANA", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/BOLSAS_IMPERMEABLES_CHICAS_PARA_PANALES_PARA_EL_AGUA_AUSTRALIANA.png?v=1786708128", "stock": 100 },
      { "title": "BALLENITAS AZUL", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/BOLSAS_IMPERMEABLES_CHICAS_PARA_PANALES_PARA_EL_AGUA_BALLENITAS_AZUL.png?v=1786708124", "stock": 100 },
      { "title": "BALLENITAS ROSA", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/BOLSAS_IMPERMEABLES_CHICAS_PARA_PANALES_PARA_EL_AGUA_BALLENITAS_ROSA.png?v=1789563197", "stock": 100 },
      { "title": "BLANCA JARDIN", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/BOLSAS_IMPERMEABLES_CHICAS_PARA_PANALES_PARA_EL_AGUA_BLANCA_JARDIN.png?v=1786708133", "stock": 100 },
      { "title": "COCODRILOS", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/BOLSAS_IMPERMEABLES_CHICAS_PARA_PANALES_PARA_EL_AGUA_COCODRILOS.png?v=1789563197", "stock": 100 },
      { "title": "CUADRADOS", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/BOLSAS_IMPERMEABLES_CHICAS_PARA_PANALES_PARA_EL_AGUA_CUADRADOS.png?v=1789563196", "stock": 100 },
      { "title": "ESCAMAS", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/BOLSAS_IMPERMEABLES_CHICAS_PARA_PANALES_PARA_EL_AGUA_ESCAMAS.png?v=1786708127", "stock": 100 },
      { "title": "HOJAS SALMON", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/BOLSAS_IMPERMEABLES_CHICAS_PARA_PANALES_PARA_EL_AGUA_HOJAS_SALMON.png?v=1786708127", "stock": 100 },
      { "title": "HOJAS VERDE", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/BOLSAS_IMPERMEABLES_CHICAS_PARA_PANALES_PARA_EL_AGUA_HOJAS_VERDE.png?v=1786708133", "stock": 100 },
      { "title": "MARGARITAS", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/BOLSAS_IMPERMEABLES_CHICAS_PARA_PANALES_PARA_EL_AGUA_MARGARITAS.png?v=1786708133", "stock": 100 },
      { "title": "NARANJA OASIS", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/BOLSAS_IMPERMEABLES_CHICAS_PARA_PANALES_PARA_EL_AGUA_OASIS_NARANJA.png?v=1789563197", "stock": 100 },
      { "title": "NUDOS", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/BOLSAS_IMPERMEABLES_CHICAS_PARA_PANALES_PARA_EL_AGUA_NUDOS.png?v=1789563197", "stock": 100 },
      { "title": "PIRATAS", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/BOLSAS_IMPERMEABLES_CHICAS_PARA_PANALES_PARA_EL_AGUA_PIRATAS.png?v=1786708133", "stock": 100 },
      { "title": "PULPITOS", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/BOLSAS_IMPERMEABLES_CHICAS_PARA_PANALES_PARA_EL_AGUA_PULPOS.png?v=1786708129", "stock": 100 },
      { "title": "SANDIAS", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/BOLSAS_IMPERMEABLES_CHICAS_PARA_PANALES_PARA_EL_AGUA_SANDIAS_cb4582fb-be96-430e-9021-782e89ae0744.png?v=1789563196", "stock": 100 },
      { "title": "SOLCITOS", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/BOLSAS_IMPERMEABLES_CHICAS_PARA_PANALES_PARA_EL_AGUA_SOLCITOS.png?v=1789563195", "stock": 100 },
      { "title": "TORTUGA MARINA", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/BOLSAS_IMPERMEABLES_CHICAS_PARA_PANALES_PARA_EL_AGUA_TORTUGA_MARINA.png?v=1786708128", "stock": 100 },
      { "title": "TORTUGUITAS", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/BOLSAS_IMPERMEABLES_CHICAS_PARA_PANALES_PARA_EL_AGUA_TORTUGUITAS.png?v=1786708124", "stock": 100 }
    ]
  },
  "panal-agua": {
    "title": "Pañal para el Agua (Preventa)",
    "shopifyHandle": "base-panal-para-el-agua-preventa",
    "variants": [
      { "title": "ANCLAS", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/ANCLAS_PANAL_PARA_EL_AGUA_REUTILIZABLE_SIMBA.png?v=1789562475", "stock": 100 },
      { "title": "BALLENITAS AZUL", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/BALLENITAS_AZUL_PANAL_PARA_EL_AGUA_REUTILIZABLE_SIMBA.png?v=1789562478", "stock": 100 },
      { "title": "BALLENITAS MAR", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/BALLENITAS_MAR_PANAL_PARA_EL_AGUA_REUTILIZABLE_SIMBA.png?v=1789562477", "stock": 100 },
      { "title": "BARQUITOS", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/BARQEUITOS_PANAL_PARA_EL_AGUA_REUTILIZABLE_SIMBA.png?v=1789562477", "stock": 100 },
      { "title": "CANGREJOS CELESTE", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/CANGREJOS_CELESTE_PANAL_PARA_EL_AGUA_REUTILIZABLE_SIMBA.png?v=1789562477", "stock": 100 },
      { "title": "CANGREJOS ROSA", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/CANGREJOS_ROSA_PANAL_PARA_EL_AGUA_REUTILIZABLE_SIMBA_2.png?v=1789562476", "stock": 100 },
      { "title": "COCODRILOS", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/COCODRILOS_PANAL_PARA_EL_AGUA_REUTILIZABLE_SIMBA.png?v=1789562477", "stock": 100 },
      { "title": "CUADRADOS", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/CUADRADOS_PANAL_PARA_EL_AGUA_REUTILIZABLE_SIMBA.png?v=1789562477", "stock": 100 },
      { "title": "DINOS", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/DINOS_PANAL_PARA_EL_AGUA_REUTILIZABLE_SIMBA.png?v=1789562476", "stock": 100 },
      { "title": "ESCAMAS", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/ESCAMAS_PANAL_PARA_EL_AGUA_REUTILIZABLE_SIMBA.png?v=1789562477", "stock": 100 },
      { "title": "FLORCITAS", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/panal_para_el_agua_12.png?v=1764337025", "stock": 100 },
      { "title": "FONDO DEL MAR", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/FONDO_DEL_MAR_PANAL_PARA_EL_AGUA_REUTILIZABLE_SIMBA.png?v=1789562477", "stock": 100 },
      { "title": "OASIS", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/OASIS_PANAL_PARA_EL_AGUA_REUTILIZABLE_SIMBA.png?v=1789562476", "stock": 100 },
      { "title": "OLAS", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/OLAS_PANAL_PARA_EL_AGUA_REUTILIZABLE_SIMBA.png?v=1789562477", "stock": 100 },
      { "title": "PECESITOS", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/PECESITOS_PANAL_PARA_EL_AGUA_REUTILIZABLE_SIMBA.png?v=1789562477", "stock": 100 },
      { "title": "PLAYA", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/PLAYA_PANAL_PARA_EL_AGUA_REUTILIZABLE_SIMBA.png?v=1789562477", "stock": 100 },
      { "title": "PULPOS AGUA", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/PULPOS_AGUA_PANAL_PARA_EL_AGUA_REUTILIZABLE_SIMBA.png?v=1789562477", "stock": 100 },
      { "title": "PULPOS ROSA", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/CANGREJOS_ROSA_PANAL_PARA_EL_AGUA_REUTILIZABLE_SIMBA.png?v=1789562478", "stock": 100 },
      { "title": "RAYITAS", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/RAYITAS_PANAL_PARA_EL_AGUA_REUTILIZABLE_SIMBA.png?v=1789562475", "stock": 100 },
      { "title": "VERANO", "image": "https://cdn.shopify.com/s/files/1/0930/9575/6095/files/VERANO_PANAL_PARA_EL_AGUA_REUTILIZABLE_SIMBA.png?v=1789562477", "stock": 100 }
    ]
  }
};
