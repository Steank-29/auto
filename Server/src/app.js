// src/app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const contactRoutes = require('./routes/contactRoutes');
const paypalRoutes = require('./routes/paypalRoutes');

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5172', 'http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (for uploaded images)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/paypal', paypalRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: '✅ Prestige Auto API is running!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📧 Admin Email: ${process.env.ADMIN_EMAIL}`);
  console.log(`🔐 JWT Secret: ${process.env.JWT_SECRET.substring(0, 20)}...`);
  console.log(`📁 Uploads: http://localhost:${PORT}/uploads`);
  console.log('\n📚 Available endpoints:');
  console.log(`   POST   /api/auth/register (with image)`);
  console.log(`   POST   /api/auth/login`);
  console.log(`   GET    /api/auth/profile`);
  console.log(`   PUT    /api/auth/profile (with image)`);
  console.log(`   GET    /api/products`);
  console.log(`   POST   /api/products (Admin only)`);
});