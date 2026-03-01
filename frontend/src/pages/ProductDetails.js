import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiTruck, FiArrowLeft } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchProduct();
    fetchRelatedProducts();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${id}`);
      const data = await response.json();
      setProduct(data);
      setSelectedSize(data.sizes[0]);
      setSelectedColor(data.colors[0]);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const response = await fetch(`/api/products?category=${product?.category}&limit=4`);
      const data = await response.json();
      setRelatedProducts(data.filter(p => p._id !== id));
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }

    const result = await addToCart(product._id, quantity, selectedSize, selectedColor);
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

  const getEstimatedDelivery = () => {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5);
    return deliveryDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <Link to="/" className="text-primary-600 hover:text-primary-700">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
        <Link to="/" className="hover:text-primary-600">Home</Link>
        <span>/</span>
        <Link to={`/products?category=${product.category.toLowerCase()}`} className="hover:text-primary-600 capitalize">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div>
          <div className="mb-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[product.image].map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`border-2 rounded ${
                  selectedImage === index ? 'border-primary-500' : 'border-gray-300'
                }`}
              >
                <img
                  src={img}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-20 object-cover rounded"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          
          <div className="flex items-center space-x-4 mb-6">
            {product.discountPrice ? (
              <>
                <span className="text-3xl font-bold text-primary-600">${product.discountPrice}</span>
                <span className="text-xl text-gray-500 line-through">${product.price}</span>
                <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                  Save ${product.price - product.discountPrice}
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold text-primary-600">${product.price}</span>
            )}
          </div>

          <div className="mb-6">
            <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
              {product.category}
            </span>
          </div>

          <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>

          {/* Size Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Select Size</h3>
            <div className="flex space-x-3">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border-2 rounded-lg font-medium transition-colors ${
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

          {/* Color Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Select Color</h3>
            <div className="flex space-x-3">
              {product.colors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`flex items-center space-x-2 px-4 py-2 border-2 rounded-lg transition-colors ${
                    selectedColor === color
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div
                    className="w-5 h-5 rounded-full border border-gray-300"
                    style={{ backgroundColor: color.toLowerCase() }}
                  />
                  <span className="text-sm font-medium">{color}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Quantity</h3>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                -
              </button>
              <span className="px-6 py-2 border border-gray-300 rounded-lg font-medium">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mb-8">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center"
            >
              <FiShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </button>
            <button
              onClick={() => showToast('Added to wishlist!')}
              className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiHeart className="w-6 h-6" />
            </button>
          </div>

          {/* Delivery Info */}
          <div className="bg-gray-50 p-4 rounded-lg mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <FiTruck className="w-5 h-5 text-primary-600" />
              <span className="font-semibold">Free Delivery</span>
            </div>
            <p className="text-sm text-gray-600">
              Estimated delivery by {getEstimatedDelivery()}
            </p>
            <p className="text-sm text-gray-600">
              30-day return policy
            </p>
          </div>

          {/* Product Features */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Product Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Category:</span>
                <span className="font-medium capitalize">{product.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Available Sizes:</span>
                <span className="font-medium">{product.sizes.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Available Colors:</span>
                <span className="font-medium">{product.colors.join(', ')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(relatedProduct => (
              <div key={relatedProduct._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <Link to={`/product/${relatedProduct._id}`}>
                  <img
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </Link>
                <div className="p-4">
                  <Link to={`/product/${relatedProduct._id}`}>
                    <h3 className="font-semibold text-gray-900 hover:text-primary-600 transition-colors mb-2">
                      {relatedProduct.name}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between">
                    {relatedProduct.discountPrice ? (
                      <>
                        <span className="text-lg font-bold text-primary-600">${relatedProduct.discountPrice}</span>
                        <span className="text-sm text-gray-500 line-through">${relatedProduct.price}</span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-primary-600">${relatedProduct.price}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
