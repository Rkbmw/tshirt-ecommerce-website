# YBT Fashion - T-Shirt E-commerce Website

A full-stack e-commerce website for selling T-shirts built with React.js, Node.js, Express, and MongoDB.

## Features

### Frontend Features
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Product Catalog**: Browse products with filtering and sorting options
- **Product Details**: Detailed product pages with image galleries
- **Shopping Cart**: Add/remove items, update quantities
- **Wishlist**: Save favorite products for later
- **User Authentication**: Login, registration, and protected routes
- **Order Management**: View order history and track orders
- **Blog System**: Read fashion articles and tips
- **Admin Dashboard**: Manage products, orders, and blog posts
- **Search Functionality**: Live search for products
- **Modern UI**: Built with Tailwind CSS for beautiful, responsive design

### Backend Features
- **RESTful APIs**: Complete CRUD operations for all entities
- **JWT Authentication**: Secure user authentication and authorization
- **Admin Controls**: Role-based access control for admin features
- **Database Integration**: MongoDB with Mongoose ODM
- **Input Validation**: Comprehensive validation using express-validator
- **Error Handling**: Proper error handling and response formatting
- **Security**: Password hashing, CORS protection, input sanitization

## Tech Stack

### Frontend
- **React.js** v18.2.0
- **React Router** v6.15.0
- **Tailwind CSS** v3.3.3
- **Axios** v1.5.0
- **React Icons** v4.10.1

### Backend
- **Node.js**
- **Express.js** v4.18.2
- **MongoDB** with Mongoose v7.5.0
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation

## Project Structure

```
t-shirt-sell/
├── backend/
│   ├── models/          # Database models (User, Product, Order, etc.)
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware (auth, validation)
│   ├── seed.js          # Database seed script
│   ├── server.js        # Main server file
│   ├── package.json
│   └── .env             # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components (Navbar, etc.)
│   │   ├── pages/       # Page components (Home, ProductDetails, etc.)
│   │   ├── context/     # React Context (Auth, Cart)
│   │   ├── utils/       # Utility functions
│   │   ├── App.js       # Main App component
│   │   └── index.js     # Entry point
│   ├── public/
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (installed and running)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd t-shirt-sell
```

### 2. Backend Setup

```bash
cd backend
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tshirt-ecommerce
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### 4. Seed the Database
```bash
npm run seed
```
This will create sample products, an admin user, and blog posts.

### 5. Start the Backend Server
```bash
npm run dev
```
The backend will be running on `http://localhost:5000`

### 6. Frontend Setup

Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
npm install
```

### 7. Start the Frontend Development Server
```bash
npm start
```
The frontend will be running on `http://localhost:3000`

## Default Admin Account
After seeding the database, you can use the following admin account:
- **Email**: admin@ybt.com
- **Password**: admin123

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/user` - Get current user info

### Products
- `GET /api/products` - Get all products (with filtering/sorting)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item quantity
- `DELETE /api/cart/:id` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Wishlist
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist` - Add item to wishlist
- `DELETE /api/wishlist/:id` - Remove item from wishlist
- `GET /api/wishlist/check/:productId` - Check if product is in wishlist

### Orders
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status (Admin only)

### Blogs
- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/:id` - Get single blog
- `POST /api/blogs` - Create blog (Admin only)
- `PUT /api/blogs/:id` - Update blog (Admin only)
- `DELETE /api/blogs/:id` - Delete blog (Admin only)

## Features in Detail

### Product Management
- Add/edit/delete products (Admin)
- Product categories (Men, Women, Boys)
- Size and color variations
- Discount pricing
- Product images
- Search and filter functionality

### Shopping Cart
- Add products with size and color selection
- Update quantities
- Remove items
- Price calculation with discounts
- Persistent cart across sessions

### User Authentication
- Secure registration and login
- JWT token-based authentication
- Protected routes
- Admin role management

### Order System
- Create orders from cart
- Order history
- Order status tracking (Processing, Shipped, Delivered)
- Order details view

### Admin Dashboard
- Overview statistics
- Product management
- Order management
- Blog management
- User management

### Blog System
- Create/edit/delete blog posts (Admin)
- Blog listing and detail views
- Reading time estimation
- Author information

## Deployment

### Backend Deployment
1. Set up a MongoDB database (MongoDB Atlas recommended for production)
2. Update environment variables with production values
3. Deploy to your preferred platform (Heroku, AWS, DigitalOcean, etc.)

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy the build folder to your hosting service (Netlify, Vercel, AWS S3, etc.)
3. Update the proxy in package.json if needed

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you have any questions or issues, please open an issue on the GitHub repository.

## Future Enhancements

- Payment gateway integration (Stripe, PayPal)
- Email notifications for orders
- Product reviews and ratings
- Advanced search with filters
- Social media integration
- Multi-language support
- Mobile app development
- Analytics dashboard
- SEO optimization
- Performance optimization
