const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Product = require('./models/Product');
const User = require('./models/User');
const Blog = require('./models/Blog');

require('dotenv').config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    await Blog.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@ybt.com',
      password: hashedPassword,
      isAdmin: true
    });
    
    await adminUser.save();
    console.log('Admin user created');

    // Create sample products
    const products = [
      {
        name: 'Classic White T-Shirt',
        category: 'Men',
        price: 29.99,
        discountPrice: 19.99,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['White', 'Black', 'Gray', 'Navy'],
        description: 'A timeless classic that every wardrobe needs. Made from 100% premium cotton for ultimate comfort and durability.',
        image: 'https://via.placeholder.com/400x400/ffffff/000000?text=White+T-Shirt'
      },
      {
        name: 'Vintage Band Tee',
        category: 'Men',
        price: 39.99,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Black', 'White'],
        description: 'Show off your music taste with our vintage-inspired band t-shirts. Soft, comfortable, and full of attitude.',
        image: 'https://via.placeholder.com/400x400/000000/ffffff?text=Band+Tee'
      },
      {
        name: 'Floral Summer Dress',
        category: 'Women',
        price: 59.99,
        discountPrice: 49.99,
        sizes: ['S', 'M', 'L'],
        colors: ['Pink', 'Blue', 'Yellow'],
        description: 'Perfect for summer days, this floral dress combines comfort with style. Made from breathable fabric.',
        image: 'https://via.placeholder.com/400x400/ffc0cb/000000?text=Floral+Dress'
      },
      {
        name: 'Graphic Print T-Shirt',
        category: 'Women',
        price: 34.99,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['White', 'Black', 'Pink'],
        description: 'Express yourself with our unique graphic prints. Each design is carefully crafted to make a statement.',
        image: 'https://via.placeholder.com/400x400/ffffff/000000?text=Graphic+Tee'
      },
      {
        name: 'Superhero Kids T-Shirt',
        category: 'Boys',
        price: 24.99,
        sizes: ['S', 'M', 'L'],
        colors: ['Red', 'Blue', 'Green'],
        description: 'Let your little one feel like a superhero with these fun and colorful t-shirts made just for kids.',
        image: 'https://via.placeholder.com/400x400/ff0000/ffffff?text=Superhero+Tee'
      },
      {
        name: 'Cartoon Print T-Shirt',
        category: 'Boys',
        price: 22.99,
        sizes: ['S', 'M', 'L'],
        colors: ['Yellow', 'Green', 'Orange'],
        description: 'Fun and colorful cartoon prints that kids will love. Made from soft, child-friendly materials.',
        image: 'https://via.placeholder.com/400x400/ffff00/000000?text=Cartoon+Tee'
      },
      {
        name: 'Polo Shirt Classic',
        category: 'Men',
        price: 49.99,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Navy', 'White', 'Black', 'Green'],
        description: 'A sophisticated polo shirt perfect for both casual and semi-formal occasions. Premium quality fabric.',
        image: 'https://via.placeholder.com/400x400/000080/ffffff?text=Polo+Shirt'
      },
      {
        name: 'Striped Long Sleeve',
        category: 'Women',
        price: 44.99,
        discountPrice: 34.99,
        sizes: ['S', 'M', 'L'],
        colors: ['Blue/White', 'Black/White'],
        description: 'Classic striped design meets modern comfort. Perfect for layering or wearing on its own.',
        image: 'https://via.placeholder.com/400x400/0000ff/ffffff?text=Striped+Shirt'
      },
      {
        name: 'Sports Jersey',
        category: 'Boys',
        price: 29.99,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Red', 'Blue', 'Green', 'Yellow'],
        description: 'Get your little athlete ready for the game with these comfortable and durable sports jerseys.',
        image: 'https://via.placeholder.com/400x400/ff6b6b/ffffff?text=Sports+Jersey'
      },
      {
        name: 'Minimalist Tee',
        category: 'Men',
        price: 32.99,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['White', 'Black', 'Gray', 'Navy'],
        description: 'Less is more with our minimalist t-shirt collection. Clean lines and premium materials.',
        image: 'https://via.placeholder.com/400x400/f0f0f0/000000?text=Minimalist+Tee'
      },
      {
        name: 'Bohemian Style Top',
        category: 'Women',
        price: 54.99,
        sizes: ['S', 'M', 'L'],
        colors: ['Brown', 'Cream', 'Terracotta'],
        description: 'Embrace your free spirit with our bohemian-inspired tops. Perfect for festivals and casual outings.',
        image: 'https://via.placeholder.com/400x400/d2691e/ffffff?text=Boho+Top'
      },
      {
        name: 'Adventure Kids Tee',
        category: 'Boys',
        price: 26.99,
        sizes: ['S', 'M', 'L'],
        colors: ['Green', 'Blue', 'Orange'],
        description: 'For the little adventurer! These t-shirts feature fun exploration and nature themes.',
        image: 'https://via.placeholder.com/400x400/228b22/ffffff?text=Adventure+Tee'
      }
    ];

    await Product.insertMany(products);
    console.log('Sample products created');

    // Create sample blogs
    const blogs = [
      {
        title: '5 Essential T-Shirts Every Wardrobe Needs',
        content: 'A great t-shirt is the foundation of any wardrobe. In this article, we explore the five essential t-shirt styles that every person should own. From the classic white tee to the perfect striped shirt, we\'ll help you build a versatile collection that works for any occasion.\n\nThe classic white t-shirt is perhaps the most versatile piece of clothing you can own. It can be dressed up with a blazer for a business casual look or dressed down with jeans for a weekend outing. Look for quality cotton that holds its shape and doesn\'t become transparent over time.\n\nThe striped t-shirt adds visual interest while remaining timeless. Horizontal stripes can create a flattering silhouette, and the nautical-inspired design works well with denim, chinos, or skirts.\n\nThe graphic tee allows you to express your personality and interests. Whether you prefer band logos, artistic designs, or clever slogans, a well-chosen graphic tee can become a conversation starter.\n\nThe black t-shirt is the white tee\'s sophisticated cousin. It\'s slimming, versatile, and can be easily dressed up or down. Like the white tee, quality is key – look for a rich black color that won\'t fade.\n\nFinally, the polo shirt bridges the gap between casual and formal. Perfect for summer events, business casual offices, or when you want to look put-together without being too formal.',
        author: adminUser._id,
        image: 'https://via.placeholder.com/800x400/333333/ffffff?text=Essential+T-Shirts'
      },
      {
        title: 'Sustainable Fashion: Choosing Eco-Friendly T-Shirts',
        content: 'As consumers become more environmentally conscious, the fashion industry is responding with sustainable options. This guide explores how to choose eco-friendly t-shirts that don\'t compromise on style or quality.\n\nOrganic cotton is one of the most popular sustainable materials. Grown without harmful pesticides and fertilizers, organic cotton is better for the environment and the farmers who grow it. Look for certifications like GOTS (Global Organic Textile Standard) to ensure authenticity.\n\nRecycled materials are another excellent choice. Many brands now create t-shirts from recycled plastic bottles, cotton scraps, or other post-consumer materials. These innovative processes reduce waste and conserve resources.\n\nBamboo fabric is gaining popularity for its sustainability credentials. Bamboo grows quickly without pesticides and requires less water than cotton. The resulting fabric is soft, breathable, and naturally antibacterial.\n\nHemp is one of the most sustainable fibers available. It requires minimal water, grows quickly, and returns nutrients to the soil. Hemp fabric is durable, breathable, and becomes softer with each wash.\n\nWhen shopping for sustainable t-shirts, also consider the manufacturing process. Look for brands that use renewable energy, conserve water, and provide fair wages to workers. Remember that the most sustainable t-shirt is one you\'ll wear for years to come.',
        author: adminUser._id,
        image: 'https://via.placeholder.com/800x400/228b22/ffffff?text=Sustainable+Fashion'
      },
      {
        title: 'Summer Styling: How to Wear T-Shirts in Hot Weather',
        content: 'Summer calls for lightweight, breathable clothing, and t-shirts are the perfect foundation for your warm-weather wardrobe. Here are our top tips for staying cool and stylish during the hottest months.\n\nChoose the right fabric. Natural fibers like cotton, linen, and bamboo are your best friends in hot weather. They breathe better than synthetic materials and wick moisture away from your skin. Look for lightweight weaves that allow air to circulate.\n\nLight colors reflect heat, while dark colors absorb it. Opt for white, pastel, or other light-colored t-shirts during summer. Not only will they keep you cooler, but they also look fresh and seasonal.\n\nFit matters in hot weather. Avoid overly tight t-shirts that can trap heat and moisture. A relaxed or regular fit allows for better air circulation and movement. However, avoid anything too baggy as it can look sloppy.\n\nLayer strategically. A lightweight t-shirt can be layered under a linen shirt or worn on its own. This versatility allows you to adapt to changing temperatures throughout the day, from cool mornings to hot afternoons.\n\nDon\'t forget sun protection. While t-shirts provide some coverage, consider UPF-rated fabrics for extended outdoor activities. A lightweight t-shirt combined with sunscreen and a hat offers comprehensive sun protection.\n\nFinally, proper care extends the life of your summer t-shirts. Wash them in cold water to prevent shrinking and fading, and hang them to dry to maintain their shape and fit.',
        author: adminUser._id,
        image: 'https://via.placeholder.com/800x400/87ceeb/ffffff?text=Summer+Styling'
      }
    ];

    await Blog.insertMany(blogs);
    console.log('Sample blogs created');

    console.log('Seed data inserted successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
