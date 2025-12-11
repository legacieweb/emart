import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/emart';

const sampleProducts = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    category: 'Electronics',
    stock: 50,
    rating: 4.5,
    tags: ['wireless', 'bluetooth', 'headphones'],
    discount: 10
  },
  {
    name: 'Smart Watch Series 5',
    description: 'Advanced smartwatch with health monitoring, GPS, and water resistance.',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    category: 'Electronics',
    stock: 30,
    rating: 4.7,
    tags: ['smartwatch', 'fitness', 'gps'],
    discount: 15
  },
  {
    name: '4K Ultra HD Monitor',
    description: 'Professional-grade 4K monitor with HDR and wide color gamut.',
    price: 599.99,
    image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500',
    category: 'Electronics',
    stock: 20,
    rating: 4.6,
    tags: ['monitor', '4k', 'display'],
    discount: 8
  },
  {
    name: 'Mechanical Keyboard',
    description: 'RGB mechanical keyboard with customizable switches and programmable keys.',
    price: 159.99,
    image: 'https://images.unsplash.com/photo-1587829191301-a452f3a0e5e6?w=500',
    category: 'Electronics',
    stock: 35,
    rating: 4.4,
    tags: ['keyboard', 'mechanical', 'gaming'],
    discount: 12
  },
  {
    name: 'USB-C Fast Charger',
    description: '65W USB-C fast charger compatible with all modern devices.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500',
    category: 'Electronics',
    stock: 100,
    rating: 4.3,
    tags: ['charger', 'usb-c', 'fast charging'],
    discount: 5
  },
  {
    name: 'Wireless Charging Pad',
    description: 'Fast wireless charging pad for all Qi-enabled devices.',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1591089415919-b4f89f25c49e?w=500',
    category: 'Electronics',
    stock: 55,
    rating: 4.2,
    tags: ['wireless', 'charging', 'qi'],
    discount: 10
  },
  {
    name: '4K Webcam',
    description: 'Professional 4K webcam with auto-focus and built-in microphone.',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1598898657862-f92d300204e0?w=500',
    category: 'Electronics',
    stock: 40,
    rating: 4.5,
    tags: ['webcam', '4k', 'streaming'],
    discount: 7
  },
  {
    name: 'Portable SSD 1TB',
    description: 'Ultra-fast portable SSD with 1TB capacity and USB-C connection.',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500',
    category: 'Electronics',
    stock: 60,
    rating: 4.6,
    tags: ['ssd', 'storage', 'portable'],
    discount: 9
  },
  {
    name: 'Bluetooth Speaker',
    description: '360-degree sound Bluetooth speaker with waterproof design.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1589003077984-894e133da26d?w=500',
    category: 'Electronics',
    stock: 70,
    rating: 4.4,
    tags: ['speaker', 'bluetooth', 'waterproof'],
    discount: 6
  },
  {
    name: 'Laptop Stand',
    description: 'Adjustable aluminum laptop stand for better ergonomics.',
    price: 69.99,
    image: 'https://images.unsplash.com/photo-1600299981435-5c2aef5b51f9?w=500',
    category: 'Electronics',
    stock: 45,
    rating: 4.3,
    tags: ['laptop', 'stand', 'ergonomic'],
    discount: 8
  },
  {
    name: 'Cooling Pad for Laptop',
    description: 'Efficient cooling pad with dual fans for gaming laptops.',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1588872657840-18ade68ba7a7?w=500',
    category: 'Electronics',
    stock: 50,
    rating: 4.2,
    tags: ['cooling', 'laptop', 'gaming'],
    discount: 10
  },
  {
    name: 'HDMI Cable 2.1',
    description: 'High-speed HDMI 2.1 cable for 8K resolution support.',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1595225476933-13fae480d811?w=500',
    category: 'Electronics',
    stock: 150,
    rating: 4.1,
    tags: ['hdmi', 'cable', '2.1'],
    discount: 5
  },
  {
    name: 'USB Hub with Power Delivery',
    description: 'Multi-port USB hub with PD support and fast charging.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1597974827190-9cfe44fa34e9?w=500',
    category: 'Electronics',
    stock: 60,
    rating: 4.4,
    tags: ['hub', 'usb', 'charging'],
    discount: 12
  },
  {
    name: 'Wireless Mouse',
    description: 'Silent wireless mouse with precision tracking and long battery life.',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500',
    category: 'Electronics',
    stock: 85,
    rating: 4.3,
    tags: ['mouse', 'wireless', 'silent'],
    discount: 8
  },
  {
    name: 'Mechanical Mouse Pad',
    description: 'Large mechanical mouse pad with precision surface for gaming.',
    price: 44.99,
    image: 'https://images.unsplash.com/photo-1600299981435-5c2aef5b51f9?w=500',
    category: 'Electronics',
    stock: 75,
    rating: 4.2,
    tags: ['mousepad', 'gaming', 'mechanical'],
    discount: 7
  },
  {
    name: 'Desk Lamp with USB',
    description: 'LED desk lamp with USB charging port and adjustable brightness.',
    price: 54.99,
    image: 'https://images.unsplash.com/photo-1565636192335-14c46fa1120f?w=500',
    category: 'Electronics',
    stock: 65,
    rating: 4.3,
    tags: ['lamp', 'led', 'usb'],
    discount: 10
  },
  {
    name: 'Phone Stand',
    description: 'Adjustable phone stand compatible with all smartphones.',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500',
    category: 'Electronics',
    stock: 120,
    rating: 4.1,
    tags: ['stand', 'phone', 'adjustable'],
    discount: 5
  },
  {
    name: 'Cable Organizer Set',
    description: 'Complete cable management system for organized workspace.',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1597974827190-9cfe44fa34e9?w=500',
    category: 'Electronics',
    stock: 100,
    rating: 4.0,
    tags: ['organizer', 'cable', 'management'],
    discount: 6
  },
  {
    name: 'Screen Protector Pack',
    description: 'Pack of 3 tempered glass screen protectors.',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500',
    category: 'Electronics',
    stock: 200,
    rating: 4.2,
    tags: ['protector', 'glass', 'screen'],
    discount: 8
  },
  {
    name: 'Gaming Headset Pro',
    description: 'Professional gaming headset with 7.1 surround sound.',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    category: 'Electronics',
    stock: 35,
    rating: 4.7,
    tags: ['headset', 'gaming', 'surround'],
    discount: 15
  },
  {
    name: 'Cotton T-Shirt',
    description: 'Comfortable 100% cotton t-shirt available in multiple colors.',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    category: 'Fashion',
    stock: 100,
    rating: 4.2,
    tags: ['cotton', 't-shirt', 'casual'],
    discount: 0
  },
  {
    name: 'Denim Jeans',
    description: 'Classic blue denim jeans with comfortable fit and style.',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=500',
    category: 'Fashion',
    stock: 80,
    rating: 4.4,
    tags: ['denim', 'jeans', 'classic'],
    discount: 10
  },
  {
    name: 'Casual Polo Shirt',
    description: 'Premium polo shirt perfect for casual and semi-formal occasions.',
    price: 44.99,
    image: 'https://images.unsplash.com/photo-1579389950125-4a6675174ecf?w=500',
    category: 'Fashion',
    stock: 70,
    rating: 4.3,
    tags: ['polo', 'casual', 'shirt'],
    discount: 8
  },
  {
    name: 'Winter Jacket',
    description: 'Warm and stylish winter jacket with water-resistant fabric.',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=500',
    category: 'Fashion',
    stock: 45,
    rating: 4.6,
    tags: ['jacket', 'winter', 'warm'],
    discount: 15
  },
  {
    name: 'Summer Dress',
    description: 'Light and breathable summer dress perfect for warm weather.',
    price: 54.99,
    image: 'https://images.unsplash.com/photo-1595777712802-fde52da27c50?w=500',
    category: 'Fashion',
    stock: 60,
    rating: 4.3,
    tags: ['dress', 'summer', 'light'],
    discount: 12
  },
  {
    name: 'Sports Shorts',
    description: 'Breathable sports shorts made from quick-dry material.',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500',
    category: 'Fashion',
    stock: 90,
    rating: 4.2,
    tags: ['shorts', 'sports', 'breathable'],
    discount: 10
  },
  {
    name: 'Hoodie Sweatshirt',
    description: 'Comfortable and cozy hoodie sweatshirt for everyday wear.',
    price: 64.99,
    image: 'https://images.unsplash.com/photo-1556821840-a63b9b7e4f2e?w=500',
    category: 'Fashion',
    stock: 75,
    rating: 4.4,
    tags: ['hoodie', 'sweatshirt', 'cozy'],
    discount: 10
  },
  {
    name: 'Formal Shirt',
    description: 'Professional formal shirt perfect for business occasions.',
    price: 74.99,
    image: 'https://images.unsplash.com/photo-1574180045827-48cf960f6312?w=500',
    category: 'Fashion',
    stock: 55,
    rating: 4.5,
    tags: ['formal', 'shirt', 'business'],
    discount: 8
  },
  {
    name: 'Leather Belt',
    description: 'Premium leather belt with adjustable fit and durable buckle.',
    price: 44.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
    category: 'Fashion',
    stock: 85,
    rating: 4.3,
    tags: ['belt', 'leather', 'premium'],
    discount: 12
  },
  {
    name: 'Cotton Socks Pack',
    description: 'Pack of 5 pairs of comfortable cotton socks.',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1614707267537-b85faf00021e?w=500',
    category: 'Fashion',
    stock: 150,
    rating: 4.1,
    tags: ['socks', 'cotton', 'pack'],
    discount: 5
  },
  {
    name: 'Baseball Cap',
    description: 'Classic baseball cap with adjustable strap and UV protection.',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1614707267537-b85faf00021e?w=500',
    category: 'Fashion',
    stock: 95,
    rating: 4.2,
    tags: ['cap', 'baseball', 'uv'],
    discount: 10
  },
  {
    name: 'Wool Scarf',
    description: 'Soft wool scarf perfect for winter fashion and warmth.',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1554616993-11af8e4a1e84?w=500',
    category: 'Fashion',
    stock: 65,
    rating: 4.3,
    tags: ['scarf', 'wool', 'winter'],
    discount: 8
  },
  {
    name: 'Sunglasses',
    description: 'UV-protected sunglasses with stylish design and quality lenses.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500',
    category: 'Fashion',
    stock: 70,
    rating: 4.4,
    tags: ['sunglasses', 'uv', 'style'],
    discount: 15
  },
  {
    name: 'Swimsuit',
    description: 'Comfortable and stylish swimsuit for beach and pool.',
    price: 54.99,
    image: 'https://images.unsplash.com/photo-1614707267537-b85faf00021e?w=500',
    category: 'Fashion',
    stock: 50,
    rating: 4.2,
    tags: ['swimsuit', 'beach', 'style'],
    discount: 12
  },
  {
    name: 'Cardigan',
    description: 'Versatile cardigan perfect for layering in any season.',
    price: 69.99,
    image: 'https://images.unsplash.com/photo-1551557092-5a40503264df?w=500',
    category: 'Fashion',
    stock: 60,
    rating: 4.3,
    tags: ['cardigan', 'layering', 'versatile'],
    discount: 10
  },
  {
    name: 'Leggings',
    description: 'High-waist leggings with excellent stretch and support.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1506629082632-11c279e20622?w=500',
    category: 'Fashion',
    stock: 85,
    rating: 4.3,
    tags: ['leggings', 'stretch', 'support'],
    discount: 10
  },
  {
    name: 'Blazer',
    description: 'Professional blazer for business and formal occasions.',
    price: 119.99,
    image: 'https://images.unsplash.com/photo-1591047990373-cee8eda773e3?w=500',
    category: 'Fashion',
    stock: 40,
    rating: 4.5,
    tags: ['blazer', 'professional', 'formal'],
    discount: 15
  },
  {
    name: 'Modern Sofa Set',
    description: 'Elegant 3-piece sofa set perfect for modern living rooms.',
    price: 899.99,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500',
    category: 'Home',
    stock: 15,
    rating: 4.8,
    tags: ['sofa', 'furniture', 'modern'],
    discount: 20
  },
  {
    name: 'Dining Table',
    description: 'Spacious wooden dining table for family gatherings.',
    price: 449.99,
    image: 'https://images.unsplash.com/photo-1551180328-0b52f4da6849?w=500',
    category: 'Home',
    stock: 20,
    rating: 4.7,
    tags: ['table', 'dining', 'wood'],
    discount: 18
  },
  {
    name: 'Bed Frame',
    description: 'Sturdy bed frame with modern design and excellent support.',
    price: 349.99,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500',
    category: 'Home',
    stock: 25,
    rating: 4.6,
    tags: ['bed', 'frame', 'modern'],
    discount: 15
  },
  {
    name: 'Coffee Table',
    description: 'Stylish coffee table with glass top and wooden base.',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500',
    category: 'Home',
    stock: 35,
    rating: 4.5,
    tags: ['table', 'coffee', 'glass'],
    discount: 12
  },
  {
    name: 'Bookshelf',
    description: 'Modern bookshelf with multiple compartments for storage.',
    price: 229.99,
    image: 'https://images.unsplash.com/photo-1565182999555-022aae28a17e?w=500',
    category: 'Home',
    stock: 30,
    rating: 4.4,
    tags: ['shelf', 'storage', 'modern'],
    discount: 10
  },
  {
    name: 'Desk',
    description: 'Spacious work desk perfect for office or home use.',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1554995207-c18210cc9105?w=500',
    category: 'Home',
    stock: 28,
    rating: 4.5,
    tags: ['desk', 'office', 'work'],
    discount: 14
  },
  {
    name: 'Office Chair',
    description: 'Ergonomic office chair with lumbar support and adjustable height.',
    price: 279.99,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500',
    category: 'Home',
    stock: 32,
    rating: 4.6,
    tags: ['chair', 'office', 'ergonomic'],
    discount: 12
  },
  {
    name: 'Curtains',
    description: 'Elegant curtains with blackout feature for better sleep.',
    price: 74.99,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
    category: 'Home',
    stock: 50,
    rating: 4.3,
    tags: ['curtains', 'blackout', 'elegant'],
    discount: 8
  },
  {
    name: 'Area Rug',
    description: 'Soft area rug with beautiful patterns and durable material.',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1572879260110-670e87ab8266?w=500',
    category: 'Home',
    stock: 45,
    rating: 4.4,
    tags: ['rug', 'area', 'soft'],
    discount: 10
  },
  {
    name: 'Wall Art Set',
    description: 'Set of 3 modern wall art prints for home decoration.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1591988081403-8f5ce5588fe3?w=500',
    category: 'Home',
    stock: 60,
    rating: 4.2,
    tags: ['art', 'wall', 'decor'],
    discount: 10
  },
  {
    name: 'Desk Lamp',
    description: 'LED desk lamp with adjustable brightness and USB port.',
    price: 54.99,
    image: 'https://images.unsplash.com/photo-1565636192335-14c46fa1120f?w=500',
    category: 'Home',
    stock: 65,
    rating: 4.3,
    tags: ['lamp', 'led', 'desk'],
    discount: 10
  },
  {
    name: 'Wall Clock',
    description: 'Modern wall clock with silent movement and elegant design.',
    price: 44.99,
    image: 'https://images.unsplash.com/photo-1533789409251-8bc6f303a8cd?w=500',
    category: 'Home',
    stock: 75,
    rating: 4.2,
    tags: ['clock', 'wall', 'modern'],
    discount: 8
  },
  {
    name: 'Throw Pillows',
    description: 'Set of 2 decorative throw pillows with premium fabric.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=500',
    category: 'Home',
    stock: 85,
    rating: 4.3,
    tags: ['pillows', 'decor', 'comfort'],
    discount: 10
  },
  {
    name: 'Bookends',
    description: 'Decorative bookends to organize and display your books.',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1577720643272-265f434d6b5c?w=500',
    category: 'Home',
    stock: 70,
    rating: 4.1,
    tags: ['bookends', 'decor', 'organization'],
    discount: 8
  },
  {
    name: 'Plant Pot',
    description: 'Ceramic plant pot perfect for indoor and outdoor plants.',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1524634126289-baea1f0b5e24?w=500',
    category: 'Home',
    stock: 90,
    rating: 4.2,
    tags: ['pot', 'plant', 'ceramic'],
    discount: 10
  },
  {
    name: 'Mirror',
    description: 'Large decorative mirror with elegant frame design.',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500',
    category: 'Home',
    stock: 40,
    rating: 4.3,
    tags: ['mirror', 'decor', 'frame'],
    discount: 10
  },
  {
    name: 'Skincare Cream',
    description: 'Hydrating facial cream with natural ingredients for all skin types.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
    category: 'Beauty',
    stock: 75,
    rating: 4.3,
    tags: ['skincare', 'cream', 'natural'],
    discount: 5
  },
  {
    name: 'Face Serum',
    description: 'Lightweight face serum with vitamins and antioxidants.',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
    category: 'Beauty',
    stock: 65,
    rating: 4.4,
    tags: ['serum', 'face', 'vitamins'],
    discount: 8
  },
  {
    name: 'Moisturizer SPF 50',
    description: 'Daily moisturizer with SPF 50 sun protection.',
    price: 54.99,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
    category: 'Beauty',
    stock: 70,
    rating: 4.5,
    tags: ['moisturizer', 'spf', 'sun'],
    discount: 10
  },
  {
    name: 'Facial Cleanser',
    description: 'Gentle facial cleanser suitable for all skin types.',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
    category: 'Beauty',
    stock: 85,
    rating: 4.2,
    tags: ['cleanser', 'facial', 'gentle'],
    discount: 8
  },
  {
    name: 'Face Mask',
    description: 'Hydrating face mask for weekly skincare routine.',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
    category: 'Beauty',
    stock: 80,
    rating: 4.3,
    tags: ['mask', 'hydrating', 'skincare'],
    discount: 10
  },
  {
    name: 'Lip Balm',
    description: 'Moisturizing lip balm with natural beeswax and oil.',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
    category: 'Beauty',
    stock: 120,
    rating: 4.1,
    tags: ['lip balm', 'moisturizing', 'natural'],
    discount: 5
  },
  {
    name: 'Eye Cream',
    description: 'Anti-aging eye cream for fine lines and dark circles.',
    price: 44.99,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
    category: 'Beauty',
    stock: 60,
    rating: 4.4,
    tags: ['eye cream', 'anti-aging', 'circles'],
    discount: 8
  },
  {
    name: 'Body Lotion',
    description: 'Nourishing body lotion with shea butter and almond oil.',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
    category: 'Beauty',
    stock: 75,
    rating: 4.3,
    tags: ['lotion', 'body', 'nourishing'],
    discount: 10
  },
  {
    name: 'Hair Shampoo',
    description: 'Gentle hair shampoo for daily cleansing and shine.',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
    category: 'Beauty',
    stock: 90,
    rating: 4.2,
    tags: ['shampoo', 'hair', 'gentle'],
    discount: 8
  },
  {
    name: 'Hair Conditioner',
    description: 'Nourishing hair conditioner for soft and silky hair.',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
    category: 'Beauty',
    stock: 85,
    rating: 4.2,
    tags: ['conditioner', 'hair', 'nourishing'],
    discount: 8
  },
  {
    name: 'Hair Mask',
    description: 'Deep conditioning hair mask for weekly treatment.',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
    category: 'Beauty',
    stock: 65,
    rating: 4.3,
    tags: ['mask', 'hair', 'conditioning'],
    discount: 10
  },
  {
    name: 'Makeup Foundation',
    description: 'Long-lasting foundation with SPF protection.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
    category: 'Beauty',
    stock: 70,
    rating: 4.4,
    tags: ['foundation', 'makeup', 'spf'],
    discount: 10
  },
  {
    name: 'Lipstick',
    description: 'Matte lipstick available in various colors with long-lasting formula.',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
    category: 'Beauty',
    stock: 100,
    rating: 4.2,
    tags: ['lipstick', 'makeup', 'matte'],
    discount: 8
  },
  {
    name: 'Eye Shadow Palette',
    description: '12-color eye shadow palette with blendable formula.',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
    category: 'Beauty',
    stock: 75,
    rating: 4.3,
    tags: ['eyeshadow', 'palette', 'makeup'],
    discount: 10
  },
  {
    name: 'Mascara',
    description: 'Volumizing mascara for dramatic lashes.',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
    category: 'Beauty',
    stock: 95,
    rating: 4.2,
    tags: ['mascara', 'makeup', 'volume'],
    discount: 8
  },
  {
    name: 'Yoga Mat',
    description: 'Non-slip yoga mat with carrying strap, perfect for home workouts.',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500',
    category: 'Sports',
    stock: 60,
    rating: 4.4,
    tags: ['yoga', 'fitness', 'mat'],
    discount: 0
  },
  {
    name: 'Running Shoes',
    description: 'Lightweight running shoes with advanced cushioning technology.',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    category: 'Sports',
    stock: 35,
    rating: 4.5,
    tags: ['running', 'shoes', 'athletic'],
    discount: 15
  },
  {
    name: 'Dumbbell Set',
    description: 'Adjustable dumbbell set with 5-25 lb weights.',
    price: 159.99,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500',
    category: 'Sports',
    stock: 30,
    rating: 4.6,
    tags: ['dumbbell', 'weights', 'fitness'],
    discount: 12
  },
  {
    name: 'Resistance Bands Set',
    description: 'Set of 5 resistance bands with varying resistance levels.',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1538805060514-97d3aa1f57d7?w=500',
    category: 'Sports',
    stock: 75,
    rating: 4.3,
    tags: ['bands', 'resistance', 'fitness'],
    discount: 10
  },
  {
    name: 'Jump Rope',
    description: 'Speed jump rope with ball bearings for smooth rotation.',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=500',
    category: 'Sports',
    stock: 90,
    rating: 4.2,
    tags: ['rope', 'jump', 'cardio'],
    discount: 8
  },
  {
    name: 'Push-Up Bars',
    description: 'Ergonomic push-up bars for safer and deeper push-ups.',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=500',
    category: 'Sports',
    stock: 80,
    rating: 4.1,
    tags: ['bars', 'pushup', 'strength'],
    discount: 8
  },
  {
    name: 'Ab Roller',
    description: 'Core trainer ab roller for abdominal muscle exercises.',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=500',
    category: 'Sports',
    stock: 65,
    rating: 4.2,
    tags: ['roller', 'ab', 'core'],
    discount: 10
  },
  {
    name: 'Kettlebell',
    description: '20 lb kettlebell for strength and conditioning workouts.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500',
    category: 'Sports',
    stock: 55,
    rating: 4.3,
    tags: ['kettlebell', 'weight', 'strength'],
    discount: 10
  },
  {
    name: 'Foam Roller',
    description: 'Muscle recovery foam roller for myofascial release.',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=500',
    category: 'Sports',
    stock: 70,
    rating: 4.4,
    tags: ['roller', 'foam', 'recovery'],
    discount: 10
  },
  {
    name: 'Exercise Bike',
    description: 'Stationary exercise bike for indoor cardio workouts.',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500',
    category: 'Sports',
    stock: 20,
    rating: 4.7,
    tags: ['bike', 'exercise', 'cardio'],
    discount: 15
  },
  {
    name: 'Treadmill',
    description: 'Motorized treadmill with adjustable speed and incline.',
    price: 499.99,
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500',
    category: 'Sports',
    stock: 15,
    rating: 4.8,
    tags: ['treadmill', 'running', 'cardio'],
    discount: 20
  },
  {
    name: 'Weight Bench',
    description: 'Adjustable weight bench for strength training exercises.',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=500',
    category: 'Sports',
    stock: 25,
    rating: 4.5,
    tags: ['bench', 'weight', 'strength'],
    discount: 12
  },
  {
    name: 'Yoga Blocks',
    description: 'Set of 2 yoga blocks for improved alignment and support.',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500',
    category: 'Sports',
    stock: 85,
    rating: 4.2,
    tags: ['blocks', 'yoga', 'support'],
    discount: 8
  },
  {
    name: 'Sports Water Bottle',
    description: 'Insulated sports water bottle with 24-hour cold retention.',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500',
    category: 'Sports',
    stock: 100,
    rating: 4.3,
    tags: ['bottle', 'water', 'insulated'],
    discount: 10
  },
  {
    name: 'Sports Bag',
    description: 'Spacious sports bag with multiple compartments.',
    price: 54.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
    category: 'Sports',
    stock: 65,
    rating: 4.2,
    tags: ['bag', 'sports', 'compartments'],
    discount: 10
  },
  {
    name: 'Gym Gloves',
    description: 'Weight lifting gym gloves with wrist support.',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=500',
    category: 'Sports',
    stock: 75,
    rating: 4.1,
    tags: ['gloves', 'gym', 'lifting'],
    discount: 8
  },
  {
    name: 'Programming Book',
    description: 'Comprehensive guide to modern web development with practical examples.',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500',
    category: 'Books',
    stock: 40,
    rating: 4.6,
    tags: ['programming', 'web development', 'book'],
    discount: 10
  },
  {
    name: 'JavaScript Mastery',
    description: 'Master JavaScript with advanced concepts and practical projects.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500',
    category: 'Books',
    stock: 50,
    rating: 4.5,
    tags: ['javascript', 'programming', 'mastery'],
    discount: 12
  },
  {
    name: 'React Guide',
    description: 'Complete React.js guide for building modern web applications.',
    price: 54.99,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500',
    category: 'Books',
    stock: 45,
    rating: 4.4,
    tags: ['react', 'web', 'guide'],
    discount: 10
  },
  {
    name: 'Python Basics',
    description: 'Beginner-friendly Python programming book with examples.',
    price: 44.99,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500',
    category: 'Books',
    stock: 55,
    rating: 4.3,
    tags: ['python', 'programming', 'basics'],
    discount: 10
  },
  {
    name: 'Database Design',
    description: 'Essential guide to database design and optimization.',
    price: 64.99,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500',
    category: 'Books',
    stock: 35,
    rating: 4.5,
    tags: ['database', 'design', 'sql'],
    discount: 8
  },
  {
    name: 'Clean Code',
    description: 'How to write clean, maintainable code for professional projects.',
    price: 54.99,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500',
    category: 'Books',
    stock: 45,
    rating: 4.6,
    tags: ['clean code', 'best practices', 'programming'],
    discount: 12
  },
  {
    name: 'Design Patterns',
    description: 'Comprehensive guide to software design patterns.',
    price: 69.99,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500',
    category: 'Books',
    stock: 30,
    rating: 4.5,
    tags: ['patterns', 'design', 'software'],
    discount: 10
  },
  {
    name: 'Web Security',
    description: 'Essential guide to web security and protection techniques.',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500',
    category: 'Books',
    stock: 40,
    rating: 4.7,
    tags: ['security', 'web', 'protection'],
    discount: 10
  },
  {
    name: 'Agile Development',
    description: 'Learn Agile methodologies for effective project management.',
    price: 54.99,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500',
    category: 'Books',
    stock: 50,
    rating: 4.4,
    tags: ['agile', 'methodology', 'management'],
    discount: 10
  },
  {
    name: 'Node.js Advanced',
    description: 'Advanced Node.js techniques for building scalable applications.',
    price: 64.99,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500',
    category: 'Books',
    stock: 35,
    rating: 4.6,
    tags: ['nodejs', 'advanced', 'backend'],
    discount: 12
  },
  {
    name: 'Artificial Intelligence',
    description: 'Introduction to AI concepts and machine learning basics.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500',
    category: 'Books',
    stock: 25,
    rating: 4.5,
    tags: ['ai', 'machine learning', 'tech'],
    discount: 10
  },
  {
    name: 'Cloud Computing',
    description: 'Guide to cloud computing platforms and deployment strategies.',
    price: 69.99,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500',
    category: 'Books',
    stock: 30,
    rating: 4.4,
    tags: ['cloud', 'computing', 'deployment'],
    discount: 8
  },
  {
    name: 'Mobile Development',
    description: 'Build mobile applications with React Native.',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500',
    category: 'Books',
    stock: 40,
    rating: 4.5,
    tags: ['mobile', 'react native', 'development'],
    discount: 10
  },
  {
    name: 'Building Blocks Set',
    description: 'Creative building blocks set for children aged 3-8 years.',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=500',
    category: 'Toys',
    stock: 80,
    rating: 4.1,
    tags: ['building blocks', 'educational', 'kids'],
    discount: 0
  },
  {
    name: 'Action Figures Set',
    description: 'Set of 10 action figures with detailed accessories.',
    price: 44.99,
    image: 'https://images.unsplash.com/photo-1570303995763-49d13d9f4e76?w=500',
    category: 'Toys',
    stock: 65,
    rating: 4.3,
    tags: ['figures', 'toys', 'action'],
    discount: 10
  },
  {
    name: 'Puzzle Game',
    description: '1000-piece jigsaw puzzle with beautiful landscape image.',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1531726735995-170e2d6ea9d9?w=500',
    category: 'Toys',
    stock: 85,
    rating: 4.2,
    tags: ['puzzle', 'game', 'brain'],
    discount: 8
  },
  {
    name: 'Board Game',
    description: 'Popular strategy board game for family fun and entertainment.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=500',
    category: 'Toys',
    stock: 55,
    rating: 4.4,
    tags: ['board game', 'family', 'strategy'],
    discount: 12
  },
  {
    name: 'Remote Control Car',
    description: 'Fast RC car with rechargeable battery and remote control.',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1552068751-06dff84a5c89?w=500',
    category: 'Toys',
    stock: 50,
    rating: 4.3,
    tags: ['rc car', 'remote', 'toy'],
    discount: 10
  },
  {
    name: 'Drone Quadcopter',
    description: 'Beginner-friendly drone with 4K camera and stabilization.',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1522149519271-40bda5ceb516?w=500',
    category: 'Toys',
    stock: 25,
    rating: 4.6,
    tags: ['drone', 'quadcopter', 'camera'],
    discount: 15
  },
  {
    name: 'Teddy Bear',
    description: 'Soft and cuddly teddy bear perfect for children.',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1572881294218-25c0ceab2d23?w=500',
    category: 'Toys',
    stock: 100,
    rating: 4.2,
    tags: ['teddy', 'bear', 'plush'],
    discount: 10
  },
  {
    name: 'Educational Robot',
    description: 'Programmable robot for learning coding and robotics.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1561625990-a96dedd8c18d?w=500',
    category: 'Toys',
    stock: 35,
    rating: 4.5,
    tags: ['robot', 'coding', 'educational'],
    discount: 12
  },
  {
    name: 'Art Supplies Set',
    description: 'Complete art supplies set with markers, pencils, and colors.',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500',
    category: 'Toys',
    stock: 70,
    rating: 4.2,
    tags: ['art', 'supplies', 'colors'],
    discount: 10
  },
  {
    name: 'Science Kit',
    description: 'STEM science kit for conducting fun experiments at home.',
    price: 54.99,
    image: 'https://images.unsplash.com/photo-1533519227268-7f4ee4ce146e?w=500',
    category: 'Toys',
    stock: 60,
    rating: 4.4,
    tags: ['science', 'stem', 'kit'],
    discount: 10
  },
  {
    name: 'Construction Set',
    description: 'Advanced construction set for building complex structures.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=500',
    category: 'Toys',
    stock: 40,
    rating: 4.3,
    tags: ['construction', 'building', 'advanced'],
    discount: 12
  },
  {
    name: 'Action Camera',
    description: '4K action camera with waterproof design for adventures.',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1617638924702-92d37a439220?w=500',
    category: 'Toys',
    stock: 30,
    rating: 4.6,
    tags: ['camera', 'action', 'adventure'],
    discount: 15
  },
  {
    name: 'Game Console',
    description: 'Popular game console with hundreds of games available.',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1538481143481-c8733cce57f7?w=500',
    category: 'Toys',
    stock: 20,
    rating: 4.7,
    tags: ['console', 'gaming', 'entertainment'],
    discount: 18
  },
  {
    name: 'Doll House',
    description: 'Beautiful dollhouse with detailed furniture and accessories.',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500',
    category: 'Toys',
    stock: 25,
    rating: 4.3,
    tags: ['dollhouse', 'doll', 'play'],
    discount: 10
  },
  {
    name: 'Kids Bike',
    description: 'Colorful kids bike with training wheels and safety features.',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1543636331-b2be470ebc6e?w=500',
    category: 'Toys',
    stock: 35,
    rating: 4.4,
    tags: ['bike', 'kids', 'transport'],
    discount: 12
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    const products = await Product.insertMany(sampleProducts);
    console.log(`Seeded ${products.length} products successfully`);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

seedDatabase();