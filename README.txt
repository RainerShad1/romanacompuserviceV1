================================================
ROMANA COMPUSERVICE - INSTRUCCIONES
================================================

📁 ESTRUCTURA DEL PROYECTO
----------------------------------------
romana-compuservice/
├── index.html           ← Página principal (home)
├── catalogo.html        ← Catálogo público
├── producto.html        ← Detalle de producto
├── admin.html           ← Panel de administración (privado)
└── assets/
    ├── styles.css       ← Estilos compartidos
    ├── admin.css        ← Estilos del panel admin
    ├── translations.js  ← Traducciones ES / EN / IT
    ├── supabase.js      ← Conexión a la base de datos
    ├── main.js          ← JS principal compartido
    ├── home.js          ← Carga datos en la home
    ├── catalog.js       ← Lógica del catálogo
    ├── product.js       ← Lógica detalle producto
    ├── admin.js         ← Lógica del panel admin
    ├── logo.png         ← TU LOGO (reemplazar)
    └── logo-fallback.svg ← Logo provisional


🔐 ACCESO AL PANEL ADMIN
----------------------------------------
URL del panel admin:
  https://tudominio.vercel.app/admin.html

(reemplaza "tudominio" con tu URL real de Vercel)

Login:
  - Email: el que registraste en Supabase
  - Contraseña: la que pusiste al crear el usuario

⚠️ IMPORTANTE: NO compartas el enlace de admin.html en el sitio
   público ni en redes sociales. Solo guárdalo en tu navegador
   como favorito personal.


🛠️ CÓMO USAR EL PANEL ADMIN
----------------------------------------
PRODUCTOS:
- "Agregar producto" → llenas el formulario con foto, precio, etc.
- En cada producto:
  ✓ Botón "check" verde: marca como disponible/agotado
  ✏️ Botón "lápiz": editar el producto
  🗑️ Botón "papelera" rojo: eliminar (te pide confirmación)

SERVICIOS:
- "Agregar servicio" → nombre, descripción, mensaje WhatsApp
- "Orden de aparición": número que define en qué posición aparece
  (1 = primero, 2 = segundo, etc.)
- "Activo": si está en off, el servicio se oculta del sitio público
  pero no se borra

📷 FOTOS DE PRODUCTOS:
- Tamaño máximo: 5 MB
- Formatos: JPG, PNG, WebP
- Si no subes foto, el sitio muestra un ícono según el tipo de producto


🚀 CÓMO PROBAR LOCALMENTE
----------------------------------------
Opción 1 - Doble clic:
  Abre "index.html". Funciona, pero algunas funciones pueden fallar.

Opción 2 - Servidor local (recomendado):
  Si tienes Python:    python -m http.server 8000
  Si tienes Node.js:   npx serve
  Luego: http://localhost:8000


🌐 CÓMO CAMBIAR EL LOGO
----------------------------------------
1. Prepara tu logo en PNG (256x256 px o más, fondo transparente)
2. Renómbralo a "logo.png"
3. Reemplaza el archivo "assets/logo.png"
4. Listo. Cambia automáticamente en todas las páginas


🌍 IDIOMAS
----------------------------------------
El sitio soporta ES / EN / IT.

- Los textos fijos del sitio están traducidos
- Los productos y servicios se muestran solo en español
  (configuración "híbrida" para evitar trabajo de doble traducción)
- El idioma elegido se guarda en el navegador del visitante


🔒 SEGURIDAD - REGENERAR CLAVE DE SUPABASE
----------------------------------------
La "anon key" actual fue compartida en chat durante el desarrollo.
Por buena práctica de seguridad, regenérala así:

1. Entra a tu proyecto en Supabase
2. Project Settings → API → "Reset anon key"
3. Copia la nueva clave
4. Edita el archivo "assets/supabase.js"
5. Reemplaza el valor de SUPABASE_ANON_KEY con la nueva
6. Sube el cambio a GitHub (Vercel lo despliega solo)


⚠️ MANTENER SUPABASE ACTIVO (PAUSA AUTOMÁTICA)
----------------------------------------
El plan gratis de Supabase pausa la base de datos después de 7 días
sin actividad. Para evitar esto, configura un ping automático:

1. Entra a https://cron-job.org y crea cuenta gratis
2. Crea un nuevo cron job:
   - URL: https://dxonfnlrkcxalacvtulm.supabase.co/rest/v1/products?select=count
   - Method: GET
   - Headers (Add header):
     * Name: apikey
     * Value: TU_ANON_KEY (la misma de supabase.js)
   - Schedule: cada 6 días
3. Activa el cron

Esto consulta la BD cada 6 días automáticamente, evitando la pausa.


📞 SOPORTE
----------------------------------------
Si algo no funciona:
- Verifica conexión a internet
- Abre la consola del navegador (F12 → Console) para ver errores
- Confirma que el usuario admin existe en Supabase Authentication
- Revisa que las políticas RLS estén activas
