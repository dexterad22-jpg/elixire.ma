const products = [
    { id: 1, brand: "Jean Paul Gaultier", name: "Le Beau Le Parfum", category: "oriental", desc: "Version intense et boisée au coco et à la fève tonka.", price: 22000, note: 4.5, badge: "Indisponible", image: "jpg-lebeau.jpg" },
    { id: 2, brand: "Jean Paul Gaultier", name: "Le Beau Paradise Garden", category: "frais", desc: "Un boisé aquatique vert à la noix de coco, figue et santal.", price: 23000, note: 4.5, badge: "Indisponible", image: "jpg-paradise.jpg" },
    { id: 3, brand: "Valentino", name: "Born in Roma Purple Melancholia", category: "boise", desc: "Un boisé aromatique à la cardamome, coco et amberwood.", price: 25000, note: 4.5, badge: "Indisponible", image: "val-purple.jpg" },
    { id: 4, brand: "Rasasi", name: "Hawas Ice", category: "frais", desc: "Un aromatique frais à la pomme, bergamote, prune et musc.", price: 18000, note: 4.5, badge: "Indisponible", image: "hawas-ice.jpg" }
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

// Hero button
document.querySelector('.hero-content .btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    showPage('catalogue');
});

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
    container.innerHTML = productsArray.map(p => {
        const isDisp = !p.badge || p.badge === 'Disponible';
        return `
        <div class="product-card" data-id="${p.id}" data-brand="${p.brand}" onclick="showPerfumeDetail(${p.id})">
            <div class="product-image">
                ${p.image ? `<img src="${getImageSrc(p.image)}" alt="${p.name}">` : '<i class="fas fa-glass-martini-alt"></i>'}
                <span class="product-badge ${isDisp ? 'badge-disp' : 'badge-indisp'}">${isDisp ? 'Disponible' : 'Indisponible'}</span>
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
        </div>`;
    }).join('');
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
    const isDisp = !p.badge || p.badge === 'Disponible';
    const monthly = Math.round(p.price / 3);
    container.innerHTML = `
        <div class="back-link" onclick="showPage('catalogue')">
            <i class="fas fa-arrow-left"></i> Retour au catalogue
        </div>
        <div class="perfume-detail-wrapper">
            <div class="perfume-detail-image">
                ${p.image ? `<img src="${getImageSrc(p.image)}" alt="${p.name}">` : '<i class="fas fa-glass-martini-alt"></i>'}
                <span class="perfume-detail-badge ${isDisp ? 'badge-disp' : 'badge-indisp'}">${isDisp ? 'Disponible' : 'Indisponible'}</span>
            </div>
            <div class="perfume-detail-info">
                <div class="perfume-detail-category">${p.category}</div>
                <div class="perfume-detail-brand">${p.brand}</div>
                <h2 class="perfume-detail-name">${p.name}</h2>
                ${p.note ? renderStars(p.note) : ''}
                <p class="perfume-detail-desc">${p.desc}</p>
                <div class="perfume-detail-price">${formatPrice(p.price)}</div>
                ${isDisp ? `<div class="perfume-installment"><i class="fas fa-credit-card"></i> Payable en 3x <strong>${formatPrice(monthly)}</strong>/mois sans frais</div>` : ''}
                ${isDisp ? `<button class="btn btn-gold" onclick="addToCart(${p.id}); showPerfumeDetail(${p.id})">Ajouter au panier</button>` : '<button class="btn btn-disabled" disabled>Indisponible</button>'}
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
// Checkout - open modal
document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (cart.length === 0) {
        showToast('Votre panier est vide');
        return;
    }
    populateWilayas();
    updateCheckoutSummary();
    document.getElementById('checkoutOverlay').classList.add('open');
    document.getElementById('checkoutModal').classList.add('open');
    closeCart();
});

function closeCheckout() {
    document.getElementById('checkoutOverlay').classList.remove('open');
    document.getElementById('checkoutModal').classList.remove('open');
}
document.getElementById('checkoutClose').addEventListener('click', closeCheckout);
document.getElementById('checkoutOverlay').addEventListener('click', closeCheckout);

function updateCheckoutSummary() {
    const container = document.getElementById('checkoutSummary');
    const items = cart.map(i => `${i.name} x${i.qty}`).join(', ');
    container.innerHTML = `<i class="fas fa-shopping-bag"></i> <strong>${getCartCount()} article(s)</strong> : ${items}<br><i class="fas fa-money-bill-wave"></i> Total : <strong>${formatPrice(getCartTotal())}</strong>`;
}

const wilayas = [
    "Adrar","Chlef","Laghouat","Oum El Bouaghi","Batna","Béjaïa","Biskra","Béchar","Blida","Bouira",
    "Tamanrasset","Tébessa","Tlemcen","Tiaret","Tizi Ouzou","Alger","Djelfa","Jijel","Sétif","Saïda",
    "Skikda","Sidi Bel Abbès","Annaba","Guelma","Constantine","Médéa","Mostaganem","Msila","Mascara",
    "Ouargla","Oran","El Bayadh","Illizi","Bordj Bou Arreridj","Boumerdès","El Tarf","Tindouf",
    "Tissemsilt","El Oued","Khenchela","Souk Ahras","Tipaza","Mila","Aïn Defla","Naâma","Aïn Témouchent",
    "Ghardaïa","Relizane","Timimoun","Bordj Badji Mokhtar","Ouled Djellal","Béni Abbès","In Salah",
    "In Guezzam","Touggourt","Djanet","El M'Ghair","El Meniaa"
];

function populateWilayas() {
    const select = document.getElementById('checkoutWilaya');
    if (select.options.length > 1) return;
    wilayas.forEach(w => {
        const opt = document.createElement('option');
        opt.value = w;
        opt.textContent = w;
        select.appendChild(opt);
    });
}

// Checkout form submit
document.getElementById('checkoutForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const prenom = document.getElementById('checkoutPrenom').value.trim();
    const nom = document.getElementById('checkoutNom').value.trim();
    const phone = document.getElementById('checkoutPhone').value.trim();
    const wilaya = document.getElementById('checkoutWilaya').value;
    const commune = document.getElementById('checkoutCommune').value.trim();

    const order = {
        date: new Date().toLocaleString('fr-FR'),
        client: { prenom, nom, phone, wilaya, commune },
        items: cart.map(i => ({ name: i.name, qty: i.qty, price: i.price })),
        total: getCartTotal()
    };

    console.log('Nouvelle commande:', order);

    showToast(`✅ Commande confirmée ${prenom} ! Nous vous contacterons au ${phone}.`);
    cart = [];
    saveCart();
    updateCartUI();
    closeCheckout();
    document.getElementById('checkoutForm').reset();
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
        const status = document.getElementById('adminStatus').value;
        const newProduct = {
            id: getNextId(),
            brand: document.getElementById('adminBrand').value.trim(),
            name: document.getElementById('adminName').value.trim(),
            category: document.getElementById('adminCategory').value,
            desc: document.getElementById('adminDesc').value.trim(),
            price: parseInt(document.getElementById('adminPrice').value),
            note: 4.0,
            badge: status === 'Indisponible' ? 'Indisponible' : '',
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
    container.innerHTML = products.map(p => {
        const isDisp = !p.badge || p.badge === 'Disponible';
        return `
        <div class="admin-edit-item" data-id="${p.id}">
            <img class="admin-edit-img" src="${getImageSrc(p.image)}" alt="${p.name}" onerror="this.src=''; this.style.background='var(--black)'; this.style.display='flex'; this.style.alignItems='center'; this.style.justifyContent='center'">
            <div class="admin-edit-info">
                <div class="edit-name">${p.name}</div>
                <div class="edit-brand">${p.brand} · <span style="color:${isDisp ? '#22c55e' : '#D4AF37'}">${isDisp ? 'Disponible' : 'Indisponible'}</span></div>
            </div>
            <div class="admin-edit-actions">
                <input type="file" accept="image/*" class="edit-photo-input" style="display:none" data-id="${p.id}">
                <button class="edit-photo-btn" onclick="editPhoto(${p.id})" title="Changer photo"><i class="fas fa-camera"></i></button>
                <select class="edit-status-select" data-id="${p.id}">
                    <option value="Disponible" ${isDisp ? 'selected' : ''}>Disponible</option>
                    <option value="Indisponible" ${!isDisp ? 'selected' : ''}>Indisponible</option>
                </select>
                <input type="number" class="edit-price-input" value="${p.price}" min="0" data-id="${p.id}">
                <button class="edit-save" onclick="editSave(${p.id})">Sauver</button>
                <button class="edit-del" onclick="editDelete(${p.id})"><i class="fas fa-trash"></i></button>
            </div>
        </div>`;
    }).join('');
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

// Edit save (price + status)
function editSave(id) {
    const priceInput = document.querySelector(`.edit-price-input[data-id="${id}"]`);
    const statusSelect = document.querySelector(`.edit-status-select[data-id="${id}"]`);
    if (!priceInput) return;
    const newPrice = parseInt(priceInput.value);
    if (isNaN(newPrice) || newPrice < 0) {
        showToast('Prix invalide');
        return;
    }
    const product = products.find(p => p.id === id);
    if (product) {
        product.price = newPrice;
        product.badge = statusSelect && statusSelect.value === 'Indisponible' ? 'Indisponible' : '';
        saveAdminProducts();
        renderFeatured();
        renderCatalogue();
        updateCartUI();
        showToast(`"${product.name}" mis à jour`);
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
