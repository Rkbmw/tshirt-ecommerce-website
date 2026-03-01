const express = require('express');
const { body, validationResult } = require('express-validator');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get user's cart
router.get('/', auth, async (req, res) => {
  try {
    const cartItems = await Cart.find({ user: req.user.id })
      .populate('product', 'name price image discountPrice');
    
    res.json(cartItems);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Add item to cart
router.post('/', auth, [
  body('product').notEmpty().withMessage('Product ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('size').isIn(['S', 'M', 'L', 'XL']).withMessage('Valid size is required'),
  body('color').notEmpty().withMessage('Color is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { product, quantity, size, color } = req.body;

    // Check if product exists
    const productExists = await Product.findById(product);
    if (!productExists) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if item already exists in cart
    let cartItem = await Cart.findOne({
      user: req.user.id,
      product,
      size,
      color
    });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = new Cart({
        user: req.user.id,
        product,
        quantity,
        size,
        color
      });
      await cartItem.save();
    }

    await cartItem.populate('product', 'name price image discountPrice');
    res.json(cartItem);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Update cart item quantity
router.put('/:id', auth, [
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { quantity } = req.body;

    let cartItem = await Cart.findById(req.params.id);
    
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    // Check if cart item belongs to user
    if (cartItem.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    cartItem.quantity = quantity;
    await cartItem.save();
    await cartItem.populate('product', 'name price image discountPrice');

    res.json(cartItem);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Remove item from cart
router.delete('/:id', auth, async (req, res) => {
  try {
    const cartItem = await Cart.findById(req.params.id);
    
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    // Check if cart item belongs to user
    if (cartItem.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Cart.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Clear cart
router.delete('/', auth, async (req, res) => {
  try {
    await Cart.deleteMany({ user: req.user.id });
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
