// src/controllers/productController.js
const Product = require('../models/Product');

// @desc    Create a product (with image upload)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      model,
      description,
      price,
      discountPrice,
      stock,
      category,
      compatibleCars,
      isFeatured,
      features,
      specifications,
    } = req.body;

    // Handle main image
    let mainImage = '';
    if (req.files && req.files.mainImage) {
      mainImage = `/uploads/${req.files.mainImage[0].filename}`;
    } else if (req.body.mainImage) {
      mainImage = req.body.mainImage;
    }

    // Handle more images
    let moreImages = [];
    if (req.files && req.files.moreImages) {
      moreImages = req.files.moreImages.map(file => `/uploads/${file.filename}`);
    } else if (req.body.moreImages) {
      try {
        moreImages = JSON.parse(req.body.moreImages);
      } catch {
        moreImages = req.body.moreImages ? [req.body.moreImages] : [];
      }
    }

    // Parse features if sent as JSON string
    let parsedFeatures = {};
    if (features) {
      try {
        parsedFeatures = typeof features === 'string' ? JSON.parse(features) : features;
      } catch {
        parsedFeatures = {};
      }
    }

    // Parse specifications if sent as JSON string
    let parsedSpecifications = {};
    if (specifications) {
      try {
        parsedSpecifications = typeof specifications === 'string' ? JSON.parse(specifications) : specifications;
      } catch {
        parsedSpecifications = {};
      }
    }

    // Parse compatibleCars if sent as JSON string
    let parsedCompatibleCars = [];
    if (compatibleCars) {
      try {
        parsedCompatibleCars = typeof compatibleCars === 'string' ? JSON.parse(compatibleCars) : compatibleCars;
      } catch {
        parsedCompatibleCars = compatibleCars ? [compatibleCars] : [];
      }
    }

    // Validate required fields
    if (!name || !brand || !model || !description || !price || !stock || !mainImage || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, brand, model, description, price, stock, mainImage, category',
      });
    }

    const product = await Product.create({
      name,
      brand,
      model,
      description,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : null,
      stock: Number(stock),
      mainImage,
      moreImages,
      features: {
        waterproof: parsedFeatures.waterproof === 'true' || parsedFeatures.waterproof === true || false,
        brightness: parsedFeatures.brightness || 'Medium',
        installation: parsedFeatures.installation || 'Plug & Play',
        warranty: parsedFeatures.warranty ? Number(parsedFeatures.warranty) : 12,
      },
      specifications: parsedSpecifications,
      category,
      compatibleCars: parsedCompatibleCars,
      isFeatured: isFeatured === 'true' || isFeatured === true || false,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get all products with filtering
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const {
      brand,
      category,
      minPrice,
      maxPrice,
      minRating,
      inStock,
      isFeatured,
      search,
      sortBy,
      order,
      limit,
      page,
    } = req.query;

    // Build filter object
    const filter = {};
    if (brand) filter.brand = brand;
    if (category) filter.category = category;
    if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';
    if (inStock === 'true') filter.stock = { $gt: 0 };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (minRating) filter.rating = { $gte: Number(minRating) };

    // Search
    if (search) {
      filter.$text = { $search: search };
    }

    // Pagination
    const pageSize = Number(limit) || 10;
    const currentPage = Number(page) || 1;
    const skip = (currentPage - 1) * pageSize;

    // Sorting
    let sort = {};
    if (sortBy) {
      sort[sortBy] = order === 'desc' ? -1 : 1;
    } else {
      sort = { createdAt: -1 };
    }

    const products = await Product.find(filter)
      .sort(sort)
      .limit(pageSize)
      .skip(skip);

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Update product (with image upload)
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const updateData = { ...req.body };

    // Handle main image upload
    if (req.files && req.files.mainImage) {
      updateData.mainImage = `/uploads/${req.files.mainImage[0].filename}`;
    }

    // Handle more images upload
    if (req.files && req.files.moreImages) {
      const newImages = req.files.moreImages.map(file => `/uploads/${file.filename}`);
      updateData.moreImages = [...(product.moreImages || []), ...newImages];
    }

    // Parse JSON fields if they are strings
    if (typeof updateData.features === 'string') {
      try {
        updateData.features = JSON.parse(updateData.features);
      } catch {
        updateData.features = {};
      }
    }

    if (typeof updateData.specifications === 'string') {
      try {
        updateData.specifications = JSON.parse(updateData.specifications);
      } catch {
        updateData.specifications = {};
      }
    }

    if (typeof updateData.compatibleCars === 'string') {
      try {
        updateData.compatibleCars = JSON.parse(updateData.compatibleCars);
      } catch {
        updateData.compatibleCars = updateData.compatibleCars ? [updateData.compatibleCars] : [];
      }
    }

    // Convert price and stock to numbers
    if (updateData.price) updateData.price = Number(updateData.price);
    if (updateData.discountPrice) updateData.discountPrice = Number(updateData.discountPrice);
    if (updateData.stock) updateData.stock = Number(updateData.stock);

    // Convert isFeatured to boolean
    if (updateData.isFeatured !== undefined) {
      updateData.isFeatured = updateData.isFeatured === 'true' || updateData.isFeatured === true;
    }

    updateData.updatedAt = Date.now();

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Delete multiple products
// @route   DELETE /api/products
// @access  Private/Admin
const deleteMultipleProducts = async (req, res) => {
  try {
    const { productIds } = req.body;
    
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide product IDs',
      });
    }

    const result = await Product.deleteMany({ _id: { $in: productIds } });
    
    res.json({
      success: true,
      message: `${result.deletedCount} products deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Update product stock
// @route   PATCH /api/products/:id/stock
// @access  Private/Admin
const updateStock = async (req, res) => {
  try {
    const { stock } = req.body;
    
    if (stock === undefined || stock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid stock quantity',
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stock: Number(stock), updatedAt: Date.now() },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Toggle product feature
// @route   PATCH /api/products/:id/feature
// @access  Private/Admin
const toggleFeature = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    product.isFeatured = !product.isFeatured;
    await product.save();

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get product stats for dashboard
// @route   GET /api/products/stats
// @access  Private/Admin
const getProductStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const featuredProducts = await Product.countDocuments({ isFeatured: true });
    const outOfStock = await Product.countDocuments({ stock: 0 });
    const lowStock = await Product.countDocuments({ stock: { $lte: 5, $gt: 0 } });
    
    const brandStats = await Product.aggregate([
      { $group: { _id: '$brand', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const categoryStats = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      data: {
        totalProducts,
        featuredProducts,
        outOfStock,
        lowStock,
        brandStats,
        categoryStats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  deleteMultipleProducts,
  updateStock,
  toggleFeature,
  getProductStats,
};