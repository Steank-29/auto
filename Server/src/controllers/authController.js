// src/controllers/authController.js
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register admin user (with image upload)
// @route   POST /api/auth/register
// @access  Public (remove after first use)
const registerAdmin = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      dateOfBirth, 
      gender 
    } = req.body;

    // Check if image was uploaded
    let imageUrl = '';
    if (req.file) {
      // If using multer, the file will be in req.file
      imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.image) {
      // If image URL was provided in form-data
      imageUrl = req.body.image;
    } else {
      // Generate default avatar
      imageUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2e7d32&color=fff&size=128`;
    }

    // Validate required fields
    if (!name || !email || !password || !dateOfBirth || !gender) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, password, dateOfBirth, gender',
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      dateOfBirth: new Date(dateOfBirth),
      gender,
      image: imageUrl,
      role: 'admin',
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        image: user.image,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Find admin
    const admin = await User.findOne({ email }).select('+password');
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check password
    const isMatch = await admin.matchPassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    res.json({
      success: true,
      token: generateToken(admin._id),
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        dateOfBirth: admin.dateOfBirth,
        gender: admin.gender,
        image: admin.image,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get admin profile
// @route   GET /api/auth/profile
// @access  Private
const getAdminProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id);
    res.json({
      success: true,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        dateOfBirth: admin.dateOfBirth,
        gender: admin.gender,
        image: admin.image,
        role: admin.role,
        createdAt: admin.createdAt,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Update admin profile (with image upload)
// @route   PUT /api/auth/profile
// @access  Private
const updateAdminProfile = async (req, res) => {
  try {
    const { name, dateOfBirth, gender } = req.body;
    
    const admin = await User.findById(req.user.id);
    
    let imageUrl = admin.image;
    
    // Check if new image was uploaded
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }
    
    if (name) admin.name = name;
    if (dateOfBirth) admin.dateOfBirth = dateOfBirth;
    if (gender) admin.gender = gender;
    if (imageUrl) admin.image = imageUrl;
    
    await admin.save();
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        dateOfBirth: admin.dateOfBirth,
        gender: admin.gender,
        image: admin.image,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Change password
// @route   PUT /api/auth/password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const admin = await User.findById(req.user.id).select('+password');
    
    // Check current password
    const isMatch = await admin.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }
    
    admin.password = newPassword;
    await admin.save();
    
    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
  changePassword,
};