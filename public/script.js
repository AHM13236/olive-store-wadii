// ===== المتغيرات العامة =====
let currentUser = null;
let cart = [];
let products = [];
let isAuthMode = 'login'; // 'login' أو 'register'

// API Base URL
const API_BASE = window.location.origin;

// ===== تهيئة التطبيق =====
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    loadCart();
    checkAuthStatus();
    setupEventListeners();
    setupNavigation();
});

// ===== إدارة التنقل =====
// إعداد التنقل
function setupNavigation() {
    // إظهار الصفحة الرئيسية افتراضياً
    showPage('home');
    
    // إعداد روابط التنقل
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('href').substring(1);
            showPage(page);
            
            // تحديث الرابط النشط
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // إعداد أزرار السلة والتسجيل
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) {
        cartBtn.addEventListener('click', toggleCart);
    }
    
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', showAuthModal);
    }
    
    // إعداد أزرار إغلاق النوافذ
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').classList.remove('show');
        });
    });
    
    // إعداد إغلاق السلة
    const closeCartBtn = document.querySelector('.close-cart');
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCart);
    }
    
    // إعداد زر إتمام الطلب
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', showCheckoutModal);
    }
    
    // إعداد تبديل نماذج المصادقة
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            // إزالة الفئة النشطة من جميع التبويبات
            document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
            
            // إضافة الفئة النشطة للتبويب المحدد
            this.classList.add('active');
            document.getElementById(targetTab + '-form').classList.add('active');
        });
    });
}

// إظهار صفحة معينة
function showPage(pageId) {
    // إخفاء جميع الصفحات
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // إظهار الصفحة المطلوبة
    const targetPage = document.getElementById(pageId + '-page');
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // إذا كانت صفحة الطلبات، قم بتحميل الطلبات
    if (pageId === 'orders') {
        showOrdersPage();
    }
    
    // إذا كانت صفحة المراجعات، قم بتحميل المراجعات
    if (pageId === 'reviews') {
        showReviewsPage();
    }
    
    // إغلاق السلة إذا كانت مفتوحة
    closeCart();
}

// ===== إدارة السلة =====
// فتح/إغلاق السلة
function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    if (cartSidebar) {
        cartSidebar.classList.toggle('open');
    }
}

// إغلاق السلة
function closeCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    if (cartSidebar) {
        cartSidebar.classList.remove('open');
    }
}

// ===== إدارة المصادقة =====
// إظهار نافذة التسجيل
function showAuthModal() {
    const authModal = document.getElementById('auth-modal');
    if (authModal) {
        authModal.classList.add('show');
    }
}

// إغلاق نافذة التسجيل
function closeAuthModal() {
    const authModal = document.getElementById('auth-modal');
    if (authModal) {
        authModal.classList.remove('show');
    }
}

// التبديل بين تسجيل الدخول والتسجيل
function switchAuthMode() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginTab = document.querySelector('[onclick="switchAuthMode()"]');
    const registerTab = document.querySelector('[onclick="switchAuthMode()"]');
    
    if (isAuthMode === 'login') {
        isAuthMode = 'register';
        if (loginForm) loginForm.classList.remove('active');
        if (registerForm) registerForm.classList.add('active');
    } else {
        isAuthMode = 'login';
        if (registerForm) registerForm.classList.remove('active');
        if (loginForm) loginForm.classList.add('active');
    }
}

// ===== إعداد مستمعي الأحداث =====
function setupEventListeners() {
    // إعداد التنقل
    setupNavigation();
    
    // نماذج التسجيل - التحقق من وجود العناصر أولاً
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const checkoutForm = document.getElementById('checkout-form');
    
    if (loginForm) {
        const loginButton = loginForm.querySelector('button[type="submit"]');
        if (loginButton) {
            loginButton.addEventListener('click', handleLogin);
        }
    }
    
    if (registerForm) {
        const registerButton = registerForm.querySelector('button[type="submit"]');
        if (registerButton) {
            registerButton.addEventListener('click', handleRegister);
        }
    }
    
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
    }

    // أزرار التصفية
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterProducts(this.dataset.category);
        });
    });

    // إغلاق النوافذ عند النقر خارجها
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('show');
            }
        });
    });
    
    // إعداد إغلاق السلة
    const closeCartBtn = document.querySelector('.close-cart');
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCart);
    }
}

// ===== إدارة المنتجات =====
// تحميل المنتجات
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE}/api/products`);
        if (response.ok) {
            products = await response.json();
            displayProducts(products);
        } else {
            showAlert('خطأ في تحميل المنتجات', 'error');
        }
    } catch (error) {
        console.error('خطأ في تحميل المنتجات:', error);
        showAlert('خطأ في الاتصال بالخادم', 'error');
    }
}

// عرض المنتجات
function displayProducts(productsToShow) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';

    productsToShow.forEach(product => {
        const productCard = createProductCard(product);
        grid.appendChild(productCard);
    });
}

// إنشاء بطاقة منتج
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.onclick = () => showProductDetails(product);

    // إنشاء صورة SVG للمنتج
    const productIcon = getProductIcon(product.category);
    
    card.innerHTML = `
        <div class="product-image">
            ${productIcon}
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-details">
                <span class="product-origin">المنشأ: ${product.origin}</span>
                <span class="product-grade">${product.quality_grade}</span>
                <span class="product-weight">الوزن: ${product.weight_kg || 10} كيلو</span>
            </div>
            <div class="product-footer">
                <span class="product-price">${product.price.toFixed(2)} جنيه</span>
                <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> إضافة للسلة
                </button>
            </div>
        </div>
    `;

    return card;
}

// الحصول على أيقونة المنتج حسب الفئة
function getProductIcon(category) {
    const icons = {
        'زيتون': `
            <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <radialGradient id="oliveGradient" cx="0.3" cy="0.3" r="0.7">
                        <stop offset="0%" style="stop-color:#9ccc65"/>
                        <stop offset="100%" style="stop-color:#558b2f"/>
                    </radialGradient>
                </defs>
                <ellipse cx="60" cy="60" rx="25" ry="35" fill="url(#oliveGradient)" transform="rotate(-15 60 60)"/>
                <ellipse cx="45" cy="45" rx="20" ry="30" fill="url(#oliveGradient)" transform="rotate(20 45 45)"/>
                <ellipse cx="75" cy="50" rx="18" ry="28" fill="url(#oliveGradient)" transform="rotate(-30 75 50)"/>
                <path d="M60 25 Q65 20 70 25 Q75 30 70 35 Q65 30 60 25" fill="#4caf50"/>
            </svg>
        `,
        'خضروات': `
            <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="cucumberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#66bb6a"/>
                        <stop offset="100%" style="stop-color:#2e7d32"/>
                    </linearGradient>
                </defs>
                <ellipse cx="60" cy="60" rx="35" ry="15" fill="url(#cucumberGradient)"/>
                <circle cx="45" cy="55" r="3" fill="#1b5e20" opacity="0.6"/>
                <circle cx="55" cy="65" r="3" fill="#1b5e20" opacity="0.6"/>
                <circle cx="70" cy="58" r="3" fill="#1b5e20" opacity="0.6"/>
                <path d="M25 60 Q30 55 35 60 Q30 65 25 60" fill="#4caf50"/>
            </svg>
        `,
        'فلفل': `
            <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="pepperGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#ff5722"/>
                        <stop offset="100%" style="stop-color:#d32f2f"/>
                    </linearGradient>
                </defs>
                <path d="M60 30 Q70 35 75 50 Q80 70 70 85 Q60 90 50 85 Q40 70 45 50 Q50 35 60 30" fill="url(#pepperGradient)"/>
                <path d="M60 30 Q65 25 70 30 Q75 35 70 40 Q65 35 60 30" fill="#4caf50"/>
                <ellipse cx="55" cy="50" rx="3" ry="8" fill="#ffeb3b" opacity="0.7"/>
            </svg>
        `,
        'مخللات': `
            <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="jarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#e3f2fd"/>
                        <stop offset="100%" style="stop-color:#90caf9"/>
                    </linearGradient>
                </defs>
                <rect x="40" y="35" width="40" height="50" rx="5" fill="url(#jarGradient)" stroke="#1976d2" stroke-width="2"/>
                <rect x="45" y="25" width="30" height="15" rx="3" fill="#ffc107"/>
                <circle cx="50" cy="50" r="4" fill="#4caf50"/>
                <circle cx="65" cy="60" r="4" fill="#4caf50"/>
                <circle cx="55" cy="70" r="4" fill="#4caf50"/>
                <path d="M40 45 Q60 40 80 45" stroke="#81c784" stroke-width="2" fill="none"/>
            </svg>
        `,
        'ليمون': `
            <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <radialGradient id="lemonGradient" cx="0.3" cy="0.3" r="0.7">
                        <stop offset="0%" style="stop-color:#fff176"/>
                        <stop offset="100%" style="stop-color:#f57f17"/>
                    </radialGradient>
                </defs>
                <ellipse cx="60" cy="60" rx="25" ry="30" fill="url(#lemonGradient)"/>
                <path d="M60 30 Q65 25 70 30 Q65 35 60 30" fill="#4caf50"/>
                <path d="M45 50 Q50 45 55 50" stroke="#f9a825" stroke-width="2" fill="none"/>
                <path d="M65 65 Q70 60 75 65" stroke="#f9a825" stroke-width="2" fill="none"/>
            </svg>
        `
    };
    
    // البحث عن الفئة المناسبة
    for (const [key, icon] of Object.entries(icons)) {
        if (category.includes(key)) {
            return icon;
        }
    }
    
    // أيقونة افتراضية للمنتجات غير المصنفة
    return `
        <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="defaultGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#81c784"/>
                    <stop offset="100%" style="stop-color:#388e3c"/>
                </linearGradient>
            </defs>
            <circle cx="60" cy="60" r="30" fill="url(#defaultGradient)"/>
            <path d="M60 35 Q65 30 70 35 Q75 40 70 45 Q65 40 60 35" fill="#4caf50"/>
            <circle cx="55" cy="55" r="3" fill="#2e7d32"/>
            <circle cx="65" cy="65" r="3" fill="#2e7d32"/>
        </svg>
    `;
}

// تصفية المنتجات
function filterProducts(category) {
    if (category === 'all') {
        displayProducts(products);
    } else {
        const filtered = products.filter(product => product.category === category);
        displayProducts(filtered);
    }
}

// عرض تفاصيل المنتج
function showProductDetails(product) {
    const modal = document.getElementById('product-modal');
    const title = document.getElementById('product-modal-title');
    const details = document.getElementById('product-details');

    title.textContent = product.name;
    
    details.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: start;">
            <div class="product-image" style="height: 250px; border-radius: 10px;">
                ${getProductIcon(product.category)}
            </div>
            <div>
                <h3 style="color: #2d4a22; margin-bottom: 1rem;">${product.name}</h3>
                <p style="color: #666; margin-bottom: 1rem; line-height: 1.6;">${product.description}</p>
                
                <div style="margin-bottom: 1rem;">
                    <strong style="color: #2d4a22;">السعر:</strong>
                    <span style="font-size: 1.5rem; color: #8bc34a; font-weight: 600;">${product.price.toFixed(2)} جنيه</span>
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <strong style="color: #2d4a22;">الوزن:</strong>
                    <span style="color: #8bc34a;">${product.weight_kg || 10} كيلو</span>
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <strong style="color: #2d4a22;">المنشأ:</strong>
                    <span style="color: #8bc34a;">${product.origin}</span>
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <strong style="color: #2d4a22;">درجة الجودة:</strong>
                    <span style="color: #8bc34a;">${product.quality_grade}</span>
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <strong style="color: #2d4a22;">الكمية المتوفرة:</strong>
                    <span style="color: ${product.stock_quantity > 10 ? '#8bc34a' : '#ff4444'};">${product.stock_quantity} قطعة</span>
                </div>
                
                <div style="margin-bottom: 2rem;">
                    <strong style="color: #2d4a22;">الفئة:</strong>
                    <span style="color: #8bc34a;">${product.category}</span>
                </div>
                
                <button class="add-to-cart-btn" onclick="addToCart(${product.id}); closeProductModal();" style="width: 100%; padding: 1rem; font-size: 1.1rem;">
                    <i class="fas fa-cart-plus"></i> إضافة للسلة
                </button>
            </div>
        </div>
    `;

    modal.classList.add('show');
}

// إضافة منتج للسلة
async function addToCart(productId, quantity = 1) {
    // البحث عن المنتج
    const product = products.find(p => p.id === productId);
    if (!product) {
        showAlert('المنتج غير موجود', 'error');
        return;
    }

    if (currentUser) {
        // إذا كان المستخدم مسجل دخول، استخدم API
        try {
            const response = await fetch(`${API_BASE}/api/cart/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ product_id: productId, quantity })
            });

            if (response.ok) {
                showAlert('تم إضافة المنتج للسلة بنجاح', 'success');
                loadCart();
            } else {
                const error = await response.json();
                showAlert(error.error || 'خطأ في إضافة المنتج للسلة', 'error');
            }
        } catch (error) {
            console.error('خطأ في إضافة المنتج للسلة:', error);
            showAlert('خطأ في الاتصال بالخادم', 'error');
        }
    } else {
        // إذا لم يكن مسجل دخول، استخدم السلة المحلية
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: quantity,
                category: product.category,
                weight_kg: product.weight_kg || 10
            });
        }
        
        updateCartDisplay();
        showAlert('تم إضافة المنتج للسلة بنجاح', 'success');
    }
}

// تحميل السلة
async function loadCart() {
    if (!currentUser) {
        cart = [];
        updateCartDisplay();
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/api/cart`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            cart = await response.json();
            updateCartDisplay();
        }
    } catch (error) {
        console.error('خطأ في تحميل السلة:', error);
    }
}

// تحديث عرض السلة
function updateCartDisplay() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    // تحديث عدد العناصر
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // تحديث محتويات السلة
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>السلة فارغة</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    ${getProductIcon(item.category || 'زيتون أخضر')}
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price.toFixed(2)} جنيه</div>
                    <div class="cart-item-weight">الوزن: ${item.weight_kg || 10} كيلو</div>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateCartItemQuantity(${item.id}, ${item.quantity - 1})">
                        <i class="fas fa-minus"></i>
                    </button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" 
                           onchange="updateCartItemQuantity(${item.id}, this.value)">
                    <button class="quantity-btn" onclick="updateCartItemQuantity(${item.id}, ${item.quantity + 1})">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    // تحديث المجموع
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
}

// تحديث كمية منتج في السلة
async function updateCartItemQuantity(cartItemId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(cartItemId);
        return;
    }

    if (currentUser) {
        // إذا كان المستخدم مسجل دخول، استخدم API
        try {
            const response = await fetch(`${API_BASE}/api/cart/${cartItemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ quantity: parseInt(newQuantity) })
            });

            if (response.ok) {
                loadCart();
            } else {
                showAlert('خطأ في تحديث الكمية', 'error');
            }
        } catch (error) {
            console.error('خطأ في تحديث الكمية:', error);
            showAlert('خطأ في الاتصال بالخادم', 'error');
        }
    } else {
        // إذا لم يكن مسجل دخول، استخدم السلة المحلية
        const item = cart.find(item => item.id === cartItemId);
        if (item) {
            item.quantity = parseInt(newQuantity);
            updateCartDisplay();
        }
    }
}

// حذف منتج من السلة
async function removeFromCart(cartItemId) {
    if (currentUser) {
        // إذا كان المستخدم مسجل دخول، استخدم API
        try {
            const response = await fetch(`${API_BASE}/api/cart/${cartItemId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                showAlert('تم حذف المنتج من السلة', 'success');
                loadCart();
            } else {
                showAlert('خطأ في حذف المنتج', 'error');
            }
        } catch (error) {
            console.error('خطأ في حذف المنتج:', error);
            showAlert('خطأ في الاتصال بالخادم', 'error');
        }
    } else {
        // إذا لم يكن مسجل دخول، استخدم السلة المحلية
        cart = cart.filter(item => item.id !== cartItemId);
        updateCartDisplay();
        showAlert('تم حذف المنتج من السلة', 'success');
    }
}

// تسجيل الدخول
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${API_BASE}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            currentUser = data.user;
            updateAuthDisplay();
            closeAuthModal();
            loadCart();
            showAlert('تم تسجيل الدخول بنجاح', 'success');
        } else {
            const error = await response.json();
            showAlert(error.error || 'خطأ في تسجيل الدخول', 'error');
        }
    } catch (error) {
        console.error('خطأ في تسجيل الدخول:', error);
        showAlert('خطأ في الاتصال بالخادم', 'error');
    }
}

// التسجيل
async function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('register-username').value;
    const full_name = document.getElementById('register-fullname').value;
    const email = document.getElementById('register-email').value;
    const phone = document.getElementById('register-phone').value;
    const address = document.getElementById('register-address').value;
    const password = document.getElementById('register-password').value;

    try {
        const response = await fetch(`${API_BASE}/api/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, full_name, email, phone, address, password })
        });

        if (response.ok) {
            showAlert('تم إنشاء الحساب بنجاح، يمكنك الآن تسجيل الدخول', 'success');
            switchAuthMode();
        } else {
            const error = await response.json();
            showAlert(error.error || 'خطأ في إنشاء الحساب', 'error');
        }
    } catch (error) {
        console.error('خطأ في إنشاء الحساب:', error);
        showAlert('خطأ في الاتصال بالخادم', 'error');
    }
}

// ===== إدارة الطلبات =====
// إرسال الطلب عبر الواتساب
function sendOrderViaWhatsApp() {
    if (cart.length === 0) {
        showAlert('السلة فارغة', 'error');
        return;
    }

    // الحصول على بيانات العميل
    const customerName = document.getElementById('customer-name').value;
    const customerPhone = document.getElementById('customer-phone').value;
    const shippingAddress = document.getElementById('shipping-address').value;
    const paymentMethod = document.getElementById('payment-method').value;

    // التحقق من البيانات المطلوبة
    if (!customerName || !customerPhone || !shippingAddress) {
        showAlert('يرجى ملء جميع البيانات المطلوبة', 'error');
        return;
    }

    // إنشاء رسالة الطلب
    let orderMessage = `🛒 *طلب جديد من متجر الزيتون*\n\n`;
    orderMessage += `👤 *اسم العميل:* ${customerName}\n`;
    orderMessage += `📱 *رقم الهاتف:* ${customerPhone}\n`;
    orderMessage += `📍 *عنوان التوصيل:* ${shippingAddress}\n`;
    orderMessage += `💳 *طريقة الدفع:* ${paymentMethod}\n\n`;
    
    orderMessage += `📦 *تفاصيل الطلب:*\n`;
    orderMessage += `━━━━━━━━━━━━━━━━━━━━\n`;
    
    let total = 0;
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        orderMessage += `${index + 1}. ${item.name}\n`;
        orderMessage += `   الكمية: ${item.quantity}\n`;
        orderMessage += `   الوزن: ${item.weight_kg || 10} كيلو\n`;
        orderMessage += `   السعر: ${item.price.toFixed(2)} جنيه\n`;
        orderMessage += `   المجموع: ${itemTotal.toFixed(2)} جنيه\n\n`;
    });
    
    orderMessage += `━━━━━━━━━━━━━━━━━━━━\n`;
    orderMessage += `💰 *إجمالي الطلب: ${total.toFixed(2)} جنيه*\n\n`;
    orderMessage += `📅 *تاريخ الطلب:* ${new Date().toLocaleDateString('ar-EG')}\n`;
    orderMessage += `⏰ *وقت الطلب:* ${new Date().toLocaleTimeString('ar-EG')}`;

    // ترميز الرسالة للواتساب
    const encodedMessage = encodeURIComponent(orderMessage);
    
    // رقم الواتساب الخاص بالمتجر (يجب تغييره لرقم المتجر الفعلي)
    const whatsappNumber = '201555500247'; // ضع رقم الواتساب الخاص بك هنا
    
    // إنشاء رابط الواتساب
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // فتح الواتساب
    window.open(whatsappUrl, '_blank');
    
    // إظهار رسالة نجاح
    showAlert('تم إرسال الطلب عبر الواتساب بنجاح!', 'success');
    
    // إغلاق نافذة الدفع وتفريغ السلة
    closeCheckoutModal();
    cart = [];
    updateCartDisplay();
    document.getElementById('checkout-form').reset();
}

// إتمام الشراء
async function handleCheckout(e) {
    e.preventDefault();
    
    if (cart.length === 0) {
        showAlert('السلة فارغة', 'error');
        return;
    }

    const customerName = document.getElementById('customer-name').value;
    const customerPhone = document.getElementById('customer-phone').value;
    const shippingAddress = document.getElementById('shipping-address').value;
    const paymentMethod = document.getElementById('payment-method').value;

    // إنشاء رقم طلب فريد
    const orderId = 'ORD-' + Date.now();
    
    // حساب المجموع
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // إنشاء كائن الطلب
    const order = {
        id: orderId,
        customerName,
        customerPhone,
        shippingAddress,
        paymentMethod,
        items: [...cart],
        total,
        date: new Date().toISOString(),
        status: 'pending'
    };

    try {
        let orderSavedToDatabase = false;

        // محاولة حفظ الطلب في قاعدة البيانات
        if (currentUser && currentUser.token) {
            // للمستخدمين المسجلين
            try {
                const response = await fetch('/api/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${currentUser.token}`
                    },
                    body: JSON.stringify({
                        payment_method: paymentMethod,
                        shipping_address: shippingAddress
                    })
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log('تم حفظ الطلب في قاعدة البيانات (مستخدم مسجل):', result);
                    
                    // تحديث معرف الطلب من قاعدة البيانات
                    order.id = result.order_id;
                    order.total_amount = result.total_amount;
                    orderSavedToDatabase = true;
                } else {
                    throw new Error('فشل في حفظ الطلب في قاعدة البيانات');
                }
            } catch (dbError) {
                console.error('خطأ في حفظ الطلب في قاعدة البيانات (مستخدم مسجل):', dbError);
            }
        } else {
            // للمستخدمين غير المسجلين
            try {
                const response = await fetch('/api/orders/guest', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        customer_name: customerName,
                        customer_phone: customerPhone,
                        customer_email: 'غير محدد',
                        shipping_address: shippingAddress,
                        payment_method: paymentMethod,
                        items: cart.map(item => ({
                            name: item.name,
                            quantity: item.quantity,
                            price: item.price
                        }))
                    })
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log('تم حفظ الطلب في قاعدة البيانات (ضيف):', result);
                    
                    // تحديث معرف الطلب من قاعدة البيانات
                    order.id = result.order_id;
                    order.total_amount = result.total_amount;
                    orderSavedToDatabase = true;
                } else {
                    throw new Error('فشل في حفظ الطلب في قاعدة البيانات');
                }
            } catch (dbError) {
                console.error('خطأ في حفظ الطلب في قاعدة البيانات (ضيف):', dbError);
            }
        }
        
        // حفظ الطلب محلياً كنسخة احتياطية
        let orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // إرسال الطلب إلى الخادم عبر الإيميل
        try {
            const emailOrder = {
                id: order.id,
                customer_name: customerName,
                customer_phone: customerPhone,
                customer_email: currentUser?.email || 'غير محدد',
                shipping_address: shippingAddress,
                payment_method: paymentMethod,
                total_amount: total,
                items: cart.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price
                })),
                created_at: new Date().toISOString()
            };

            const response = await fetch('/api/send-order-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(emailOrder)
            });

            const result = await response.json();
            
            if (result.success) {
                console.log('تم إرسال الطلب بنجاح إلى الإيميل');
            } else {
                console.error('فشل في إرسال الطلب إلى الإيميل:', result.error);
            }
        } catch (emailError) {
            console.error('خطأ في إرسال الطلب إلى الإيميل:', emailError);
            // لا نوقف العملية إذا فشل إرسال الإيميل
        }
        
        // إفراغ السلة
        cart = [];
        updateCartDisplay();
        
        // مسح السلة من الخادم إذا كان المستخدم مسجل دخول
        if (currentUser && currentUser.token) {
            try {
                await fetch('/api/cart/clear', {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${currentUser.token}`
                    }
                });
            } catch (clearError) {
                console.error('خطأ في مسح السلة من الخادم:', clearError);
            }
        }
        
        // عرض رسالة نجاح
        const successMessage = orderSavedToDatabase 
            ? `تم إنشاء الطلب بنجاح وحفظه في النظام! رقم الطلب: ${order.id}`
            : `تم إنشاء الطلب بنجاح! رقم الطلب: ${order.id}`;
        
        showAlert(successMessage, 'success');
        
        // إغلاق النافذة وإعادة تعيين النموذج
        closeCheckoutModal();
        document.getElementById('checkout-form').reset();
        
        // عرض نافذة التقييم بعد إتمام الطلب بنجاح
        setTimeout(() => {
            showRatingModal({
                id: order.id,
                customerName: customerName,
                customerEmail: currentUser?.email || ''
            });
        }, 2000);
        
    } catch (error) {
        console.error('خطأ في إنشاء الطلب:', error);
        showAlert('خطأ في حفظ الطلب', 'error');
    }
}

// التحقق من حالة المصادقة
function checkAuthStatus() {
    const token = localStorage.getItem('token');
    if (token) {
        // يمكن إضافة التحقق من صحة الرمز المميز هنا
        // للبساطة، سنفترض أن الرمز صالح
        currentUser = { token };
        updateAuthDisplay();
        loadCart();
    }
}

// تحديث عرض المصادقة
function updateAuthDisplay() {
    const authBtn = document.querySelector('.auth-btn');
    const authText = document.querySelector('.auth-text');
    
    if (currentUser) {
        authText.textContent = 'تسجيل الخروج';
        authBtn.onclick = logout;
    } else {
        authText.textContent = 'تسجيل الدخول';
        authBtn.onclick = showAuthModal;
    }
}

// تسجيل الخروج
function logout() {
    localStorage.removeItem('token');
    currentUser = null;
    cart = [];
    updateAuthDisplay();
    updateCartDisplay();
    showAlert('تم تسجيل الخروج بنجاح', 'success');
}

// عرض نافذة المصادقة
function showAuthModal() {
    document.getElementById('login-modal').classList.add('show');
}

// إغلاق نافذة المصادقة
function closeAuthModal() {
    document.getElementById('login-modal').classList.remove('show');
}

// تبديل وضع المصادقة
function switchAuthMode() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const modalTitle = document.getElementById('modal-title');
    const switchText = document.getElementById('auth-switch-text');

    if (isAuthMode === 'login') {
        isAuthMode = 'register';
        loginForm.style.display = 'none';
        registerForm.style.display = 'flex';
        modalTitle.textContent = 'إنشاء حساب جديد';
        switchText.innerHTML = 'لديك حساب بالفعل؟ <a href="#" onclick="switchAuthMode()">تسجيل الدخول</a>';
    } else {
        isAuthMode = 'login';
        loginForm.style.display = 'flex';
        registerForm.style.display = 'none';
        modalTitle.textContent = 'تسجيل الدخول';
        switchText.innerHTML = 'ليس لديك حساب؟ <a href="#" onclick="switchAuthMode()">إنشاء حساب جديد</a>';
    }
}

// عرض نافذة إتمام الشراء
function showCheckoutModal() {
    if (cart.length === 0) {
        showAlert('السلة فارغة', 'error');
        return;
    }

    const checkoutContent = document.getElementById('checkout-content');
    
    // حساب المجموع
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    checkoutContent.innerHTML = `
        <h2>إتمام الطلب</h2>
        
        <div class="checkout-summary">
            <h3>ملخص الطلب</h3>
            <div class="checkout-items">
                ${cart.map(item => `
                    <div class="checkout-item">
                        <span>${item.name} × ${item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)} جنيه</span>
                    </div>
                `).join('')}
            </div>
            <div class="checkout-total">
                <strong>المجموع: ${total.toFixed(2)} جنيه</strong>
            </div>
        </div>
        
        <form id="checkout-form" class="checkout-form">
            <div class="form-group">
                <label for="customer-name">الاسم الكامل *</label>
                <input type="text" id="customer-name" name="customer-name" required>
            </div>
            
            <div class="form-group">
                <label for="customer-phone">رقم الهاتف *</label>
                <input type="tel" id="customer-phone" name="customer-phone" required>
            </div>
            
            <div class="form-group">
                <label for="shipping-address">عنوان التوصيل *</label>
                <textarea id="shipping-address" name="shipping-address" rows="3" required></textarea>
            </div>
            
            <div class="form-group">
                <label for="payment-method">طريقة الدفع *</label>
                <select id="payment-method" name="payment-method" required>
                    <option value="">اختر طريقة الدفع</option>
                    <option value="cash">الدفع عند الاستلام</option>
                    <option value="transfer">تحويل بنكي</option>
                </select>
            </div>
            
            <div class="checkout-buttons">
                <button type="button" onclick="sendOrderViaWhatsApp()" class="whatsapp-btn">
                    <i class="fab fa-whatsapp"></i> إرسال عبر الواتساب
                </button>
                <button type="submit" class="submit-btn">تأكيد الطلب</button>
            </div>
        </form>
    `;

    // إضافة event listener للنموذج
    const form = document.getElementById('checkout-form');
    if (form) {
        form.addEventListener('submit', handleCheckout);
    }

    document.getElementById('checkout-modal').classList.add('show');
}

// إغلاق نافذة إتمام الشراء
function closeCheckoutModal() {
    document.getElementById('checkout-modal').classList.remove('show');
}

// إغلاق نافذة تفاصيل المنتج
function closeProductModal() {
    document.getElementById('product-modal').classList.remove('show');
}

// التمرير إلى قسم المنتجات
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// عرض رسالة تنبيه
function showAlert(message, type = 'info') {
    // إنشاء عنصر التنبيه
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    // إضافة التنبيه إلى أعلى الصفحة
    document.body.insertBefore(alert, document.body.firstChild);
    
    // إزالة التنبيه بعد 5 ثوان
    setTimeout(() => {
        if (alert.parentNode) {
            alert.parentNode.removeChild(alert);
        }
    }, 5000);
    
    // إضافة إمكانية إغلاق التنبيه بالنقر عليه
    alert.addEventListener('click', () => {
        if (alert.parentNode) {
            alert.parentNode.removeChild(alert);
        }
    });
}

// تحديث التنقل النشط
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// مستمع التمرير
window.addEventListener('scroll', updateActiveNav);

// عرض الطلبات
function showOrdersPage() {
    // تحقق من حالة تسجيل الدخول
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (user) {
        // المستخدم مسجل الدخول - جلب الطلبات من قاعدة البيانات
        fetchUserOrders();
    } else {
        // المستخدم غير مسجل - عرض الطلبات من localStorage
        displayLocalOrders();
    }
}

// جلب طلبات المستخدم المسجل
async function fetchUserOrders() {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await fetch('/api/orders', {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });
        
        if (response.ok) {
            const orders = await response.json();
            displayOrders(orders);
        } else {
            console.error('فشل في جلب الطلبات');
            showNoOrders();
        }
    } catch (error) {
        console.error('خطأ في جلب الطلبات:', error);
        showNoOrders();
    }
}

// عرض الطلبات المحلية للمستخدمين غير المسجلين
function displayLocalOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    if (orders.length === 0) {
        showNoOrders();
        return;
    }
    
    // تحويل الطلبات المحلية إلى تنسيق مشابه لطلبات قاعدة البيانات
    const formattedOrders = orders.map(order => ({
        id: order.id,
        created_at: order.date,
        status: order.status || 'pending',
        total_amount: order.total,
        customer_name: order.customerInfo?.name || 'غير محدد',
        customer_phone: order.customerInfo?.phone || 'غير محدد',
        customer_email: order.customerInfo?.email || 'غير محدد',
        payment_method: order.paymentMethod || 'cash',
        items: order.items.map(item => ({
            product_name: item.name,
            quantity: item.quantity,
            price: item.price
        }))
    }));
    
    displayOrders(formattedOrders);
}

// عرض الطلبات
function displayOrders(orders) {
    const ordersContainer = document.getElementById('orders-container');
    
    if (!orders || orders.length === 0) {
        showNoOrders();
        return;
    }
    
    // ترتيب الطلبات حسب التاريخ (الأحدث أولاً)
    orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    let ordersHTML = '';
    
    orders.forEach(order => {
        const orderDate = new Date(order.created_at).toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const statusText = getStatusText(order.status);
        const paymentMethodText = getPaymentMethodText(order.payment_method);
        
        // تجميع العناصر حسب المنتج
        const groupedItems = {};
        order.items.forEach(item => {
            const key = item.product_name || `منتج ${item.product_id}`;
            if (groupedItems[key]) {
                groupedItems[key].quantity += item.quantity;
                groupedItems[key].total_price += item.price * item.quantity;
            } else {
                groupedItems[key] = {
                    name: key,
                    quantity: item.quantity,
                    price: item.price,
                    total_price: item.price * item.quantity
                };
            }
        });
        
        let itemsHTML = '';
        Object.values(groupedItems).forEach(item => {
            itemsHTML += `
                <div class="order-item">
                    <div class="order-item-name">${item.name}</div>
                    <div class="order-item-quantity">الكمية: ${item.quantity}</div>
                    <div class="order-item-price">${item.total_price.toFixed(2)} جنيه</div>
                </div>
            `;
        });
        
        ordersHTML += `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <div class="order-id">طلب رقم: ${order.id}</div>
                        <div class="order-date">${orderDate}</div>
                    </div>
                    <div class="order-status ${order.status}">${statusText}</div>
                </div>
                
                <div class="order-info">
                    <div class="customer-info">
                        <h4>معلومات العميل</h4>
                        <p><strong>الاسم:</strong> ${order.customer_name || 'غير محدد'}</p>
                        <p><strong>الهاتف:</strong> ${order.customer_phone || 'غير محدد'}</p>
                        <p><strong>البريد الإلكتروني:</strong> ${order.customer_email || 'غير محدد'}</p>
                    </div>
                    <div class="payment-info">
                        <h4>معلومات الدفع</h4>
                        <p><strong>طريقة الدفع:</strong> ${paymentMethodText}</p>
                        <p><strong>حالة الطلب:</strong> ${statusText}</p>
                    </div>
                </div>
                
                <div class="order-items">
                    <h4>المنتجات المطلوبة</h4>
                    ${itemsHTML}
                </div>
                
                <div class="order-total">
                    المجموع الكلي: ${order.total_amount.toFixed(2)} جنيه
                </div>
                
                <div class="order-actions">
                    ${order.status === 'pending' ? `
                        <button class="cancel-order-btn" onclick="cancelOrder(${order.id})">
                            <i class="fas fa-times"></i> إلغاء الطلب
                        </button>
                    ` : ''}
                    <button class="delete-order-btn" onclick="deleteOrder(${order.id})">
                        <i class="fas fa-trash"></i> حذف الطلب
                    </button>
                    <button class="whatsapp-btn" onclick="sendOrderToWhatsApp(${order.id})">
                        <i class="fab fa-whatsapp"></i> إرسال عبر واتساب
                    </button>
                </div>
            </div>
        `;
    });
    
    ordersContainer.innerHTML = ordersHTML;
}

// عرض رسالة عدم وجود طلبات
function showNoOrders(message = 'لا توجد طلبات حتى الآن') {
    const ordersContainer = document.getElementById('orders-container');
    ordersContainer.innerHTML = `
        <div class="no-orders">
            <i class="fas fa-shopping-bag"></i>
            <h3>${message}</h3>
            <p>ابدأ التسوق الآن واطلب منتجاتك المفضلة</p>
            <a href="#" class="shop-now-btn" onclick="showPage('products')">تسوق الآن</a>
        </div>
    `;
}

// الحصول على نص حالة الطلب
function getStatusText(status) {
    const statusTexts = {
        'pending': 'قيد المعالجة',
        'completed': 'مكتمل',
        'cancelled': 'ملغي'
    };
    return statusTexts[status] || 'غير محدد';
}

// الحصول على نص طريقة الدفع
function getPaymentMethodText(method) {
    const paymentMethods = {
        'cash': 'دفع عند الاستلام',
        'transfer': 'تحويل بنكي',
        'whatsapp': 'طلب عبر واتساب'
    };
    return paymentMethods[method] || 'غير محدد';
}

// إلغاء الطلب (تغيير الحالة إلى ملغي)
async function cancelOrder(orderId) {
    // عرض نافذة تأكيد
    if (!confirm('هل أنت متأكد من إلغاء هذا الطلب؟')) {
        return;
    }
    
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (user) {
        // المستخدم مسجل - إلغاء الطلب في قاعدة البيانات
        try {
            const response = await fetch(`/api/admin/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ status: 'cancelled' })
            });
            
            if (response.ok) {
                showAlert('تم إلغاء الطلب بنجاح', 'success');
                showOrdersPage(); // إعادة تحميل الطلبات
            } else {
                showAlert('خطأ في إلغاء الطلب', 'error');
            }
        } catch (error) {
            console.error('خطأ في إلغاء الطلب:', error);
            showAlert('خطأ في إلغاء الطلب', 'error');
        }
    } else {
        // المستخدم غير مسجل - تحديث الطلب في localStorage
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const orderIndex = orders.findIndex(order => order.id === orderId);
        
        if (orderIndex !== -1) {
            orders[orderIndex].status = 'cancelled';
            localStorage.setItem('orders', JSON.stringify(orders));
            showOrdersPage();
            showAlert('تم إلغاء الطلب بنجاح', 'success');
        } else {
            showAlert('خطأ: لم يتم العثور على الطلب', 'error');
        }
    }
}

// حذف الطلب نهائياً
function deleteOrder(orderId) {
    // عرض نافذة تأكيد
    if (!confirm('هل أنت متأكد من حذف هذا الطلب نهائياً؟ لن يمكن استرداده بعد الحذف.')) {
        return;
    }
    
    // الحصول على الطلبات من التخزين المحلي
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    // العثور على الطلب وحذفه
    const orderIndex = orders.findIndex(order => order.id === orderId);
    if (orderIndex !== -1) {
        // حذف الطلب من المصفوفة
        orders.splice(orderIndex, 1);
        
        // حفظ التحديث في التخزين المحلي
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // إعادة تحميل صفحة الطلبات
        showOrdersPage();
        
        // عرض رسالة نجاح
        showAlert('تم حذف الطلب نهائياً', 'success');
    } else {
        showAlert('خطأ: لم يتم العثور على الطلب', 'error');
    }
}

// إرسال الطلب عبر واتساب
function sendOrderToWhatsApp(orderId) {
    // الحصول على الطلبات من التخزين المحلي
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    // العثور على الطلب
    const order = orders.find(order => order.id === orderId);
    if (!order) {
        showAlert('خطأ: لم يتم العثور على الطلب', 'error');
        return;
    }
    
    // إنشاء رسالة واتساب
    const orderDate = new Date(order.date).toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    let message = `🛒 *طلب جديد من متجر الزيتون*\n\n`;
    message += `📋 *رقم الطلب:* ${order.id}\n`;
    message += `📅 *تاريخ الطلب:* ${orderDate}\n\n`;
    
    message += `👤 *معلومات العميل:*\n`;
    message += `• الاسم: ${order.customerName}\n`;
    message += `• الهاتف: ${order.customerPhone}\n`;
    message += `• العنوان: ${order.shippingAddress}\n\n`;
    
    message += `🛍️ *المنتجات المطلوبة:*\n`;
    order.items.forEach((item, index) => {
        message += `${index + 1}. ${item.name}\n`;
        message += `   الكمية: ${item.quantity}\n`;
        message += `   السعر: ${(item.price * item.quantity).toFixed(2)} ج.م\n\n`;
    });
    
    message += `💰 *المجموع الإجمالي:* ${order.total.toFixed(2)} ج.م\n`;
    message += `💳 *طريقة الدفع:* ${getPaymentMethodText(order.paymentMethod)}\n\n`;
    
    message += `📞 يرجى التواصل معي لتأكيد الطلب وترتيب التسليم.`;
    
    // ترميز الرسالة للواتساب
    const encodedMessage = encodeURIComponent(message);
    
    // رقم واتساب المتجر (يمكن تغييره)
    const whatsappNumber = '201555500247'; // ضع رقم واتساب المتجر هنا
    
    // فتح واتساب
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    
    // عرض رسالة نجاح
    showAlert('تم فتح واتساب لإرسال الطلب', 'success');
}

// ===== إدارة المراجعات =====

// عرض نافذة التقييم بعد إتمام الطلب
function showRatingModal(orderData) {
    const modal = document.getElementById('rating-modal');
    const form = document.getElementById('rating-form');
    
    // إعادة تعيين النموذج
    form.reset();
    document.getElementById('rating-value').value = '';
    
    // إزالة التقييمات السابقة
    const stars = document.querySelectorAll('.stars-rating .star');
    stars.forEach(star => star.classList.remove('active'));
    
    // حفظ بيانات الطلب للاستخدام عند الإرسال
    form.dataset.orderData = JSON.stringify(orderData);
    
    modal.style.display = 'block';
}

// إخفاء نافذة التقييم
function hideRatingModal() {
    const modal = document.getElementById('rating-modal');
    modal.style.display = 'none';
}

// تهيئة نظام التقييم بالنجوم
function initializeStarRating() {
    const stars = document.querySelectorAll('.stars-rating .star');
    const ratingInput = document.getElementById('rating-value');
    
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            const rating = index + 1;
            ratingInput.value = rating;
            
            // تحديث عرض النجوم
            stars.forEach((s, i) => {
                if (i < rating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
        
        star.addEventListener('mouseenter', () => {
            const rating = index + 1;
            stars.forEach((s, i) => {
                if (i < rating) {
                    s.style.color = '#ffd700';
                } else {
                    s.style.color = '#e9ecef';
                }
            });
        });
    });
    
    // إعادة تعيين الألوان عند مغادرة منطقة النجوم
    const starsContainer = document.querySelector('.stars-rating');
    starsContainer.addEventListener('mouseleave', () => {
        const currentRating = parseInt(ratingInput.value) || 0;
        stars.forEach((s, i) => {
            if (i < currentRating) {
                s.style.color = '#ffd700';
            } else {
                s.style.color = '#e9ecef';
            }
        });
    });
}

// إرسال التقييم
async function submitRating(event) {
    event.preventDefault();
    
    const form = event.target;
    const rating = document.getElementById('rating-value').value;
    const comment = document.getElementById('review-comment').value;
    const orderData = JSON.parse(form.dataset.orderData);
    
    if (!rating) {
        showAlert('يرجى اختيار تقييم', 'error');
        return;
    }
    
    const reviewData = {
        customer_name: orderData.customerName,
        customer_email: orderData.customerEmail || '',
        rating: parseInt(rating),
        comment: comment.trim(),
        order_id: orderData.id
    };
    
    try {
        const response = await fetch('/api/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showAlert('شكراً لك! تم إرسال تقييمك بنجاح وسيظهر بعد المراجعة', 'success');
            hideRatingModal();
        } else {
            showAlert(result.error || 'خطأ في إرسال التقييم', 'error');
        }
    } catch (error) {
        console.error('خطأ في إرسال التقييم:', error);
        showAlert('خطأ في إرسال التقييم', 'error');
    }
}

// عرض صفحة آراء العملاء
async function showReviewsPage() {
    try {
        const response = await fetch('/api/reviews');
        const reviews = await response.json();
        
        displayReviews(reviews);
    } catch (error) {
        console.error('خطأ في جلب المراجعات:', error);
        showNoReviews('خطأ في تحميل المراجعات');
    }
}

// عرض المراجعات
function displayReviews(reviews) {
    const reviewsContainer = document.getElementById('reviews-container');
    
    if (!reviews || reviews.length === 0) {
        showNoReviews();
        return;
    }
    
    const reviewsHTML = reviews.map(review => {
        const reviewDate = new Date(review.created_at).toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const starsHTML = generateStarsHTML(review.rating);
        const avatarLetter = review.customer_name.charAt(0).toUpperCase();
        
        return `
            <div class="review-card">
                <div class="review-header">
                    <div class="review-avatar">${avatarLetter}</div>
                    <div class="review-info">
                        <h4>${review.customer_name}</h4>
                        <div class="review-date">${reviewDate}</div>
                    </div>
                </div>
                <div class="review-rating">
                    ${starsHTML}
                </div>
                ${review.comment ? `<div class="review-comment">${review.comment}</div>` : ''}
            </div>
        `;
    }).join('');
    
    reviewsContainer.innerHTML = reviewsHTML;
}

// ===== الوظائف المساعدة =====
// إنشاء HTML للنجوم
function generateStarsHTML(rating) {
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            starsHTML += '<span class="star">★</span>';
        } else {
            starsHTML += '<span class="star empty">★</span>';
        }
    }
    return starsHTML;
}

// عرض رسالة عدم وجود مراجعات
function showNoReviews(message = 'لا توجد مراجعات حتى الآن') {
    const reviewsContainer = document.getElementById('reviews-container');
    reviewsContainer.innerHTML = `
        <div class="no-reviews">
            <i class="fas fa-star"></i>
            <h3>${message}</h3>
            <p>كن أول من يشارك تجربته مع منتجاتنا</p>
        </div>
    `;
}

// تهيئة أحداث التقييم عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة نظام التقييم بالنجوم
    initializeStarRating();
    
    // إضافة أحداث النموذج
    const ratingForm = document.getElementById('rating-form');
    if (ratingForm) {
        ratingForm.addEventListener('submit', submitRating);
    }
    
    // زر تخطي التقييم
    const skipButton = document.getElementById('skip-rating');
    if (skipButton) {
        skipButton.addEventListener('click', hideRatingModal);
    }
    
    // إغلاق نافذة التقييم عند النقر خارجها
    const ratingModal = document.getElementById('rating-modal');
    if (ratingModal) {
        ratingModal.addEventListener('click', function(e) {
            if (e.target === ratingModal) {
                hideRatingModal();
            }
        });
    }
});