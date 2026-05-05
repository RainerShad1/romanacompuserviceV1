// ================================================
// ROMANA COMPUSERVICE - PANEL ADMIN
// ================================================

(async function() {
  // Verificar sesión al cargar
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  // Mostrar email del usuario
  document.getElementById('userEmail').textContent = user.email;

  // ================ ESTADO ================
  let productsData = [];
  let servicesData = [];
  let currentTab = 'products';
  let imageFile = null;
  let imageFileToDelete = null; // si el usuario reemplaza una imagen, la antigua se borra al guardar
  let confirmCallback = null;

  // ================ DOM ================
  const productsTbody = document.getElementById('productsTableBody');
  const servicesTbody = document.getElementById('servicesTableBody');
  const searchProducts = document.getElementById('searchProducts');
  const searchServices = document.getElementById('searchServices');

  // ================ TABS ================
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      currentTab = tab.dataset.tab;
      document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.admin-tab-panel').forEach(p => p.style.display = 'none');
      document.getElementById('panel-' + currentTab).style.display = 'block';
    });
  });

  // ================ LOGOUT ================
  document.getElementById('logoutBtn').addEventListener('click', async () => {
    try {
      await signOut();
      window.location.href = 'login.html';
    } catch (e) {
      toast('Error al cerrar sesión', 'error');
    }
  });

  // ================ CARGA INICIAL ================
  async function loadAll() {
    await Promise.all([loadProducts(), loadServices()]);
    updateStats();
  }

  async function loadProducts() {
    productsTbody.innerHTML = '<tr><td colspan="7"><div class="loading-overlay"><div class="spinner"></div></div></td></tr>';
    try {
      productsData = await fetchProducts();
      renderProducts();
    } catch (e) {
      console.error(e);
      toast('Error cargando productos', 'error');
    }
  }

  async function loadServices() {
    servicesTbody.innerHTML = '<tr><td colspan="5"><div class="loading-overlay"><div class="spinner"></div></div></td></tr>';
    try {
      servicesData = await fetchAllServices();
      renderServices();
    } catch (e) {
      console.error(e);
      toast('Error cargando servicios', 'error');
    }
  }

  function updateStats() {
    document.getElementById('statTotal').textContent = productsData.length;
    document.getElementById('statAvailable').textContent = productsData.filter(p => p.available).length;
    document.getElementById('statUnavailable').textContent = productsData.filter(p => !p.available).length;
    document.getElementById('statServices').textContent = servicesData.filter(s => s.isActive).length;
    document.getElementById('countProducts').textContent = productsData.length;
    document.getElementById('countServices').textContent = servicesData.length;
  }

  // ================ RENDER PRODUCTOS ================
  function renderProducts() {
    const term = (searchProducts.value || '').toLowerCase().trim();
    const filtered = term
      ? productsData.filter(p =>
          p.name.toLowerCase().includes(term) ||
          p.brand.toLowerCase().includes(term) ||
          p.sku.toLowerCase().includes(term)
        )
      : productsData;

    if (filtered.length === 0) {
      productsTbody.innerHTML = `
        <tr><td colspan="7">
          <div class="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="20" height="14" rx="2"/><line x1="2" y1="20" x2="22" y2="20"/></svg>
            <h3>${term ? 'No hay productos que coincidan' : 'Aún no hay productos'}</h3>
            <p>${term ? 'Prueba con otro término de búsqueda' : 'Agrega tu primer producto con el botón "Agregar producto"'}</p>
          </div>
        </td></tr>
      `;
      return;
    }

    productsTbody.innerHTML = filtered.map(p => {
      const imageHtml = p.imageUrl
        ? `<img src="${p.imageUrl}" alt="${escape(p.name)}" loading="lazy">`
        : (productIcons[p.iconType] || productIcons.laptop);

      return `
        <tr data-id="${escape(p.id)}">
          <td>
            <div class="row-image">${imageHtml}</div>
          </td>
          <td>
            <div class="row-name">${escape(p.name)}</div>
            <div class="row-meta">${escape(p.brand)} · ${escape(p.sku || 'sin código')}</div>
          </td>
          <td>${escape(p.categoryLabel)}</td>
          <td>
            <span class="status-badge ${p.condition === 'new' ? 'status-available' : 'status-unavailable'}" style="${p.condition === 'used' ? 'color: var(--fg-2); border-color: var(--line); background: var(--bg-3);' : ''}">
              ${p.condition === 'new' ? 'Nuevo' : 'Usado'}
            </span>
          </td>
          <td><span class="row-price">${formatPrice(p.price)}</span></td>
          <td>
            <label class="toggle-switch">
              <input type="checkbox" ${p.available ? 'checked' : ''} data-toggle-product="${escape(p.id)}">
              <span class="toggle-slider"></span>
            </label>
          </td>
          <td>
            <div class="row-actions">
              <button class="row-action-btn edit" data-edit-product="${escape(p.id)}" title="Editar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="row-action-btn delete" data-delete-product="${escape(p.id)}" title="Eliminar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Bind eventos
    productsTbody.querySelectorAll('[data-toggle-product]').forEach(input => {
      input.addEventListener('change', () => toggleProductAvailable(input.dataset.toggleProduct, input.checked));
    });
    productsTbody.querySelectorAll('[data-edit-product]').forEach(btn => {
      btn.addEventListener('click', () => openProductModal(btn.dataset.editProduct));
    });
    productsTbody.querySelectorAll('[data-delete-product]').forEach(btn => {
      btn.addEventListener('click', () => confirmDeleteProduct(btn.dataset.deleteProduct));
    });
  }

  // ================ RENDER SERVICIOS ================
  function renderServices() {
    const term = (searchServices.value || '').toLowerCase().trim();
    const filtered = term
      ? servicesData.filter(s =>
          s.title.toLowerCase().includes(term) ||
          s.description.toLowerCase().includes(term)
        )
      : servicesData;

    if (filtered.length === 0) {
      servicesTbody.innerHTML = `
        <tr><td colspan="5">
          <div class="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
            <h3>${term ? 'No hay servicios que coincidan' : 'Aún no hay servicios'}</h3>
            <p>${term ? 'Prueba con otro término' : 'Agrega tu primer servicio'}</p>
          </div>
        </td></tr>
      `;
      return;
    }

    servicesTbody.innerHTML = filtered.map(s => `
      <tr data-id="${escape(s.id)}">
        <td><strong>${s.displayOrder}</strong></td>
        <td>
          <div class="row-name">${escape(s.title)}</div>
          <div class="row-meta">${escape(s.id)}</div>
        </td>
        <td style="color: var(--fg-2); font-size: 13px;">${escape(s.description.substring(0, 80))}${s.description.length > 80 ? '...' : ''}</td>
        <td>
          <label class="toggle-switch">
            <input type="checkbox" ${s.isActive ? 'checked' : ''} data-toggle-service="${escape(s.id)}">
            <span class="toggle-slider"></span>
          </label>
        </td>
        <td>
          <div class="row-actions">
            <button class="row-action-btn edit" data-edit-service="${escape(s.id)}" title="Editar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="row-action-btn delete" data-delete-service="${escape(s.id)}" title="Eliminar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    servicesTbody.querySelectorAll('[data-toggle-service]').forEach(input => {
      input.addEventListener('change', () => toggleServiceActive(input.dataset.toggleService, input.checked));
    });
    servicesTbody.querySelectorAll('[data-edit-service]').forEach(btn => {
      btn.addEventListener('click', () => openServiceModal(btn.dataset.editService));
    });
    servicesTbody.querySelectorAll('[data-delete-service]').forEach(btn => {
      btn.addEventListener('click', () => confirmDeleteService(btn.dataset.deleteService));
    });
  }

  // ================ MODALES ================
  function openModal(id) { document.getElementById(id).classList.add('show'); }
  function closeModal(id) { document.getElementById(id).classList.remove('show'); }

  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.dataset.closeModal));
  });
  document.querySelectorAll('.modal-backdrop').forEach(bd => {
    bd.addEventListener('click', e => {
      if (e.target === bd) closeModal(bd.id);
    });
  });

  // ================ MODAL PRODUCTO ================
  const productForm = document.getElementById('productForm');
  const imageInput = document.getElementById('productImageInput');
  const imagePreview = document.getElementById('imagePreview');
  const imageUploadLabel = document.getElementById('imageUploadLabel');
  const imageUploadPrompt = document.getElementById('imageUploadPrompt');
  const imageUploadPreview = document.getElementById('imageUploadPreview');
  const imageRemoveBtn = document.getElementById('imageRemoveBtn');

  document.getElementById('addProductBtn').addEventListener('click', () => openProductModal(null));

  function openProductModal(productId) {
    productForm.reset();
    imageFile = null;
    imageFileToDelete = null;
    showImagePrompt();

    const isEdit = !!productId;
    document.getElementById('productModalTitle').textContent = isEdit ? 'Editar producto' : 'Nuevo producto';
    document.getElementById('saveProductText').textContent = isEdit ? 'Guardar cambios' : 'Crear producto';

    if (isEdit) {
      const p = productsData.find(x => x.id === productId);
      if (!p) return;
      document.getElementById('productId').value = p.id;
      document.getElementById('productName').value = p.name;
      document.getElementById('productBrand').value = p.brand;
      document.getElementById('productCategory').value = p.category;
      document.getElementById('productCondition').value = p.condition;
      document.getElementById('productPrice').value = p.price;
      document.getElementById('productDescription').value = p.description;
      document.getElementById('productLongDescription').value = p.longDescription;
      document.getElementById('productWarranty').value = p.warranty;
      document.getElementById('productSku').value = p.sku;
      document.getElementById('productIcon').value = p.iconType;
      document.getElementById('productAvailable').checked = p.available;
      document.getElementById('productImageUrl').value = p.imageUrl || '';
      if (p.imageUrl) {
        showImagePreview(p.imageUrl);
      }
    } else {
      document.getElementById('productId').value = '';
      document.getElementById('productAvailable').checked = true;
      document.getElementById('productImageUrl').value = '';
    }

    openModal('productModal');
  }

  imageInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast('La imagen es muy grande. Máximo 5MB.', 'error');
      imageInput.value = '';
      return;
    }
    imageFile = file;
    // Si había una imagen antes, marcarla para borrar al guardar
    const currentUrl = document.getElementById('productImageUrl').value;
    if (currentUrl) imageFileToDelete = currentUrl;
    // Vista previa
    const reader = new FileReader();
    reader.onload = ev => showImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  });

  imageRemoveBtn.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    const currentUrl = document.getElementById('productImageUrl').value;
    if (currentUrl) imageFileToDelete = currentUrl;
    document.getElementById('productImageUrl').value = '';
    imageFile = null;
    imageInput.value = '';
    showImagePrompt();
  });

  function showImagePreview(src) {
    imagePreview.src = src;
    imageUploadPrompt.style.display = 'none';
    imageUploadPreview.style.display = 'block';
    imageUploadLabel.classList.add('has-image');
  }

  function showImagePrompt() {
    imagePreview.src = '';
    imageUploadPrompt.style.display = 'flex';
    imageUploadPreview.style.display = 'none';
    imageUploadLabel.classList.remove('has-image');
  }

  document.getElementById('saveProductBtn').addEventListener('click', async () => {
    if (!productForm.checkValidity()) {
      productForm.reportValidity();
      return;
    }

    const btn = document.getElementById('saveProductBtn');
    const txt = document.getElementById('saveProductText');
    btn.disabled = true;
    txt.textContent = 'Guardando...';

    try {
      const formData = {
        name: document.getElementById('productName').value.trim(),
        brand: document.getElementById('productBrand').value.trim(),
        category: document.getElementById('productCategory').value,
        categoryLabel: getCategoryLabel(document.getElementById('productCategory').value),
        condition: document.getElementById('productCondition').value,
        price: parseFloat(document.getElementById('productPrice').value) || 0,
        available: document.getElementById('productAvailable').checked,
        description: document.getElementById('productDescription').value.trim(),
        longDescription: document.getElementById('productLongDescription').value.trim(),
        warranty: document.getElementById('productWarranty').value.trim(),
        sku: document.getElementById('productSku').value.trim(),
        iconType: document.getElementById('productIcon').value,
        imageUrl: document.getElementById('productImageUrl').value,
      };

      const editId = document.getElementById('productId').value;
      const newId = editId || generateId(formData.name);

      // Subir imagen si hay
      if (imageFile) {
        txt.textContent = 'Subiendo imagen...';
        formData.imageUrl = await uploadProductImage(imageFile, newId);
      }

      if (editId) {
        await updateProduct(editId, formData);
        toast('Producto actualizado', 'success');
      } else {
        formData.id = newId;
        formData.addedDate = new Date().toISOString().split('T')[0];
        await createProduct(formData);
        toast('Producto creado', 'success');
      }

      // Borrar imagen vieja si fue reemplazada
      if (imageFileToDelete && imageFileToDelete !== formData.imageUrl) {
        await deleteProductImage(imageFileToDelete);
      }

      closeModal('productModal');
      await loadProducts();
      updateStats();
    } catch (e) {
      console.error(e);
      toast('Error: ' + (e.message || 'No se pudo guardar'), 'error');
    } finally {
      btn.disabled = false;
      txt.textContent = editId ? 'Guardar cambios' : 'Crear producto';
    }
  });

  // ================ MODAL SERVICIO ================
  const serviceForm = document.getElementById('serviceForm');

  document.getElementById('addServiceBtn').addEventListener('click', () => openServiceModal(null));

  function openServiceModal(serviceId) {
    serviceForm.reset();
    const isEdit = !!serviceId;
    document.getElementById('serviceModalTitle').textContent = isEdit ? 'Editar servicio' : 'Nuevo servicio';
    document.getElementById('saveServiceText').textContent = isEdit ? 'Guardar cambios' : 'Crear servicio';

    if (isEdit) {
      const s = servicesData.find(x => x.id === serviceId);
      if (!s) return;
      document.getElementById('serviceId').value = s.id;
      document.getElementById('serviceTitle').value = s.title;
      document.getElementById('serviceDescription').value = s.description;
      document.getElementById('serviceWhatsapp').value = s.whatsappMessage;
      document.getElementById('serviceOrder').value = s.displayOrder;
      document.getElementById('serviceActive').checked = s.isActive;
    } else {
      document.getElementById('serviceId').value = '';
      const maxOrder = servicesData.reduce((max, s) => Math.max(max, s.displayOrder || 0), 0);
      document.getElementById('serviceOrder').value = maxOrder + 1;
      document.getElementById('serviceActive').checked = true;
    }

    openModal('serviceModal');
  }

  document.getElementById('saveServiceBtn').addEventListener('click', async () => {
    if (!serviceForm.checkValidity()) {
      serviceForm.reportValidity();
      return;
    }

    const btn = document.getElementById('saveServiceBtn');
    const txt = document.getElementById('saveServiceText');
    btn.disabled = true;
    txt.textContent = 'Guardando...';

    try {
      const formData = {
        title: document.getElementById('serviceTitle').value.trim(),
        description: document.getElementById('serviceDescription').value.trim(),
        whatsappMessage: document.getElementById('serviceWhatsapp').value.trim() || `Hola, quiero cotizar ${document.getElementById('serviceTitle').value.trim()}`,
        displayOrder: parseInt(document.getElementById('serviceOrder').value) || 0,
        isActive: document.getElementById('serviceActive').checked,
      };

      const editId = document.getElementById('serviceId').value;

      if (editId) {
        await updateService(editId, formData);
        toast('Servicio actualizado', 'success');
      } else {
        formData.id = generateId(formData.title);
        await createService(formData);
        toast('Servicio creado', 'success');
      }

      closeModal('serviceModal');
      await loadServices();
      updateStats();
    } catch (e) {
      console.error(e);
      toast('Error: ' + (e.message || 'No se pudo guardar'), 'error');
    } finally {
      btn.disabled = false;
      txt.textContent = editId ? 'Guardar cambios' : 'Crear servicio';
    }
  });

  // ================ TOGGLES ================
  async function toggleProductAvailable(id, value) {
    try {
      await updateProduct(id, { available: value });
      const p = productsData.find(x => x.id === id);
      if (p) p.available = value;
      updateStats();
      toast(value ? 'Producto disponible' : 'Producto agotado', 'success');
    } catch (e) {
      toast('Error al cambiar disponibilidad', 'error');
      loadProducts();
    }
  }

  async function toggleServiceActive(id, value) {
    try {
      await updateService(id, { isActive: value });
      const s = servicesData.find(x => x.id === id);
      if (s) s.isActive = value;
      updateStats();
      toast(value ? 'Servicio activado' : 'Servicio desactivado', 'success');
    } catch (e) {
      toast('Error al cambiar estado', 'error');
      loadServices();
    }
  }

  // ================ DELETE ================
  function confirmDeleteProduct(id) {
    const p = productsData.find(x => x.id === id);
    if (!p) return;
    showConfirm(
      'Eliminar producto',
      `¿Seguro que quieres eliminar "${p.name}"? Esta acción no se puede deshacer.`,
      async () => {
        try {
          if (p.imageUrl) await deleteProductImage(p.imageUrl);
          await deleteProduct(id);
          toast('Producto eliminado', 'success');
          await loadProducts();
          updateStats();
        } catch (e) {
          toast('Error al eliminar', 'error');
        }
      }
    );
  }

  function confirmDeleteService(id) {
    const s = servicesData.find(x => x.id === id);
    if (!s) return;
    showConfirm(
      'Eliminar servicio',
      `¿Seguro que quieres eliminar "${s.title}"? Esta acción no se puede deshacer.`,
      async () => {
        try {
          await deleteService(id);
          toast('Servicio eliminado', 'success');
          await loadServices();
          updateStats();
        } catch (e) {
          toast('Error al eliminar', 'error');
        }
      }
    );
  }

  function showConfirm(title, message, callback) {
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMessage').textContent = message;
    confirmCallback = callback;
    openModal('confirmModal');
  }

  document.getElementById('confirmActionBtn').addEventListener('click', async () => {
    if (confirmCallback) {
      const cb = confirmCallback;
      confirmCallback = null;
      closeModal('confirmModal');
      await cb();
    }
  });

  // ================ BÚSQUEDA ================
  searchProducts.addEventListener('input', renderProducts);
  searchServices.addEventListener('input', renderServices);

  // ================ HELPERS ================
  function escape(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function getCategoryLabel(cat) {
    const map = {
      laptops: 'Laptops',
      desktops: 'Computadoras',
      components: 'Componentes',
      monitors: 'Monitores',
      accessories: 'Accesorios',
      printers: 'Impresoras',
    };
    return map[cat] || cat;
  }

  function generateId(name) {
    const slug = name.toLowerCase()
      .replace(/[áàä]/g,'a').replace(/[éèë]/g,'e').replace(/[íìï]/g,'i')
      .replace(/[óòö]/g,'o').replace(/[úùü]/g,'u').replace(/ñ/g,'n')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').substring(0, 30);
    const suffix = Math.random().toString(36).substring(2, 6);
    return `${slug}-${suffix}`;
  }

  function toast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = message;
    container.appendChild(el);
    setTimeout(() => {
      el.classList.add('exiting');
      setTimeout(() => el.remove(), 300);
    }, 3000);
  }

  // ================ INICIAR ================
  loadAll();
})();
