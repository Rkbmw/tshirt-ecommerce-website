const express = require('express');
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, sortBy } = req.query;
    let query = {};
    
    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    let sort = {};
    if (sortBy === 'latest') {
      sort.createdAt = -1;
    } else if (sortBy === 'price-low') {
      sort.price = 1;
    } else if (sortBy === 'price-high') {
      sort.price = -1;
    }
    
    const products = await Product.find(query).sort(sort);
    res.json(products);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Create product (Admin only)
router.post('/', adminAuth, [
  body('name').notEmpty().withMessage('Product name is required'),
  body('category').isIn(['Men', 'Women', 'Boys']).withMessage('Valid category is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('description').notEmpty().withMessage('Description is required'),
  body('sizes').isArray().withMessage('Sizes must be an array'),
  body('colors').isArray().withMessage('Colors must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, category, price, discountPrice, sizes, colors, description, image } = req.body;

    const product = new Product({
      name,
      category,
      price,
      discountPrice,
      sizes,
      colors,
      description,
      image
    });

    await product.save();
    res.json(product);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Update product (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { name, category, price, discountPrice, sizes, colors, description, image } = req.body;
    
    let product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, category, price, discountPrice, sizes, colors, description, image },
      { new: true }
    );

    res.json(product);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Delete product (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product removed' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
