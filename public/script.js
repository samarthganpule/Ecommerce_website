// Global variables
let currentUser = null;
let cart = [];
let products = [];
let categories = [];

// API base URL
const API_BASE = '/api';

// DOM elements
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const checkoutModal = document.getElementById('checkoutModal');
const cartDrawer = document.getElementById('cartDrawer');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

async function initializeApp() {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
            currentUser = userData;
            updateUIForLoggedInUser();
        }
    }
    
    // Load initial data
    await loadCategories();
    await loadProducts();
    await loadCart();
}

function setupEventListeners() {
    // Navigation
    document.getElementById('loginBtn').addEventListener('click', () => showModal(loginModal));
    document.getElementById('registerBtn').addEventListener('click', () => showModal(registerModal));
    document.getElementById('logoutBtn').addEventListener('click', logout);
    document.getElementById('cartBtn').addEventListener('click', toggleCart);
    document.getElementById('adminBtn').addEventListener('click', () => {
        window.location.href = '/admin';
    });
    
    // Search
    document.getElementById('searchBtn').addEventListener('click', handleSearch);
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    
    // Filters
    document.getElementById('applyFilters').addEventListener('click', applyFilters);
    
    // Cart
    document.getElementById('closeCart').addEventListener('click', () => cartDrawer.classList.remove('open'));
    document.getElementById('checkoutBtn').addEventListener('click', () => {
        if (!currentUser) {
            alert('Please login to checkout');
            showModal(loginModal);
            return;
        }
        showModal(checkoutModal);
        updateCheckoutSummary();
    });
    
    // Forms
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('checkoutForm').addEventListener('submit', handleCheckout);
    
    // Modal controls
    document.querySelectorAll('.modal .close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            e.target.closest('.modal').style.display = 'none';
        });
    });
    
    document.getElementById('showRegister').addEventListener('click', () => {
        loginModal.style.display = 'none';
        showModal(registerModal);
    });
    
    document.getElementById('showLogin').addEventListener('click', () => {
        registerModal.style.display = 'none';
        showModal(loginModal);
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

// API functions
async function apiCall(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'API request failed');
    }
    
    return response.json();
}

// Authentication
async function handleLogin(e) {
    e.preventDefault();
    
    try {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        const response = await apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        currentUser = response.user;
        
        updateUIForLoggedInUser();
        loginModal.style.display = 'none';
        await loadCart();
        
        alert('Login successful!');
    } catch (error) {
        alert(error.message);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    try {
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        
        await apiCall('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password })
        });
        
        alert('Registration successful! Please login.');
        registerModal.style.display = 'none';
        showModal(loginModal);
    } catch (error) {
        alert(error.message);
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    currentUser = null;
    cart = [];
    
    updateUIForLoggedOutUser();
    updateCartUI();
}

function updateUIForLoggedInUser() {
    document.getElementById('loginBtn').classList.add('hidden');
    document.getElementById('registerBtn').classList.add('hidden');
    document.getElementById('logoutBtn').classList.remove('hidden');
    document.getElementById('userWelcome').classList.remove('hidden');
    document.getElementById('userWelcome').textContent = `Welcome, ${currentUser.username}`;
}

function updateUIForLoggedOutUser() {
    document.getElementById('loginBtn').classList.remove('hidden');
    document.getElementById('registerBtn').classList.remove('hidden');
    document.getElementById('logoutBtn').classList.add('hidden');
    document.getElementById('userWelcome').classList.add('hidden');
}

// Products
async function loadProducts(filters = {}) {
    try {
        const queryParams = new URLSearchParams();
        
        if (filters.category) queryParams.append('category', filters.category);
        if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
        if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
        if (filters.search) queryParams.append('search', filters.search);
        if (filters.sort) {
            if (filters.sort === 'price_desc') {
                queryParams.append('sort', 'price');
                queryParams.append('order', 'DESC');
            } else {
                queryParams.append('sort', filters.sort);
                queryParams.append('order', filters.sort === 'price' ? 'ASC' : 'DESC');
            }
        }
        
        const queryString = queryParams.toString();
        products = await apiCall(`/products${queryString ? '?' + queryString : ''}`);
        renderProducts();
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

async function loadCategories() {
    try {
        categories = await apiCall('/products/categories/all');
        renderCategories();
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

function renderProducts() {
    const grid = document.getElementById('productsGrid');
    
    if (products.length === 0) {
        grid.innerHTML = '<p>No products found.</p>';
        return;
    }
    
    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image_url || 'https://via.placeholder.com/280x200?text=No+Image'}" 
                 alt="${product.name}" 
                 class="product-image"
                 onerror="this.src='https://via.placeholder.com/280x200/cccccc/666666?text=${encodeURIComponent(product.name)}'">
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">₹${parseFloat(product.price).toLocaleString('en-IN')}</div>
                <div class="product-description">${product.description || ''}</div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

function renderCategories() {
    const select = document.getElementById('categoryFilter');
    select.innerHTML = '<option value="">All Categories</option>' +
        categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
}

// Search and filters
function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value;
    loadProducts({ search: searchTerm });
}

function applyFilters() {
    const filters = {
        category: document.getElementById('categoryFilter').value,
        minPrice: document.getElementById('minPrice').value,
        maxPrice: document.getElementById('maxPrice').value,
        sort: document.getElementById('sortBy').value,
        search: document.getElementById('searchInput').value
    };
    
    loadProducts(filters);
}

// Cart functions
async function addToCart(productId) {
    if (!currentUser) {
        alert('Please login to add items to cart');
        showModal(loginModal);
        return;
    }
    
    try {
        await apiCall('/cart/add', {
            method: 'POST',
            body: JSON.stringify({ product_id: productId, quantity: 1 })
        });
        
        await loadCart();
        alert('Item added to cart!');
    } catch (error) {
        alert(error.message);
    }
}

async function loadCart() {
    if (!currentUser) {
        cart = [];
        updateCartUI();
        return;
    }
    
    try {
        cart = await apiCall('/cart');
        updateCartUI();
    } catch (error) {
        console.error('Error loading cart:', error);
    }
}

async function updateCartQuantity(productId, quantity) {
    try {
        if (quantity <= 0) {
            await apiCall(`/cart/remove/${productId}`, { method: 'DELETE' });
        } else {
            await apiCall('/cart/update', {
                method: 'PUT',
                body: JSON.stringify({ product_id: productId, quantity })
            });
        }
        
        await loadCart();
    } catch (error) {
        alert(error.message);
    }
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
        cartTotal.textContent = '0.00';
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + item.total_price, 0);
    cartTotal.textContent = total.toLocaleString('en-IN', {minimumFractionDigits: 2});
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image_url || 'https://via.placeholder.com/60x60?text=No+Image'}" 
                 alt="${item.name}" 
                 class="cart-item-image"
                 onerror="this.src='https://via.placeholder.com/60x60/cccccc/666666?text=Item'">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">₹${parseFloat(item.price).toLocaleString('en-IN')}</div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.product_id}, ${item.quantity - 1})">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" 
                           onchange="updateCartQuantity(${item.product_id}, this.value)" min="0">
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.product_id}, ${item.quantity + 1})">+</button>
                </div>
            </div>
            <button class="remove-item-btn" onclick="updateCartQuantity(${item.product_id}, 0)">Remove</button>
        </div>
    `).join('');
}

function toggleCart() {
    cartDrawer.classList.toggle('open');
}

// Checkout
function updateCheckoutSummary() {
    const checkoutItems = document.getElementById('checkoutItems');
    const checkoutTotal = document.getElementById('checkoutTotal');
    
    const total = cart.reduce((sum, item) => sum + item.total_price, 0);
    checkoutTotal.textContent = total.toLocaleString('en-IN', {minimumFractionDigits: 2});
    
    checkoutItems.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <span>${item.quantity}x ${item.name}</span>
            <span>₹${item.total_price.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
        </div>
    `).join('');
}

async function handleCheckout(e) {
    e.preventDefault();
    
    try {
        const shippingAddress = document.getElementById('shippingAddress').value;
        
        const response = await apiCall('/orders/create', {
            method: 'POST',
            body: JSON.stringify({ shipping_address: shippingAddress })
        });
        
        alert(`Order placed successfully! Order ID: ${response.orderId}`);
        checkoutModal.style.display = 'none';
        cartDrawer.classList.remove('open');
        await loadCart();
        
        // Clear form
        document.getElementById('checkoutForm').reset();
    } catch (error) {
        alert(error.message);
    }
}

// Utility functions
function showModal(modal) {
    modal.style.display = 'block';
}