import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlistItems();
    }
  }, [isAuthenticated]);

  const fetchWishlistItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/wishlist', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setWishlistItems(data);
    } catch (error) {
      console.error('Error fetching wishlist items:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (itemId) => {
    try {
      await fetch(`/api/wishlist/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setWishlistItems(wishlistItems.filter(item => item._id !== itemId));
      showToast('Item removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      showToast('Error removing item', 'error');
    }
  };

  const moveToCart = async (product) => {
    const result = await addToCart(product._id, 1, product.sizes[0], product.colors[0]);
    if (result.success) {
      showToast('Item moved to cart!');
      removeFromWishlist(product._id);
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

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <FiHeart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Login to View Wishlist</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to view and manage your wishlist.</p>
          <Link
            to="/login"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <FiHeart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your Wishlist is Empty</h1>
          <p className="text-gray-600 mb-6">Start adding items you love to your wishlist!</p>
          <Link
            to="/"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
        <Link
          to="/"
          className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map((item) => {
          const product = item.product;
          const price = product.discountPrice || product.price;
          
          return (
            <div key={item._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <Link to={`/product/${product._id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover rounded-t-lg"
                  />
                </Link>
                <button
                  onClick={() => removeFromWishlist(item._id)}
                  className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow"
                >
                  <FiTrash2 className="w-4 h-4 text-red-500 hover:text-red-600" />
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
                  <div className="flex flex-wrap gap-1">
                    {product.sizes.slice(0, 4).map(size => (
                      <span
                        key={size}
                        className="px-2 py-1 text-xs border border-gray-300 rounded"
                      >
                        {size}
                      </span>
                    ))}
                    {product.sizes.length > 4 && (
                      <span className="px-2 py-1 text-xs text-gray-500">
                        +{product.sizes.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-1">Available Colors:</p>
                  <div className="flex space-x-1">
                    {product.colors.slice(0, 5).map(color => (
                      <div
                        key={color}
                        className="w-5 h-5 rounded-full border border-gray-300"
                        style={{ backgroundColor: color.toLowerCase() }}
                        title={color}
                      />
                    ))}
                    {product.colors.length > 5 && (
                      <span className="px-2 py-1 text-xs text-gray-500 self-center">
                        +{product.colors.length - 5}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => moveToCart(product)}
                    className="flex-1 bg-primary-600 text-white py-2 px-3 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center text-sm"
                  >
                    <FiShoppingCart className="w-4 h-4 mr-1" />
                    Move to Cart
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Wishlist Summary */}
      <div className="mt-12 bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Wishlist Summary</h2>
            <p className="text-sm text-gray-600 mt-1">
              You have {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} in your wishlist
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Value</p>
            <p className="text-2xl font-bold text-primary-600">
              ${wishlistItems.reduce((total, item) => {
                const price = item.product.discountPrice || item.product.price;
                return total + price;
              }, 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
