import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiPlus, FiMinus, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { items, getCartItems, updateCartItem, removeFromCart, clearCart, getCartTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      getCartItems();
    }
  }, [isAuthenticated, getCartItems]);

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setLoading(true);
    const result = await updateCartItem(itemId, newQuantity);
    if (result.success) {
      getCartItems();
    }
    setLoading(false);
  };

  const handleRemoveItem = async (itemId) => {
    setLoading(true);
    const result = await removeFromCart(itemId);
    if (result.success) {
      getCartItems();
    }
    setLoading(false);
  };

  const handleCheckout = () => {
    // This would typically integrate with a payment gateway
    alert('Checkout functionality would be implemented here. For demo purposes, this is a placeholder.');
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
          <FiShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Login to View Cart</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to view and manage your cart.</p>
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

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <FiShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
          <Link
            to="/"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <Link
          to="/"
          className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Cart Items ({items.length})</h2>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear your cart?')) {
                      clearCart();
                    }
                  }}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Clear Cart
                </button>
              </div>
            </div>
            
            <div className="divide-y">
              {items.map((item) => {
                const price = item.product.discountPrice || item.product.price;
                const itemTotal = price * item.quantity;
                
                return (
                  <div key={item._id} className="p-6">
                    <div className="flex items-start space-x-4">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <Link
                              to={`/product/${item.product._id}`}
                              className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                            >
                              {item.product.name}
                            </Link>
                            <p className="text-sm text-gray-600 mt-1">{item.product.category}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="text-sm text-gray-600">Size: {item.size}</span>
                              <span className="text-sm text-gray-600">Color: {item.color}</span>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleRemoveItem(item._id)}
                            className="text-red-600 hover:text-red-700 p-2"
                            disabled={loading}
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>
                        
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                              className="p-1 border border-gray-300 rounded hover:bg-gray-50"
                              disabled={loading || item.quantity <= 1}
                            >
                              <FiMinus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                              className="p-1 border border-gray-300 rounded hover:bg-gray-50"
                              disabled={loading}
                            >
                              <FiPlus className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-lg font-semibold text-gray-900">
                              ${itemTotal.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-600">
                              ${price.toFixed(2)} each
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              
              {shipping > 0 && (
                <p className="text-xs text-primary-600">
                  Add ${(50 - subtotal).toFixed(2)} more for free shipping
                </p>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-lg font-bold text-primary-600">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleCheckout}
              className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Proceed to Checkout
            </button>
            
            <div className="mt-4 text-center">
              <Link
                to="/"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Continue Shopping
              </Link>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-sm mb-2">Delivery Information</h3>
              <p className="text-xs text-gray-600">
                • Standard delivery: 3-5 business days<br/>
                • Express delivery: 1-2 business days<br/>
                • Free shipping on orders over $50<br/>
                • 30-day return policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
