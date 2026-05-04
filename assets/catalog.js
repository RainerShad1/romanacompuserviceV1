// ================================================
// RCRC COMPUSERVICE - LÓGICA DEL CATÁLOGO
// Búsqueda, filtros y ordenamiento
// ================================================

(function() {
  // Estado del catálogo
  const state = {
    search: '',
    categories: [],
    brands: [],
    conditions: [],
    availability: [true],   // por defecto, mostrar solo disponibles
    priceMin: null,
    priceMax: null,
    sort: 'relevance',
  };

  const grid = document.getElementById('productsGrid');
  const noResults = document.getElementById('noResults');
  const resultsCount = document.getElementById('resultsCount');
  const totalCount = document.getElementById('totalCount');
  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');
  const priceMinInput = document.getElementById('priceMin');
  const priceMaxInput = document.getElementById('priceMax');
  const clearBtn = document.getElementById('clearFilters');
  const filtersToggle = document.getElementById('filtersToggle');
  const filtersSidebar = document.getElementById('filtersSidebar');

  // === Generar filtros dinámicos basados en productos disponibles ===
  function buildDynamicFilters() {
    // Categorías únicas
    const categories = {};
    const brands = {};

    products.forEach(p => {
      categories[p.category] = (categories[p.category] || 0) + 1;
      brands[p.brand] = (brands[p.brand] || 0) + 1;
    });

    const categoryLabels = {
      laptops: 'Laptops',
      desktops: 'Computadoras',
      components: 'Componentes',
      monitors: 'Monitores',
      accessories: 'Accesorios',
    };

    const catContainer = document.getElementById('filterCategory');
    catContainer.innerHTML = Object.entries(categories).map(([cat, count]) => `
      <label class="filter-option">
        <input type="checkbox" value="${cat}" data-filter="category">
        <span>${categoryLabels[cat] || cat}</span>
        <span class="filter-count">${count}</span>
      </label>
    `).join('');

    const brandContainer = document.getElementById('filterBrand');
    brandContainer.innerHTML = Object.entries(brands).map(([brand, count]) => `
      <label class="filter-option">
        <input type="checkbox" value="${brand}" data-filter="brand">
        <span>${brand}</span>
        <span class="filter-count">${count}</span>
      </label>
    `).join('');

    // Re-bind eventos a los nuevos checkboxes
    document.querySelectorAll('input[data-filter]').forEach(input => {
      input.addEventListener('change', handleFilterChange);
    });
  }

  // === Filtrar y ordenar productos ===
  function getFilteredProducts() {
    let filtered = [...products];

    // Búsqueda
    if (state.search) {
      const term = state.search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.brand.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    }

    // Categorías
    if (state.categories.length > 0) {
      filtered = filtered.filter(p => state.categories.includes(p.category));
    }

    // Marcas
    if (state.brands.length > 0) {
      filtered = filtered.filter(p => state.brands.includes(p.brand));
    }

    // Condición
    if (state.conditions.length > 0) {
      filtered = filtered.filter(p => state.conditions.includes(p.condition));
    }

    // Disponibilidad
    if (state.availability.length > 0) {
      filtered = filtered.filter(p => state.availability.includes(p.available));
    }

    // Precio
    if (state.priceMin !== null) {
      filtered = filtered.filter(p => p.price >= state.priceMin);
    }
    if (state.priceMax !== null) {
      filtered = filtered.filter(p => p.price <= state.priceMax);
    }

    // Ordenamiento
    switch (state.sort) {
      case 'price-asc':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));
        break;
      default:
        // Relevancia: disponibles primero, no pendientes primero
        filtered.sort((a, b) => {
          if (a.isPending !== b.isPending) return a.isPending ? 1 : -1;
          if (a.available !== b.available) return a.available ? -1 : 1;
          return 0;
        });
    }

    return filtered;
  }

  // === Renderizar tarjeta de producto ===
  function renderProductCard(product) {
    const lang = getCurrentLang();
    const isPending = product.isPending;
    const badgeClass = isPending ? 'badge-pending' : (product.condition === 'new' ? 'badge-new' : 'badge-used');
    const badgeKey = isPending ? 'badge-pending' : (product.condition === 'new' ? 'badge-new' : 'badge-used');
    const badgeText = t(badgeKey);

    const availLabel = product.available ? t('cat-avail-yes') : t('cat-avail-no');
    const availClass = product.available ? 'available' : 'out-of-stock';

    const priceText = isPending
      ? `<span style="color: var(--fg-3); font-size: 14px;">RD$ —<small style="display:block; color: var(--fg-3);">${t('pending')}</small></span>`
      : `${formatPrice(product.price)}<small>${product.condition === 'new' ? t('price-include') : t('price-include-2')}</small>`;

    const icon = productIcons[product.iconType] || productIcons.laptop;

    const linkHref = isPending ? '#' : `producto.html?id=${product.id}`;
    const onClickStyle = isPending ? 'pointer-events: none; opacity: 0.6;' : '';

    return `
      <a href="${linkHref}" class="product-card" style="${onClickStyle}">
        <div class="product-image-wrap">
          <span class="product-badge ${badgeClass}">${badgeText}</span>
          ${!isPending ? `<span class="product-availability ${availClass}"><span class="dot"></span><span>${availLabel}</span></span>` : ''}
          ${icon}
        </div>
        <div class="product-meta">${product.brand.toUpperCase()} · ${product.categoryLabel.toUpperCase()}</div>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-desc">${product.description}</p>
        <div class="product-footer">
          <div class="product-price">${priceText}</div>
          <span class="product-cta">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </span>
        </div>
      </a>
    `;
  }

  // === Renderizar todo ===
  function render() {
    const filtered = getFilteredProducts();

    totalCount.textContent = products.length;
    resultsCount.textContent = filtered.length;

    if (filtered.length === 0) {
      grid.style.display = 'none';
      noResults.style.display = 'block';
    } else {
      grid.style.display = 'grid';
      noResults.style.display = 'none';
      grid.innerHTML = filtered.map(renderProductCard).join('');
    }
  }

  // === Handlers ===
  function handleFilterChange() {
    state.categories = Array.from(document.querySelectorAll('input[data-filter="category"]:checked')).map(i => i.value);
    state.brands = Array.from(document.querySelectorAll('input[data-filter="brand"]:checked')).map(i => i.value);
    state.conditions = Array.from(document.querySelectorAll('input[data-filter="condition"]:checked')).map(i => i.value);
    state.availability = Array.from(document.querySelectorAll('input[data-filter="availability"]:checked')).map(i => i.value === 'true');
    render();
  }

  searchInput.addEventListener('input', e => {
    state.search = e.target.value;
    render();
  });

  sortSelect.addEventListener('change', e => {
    state.sort = e.target.value;
    render();
  });

  priceMinInput.addEventListener('input', e => {
    state.priceMin = e.target.value ? parseFloat(e.target.value) : null;
    render();
  });

  priceMaxInput.addEventListener('input', e => {
    state.priceMax = e.target.value ? parseFloat(e.target.value) : null;
    render();
  });

  clearBtn.addEventListener('click', () => {
    document.querySelectorAll('input[data-filter]').forEach(i => {
      // Reset disponibilidad a "disponible" por defecto
      i.checked = (i.dataset.filter === 'availability' && i.value === 'true');
    });
    searchInput.value = '';
    priceMinInput.value = '';
    priceMaxInput.value = '';
    sortSelect.value = 'relevance';
    state.search = '';
    state.categories = [];
    state.brands = [];
    state.conditions = [];
    state.availability = [true];
    state.priceMin = null;
    state.priceMax = null;
    state.sort = 'relevance';
    render();
  });

  if (filtersToggle) {
    filtersToggle.addEventListener('click', () => {
      filtersSidebar.classList.toggle('open');
    });
  }

  // Re-render cuando cambia el idioma
  document.addEventListener('langChanged', render);

  // Inicializar
  buildDynamicFilters();
  // Re-aplicar el idioma a los checkboxes recién creados
  setTimeout(() => setLang(getCurrentLang()), 50);
  render();
})();
