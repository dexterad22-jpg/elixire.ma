const products = [
    { id: 1, brand: "Jean Paul Gaultier", name: "Le Beau Le Parfum", category: "oriental", desc: "Version intense et boisée au coco et à la fève tonka.", price: 22000, note: 4.5, badge: "Indisponible", image: "jpg-lebeau.jpg" },
    { id: 2, brand: "Jean Paul Gaultier", name: "Le Beau Paradise Garden", category: "frais", desc: "Un boisé aquatique vert à la noix de coco, figue et santal.", price: 23000, note: 4.5, badge: "Indisponible", image: "jpg-paradise.jpg" },
    { id: 3, brand: "Valentino", name: "Born in Roma Purple Melancholia", category: "boise", desc: "Un boisé aromatique à la cardamome, coco et amberwood.", price: 25000, note: 4.5, badge: "Indisponible", image: "val-purple.jpg" },
    { id: 4, brand: "Rasasi", name: "Hawas Ice", category: "frais", desc: "Un aromatique frais à la pomme, bergamote, prune et musc.", price: 18000, note: 4.5, badge: "Indisponible", image: "hawas-ice.jpg" },
    { id: 5, brand: "Louis Vuitton", name: "Imagination", category: "oriental", desc: "Imagination by Louis Vuitton is a Citrus Aromatic fragrance for men. Imagination was launched in 2021. The nose behind this fragrance is Jacques Cavallier Belletrud. Top notes are Citron, Calabrian bergamot and Sicilian Orange; middle notes are Tunisian Neroli, Nigerian Ginger and Ceylon Cinnamon; base notes are Chinese Black Tea, Ambroxan, Guaiac Wood and Olibanum.", price: 100000, note: 4, badge: "", image: "data:image/webp;base64,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" }
];

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
    if (adminData && adminData.length) {
        const hardcodedIds = products.map(p => p.id);
        adminData.forEach(p => {
            if (!hardcodedIds.includes(p.id)) {
                products.push(p);
            }
        });
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

document.getElementById('adminDlBtn').addEventListener('click', () => {
    const prodCode = products.map(p => {
        const img = p.image && (p.image.startsWith('data:') || p.image.startsWith('http'))
            ? p.image
            : (p.image || '');
        const badge = p.badge || '';
        return `    { id: ${p.id}, brand: "${p.brand}", name: "${p.name}", category: "${p.category}", desc: "${p.desc}", price: ${p.price}, note: ${p.note}, badge: "${badge}", image: "${img}" }`;
    }).join(',\n');
    const newProductsBlock = `const products = [\n${prodCode}\n];`;

    fetch('script.js').then(r => r.text()).then(code => {
        const updated = code.replace(/const products = \[[\s\S]*?\];/, newProductsBlock);
        const blob = new Blob([updated], { type: 'application/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'script.js';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('✅ script.js téléchargé ! Upload-le sur GitHub.');
    }).catch(() => {
        showToast('Erreur de téléchargement. Réessaie.');
    });
});

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
