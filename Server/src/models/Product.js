// src/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters'],
  },
  brand: {
    type: String,
    required: [true, 'Please add a brand'],
    enum: ['BMW', 'Audi', 'Mercedes', 'Porsche', 'Volkswagen', 'Other'],
    index: true,
  },
  model: {
    type: String,
    required: [true, 'Please add a model'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price cannot be negative'],
  },
  discountPrice: {
    type: Number,
    min: [0, 'Discount price cannot be negative'],
    default: null,
  },
  stock: {
    type: Number,
    required: [true, 'Please add stock quantity'],
    min: [0, 'Stock cannot be negative'],
    default: 0,
  },
  mainImage: {
    type: String,
    required: [true, 'Please add a main image'],
  },
  moreImages: {
    type: [String],
    default: [],
  },
  features: {
    waterproof: {
      type: Boolean,
      default: false,
      index: true,
    },
    brightness: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Premium'],
      default: 'Medium',
    },
    installation: {
      type: String,
      enum: ['Plug & Play', 'Professional', 'DIY'],
      default: 'Plug & Play',
    },
    warranty: {
      type: Number,
      default: 12,
      description: 'Warranty in months',
    },
  },
  specifications: {
    type: Map,
    of: String,
    default: {},
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
    index: true,
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },
  category: {
    type: String,
    enum: ['Side Door', 'Front Logo', 'Trank Logo', 'Custom'],
    required: [true, 'Please add a category'],
    index: true,
  },
  compatibleCars: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp - NO next()
productSchema.pre('findOneAndUpdate', async function () {
  this.set({ updatedAt: Date.now() });
});

// Indexes for better performance
productSchema.index({ name: 'text', brand: 'text', model: 'text' });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Product', productSchema);