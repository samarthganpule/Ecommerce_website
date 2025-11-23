const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateLocalImages() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('Connected to database');

        // Map product names to local image files
        const productImages = [
            // Electronics
            ['iPhone 15 Pro', '/images/products/iphone-15-pro.svg'],
            ['Samsung Galaxy S24 Ultra', '/images/products/samsung-galaxy-s24.svg'],
            ['MacBook Air M2', '/images/products/macbook-air-m2.svg'],
            ['Dell XPS 13', '/images/products/dell-xps-13.svg'],
            ['Sony WH-1000XM5', '/images/products/sony-headphones.svg'],
            ['iPad Pro 11-inch', '/images/products/ipad-pro-11.svg'],
            ['OnePlus 12', '/images/products/oneplus-12.svg'],
            ['Apple Watch Series 9', '/images/products/apple-watch-9.svg'],
            ['Canon EOS R6 Mark II', '/images/products/canon-eos-r6.svg'],
            ['Nintendo Switch OLED', '/images/products/nintendo-switch.svg'],

            // Fashion
            ['Levi\'s 511 Slim Jeans', '/images/products/levis-jeans.svg'],
            ['Nike Air Force 1', '/images/products/nike-air-force-1.svg'],
            ['Adidas Ultraboost 22', '/images/products/adidas-ultraboost.svg'],
            ['H&M Cotton T-Shirt', '/images/products/hm-tshirt.svg'],
            ['Zara Formal Shirt', '/images/products/zara-shirt.svg'],
            ['Ray-Ban Aviator Sunglasses', '/images/products/rayban-aviator.svg'],
            ['Ethnic Kurti Set', '/images/products/ethnic-kurti.svg'],
            ['Saree with Blouse', '/images/products/silk-saree.svg'],
            ['Western Dress', '/images/products/western-dress.svg'],
            ['Handbag Collection', '/images/products/leather-handbag.svg'],

            // Sports & Fitness
            ['Yoga Mat Premium', '/images/products/yoga-mat.svg'],
            ['Dumbbells Set 20kg', '/images/products/dumbbells-20kg.svg'],
            ['Cricket Bat Professional', '/images/products/cricket-bat.svg'],
            ['Football FIFA Quality', '/images/products/football.svg'],
            ['Badminton Racket Pro', '/images/products/badminton-racket.svg'],
            ['Gym Gloves', '/images/products/gym-gloves.svg'],
            ['Protein Shaker Bottle', '/images/products/protein-shaker.svg'],

            // Home & Kitchen
            ['Pressure Cooker 5L', '/images/products/pressure-cooker.svg'],
            ['Non-Stick Cookware Set', '/images/products/cookware-set.svg'],
            ['Mixer Grinder 750W', '/images/products/mixer-grinder.svg'],
            ['Bed Sheet Set Cotton', '/images/products/bed-sheet-set.svg'],
            ['LED Table Lamp', '/images/products/led-lamp.svg'],
            ['Air Purifier HEPA', '/images/products/air-purifier.svg'],

            // Books & Media
            ['The Alchemist', '/images/products/the-alchemist.svg'],
            ['Rich Dad Poor Dad', '/images/products/rich-dad-poor-dad.svg'],
            ['Atomic Habits', '/images/products/atomic-habits.svg'],
            ['Bhagavad Gita', '/images/products/bhagavad-gita.svg'],
            ['Programming Book Set', '/images/products/python-programming.svg'],

            // Beauty & Personal Care
            ['Lakme Foundation', '/images/products/lakme-foundation.svg'],
            ['Himalaya Face Wash', '/images/products/himalaya-face-wash.svg'],
            ['Mamaearth Vitamin C Serum', '/images/products/vitamin-c-serum.svg'],
            ['Gillette Razor Set', '/images/products/gillette-razor.svg'],
            ['Hair Oil Ayurvedic', '/images/products/hair-oil.svg'],

            // Automotive
            ['Car Phone Holder', '/images/products/phone-holder.svg'],
            ['Car Air Freshener', '/images/products/air-freshener.svg'],
            ['Bike Chain Lock', '/images/products/chain-lock.svg'],
            ['Car Seat Covers', '/images/products/seat-covers.svg'],

            // Toys & Games
            ['LEGO Classic Set', '/images/products/lego-classic.svg'],
            ['Remote Control Car', '/images/products/rc-car.svg'],
            ['Chess Board Premium', '/images/products/chess-board.svg'],
            ['Barbie Doll Set', '/images/products/barbie-doll.svg'],
            ['Educational Tablet Kids', '/images/products/kids-tablet.svg']
        ];

        // Update each product's image path
        let updated = 0;
        for (const [productName, imagePath] of productImages) {
            const [result] = await connection.execute(
                'UPDATE products SET image_url = ? WHERE name = ?',
                [imagePath, productName]
            );
            if (result.affectedRows > 0) {
                updated++;
            }
        }

        console.log(`✅ Updated ${updated} product images with local paths`);
        console.log('All products now use local image files!');
        console.log('\n🌐 Restart your server and visit: http://localhost:3000');

        await connection.end();

    } catch (error) {
        console.error('❌ Update failed:', error.message);
    }
}

updateLocalImages();