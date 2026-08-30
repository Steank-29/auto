const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  customer: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: 'Italia' },
    notes: { type: String }
  },
  items: [{
    productId: { type: String, required: true },
    name: { type: String, required: true },
    brand: { type: String },
    model: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    selectedLogo: { type: String }
  }],
  subtotal: { type: Number, required: true },
  shipping: { type: Number, required: true },
  total: { type: Number, required: true },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: { type: String, default: 'paypal' },
  payerId: { type: String },
  paymentDetails: { type: Object },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  orderDate: { type: Date, default: Date.now },
  paymentDate: { type: Date },
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);