import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectDB from '../config/db.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Order from '../models/Order.js';

dotenv.config();
connectDB();

const users = [
  {
    name: 'Admin User',
    email: 'admin@electroshop.com',
    password: await bcrypt.hash('admin123', 12),
    isAdmin: true,
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: await bcrypt.hash('password123', 12),
    isAdmin: false,
  },
];

const products = [
  // ─── Smartphones ────────────────────────────────────────────────────────────
  {
    name: 'Apple iPhone 15 Pro',
    description:
      'The iPhone 15 Pro features a titanium design with the powerful A17 Pro chip and a customizable Action button. The 48MP main camera with a second-generation sensor shift OIS captures stunning photos and 4K ProRes video.',
    price: 999.99,
    comparePrice: 1099.99,
    category: 'phones',
    brand: 'Apple',
    stock: 45,
    images: ['https://store.storeimages.cdn-apple.com/iphone15pro.jpg'],
    rating: 4.8,
    numReviews: 312,
    specs: new Map([
      ['Display', '6.1-inch Super Retina XDR OLED'],
      ['Chip', 'Apple A17 Pro'],
      ['RAM', '8GB'],
      ['Storage', '256GB'],
      ['Camera', '48MP + 12MP + 12MP Triple'],
      ['Battery', '3274 mAh'],
      ['OS', 'iOS 17'],
      ['5G', 'Yes'],
    ]),
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description:
      'Galaxy S24 Ultra redefines smartphone AI with the built-in S Pen and Snapdragon 8 Gen 3 processor. The 200MP quad-camera system and 5000 mAh battery set new benchmarks for Android flagship performance.',
    price: 1199.99,
    comparePrice: 1299.99,
    category: 'phones',
    brand: 'Samsung',
    stock: 38,
    images: ['https://images.samsung.com/s24ultra.jpg'],
    rating: 4.7,
    numReviews: 289,
    specs: new Map([
      ['Display', '6.8-inch QHD+ Dynamic AMOLED 2X'],
      ['Chip', 'Snapdragon 8 Gen 3'],
      ['RAM', '12GB'],
      ['Storage', '256GB'],
      ['Camera', '200MP + 50MP + 10MP + 12MP Quad'],
      ['Battery', '5000 mAh'],
      ['OS', 'Android 14 / One UI 6.1'],
      ['S Pen', 'Included'],
    ]),
  },
  {
    name: 'Google Pixel 8 Pro',
    description:
      'Google Pixel 8 Pro is powered by the custom Tensor G3 chip with industry-leading AI capabilities. The triple rear camera system with 50MP main sensor and Gemini AI integration delivers unmatched computational photography.',
    price: 899.99,
    comparePrice: 999.99,
    category: 'phones',
    brand: 'Google',
    stock: 52,
    images: ['https://store.google.com/pixel8pro.jpg'],
    rating: 4.6,
    numReviews: 198,
    specs: new Map([
      ['Display', '6.7-inch LTPO OLED 120Hz'],
      ['Chip', 'Google Tensor G3'],
      ['RAM', '12GB'],
      ['Storage', '256GB'],
      ['Camera', '50MP + 48MP + 48MP Triple'],
      ['Battery', '5050 mAh'],
      ['OS', 'Android 14'],
      ['Temperature Sensor', 'Yes'],
    ]),
  },
  {
    name: 'OnePlus 12',
    description:
      'OnePlus 12 pairs the Snapdragon 8 Gen 3 with a Hasselblad-tuned triple camera system for flagship performance at a compelling price. The 100W SUPERVOOC charging fills the 5400 mAh battery in under 25 minutes.',
    price: 799.99,
    comparePrice: 849.99,
    category: 'phones',
    brand: 'OnePlus',
    stock: 60,
    images: ['https://images.oneplus.com/op12.jpg'],
    rating: 4.5,
    numReviews: 145,
    specs: new Map([
      ['Display', '6.82-inch 2K LTPO AMOLED 120Hz'],
      ['Chip', 'Snapdragon 8 Gen 3'],
      ['RAM', '12GB'],
      ['Storage', '256GB'],
      ['Camera', '50MP + 48MP + 64MP Triple (Hasselblad)'],
      ['Battery', '5400 mAh'],
      ['Charging', '100W Wired / 50W Wireless'],
      ['OS', 'OxygenOS 14 (Android 14)'],
    ]),
  },

  // ─── Laptops ─────────────────────────────────────────────────────────────────
  {
    name: 'Apple MacBook Pro 16" M3 Pro',
    description:
      'The MacBook Pro with M3 Pro chip delivers exceptional performance for developers and creatives with up to 18 hours of battery life. The 16-inch Liquid Retina XDR display with ProMotion technology renders every pixel with stunning precision.',
    price: 2499.99,
    comparePrice: 2699.99,
    category: 'laptops',
    brand: 'Apple',
    stock: 20,
    images: ['https://store.storeimages.cdn-apple.com/macbookpro16.jpg'],
    rating: 4.9,
    numReviews: 421,
    specs: new Map([
      ['Chip', 'Apple M3 Pro (12-core CPU, 18-core GPU)'],
      ['RAM', '18GB Unified Memory'],
      ['Storage', '512GB SSD'],
      ['Display', '16.2" Liquid Retina XDR 3456×2234'],
      ['Battery', 'Up to 18 hours'],
      ['Ports', '3x Thunderbolt 4, HDMI, SD Card, MagSafe 3'],
      ['Weight', '2.14 kg'],
      ['OS', 'macOS Sonoma'],
    ]),
  },
  {
    name: 'Dell XPS 15 9530',
    description:
      'The Dell XPS 15 combines a stunning 3.5K OLED display with Intel Core i9 processing power, perfect for creative professionals and power users. Slim bezels and premium aluminum construction make it one of the most elegant Windows laptops available.',
    price: 1999.99,
    comparePrice: 2199.99,
    category: 'laptops',
    brand: 'Dell',
    stock: 25,
    images: ['https://i.dell.com/xps15-9530.jpg'],
    rating: 4.7,
    numReviews: 267,
    specs: new Map([
      ['Processor', 'Intel Core i9-13900H'],
      ['RAM', '32GB DDR5'],
      ['Storage', '1TB NVMe SSD'],
      ['Display', '15.6" 3.5K OLED 60Hz'],
      ['GPU', 'NVIDIA GeForce RTX 4060 8GB'],
      ['Battery', '86Wh, Up to 12 hours'],
      ['Weight', '1.86 kg'],
      ['OS', 'Windows 11 Home'],
    ]),
  },
  {
    name: 'Lenovo ThinkPad X1 Carbon Gen 11',
    description:
      'The ThinkPad X1 Carbon Gen 11 is the gold standard for business laptops, offering military-grade durability with enterprise security features. At just 1.12 kg, the ultralight carbon fiber chassis never compromises on performance or connectivity.',
    price: 1699.99,
    comparePrice: 1899.99,
    category: 'laptops',
    brand: 'Lenovo',
    stock: 30,
    images: ['https://lenovo.com/x1carbon-gen11.jpg'],
    rating: 4.6,
    numReviews: 183,
    specs: new Map([
      ['Processor', 'Intel Core i7-1365U vPro'],
      ['RAM', '16GB LPDDR5'],
      ['Storage', '512GB NVMe SSD'],
      ['Display', '14" 2.8K IPS 120Hz'],
      ['Battery', '57Wh, Up to 15 hours'],
      ['Weight', '1.12 kg'],
      ['Security', 'Fingerprint + IR Camera + TPM 2.0'],
      ['OS', 'Windows 11 Pro'],
    ]),
  },
  {
    name: 'ASUS ROG Zephyrus G16',
    description:
      'The ROG Zephyrus G16 packs a serious RTX 4080 GPU into a slim 20mm chassis, making it the most powerful thin gaming laptop available. The MiniLED display with 240Hz refresh rate ensures silky-smooth gameplay with zero motion blur.',
    price: 2299.99,
    comparePrice: 2499.99,
    category: 'laptops',
    brand: 'ASUS',
    stock: 18,
    images: ['https://asus.com/rog-zephyrus-g16.jpg'],
    rating: 4.8,
    numReviews: 156,
    specs: new Map([
      ['Processor', 'Intel Core i9-14900HX'],
      ['RAM', '32GB DDR5'],
      ['Storage', '2TB NVMe SSD'],
      ['Display', '16" QHD+ MiniLED 240Hz'],
      ['GPU', 'NVIDIA GeForce RTX 4080 12GB'],
      ['Battery', '90Wh'],
      ['Weight', '1.95 kg'],
      ['OS', 'Windows 11 Home'],
    ]),
  },

  // ─── Tablets ─────────────────────────────────────────────────────────────────
  {
    name: 'Apple iPad Pro 12.9" M2',
    description:
      'The iPad Pro with M2 chip brings desktop-class performance to a remarkably thin and light design. With Apple Pencil hover capabilities, ProMotion 120Hz XDR display, and Thunderbolt connectivity, it\'s the ultimate creative tool.',
    price: 1099.99,
    comparePrice: 1199.99,
    category: 'tablets',
    brand: 'Apple',
    stock: 35,
    images: ['https://store.storeimages.cdn-apple.com/ipadpro129.jpg'],
    rating: 4.8,
    numReviews: 234,
    specs: new Map([
      ['Chip', 'Apple M2'],
      ['Display', '12.9" Liquid Retina XDR 120Hz'],
      ['RAM', '8GB'],
      ['Storage', '256GB'],
      ['Camera', '12MP + 10MP + LiDAR'],
      ['Battery', 'Up to 10 hours'],
      ['Connectivity', 'Wi-Fi 6E + Bluetooth 5.3'],
      ['Pencil', 'Apple Pencil 2nd gen compatible'],
    ]),
  },
  {
    name: 'Samsung Galaxy Tab S9 Ultra',
    description:
      'Galaxy Tab S9 Ultra features a massive 14.6" Dynamic AMOLED 2X display with an included S Pen for the ultimate Android tablet experience. The Snapdragon 8 Gen 2 and IP68 water resistance make it a powerhouse built to last.',
    price: 1199.99,
    comparePrice: 1299.99,
    category: 'tablets',
    brand: 'Samsung',
    stock: 28,
    images: ['https://images.samsung.com/tabs9ultra.jpg'],
    rating: 4.7,
    numReviews: 178,
    specs: new Map([
      ['Chip', 'Snapdragon 8 Gen 2'],
      ['Display', '14.6" Dynamic AMOLED 2X 120Hz'],
      ['RAM', '12GB'],
      ['Storage', '256GB'],
      ['Camera', '13MP + 8MP Rear, 12MP + 12MP Front'],
      ['Battery', '11200 mAh'],
      ['S Pen', 'Included'],
      ['IP Rating', 'IP68'],
    ]),
  },

  // ─── Accessories ─────────────────────────────────────────────────────────────
  {
    name: 'Apple AirPods Pro (2nd Gen)',
    description:
      'AirPods Pro 2nd generation feature the H2 chip with up to 2x more Active Noise Cancellation than the original AirPods Pro. Adaptive Transparency, Personalized Spatial Audio with head tracking, and up to 30 hours total battery with the MagSafe case.',
    price: 249.99,
    comparePrice: 279.99,
    category: 'accessories',
    brand: 'Apple',
    stock: 80,
    images: ['https://store.storeimages.cdn-apple.com/airpodspro2.jpg'],
    rating: 4.7,
    numReviews: 512,
    specs: new Map([
      ['Chip', 'Apple H2'],
      ['ANC', 'Active Noise Cancellation (2x improved)'],
      ['Battery (Buds)', 'Up to 6 hours'],
      ['Battery (Total)', 'Up to 30 hours with case'],
      ['Connectivity', 'Bluetooth 5.3'],
      ['Water Resistance', 'IPX4'],
      ['Charging', 'MagSafe / Lightning / Qi'],
      ['Find My', 'Yes'],
    ]),
  },
  {
    name: 'Sony WH-1000XM5',
    description:
      'The WH-1000XM5 headphones deliver Sony\'s best-ever noise cancellation using eight microphones and two processors. With 30-hour battery life, multipoint Bluetooth pairing, and Speak-to-Chat technology, these are the definitive wireless headphones.',
    price: 349.99,
    comparePrice: 399.99,
    category: 'accessories',
    brand: 'Sony',
    stock: 55,
    images: ['https://sony.com/wh1000xm5.jpg'],
    rating: 4.9,
    numReviews: 638,
    specs: new Map([
      ['Driver', '30mm Dynamic'],
      ['ANC', '8 Microphones + 2 Processors'],
      ['Battery', '30 hours (ANC on), 40 hours (ANC off)'],
      ['Quick Charge', '3 min charge = 3 hours playback'],
      ['Bluetooth', '5.2 Multipoint'],
      ['Codecs', 'SBC, AAC, LDAC'],
      ['Weight', '250g'],
      ['Foldable', 'Yes'],
    ]),
  },
];

const seedData = async () => {
  try {
    // Clear existing data
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Cleared existing data...');

    // Insert users (passwords already hashed above)
    const createdUsers = await User.insertMany(users);
    console.log(`Inserted ${createdUsers.length} users`);

    // Insert products
    const createdProducts = await Product.insertMany(products);
    console.log(`Inserted ${createdProducts.length} products`);

    console.log('\nSeed data loaded successfully!');
    console.log('Admin credentials:');
    console.log('  Email:    admin@electroshop.com');
    console.log('  Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error(`Seed error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
