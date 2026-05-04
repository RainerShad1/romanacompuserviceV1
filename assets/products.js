// ================================================
// RCRC COMPUSERVICE - DATOS DE PRODUCTOS
// ================================================
// Este archivo es temporal. Cuando conectemos Supabase,
// estos datos vendrán directamente de la base de datos.
// ================================================

const products = [
  {
    id: 'ssd-528',
    name: 'SSD 528 GB',
    brand: 'Kingston',
    category: 'components',
    categoryLabel: 'Componentes',
    condition: 'new',
    price: 3200,
    available: true,
    description: 'Disco sólido de alta velocidad. Mejora drásticamente el rendimiento de tu equipo.',
    longDescription: 'Disco de estado sólido (SSD) de 528 GB de Kingston. Velocidades de lectura/escritura significativamente superiores a un disco mecánico tradicional. Ideal para upgrades de laptops y desktops. Reduce los tiempos de arranque de Windows y aplicaciones drásticamente.',
    warranty: '6 meses',
    sku: 'KIN-SSD-528',
    iconType: 'ssd',
    addedDate: '2025-12-15',
  },
  {
    id: 'laptop-dell-i5',
    name: 'Laptop Dell i5',
    brand: 'Dell',
    category: 'laptops',
    categoryLabel: 'Laptops',
    condition: 'used',
    price: 28500,
    available: true,
    description: 'Laptop confiable con procesador Intel Core i5. Ideal para trabajo y estudio.',
    longDescription: 'Laptop Dell con procesador Intel Core i5, en excelentes condiciones. Revisada y certificada por nuestro equipo técnico. Incluye Windows instalado, batería funcional y cargador original. Perfecta para trabajo de oficina, estudio y uso general.',
    warranty: '30 días',
    sku: 'DELL-I5-001',
    iconType: 'laptop',
    addedDate: '2025-12-10',
  },
  // Productos placeholder - se editarán desde el panel admin cuando esté listo
  {
    id: 'pending-1',
    name: 'Laptop HP — Por definir',
    brand: 'HP',
    category: 'laptops',
    categoryLabel: 'Laptops',
    condition: 'new',
    price: 0,
    available: false,
    description: 'Información del producto pendiente de actualización desde el panel admin.',
    longDescription: 'Producto pendiente de configuración.',
    warranty: '—',
    sku: 'PENDING-001',
    iconType: 'laptop',
    isPending: true,
    addedDate: '2025-12-01',
  },
  {
    id: 'pending-2',
    name: 'Computadora Lenovo',
    brand: 'Lenovo',
    category: 'desktops',
    categoryLabel: 'Computadoras',
    condition: 'new',
    price: 0,
    available: false,
    description: 'Información del producto pendiente de actualización desde el panel admin.',
    longDescription: 'Producto pendiente de configuración.',
    warranty: '—',
    sku: 'PENDING-002',
    iconType: 'desktop',
    isPending: true,
    addedDate: '2025-12-01',
  },
  {
    id: 'pending-3',
    name: 'Monitor 24"',
    brand: 'HP',
    category: 'monitors',
    categoryLabel: 'Monitores',
    condition: 'new',
    price: 0,
    available: false,
    description: 'Información del producto pendiente de actualización desde el panel admin.',
    longDescription: 'Producto pendiente de configuración.',
    warranty: '—',
    sku: 'PENDING-003',
    iconType: 'monitor',
    isPending: true,
    addedDate: '2025-12-01',
  },
  {
    id: 'pending-4',
    name: 'Cargador USB-C',
    brand: 'Lenovo',
    category: 'accessories',
    categoryLabel: 'Accesorios',
    condition: 'new',
    price: 0,
    available: false,
    description: 'Información del producto pendiente de actualización desde el panel admin.',
    longDescription: 'Producto pendiente de configuración.',
    warranty: '—',
    sku: 'PENDING-004',
    iconType: 'charger',
    isPending: true,
    addedDate: '2025-12-01',
  },
];

// Iconos SVG por tipo
const productIcons = {
  ssd: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M6 14h12"/></svg>',
  laptop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="20" height="14" rx="2"/><line x1="2" y1="20" x2="22" y2="20"/></svg>',
  desktop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
  monitor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
  charger: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>',
};

// Helpers para encontrar producto
function getProductById(id) {
  return products.find(p => p.id === id);
}

function formatPrice(price) {
  if (!price || price === 0) return 'RD$ —';
  return 'RD$ ' + price.toLocaleString('es-DO');
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
