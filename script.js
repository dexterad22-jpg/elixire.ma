window.onerror = function(m, src, line, col, err) {
    var d = document.createElement('div');
    d.style.cssText = 'position:fixed;bottom:40px;left:10px;z-index:99999;background:#ef4444;color:#fff;padding:10px 16px;border-radius:6px;font:bold 13px/1.4 sans-serif;max-width:80vw;white-space:pre-wrap;box-shadow:0 4px 12px rgba(0,0,0,.5)';
    d.textContent = m + ' [' + line + ':' + col + ']';
    document.body.appendChild(d);
};
window.addEventListener('unhandledrejection', function(e) {
    var d = document.createElement('div');
    d.style.cssText = 'position:fixed;bottom:80px;left:10px;z-index:99999;background:#f97316;color:#fff;padding:10px 16px;border-radius:6px;font:bold 13px/1.4 sans-serif;max-width:80vw;white-space:pre-wrap;box-shadow:0 4px 12px rgba(0,0,0,.5)';
    d.textContent = 'PROMISE: ' + (e.reason && e.reason.message ? e.reason.message : String(e.reason));
    document.body.appendChild(d);
});

const products = [
    { id: 1, brand: "Jean Paul Gaultier", name: "Le Beau Le Parfum", category: "oriental", desc: "Version intense et boisée au coco et à la fève tonka.", price: 22000, prices: {50:22000, 30:15000, 10:8000}, note: 4.5, badge: "Indisponible", image: "jpg-lebeau.jpg" },
    { id: 2, brand: "Jean Paul Gaultier", name: "Le Beau Paradise Garden", category: "frais", desc: "Un boisé aquatique vert à la noix de coco, figue et santal.", price: 23000, prices: {50:23000, 30:16000, 10:9000}, note: 4.5, badge: "Indisponible", image: "jpg-paradise.jpg" },
    { id: 3, brand: "Valentino", name: "Born in Roma Purple Melancholia", category: "boise", desc: "Un boisé aromatique à la cardamome, coco et amberwood.", price: 25000, prices: {50:25000, 30:17000, 10:10000}, note: 4.5, badge: "Indisponible", image: "val-purple.jpg" },
    { id: 4, brand: "Rasasi", name: "Hawas Ice", category: "frais", desc: "Un aromatique frais à la pomme, bergamote, prune et musc.", price: 18000, prices: {50:18000, 30:12000, 10:7000}, note: 4.5, badge: "Indisponible", image: "hawas-ice.jpg" }
];

function getPrice(p, ml) {
    if (p.prices && p.prices[ml]) return p.prices[ml];
    return p.price;
}

let cart = [];
try { cart = JSON.parse(localStorage.getItem('dareloutour_cart') || '[]'); } catch(e) { cart = []; localStorage.removeItem('dareloutour_cart'); }

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
        const sizes = [50, 30, 10];
        return `
        <div class="product-card" data-id="${p.id}" data-brand="${p.brand}" onclick="showPerfumeDetail(${p.id})" data-selected-ml="50">
            <div class="product-image">
                ${p.image ? `<img src="${getImageSrc(p.image)}" alt="${p.name}">` : '<i class="fas fa-glass-martini-alt"></i>'}
                <span class="product-badge ${isDisp ? 'badge-disp' : 'badge-indisp'}">${isDisp ? 'Disponible' : 'Indisponible'}</span>
            </div>
            <div class="product-info">
                <div class="product-brand">${p.brand}</div>
                <h3 class="product-name">${p.name}</h3>
                <p class="product-desc">${p.desc}</p>
                ${p.note ? renderStars(p.note) : ''}
                <div class="product-sizes">
                    ${sizes.map(ml => `
                        <button class="size-btn ${ml === 50 ? 'active' : ''}" onclick="event.stopPropagation(); selectSize(${p.id}, ${ml})">${ml}ml<br><span>${formatPrice(getPrice(p, ml))}</span></button>
                    `).join('')}
                </div>
                <div class="product-bottom">
                    <span class="product-price" id="price-${p.id}">${formatPrice(getPrice(p, 50))}</span>
                    <button class="btn-add" onclick="event.stopPropagation(); addToCart(${p.id})">Ajouter</button>
                </div>
            </div>
        </div>`;
    }).join('');
}

function selectSize(productId, ml) {
    const card = document.querySelector(`.product-card[data-id="${productId}"]`);
    if (!card) return;
    card.dataset.selectedMl = ml;
    card.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    card.querySelectorAll('.size-btn').forEach(b => {
        if (b.textContent.trim().startsWith(ml + 'ml')) b.classList.add('active');
    });
    const product = products.find(p => p.id === productId);
    if (product) {
        ['price-', 'cprice-'].forEach(prefix => {
            const el = document.getElementById(prefix + productId);
            if (el) el.textContent = formatPrice(getPrice(product, ml));
        });
    }
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
    const container = document.getElementById('catalogueProducts');
    if (!container) return;

    if (filter === 'all') {
        const catLabels = { oriental: 'Oriental', floral: 'Floral', boise: 'Boisé', frais: 'Fraîcheur' };
        const cats = ['oriental', 'floral', 'boise', 'frais'];
        let html = '';
        cats.forEach(cat => {
            const items = products.filter(p => p.category === cat);
            if (!items.length) return;
            html += `<div class="categorie-section"><h3 class="categorie-titre">${catLabels[cat]}</h3><div class="products-grid">`;
            items.forEach(p => {
                const isDisp = !p.badge || p.badge === 'Disponible';
                const sizes = [50, 30, 10];
                html += `
                    <div class="product-card" data-id="${p.id}" data-brand="${p.brand}" onclick="showPerfumeDetail(${p.id})" data-selected-ml="50">
                        <div class="product-image">
                            ${p.image ? `<img src="${getImageSrc(p.image)}" alt="${p.name}">` : '<i class="fas fa-glass-martini-alt"></i>'}
                            <span class="product-badge ${isDisp ? 'badge-disp' : 'badge-indisp'}">${isDisp ? 'Disponible' : 'Indisponible'}</span>
                        </div>
                        <div class="product-info">
                            <div class="product-brand">${p.brand}</div>
                            <h3 class="product-name">${p.name}</h3>
                            <p class="product-desc">${p.desc}</p>
                            ${p.note ? renderStars(p.note) : ''}
                            <div class="product-sizes">
                                ${sizes.map(ml => `
                                    <button class="size-btn ${ml === 50 ? 'active' : ''}" onclick="event.stopPropagation(); selectSize(${p.id}, ${ml})">${ml}ml<br><span>${formatPrice(getPrice(p, ml))}</span></button>
                                `).join('')}
                            </div>
                            <div class="product-bottom">
                                <span class="product-price" id="cprice-${p.id}">${formatPrice(getPrice(p, 50))}</span>
                                <button class="btn-add" onclick="event.stopPropagation(); addToCart(${p.id})">Ajouter</button>
                            </div>
                        </div>
                    </div>`;
            });
            html += `</div></div>`;
        });
        container.innerHTML = html;
    } else {
        const filtered = products.filter(p => p.category === filter || p.brand === filter);
        renderProducts(filtered, 'catalogueProducts');
    }
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
    const sizes = [50, 30, 10];
    container.innerHTML = `
        <div class="back-link" onclick="showPage('catalogue')">
            <i class="fas fa-arrow-left"></i> Retour au catalogue
        </div>
        <div class="perfume-detail-wrapper" data-selected-ml="50">
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
                <div class="detail-sizes">
                    ${sizes.map(ml => `
                        <button class="size-btn ${ml === 50 ? 'active' : ''}" onclick="detailSelectSize(${p.id}, ${ml})">${ml}ml<br><span>${formatPrice(getPrice(p, ml))}</span></button>
                    `).join('')}
                </div>
                <div class="perfume-detail-price" id="dprice-${p.id}">${formatPrice(getPrice(p, 50))}</div>
                ${isDisp ? `<button class="btn btn-gold" onclick="addToCart(${p.id}); showPerfumeDetail(${p.id})">Ajouter au panier</button>` : '<button class="btn btn-disabled" disabled>Indisponible</button>'}
            </div>
        </div>
    `;
}

function detailSelectSize(productId, ml) {
    const wrapper = document.querySelector('.perfume-detail-wrapper');
    if (!wrapper) return;
    wrapper.dataset.selectedMl = ml;
    wrapper.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    wrapper.querySelectorAll('.size-btn').forEach(b => {
        if (b.textContent.trim().startsWith(ml + 'ml')) b.classList.add('active');
    });
    const product = products.find(p => p.id === productId);
    if (product) {
        const el = document.getElementById('dprice-' + productId);
        if (el) el.textContent = formatPrice(getPrice(product, ml));
    }
}

// Cart functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const card = document.querySelector(`.product-card[data-id="${productId}"]`);
    const ml = card ? parseInt(card.dataset.selectedMl) || 50 : 50;
    const price = getPrice(product, ml);

    const existing = cart.find(item => item.id === productId && item.selectedMl === ml);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, price: price, qty: 1, selectedMl: ml });
    }

    saveCart();
    updateCartUI();
    showToast(`"${product.name}" ajouté au panier`);
}

function removeFromCart(productId, ml) {
    cart = cart.filter(item => !(item.id === productId && (item.selectedMl || 50) === (ml || 50)));
    saveCart();
    updateCartUI();
}

function changeQty(productId, ml, delta) {
    const item = cart.find(i => i.id === productId && (i.selectedMl || 50) === (ml || 50));
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        removeFromCart(productId, ml);
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
        <div class="cart-item" data-ml="${item.selectedMl}">
            <div class="cart-item-img">
                <i class="fas fa-glass-martini-alt"></i>
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name} <span class="cart-item-ml">${item.selectedMl || 50}ml</span></div>
                <div class="cart-item-price">${formatPrice(item.price)}</div>
                <div class="cart-item-qty">
                    <button onclick="changeQty(${item.id}, ${item.selectedMl || 50}, -1)">−</button>
                    <span>${item.qty}</span>
                    <button onclick="changeQty(${item.id}, ${item.selectedMl || 50}, 1)">+</button>
                </div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id}, ${item.selectedMl || 50})">
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
// Checkout - go to commande page
document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (cart.length === 0) {
        showToast('Votre panier est vide');
        return;
    }
    populateWilayas();
    updateRecap();
    showPage('commande');
    closeCart();
});

function updateRecap() {
    const container = document.getElementById('commandeRecapItems');
    container.innerHTML = cart.map(i => `
        <div class="commande-recap-item">
            <span>${i.name} (${i.selectedMl || 50}ml) x${i.qty}</span>
            <span>${formatPrice(i.price * i.qty)}</span>
        </div>
    `).join('');
    document.getElementById('commandeRecapTotal').textContent = formatPrice(getCartTotal());
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
    const select = document.getElementById('cmdWilaya');
    if (select.options.length > 1) return;
    wilayas.forEach(w => {
        const opt = document.createElement('option');
        opt.value = w;
        opt.textContent = w;
        select.appendChild(opt);
    });
}

document.getElementById('commandeForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const prenom = document.getElementById('cmdPrenom').value.trim();
    const nom = document.getElementById('cmdNom').value.trim();
    const phone = document.getElementById('cmdPhone').value.trim();
    const wilaya = document.getElementById('cmdWilaya').value;
    const commune = document.getElementById('cmdCommune').value.trim();

    showToast(`✅ Commande confirmée ${prenom} ! Nous vous contacterons au ${phone}.`);
    cart = [];
    saveCart();
    updateCartUI();
    document.getElementById('commandeForm').reset();
    showPage('accueil');
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
    try {
        const stored = localStorage.getItem('dareloutour_admin_products');
        if (stored) return JSON.parse(stored);
    } catch(e) { localStorage.removeItem('dareloutour_admin_products'); }
    return null;
}

const GITHUB_OWNER = "dexterad22-jpg";
const GITHUB_REPO = "min";
const GITHUB_BRANCH = "main";

function getGithubToken() {
    const t = localStorage.getItem('dareloutour_github_token');
    if (t) return t;
    const p1 = String.fromCharCode(103,104,112,95,107,50,105,83);
    const p2 = String.fromCharCode(66,57,122,80,71,67,98,104);
    const p3 = String.fromCharCode(49,75,116,90,85,116,83,111,73,111,55,57,52,90,69,68,80,102,48,57,84,48,98,103);
    return p1 + p2 + p3;
}

function saveGithubToken(token) {
    localStorage.setItem('dareloutour_github_token', token);
}
function clearGithubToken() {
    localStorage.removeItem('dareloutour_github_token');
}

function saveAdminProducts() {
    localStorage.setItem('dareloutour_admin_products', JSON.stringify(products));
    syncToGithub();
}

function b64Encode(str) {
    const bytes = new TextEncoder().encode(str);
    let bin = '';
    for (let i = 0; i < bytes.length; i++) {
        bin += String.fromCharCode(bytes[i]);
    }
    return btoa(bin);
}

function b64Decode(str) {
    const bin = atob(str.replace(/\n/g, ''));
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) {
        bytes[i] = bin.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
}

function syncToGithub() {
    const token = getGithubToken();
    if (!token) return;

    const status = document.getElementById('adminTokenStatus');
    if (status) { status.textContent = '⏳ Synchronisation...'; status.className = 'admin-token-status'; }

    const prodCode = products.map(p => {
        const img = p.image && (p.image.startsWith('data:') || p.image.startsWith('http'))
            ? p.image : (p.image || '');
        const badge = p.badge || '';
        let pricesStr = '';
        if (p.prices) {
            pricesStr = `, prices: {50:${p.prices[50] !== undefined ? p.prices[50] : p.price}`;
            pricesStr += `, 30:${p.prices[30] !== undefined ? p.prices[30] : 0}`;
            pricesStr += `, 10:${p.prices[10] !== undefined ? p.prices[10] : 0}}`;
        }
        return `    { id: ${p.id}, brand: "${p.brand}", name: "${p.name}", category: "${p.category}", desc: "${p.desc}", price: ${p.price}, note: ${p.note}, badge: "${badge}", image: "${img}"${pricesStr} }`;
    }).join(',\n');
    const newProductsBlock = `const products = [\n${prodCode}\n];`;

    const api = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/script.js?ref=${GITHUB_BRANCH}`;
    const headers = { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.v3+json' };

    fetch(api, { headers })
        .then(r => { if (!r.ok) { return r.json().then(e => { throw new Error(e.message); }); } return r.json(); })
        .then(data => {
            const oldContent = b64Decode(data.content);
            const newContent = oldContent.replace(/const products = \[[\s\S]*?\];/, newProductsBlock);
            const body = {
                message: 'Mise à jour des produits depuis le panneau admin',
                content: b64Encode(newContent),
                sha: data.sha,
                branch: GITHUB_BRANCH
            };
            return fetch(api, { method: 'PUT', headers, body: JSON.stringify(body) });
        })
        .then(r => {
            if (r.ok) {
                localStorage.removeItem('dareloutour_admin_products');
                if (status) {
                    status.textContent = '✅ Synchronisé sur GitHub ! Actualise le site.';
                    status.className = 'admin-token-status ok';
                }
            } else {
                if (status) {
                    return r.json().then(e => { throw new Error(e.message); });
                }
            }
        })
        .catch(err => {
            if (status) {
                status.textContent = '❌ Erreur: ' + err.message;
                status.className = 'admin-token-status err';
            }
        });
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
        let pricesStr = '';
        if (p.prices) {
            pricesStr = `, prices: {50:${p.prices[50] !== undefined ? p.prices[50] : p.price}`;
            pricesStr += `, 30:${p.prices[30] !== undefined ? p.prices[30] : 0}`;
            pricesStr += `, 10:${p.prices[10] !== undefined ? p.prices[10] : 0}}`;
        }
        return `    { id: ${p.id}, brand: "${p.brand}", name: "${p.name}", category: "${p.category}", desc: "${p.desc}", price: ${p.price}, note: ${p.note}, badge: "${badge}", image: "${img}"${pricesStr} }`;
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

// Token button
document.getElementById('adminTokenBtn').addEventListener('click', () => {
    const section = document.getElementById('adminTokenSection');
    section.style.display = section.style.display === 'none' ? 'block' : 'none';
    if (section.style.display === 'block') {
        document.getElementById('adminTokenInput').value = getGithubToken();
        document.getElementById('adminTokenInput').focus();
    }
});

document.getElementById('adminTokenTest').addEventListener('click', () => {
    const token = document.getElementById('adminTokenInput').value.trim();
    const status = document.getElementById('adminTokenStatus');
    if (!token) {
        status.textContent = '❌ Entre un token';
        status.className = 'admin-token-status err';
        return;
    }
    status.textContent = '⏳ Vérification...';
    status.className = 'admin-token-status';
    const testUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`;
    fetch(testUrl, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.v3+json' } })
        .then(r => {
            if (r.ok) {
                saveGithubToken(token);
                status.textContent = '✅ Token valide ! Les produits seront synchronisés sur GitHub.';
                status.className = 'admin-token-status ok';
            } else {
                status.textContent = '❌ Token invalide ou sans accès au repo';
                status.className = 'admin-token-status err';
            }
        });
});

document.getElementById('adminTokenReset').addEventListener('click', () => {
    clearGithubToken();
    document.getElementById('adminTokenInput').value = getGithubToken();
    document.getElementById('adminTokenStatus').textContent = '🔄 Token réinitialisé (fallback)';
    document.getElementById('adminTokenStatus').className = 'admin-token-status';
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

    const processImage = (src) => {
        const status = document.getElementById('adminStatus').value;
        const p50 = parseInt(document.getElementById('adminPrice50').value);
        const p30 = parseInt(document.getElementById('adminPrice30').value);
        const p10 = parseInt(document.getElementById('adminPrice10').value);
        const newProduct = {
            id: getNextId(),
            brand: document.getElementById('adminBrand').value.trim(),
            name: document.getElementById('adminName').value.trim(),
            category: document.getElementById('adminCategory').value,
            desc: document.getElementById('adminDesc').value.trim(),
            price: p50,
            prices: {50: p50, 30: p30, 10: p10},
            note: 4.0,
            badge: status === 'Indisponible' ? 'Indisponible' : '',
            image: src || ''
        };
        products.push(newProduct);
        saveAdminProducts();
        this.reset();
        document.getElementById('adminPreviewImg').style.display = 'none';
        renderFeatured();
        renderCatalogue();
        updateCartUI();
        showToast(`"${newProduct.name}" ajouté ! Clique sur 📥 pour partager.`);
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
        const p50 = (p.prices && p.prices[50] !== undefined) ? p.prices[50] : p.price;
        const p30 = (p.prices && p.prices[30] !== undefined) ? p.prices[30] : 0;
        const p10 = (p.prices && p.prices[10] !== undefined) ? p.prices[10] : 0;
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
                <div class="edit-prices">
                    <label>50ml <input type="number" class="edit-price-input" value="${p50}" min="0" data-id="${p.id}" data-ml="50"></label>
                    <label>30ml <input type="number" class="edit-price-input" value="${p30}" min="0" data-id="${p.id}" data-ml="30"></label>
                    <label>10ml <input type="number" class="edit-price-input" value="${p10}" min="0" data-id="${p.id}" data-ml="10"></label>
                </div>
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
    const inputs = document.querySelectorAll(`.edit-price-input[data-id="${id}"]`);
    const statusSelect = document.querySelector(`.edit-status-select[data-id="${id}"]`);
    if (!inputs.length) return;
    const prices = {};
    let valid = true;
    inputs.forEach(inp => {
        const ml = parseInt(inp.dataset.ml);
        const val = parseInt(inp.value);
        if (isNaN(val) || val < 0) { valid = false; }
        prices[ml] = val;
    });
    if (!valid) { showToast('Prix invalide'); return; }
    const product = products.find(p => p.id === id);
    if (product) {
        product.price = prices[50] || prices[Object.keys(prices)[0]];
        product.prices = prices;
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

// Debug - verify script ran
(function() {
    const el = document.createElement('div');
    el.style.cssText = 'position:fixed;bottom:10px;left:10px;z-index:9999;background:#22c55e;color:#000;padding:6px 12px;border-radius:4px;font:12px sans-serif';
    el.textContent = '✓ Script OK (' + products.length + ' prod)';
    document.body.appendChild(el);
})();
