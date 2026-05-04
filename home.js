// ================================================
// ROMANA COMPUSERVICE - PÁGINA DE PRODUCTO (DETALLE)
// Carga desde Supabase
// ================================================

(function() {
  const container = document.getElementById('productContent');

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function renderLoading() {
    container.innerHTML = `<div style="text-align: center; padding: 80px 20px; color: var(--fg-3); font-family: 'Space Mono', monospace;">Cargando producto...</div>`;
  }

  function renderNotFound() {
    container.innerHTML = `
      <div style="max-width: 600px; margin: 0 auto; text-align: center; padding: 80px 20px;">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color: var(--fg-3); margin-bottom: 24px;">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <h1 style="font-family: 'Archivo Black', sans-serif; font-size: 32px; margin-bottom: 16px;" data-i18n="prod-not-found-title">Producto no encontrado</h1>
        <p style="color: var(--fg-2); margin-bottom: 32px;" data-i18n="prod-not-found-desc">El producto que buscas no existe o fue removido.</p>
        <a href="catalogo.html" class="btn btn-primary" data-i18n="prod-back-catalog">← Volver al catálogo</a>
      </div>
    `;
    setLang(getCurrentLang());
  }

  function renderProduct(product) {
    const isPending = product.isPending;
    const badgeClass = isPending ? 'badge-pending' : (product.condition === 'new' ? 'badge-new' : 'badge-used');
    const badgeKey = isPending ? 'badge-pending' : (product.condition === 'new' ? 'badge-new' : 'badge-used');

    const availClass = product.available ? 'available' : 'out-of-stock';
    const availKey = product.available ? 'cat-avail-yes' : 'cat-avail-no';

    const imageContent = product.imageUrl
      ? `<img src="${escapeHtml(product.imageUrl)}" alt="${escapeHtml(product.name)}" style="width: 100%; height: 100%; object-fit: cover;">`
      : (productIcons[product.iconType] || productIcons.laptop);

    const whatsappLink = buildWhatsAppLink(product);

    container.innerHTML = `
      <div class="product-detail-grid">
        <div class="product-detail-image">
          ${imageContent}
          <span class="product-badge ${badgeClass}" style="position: absolute; top: 20px; left: 20px;" data-i18n="${badgeKey}">${t(badgeKey)}</span>
          ${!isPending ? `<span class="product-availability ${availClass}" style="position: absolute; top: 20px; right: 20px;"><span class="dot"></span><span data-i18n="${availKey}">${t(availKey)}</span></span>` : ''}
        </div>

        <div class="product-detail-info">
          <div class="breadcrumb">
            <a href="index.html" data-i18n="prod-breadcrumb-home">Inicio</a>
            <span> / </span>
            <a href="catalogo.html" data-i18n="prod-breadcrumb-cat">Catálogo</a>
            <span> / </span>
            <span>${escapeHtml(product.name)}</span>
          </div>

          <div class="product-detail-meta">${escapeHtml(product.brand)} · ${escapeHtml(product.categoryLabel)}</div>
          <h1 class="product-detail-name">${escapeHtml(product.name)}</h1>

          ${!isPending ? `
            <div class="product-detail-price">
              ${formatPrice(product.price)}
              <small>${product.condition === 'new' ? t('price-include') : t('price-include-2')}</small>
            </div>
          ` : `
            <div class="product-detail-price" style="color: var(--fg-3);">
              RD$ —
              <small data-i18n="pending">${t('pending')}</small>
            </div>
          `}

          <p class="product-detail-desc">${escapeHtml(product.longDescription || product.description)}</p>

          <ul class="product-specs">
            <li>
              <span class="spec-label" data-i18n="prod-spec-brand">Marca</span>
              <span class="spec-value">${escapeHtml(product.brand)}</span>
            </li>
            <li>
              <span class="spec-label" data-i18n="prod-spec-category">Categoría</span>
              <span class="spec-value">${escapeHtml(product.categoryLabel)}</span>
            </li>
            <li>
              <span class="spec-label" data-i18n="prod-spec-condition">Condición</span>
              <span class="spec-value" data-i18n="${product.condition === 'new' ? 'cat-cond-new' : 'cat-cond-used'}">${product.condition === 'new' ? t('cat-cond-new') : t('cat-cond-used')}</span>
            </li>
            ${product.warranty ? `
            <li>
              <span class="spec-label" data-i18n="prod-spec-warranty">Garantía</span>
              <span class="spec-value">${escapeHtml(product.warranty)}</span>
            </li>` : ''}
            <li>
              <span class="spec-label" data-i18n="prod-spec-availability">Disponibilidad</span>
              <span class="spec-value ${availClass}" data-i18n="${availKey}">${t(availKey)}</span>
            </li>
            ${product.sku ? `
            <li>
              <span class="spec-label" data-i18n="prod-spec-sku">Código</span>
              <span class="spec-value mono">${escapeHtml(product.sku)}</span>
            </li>` : ''}
          </ul>

          <div class="product-actions">
            ${!isPending && product.available ? `
              <a href="${whatsappLink}" target="_blank" rel="noopener" class="btn btn-primary">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 6.32A7.85 7.85 0 0012.05 4a7.94 7.94 0 00-6.88 11.91L4 20l4.2-1.1a7.93 7.93 0 003.85.98h.01a7.93 7.93 0 007.92-7.93 7.86 7.86 0 00-2.38-5.63z"/></svg>
                <span data-i18n="prod-cta-whatsapp">${t('prod-cta-whatsapp')}</span>
              </a>
              <a href="tel:+18297538736" class="btn btn-ghost">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <span data-i18n="prod-cta-call">${t('prod-cta-call')}</span>
              </a>
            ` : `
              <a href="catalogo.html" class="btn btn-ghost">
                <span data-i18n="prod-back-catalog">${t('prod-back-catalog')}</span>
              </a>
            `}
          </div>
        </div>
      </div>
    `;
    setLang(getCurrentLang());
  }

  // Cargar desde Supabase
  (async function init() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (!productId) {
      renderNotFound();
      return;
    }

    renderLoading();
    const product = await fetchProductById(productId);

    if (!product) {
      renderNotFound();
    } else {
      renderProduct(product);
      // Guardar referencia para re-render al cambiar idioma
      document.addEventListener('langChanged', () => renderProduct(product));
    }
  })();
})();
