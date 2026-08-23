// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
  changePassword,
} = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.post('/register', upload.single('image'), registerAdmin);
router.post('/login', loginAdmin);

// Protected routes (Admin only)
router.get('/profile', protect, adminOnly, getAdminProfile);
router.put('/profile', protect, adminOnly, upload.single('image'), updateAdminProfile);
router.put('/password', protect, adminOnly, changePassword);

module.exports = router;