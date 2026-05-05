// ================================================
// RCRC COMPUSERVICE - HOME (productos destacados y servicios desde Supabase)
// ================================================

(async function() {
  const featuredGrid = document.getElementById('featuredGrid');
  const servicesGrid = document.getElementById('servicesGrid');

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  // ================ DESTACADOS ================
  if (featuredGrid) {
    try {
      const allProducts = await fetchProducts();
      // Mostrar los 2 productos disponibles más recientes + tarjeta CTA
      const featured = allProducts
        .filter(p => p.available && !p.isPending)
        .slice(0, 2);

      const cards = featured.map(product => {
        const badgeClass = product.condition === 'new' ? 'badge-new' : 'badge-used';
        const badgeKey = product.condition === 'new' ? 'badge-new' : 'badge-used';

        const imageContent = product.imageUrl
          ? `<img src="${escapeHtml(product.imageUrl)}" alt="${escapeHtml(product.name)}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover;">`
          : (productIcons[product.iconType] || productIcons.laptop);

        return `
          <a href="producto.html?id=${encodeURIComponent(product.id)}" class="product-card">
            <div class="product-image-wrap">
              <span class="product-badge ${badgeClass}" data-i18n="${badgeKey}">${t(badgeKey)}</span>
              <span class="product-availability available"><span class="dot"></span><span data-i18n="avail-yes">${t('avail-yes')}</span></span>
              ${imageContent}
            </div>
            <div class="product-meta">${escapeHtml(product.brand.toUpperCase())} · ${escapeHtml(product.categoryLabel.toUpperCase())}</div>
            <h3 class="product-name">${escapeHtml(product.name)}</h3>
            <p class="product-desc">${escapeHtml(product.description)}</p>
            <div class="product-footer">
              <div class="product-price">
                ${formatPrice(product.price)}
                <small>${product.condition === 'new' ? t('price-include') : t('price-include-2')}</small>
              </div>
              <span class="product-cta">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </span>
            </div>
          </a>
        `;
      }).join('');

      // Tarjeta CTA "Explorar todo el catálogo"
      const ctaCard = `
        <a href="catalogo.html" class="product-card product-card-cta">
          <div class="product-cta-inner">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <h3 data-i18n="explore-title">${t('explore-title')}</h3>
            <p data-i18n="explore-desc">${t('explore-desc')}</p>
          </div>
        </a>
      `;

      featuredGrid.innerHTML = cards + ctaCard;
    } catch (e) {
      console.error('Error cargando destacados:', e);
      featuredGrid.innerHTML = '<p style="color: var(--fg-3); padding: 40px; text-align: center;">No se pudieron cargar los productos destacados.</p>';
    }
  }

  // ================ SERVICIOS ================
  if (servicesGrid) {
    try {
      const services = await fetchServices();
      const total = services.length;

      if (services.length === 0) {
        servicesGrid.innerHTML = '<p style="color: var(--fg-3); padding: 40px; text-align: center; grid-column: 1/-1;">No hay servicios activos en este momento.</p>';
      } else {
        servicesGrid.innerHTML = services.map((service, idx) => {
          const num = String(idx + 1).padStart(2, '0');
          const totalStr = String(total).padStart(2, '0');
          const waLink = `https://wa.me/18297538736?text=${encodeURIComponent(service.whatsappMessage || `Hola, quiero cotizar ${service.title}`)}`;

          return `
            <div class="service-card">
              <div class="service-num">${num} / ${totalStr}</div>
              <h3 class="service-title">${escapeHtml(service.title)}</h3>
              <p class="service-desc">${escapeHtml(service.description)}</p>
              <a href="${waLink}" target="_blank" rel="noopener" class="service-cta">
                <span data-i18n="serv-cta">${t('serv-cta')}</span>
              </a>
            </div>
          `;
        }).join('');
      }
    } catch (e) {
      console.error('Error cargando servicios:', e);
      servicesGrid.innerHTML = '<p style="color: var(--fg-3); padding: 40px; text-align: center; grid-column: 1/-1;">No se pudieron cargar los servicios.</p>';
    }
  }

  // Re-aplicar idioma al contenido nuevo
  setTimeout(() => setLang(getCurrentLang()), 50);
})();
