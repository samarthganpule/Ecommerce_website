const { Client } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function setupRealisticProducts() {
    try {
        const connection = new Client({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 5432,
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
        });

        await connection.connect();
        console.log('Connected to database');

        // Clear existing data
        await connection.query('DELETE FROM cart');
        await connection.query('DELETE FROM order_items');
        await connection.query('DELETE FROM orders');
        await connection.query('DELETE FROM reviews');
        await connection.query('DELETE FROM product_images');
        await connection.query('DELETE FROM products');
        await connection.query('DELETE FROM categories');
        await connection.query('DELETE FROM users WHERE role != $1', ['admin']);
        
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
            const result = await connection.query(
                'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING id',
                [name, description]
            );
            categoryIds[name] = result.rows[0].id;
        }
        console.log('Categories inserted');

        // Insert realistic products with Indian pricing (INR)
        const products = [
            // Electronics
            ['iPhone 15 Pro', 'Latest Apple iPhone with A17 Pro chip, 128GB storage, Pro camera system', 134900, 25, categoryIds['Electronics'], '/images/products/iphone-15-pro.svg'],
            ['Samsung Galaxy S24 Ultra', 'Premium Android smartphone with S Pen, 256GB storage, 200MP camera', 124999, 30, categoryIds['Electronics'], '/images/products/samsung-galaxy-s24.svg'],
            ['MacBook Air M2', 'Apple MacBook Air with M2 chip, 13-inch Liquid Retina display, 256GB SSD', 114900, 15, categoryIds['Electronics'], '/images/products/macbook-air-m2.svg'],
            ['Dell XPS 13', 'Ultra-portable laptop with Intel i7, 16GB RAM, 512GB SSD', 89999, 20, categoryIds['Electronics'], '/images/products/dell-xps-13.svg'],
            ['Sony WH-1000XM5', 'Premium noise-canceling wireless headphones', 29990, 50, categoryIds['Electronics'], '/images/products/sony-headphones.svg'],
            ['iPad Pro 11-inch', 'Apple iPad Pro with M2 chip, 128GB, Wi-Fi', 81900, 35, categoryIds['Electronics'], '/images/products/ipad-pro-11.svg'],
            ['OnePlus 12', 'Flagship Android phone with Snapdragon 8 Gen 3, 256GB', 64999, 40, categoryIds['Electronics'], '/images/products/oneplus-12.svg'],
            ['Apple Watch Series 9', 'Advanced smartwatch with health monitoring, GPS', 41900, 45, categoryIds['Electronics'], '/images/products/apple-watch-9.svg'],
            ['Canon EOS R6 Mark II', 'Professional mirrorless camera with 24.2MP sensor', 219999, 10, categoryIds['Electronics'], '/images/products/canon-eos-r6.svg'],
            ['Nintendo Switch OLED', 'Gaming console with 7-inch OLED screen', 37999, 25, categoryIds['Electronics'], '/images/products/nintendo-switch.svg'],

            // Fashion
            ['Levi\'s 511 Slim Jeans', 'Classic slim-fit denim jeans for men, dark wash', 3999, 100, categoryIds['Fashion'], '/images/products/levis-jeans.svg'],
            ['Nike Air Force 1', 'Iconic white leather sneakers for men and women', 7999, 75, categoryIds['Fashion'], '/images/products/nike-air-force-1.svg'],
            ['Adidas Ultraboost 22', 'Premium running shoes with Boost technology', 16999, 60, categoryIds['Fashion'], '/images/products/adidas-ultraboost.svg'],
            ['H&M Cotton T-Shirt', 'Basic cotton crew neck t-shirt, multiple colors', 799, 200, categoryIds['Fashion'], '/images/products/hm-tshirt.svg'],
            ['Zara Formal Shirt', 'Slim-fit formal shirt for office wear', 2999, 80, categoryIds['Fashion'], '/images/products/zara-shirt.svg'],
            ['Ray-Ban Aviator Sunglasses', 'Classic aviator sunglasses with UV protection', 8999, 40, categoryIds['Fashion'], '/images/products/rayban-aviator.svg'],
            ['Ethnic Kurti Set', 'Beautiful printed kurti with palazzo pants', 1999, 120, categoryIds['Fashion'], '/images/products/ethnic-kurti.svg'],
            ['Saree with Blouse', 'Elegant silk saree with designer blouse piece', 4999, 50, categoryIds['Fashion'], '/images/products/silk-saree.svg'],
            ['Western Dress', 'Trendy midi dress for casual and party wear', 2499, 90, categoryIds['Fashion'], '/images/products/western-dress.svg'],
            ['Handbag Collection', 'Stylish leather handbag for women', 3499, 70, categoryIds['Fashion'], '/images/products/leather-handbag.svg'],

            // Sports & Fitness
            ['Yoga Mat Premium', 'Non-slip yoga mat with carrying strap, 6mm thick', 1999, 100, categoryIds['Sports & Fitness'], '/images/products/yoga-mat.svg'],
            ['Dumbbells Set 20kg', 'Adjustable dumbbell set for home gym', 4999, 30, categoryIds['Sports & Fitness'], '/images/products/dumbbells-20kg.svg'],
            ['Cricket Bat Professional', 'English willow cricket bat for professionals', 8999, 25, categoryIds['Sports & Fitness'], '/images/products/cricket-bat.svg'],
            ['Football FIFA Quality', 'Official size 5 football for matches', 1499, 80, categoryIds['Sports & Fitness'], '/images/products/football.svg'],
            ['Badminton Racket Pro', 'Carbon fiber badminton racket with cover', 3999, 40, categoryIds['Sports & Fitness'], '/images/products/badminton-racket.svg'],
            ['Gym Gloves', 'Workout gloves with wrist support', 899, 150, categoryIds['Sports & Fitness'], '/images/products/gym-gloves.svg'],
            ['Protein Shaker Bottle', 'BPA-free protein shaker with mixing ball', 599, 200, categoryIds['Sports & Fitness'], '/images/products/protein-shaker.svg'],

            // Home & Kitchen
            ['Pressure Cooker 5L', 'Stainless steel pressure cooker for Indian cooking', 2999, 60, categoryIds['Home & Kitchen'], '/images/products/pressure-cooker.svg'],
            ['Non-Stick Cookware Set', '7-piece non-stick cookware set with lids', 4999, 40, categoryIds['Home & Kitchen'], '/images/products/cookware-set.svg'],
            ['Mixer Grinder 750W', '3-jar mixer grinder for Indian kitchen', 3499, 50, categoryIds['Home & Kitchen'], '/images/products/mixer-grinder.svg'],
            ['Bed Sheet Set Cotton', 'Premium cotton bed sheet set with pillow covers', 1999, 80, categoryIds['Home & Kitchen'], '/images/products/bed-sheet-set.svg'],
            ['LED Table Lamp', 'Adjustable LED desk lamp with USB charging', 1499, 100, categoryIds['Home & Kitchen'], '/images/products/led-lamp.svg'],
            ['Air Purifier HEPA', 'HEPA filter air purifier for home use', 12999, 25, categoryIds['Home & Kitchen'], '/images/products/air-purifier.svg'],

            // Books & Media
            ['The Alchemist', 'Paulo Coelho\'s bestselling novel', 299, 200, categoryIds['Books & Media'], '/images/products/the-alchemist.svg'],
            ['Rich Dad Poor Dad', 'Robert Kiyosaki\'s financial education book', 399, 150, categoryIds['Books & Media'], '/images/products/rich-dad-poor-dad.svg'],
            ['Atomic Habits', 'James Clear\'s guide to building good habits', 499, 180, categoryIds['Books & Media'], '/images/products/atomic-habits.svg'],
            ['Bhagavad Gita', 'Sacred Hindu scripture with commentary', 599, 100, categoryIds['Books & Media'], '/images/products/bhagavad-gita.svg'],
            ['Programming Book Set', 'Complete guide to Python programming', 1999, 75, categoryIds['Books & Media'], '/images/products/python-programming.svg'],

            // Beauty & Personal Care
            ['Lakme Foundation', 'Long-lasting liquid foundation, multiple shades', 899, 120, categoryIds['Beauty & Personal Care'], '/images/products/lakme-foundation.svg'],
            ['Himalaya Face Wash', 'Neem and turmeric face wash for clear skin', 199, 300, categoryIds['Beauty & Personal Care'], '/images/products/himalaya-face-wash.svg'],
            ['Mamaearth Vitamin C Serum', 'Natural vitamin C serum for glowing skin', 599, 200, categoryIds['Beauty & Personal Care'], '/images/products/vitamin-c-serum.svg'],
            ['Gillette Razor Set', 'Premium shaving razor with refill blades', 799, 150, categoryIds['Beauty & Personal Care'], '/images/products/gillette-razor.svg'],
            ['Hair Oil Ayurvedic', 'Natural hair oil for hair growth and strength', 399, 250, categoryIds['Beauty & Personal Care'], '/images/products/hair-oil.svg'],

            // Automotive
            ['Car Phone Holder', 'Magnetic car phone mount for dashboard', 599, 200, categoryIds['Automotive'], '/images/products/phone-holder.svg'],
            ['Car Air Freshener', 'Long-lasting car air freshener, multiple scents', 199, 500, categoryIds['Automotive'], '/images/products/air-freshener.svg'],
            ['Bike Chain Lock', 'Heavy-duty chain lock for motorcycle security', 1999, 80, categoryIds['Automotive'], '/images/products/chain-lock.svg'],
            ['Car Seat Covers', 'Premium leather car seat covers set', 2999, 60, categoryIds['Automotive'], '/images/products/seat-covers.svg'],

            // Toys & Games
            ['LEGO Classic Set', 'Creative building blocks set for kids', 2999, 50, categoryIds['Toys & Games'], '/images/products/lego-classic.svg'],
            ['Remote Control Car', 'High-speed RC car with rechargeable battery', 3999, 40, categoryIds['Toys & Games'], '/images/products/rc-car.svg'],
            ['Chess Board Premium', 'Wooden chess board with carved pieces', 1999, 30, categoryIds['Toys & Games'], '/images/products/chess-board.svg'],
            ['Barbie Doll Set', 'Fashion doll with accessories and outfits', 1499, 80, categoryIds['Toys & Games'], '/images/products/barbie-doll.svg'],
            ['Educational Tablet Kids', 'Learning tablet for children with games', 4999, 35, categoryIds['Toys & Games'], '/images/products/kids-tablet.svg']
        ];

        // Insert products
        for (const [name, description, price, stock, categoryId, imageUrl] of products) {
            await connection.query(
                'INSERT INTO products (name, description, price, stock_quantity, category_id, image_url) VALUES ($1, $2, $3, $4, $5, $6)',
                [name, description, price, stock, categoryId, imageUrl]
            );
        }
        console.log(`${products.length} realistic products inserted`);

        // Create admin user if doesn't exist
        const hashedPassword = await bcrypt.hash('password', 10);
        try {
            await connection.query(
                'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)',
                ['admin', 'admin@example.com', hashedPassword, 'admin']
            );
            console.log('Admin user created');
        } catch (err) {
            if (err.message.includes('duplicate key')) {
                console.log('Admin user already exists');
            }
        }

        await connection.end();
        console.log('\n✅ Realistic Indian products setup completed!');
        console.log('\n📊 Product Summary:');
        console.log('- Electronics: 10 products (₹29,990 - ₹2,19,999)');
        console.log('- Fashion: 10 products (₹799 - ₹16,999)');
        console.log('- Sports & Fitness: 7 products (₹599 - ₹8,999)');
        console.log('- Home & Kitchen: 6 products (₹1,499 - ₹12,999)');
        console.log('- Books & Media: 5 products (₹299 - ₹1,999)');
        console.log('- Beauty & Personal Care: 5 products (₹199 - ₹899)');
        console.log('- Automotive: 4 products (₹199 - ₹2,999)');
        console.log('- Toys & Games: 5 products (₹1,499 - ₹4,999)');
        console.log('\n🌐 Visit your website to see all products!');
        console.log('👤 Login: admin@example.com / password');

    } catch (error) {
        console.error('❌ Setup failed:', error.message);
    }
}

setupRealisticProducts();