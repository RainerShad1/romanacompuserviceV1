// ================================================
// RCRC COMPUSERVICE - JS PRINCIPAL
// ================================================

document.addEventListener('DOMContentLoaded', () => {

  // === LANG SWITCH (todas las páginas) ===
  const initialLang = getCurrentLang();
  setLang(initialLang);

  document.querySelectorAll('.lang-switch button').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      setLang(lang);
      // Disparar evento custom para que las páginas que tengan
      // contenido dinámico se vuelvan a renderizar
      document.dispatchEvent(new CustomEvent('langChanged', { detail: { lang } }));
    });
  });

  // === MOBILE MENU ===
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
    });
    document.querySelectorAll('nav a').forEach(a => {
      a.addEventListener('click', () => mainNav.classList.remove('open'));
    });
  }

  // === HIGHLIGHT TODAY EN HORARIO ===
  const today = new Date().getDay();
  const dayMap = ['day-sun', 'day-mon', 'day-tue', 'day-wed', 'day-thu', 'day-fri', 'day-sat'];
  const todayKey = dayMap[today];
  document.querySelectorAll('.hours-list li').forEach(li => {
    const span = li.querySelector('span[data-i18n]');
    if (span && span.dataset.i18n === todayKey) {
      li.classList.add('today');
    }
  });

  // === POPUP DE WHATSAPP ===
  // Comportamiento configurable: cambiar valores aquí si lo deseas
  const POPUP_CONFIG = {
    initialDelay: 15000,        // 15 segundos para la primera aparición
    autoHideAfter: 12000,       // se oculta solo después de 12 segundos
    showOnScrollPx: 800,        // re-aparece si el usuario hace scroll de más de 800px
    cooldownMs: 60000,          // espera 60 segundos antes de poder volver a mostrarse
  };

  const popup = document.getElementById('whatsappPopup');
  const popupClose = document.getElementById('whatsappPopupClose');

  if (popup && popupClose) {
    let popupClosedByUser = false;
    let lastShownAt = 0;
    let hideTimer = null;

    const showPopup = () => {
      if (popupClosedByUser) return;
      const now = Date.now();
      if (now - lastShownAt < POPUP_CONFIG.cooldownMs) return;
      lastShownAt = now;
      popup.classList.add('show');
      // Auto-ocultar
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        popup.classList.remove('show');
      }, POPUP_CONFIG.autoHideAfter);
    };

    const hidePopup = () => {
      popup.classList.remove('show');
      clearTimeout(hideTimer);
    };

    // Cerrar manualmente: no se vuelve a mostrar en esta sesión
    popupClose.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      popupClosedByUser = true;
      hidePopup();
    });

    // Aparición inicial después del delay
    setTimeout(showPopup, POPUP_CONFIG.initialDelay);

    // Re-aparición al hacer scroll significativo
    let scrollTriggered = false;
    window.addEventListener('scroll', () => {
      if (scrollTriggered || popupClosedByUser) return;
      if (window.scrollY > POPUP_CONFIG.showOnScrollPx) {
        scrollTriggered = true;
        showPopup();
      }
    }, { passive: true });
  }

});
