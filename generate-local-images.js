const fs = require('fs');
const path = require('path');

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, 'public', 'images', 'products');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

// Function to create SVG image
function createProductImage(productName, category, filename) {
    // Color schemes for different categories
    const categoryColors = {
        'Electronics': { bg: '#1a1a1a', text: '#ffffff' },
        'Fashion': { bg: '#ff6b9d', text: '#ffffff' },
        'Sports & Fitness': { bg: '#2196f3', text: '#ffffff' },
        'Home & Kitchen': { bg: '#4caf50', text: '#ffffff' },
        'Books & Media': { bg: '#8b4513', text: '#ffffff' },
        'Beauty & Personal Care': { bg: '#ff69b4', text: '#ffffff' },
        'Automotive': { bg: '#424242', text: '#ffffff' },
        'Toys & Games': { bg: '#ff4500', text: '#ffffff' }
    };

    const colors = categoryColors[category] || { bg: '#cccccc', text: '#333333' };
    
    // Create SVG content
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="300" fill="${colors.bg}"/>
    <text x="200" y="130" font-family="Arial, sans-serif" font-size="24" font-weight="bold" 
          fill="${colors.text}" text-anchor="middle">${productName}</text>
    <text x="200" y="170" font-family="Arial, sans-serif" font-size="16" 
          fill="${colors.text}" text-anchor="middle" opacity="0.8">${category}</text>
</svg>`;

    // Save SVG file
    const filepath = path.join(imagesDir, filename);
    fs.writeFileSync(filepath, svg);
    console.log(`Created: ${filename}`);
}

// Product list with categories
const products = [
    // Electronics
    { name: 'iPhone 15 Pro', category: 'Electronics', file: 'iphone-15-pro.svg' },
    { name: 'Samsung Galaxy S24', category: 'Electronics', file: 'samsung-galaxy-s24.svg' },
    { name: 'MacBook Air M2', category: 'Electronics', file: 'macbook-air-m2.svg' },
    { name: 'Dell XPS 13', category: 'Electronics', file: 'dell-xps-13.svg' },
    { name: 'Sony Headphones', category: 'Electronics', file: 'sony-headphones.svg' },
    { name: 'iPad Pro 11', category: 'Electronics', file: 'ipad-pro-11.svg' },
    { name: 'OnePlus 12', category: 'Electronics', file: 'oneplus-12.svg' },
    { name: 'Apple Watch 9', category: 'Electronics', file: 'apple-watch-9.svg' },
    { name: 'Canon EOS R6', category: 'Electronics', file: 'canon-eos-r6.svg' },
    { name: 'Nintendo Switch', category: 'Electronics', file: 'nintendo-switch.svg' },

    // Fashion
    { name: 'Levis Jeans', category: 'Fashion', file: 'levis-jeans.svg' },
    { name: 'Nike Air Force 1', category: 'Fashion', file: 'nike-air-force-1.svg' },
    { name: 'Adidas Ultraboost', category: 'Fashion', file: 'adidas-ultraboost.svg' },
    { name: 'H&M T-Shirt', category: 'Fashion', file: 'hm-tshirt.svg' },
    { name: 'Zara Shirt', category: 'Fashion', file: 'zara-shirt.svg' },
    { name: 'Ray-Ban Aviator', category: 'Fashion', file: 'rayban-aviator.svg' },
    { name: 'Ethnic Kurti', category: 'Fashion', file: 'ethnic-kurti.svg' },
    { name: 'Silk Saree', category: 'Fashion', file: 'silk-saree.svg' },
    { name: 'Western Dress', category: 'Fashion', file: 'western-dress.svg' },
    { name: 'Leather Handbag', category: 'Fashion', file: 'leather-handbag.svg' },

    // Sports & Fitness
    { name: 'Yoga Mat', category: 'Sports & Fitness', file: 'yoga-mat.svg' },
    { name: 'Dumbbells 20kg', category: 'Sports & Fitness', file: 'dumbbells-20kg.svg' },
    { name: 'Cricket Bat', category: 'Sports & Fitness', file: 'cricket-bat.svg' },
    { name: 'Football', category: 'Sports & Fitness', file: 'football.svg' },
    { name: 'Badminton Racket', category: 'Sports & Fitness', file: 'badminton-racket.svg' },
    { name: 'Gym Gloves', category: 'Sports & Fitness', file: 'gym-gloves.svg' },
    { name: 'Protein Shaker', category: 'Sports & Fitness', file: 'protein-shaker.svg' },

    // Home & Kitchen
    { name: 'Pressure Cooker', category: 'Home & Kitchen', file: 'pressure-cooker.svg' },
    { name: 'Cookware Set', category: 'Home & Kitchen', file: 'cookware-set.svg' },
    { name: 'Mixer Grinder', category: 'Home & Kitchen', file: 'mixer-grinder.svg' },
    { name: 'Bed Sheet Set', category: 'Home & Kitchen', file: 'bed-sheet-set.svg' },
    { name: 'LED Lamp', category: 'Home & Kitchen', file: 'led-lamp.svg' },
    { name: 'Air Purifier', category: 'Home & Kitchen', file: 'air-purifier.svg' },

    // Books & Media
    { name: 'The Alchemist', category: 'Books & Media', file: 'the-alchemist.svg' },
    { name: 'Rich Dad Poor Dad', category: 'Books & Media', file: 'rich-dad-poor-dad.svg' },
    { name: 'Atomic Habits', category: 'Books & Media', file: 'atomic-habits.svg' },
    { name: 'Bhagavad Gita', category: 'Books & Media', file: 'bhagavad-gita.svg' },
    { name: 'Python Programming', category: 'Books & Media', file: 'python-programming.svg' },

    // Beauty & Personal Care
    { name: 'Lakme Foundation', category: 'Beauty & Personal Care', file: 'lakme-foundation.svg' },
    { name: 'Himalaya Face Wash', category: 'Beauty & Personal Care', file: 'himalaya-face-wash.svg' },
    { name: 'Vitamin C Serum', category: 'Beauty & Personal Care', file: 'vitamin-c-serum.svg' },
    { name: 'Gillette Razor', category: 'Beauty & Personal Care', file: 'gillette-razor.svg' },
    { name: 'Hair Oil', category: 'Beauty & Personal Care', file: 'hair-oil.svg' },

    // Automotive
    { name: 'Phone Holder', category: 'Automotive', file: 'phone-holder.svg' },
    { name: 'Air Freshener', category: 'Automotive', file: 'air-freshener.svg' },
    { name: 'Chain Lock', category: 'Automotive', file: 'chain-lock.svg' },
    { name: 'Seat Covers', category: 'Automotive', file: 'seat-covers.svg' },

    // Toys & Games
    { name: 'LEGO Classic', category: 'Toys & Games', file: 'lego-classic.svg' },
    { name: 'RC Car', category: 'Toys & Games', file: 'rc-car.svg' },
    { name: 'Chess Board', category: 'Toys & Games', file: 'chess-board.svg' },
    { name: 'Barbie Doll', category: 'Toys & Games', file: 'barbie-doll.svg' },
    { name: 'Kids Tablet', category: 'Toys & Games', file: 'kids-tablet.svg' }
];

console.log('Generating product images...\n');

// Generate all images
products.forEach(product => {
    createProductImage(product.name, product.category, product.file);
});

console.log(`\n✅ Generated ${products.length} product images in ${imagesDir}`);
console.log('Now run: npm run update-local-images');
