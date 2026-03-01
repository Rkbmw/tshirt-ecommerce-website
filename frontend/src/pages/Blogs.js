import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiUser, FiClock, FiArrowLeft, FiBookOpen } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/blogs');
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const readTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    return Math.ceil(words / wordsPerMinute);
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fashion Blog</h1>
          <p className="text-gray-600 mt-2">Discover the latest trends, styling tips, and fashion insights</p>
        </div>
        <Link
          to="/"
          className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to Shop</span>
        </Link>
      </div>

      {/* Featured Blog */}
      {blogs.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Article</h2>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  src={blogs[0].image || 'https://via.placeholder.com/600x400'}
                  alt={blogs[0].title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="p-8 md:w-1/2">
                <div className="flex items-center space-x-4 mb-4">
                  <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Featured
                  </span>
                  <div className="flex items-center text-sm text-gray-600">
                    <FiCalendar className="w-4 h-4 mr-1" />
                    {formatDate(blogs[0].createdAt)}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FiClock className="w-4 h-4 mr-1" />
                    {readTime(blogs[0].content)} min read
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 hover:text-primary-600 cursor-pointer">
                  {blogs[0].title}
                </h3>
                <div className="flex items-center mb-4">
                  <FiUser className="w-4 h-4 text-gray-600 mr-2" />
                  <span className="text-sm text-gray-600">By {blogs[0].author?.name || 'Admin'}</span>
                </div>
                <p className="text-gray-600 mb-6 line-clamp-3">
                  {blogs[0].content}
                </p>
                <button
                  onClick={() => setSelectedBlog(blogs[0])}
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                >
                  Read Full Article
                  <FiArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blog Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Articles</h2>
        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <FiBookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No articles yet</h3>
            <p className="text-gray-600">Check back soon for the latest fashion insights and tips.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.slice(1).map((blog) => (
              <article key={blog._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={blog.image || 'https://via.placeholder.com/400x250'}
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <FiCalendar className="w-4 h-4 mr-1" />
                      {formatDate(blog.createdAt)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FiClock className="w-4 h-4 mr-1" />
                      {readTime(blog.content)} min
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-primary-600 cursor-pointer">
                    {blog.title}
                  </h3>
                  
                  <div className="flex items-center mb-3">
                    <FiUser className="w-4 h-4 text-gray-600 mr-2" />
                    <span className="text-sm text-gray-600">By {blog.author?.name || 'Admin'}</span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {blog.content}
                  </p>
                  
                  <button
                    onClick={() => setSelectedBlog(blog)}
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Read More
                    <FiArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Blog Categories */}
      <div className="mt-16 bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Styling Tips', count: 12 },
            { name: 'Fashion Trends', count: 8 },
            { name: 'Sustainable Fashion', count: 6 },
            { name: 'Seasonal Guide', count: 10 }
          ].map((category) => (
            <div key={category.name} className="bg-white p-4 rounded-lg text-center hover:shadow-md transition-shadow cursor-pointer">
              <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
              <p className="text-sm text-gray-600">{category.count} articles</p>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="mt-16 bg-primary-600 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Stay Updated</h2>
        <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
          Subscribe to our newsletter and get the latest fashion trends, styling tips, and exclusive offers delivered to your inbox.
        </p>
        <div className="max-w-md mx-auto flex">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
          <button className="bg-primary-700 text-white px-6 py-3 rounded-r-lg hover:bg-primary-800 transition-colors font-medium">
            Subscribe
          </button>
        </div>
      </div>

      {/* Blog Detail Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={selectedBlog.image || 'https://via.placeholder.com/800x400'}
                alt={selectedBlog.title}
                className="w-full h-64 md:h-96 object-cover"
              />
              <button
                onClick={() => setSelectedBlog(null)}
                className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition-shadow"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-8">
              <div className="flex items-center space-x-4 mb-6">
                <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Article
                </span>
                <div className="flex items-center text-sm text-gray-600">
                  <FiCalendar className="w-4 h-4 mr-1" />
                  {formatDate(selectedBlog.createdAt)}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FiClock className="w-4 h-4 mr-1" />
                  {readTime(selectedBlog.content)} min read
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{selectedBlog.title}</h1>
              
              <div className="flex items-center mb-8">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                  <FiUser className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{selectedBlog.author?.name || 'Admin'}</p>
                  <p className="text-sm text-gray-600">Fashion Expert</p>
                </div>
              </div>
              
              <div className="prose prose-lg max-w-none">
                {selectedBlog.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
              
              <div className="mt-8 pt-8 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex space-x-4">
                    <button className="text-primary-600 hover:text-primary-700 font-medium">
                      Share Article
                    </button>
                    <button className="text-primary-600 hover:text-primary-700 font-medium">
                      Save for Later
                    </button>
                  </div>
                  <button
                    onClick={() => setSelectedBlog(null)}
                    className="text-gray-600 hover:text-gray-700 font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blogs;
