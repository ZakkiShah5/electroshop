import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  getAllOrders,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin: GET /api/orders | Protected: POST /api/orders
router.route('/').get(protect, admin, getAllOrders).post(protect, createOrder);

// Must come before /:id to avoid 'mine' being treated as an ObjectId
router.get('/mine', protect, getMyOrders);

router.route('/:id').get(protect, getOrderById);
router.put('/:id/pay', protect, updateOrderToPaid);

export default router;
