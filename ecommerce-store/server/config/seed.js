const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const connectDB = require('./db');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

const sampleProducts = [
  {
    name: 'Wireless Mechanical Keyboard',
    description: 'Compact 75% mechanical keyboard with hot-swappable switches and RGB backlight.',
    price: 3499,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
    category: 'Electronics',
    brand: 'KeyForge',
    countInStock: 25
  },
  {
    name: 'Noise Cancelling Headphones',
    description: 'Over-ear wireless headphones with active noise cancellation and 30-hour battery life.',
    price: 5999,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    category: 'Electronics',
    brand: 'SonicWave',
    countInStock: 40
  },
  {
    name: 'Minimalist Analog Watch',
    description: 'Stainless steel case with genuine leather strap. Water resistant to 50m.',
    price: 2199,
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500',
    category: 'Accessories',
    brand: 'Chronotype',
    countInStock: 60
  },
  {
    name: 'Ergonomic Office Chair',
    description: 'Adjustable lumbar support, breathable mesh back, and 4D armrests.',
    price: 8999,
    image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=500',
    category: 'Furniture',
    brand: 'ErgoSeat',
    countInStock: 15
  },
  {
    name: 'Canvas Backpack',
    description: 'Water-resistant 20L canvas backpack with padded 15-inch laptop sleeve.',
    price: 1799,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
    category: 'Accessories',
    brand: 'TrailPack',
    countInStock: 80
  },
  {
    name: 'Smart Fitness Band',
    description: 'Heart rate tracking, sleep monitoring, and 7-day battery life fitness band.',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=500',
    category: 'Electronics',
    brand: 'PulseFit',
    countInStock: 100
  },
  {
    name: 'Stainless Steel Water Bottle',
    description: 'Double-wall vacuum insulated 1L bottle. Keeps drinks cold for 24 hours.',
    price: 799,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500',
    category: 'Home',
    brand: 'HydroCore',
    countInStock: 150
  },
  {
    name: 'Portable Bluetooth Speaker',
    description: 'IPX7 waterproof speaker with 360-degree sound and 12-hour playtime.',
    price: 2599,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
    category: 'Electronics',
    brand: 'BoomBox',
    countInStock: 55
  },
  {
    name: 'Ceramic Coffee Mug Set',
    description: 'Set of 4 handcrafted ceramic mugs, 350ml each, dishwasher safe.',
    price: 999,
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=500',
    category: 'Home',
    brand: 'ClayCraft',
    countInStock: 70
  },
  {
    name: 'Yoga Mat Pro',
    description: 'Extra-thick 6mm non-slip yoga mat with carrying strap.',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500',
    category: 'Fitness',
    brand: 'FlexZone',
    countInStock: 90
  },
  {
    name: 'Desk Lamp with Wireless Charger',
    description: 'LED desk lamp with adjustable brightness and built-in Qi wireless charging pad.',
    price: 1899,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500',
    category: 'Home',
    brand: 'LumenTech',
    countInStock: 35
  },
  {
    name: 'Sunglasses UV400',
    description: 'Polarized lenses with full UV400 protection and lightweight acetate frame.',
    price: 1399,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500',
    category: 'Accessories',
    brand: 'ShadeLine',
    countInStock: 65
  }
];

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Creating admin user...');
    const admin = await User.create({
      name: 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@example.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@12345',
      role: 'admin'
    });

    console.log('Creating demo customer...');
    await User.create({
      name: 'Demo Customer',
      email: 'customer@example.com',
      password: 'Customer@123',
      role: 'user'
    });

    console.log('Seeding products...');
    const productsWithCreator = sampleProducts.map((p) => ({ ...p, createdBy: admin._id }));
    await Product.insertMany(productsWithCreator);

    console.log('Seed complete!');
    console.log(`Admin login -> email: ${admin.email} / password: ${process.env.ADMIN_PASSWORD || 'Admin@12345'}`);
    console.log('Customer login -> email: customer@example.com / password: Customer@123');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
