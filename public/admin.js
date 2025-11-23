// Global variables
let currentUser = null;
let products = [];
let categories = [];
let orders = [];

// API base URL
const API_BASE = '/api';

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    checkAdminAuth();
    setupEventListeners();
});

function checkAdminAuth() {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user'));
    
    if (!token || !userData || userData.role !== 'admin') {
        alert('Admin access required');
        window.location.href = '/';
        return;
    }
    
    currentUser = userData;
    document.getElementById('adminUserWelcome').textContent = `Welcome, ${currentUser.username}`;
    
    // Load initial data
    loadCategories();
    loadProducts();
    loadOrders();
}

function setupEventListeners() {
    // Tab navigation
    document.getElementById('productsTab').addEventListener('click', () => showTab('products'));
    document.getElementById('categoriesTab').addEventListener('click', () => showTab('categories'));
    document.getElementById('ordersTab').addEventListener('click', () => showTab('orders'));
    
    // Forms
    document.getElementById('productForm').addEventListener('submit', handleProductSubmit);
    document.getElementById('categoryForm').addEventListener('submit', handleCategorySubmit);
    
    // Buttons
    document.getElementById('cancelEditBtn').addEventListener('click', cancelEdit);
    document.getElementById('adminLogoutBtn').addEventListener('click', logout);
}

function showTab(tabName) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected section and activate tab
    document.getElementById(`${tabName}Section`).classList.add('active');
    document.getElementById(`${tabName}Tab`).classList.add('active');
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

// Products management
async function loadProducts() {
    try {
        products = await apiCall('/products');
        renderProductsTable();
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

async function loadCategories() {
    try {
        categories = await apiCall('/products/categories/all');
        renderCategoriesTable();
        renderCategoryOptions();
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

function renderProductsTable() {
    const tbody = document.getElementById('productsTableBody');
    
    tbody.innerHTML = products.map(product => `
        <tr>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>₹${parseFloat(product.price).toLocaleString('en-IN')}</td>
            <td>${product.stock_quantity}</td>
            <td>${product.category_name || 'N/A'}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editProduct(${product.id})">Edit</button>
                <button class="action-btn delete-btn" onclick="deleteProduct(${product.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

function renderCategoriesTable() {
    const tbody = document.getElementById('categoriesTableBody');
    
    tbody.innerHTML = categories.map(category => `
        <tr>
            <td>${category.id}</td>
            <td>${category.name}</td>
            <td>${category.description || 'N/A'}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editCategory(${category.id})">Edit</button>
                <button class="action-btn delete-btn" onclick="deleteCategory(${category.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

function renderCategoryOptions() {
    const select = document.getElementById('productCategory');
    select.innerHTML = '<option value="">Select Category</option>' +
        categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
}

async function handleProductSubmit(e) {
    e.preventDefault();
    
    try {
        const productId = document.getElementById('productId').value;
        const productData = {
            name: document.getElementById('productName').value,
            description: document.getElementById('productDescription').value,
            price: parseFloat(document.getElementById('productPrice').value),
            stock_quantity: parseInt(document.getElementById('productStock').value),
            category_id: document.getElementById('productCategory').value || null,
            image_url: document.getElementById('productImage').value
        };
        
        if (productId) {
            // Update existing product
            await apiCall(`/products/${productId}`, {
                method: 'PUT',
                body: JSON.stringify(productData)
            });
            alert('Product updated successfully!');
        } else {
            // Create new product
            await apiCall('/products', {
                method: 'POST',
                body: JSON.stringify(productData)
            });
            alert('Product created successfully!');
        }
        
        // Reset form and reload products
        document.getElementById('productForm').reset();
        document.getElementById('productId').value = '';
        document.getElementById('productSubmitBtn').textContent = 'Add Product';
        document.getElementById('cancelEditBtn').style.display = 'none';
        
        await loadProducts();
    } catch (error) {
        alert(error.message);
    }
}

function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productDescription').value = product.description || '';
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productStock').value = product.stock_quantity;
    document.getElementById('productCategory').value = product.category_id || '';
    document.getElementById('productImage').value = product.image_url || '';
    
    document.getElementById('productSubmitBtn').textContent = 'Update Product';
    document.getElementById('cancelEditBtn').style.display = 'inline-block';
}

async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
        await apiCall(`/products/${productId}`, { method: 'DELETE' });
        alert('Product deleted successfully!');
        await loadProducts();
    } catch (error) {
        alert(error.message);
    }
}

// Categories management
async function handleCategorySubmit(e) {
    e.preventDefault();
    
    try {
        const categoryData = {
            name: document.getElementById('categoryName').value,
            description: document.getElementById('categoryDescription').value
        };
        
        await apiCall('/categories', {
            method: 'POST',
            body: JSON.stringify(categoryData)
        });
        
        alert('Category created successfully!');
        document.getElementById('categoryForm').reset();
        await loadCategories();
    } catch (error) {
        alert(error.message);
    }
}

async function deleteCategory(categoryId) {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
        await apiCall(`/categories/${categoryId}`, { method: 'DELETE' });
        alert('Category deleted successfully!');
        await loadCategories();
    } catch (error) {
        alert(error.message);
    }
}

// Orders management
async function loadOrders() {
    try {
        orders = await apiCall('/orders/all');
        renderOrders();
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

function renderOrders() {
    const container = document.getElementById('ordersContainer');
    
    if (orders.length === 0) {
        container.innerHTML = '<p>No orders found.</p>';
        return;
    }
    
    container.innerHTML = orders.map(order => `
        <div style="border: 1px solid #ddd; padding: 1rem; margin-bottom: 1rem; border-radius: 4px;">
            <h4>Order #${order.id}</h4>
            <p><strong>Customer:</strong> ${order.username}</p>
            <p><strong>Total:</strong> ₹${parseFloat(order.total_amount).toLocaleString('en-IN', {minimumFractionDigits: 2})}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            <p><strong>Date:</strong> ${new Date(order.created_at).toLocaleDateString()}</p>
            <p><strong>Address:</strong> ${order.shipping_address}</p>
            <div>
                <select onchange="updateOrderStatus(${order.id}, this.value)">
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                    <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                    <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                    <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </div>
        </div>
    `).join('');
}

async function updateOrderStatus(orderId, status) {
    try {
        await apiCall(`/orders/${orderId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
        alert('Order status updated!');
    } catch (error) {
        alert(error.message);
    }
}

function cancelEdit() {
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('productSubmitBtn').textContent = 'Add Product';
    document.getElementById('cancelEditBtn').style.display = 'none';
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
}