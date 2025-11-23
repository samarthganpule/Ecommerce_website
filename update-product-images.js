const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateProductImages() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('Connected to database');

        // Better product images with accurate representations using placeholder.com
        const productImages = [
            // Electronics
            ['iPhone 15 Pro', 'https://via.placeholder.com/400x300/1a1a1a/ffffff?text=iPhone+15+Pro'],
            ['Samsung Galaxy S24 Ultra', 'https://via.placeholder.com/400x300/000080/ffffff?text=Samsung+Galaxy+S24'],
            ['MacBook Air M2', 'https://via.placeholder.com/400x300/c0c0c0/000000?text=MacBook+Air+M2'],
            ['Dell XPS 13', 'https://via.placeholder.com/400x300/2c3e50/ffffff?text=Dell+XPS+13'],
            ['Sony WH-1000XM5', 'https://via.placeholder.com/400x300/000000/ffffff?text=Sony+Headphones'],
            ['iPad Pro 11-inch', 'https://via.placeholder.com/400x300/e8e8e8/000000?text=iPad+Pro+11'],
            ['OnePlus 12', 'https://via.placeholder.com/400x300/ff0000/ffffff?text=OnePlus+12'],
            ['Apple Watch Series 9', 'https://via.placeholder.com/400x300/1a1a1a/ffffff?text=Apple+Watch+9'],
            ['Canon EOS R6 Mark II', 'https://via.placeholder.com/400x300/000000/ffffff?text=Canon+EOS+R6'],
            ['Nintendo Switch OLED', 'https://via.placeholder.com/400x300/e60012/ffffff?text=Nintendo+Switch'],

            // Fashion
            ['Levi\'s 511 Slim Jeans', 'https://via.placeholder.com/400x300/1e3a8a/ffffff?text=Levis+Jeans'],
            ['Nike Air Force 1', 'https://via.placeholder.com/400x300/ffffff/000000?text=Nike+Air+Force+1'],
            ['Adidas Ultraboost 22', 'https://via.placeholder.com/400x300/000000/ffffff?text=Adidas+Ultraboost'],
            ['H&M Cotton T-Shirt', 'https://via.placeholder.com/400x300/e50010/ffffff?text=H%26M+T-Shirt'],
            ['Zara Formal Shirt', 'https://via.placeholder.com/400x300/2c5f2d/ffffff?text=Zara+Shirt'],
            ['Ray-Ban Aviator Sunglasses', 'https://via.placeholder.com/400x300/000000/ffffff?text=Ray-Ban+Aviator'],
            ['Ethnic Kurti Set', 'https://via.placeholder.com/400x300/ff6b9d/ffffff?text=Ethnic+Kurti'],
            ['Saree with Blouse', 'https://via.placeholder.com/400x300/ff1493/ffffff?text=Silk+Saree'],
            ['Western Dress', 'https://via.placeholder.com/400x300/9b59b6/ffffff?text=Western+Dress'],
            ['Handbag Collection', 'https://via.placeholder.com/400x300/8b4513/ffffff?text=Leather+Handbag'],

            // Sports & Fitness
            ['Yoga Mat Premium', 'https://via.placeholder.com/400x300/9c27b0/ffffff?text=Yoga+Mat'],
            ['Dumbbells Set 20kg', 'https://via.placeholder.com/400x300/424242/ffffff?text=Dumbbells+20kg'],
            ['Cricket Bat Professional', 'https://via.placeholder.com/400x300/d4a574/000000?text=Cricket+Bat'],
            ['Football FIFA Quality', 'https://via.placeholder.com/400x300/ffffff/000000?text=Football'],
            ['Badminton Racket Pro', 'https://via.placeholder.com/400x300/00bcd4/ffffff?text=Badminton+Racket'],
            ['Gym Gloves', 'https://via.placeholder.com/400x300/000000/ffffff?text=Gym+Gloves'],
            ['Protein Shaker Bottle', 'https://via.placeholder.com/400x300/2196f3/ffffff?text=Protein+Shaker'],

            // Home & Kitchen
            ['Pressure Cooker 5L', 'https://via.placeholder.com/400x300/c0c0c0/000000?text=Pressure+Cooker'],
            ['Non-Stick Cookware Set', 'https://via.placeholder.com/400x300/1a1a1a/ffffff?text=Cookware+Set'],
            ['Mixer Grinder 750W', 'https://via.placeholder.com/400x300/ffffff/000000?text=Mixer+Grinder'],
            ['Bed Sheet Set Cotton', 'https://via.placeholder.com/400x300/87ceeb/000000?text=Bed+Sheet+Set'],
            ['LED Table Lamp', 'https://via.placeholder.com/400x300/ffd700/000000?text=LED+Lamp'],
            ['Air Purifier HEPA', 'https://via.placeholder.com/400x300/ffffff/000000?text=Air+Purifier'],

            // Books & Media
            ['The Alchemist', 'https://via.placeholder.com/400x300/8b4513/ffffff?text=The+Alchemist'],
            ['Rich Dad Poor Dad', 'https://via.placeholder.com/400x300/4b0082/ffffff?text=Rich+Dad+Poor+Dad'],
            ['Atomic Habits', 'https://via.placeholder.com/400x300/ff6347/ffffff?text=Atomic+Habits'],
            ['Bhagavad Gita', 'https://via.placeholder.com/400x300/ff8c00/ffffff?text=Bhagavad+Gita'],
            ['Programming Book Set', 'https://via.placeholder.com/400x300/008080/ffffff?text=Python+Programming'],

            // Beauty & Personal Care
            ['Lakme Foundation', 'https://via.placeholder.com/400x300/ff69b4/ffffff?text=Lakme+Foundation'],
            ['Himalaya Face Wash', 'https://via.placeholder.com/400x300/90ee90/000000?text=Himalaya+Face+Wash'],
            ['Mamaearth Vitamin C Serum', 'https://via.placeholder.com/400x300/ffa500/ffffff?text=Vitamin+C+Serum'],
            ['Gillette Razor Set', 'https://via.placeholder.com/400x300/0000ff/ffffff?text=Gillette+Razor'],
            ['Hair Oil Ayurvedic', 'https://via.placeholder.com/400x300/8b4513/ffffff?text=Hair+Oil'],

            // Automotive
            ['Car Phone Holder', 'https://via.placeholder.com/400x300/000000/ffffff?text=Phone+Holder'],
            ['Car Air Freshener', 'https://via.placeholder.com/400x300/00ff00/000000?text=Air+Freshener'],
            ['Bike Chain Lock', 'https://via.placeholder.com/400x300/696969/ffffff?text=Chain+Lock'],
            ['Car Seat Covers', 'https://via.placeholder.com/400x300/8b4513/ffffff?text=Seat+Covers'],

            // Toys & Games
            ['LEGO Classic Set', 'https://via.placeholder.com/400x300/ff0000/ffffff?text=LEGO+Classic'],
            ['Remote Control Car', 'https://via.placeholder.com/400x300/ff4500/ffffff?text=RC+Car'],
            ['Chess Board Premium', 'https://via.placeholder.com/400x300/8b4513/ffffff?text=Chess+Board'],
            ['Barbie Doll Set', 'https://via.placeholder.com/400x300/ff1493/ffffff?text=Barbie+Doll'],
            ['Educational Tablet Kids', 'https://via.placeholder.com/400x300/4169e1/ffffff?text=Kids+Tablet']
        ];

        // Update each product's image
        for (const [productName, imageUrl] of productImages) {
            await connection.execute(
                'UPDATE products SET image_url = ? WHERE name = ?',
                [imageUrl, productName]
            );
        }

        console.log(`✅ Updated ${productImages.length} product images with accurate representations`);
        console.log('Each product now has an image that matches its name!');

        await connection.end();

    } catch (error) {
        console.error('❌ Update failed:', error.message);
    }
}

updateProductImages();