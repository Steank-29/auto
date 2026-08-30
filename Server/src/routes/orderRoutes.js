const express = require('express');
const router = express.Router();
const {
  createOrder,
  paypalSuccess,
  paypalCancel,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  deleteOrder,
  deleteMultipleOrders,
  getOrderStats
} = require('../controllers/orderController');

// Public routes
router.post('/create-order', createOrder);
router.get('/success', paypalSuccess);
router.get('/cancel', paypalCancel);

// Admin routes (protected by auth middleware)
router.get('/admin/orders', getAllOrders);
router.get('/admin/orders/stats', getOrderStats);
router.get('/admin/orders/:id', getOrderById);
router.put('/admin/orders/:id/status', updateOrderStatus);
router.put('/admin/orders/:id/payment', updatePaymentStatus);
router.delete('/admin/orders/:id', deleteOrder);
router.delete('/admin/orders', deleteMultipleOrders);

module.exports = router;