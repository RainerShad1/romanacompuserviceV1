// ================================================
// RCRC COMPUSERVICE - CONEXIÓN A SUPABASE
// ================================================
// Cliente de Supabase usado por todo el sitio
// (catálogo público + panel admin)
// ================================================

const SUPABASE_URL = 'https://dxonfnlrkcxalacvtulm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4b25mbmxya2N4YWxhY3Z0dWxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MjIzNzksImV4cCI6MjA5MzQ5ODM3OX0.4M2E427Tw5NH6xMhKjIAQltnOYuN36_pDygBQ74km9I';

// El cliente se carga vía CDN en cada HTML que lo necesite
// Aquí simplemente lo inicializamos
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ================================================
// API de PRODUCTOS
// ================================================

async function fetchAllProducts() {
  const { data, error } = await supabaseClient
    .from('products')
    .select('*')
    .order('added_date', { ascending: false });

  if (error) {
    console.error('Error cargando productos:', error);
    return [];
  }

  // Convertir snake_case (BD) a camelCase (frontend)
  return data.map(normalizeProduct);
}

async function fetchProductById(id) {
  const { data, error } = await supabaseClient
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error cargando producto:', error);
    return null;
  }

  return normalizeProduct(data);
}

async function createProduct(product) {
  const dbProduct = denormalizeProduct(product);
  const { data, error } = await supabaseClient
    .from('products')
    .insert([dbProduct])
    .select();

  return { data: data ? data.map(normalizeProduct) : null, error };
}

async function updateProduct(id, updates) {
  const dbUpdates = denormalizeProduct(updates);
  // Siempre actualizar updated_at
  dbUpdates.updated_at = new Date().toISOString();

  const { data, error } = await supabaseClient
    .from('products')
    .update(dbUpdates)
    .eq('id', id)
    .select();

  return { data: data ? data.map(normalizeProduct) : null, error };
}

async function deleteProduct(id) {
  const { error } = await supabaseClient
    .from('products')
    .delete()
    .eq('id', id);

  return { error };
}

// ================================================
// API de SERVICIOS
// ================================================

async function fetchAllServices() {
  const { data, error } = await supabaseClient
    .from('services')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error cargando servicios:', error);
    return [];
  }

  return data;
}

async function createService(service) {
  const { data, error } = await supabaseClient
    .from('services')
    .insert([service])
    .select();

  return { data, error };
}

async function updateService(id, updates) {
  updates.updated_at = new Date().toISOString();
  const { data, error } = await supabaseClient
    .from('services')
    .update(updates)
    .eq('id', id)
    .select();

  return { data, error };
}

async function deleteService(id) {
  const { error } = await supabaseClient
    .from('services')
    .delete()
    .eq('id', id);

  return { error };
}

// ================================================
// API de FOTOS (Storage)
// ================================================

async function uploadProductImage(file, productId) {
  // Generar nombre único: productId-timestamp.ext
  const ext = file.name.split('.').pop().toLowerCase();
  const fileName = `${productId}-${Date.now()}.${ext}`;

  const { data, error } = await supabaseClient.storage
    .from('product-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Error subiendo imagen:', error);
    return { url: null, error };
  }

  // Obtener URL pública
  const { data: urlData } = supabaseClient.storage
    .from('product-images')
    .getPublicUrl(fileName);

  return { url: urlData.publicUrl, error: null };
}

async function deleteProductImage(imageUrl) {
  if (!imageUrl) return { error: null };

  // Extraer el nombre del archivo de la URL
  try {
    const url = new URL(imageUrl);
    const parts = url.pathname.split('/');
    const fileName = parts[parts.length - 1];

    const { error } = await supabaseClient.storage
      .from('product-images')
      .remove([fileName]);

    return { error };
  } catch (e) {
    return { error: e };
  }
}

// ================================================
// API de AUTENTICACIÓN
// ================================================

async function loginAdmin(email, password) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

async function logoutAdmin() {
  const { error } = await supabaseClient.auth.signOut();
  return { error };
}

async function getCurrentUser() {
  const { data, error } = await supabaseClient.auth.getUser();
  return { user: data?.user, error };
}

// ================================================
// HELPERS
// ================================================

// Convierte el formato BD (snake_case) al formato JS (camelCase)
function normalizeProduct(p) {
  if (!p) return null;
  return {
    id: p.id,
    name: p.name,
    brand: p.brand,
    category: p.category,
    categoryLabel: p.category_label,
    condition: p.condition,
    price: parseFloat(p.price) || 0,
    available: p.available,
    description: p.description || '',
    longDescription: p.long_description || '',
    warranty: p.warranty || '',
    sku: p.sku || '',
    iconType: p.icon_type || 'laptop',
    imageUrl: p.image_url || '',
    isPending: p.is_pending || false,
    addedDate: p.added_date,
  };
}

// Convierte JS (camelCase) al formato BD (snake_case)
function denormalizeProduct(p) {
  const out = {};
  if (p.id !== undefined) out.id = p.id;
  if (p.name !== undefined) out.name = p.name;
  if (p.brand !== undefined) out.brand = p.brand;
  if (p.category !== undefined) out.category = p.category;
  if (p.categoryLabel !== undefined) out.category_label = p.categoryLabel;
  if (p.condition !== undefined) out.condition = p.condition;
  if (p.price !== undefined) out.price = p.price;
  if (p.available !== undefined) out.available = p.available;
  if (p.description !== undefined) out.description = p.description;
  if (p.longDescription !== undefined) out.long_description = p.longDescription;
  if (p.warranty !== undefined) out.warranty = p.warranty;
  if (p.sku !== undefined) out.sku = p.sku;
  if (p.iconType !== undefined) out.icon_type = p.iconType;
  if (p.imageUrl !== undefined) out.image_url = p.imageUrl;
  if (p.isPending !== undefined) out.is_pending = p.isPending;
  if (p.addedDate !== undefined) out.added_date = p.addedDate;
  return out;
}

// Iconos SVG por tipo (compatible con products.js viejo)
const productIcons = {
  ssd: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M6 14h12"/></svg>',
  laptop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="20" height="14" rx="2"/><line x1="2" y1="20" x2="22" y2="20"/></svg>',
  desktop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
  monitor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
  charger: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>',
};

function formatPrice(price) {
  if (!price || price === 0) return 'RD$ —';
  return 'RD$ ' + Number(price).toLocaleString('es-DO');
}

function buildWhatsAppLink(product) {
  const phone = '18297538736';
  const lang = typeof getCurrentLang === 'function' ? getCurrentLang() : 'es';
  const messages = {
    es: `Hola, me interesa apartar el ${product.name} (${formatPrice(product.price)}). ¿Está disponible?`,
    en: `Hello, I'm interested in reserving the ${product.name} (${formatPrice(product.price)}). Is it available?`,
    it: `Salve, sono interessato a prenotare ${product.name} (${formatPrice(product.price)}). È disponibile?`,
  };
  const msg = messages[lang] || messages.es;
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}
