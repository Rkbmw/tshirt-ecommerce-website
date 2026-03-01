import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiStar, FiTrendingUp, FiPackage } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

// Static mock data - no API calls
const staticProducts = [
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

const HomeStandalone = () => {
  const [boysProducts, setBoysProducts] = useState([]);
  const [freshPicks, setFreshPicks] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // No API calls - just use static data
    const boys = staticProducts.filter(product => product.category.toLowerCase() === 'boys');
    setBoysProducts(boys.slice(0, 4));
    
    const fresh = staticProducts
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 8);
    setFreshPicks(fresh);
    
    setLoading(false);
  }, []);

  const handleAddToCart = async (productId, quantity = 1, size, color) => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }

    try {
      await addToCart(productId, quantity, size, color);
      showToast('Item added to cart!');
    } catch (error) {
      showToast('Failed to add item to cart', 'error');
    }
  };

  const showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'error' : ''}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  const ProductCard = ({ product, showQuickAdd = true }) => {
    const [selectedSize, setSelectedSize] = useState(product.sizes[0]);

    return (
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="relative">
          <Link to={`/product/${product._id}`}>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded-t-lg"
            />
          </Link>
          <button
            className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow"
            onClick={() => showToast('Added to wishlist!')}
          >
            <FiHeart className="w-5 h-5 text-gray-600 hover:text-red-500" />
          </button>
          {product.discountPrice && (
            <span className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
              Sale
            </span>
          )}
        </div>
        
        <div className="p-4">
          <Link to={`/product/${product._id}`}>
            <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors mb-2">
              {product.name}
            </h3>
          </Link>
          
          <div className="flex items-center justify-between mb-2">
            <div>
              {product.discountPrice ? (
                <>
                  <span className="text-xl font-bold text-primary-600">${product.discountPrice}</span>
                  <span className="text-sm text-gray-500 line-through ml-2">${product.price}</span>
                </>
              ) : (
                <span className="text-xl font-bold text-primary-600">${product.price}</span>
              )}
            </div>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {product.category}
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">Available Sizes:</p>
            <div className="flex space-x-2">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-2 py-1 text-xs border rounded ${
                    selectedSize === size
                      ? 'border-primary-500 bg-primary-50 text-primary-600'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {showQuickAdd && (
            <div className="flex space-x-2">
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="flex-1 text-xs border border-gray-300 rounded px-2 py-1"
              >
                {product.sizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
              <button
                onClick={() => handleAddToCart(product._id, 1, selectedSize, product.colors[0])}
                className="flex-1 bg-primary-600 text-white py-1 px-2 rounded text-xs hover:bg-primary-700 transition-colors flex items-center justify-center"
              >
                <FiShoppingCart className="w-3 h-3 mr-1" />
                Add
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              YBT Fashion
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Discover Premium T-Shirts for Every Style
            </p>
            <div className="space-x-4">
              <Link
                to="/products?category=men"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Shop Men
              </Link>
              <Link
                to="/products?category=women"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
              >
                Shop Women
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Fresh Picks Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Fresh Picks</h2>
              <p className="text-gray-600 mt-2">New arrivals just for you</p>
            </div>
            <Link
              to="/products?sort=latest"
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
            >
              View All Fresh Picks
              <FiTrendingUp className="ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {freshPicks.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Category Quick Links */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Shop by Category
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link
              to="/products?category=men"
              className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-blue-500 to-blue-700 p-8 text-white">
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-2">Men</h3>
                  <p className="text-blue-100">Premium collection</p>
                </div>
                <FiPackage className="absolute bottom-4 right-4 w-8 h-8 text-blue-200" />
              </div>
            </Link>

            <Link
              to="/products?category=women"
              className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-pink-500 to-pink-700 p-8 text-white">
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-2">Women</h3>
                  <p className="text-pink-100">Trendy styles</p>
                </div>
                <FiPackage className="absolute bottom-4 right-4 w-8 h-8 text-pink-200" />
              </div>
            </Link>

            <Link
              to="/products?category=boys"
              className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-green-500 to-green-700 p-8 text-white">
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-2">Boys</h3>
                  <p className="text-green-100">Fun & comfortable</p>
                </div>
                <FiPackage className="absolute bottom-4 right-4 w-8 h-8 text-green-200" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Boys Collection Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Boys Collection</h2>
              <p className="text-gray-600 mt-2">Comfortable and stylish for kids</p>
            </div>
            <Link
              to="/products?category=boys"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View All Boys Products
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {boysProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {boysProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No boys products available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiPackage className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Free Shipping</h3>
              <p className="text-gray-600">Free shipping on orders over $50</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiStar className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Quality</h3>
              <p className="text-gray-600">High-quality materials and construction</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiHeart className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Returns</h3>
              <p className="text-gray-600">30-day return policy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl mb-8 text-primary-100">
            Subscribe to get special offers and new product updates
          </p>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-l-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button className="bg-primary-700 hover:bg-primary-800 px-6 py-3 rounded-r-lg font-semibold transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeStandalone;
