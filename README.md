# E-Commerce Website

A full-stack e-commerce website built with HTML, CSS, JavaScript frontend and Node.js backend with MySQL database.

## Features

### Frontend (HTML/CSS/JavaScript)
- Responsive product catalog with search and filtering
- Shopping cart with quantity management
- User authentication (login/register)
- Checkout process
- Clean, modern UI design

### Backend (Node.js/Express)
- RESTful API endpoints
- JWT authentication
- MySQL database integration
- Admin panel for product/order management
- Secure password hashing

### Database (MySQL)
- Users, products, categories, orders, cart tables
- Proper relationships and indexing
- Transaction support for orders

## Setup Instructions

### 1. Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### 2. Database Setup
1. Create a MySQL database:
```sql
CREATE DATABASE ecommerce_db;
```

2. Import the schema:
```bash
mysql -u root -p ecommerce_db < database/schema.sql
```

3. Insert sample categories:
```sql
USE ecommerce_db;
INSERT INTO categories (name, description) VALUES 
('Electronics', 'Electronic devices and gadgets'),
('Clothing', 'Fashion and apparel'),
('Books', 'Books and literature'),
('Home & Garden', 'Home improvement and gardening');
```

4. Insert sample products:
```sql
INSERT INTO products (name, description, price, stock_quantity, category_id, image_url) VALUES 
('Smartphone', 'Latest smartphone with advanced features', 699.99, 50, 1, 'https://via.placeholder.com/280x200'),
('Laptop', 'High-performance laptop for work and gaming', 1299.99, 25, 1, 'https://via.placeholder.com/280x200'),
('T-Shirt', 'Comfortable cotton t-shirt', 19.99, 100, 2, 'https://via.placeholder.com/280x200'),
('Jeans', 'Classic blue jeans', 49.99, 75, 2, 'https://via.placeholder.com/280x200');
```

5. Create an admin user:
```sql
INSERT INTO users (username, email, password, role) VALUES 
('admin', 'admin@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');
-- Password is 'password' (hashed)
```

### 3. Environment Configuration
1. Copy `.env` file and update with your database credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ecommerce_db
JWT_SECRET=your_jwt_secret_key_here
PORT=3000
```

### 4. Install Dependencies
```bash
npm install
```

### 5. Run the Application
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

### 6. Access the Application
- **Store**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)
- `GET /api/products/categories/all` - Get all categories

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item quantity
- `DELETE /api/cart/remove/:productId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear cart

### Orders
- `POST /api/orders/create` - Create new order
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `GET /api/orders/all` - Get all orders (admin)
- `PUT /api/orders/:id/status` - Update order status (admin)

### Categories
- `POST /api/categories` - Create category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

## Default Admin Credentials
- **Email**: admin@example.com
- **Password**: password

## Project Structure
```
├── config/
│   └── database.js          # Database connection
├── database/
│   └── schema.sql          # Database schema
├── middleware/
│   └── auth.js             # Authentication middleware
├── public/
│   ├── index.html          # Main store page
│   ├── admin.html          # Admin panel
│   ├── styles.css          # CSS styles
│   ├── script.js           # Frontend JavaScript
│   └── admin.js            # Admin panel JavaScript
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── products.js         # Product routes
│   ├── cart.js             # Cart routes
│   ├── orders.js           # Order routes
│   └── categories.js       # Category routes
├── .env                    # Environment variables
├── server.js               # Main server file
└── package.json            # Dependencies
```

## Security Features
- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- SQL injection prevention
- Input validation

## Future Enhancements
- Payment gateway integration (Stripe/PayPal)
- Image upload functionality
- Email notifications
- Product reviews and ratings
- Inventory management
- Order tracking
- Wishlist functionality
- Multi-language support