const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get user's orders
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('orderItems.product', 'name image')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Get single order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('orderItems.product', 'name image');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order belongs to user
    if (order.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    res.json(order);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Create new order
router.post('/', auth, async (req, res) => {
  try {
    // Get user's cart items
    const cartItems = await Cart.find({ user: req.user.id })
      .populate('product', 'name price discountPrice');

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate total amount
    let totalAmount = 0;
    const orderItems = cartItems.map(item => {
      const price = item.product.discountPrice || item.product.price;
      const itemTotal = price * item.quantity;
      totalAmount += itemTotal;
      
      return {
        product: item.product._id,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        price: price
      };
    });

    // Create order
    const order = new Order({
      user: req.user.id,
      orderItems,
      totalAmount
    });

    await order.save();
    await order.populate('orderItems.product', 'name image');

    // Clear cart after order is created
    await Cart.deleteMany({ user: req.user.id });

    res.status(201).json(order);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Update order status (Admin only)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['Processing', 'Shipped', 'Delivered'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    let order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();
    await order.populate('orderItems.product', 'name image');

    res.json(order);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
