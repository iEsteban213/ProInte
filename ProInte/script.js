/**
 * ============================================================
 * SCRIPT.JS — Tienda Online de Canasta Familiar / Retail
 * Basado en el wireframe: Homepage, Product Page,
 * Shopping Cart y Checkout Page
 * JavaScript puro — sin dependencias externas
 * ============================================================
 */

/* ============================================================
   1. ESTADO GLOBAL DE LA APLICACIÓN
   ============================================================ */

const STATE = {
  cart: [],           // Productos en el carrito
  favorites: [],      // Productos favoritos
  currentProduct: {   // Producto actualmente en vista de detalle
    id: null,
    quantity: 1,
  },
  searchQuery: '',    // Texto del buscador activo
};

/* Catálogo de productos demo (simula una base de datos) */
const PRODUCTS_DB = [
  { id: 1,  name: 'Arroz Blanco 5kg',       price: 12500, category: 'granos',   image: 'img/arroz.jpg',      rating: 4.5, stock: 20 },
  { id: 2,  name: 'Aceite Vegetal 1L',       price: 8900,  category: 'aceites',  image: 'img/aceite.jpg',     rating: 4.2, stock: 15 },
  { id: 3,  name: 'Azúcar Morena 1kg',       price: 4200,  category: 'granos',   image: 'img/azucar.jpg',     rating: 4.7, stock: 30 },
  { id: 4,  name: 'Leche Entera 1L',         price: 3800,  category: 'lácteos',  image: 'img/leche.jpg',      rating: 4.8, stock: 25 },
  { id: 5,  name: 'Pasta Espagueti 500g',    price: 3200,  category: 'pastas',   image: 'img/pasta.jpg',      rating: 4.3, stock: 40 },
  { id: 6,  name: 'Frijoles Negros 500g',    price: 5600,  category: 'granos',   image: 'img/frijoles.jpg',   rating: 4.6, stock: 18 },
  { id: 7,  name: 'Sal de Mesa 500g',        price: 1500,  category: 'condimentos', image: 'img/sal.jpg',     rating: 4.0, stock: 50 },
  { id: 8,  name: 'Jabón en Barra x3',       price: 7200,  category: 'aseo',     image: 'img/jabon.jpg',      rating: 4.4, stock: 22 },
  { id: 9,  name: 'Papel Higiénico x6',      price: 11000, category: 'aseo',     image: 'img/papel.jpg',      rating: 4.9, stock: 12 },
  { id: 10, name: 'Tomate de Lata 400g',     price: 4500,  category: 'conservas', image: 'img/tomate.jpg',    rating: 4.1, stock: 35 },
];


/* ============================================================
   2. SELECCIÓN DE ELEMENTOS DOM
   (Basada en el HTML del wireframe)
   ============================================================ */

const DOM = {
  /* ---- Navbar ---- */
  get navToggle()       { return document.querySelector('.navbar__toggle'); },
  get mobileNav()       { return document.querySelector('.mobile-nav'); },
  get mobileNavClose()  { return document.querySelector('.mobile-nav__close'); },
  get mobileNavLinks()  { return document.querySelectorAll('.mobile-nav__link'); },
  get navLinks()        { return document.querySelectorAll('.nav__link'); },

  /* ---- Buscador ---- */
  get searchInput()     { return document.querySelector('.search-bar__input'); },
  get searchBtn()       { return document.querySelector('.search-bar__btn'); },
  get searchDropdown()  { return document.querySelector('.search-dropdown'); },
  get mobileSearchInput() { return document.querySelector('.mobile-nav__search .search-bar__input'); },

  /* ---- Carrito (badge y panel) ---- */
  get cartBadge()       { return document.querySelector('.cart-badge'); },
  get cartBadges()      { return document.querySelectorAll('.cart-badge'); },

  /* ---- Página de producto ---- */
  get galleryMainImg()  { return document.querySelector('.gallery__main-img'); },
  get galleryThumbs()   { return document.querySelectorAll('.gallery__thumb'); },
  get galleryPrev()     { return document.querySelector('.gallery__nav-btn--prev'); },
  get galleryNext()     { return document.querySelector('.gallery__nav-btn--next'); },
  get qtyInput()        { return document.querySelector('.quantity-selector__input'); },
  get qtyBtnMinus()     { return document.querySelector('.quantity-selector__btn[data-action="decrease"]'); },
  get qtyBtnPlus()      { return document.querySelector('.quantity-selector__btn[data-action="increase"]'); },
  get addToCartBtn()    { return document.querySelector('[data-action="add-to-cart"]'); },
  get wishlistBtn()     { return document.querySelector('[data-action="add-to-wishlist"]'); },
  get tabBtns()         { return document.querySelectorAll('.tab__btn'); },
  get tabPanels()       { return document.querySelectorAll('.tab__panel'); },
  get sizeDropdown()    { return document.querySelector('select[name="size"]'); },

  /* ---- Carrito (página) ---- */
  get cartTableBody()   { return document.querySelector('.cart-table tbody'); },
  get cartEmptyMsg()    { return document.querySelector('.cart-empty'); },
  get cartPanel()       { return document.querySelector('.cart-panel'); },
  get summarySubtotal() { return document.querySelector('[data-summary="subtotal"]'); },
  get summaryShipping() { return document.querySelector('[data-summary="shipping"]'); },
  get summaryDiscount() { return document.querySelector('[data-summary="discount"]'); },
  get summaryTotal()    { return document.querySelector('[data-summary="total"]'); },
  get couponInput()     { return document.querySelector('.coupon-form .form-control'); },
  get couponBtn()       { return document.querySelector('.coupon-form .btn'); },
  get clearCartBtn()    { return document.querySelector('.cart-panel__clear'); },
  get proceedCheckoutBtn() { return document.querySelector('[data-action="proceed-checkout"]'); },
  get updateCartBtn()   { return document.querySelector('[data-action="update-cart"]'); },

  /* ---- Checkout ---- */
  get checkoutForm()    { return document.querySelector('[data-form="checkout"]'); },
  get checkoutSteps()   { return document.querySelectorAll('.checkout-step'); },
  get placeOrderBtn()   { return document.querySelector('[data-action="place-order"]'); },
  get orderSuccessMsg() { return document.querySelector('[data-checkout="success"]'); },

  /* ---- Toast ---- */
  get toastContainer()  { return document.querySelector('.toast-container'); },

  /* ---- Productos (homepage) ---- */
  get productsGrid()    { return document.querySelector('.products-grid'); },
  get categoryCards()   { return document.querySelectorAll('.category-card'); },
  get productCards()    { return document.querySelectorAll('.product-card'); },
};


/* ============================================================
   3. UTILIDADES GENERALES
   ============================================================ */

/**
 * Formatea un número como moneda colombiana (COP)
 * @param {number} value
 * @returns {string}
 */
function formatCurrency(value) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Genera un ID único simple
 * @returns {string}
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

/**
 * Elimina etiquetas HTML peligrosas de un string (XSS básico)
 * @param {string} str
 * @returns {string}
 */
function sanitize(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Muestra u oculta un elemento
 * @param {HTMLElement} el
 * @param {boolean} show
 */
function toggleVisibility(el, show) {
  if (!el) return;
  el.style.display = show ? '' : 'none';
}

/**
 * Hace scroll suave hacia un elemento
 * @param {string} selector
 */
function scrollTo(selector) {
  const el = document.querySelector(selector);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Obtiene los datos del producto actual desde atributos data-*
 * del botón o de la página de producto
 * @returns {object|null}
 */
function getCurrentProductData() {
  const productSection = document.querySelector('[data-product-id]');
  if (!productSection) return null;
  return {
    id:    parseInt(productSection.dataset.productId, 10),
    name:  productSection.dataset.productName  || 'Producto',
    price: parseFloat(productSection.dataset.productPrice) || 0,
    image: productSection.dataset.productImage || '',
  };
}

/**
 * Debounce: retrasa la ejecución de una función
 * @param {Function} fn
 * @param {number} delay
 * @returns {Function}
 */
function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}


/* ============================================================
   4. PERSISTENCIA — localStorage
   ============================================================ */

const STORAGE_KEYS = {
  CART:      'tienda_cart',
  FAVORITES: 'tienda_favorites',
};

/** Guarda el carrito en localStorage */
function saveCart() {
  try {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(STATE.cart));
  } catch (e) {
    console.warn('No se pudo guardar el carrito:', e);
  }
}

/** Carga el carrito desde localStorage */
function loadCart() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CART);
    STATE.cart = data ? JSON.parse(data) : [];
  } catch (e) {
    STATE.cart = [];
    console.warn('Error al cargar el carrito:', e);
  }
}

/** Guarda los favoritos en localStorage */
function saveFavorites() {
  try {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(STATE.favorites));
  } catch (e) {
    console.warn('No se pudo guardar favoritos:', e);
  }
}

/** Carga los favoritos desde localStorage */
function loadFavorites() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    STATE.favorites = data ? JSON.parse(data) : [];
  } catch (e) {
    STATE.favorites = [];
    console.warn('Error al cargar favoritos:', e);
  }
}


/* ============================================================
   5. TOAST (Notificaciones)
   ============================================================ */

/**
 * Muestra una notificación toast
 * @param {string} title   - Título del mensaje
 * @param {string} text    - Descripción (opcional)
 * @param {'success'|'error'|'warning'|'info'} type
 * @param {number} duration - ms antes de auto-cerrar (0 = manual)
 */
function showToast(title, text = '', type = 'success', duration = 3500) {
  const container = DOM.toastContainer;
  if (!container) return;

  const icons = {
    success: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
    error:   `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    warning: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    info:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  };

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'polite');
  toast.innerHTML = `
    <div class="toast__icon">${icons[type] || icons.info}</div>
    <div>
      <p class="toast__title">${sanitize(title)}</p>
      ${text ? `<p class="toast__text">${sanitize(text)}</p>` : ''}
    </div>
    <button class="toast__close" aria-label="Cerrar notificación">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  `;

  container.appendChild(toast);

  // Cerrar al hacer clic en la X
  toast.querySelector('.toast__close').addEventListener('click', () => removeToast(toast));

  // Auto-cerrar
  if (duration > 0) {
    setTimeout(() => removeToast(toast), duration);
  }
}

/**
 * Elimina un toast con animación
 * @param {HTMLElement} toast
 */
function removeToast(toast) {
  toast.style.opacity = '0';
  toast.style.transform = 'translateX(24px)';
  toast.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
  setTimeout(() => toast.remove(), 280);
}


/* ============================================================
   6. NAVEGACIÓN — Menú móvil
   ============================================================ */

/**
 * Abre el menú de navegación móvil
 */
function openMobileNav() {
  const nav = DOM.mobileNav;
  if (!nav) return;
  nav.classList.add('open');
  document.body.style.overflow = 'hidden'; // Bloquea scroll del fondo
  DOM.navToggle?.setAttribute('aria-expanded', 'true');
}

/**
 * Cierra el menú de navegación móvil
 */
function closeMobileNav() {
  const nav = DOM.mobileNav;
  if (!nav) return;
  nav.classList.remove('open');
  document.body.style.overflow = '';
  DOM.navToggle?.setAttribute('aria-expanded', 'false');
}

/**
 * Alterna el estado del menú móvil
 */
function toggleMobileNav() {
  const nav = DOM.mobileNav;
  if (!nav) return;
  nav.classList.contains('open') ? closeMobileNav() : openMobileNav();
}

/**
 * Marca el enlace activo según la URL actual
 */
function setActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link, .mobile-nav__link').forEach(link => {
    const href = link.getAttribute('href')?.split('/').pop() || '';
    link.classList.toggle('active', href === currentPath);
    if (href === currentPath) link.setAttribute('aria-current', 'page');
  });
}

/**
 * Añade efecto de scroll al header
 */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Ejecutar una vez al cargar
}


/* ============================================================
   7. BUSCADOR
   ============================================================ */

/**
 * Filtra productos del catálogo según una consulta de texto
 * @param {string} query
 * @returns {Array}
 */
function searchProducts(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return PRODUCTS_DB.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  ).slice(0, 6); // Máximo 6 resultados
}

/**
 * Renderiza los resultados en el dropdown del buscador
 * @param {Array} results
 * @param {HTMLElement} dropdown
 */
function renderSearchDropdown(results, dropdown) {
  if (!dropdown) return;

  if (!results.length) {
    dropdown.innerHTML = `
      <div class="search-dropdown__item" style="cursor:default;justify-content:center">
        <p style="font-size:0.875rem;color:var(--color-text-muted);text-align:center;padding:0.5rem 0">
          No se encontraron productos
        </p>
      </div>`;
    dropdown.style.display = 'block';
    return;
  }

  dropdown.innerHTML = results.map(p => `
    <a href="product.html?id=${p.id}" class="search-dropdown__item" data-product-id="${p.id}">
      <div class="search-dropdown__thumb" style="background:var(--color-bg-muted);display:flex;align-items:center;justify-content:center;font-size:1.5rem">🛒</div>
      <div>
        <p class="search-dropdown__name">${sanitize(p.name)}</p>
        <p class="search-dropdown__price">${formatCurrency(p.price)}</p>
      </div>
    </a>
  `).join('');

  dropdown.style.display = 'block';
}

/**
 * Oculta el dropdown del buscador
 * @param {HTMLElement} dropdown
 */
function hideSearchDropdown(dropdown) {
  if (!dropdown) return;
  dropdown.style.display = 'none';
  dropdown.innerHTML = '';
}

/**
 * Inicializa los eventos del buscador
 */
function initSearch() {
  const inputs = [DOM.searchInput, DOM.mobileSearchInput].filter(Boolean);

  inputs.forEach(input => {
    const dropdown = input.closest('.search-bar')?.querySelector('.search-dropdown')
                  || DOM.searchDropdown;

    // Búsqueda en tiempo real con debounce
    input.addEventListener('input', debounce(() => {
      const query = input.value.trim();
      STATE.searchQuery = query;

      if (query.length < 2) {
        hideSearchDropdown(dropdown);
        return;
      }

      const results = searchProducts(query);
      renderSearchDropdown(results, dropdown);
    }, 300));

    // Búsqueda al presionar Enter
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const query = input.value.trim();
        if (query) {
          window.location.href = `shop.html?q=${encodeURIComponent(query)}`;
        }
      }
      // Cerrar con Escape
      if (e.key === 'Escape') {
        hideSearchDropdown(dropdown);
        input.blur();
      }
    });

    // Cerrar dropdown al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (!input.closest('.search-bar')?.contains(e.target)) {
        hideSearchDropdown(dropdown);
      }
    });
  });

  // Botón de búsqueda
  DOM.searchBtn?.addEventListener('click', () => {
    const query = DOM.searchInput?.value.trim();
    if (query) {
      window.location.href = `shop.html?q=${encodeURIComponent(query)}`;
    }
  });
}


/* ============================================================
   8. CARRITO — Lógica de datos
   ============================================================ */

/**
 * Agrega un producto al carrito o incrementa su cantidad
 * @param {object} product - { id, name, price, image, variant }
 * @param {number} quantity
 */
function addToCart(product, quantity = 1) {
  const existing = STATE.cart.find(item => item.id === product.id && item.variant === product.variant);

  if (existing) {
    existing.quantity += quantity;
  } else {
    STATE.cart.push({
      cartItemId: generateId(),
      id:         product.id,
      name:       product.name,
      price:      product.price,
      image:      product.image || '',
      variant:    product.variant || '',
      quantity:   quantity,
    });
  }

  saveCart();
  updateCartBadge();
  renderCart();

  showToast('¡Agregado al carrito!', product.name, 'success');
}

/**
 * Elimina un ítem del carrito por su cartItemId único
 * @param {string} cartItemId
 */
function removeFromCart(cartItemId) {
  const item = STATE.cart.find(i => i.cartItemId === cartItemId);
  if (!item) return;

  STATE.cart = STATE.cart.filter(i => i.cartItemId !== cartItemId);
  saveCart();
  updateCartBadge();
  renderCart();

  showToast('Producto eliminado', item.name, 'info');
}

/**
 * Cambia la cantidad de un ítem del carrito
 * @param {string} cartItemId
 * @param {number} newQty
 */
function updateCartItemQty(cartItemId, newQty) {
  const item = STATE.cart.find(i => i.cartItemId === cartItemId);
  if (!item) return;

  if (newQty <= 0) {
    removeFromCart(cartItemId);
    return;
  }

  item.quantity = newQty;
  saveCart();
  renderCart();
}

/**
 * Vacía completamente el carrito
 */
function clearCart() {
  STATE.cart = [];
  saveCart();
  updateCartBadge();
  renderCart();
}

/**
 * Calcula los totales del carrito
 * @returns {{ subtotal, shipping, discount, total }}
 */
function calculateCartTotals() {
  const subtotal = STATE.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping  = subtotal > 0 ? (subtotal >= 80000 ? 0 : 8000) : 0; // Gratis sobre $80k
  const discount  = STATE.couponDiscount || 0;
  const total     = subtotal + shipping - discount;

  return { subtotal, shipping, discount, total };
}

/**
 * Retorna el número total de productos en el carrito
 * @returns {number}
 */
function getCartItemCount() {
  return STATE.cart.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Actualiza el badge del carrito en el navbar
 */
function updateCartBadge() {
  const count = getCartItemCount();
  DOM.cartBadges.forEach(badge => {
    badge.textContent = count > 99 ? '99+' : count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  });
}


/* ============================================================
   9. FAVORITOS — Lógica de datos
   ============================================================ */

/**
 * Alterna un producto en la lista de favoritos
 * @param {number} productId
 * @param {string} productName
 */
function toggleFavorite(productId, productName = '') {
  const idx = STATE.favorites.findIndex(f => f.id === productId);

  if (idx > -1) {
    STATE.favorites.splice(idx, 1);
    saveFavorites();
    updateFavoriteButtons(productId, false);
    showToast('Eliminado de favoritos', productName, 'info');
  } else {
    STATE.favorites.push({ id: productId, name: productName, addedAt: Date.now() });
    saveFavorites();
    updateFavoriteButtons(productId, true);
    showToast('¡Guardado en favoritos!', productName, 'success');
  }
}

/**
 * Verifica si un producto está en favoritos
 * @param {number} productId
 * @returns {boolean}
 */
function isFavorite(productId) {
  return STATE.favorites.some(f => f.id === productId);
}

/**
 * Actualiza el estado visual de todos los botones de favorito
 * de un producto específico
 * @param {number} productId
 * @param {boolean} isActive
 */
function updateFavoriteButtons(productId, isActive) {
  document.querySelectorAll(`[data-action="add-to-wishlist"][data-product-id="${productId}"]`)
    .forEach(btn => {
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      btn.setAttribute('title', isActive ? 'Quitar de favoritos' : 'Agregar a favoritos');
    });
}

/**
 * Sincroniza el estado visual de todos los botones de favorito
 * en la página actual
 */
function syncFavoritesUI() {
  document.querySelectorAll('[data-action="add-to-wishlist"]').forEach(btn => {
    const id = parseInt(btn.dataset.productId, 10);
    if (!isNaN(id)) {
      const active = isFavorite(id);
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    }
  });
}


/* ============================================================
   10. RENDERIZADO — Carrito
   ============================================================ */

/**
 * Renderiza la tabla del carrito en la página del carrito
 */
function renderCart() {
  const tbody   = DOM.cartTableBody;
  const totals  = calculateCartTotals();

  /* --- Tabla de productos --- */
  if (tbody) {
    if (STATE.cart.length === 0) {
      // Carrito vacío: mostrar mensaje y ocultar tabla
      if (DOM.cartEmptyMsg)  DOM.cartEmptyMsg.style.display  = '';
      if (DOM.cartPanel)     DOM.cartPanel.style.display     = 'none';
      if (DOM.proceedCheckoutBtn) DOM.proceedCheckoutBtn.disabled = true;
    } else {
      if (DOM.cartEmptyMsg) DOM.cartEmptyMsg.style.display   = 'none';
      if (DOM.cartPanel)    DOM.cartPanel.style.display      = '';
      if (DOM.proceedCheckoutBtn) DOM.proceedCheckoutBtn.disabled = false;

      tbody.innerHTML = STATE.cart.map(item => `
        <tr data-cart-item-id="${item.cartItemId}">
          <td>
            <div class="cart-item">
              <img
                class="cart-item__image"
                src="${sanitize(item.image) || 'img/placeholder.jpg'}"
                alt="${sanitize(item.name)}"
                onerror="this.src='img/placeholder.jpg'"
              />
              <div class="cart-item__info">
                <p class="cart-item__name">${sanitize(item.name)}</p>
                ${item.variant ? `<p class="cart-item__variant">${sanitize(item.variant)}</p>` : ''}
              </div>
            </div>
          </td>
          <td class="cart-item__price">${formatCurrency(item.price)}</td>
          <td>
            <div class="quantity-selector">
              <button
                class="quantity-selector__btn"
                data-action="cart-qty-decrease"
                data-cart-item-id="${item.cartItemId}"
                aria-label="Reducir cantidad"
              >−</button>
              <input
                class="quantity-selector__input"
                type="number"
                min="1"
                max="99"
                value="${item.quantity}"
                data-cart-item-id="${item.cartItemId}"
                aria-label="Cantidad"
              />
              <button
                class="quantity-selector__btn"
                data-action="cart-qty-increase"
                data-cart-item-id="${item.cartItemId}"
                aria-label="Aumentar cantidad"
              >+</button>
            </div>
          </td>
          <td class="cart-item__subtotal">${formatCurrency(item.price * item.quantity)}</td>
          <td>
            <button
              class="cart-item__remove"
              data-action="remove-from-cart"
              data-cart-item-id="${item.cartItemId}"
              aria-label="Eliminar ${sanitize(item.name)} del carrito"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
              </svg>
            </button>
          </td>
        </tr>
      `).join('');
    }
  }

  /* --- Totales en el resumen lateral --- */
  if (DOM.summarySubtotal) DOM.summarySubtotal.textContent = formatCurrency(totals.subtotal);
  if (DOM.summaryShipping) {
    DOM.summaryShipping.textContent = totals.shipping === 0
      ? 'Gratis'
      : formatCurrency(totals.shipping);
  }
  if (DOM.summaryDiscount && totals.discount > 0) {
    DOM.summaryDiscount.textContent = `- ${formatCurrency(totals.discount)}`;
    DOM.summaryDiscount.closest('[data-summary-row="discount"]')?.style.setProperty('display', '');
  }
  if (DOM.summaryTotal) DOM.summaryTotal.textContent = formatCurrency(totals.total);

  /* --- Resumen en la página de checkout (order-summary) --- */
  renderOrderSummary();
}

/**
 * Renderiza el resumen del pedido en el checkout
 */
function renderOrderSummary() {
  const orderItemsList = document.querySelector('.order-items');
  if (!orderItemsList) return;

  const totals = calculateCartTotals();

  orderItemsList.innerHTML = STATE.cart.map(item => `
    <div class="order-item">
      <div class="order-item__image-wrap">
        <img class="order-item__image"
          src="${sanitize(item.image) || 'img/placeholder.jpg'}"
          alt="${sanitize(item.name)}"
          onerror="this.src='img/placeholder.jpg'"
        />
        <span class="order-item__qty-badge">${item.quantity}</span>
      </div>
      <div class="order-item__info">
        <p class="order-item__name">${sanitize(item.name)}</p>
        ${item.variant ? `<p class="order-item__variant">${sanitize(item.variant)}</p>` : ''}
      </div>
      <span class="order-item__price">${formatCurrency(item.price * item.quantity)}</span>
    </div>
  `).join('');

  // Actualizar totales del checkout
  const rows = {
    '[data-order="subtotal"]': formatCurrency(totals.subtotal),
    '[data-order="shipping"]': totals.shipping === 0 ? 'Gratis' : formatCurrency(totals.shipping),
    '[data-order="total"]':    formatCurrency(totals.total),
  };

  Object.entries(rows).forEach(([selector, value]) => {
    const el = document.querySelector(selector);
    if (el) el.textContent = value;
  });
}


/* ============================================================
   11. EVENTOS — Carrito (delegación de eventos)
   ============================================================ */

/**
 * Inicializa todos los eventos del carrito en la página del carrito
 */
function initCartEvents() {
  /* Delegación de eventos para botones dinámicos en la tabla */
  const cartTableContainer = document.querySelector('.cart-panel, .cart-table');
  if (cartTableContainer) {
    cartTableContainer.addEventListener('click', (e) => {
      const btn    = e.target.closest('[data-action]');
      if (!btn) return;

      const action    = btn.dataset.action;
      const itemId    = btn.dataset.cartItemId;

      if (action === 'remove-from-cart' && itemId) {
        removeFromCart(itemId);
      }

      if (action === 'cart-qty-decrease' && itemId) {
        const item = STATE.cart.find(i => i.cartItemId === itemId);
        if (item) updateCartItemQty(itemId, item.quantity - 1);
      }

      if (action === 'cart-qty-increase' && itemId) {
        const item = STATE.cart.find(i => i.cartItemId === itemId);
        if (item) updateCartItemQty(itemId, item.quantity + 1);
      }
    });

    /* Cambio directo en el input de cantidad */
    cartTableContainer.addEventListener('change', (e) => {
      const input = e.target.closest('.quantity-selector__input[data-cart-item-id]');
      if (!input) return;

      const itemId = input.dataset.cartItemId;
      const newQty = parseInt(input.value, 10);

      if (!isNaN(newQty) && newQty >= 1) {
        updateCartItemQty(itemId, newQty);
      } else {
        input.value = 1;
        updateCartItemQty(itemId, 1);
      }
    });
  }

  /* Botón vaciar carrito */
  DOM.clearCartBtn?.addEventListener('click', () => {
    if (confirm('¿Seguro que quieres vaciar el carrito?')) {
      clearCart();
    }
  });

  /* Botón actualizar carrito */
  DOM.updateCartBtn?.addEventListener('click', () => {
    showToast('Carrito actualizado', '', 'success', 2000);
  });

  /* Botón continuar al checkout */
  DOM.proceedCheckoutBtn?.addEventListener('click', () => {
    if (STATE.cart.length === 0) {
      showToast('Tu carrito está vacío', 'Agrega productos antes de continuar', 'warning');
      return;
    }
    window.location.href = 'checkout.html';
  });

  /* Cupón de descuento */
  DOM.couponBtn?.addEventListener('click', () => {
    const code = DOM.couponInput?.value.trim().toUpperCase();
    applyCoupon(code);
  });

  DOM.couponInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      applyCoupon(DOM.couponInput.value.trim().toUpperCase());
    }
  });
}

/**
 * Valida y aplica un cupón de descuento
 * @param {string} code
 */
function applyCoupon(code) {
  const coupons = {
    'BIENVENIDO10': 0.10,
    'CANASTA15':    0.15,
    'AHORRO20':     0.20,
  };

  if (!code) {
    showToast('Ingresa un código de cupón', '', 'warning');
    return;
  }

  if (coupons[code]) {
    const subtotal = calculateCartTotals().subtotal;
    STATE.couponDiscount = Math.floor(subtotal * coupons[code]);
    STATE.couponCode     = code;
    renderCart();
    showToast(`¡Cupón "${code}" aplicado!`, `${(coupons[code] * 100)}% de descuento`, 'success');
  } else {
    showToast('Código inválido', 'Verifica el cupón e intenta de nuevo', 'error');
  }
}


/* ============================================================
   12. GALERÍA DE IMÁGENES (Página de producto)
   ============================================================ */

let currentThumbIndex = 0;

/**
 * Cambia la imagen principal de la galería
 * @param {string} src   - URL de la imagen
 * @param {number} index - Índice de la miniatura activa
 */
function changeMainImage(src, index) {
  const mainImg = DOM.galleryMainImg;
  if (!mainImg) return;

  // Animación de fade
  mainImg.style.opacity = '0';
  setTimeout(() => {
    mainImg.src = src;
    mainImg.style.opacity = '1';
    mainImg.style.transition = 'opacity 0.25s ease';
  }, 120);

  // Actualizar miniatura activa
  DOM.galleryThumbs.forEach((thumb, i) => {
    thumb.classList.toggle('active', i === index);
  });

  currentThumbIndex = index;
}

/**
 * Navega entre imágenes (prev / next)
 * @param {'prev'|'next'} direction
 */
function navigateGallery(direction) {
  const thumbs = DOM.galleryThumbs;
  if (!thumbs.length) return;

  let newIndex = direction === 'next'
    ? (currentThumbIndex + 1) % thumbs.length
    : (currentThumbIndex - 1 + thumbs.length) % thumbs.length;

  const thumb = thumbs[newIndex];
  const imgSrc = thumb.querySelector('img')?.src || thumb.dataset.src;
  if (imgSrc) changeMainImage(imgSrc, newIndex);
}

/**
 * Inicializa la galería de imágenes del producto
 */
function initProductGallery() {
  // Click en miniaturas
  DOM.galleryThumbs.forEach((thumb, index) => {
    thumb.addEventListener('click', () => {
      const imgSrc = thumb.querySelector('img')?.src || thumb.dataset.src;
      if (imgSrc) changeMainImage(imgSrc, index);
    });

    thumb.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        thumb.click();
      }
    });
  });

  // Botones de navegación prev/next
  DOM.galleryPrev?.addEventListener('click', () => navigateGallery('prev'));
  DOM.galleryNext?.addEventListener('click', () => navigateGallery('next'));

  // Navegación con teclado en la imagen principal
  DOM.galleryMainImg?.closest('.gallery__main')?.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  navigateGallery('prev');
    if (e.key === 'ArrowRight') navigateGallery('next');
  });
}


/* ============================================================
   13. SELECTOR DE CANTIDAD (Página de producto)
   ============================================================ */

/**
 * Inicializa el selector de cantidad en la página de producto
 */
function initQuantitySelector() {
  const input    = DOM.qtyInput;
  const btnMinus = DOM.qtyBtnMinus;
  const btnPlus  = DOM.qtyBtnPlus;

  if (!input) return;

  const MIN = parseInt(input.min, 10) || 1;
  const MAX = parseInt(input.max, 10) || 99;

  const updateQtyUI = () => {
    const qty = parseInt(input.value, 10) || MIN;
    STATE.currentProduct.quantity = qty;
    if (btnMinus) btnMinus.disabled = qty <= MIN;
    if (btnPlus)  btnPlus.disabled  = qty >= MAX;
  };

  btnMinus?.addEventListener('click', () => {
    const current = parseInt(input.value, 10) || MIN;
    if (current > MIN) {
      input.value = current - 1;
      updateQtyUI();
    }
  });

  btnPlus?.addEventListener('click', () => {
    const current = parseInt(input.value, 10) || MIN;
    if (current < MAX) {
      input.value = current + 1;
      updateQtyUI();
    }
  });

  input.addEventListener('input', () => {
    let val = parseInt(input.value, 10);
    if (isNaN(val) || val < MIN) val = MIN;
    if (val > MAX) val = MAX;
    input.value = val;
    updateQtyUI();
  });

  input.addEventListener('blur', () => {
    if (!input.value) input.value = MIN;
    updateQtyUI();
  });

  updateQtyUI(); // Estado inicial
}


/* ============================================================
   14. TABS (Página de producto)
   ============================================================ */

/**
 * Activa una pestaña específica
 * @param {string} targetId - data-tab del botón
 */
function activateTab(targetId) {
  DOM.tabBtns.forEach(btn => {
    const isActive = btn.dataset.tab === targetId;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  DOM.tabPanels.forEach(panel => {
    const isActive = panel.id === targetId || panel.dataset.tab === targetId;
    panel.classList.toggle('active', isActive);
    panel.setAttribute('hidden', isActive ? '' : 'true');
    if (isActive) panel.removeAttribute('hidden');
  });
}

/**
 * Inicializa los tabs del producto
 */
function initProductTabs() {
  if (!DOM.tabBtns.length) return;

  DOM.tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      activateTab(btn.dataset.tab);
    });

    // Navegación con teclado (accesibilidad)
    btn.addEventListener('keydown', (e) => {
      const tabs  = [...DOM.tabBtns];
      const idx   = tabs.indexOf(btn);

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        tabs[(idx + 1) % tabs.length].click();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        tabs[(idx - 1 + tabs.length) % tabs.length].click();
      }
    });
  });

  // Activar el primer tab por defecto
  const firstTab = DOM.tabBtns[0];
  if (firstTab) activateTab(firstTab.dataset.tab);
}


/* ============================================================
   15. BOTÓN "AGREGAR AL CARRITO" (Página de producto)
   ============================================================ */

/**
 * Inicializa el botón de agregar al carrito en la página de producto
 */
function initAddToCartButton() {
  const btn = DOM.addToCartBtn;
  if (!btn) return;

  btn.addEventListener('click', () => {
    const product = getCurrentProductData();
    if (!product) {
      showToast('Error al agregar el producto', '', 'error');
      return;
    }

    const qty     = parseInt(DOM.qtyInput?.value, 10) || 1;
    const variant = DOM.sizeDropdown?.value || '';

    addToCart({ ...product, variant }, qty);

    // Feedback visual en el botón
    const originalText = btn.innerHTML;
    btn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="20 6 9 17 4 12"/>
      </svg> ¡Agregado!`;
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.disabled  = false;
    }, 1800);
  });
}


/* ============================================================
   16. BOTÓN "AGREGAR A FAVORITOS" (Página de producto y cards)
   ============================================================ */

/**
 * Inicializa todos los botones de favorito en la página
 */
function initFavoriteButtons() {
  // Delegación de eventos para cards de productos y página de detalle
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action="add-to-wishlist"]');
    if (!btn) return;

    e.preventDefault();
    e.stopPropagation();

    const productId   = parseInt(btn.dataset.productId, 10);
    const productName = btn.dataset.productName || btn.closest('[data-product-name]')?.dataset.productName || '';

    if (!isNaN(productId)) {
      toggleFavorite(productId, productName);
    }
  });

  // Sincronizar UI al cargar
  syncFavoritesUI();
}


/* ============================================================
   17. EVENTOS DE PRODUCT CARDS (Homepage / Tienda)
   ============================================================ */

/**
 * Inicializa los eventos en las cards de productos
 * (botones "agregar al carrito" en el listing)
 */
function initProductCards() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action="add-to-cart"]');
    if (!btn) return;

    // Evitar conflicto con la página de detalle
    if (btn.closest('[data-product-id]')?.classList.contains('product-info')) return;

    const card = btn.closest('.product-card');
    if (!card) return;

    const product = {
      id:    parseInt(card.dataset.productId, 10),
      name:  card.dataset.productName || card.querySelector('.product-card__name')?.textContent?.trim() || '',
      price: parseFloat(card.dataset.productPrice) || 0,
      image: card.querySelector('.product-card__image')?.src || '',
    };

    if (!isNaN(product.id)) {
      addToCart(product, 1);
    }
  });
}


/* ============================================================
   18. VALIDACIÓN DEL FORMULARIO DE CHECKOUT
   ============================================================ */

/**
 * Reglas de validación por campo
 */
const VALIDATION_RULES = {
  fullName:   { required: true, minLength: 3,  label: 'Nombre completo' },
  email:      { required: true, email: true,   label: 'Correo electrónico' },
  phone:      { required: true, phone: true,   label: 'Teléfono' },
  address:    { required: true, minLength: 8,  label: 'Dirección' },
  city:       { required: true, minLength: 2,  label: 'Ciudad' },
  zipCode:    { required: false, label: 'Código postal' },
  cardNumber: { required: true, cardNumber: true, label: 'Número de tarjeta' },
  expiryDate: { required: true, expiry: true,  label: 'Fecha de expiración' },
  cvv:        { required: true, cvv: true,     label: 'CVV' },
  cardName:   { required: true, minLength: 3,  label: 'Nombre en la tarjeta' },
};

/**
 * Valida un campo individual
 * @param {string} fieldName
 * @param {string} value
 * @returns {{ valid: boolean, message: string }}
 */
function validateField(fieldName, value) {
  const rules = VALIDATION_RULES[fieldName];
  if (!rules) return { valid: true, message: '' };

  const v = (value || '').trim();

  if (rules.required && !v) {
    return { valid: false, message: `${rules.label} es obligatorio` };
  }

  if (!v) return { valid: true, message: '' }; // Campo vacío y no requerido = OK

  if (rules.minLength && v.length < rules.minLength) {
    return { valid: false, message: `${rules.label} debe tener al menos ${rules.minLength} caracteres` };
  }

  if (rules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
    return { valid: false, message: 'Ingresa un correo electrónico válido' };
  }

  if (rules.phone && !/^[\d\s\+\-\(\)]{7,15}$/.test(v)) {
    return { valid: false, message: 'Ingresa un número de teléfono válido' };
  }

  if (rules.cardNumber) {
    const digits = v.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(digits)) {
      return { valid: false, message: 'Número de tarjeta inválido (13-19 dígitos)' };
    }
  }

  if (rules.expiry) {
    if (!/^(0[1-9]|1[0-2])\/(\d{2}|\d{4})$/.test(v)) {
      return { valid: false, message: 'Formato: MM/YY o MM/YYYY' };
    }
    // Verificar que no esté vencida
    const [month, year] = v.split('/').map(Number);
    const fullYear = year < 100 ? 2000 + year : year;
    const expDate  = new Date(fullYear, month - 1, 1);
    const now      = new Date();
    now.setDate(1);
    if (expDate < now) {
      return { valid: false, message: 'La tarjeta está vencida' };
    }
  }

  if (rules.cvv && !/^\d{3,4}$/.test(v)) {
    return { valid: false, message: 'CVV debe tener 3 o 4 dígitos' };
  }

  return { valid: true, message: '' };
}

/**
 * Muestra u oculta el mensaje de error de un campo
 * @param {HTMLElement} field
 * @param {string} message - Vacío para limpiar el error
 */
function setFieldError(field, message) {
  if (!field) return;

  const group = field.closest('.form-group');
  let errorEl = group?.querySelector('.form-error');

  field.classList.toggle('form-control--error', !!message);
  field.setAttribute('aria-invalid', message ? 'true' : 'false');

  if (message) {
    if (!errorEl) {
      errorEl = document.createElement('p');
      errorEl.className = 'form-error';
      group?.appendChild(errorEl);
    }
    errorEl.textContent = message;
  } else {
    errorEl?.remove();
  }
}

/**
 * Valida un formulario completo
 * @param {HTMLElement} form
 * @returns {boolean}
 */
function validateForm(form) {
  if (!form) return false;

  let isValid = true;

  form.querySelectorAll('[data-validate]').forEach(field => {
    const fieldName = field.dataset.validate;
    const { valid, message } = validateField(fieldName, field.value);

    setFieldError(field, valid ? '' : message);
    if (!valid) isValid = false;
  });

  return isValid;
}

/**
 * Inicializa validación en tiempo real de los campos
 * @param {HTMLElement} form
 */
function initFormValidation(form) {
  if (!form) return;

  form.querySelectorAll('[data-validate]').forEach(field => {
    // Validar al salir del campo
    field.addEventListener('blur', () => {
      const { valid, message } = validateField(field.dataset.validate, field.value);
      setFieldError(field, valid ? '' : message);
    });

    // Limpiar error al empezar a escribir
    field.addEventListener('input', () => {
      if (field.classList.contains('form-control--error')) {
        const { valid, message } = validateField(field.dataset.validate, field.value);
        setFieldError(field, valid ? '' : message);
      }
    });

    // Formatear número de tarjeta automáticamente
    if (field.dataset.validate === 'cardNumber') {
      field.addEventListener('input', () => {
        let val = field.value.replace(/\D/g, '').slice(0, 16);
        field.value = val.replace(/(.{4})/g, '$1 ').trim();
      });
    }

    // Formatear fecha de expiración
    if (field.dataset.validate === 'expiryDate') {
      field.addEventListener('input', () => {
        let val = field.value.replace(/\D/g, '').slice(0, 6);
        if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2);
        field.value = val;
      });
    }
  });
}


/* ============================================================
   19. CHECKOUT — Pasos y envío del pedido
   ============================================================ */

let currentCheckoutStep = 0;

/**
 * Navega a un paso del checkout
 * @param {number} stepIndex
 */
function goToCheckoutStep(stepIndex) {
  DOM.checkoutSteps.forEach((step, i) => {
    step.classList.toggle('active',    i === stepIndex);
    step.classList.toggle('completed', i < stepIndex);
  });

  document.querySelectorAll('.checkout-section').forEach((section, i) => {
    toggleVisibility(section, i === stepIndex);
  });

  currentCheckoutStep = stepIndex;
  scrollTo('.checkout-form-panel');
}

/**
 * Simula el envío del pedido
 */
function submitOrder() {
  const form = DOM.checkoutForm;

  if (STATE.cart.length === 0) {
    showToast('Tu carrito está vacío', 'No puedes realizar una compra sin productos', 'warning');
    return;
  }

  if (!validateForm(form)) {
    showToast('Revisa los datos', 'Hay campos con errores en el formulario', 'error');
    scrollTo('.form-control--error');
    return;
  }

  // Simular llamada a API
  const btn = DOM.placeOrderBtn;
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="btn__spinner"></span> Procesando...`;
  }

  setTimeout(() => {
    // Éxito: limpiar carrito y mostrar confirmación
    clearCart();

    const successEl = DOM.orderSuccessMsg;
    if (successEl) {
      successEl.style.display = '';
      form?.closest('.checkout-form-panel')?.style.setProperty('display', 'none');
      scrollTo('[data-checkout="success"]');
    } else {
      showToast(
        '¡Pedido realizado!',
        'Recibirás un correo de confirmación pronto.',
        'success',
        6000
      );
      setTimeout(() => (window.location.href = 'index.html'), 3000);
    }
  }, 2200);
}

/**
 * Inicializa el checkout
 */
function initCheckout() {
  const form = DOM.checkoutForm;
  if (!form && !DOM.placeOrderBtn) return;

  // Validación en tiempo real
  initFormValidation(form);

  // Botón de confirmar pedido
  DOM.placeOrderBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    submitOrder();
  });

  // Navegación entre pasos (si existen)
  DOM.checkoutSteps.forEach((step, index) => {
    step.addEventListener('click', () => {
      if (index <= currentCheckoutStep) {
        goToCheckoutStep(index);
      }
    });
  });

  // Botones "Continuar" entre pasos
  document.querySelectorAll('[data-action="next-step"]').forEach(btn => {
    btn.addEventListener('click', () => {
      goToCheckoutStep(currentCheckoutStep + 1);
    });
  });

  // Renderizar resumen del pedido
  renderOrderSummary();
}


/* ============================================================
   20. CATEGORÍAS (Homepage)
   ============================================================ */

/**
 * Inicializa los filtros de categorías
 */
function initCategoryFilters() {
  DOM.categoryCards.forEach(card => {
    card.addEventListener('click', (e) => {
      const category = card.dataset.category;

      // Actualizar estado activo visual
      DOM.categoryCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      // Si estamos en la página de la tienda, filtrar productos
      filterProductsByCategory(category);
    });
  });
}

/**
 * Filtra los productos mostrados según la categoría
 * @param {string|'all'} category
 */
function filterProductsByCategory(category) {
  DOM.productCards.forEach(card => {
    const cardCategory = card.dataset.category;
    const show = !category || category === 'all' || cardCategory === category;
    card.style.display = show ? '' : 'none';
  });
}


/* ============================================================
   21. INICIALIZACIÓN GENERAL
   ============================================================ */

/**
 * Punto de entrada: se ejecuta cuando el DOM está listo
 */
document.addEventListener('DOMContentLoaded', () => {

  /* ---- 1. Cargar estado desde localStorage ---- */
  loadCart();
  loadFavorites();

  /* ---- 2. Actualizar badge del carrito ---- */
  updateCartBadge();

  /* ---- 3. Navegación ---- */
  DOM.navToggle?.addEventListener('click', toggleMobileNav);
  DOM.mobileNavClose?.addEventListener('click', closeMobileNav);

  // Cerrar menú al hacer clic en el fondo oscuro
  DOM.mobileNav?.addEventListener('click', (e) => {
    if (e.target === DOM.mobileNav) closeMobileNav();
  });

  // Cerrar menú al hacer clic en un enlace
  DOM.mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  // Cerrar menú con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileNav();
      hideSearchDropdown(DOM.searchDropdown);
    }
  });

  setActiveNavLink();
  initHeaderScroll();

  /* ---- 4. Buscador ---- */
  initSearch();

  /* ---- 5. Galería de producto ---- */
  initProductGallery();

  /* ---- 6. Selector de cantidad ---- */
  initQuantitySelector();

  /* ---- 7. Tabs del producto ---- */
  initProductTabs();

  /* ---- 8. Botón agregar al carrito (producto detalle) ---- */
  initAddToCartButton();

  /* ---- 9. Favoritos ---- */
  initFavoriteButtons();

  /* ---- 10. Cards de productos (listing) ---- */
  initProductCards();

  /* ---- 11. Eventos del carrito (página carrito) ---- */
  initCartEvents();

  /* ---- 12. Renderizar carrito si estamos en la página del carrito ---- */
  if (DOM.cartTableBody || DOM.summaryTotal) {
    renderCart();
  }

  /* ---- 13. Checkout ---- */
  initCheckout();

  /* ---- 14. Categorías (homepage) ---- */
  initCategoryFilters();

  /* ---- 15. Parámetros de URL ---- */
  handleURLParams();

  console.log('[Tienda] Script inicializado correctamente ✓');
});


/* ============================================================
   22. MANEJO DE PARÁMETROS URL
   ============================================================ */

/**
 * Lee parámetros de la URL para acciones como búsqueda o categoría
 */
function handleURLParams() {
  const params = new URLSearchParams(window.location.search);

  // Búsqueda desde URL: shop.html?q=arroz
  const query = params.get('q');
  if (query && DOM.searchInput) {
    DOM.searchInput.value = query;
    STATE.searchQuery = query;
    const results = searchProducts(query);
    // Aquí se renderizarían los resultados de búsqueda en la página de tienda
    renderSearchResults(results, query);
  }

  // Categoría desde URL: shop.html?category=lacteos
  const category = params.get('category');
  if (category) {
    filterProductsByCategory(category);
    // Marcar categoría activa
    const activeCard = document.querySelector(`.category-card[data-category="${CSS.escape(category)}"]`);
    if (activeCard) {
      DOM.categoryCards.forEach(c => c.classList.remove('active'));
      activeCard.classList.add('active');
    }
  }
}

/**
 * Renderiza resultados de búsqueda en la página de la tienda
 * @param {Array} results
 * @param {string} query
 */
function renderSearchResults(results, query) {
  const grid = DOM.productsGrid;
  if (!grid) return;

  const countEl = document.querySelector('.products-toolbar__count');
  if (countEl) {
    countEl.textContent = results.length > 0
      ? `${results.length} resultado${results.length !== 1 ? 's' : ''} para "${query}"`
      : `No se encontraron resultados para "${query}"`;
  }

  if (!results.length) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;padding:3rem;text-align:center">
        <p style="font-size:1.125rem;color:var(--color-text-muted)">
          No encontramos productos para "<strong>${sanitize(query)}</strong>".
        </p>
        <a href="shop.html" class="btn btn--secondary" style="margin-top:1rem;display:inline-flex">
          Ver todos los productos
        </a>
      </div>`;
  }
}


/* ============================================================
   23. ZOOM DE IMAGEN (Lightbox simple)
   ============================================================ */

/**
 * Inicializa el zoom de imagen al hacer clic en el botón zoom
 */
(function initGalleryZoom() {
  document.addEventListener('click', (e) => {
    const zoomBtn = e.target.closest('.gallery__zoom-btn');
    if (!zoomBtn) return;

    const imgSrc = DOM.galleryMainImg?.src;
    if (!imgSrc) return;

    // Crear lightbox simple
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed;inset:0;background:rgba(0,0,0,0.9);
      display:flex;align-items:center;justify-content:center;
      z-index:1000;cursor:zoom-out;padding:1rem;
    `;
    overlay.innerHTML = `
      <img src="${imgSrc}" style="max-width:90vw;max-height:90vh;border-radius:8px;object-fit:contain;" alt="Zoom">
    `;
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    overlay.addEventListener('click', () => {
      overlay.remove();
      document.body.style.overflow = '';
    });

    document.addEventListener('keydown', function closeZoom(e) {
      if (e.key === 'Escape') {
        overlay.remove();
        document.body.style.overflow = '';
        document.removeEventListener('keydown', closeZoom);
      }
    });
  });
})();


/* ============================================================
   24. SELECTOR DE PASOS DE CHECKOUT (UX mejorada)
   ============================================================ */

/**
 * Actualiza visualmente los pasos del checkout
 * Llamar cuando se avanza o retrocede un paso
 */
function updateCheckoutStepsUI() {
  DOM.checkoutSteps.forEach((step, i) => {
    const numberEl = step.querySelector('.checkout-step__number');
    if (!numberEl) return;

    if (i < currentCheckoutStep) {
      // Paso completado: mostrar ícono de check
      numberEl.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <polyline points="20 6 9 17 4 12"/>
        </svg>`;
    } else {
      numberEl.textContent = i + 1;
    }
  });
}
