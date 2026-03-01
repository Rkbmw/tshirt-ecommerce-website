const express = require('express');
const { body, validationResult } = require('express-validator');
const Blog = require('../models/Blog');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'name')
      .sort({ createdAt: -1 });
    
    res.json(blogs);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Get single blog
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'name');
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    res.json(blog);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Create blog (Admin only)
router.post('/', adminAuth, [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, image } = req.body;

    const blog = new Blog({
      title,
      content,
      image,
      author: req.user.id
    });

    await blog.save();
    await blog.populate('author', 'name');

    res.json(blog);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Update blog (Admin only)
router.put('/:id', adminAuth, [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, image } = req.body;
    
    let blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, content, image },
      { new: true }
    ).populate('author', 'name');

    res.json(blog);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Delete blog (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog removed' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
