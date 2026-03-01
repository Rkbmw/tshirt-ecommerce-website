// Mock data for Netlify deployment
export const mockProducts = [
  {
    _id: '1',
    name: 'Premium Cotton T-Shirt',
    category: 'Men',
    price: 29.99,
    discountPrice: 24.99,
    description: 'High-quality cotton t-shirt with comfortable fit and modern design.',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Black', 'Gray', 'Navy'],
    createdAt: new Date().toISOString()
  },
  {
    _id: '2',
    name: 'Classic Polo Shirt',
    category: 'Men',
    price: 39.99,
    description: 'Classic polo shirt perfect for casual and semi-formal occasions.',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Blue', 'Green'],
    createdAt: new Date().toISOString()
  },
  {
    _id: '3',
    name: 'Elegant Women\'s Top',
    category: 'Women',
    price: 34.99,
    discountPrice: 29.99,
    description: 'Stylish and elegant top perfect for any occasion.',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Pink', 'White', 'Black'],
    createdAt: new Date().toISOString()
  },
  {
    _id: '4',
    name: 'Kids Cartoon T-Shirt',
    category: 'Boys',
    price: 19.99,
    description: 'Fun and colorful t-shirt featuring popular cartoon characters.',
    image: 'https://images.unsplash.com/photo-1564399580075-5dfe19c205f3?w=400',
    sizes: ['2T', '3T', '4T', '5T'],
    colors: ['Red', 'Blue', 'Green'],
    createdAt: new Date().toISOString()
  },
  {
    _id: '5',
    name: 'Athletic Performance Tee',
    category: 'Men',
    price: 44.99,
    description: 'High-performance athletic tee designed for maximum comfort during workouts.',
    image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Gray', 'Blue'],
    createdAt: new Date().toISOString()
  },
  {
    _id: '6',
    name: 'Casual Summer Dress',
    category: 'Women',
    price: 49.99,
    description: 'Light and comfortable summer dress perfect for warm weather.',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Yellow', 'Blue', 'Pink'],
    createdAt: new Date().toISOString()
  },
  {
    _id: '7',
    name: 'Boys Sports Jersey',
    category: 'Boys',
    price: 24.99,
    description: 'Cool sports jersey for active boys who love sports.',
    image: 'https://images.unsplash.com/photo-1552294474-2c8b0ac33b4c?w=400',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Red', 'Blue', 'Green'],
    createdAt: new Date().toISOString()
  },
  {
    _id: '8',
    name: 'Vintage Wash T-Shirt',
    category: 'Men',
    price: 32.99,
    description: 'Retro-style t-shirt with vintage wash and comfortable fit.',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Brown', 'Gray', 'Black'],
    createdAt: new Date().toISOString()
  }
];

export const mockBlogs = [
  {
    _id: '1',
    title: 'Summer Fashion Trends 2024',
    content: 'Discover the hottest fashion trends for this summer season...',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
    createdAt: new Date().toISOString()
  },
  {
    _id: '2',
    title: 'How to Style T-Shirts',
    content: 'Learn creative ways to style your favorite t-shirts...',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400',
    createdAt: new Date().toISOString()
  }
];

// Mock API functions
export const mockApi = {
  getProducts: () => Promise.resolve({ data: mockProducts }),
  getBlogs: () => Promise.resolve({ data: mockBlogs }),
  getProduct: (id) => Promise.resolve({ data: mockProducts.find(p => p._id === id) }),
  getBlog: (id) => Promise.resolve({ data: mockBlogs.find(b => b._id === id) })
};
