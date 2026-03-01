const express = require('express');
const { body, validationResult } = require('express-validator');
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get user's wishlist
router.get('/', auth, async (req, res) => {
  try {
    const wishlistItems = await Wishlist.find({ user: req.user.id })
      .populate('product', 'name price image discountPrice category');
    
    res.json(wishlistItems);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Add item to wishlist
router.post('/', auth, [
  body('product').notEmpty().withMessage('Product ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { product } = req.body;

    // Check if product exists
    const productExists = await Product.findById(product);
    if (!productExists) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if item already exists in wishlist
    let wishlistItem = await Wishlist.findOne({
      user: req.user.id,
      product
    });

    if (wishlistItem) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    wishlistItem = new Wishlist({
      user: req.user.id,
      product
    });

    await wishlistItem.save();
    await wishlistItem.populate('product', 'name price image discountPrice category');

    res.json(wishlistItem);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Remove item from wishlist
router.delete('/:id', auth, async (req, res) => {
  try {
    const wishlistItem = await Wishlist.findById(req.params.id);
    
    if (!wishlistItem) {
      return res.status(404).json({ message: 'Wishlist item not found' });
    }

    // Check if wishlist item belongs to user
    if (wishlistItem.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Wishlist.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item removed from wishlist' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Check if product is in wishlist
router.get('/check/:productId', auth, async (req, res) => {
  try {
    const wishlistItem = await Wishlist.findOne({
      user: req.user.id,
      product: req.params.productId
    });
    
    res.json({ isInWishlist: !!wishlistItem });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
