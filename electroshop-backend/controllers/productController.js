import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';

// @desc    Get all products with search & filter
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 12;
  const page = Number(req.query.page) || 1;

  const filter = {};

  if (req.query.q) {
    filter.$text = { $search: req.query.q };
  }

  if (req.query.category) {
    const validCategories = ['phones', 'laptops', 'accessories', 'tablets'];
    if (!validCategories.includes(req.query.category)) {
      res.status(400);
      throw new Error('Invalid category');
    }
    filter.category = req.query.category;
  }

  if (req.query.brand) {
    filter.brand = { $regex: req.query.brand, $options: 'i' };
  }

  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
  }

  const count = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json(product);
});

// @desc    Create a product
// @route   POST /api/products
// @access  Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    comparePrice,
    category,
    brand,
    stock,
    images,
    specs,
  } = req.body;

  if (!name || !description || !price || !category || !brand) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const product = await Product.create({
    name,
    description,
    price,
    comparePrice: comparePrice || 0,
    category,
    brand,
    stock: stock || 0,
    images: images || [],
    specs: specs || {},
  });

  res.status(201).json(product);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const fields = [
    'name', 'description', 'price', 'comparePrice',
    'category', 'brand', 'stock', 'images', 'specs',
  ];

  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      product[field] = req.body[field];
    }
  });

  const updated = await product.save();
  res.json(updated);
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await product.deleteOne();
  res.json({ message: 'Product removed' });
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
