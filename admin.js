// ================================================
// ROMANA COMPUSERVICE - LÓGICA DEL PANEL ADMIN
// ================================================

(function() {
  'use strict';

  // Estado de la app
  const state = {
    user: null,
    products: [],
    services: [],
    currentImageFile: null,
    currentImageUrl: null,
    activeTab: 'products',
  };

  // === ELEMENTOS ===
  const loginScreen = document.getElementById('loginScreen');
  const adminApp = document.getElementById('adminApp');
  const loginForm = document.getElementById('loginForm');
  const loginError = document.getElementById('loginError');
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  const productsList = document.getElementById('productsList');
  const productsLoading = document.getElementById('productsLoading');
  const productsEmpty = document.getElementById('productsEmpty');
  const productsCount = document.getElementById('productsCount');

  const servicesList = document.getElementById('servicesList');
  const servicesLoading = document.getElementById('servicesLoading');
  const servicesEmpty = document.getElementById('servicesEmpty');
  const servicesCount = document.getElementById('servicesCount');

  const productModal = document.getElementById('productModal');
  const productForm = document.getElementById('productForm');
  const productModalTitle = document.getElementById('productModalTitle');

  const serviceModal = document.getElementById('serviceModal');
  const serviceForm = document.getElementById('serviceForm');
  const serviceModalTitle = document.getElementById('serviceModalTitle');

  const imagePreview = document.getElementById('imagePreview');
  const productImageInput = document.getElementById('productImage');
  const uploadImageBtn = document.getElementById('uploadImageBtn');
  const removeImageBtn = document.getElementById('removeImageBtn');

  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');

  // === HELPERS UI ===
  function showToast(message, isError = false) {
    toastMessage.textContent = message;
    toast.classList.toggle('toast-error', isError);
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 3500);
  }

  function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
  }
  function hideError(element) {
    element.style.display = 'none';
  }

  function openModal(modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
  function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  // Cerrar modales al hacer clic en backdrop o botón cerrar
  document.querySelectorAll('[data-close-modal]').forEach(el => {
    el.addEventListener('click', () => {
      closeModal(productModal);
      closeModal(serviceModal);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(productModal);
      closeModal(serviceModal);
    }
  });

  // === LOGIN ===
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError(loginError);
    loginBtn.disabled = true;
    loginBtn.querySelector('span').textContent = 'Entrando...';

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const { data, error } = await loginAdmin(email, password);

    loginBtn.disabled = false;
    loginBtn.querySelector('span').textContent = 'Entrar al panel';

    if (error) {
      showError(loginError, 'Email o contraseña incorrectos.');
      return;
    }

    state.user = data.user;
    enterAdmin();
  });

  // === LOGOUT ===
  logoutBtn.addEventListener('click', async () => {
    if (!confirm('¿Cerrar sesión?')) return;
    await logoutAdmin();
    state.user = null;
    adminApp.style.display = 'none';
    loginScreen.style.display = 'flex';
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
  });

  // === ENTRAR AL ADMIN (después de login exitoso) ===
  async function enterAdmin() {
    loginScreen.style.display = 'none';
    adminApp.style.display = 'flex';
    await loadProducts();
    await loadServices();
  }

  // === TABS ===
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      document.querySelectorAll('.admin-tab').forEach(t => t.classList.toggle('active', t === tab));
      document.querySelectorAll('.admin-tab-content').forEach(c => {
        c.classList.toggle('active', c.id === `${target}Tab`);
      });
      state.activeTab = target;
    });
  });

  // === PRODUCTOS ===
  async function loadProducts() {
    productsLoading.style.display = 'block';
    productsList.style.display = 'none';
    productsEmpty.style.display = 'none';

    state.products = await fetchAllProducts();
    productsCount.textContent = state.products.length;

    productsLoading.style.display = 'none';

    if (state.products.length === 0) {
      productsEmpty.style.display = 'block';
    } else {
      renderProducts();
      productsList.style.display = 'grid';
    }
  }

  function renderProducts() {
    productsList.innerHTML = state.products.map(p => `
      <div class="admin-item">
        <div class="admin-item-image">
          ${p.imageUrl
            ? `<img src="${escapeHtml(p.imageUrl)}" alt="${escapeHtml(p.name)}">`
            : (productIcons[p.iconType] || productIcons.laptop)
          }
        </div>
        <div class="admin-item-info">
          <div class="admin-item-meta">${escapeHtml(p.brand)} · ${escapeHtml(p.categoryLabel)} · ${p.sku || '—'}</div>
          <div class="admin-item-name">
            ${escapeHtml(p.name)}
            <div class="admin-item-badges">
              <span class="mini-badge ${p.condition === 'new' ? 'mini-badge-new' : 'mini-badge-used'}">${p.condition === 'new' ? 'Nuevo' : 'Usado'}</span>
              <span class="mini-badge ${p.available ? 'mini-badge-available' : 'mini-badge-out'}">${p.available ? 'Disponible' : 'Agotado'}</span>
            </div>
          </div>
          <div class="admin-item-desc">${escapeHtml(p.description)}</div>
          <div class="admin-item-price">${formatPrice(p.price)}</div>
        </div>
        <div class="admin-item-actions">
          <button class="icon-btn icon-btn-toggle ${p.available ? 'active' : ''}" data-action="toggle-availability" data-id="${p.id}" title="${p.available ? 'Marcar agotado' : 'Marcar disponible'}">
            ${p.available
              ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>'
              : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
            }
          </button>
          <button class="icon-btn" data-action="edit" data-id="${p.id}" title="Editar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="icon-btn icon-btn-danger" data-action="delete" data-id="${p.id}" title="Eliminar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </div>
    `).join('');

    // Bind acciones
    productsList.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', handleProductAction);
    });
  }

  async function handleProductAction(e) {
    const action = e.currentTarget.dataset.action;
    const id = e.currentTarget.dataset.id;
    const product = state.products.find(p => p.id === id);
    if (!product) return;

    if (action === 'toggle-availability') {
      const { error } = await updateProduct(id, { available: !product.available });
      if (error) {
        showToast('Error al cambiar disponibilidad: ' + error.message, true);
      } else {
        showToast(product.available ? 'Marcado como agotado' : 'Marcado como disponible');
        await loadProducts();
      }
    } else if (action === 'edit') {
      openProductForm(product);
    } else if (action === 'delete') {
      if (!confirm(`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`)) return;
      const { error } = await deleteProduct(id);
      if (error) {
        showToast('Error al eliminar: ' + error.message, true);
      } else {
        // Limpiar la imagen si existía
        if (product.imageUrl) await deleteProductImage(product.imageUrl);
        showToast('Producto eliminado');
        await loadProducts();
      }
    }
  }

  // === FORMULARIO DE PRODUCTO ===
  document.getElementById('addProductBtn').addEventListener('click', () => {
    openProductForm(null);
  });

  function openProductForm(product) {
    state.currentImageFile = null;
    state.currentImageUrl = product?.imageUrl || null;

    productModalTitle.textContent = product ? 'Editar producto' : 'Agregar producto';
    document.getElementById('productEditingId').value = product?.id || '';
    document.getElementById('productName').value = product?.name || '';
    document.getElementById('productBrand').value = product?.brand || '';
    document.getElementById('productCategory').value = product?.category || '';
    document.getElementById('productCondition').value = product?.condition || 'new';
    document.getElementById('productPrice').value = product?.price || '';
    document.getElementById('productSku').value = product?.sku || '';
    document.getElementById('productWarranty').value = product?.warranty || '';
    document.getElementById('productIconType').value = product?.iconType || 'laptop';
    document.getElementById('productDescription').value = product?.description || '';
    document.getElementById('productLongDescription').value = product?.longDescription || '';
    document.getElementById('productAvailable').checked = product?.available !== false;

    updateImagePreview(product?.imageUrl);
    hideError(document.getElementById('productFormError'));
    openModal(productModal);
  }

  function updateImagePreview(imageUrl) {
    if (imageUrl) {
      imagePreview.innerHTML = `<img src="${escapeHtml(imageUrl)}" alt="Preview">`;
      removeImageBtn.style.display = 'inline-flex';
    } else {
      imagePreview.innerHTML = `
        <span class="image-preview-placeholder">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          <span>Sin foto</span>
        </span>`;
      removeImageBtn.style.display = 'none';
    }
  }

  uploadImageBtn.addEventListener('click', () => productImageInput.click());

  productImageInput.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('La foto no puede pesar más de 5 MB', true);
      productImageInput.value = '';
      return;
    }

    state.currentImageFile = file;
    // Vista previa local
    const reader = new FileReader();
    reader.onload = (ev) => updateImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  });

  removeImageBtn.addEventListener('click', () => {
    state.currentImageFile = null;
    state.currentImageUrl = null;
    productImageInput.value = '';
    updateImagePreview(null);
  });

  productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError(document.getElementById('productFormError'));

    const editingId = document.getElementById('productEditingId').value;
    const isEditing = !!editingId;
    const saveBtn = document.getElementById('saveProductBtn');
    saveBtn.disabled = true;
    saveBtn.querySelector('span').textContent = 'Guardando...';

    try {
      const categorySelect = document.getElementById('productCategory');
      const categoryLabel = categorySelect.options[categorySelect.selectedIndex].dataset.label;

      const productData = {
        name: document.getElementById('productName').value.trim(),
        brand: document.getElementById('productBrand').value.trim(),
        category: categorySelect.value,
        categoryLabel: categoryLabel,
        condition: document.getElementById('productCondition').value,
        price: parseFloat(document.getElementById('productPrice').value) || 0,
        sku: document.getElementById('productSku').value.trim(),
        warranty: document.getElementById('productWarranty').value.trim(),
        iconType: document.getElementById('productIconType').value,
        description: document.getElementById('productDescription').value.trim(),
        longDescription: document.getElementById('productLongDescription').value.trim(),
        available: document.getElementById('productAvailable').checked,
      };

      // ID: si es nuevo, generamos; si es edición, mantenemos el original
      const productId = isEditing ? editingId : generateProductId(productData.name);

      // Manejar imagen
      let imageUrl = state.currentImageUrl;

      // Si hay archivo nuevo, subirlo
      if (state.currentImageFile) {
        // Si había una imagen anterior, eliminarla primero
        if (isEditing) {
          const oldProduct = state.products.find(p => p.id === editingId);
          if (oldProduct?.imageUrl) {
            await deleteProductImage(oldProduct.imageUrl);
          }
        }
        const { url, error: uploadError } = await uploadProductImage(state.currentImageFile, productId);
        if (uploadError) throw new Error('Error subiendo foto: ' + uploadError.message);
        imageUrl = url;
      } else if (state.currentImageUrl === null && isEditing) {
        // Usuario quitó la imagen
        const oldProduct = state.products.find(p => p.id === editingId);
        if (oldProduct?.imageUrl) {
          await deleteProductImage(oldProduct.imageUrl);
        }
        imageUrl = '';
      }

      productData.imageUrl = imageUrl || '';

      // Guardar en BD
      let result;
      if (isEditing) {
        result = await updateProduct(editingId, productData);
      } else {
        productData.id = productId;
        result = await createProduct(productData);
      }

      if (result.error) throw new Error(result.error.message);

      showToast(isEditing ? 'Producto actualizado' : 'Producto agregado');
      closeModal(productModal);
      await loadProducts();
    } catch (err) {
      showError(document.getElementById('productFormError'), err.message);
    } finally {
      saveBtn.disabled = false;
      saveBtn.querySelector('span').textContent = 'Guardar producto';
    }
  });

  // === SERVICIOS ===
  async function loadServices() {
    servicesLoading.style.display = 'block';
    servicesList.style.display = 'none';
    servicesEmpty.style.display = 'none';

    state.services = await fetchAllServices();
    servicesCount.textContent = state.services.length;

    servicesLoading.style.display = 'none';

    if (state.services.length === 0) {
      servicesEmpty.style.display = 'block';
    } else {
      renderServices();
      servicesList.style.display = 'grid';
    }
  }

  function renderServices() {
    servicesList.innerHTML = state.services.map(s => `
      <div class="admin-item">
        <div class="admin-item-image">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
        </div>
        <div class="admin-item-info">
          <div class="admin-item-meta">SERVICIO · ORDEN ${s.display_order}</div>
          <div class="admin-item-name">
            ${escapeHtml(s.title)}
            <div class="admin-item-badges">
              <span class="mini-badge ${s.is_active ? 'mini-badge-available' : 'mini-badge-out'}">${s.is_active ? 'Activo' : 'Oculto'}</span>
            </div>
          </div>
          <div class="admin-item-desc">${escapeHtml(s.description)}</div>
        </div>
        <div class="admin-item-actions">
          <button class="icon-btn icon-btn-toggle ${s.is_active ? 'active' : ''}" data-action="toggle-active" data-id="${s.id}" title="${s.is_active ? 'Ocultar' : 'Activar'}">
            ${s.is_active
              ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>'
              : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>'
            }
          </button>
          <button class="icon-btn" data-action="edit" data-id="${s.id}" title="Editar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="icon-btn icon-btn-danger" data-action="delete" data-id="${s.id}" title="Eliminar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </div>
    `).join('');

    servicesList.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', handleServiceAction);
    });
  }

  async function handleServiceAction(e) {
    const action = e.currentTarget.dataset.action;
    const id = e.currentTarget.dataset.id;
    const service = state.services.find(s => s.id === id);
    if (!service) return;

    if (action === 'toggle-active') {
      const { error } = await updateService(id, { is_active: !service.is_active });
      if (error) {
        showToast('Error: ' + error.message, true);
      } else {
        showToast(service.is_active ? 'Servicio ocultado' : 'Servicio activado');
        await loadServices();
      }
    } else if (action === 'edit') {
      openServiceForm(service);
    } else if (action === 'delete') {
      if (!confirm(`¿Eliminar el servicio "${service.title}"? No se puede deshacer.`)) return;
      const { error } = await deleteService(id);
      if (error) {
        showToast('Error al eliminar: ' + error.message, true);
      } else {
        showToast('Servicio eliminado');
        await loadServices();
      }
    }
  }

  document.getElementById('addServiceBtn').addEventListener('click', () => {
    openServiceForm(null);
  });

  function openServiceForm(service) {
    serviceModalTitle.textContent = service ? 'Editar servicio' : 'Agregar servicio';
    document.getElementById('serviceEditingId').value = service?.id || '';
    document.getElementById('serviceTitle').value = service?.title || '';
    document.getElementById('serviceDescription').value = service?.description || '';
    document.getElementById('serviceOrder').value = service?.display_order ?? state.services.length + 1;
    document.getElementById('serviceActive').checked = service ? service.is_active : true;
    document.getElementById('serviceWhatsapp').value = service?.whatsapp_message || '';
    hideError(document.getElementById('serviceFormError'));
    openModal(serviceModal);
  }

  serviceForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError(document.getElementById('serviceFormError'));

    const editingId = document.getElementById('serviceEditingId').value;
    const isEditing = !!editingId;
    const saveBtn = document.getElementById('saveServiceBtn');
    saveBtn.disabled = true;
    saveBtn.querySelector('span').textContent = 'Guardando...';

    try {
      const serviceData = {
        title: document.getElementById('serviceTitle').value.trim(),
        description: document.getElementById('serviceDescription').value.trim(),
        display_order: parseInt(document.getElementById('serviceOrder').value, 10) || 0,
        is_active: document.getElementById('serviceActive').checked,
        whatsapp_message: document.getElementById('serviceWhatsapp').value.trim(),
      };

      let result;
      if (isEditing) {
        result = await updateService(editingId, serviceData);
      } else {
        serviceData.id = generateServiceId(serviceData.title);
        result = await createService(serviceData);
      }

      if (result.error) throw new Error(result.error.message);

      showToast(isEditing ? 'Servicio actualizado' : 'Servicio agregado');
      closeModal(serviceModal);
      await loadServices();
    } catch (err) {
      showError(document.getElementById('serviceFormError'), err.message);
    } finally {
      saveBtn.disabled = false;
      saveBtn.querySelector('span').textContent = 'Guardar servicio';
    }
  });

  // === HELPERS ===
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function generateProductId(name) {
    const slug = name.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .substring(0, 40);
    return `${slug}-${Date.now().toString(36)}`;
  }

  function generateServiceId(title) {
    const slug = title.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .substring(0, 30);
    return `${slug}-${Date.now().toString(36)}`;
  }

  // === INICIO: verificar si ya hay sesión activa ===
  (async function init() {
    const { user } = await getCurrentUser();
    if (user) {
      state.user = user;
      enterAdmin();
    } else {
      loginScreen.style.display = 'flex';
    }
  })();

})();
