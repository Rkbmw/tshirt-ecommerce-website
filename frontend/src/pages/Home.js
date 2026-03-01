import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiSearch, FiFilter, FiGrid, FiList, FiChevronRight, FiStar, FiTruck, FiShield, FiRefreshCw, FiTrendingUp, FiPackage } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { mockProducts } from '../mockData';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [boysProducts, setBoysProducts] = useState([]);
  const [freshPicks, setFreshPicks] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
      
      // Get boys products
      const boys = data.filter(product => product.category.toLowerCase() === 'boys');
      setBoysProducts(boys.slice(0, 4)); // Show first 4 boys products
      
      // Get fresh picks (latest products)
      const fresh = data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 8); // Show 8 latest products
      setFreshPicks(fresh);
      
    } catch (error) {
      console.log('Backend not available, using mock data');
      // Use mock data when backend is not available
      const data = mockProducts;
      setProducts(data);
      
      // Get boys products
      const boys = data.filter(product => product.category.toLowerCase() === 'boys');
      setBoysProducts(boys.slice(0, 4)); // Show first 4 boys products
      
      // Get fresh picks (latest products)
      const fresh = data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 8); // Show 8 latest products
      setFreshPicks(fresh);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId, quantity = 1, size, color) => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }

    // Get default size and color if not provided
    const product = products.find(p => p._id === productId);
    const selectedSize = size || product?.sizes[0];
    const selectedColor = color || product?.colors[0];

    const result = await addToCart(productId, quantity, selectedSize, selectedColor);
    if (result.success) {
      showToast('Item added to cart!');
    } else {
      showToast(result.error, 'error');
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
            className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow"
            onClick={() => showToast('Added to wishlist!')}
          >
            <FiHeart className="w-4 h-4 text-gray-600 hover:text-red-500" />
          </button>
          {product.discountPrice && (
            <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
              Sale
            </span>
          )}
        </div>
        
        <div className="p-4">
          <Link to={`/product/${product._id}`}>
            <h3 className="text-sm font-semibold text-gray-900 hover:text-primary-600 transition-colors mb-2 line-clamp-2">
              {product.name}
            </h3>
          </Link>
          
          <div className="flex items-center justify-between mb-2">
            <div>
              {product.discountPrice ? (
                <>
                  <span className="text-lg font-bold text-primary-600">${product.discountPrice}</span>
                  <span className="text-xs text-gray-500 line-through ml-1">${product.price}</span>
                </>
              ) : (
                <span className="text-lg font-bold text-primary-600">${product.price}</span>
              )}
            </div>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {product.category}
            </span>
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
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg p-8 mb-12">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to YBT Fashion</h1>
          <p className="text-xl mb-6">Discover our premium collection of T-shirts for Men, Women & Boys</p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              to="/products" 
              className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center"
            >
              Shop Now
            </Link>
            <Link 
              to="/products?category=men" 
              className="border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors text-center"
            >
              Men's Collection
            </Link>
          </div>
        </div>
      </div>

      {/* Fresh Picks Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <FiTrendingUp className="w-6 h-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900">Fresh Picks</h2>
            <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded">
              New Arrivals
            </span>
          </div>
          <Link 
            to="/products?sort=latest" 
            className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
          >
            View All Fresh Picks
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {freshPicks.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* Category Quick Links */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link 
            to="/products?category=men"
            className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-blue-600 to-blue-700 p-8 text-white">
              <h3 className="text-2xl font-bold mb-2">Men</h3>
              <p className="mb-4">Premium collection for the modern man</p>
              <span className="inline-flex items-center text-sm font-medium">
                Shop Now →
              </span>
            </div>
          </Link>
          
          <Link 
            to="/products?category=women"
            className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-pink-600 to-purple-600 p-8 text-white">
              <h3 className="text-2xl font-bold mb-2">Women</h3>
              <p className="mb-4">Stylish and comfortable designs</p>
              <span className="inline-flex items-center text-sm font-medium">
                Shop Now →
              </span>
            </div>
          </Link>
          
          <Link 
            to="/products?category=boys"
            className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-green-600 to-teal-600 p-8 text-white">
              <h3 className="text-2xl font-bold mb-2">Boys</h3>
              <p className="mb-4">Fun and colorful for young adventurers</p>
              <span className="inline-flex items-center text-sm font-medium">
                Shop Now →
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Boys Collection Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <FiPackage className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">Boys Collection</h2>
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {boysProducts.length} Products
            </span>
          </div>
          <Link 
            to="/products?category=boys" 
            className="text-green-600 hover:text-green-700 font-medium flex items-center"
          >
            View All Boys Products
          </Link>
        </div>
        
        {boysProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {boysProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <FiPackage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No boys products available at the moment.</p>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiPackage className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Free Shipping</h3>
            <p className="text-gray-600">On orders over $50</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiStar className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Quality</h3>
            <p className="text-gray-600">100% cotton fabrics</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiHeart className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Returns</h3>
            <p className="text-gray-600">30-day return policy</p>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-primary-600 rounded-lg p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
        <p className="mb-6 max-w-2xl mx-auto">
          Subscribe to our newsletter and get the latest updates on new arrivals and exclusive offers.
        </p>
        <div className="max-w-md mx-auto flex">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-l-lg text-gray-900 focus:outline-none"
          />
          <button className="bg-primary-700 px-6 py-3 rounded-r-lg hover:bg-primary-800 transition-colors font-medium">
            Subscribe
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
