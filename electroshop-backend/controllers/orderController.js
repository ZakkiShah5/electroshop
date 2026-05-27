import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Protected
const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('No order items provided');
  }

  if (!shippingAddress?.street || !shippingAddress?.city ||
      !shippingAddress?.country || !shippingAddress?.zip) {
    res.status(400);
    throw new Error('Complete shipping address is required');
  }

  if (!paymentMethod) {
    res.status(400);
    throw new Error('Payment method is required');
  }

  // Verify products exist and have enough stock
  const orderItems = [];
  let itemsPrice = 0;

  for (const item of items) {
    const product = await Product.findById(item.product);

    if (!product) {
      res.status(404);
      throw new Error(`Product ${item.product} not found`);
    }

    if (product.stock < item.qty) {
      res.status(400);
      throw new Error(`Insufficient stock for ${product.name}`);
    }

    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images[0] || '',
      qty: item.qty,
      price: product.price,
    });

    itemsPrice += product.price * item.qty;

    // Decrement stock
    product.stock -= item.qty;
    await product.save();
  }

  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const totalPrice = itemsPrice + shippingPrice;

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice: parseFloat(itemsPrice.toFixed(2)),
    shippingPrice,
    totalPrice: parseFloat(totalPrice.toFixed(2)),
  });

  res.status(201).json(order);
});

// @desc    Get logged-in user's orders
// @route   GET /api/orders/mine
// @access  Protected
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Protected
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Users can only view their own orders (admins can view all)
  if (!req.user.isAdmin && order.user._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }

  res.json(order);
});

// @desc    Mark order as paid
// @route   PUT /api/orders/:id/pay
// @access  Protected
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (!req.user.isAdmin && order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  if (order.isPaid) {
    res.status(400);
    throw new Error('Order is already paid');
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    updateTime: req.body.update_time,
    emailAddress: req.body.payer?.email_address,
  };

  const updated = await order.save();
  res.json(updated);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  res.json(orders);
});

export { createOrder, getMyOrders, getOrderById, updateOrderToPaid, getAllOrders };
