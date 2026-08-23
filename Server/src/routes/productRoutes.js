// src/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  deleteMultipleProducts,
  updateStock,
  toggleFeature,
  getProductStats,
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', getProducts);

// IMPORTANT: Put specific routes BEFORE dynamic routes
router.get('/stats', protect, adminOnly, getProductStats); // Move this BEFORE /:id
router.get('/:id', getProductById); // This must come AFTER specific routes

// Admin only routes
router.post(
  '/',
  protect,
  adminOnly,
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'moreImages', maxCount: 5 }
  ]),
  createProduct
);

router.put(
  '/:id',
  protect,
  adminOnly,
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'moreImages', maxCount: 5 }
  ]),
  updateProduct
);

router.delete('/:id', protect, adminOnly, deleteProduct);
router.delete('/', protect, adminOnly, deleteMultipleProducts);
router.patch('/:id/stock', protect, adminOnly, updateStock);
router.patch('/:id/feature', protect, adminOnly, toggleFeature);

module.exports = router;