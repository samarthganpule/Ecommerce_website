const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function setupRealisticProducts() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('Connected to database');

        // Clear existing data
        await connection.execute('DELETE FROM cart');
        await connection.execute('DELETE FROM order_items');
        await connection.execute('DELETE FROM orders');
        await connection.execute('DELETE FROM reviews');
        await connection.execute('DELETE FROM product_images');
        await connection.execute('DELETE FROM products');
        await connection.execute('DELETE FROM categories');
        await connection.execute('DELETE FROM users WHERE role != "admin"');
        
        console.log('Cleared existing product data');

        // Insert realistic categories
        const categories = [
            ['Electronics', 'Smartphones, Laptops, Gadgets & Electronic Accessories'],
            ['Fashion', 'Clothing, Footwear, Accessories for Men & Women'],
            ['Sports & Fitness', 'Sports Equipment, Fitness Gear & Outdoor Activities'],
            ['Home & Kitchen', 'Home Appliances, Kitchen Essentials & Decor'],
            ['Books & Media', 'Books, Movies, Music & Educational Content'],
            ['Beauty & Personal Care', 'Skincare, Makeup, Grooming & Health Products'],
            ['Automotive', 'Car Accessories, Bike Parts & Vehicle Care'],
            ['Toys & Games', 'Kids Toys, Board Games & Educational Games']
        ];

        const categoryIds = {};
        for (const [name, description] of categories) {
            const [result] = await connection.execute(
                'INSERT INTO categories (name, description) VALUES (?, ?)',
                [name, description]
            );
            categoryIds[name] = result.insertId;
        }
        console.log('Categories inserted');

        // Insert realistic products with Indian pricing (INR)
        const products = [
            // Electronics
            ['iPhone 15 Pro', 'Latest Apple iPhone with A17 Pro chip, 128GB storage, Pro camera system', 134900, 25, categoryIds['Electronics'], 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop'],
            ['Samsung Galaxy S24 Ultra', 'Premium Android smartphone with S Pen, 256GB storage, 200MP camera', 124999, 30, categoryIds['Electronics'], 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=300&fit=crop'],
            ['MacBook Air M2', 'Apple MacBook Air with M2 chip, 13-inch Liquid Retina display, 256GB SSD', 114900, 15, categoryIds['Electronics'], 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop'],
            ['Dell XPS 13', 'Ultra-portable laptop with Intel i7, 16GB RAM, 512GB SSD', 89999, 20, categoryIds['Electronics'], 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop'],
            ['Sony WH-1000XM5', 'Premium noise-canceling wireless headphones', 29990, 50, categoryIds['Electronics'], 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop'],
            ['iPad Pro 11-inch', 'Apple iPad Pro with M2 chip, 128GB, Wi-Fi', 81900, 35, categoryIds['Electronics'], 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop'],
            ['OnePlus 12', 'Flagship Android phone with Snapdragon 8 Gen 3, 256GB', 64999, 40, categoryIds['Electronics'], 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop'],
            ['Apple Watch Series 9', 'Advanced smartwatch with health monitoring, GPS', 41900, 45, categoryIds['Electronics'], 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=300&fit=crop'],
            ['Canon EOS R6 Mark II', 'Professional mirrorless camera with 24.2MP sensor', 219999, 10, categoryIds['Electronics'], 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop'],
            ['Nintendo Switch OLED', 'Gaming console with 7-inch OLED screen', 37999, 25, categoryIds['Electronics'], 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'],

            // Fashion - Men
            ['Levi\'s 511 Slim Jeans', 'Classic slim-fit denim jeans for men, dark wash', 3999, 100, categoryIds['Fashion'], 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop'],
            ['Nike Air Force 1', 'Iconic white leather sneakers for men and women', 7999, 75, categoryIds['Fashion'], 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop'],
            ['Adidas Ultraboost 22', 'Premium running shoes with Boost technology', 16999, 60, categoryIds['Fashion'], 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop'],
            ['H&M Cotton T-Shirt', 'Basic cotton crew neck t-shirt, multiple colors', 799, 200, categoryIds['Fashion'], 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop'],
            ['Zara Formal Shirt', 'Slim-fit formal shirt for office wear', 2999, 80, categoryIds['Fashion'], 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=300&fit=crop'],
            ['Ray-Ban Aviator Sunglasses', 'Classic aviator sunglasses with UV protection', 8999, 40, categoryIds['Fashion'], 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop'],
            
            // Fashion - Women
            ['Ethnic Kurti Set', 'Beautiful printed kurti with palazzo pants', 1999, 120, categoryIds['Fashion'], 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=300&fit=crop'],
            ['Saree with Blouse', 'Elegant silk saree with designer blouse piece', 4999, 50, categoryIds['Fashion'], 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=300&fit=crop'],
            ['Western Dress', 'Trendy midi dress for casual and party wear', 2499, 90, categoryIds['Fashion'], 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=300&fit=crop'],
            ['Handbag Collection', 'Stylish leather handbag for women', 3499, 70, categoryIds['Fashion'], 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop'],

            // Sports & Fitness
            ['Yoga Mat Premium', 'Non-slip yoga mat with carrying strap, 6mm thick', 1999, 100, categoryIds['Sports & Fitness'], 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop'],
            ['Dumbbells Set 20kg', 'Adjustable dumbbell set for home gym', 4999, 30, categoryIds['Sports & Fitness'], 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'],
            ['Cricket Bat Professional', 'English willow cricket bat for professionals', 8999, 25, categoryIds['Sports & Fitness'], 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=300&fit=crop'],
            ['Football FIFA Quality', 'Official size 5 football for matches', 1499, 80, categoryIds['Sports & Fitness'], 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=300&fit=crop'],
            ['Badminton Racket Pro', 'Carbon fiber badminton racket with cover', 3999, 40, categoryIds['Sports & Fitness'], 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&h=300&fit=crop'],
            ['Gym Gloves', 'Workout gloves with wrist support', 899, 150, categoryIds['Sports & Fitness'], 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'],
            ['Protein Shaker Bottle', 'BPA-free protein shaker with mixing ball', 599, 200, categoryIds['Sports & Fitness'], 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop'],

            // Home & Kitchen
            ['Pressure Cooker 5L', 'Stainless steel pressure cooker for Indian cooking', 2999, 60, categoryIds['Home & Kitchen'], 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'],
            ['Non-Stick Cookware Set', '7-piece non-stick cookware set with lids', 4999, 40, categoryIds['Home & Kitchen'], 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'],
            ['Mixer Grinder 750W', '3-jar mixer grinder for Indian kitchen', 3499, 50, categoryIds['Home & Kitchen'], 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop'],
            ['Bed Sheet Set Cotton', 'Premium cotton bed sheet set with pillow covers', 1999, 80, categoryIds['Home & Kitchen'], 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop'],
            ['LED Table Lamp', 'Adjustable LED desk lamp with USB charging', 1499, 100, categoryIds['Home & Kitchen'], 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'],
            ['Air Purifier HEPA', 'HEPA filter air purifier for home use', 12999, 25, categoryIds['Home & Kitchen'], 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'],

            // Books & Media
            ['The Alchemist', 'Paulo Coelho\'s bestselling novel', 299, 200, categoryIds['Books & Media'], 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop'],
            ['Rich Dad Poor Dad', 'Robert Kiyosaki\'s financial education book', 399, 150, categoryIds['Books & Media'], 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop'],
            ['Atomic Habits', 'James Clear\'s guide to building good habits', 499, 180, categoryIds['Books & Media'], 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop'],
            ['Bhagavad Gita', 'Sacred Hindu scripture with commentary', 599, 100, categoryIds['Books & Media'], 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop'],
            ['Programming Book Set', 'Complete guide to Python programming', 1999, 75, categoryIds['Books & Media'], 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop'],

            // Beauty & Personal Care
            ['Lakme Foundation', 'Long-lasting liquid foundation, multiple shades', 899, 120, categoryIds['Beauty & Personal Care'], 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop'],
            ['Himalaya Face Wash', 'Neem and turmeric face wash for clear skin', 199, 300, categoryIds['Beauty & Personal Care'], 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=300&fit=crop'],
            ['Mamaearth Vitamin C Serum', 'Natural vitamin C serum for glowing skin', 599, 200, categoryIds['Beauty & Personal Care'], 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=300&fit=crop'],
            ['Gillette Razor Set', 'Premium shaving razor with refill blades', 799, 150, categoryIds['Beauty & Personal Care'], 'https://images.unsplash.com/photo-1499728603263-13726abce5ca?w=400&h=300&fit=crop'],
            ['Hair Oil Ayurvedic', 'Natural hair oil for hair growth and strength', 399, 250, categoryIds['Beauty & Personal Care'], 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=300&fit=crop'],

            // Automotive
            ['Car Phone Holder', 'Magnetic car phone mount for dashboard', 599, 200, categoryIds['Automotive'], 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop'],
            ['Car Air Freshener', 'Long-lasting car air freshener, multiple scents', 199, 500, categoryIds['Automotive'], 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop'],
            ['Bike Chain Lock', 'Heavy-duty chain lock for motorcycle security', 1999, 80, categoryIds['Automotive'], 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'],
            ['Car Seat Covers', 'Premium leather car seat covers set', 2999, 60, categoryIds['Automotive'], 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop'],

            // Toys & Games
            ['LEGO Classic Set', 'Creative building blocks set for kids', 2999, 50, categoryIds['Toys & Games'], 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=300&fit=crop'],
            ['Remote Control Car', 'High-speed RC car with rechargeable battery', 3999, 40, categoryIds['Toys & Games'], 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=300&fit=crop'],
            ['Chess Board Premium', 'Wooden chess board with carved pieces', 1999, 30, categoryIds['Toys & Games'], 'https://images.unsplash.com/photo-1528819622765-d6bcf132ac11?w=400&h=300&fit=crop'],
            ['Barbie Doll Set', 'Fashion doll with accessories and outfits', 1499, 80, categoryIds['Toys & Games'], 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=300&fit=crop'],
            ['Educational Tablet Kids', 'Learning tablet for children with games', 4999, 35, categoryIds['Toys & Games'], 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=300&fit=crop']
        ];

        // Insert products
        for (const [name, description, price, stock, categoryId, imageUrl] of products) {
            await connection.execute(
                'INSERT INTO products (name, description, price, stock_quantity, category_id, image_url) VALUES (?, ?, ?, ?, ?, ?)',
                [name, description, price, stock, categoryId, imageUrl]
            );
        }
        console.log(`${products.length} realistic products inserted`);

        // Create admin user if doesn't exist
        const hashedPassword = await bcrypt.hash('password', 10);
        try {
            await connection.execute(
                'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
                ['admin', 'admin@example.com', hashedPassword, 'admin']
            );
            console.log('Admin user created');
        } catch (err) {
            if (err.message.includes('Duplicate entry')) {
                console.log('Admin user already exists');
            }
        }

        await connection.end();
        console.log('\n✅ Realistic Indian products setup completed!');
        console.log('\n📊 Product Summary:');
        console.log('- Electronics: 10 products (₹599 - ₹2,19,999)');
        console.log('- Fashion: 10 products (₹799 - ₹16,999)');
        console.log('- Sports & Fitness: 7 products (₹599 - ₹8,999)');
        console.log('- Home & Kitchen: 6 products (₹1,499 - ₹12,999)');
        console.log('- Books & Media: 5 products (₹299 - ₹1,999)');
        console.log('- Beauty & Personal Care: 5 products (₹199 - ₹899)');
        console.log('- Automotive: 4 products (₹199 - ₹2,999)');
        console.log('- Toys & Games: 5 products (₹1,499 - ₹4,999)');
        console.log('\n🌐 Visit: http://localhost:3000');
        console.log('🔧 Admin: http://localhost:3000/admin');
        console.log('👤 Login: admin@example.com / password');

    } catch (error) {
        console.error('❌ Setup failed:', error.message);
    }
}

setupRealisticProducts();