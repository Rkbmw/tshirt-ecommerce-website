import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiHeart, FiUser, FiMenu, FiX, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const { isAuthenticated, user, logout } = useAuth();
  const { getCartCount } = useCart();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setCartCount(getCartCount());
  }, [getCartCount]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Use navigate for client-side routing
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const categories = {
    Men: ['T-Shirts', 'Polo', 'Casual', 'Formal'],
    Women: ['T-Shirts', 'Tank Tops', 'Casual', 'Sport'],
    Boys: ['Kids T-Shirts', 'Graphic Tees', 'School', 'Play']
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Navigation */}
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary-600">YBT Fashion</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Categories with Dropdown */}
            <div className="relative">
              <button
                className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
                onMouseEnter={() => setIsCategoryOpen(true)}
                onMouseLeave={() => setIsCategoryOpen(false)}
              >
                <span>Categories</span>
                <FiChevronDown className="w-4 h-4" />
              </button>
              
              {isCategoryOpen && (
                <div
                  className="absolute top-full left-0 w-96 bg-white shadow-lg rounded-lg mt-2 p-4"
                  onMouseEnter={() => setIsCategoryOpen(true)}
                  onMouseLeave={() => setIsCategoryOpen(false)}
                >
                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(categories).map(([category, items]) => (
                      <div key={category}>
                        <h3 className="font-semibold text-gray-900 mb-2">{category}</h3>
                        <ul className="space-y-1">
                          {items.map((item) => (
                            <li key={item}>
                              <Link
                                to={`/products?category=${category.toLowerCase()}`}
                                className="block text-sm text-gray-600 hover:text-primary-600 transition-colors"
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link to="/products?category=men" className="text-gray-700 hover:text-primary-600 transition-colors">
              Men
            </Link>
            <Link to="/products?category=women" className="text-gray-700 hover:text-primary-600 transition-colors">
              Women
            </Link>
            <Link to="/products?category=boys" className="text-gray-700 hover:text-primary-600 transition-colors">
              Boys
            </Link>
            <Link to="/products?sort=latest" className="text-gray-700 hover:text-primary-600 transition-colors">
              Fresh Picks
            </Link>
            <Link to="/blogs" className="text-gray-700 hover:text-primary-600 transition-colors">
              Blogs
            </Link>
          </div>

          {/* Right Side Items */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden lg:flex items-center">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:border-primary-500"
              />
              <button
                type="submit"
                className="bg-primary-600 text-white p-2 rounded-r-lg hover:bg-primary-700 transition-colors"
              >
                <FiSearch className="w-5 h-5" />
              </button>
            </form>

            {/* Navigation Icons */}
            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <>
                  <Link to="/orders" className="text-gray-700 hover:text-primary-600 transition-colors">
                    <FiUser className="w-6 h-6" />
                  </Link>
                  {user?.isAdmin && (
                    <Link to="/admin" className="text-gray-700 hover:text-primary-600 transition-colors">
                      <span className="text-sm font-medium">Admin</span>
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    <span className="text-sm">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-primary-600 transition-colors">
                    <FiUser className="w-6 h-6" />
                  </Link>
                </>
              )}

              <Link to="/wishlist" className="text-gray-700 hover:text-primary-600 transition-colors relative">
                <FiHeart className="w-6 h-6" />
              </Link>

              <Link to="/cart" className="text-gray-700 hover:text-primary-600 transition-colors relative">
                <FiShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700 hover:text-primary-600 transition-colors"
            >
              {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-3">
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:border-primary-500"
                />
                <button
                  type="submit"
                  className="bg-primary-600 text-white p-2 rounded-r-lg hover:bg-primary-700 transition-colors"
                >
                  <FiSearch className="w-5 h-5" />
                </button>
              </form>

              <Link
                to="/products?category=men"
                className="text-gray-700 hover:text-primary-600 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Men
              </Link>
              <Link
                to="/products?category=women"
                className="text-gray-700 hover:text-primary-600 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Women
              </Link>
              <Link
                to="/products?category=boys"
                className="text-gray-700 hover:text-primary-600 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Boys
              </Link>
              <Link
                to="/products?sort=latest"
                className="text-gray-700 hover:text-primary-600 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Fresh Picks
              </Link>
              <Link
                to="/blogs"
                className="text-gray-700 hover:text-primary-600 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Blogs
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/orders"
                    className="text-gray-700 hover:text-primary-600 transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  {user?.isAdmin && (
                    <Link
                      to="/admin"
                      className="text-gray-700 hover:text-primary-600 transition-colors py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-gray-700 hover:text-primary-600 transition-colors py-2 text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
