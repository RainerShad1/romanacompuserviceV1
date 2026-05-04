================================================
RCRC COMPUSERVICE - INSTRUCCIONES
================================================

📁 ESTRUCTURA DEL PROYECTO
----------------------------------------
rcrc/
├── index.html           ← Página principal (home)
├── catalogo.html        ← Catálogo completo con filtros
├── producto.html        ← Vista detalle de producto
└── assets/
    ├── styles.css       ← Estilos compartidos
    ├── translations.js  ← Traducciones ES / EN / IT
    ├── products.js      ← Datos de productos (BD temporal)
    ├── main.js          ← JS principal compartido
    ├── catalog.js       ← Lógica del catálogo
    ├── product.js       ← Lógica del detalle de producto
    ├── logo.png         ← TU LOGO (reemplazar)
    └── logo-fallback.svg ← Logo provisional


🖼️ CÓMO CAMBIAR EL LOGO
----------------------------------------
1. Prepara tu logo:
   - Formato PNG con fondo transparente (recomendado)
   - Tamaño cuadrado: idealmente 256x256 hasta 1024x1024 px
   - Si tienes SVG sería ideal, pero PNG funciona perfecto

2. Renómbralo a "logo.png"

3. Reemplaza el archivo "assets/logo.png" con tu logo

4. Listo. El logo cambia automáticamente en TODAS las páginas
   (header de cada página y footer)

⚠️ Si el archivo "logo.png" no existe o falla la carga, el sitio
   muestra automáticamente el logo SVG provisional como respaldo,
   así nunca se ve roto.


🚀 CÓMO PROBAR EL SITIO LOCALMENTE
----------------------------------------
Opción 1 - Doble clic:
  Abre "index.html" haciendo doble clic. Funciona pero algunos
  navegadores limitan ciertas funciones por seguridad.

Opción 2 - Servidor local (recomendado):
  Si tienes Python instalado, abre la terminal en esta carpeta y:

    python -m http.server 8000

  Luego abre en tu navegador: http://localhost:8000

  Si tienes Node.js:
    npx serve

  Si usas VS Code: instala la extensión "Live Server" y
  haz clic derecho en index.html → "Open with Live Server"


✏️ CÓMO EDITAR PRODUCTOS (TEMPORAL)
----------------------------------------
Los productos están en "assets/products.js" como un array.

Para AGREGAR un producto, copia un objeto existente y modifícalo:

  {
    id: 'mi-nuevo-producto',           // único, sin espacios
    name: 'Nombre del producto',
    brand: 'Dell',                      // Dell, HP, Lenovo, Kingston...
    category: 'laptops',                // laptops, desktops, components,
                                        //   monitors, accessories
    categoryLabel: 'Laptops',           // Etiqueta visible
    condition: 'new',                   // 'new' o 'used'
    price: 25000,                       // número, sin RD$ ni comas
    available: true,                    // true / false
    description: 'Descripción corta',
    longDescription: 'Descripción larga para el detalle',
    warranty: '6 meses',
    sku: 'CODIGO-001',                  // código único interno
    iconType: 'laptop',                 // laptop, desktop, ssd,
                                        //   monitor, charger
    addedDate: '2026-01-15',            // YYYY-MM-DD
  },

Para QUITAR un producto, simplemente borra el bloque entero.

Para MARCAR COMO AGOTADO, cambia: available: false

⚠️ ESTO ES TEMPORAL. La próxima fase del proyecto es construir
   el panel admin con login que permita gestionar todo esto
   desde una interfaz web sin tocar código.


🌐 IDIOMAS
----------------------------------------
El sitio soporta 3 idiomas: Español, Inglés, Italiano.

- Los textos fijos (botones, menús, secciones) están traducidos.
- Los productos y servicios solo aparecen en español por ahora
  (modo "híbrido" para evitar trabajo de doble traducción).
- El idioma elegido se guarda en el navegador del visitante.


🎨 COLORES Y BORDES
----------------------------------------
Si quieres ajustar más los colores, edita las variables al inicio
de "assets/styles.css":

  --bg: #121214          ← fondo principal (negro suavizado)
  --accent: #f0d949      ← amarillo (suavizado)
  --r-md: 10px           ← radio de bordes medio

Aumenta los radios para bordes aún más suaves, o disminúyelos
si quieres más angular.


🔜 PRÓXIMOS PASOS
----------------------------------------
1. Reemplazar el logo (cuando lo tengas listo)
2. Subir el sitio a Vercel (te lo guío cuando estés listo)
3. Construir el panel admin con login
4. Conectar Supabase como base de datos real
5. Migrar productos del archivo products.js a Supabase
6. Configurar el truco de cron-job para evitar pausa


📞 SOPORTE
----------------------------------------
Si algo no funciona, revisa:
- Que la carpeta "assets/" esté completa
- Que abras los archivos desde la carpeta correcta
- Que tu navegador esté actualizado (Chrome, Firefox, Edge, Safari)
