const products = [];

let cart = JSON.parse(localStorage.getItem('dareloutour_cart') || '[]');

// Navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        showPage(targetId);
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        document.querySelector('.nav-menu').classList.remove('open');
    });
});

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active-page'));
    const page = document.getElementById(pageId);
    if (page) {
        page.classList.add('active-page');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Menu toggle
document.getElementById('menuToggle').addEventListener('click', () => {
    document.querySelector('.nav-menu').classList.toggle('open');
});

// Filter buttons
function setupFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderCatalogue(btn.dataset.filter);
        });
    });
}
setupFilters();

// Generate brand filter buttons
function renderBrandFilters() {
    const filterBar = document.getElementById('filterBar');
    if (!filterBar) return;
    const brands = [...new Set(products.map(p => p.brand))];
    brands.forEach(brand => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.dataset.filter = brand;
        btn.textContent = brand;
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderCatalogue(brand);
        });
        filterBar.appendChild(btn);
    });
}
renderBrandFilters();

function renderStars(note) {
    const full = Math.floor(note);
    const half = note % 1 >= 0.5;
    let stars = '';
    for (let i = 0; i < 5; i++) {
        if (i < full) stars += '<i class="fas fa-star"></i>';
        else if (i === full && half) stars += '<i class="fas fa-star-half-alt"></i>';
        else stars += '<i class="far fa-star"></i>';
    }
    return `<div class="product-stars">${stars} <span>(${note.toFixed(1)})</span></div>`;
}

// Render products
function renderProducts(productsArray, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = productsArray.map(p => `
        <div class="product-card" data-id="${p.id}" data-brand="${p.brand}" onclick="showPerfumeDetail(${p.id})">
            <div class="product-image">
                ${p.image ? `<img src="${getImageSrc(p.image)}" alt="${p.name}">` : '<i class="fas fa-glass-martini-alt"></i>'}
                ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
            </div>
            <div class="product-info">
                <div class="product-brand">${p.brand}</div>
                <h3 class="product-name">${p.name}</h3>
                <p class="product-desc">${p.desc}</p>
                ${p.note ? renderStars(p.note) : ''}
                <div class="product-bottom">
                    <span class="product-price">${formatPrice(p.price)}</span>
                    <button class="btn-add" onclick="event.stopPropagation(); addToCart(${p.id})">Ajouter</button>
                </div>
            </div>
        </div>
    `).join('');
}

function getImageSrc(image) {
    if (!image) return '';
    if (image.startsWith('data:') || image.startsWith('http://') || image.startsWith('https://')) return image;
    return image;
}

function renderFeatured() {
    const featured = products.slice(0, 4);
    renderProducts(featured, 'featuredProducts');
}

function renderCatalogue(filter = 'all') {
    const filtered = filter === 'all' ? products : products.filter(p => p.category === filter || p.brand === filter);
    renderProducts(filtered, 'catalogueProducts');
}

function formatPrice(price) {
    return price.toLocaleString('fr-FR') + ' DA';
}

// Perfume detail page
function showPerfumeDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active-page'));
    const detailPage = document.getElementById('parfume-detail');
    if (detailPage) {
        detailPage.classList.add('active-page');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    renderPerfumeDetail(product);
}

function renderPerfumeDetail(p) {
    const container = document.getElementById('parfumeDetailContent');
    if (!container) return;
    container.innerHTML = `
        <div class="back-link" onclick="showPage('catalogue')">
            <i class="fas fa-arrow-left"></i> Retour au catalogue
        </div>
        <div class="perfume-detail-wrapper">
            <div class="perfume-detail-image">
                ${p.image ? `<img src="${getImageSrc(p.image)}" alt="${p.name}">` : '<i class="fas fa-glass-martini-alt"></i>'}
                ${p.badge ? `<span class="perfume-detail-badge">${p.badge}</span>` : ''}
            </div>
            <div class="perfume-detail-info">
                <div class="perfume-detail-category">${p.category}</div>
                <div class="perfume-detail-brand">${p.brand}</div>
                <h2 class="perfume-detail-name">${p.name}</h2>
                ${p.note ? renderStars(p.note) : ''}
                <p class="perfume-detail-desc">${p.desc}</p>
                <div class="perfume-detail-price">${formatPrice(p.price)}</div>
                <button class="btn btn-gold" onclick="addToCart(${p.id}); showPerfumeDetail(${p.id})">Ajouter au panier</button>
            </div>
        </div>
    `;
}

// Cart functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    saveCart();
    updateCartUI();
    showToast(`"${product.name}" ajouté au panier`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

function changeQty(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        removeFromCart(productId);
        return;
    }
    saveCart();
    updateCartUI();
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getCartCount() {
    return cart.reduce((sum, item) => sum + item.qty, 0);
}

function saveCart() {
    localStorage.setItem('dareloutour_cart', JSON.stringify(cart));
}

function updateCartUI() {
    document.getElementById('cartCount').textContent = getCartCount();
    const container = document.getElementById('cartItems');

    if (cart.length === 0) {
        container.innerHTML = '<p class="cart-empty">Votre panier est vide</p>';
        document.getElementById('cartTotal').textContent = formatPrice(0);
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-img">
                <i class="fas fa-glass-martini-alt"></i>
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${formatPrice(item.price)}</div>
                <div class="cart-item-qty">
                    <button onclick="changeQty(${item.id}, -1)">−</button>
                    <span>${item.qty}</span>
                    <button onclick="changeQty(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>
    `).join('');

    document.getElementById('cartTotal').textContent = formatPrice(getCartTotal());
}

// Cart sidebar
document.getElementById('cartBtn').addEventListener('click', () => {
    document.getElementById('cartSidebar').classList.add('open');
    document.getElementById('cartOverlay').classList.add('open');
});

function closeCart() {
    document.getElementById('cartSidebar').classList.remove('open');
    document.getElementById('cartOverlay').classList.remove('open');
}

document.getElementById('cartClose').addEventListener('click', closeCart);
document.getElementById('cartOverlay').addEventListener('click', closeCart);

// Checkout
document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (cart.length === 0) {
        showToast('Votre panier est vide');
        return;
    }
    const total = formatPrice(getCartTotal());
    showToast(`Commande de ${getCartCount()} article(s) - Total: ${total}. Nous vous contacterons !`);
    cart = [];
    saveCart();
    updateCartUI();
    setTimeout(closeCart, 2000);
});

// Contact form
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Message envoyé avec succès ! Nous vous répondrons rapidement.');
    e.target.reset();
});

// Newsletter
document.getElementById('newsletterForm').addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Inscription à la newsletter réussie !');
    e.target.reset();
});

// Toast
function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ===== ADMIN PANEL =====
function getAdminProducts() {
    const stored = localStorage.getItem('dareloutour_admin_products');
    if (stored) return JSON.parse(stored);
    return null;
}

function saveAdminProducts() {
    localStorage.setItem('dareloutour_admin_products', JSON.stringify(products));
}

function loadProducts() {
    const adminData = getAdminProducts();
    if (adminData) {
        products.length = 0;
        products.push(...adminData);
    }
}

function getNextId() {
    return products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
}

// Preview image in add form
document.getElementById('adminImageFile').addEventListener('change', function() {
    const file = this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('adminPreviewImg').src = e.target.result;
        document.getElementById('adminPreviewImg').style.display = 'block';
    };
    reader.readAsDataURL(file);
});

document.getElementById('adminImageUrl').addEventListener('input', function() {
    const url = this.value.trim();
    if (url) {
        document.getElementById('adminPreviewImg').src = url;
        document.getElementById('adminPreviewImg').style.display = 'block';
        document.getElementById('adminImageFile').value = '';
    }
});

// Open/close modal
document.getElementById('adminBtn').addEventListener('click', () => {
    loadProducts();
    document.getElementById('adminOverlay').classList.add('open');
    document.getElementById('adminModal').classList.add('open');
    renderEditList();
});

function closeAdmin() {
    document.getElementById('adminOverlay').classList.remove('open');
    document.getElementById('adminModal').classList.remove('open');
}
document.getElementById('adminClose').addEventListener('click', closeAdmin);
document.getElementById('adminOverlay').addEventListener('click', closeAdmin);

// Tab switch
document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('adminTab' + tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1)).classList.add('active');
        if (tab.dataset.tab === 'edit') renderEditList();
    });
});

// Add form submit
document.getElementById('adminAddForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const imgFile = document.getElementById('adminImageFile').files[0];
    const imgUrl = document.getElementById('adminImageUrl').value.trim();

    if (!imgFile && !imgUrl) {
        showToast('Veuillez ajouter une photo (fichier ou URL)');
        return;
    }

    const processImage = (src) => {
        const newProduct = {
            id: getNextId(),
            brand: document.getElementById('adminBrand').value.trim(),
            name: document.getElementById('adminName').value.trim(),
            category: document.getElementById('adminCategory').value,
            desc: document.getElementById('adminDesc').value.trim(),
            price: parseInt(document.getElementById('adminPrice').value),
            note: 4.0,
            badge: document.getElementById('adminBadge').value.trim() || '',
            image: src
        };
        products.push(newProduct);
        saveAdminProducts();
        this.reset();
        document.getElementById('adminPreviewImg').style.display = 'none';
        renderFeatured();
        renderCatalogue();
        updateCartUI();
        showToast(`"${newProduct.name}" ajouté avec succès !`);
    };

    if (imgFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            processImage(e.target.result);
        };
        reader.readAsDataURL(imgFile);
    } else {
        processImage(imgUrl);
    }
});

// Render edit list
function renderEditList() {
    const container = document.getElementById('adminEditList');
    if (!container) return;
    if (products.length === 0) {
        container.innerHTML = '<p style="color:var(--gray);text-align:center;padding:40px 0;">Aucun parfum à modifier.</p>';
        return;
    }
    container.innerHTML = products.map(p => `
        <div class="admin-edit-item" data-id="${p.id}">
            <img class="admin-edit-img" src="${getImageSrc(p.image)}" alt="${p.name}" onerror="this.src=''; this.style.background='var(--black)'; this.style.display='flex'; this.style.alignItems='center'; this.style.justifyContent='center'">
            <div class="admin-edit-info">
                <div class="edit-name">${p.name}</div>
                <div class="edit-brand">${p.brand}</div>
            </div>
            <div class="admin-edit-actions">
                <input type="file" accept="image/*" class="edit-photo-input" style="display:none" data-id="${p.id}">
                <button class="edit-photo-btn" onclick="editPhoto(${p.id})" title="Changer photo"><i class="fas fa-camera"></i></button>
                <input type="number" class="edit-price-input" value="${p.price}" min="0" data-id="${p.id}">
                <button class="edit-save" onclick="editSave(${p.id})">Sauver</button>
                <button class="edit-del" onclick="editDelete(${p.id})"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

// Edit photo
function editPhoto(id) {
    const input = document.querySelector(`.edit-photo-input[data-id="${id}"]`);
    if (!input) return;
    input.click();
    input.onchange = function() {
        const file = this.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
            const product = products.find(p => p.id === id);
            if (product) {
                product.image = e.target.result;
                saveAdminProducts();
                renderEditList();
                renderFeatured();
                renderCatalogue();
                showToast('Photo mise à jour');
            }
        };
        reader.readAsDataURL(file);
    };
}

// Edit save (price)
function editSave(id) {
    const input = document.querySelector(`.edit-price-input[data-id="${id}"]`);
    if (!input) return;
    const newPrice = parseInt(input.value);
    if (isNaN(newPrice) || newPrice < 0) {
        showToast('Prix invalide');
        return;
    }
    const product = products.find(p => p.id === id);
    if (product) {
        product.price = newPrice;
        saveAdminProducts();
        renderFeatured();
        renderCatalogue();
        updateCartUI();
        showToast(`Prix de "${product.name}" mis à jour`);
    }
}

// Edit delete
function editDelete(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    if (!confirm(`Supprimer "${product.name}" ?`)) return;
    const idx = products.findIndex(p => p.id === id);
    if (idx !== -1) {
        products.splice(idx, 1);
        saveAdminProducts();
        renderEditList();
        renderFeatured();
        renderCatalogue();
        updateCartUI();
        showToast(`"${product.name}" supprimé`);
    }
}

// Load saved products
loadProducts();
renderFeatured();
renderCatalogue();
updateCartUI();
