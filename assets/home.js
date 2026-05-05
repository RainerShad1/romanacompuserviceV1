// ================================================
// ROMANA COMPUSERVICE - LÓGICA DE LA HOME
// Carga productos destacados y servicios desde Supabase
// ================================================

(function() {

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function renderFeaturedCard(product) {
    const badgeClass = product.condition === 'new' ? 'badge-new' : 'badge-used';
    const badgeKey = product.condition === 'new' ? 'badge-new' : 'badge-used';
    const badgeText = t(badgeKey);

    const availLabel = product.available ? t('cat-avail-yes') : t('cat-avail-no');
    const availClass = product.available ? 'available' : 'out-of-stock';

    const imageContent = product.imageUrl
      ? `<img src="${escapeHtml(product.imageUrl)}" alt="${escapeHtml(product.name)}" loading="lazy">`
      : (productIcons[product.iconType] || productIcons.laptop);

    const priceText = `${formatPrice(product.price)}<small>${product.condition === 'new' ? t('price-include') : t('price-include-2')}</small>`;

    return `
      <a href="producto.html?id=${encodeURIComponent(product.id)}" class="product-card">
        <div class="product-image-wrap">
          <span class="product-badge ${badgeClass}">${badgeText}</span>
          <span class="product-availability ${availClass}"><span class="dot"></span><span>${availLabel}</span></span>
          ${imageContent}
        </div>
        <div class="product-meta">${escapeHtml(product.brand.toUpperCase())} · ${escapeHtml(product.categoryLabel.toUpperCase())}</div>
        <h3 class="product-name">${escapeHtml(product.name)}</h3>
        <p class="product-desc">${escapeHtml(product.description)}</p>
        <div class="product-footer">
          <div class="product-price">${priceText}</div>
          <span class="product-cta">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </span>
        </div>
      </a>
    `;
  }

  function renderExploreCard() {
    return `
      <a href="catalogo.html" class="product-card product-card-cta">
        <div class="product-cta-inner">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <h3 data-i18n="explore-title">${t('explore-title')}</h3>
          <p data-i18n="explore-desc">${t('explore-desc')}</p>
        </div>
      </a>
    `;
  }

  async function loadFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;

    const allProducts = await fetchAllProducts();

    // Filtrar productos no-pendientes y disponibles, tomar máximo 2 destacados
    const featured = allProducts
      .filter(p => !p.isPending && p.available)
      .sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate))
      .slice(0, 2);

    if (featured.length === 0) {
      // Si no hay productos, ocultar la sección
      const section = document.getElementById('destacados');
      if (section) section.style.display = 'none';
      return;
    }

    container.innerHTML = featured.map(renderFeaturedCard).join('') + renderExploreCard();
  }

  async function loadServices() {
    const grid = document.querySelector('.services-grid');
    if (!grid) return;

    const services = await fetchAllServices();
    const activeServices = services.filter(s => s.is_active);

    if (activeServices.length === 0) {
      const section = document.getElementById('servicios');
      if (section) section.style.display = 'none';
      return;
    }

    const total = activeServices.length;
    grid.innerHTML = activeServices.map((s, idx) => {
      const num = String(idx + 1).padStart(2, '0');
      const totalStr = String(total).padStart(2, '0');
      const waMsg = s.whatsapp_message || `Hola, quiero cotizar ${s.title.toLowerCase()}`;
      const waLink = `https://wa.me/18297538736?text=${encodeURIComponent(waMsg)}`;

      return `
        <div class="service-card">
          <div class="service-num">${num} / ${totalStr}</div>
          <h3 class="service-title">${escapeHtml(s.title)}</h3>
          <p class="service-desc">${escapeHtml(s.description)}</p>
          <a href="${waLink}" target="_blank" rel="noopener" class="service-cta">
            <span data-i18n="serv-cta">${t('serv-cta')}</span>
          </a>
        </div>
      `;
    }).join('');
  }

  // Cargar todo cuando el DOM esté listo
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      loadFeaturedProducts();
      loadServices();
    }, 100);
  });

})();
