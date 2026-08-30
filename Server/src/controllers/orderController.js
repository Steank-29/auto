const Order = require('../models/Order');
const paypal = require('../config/paypalConfig');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Public
exports.createOrder = async (req, res) => {
  try {
    const { items, customer, subtotal, shipping, total } = req.body;

    // Validate required fields
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items in order'
      });
    }

    // Create the payment JSON
    const create_payment_json = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal'
      },
      redirect_urls: {
        return_url: `${process.env.PAYPAL_RETURN_URL}`,
        cancel_url: `${process.env.PAYPAL_CANCEL_URL}`
      },
      transactions: [
        {
          item_list: {
            items: items.map((item, index) => ({
              name: item.name || `Product ${index + 1}`,
              sku: item.productId || `SKU-${index + 1}`,
              price: Number(item.price).toFixed(2),
              currency: 'EUR',
              quantity: Number(item.quantity)
            }))
          },
          amount: {
            currency: 'EUR',
            total: Number(total).toFixed(2),
            details: {
              subtotal: Number(subtotal).toFixed(2),
              shipping: Number(shipping).toFixed(2)
            }
          },
          description: `Order from Prestige Auto - ${items.length} items`
        }
      ]
    };

    // Create the payment
    paypal.payment.create(create_payment_json, async (error, payment) => {
      if (error) {
        console.error('❌ PayPal Error:', error);
        
        let errorMessage = 'Error creating PayPal payment';
        if (error.response && error.response.error === 'invalid_client') {
          errorMessage = 'Invalid PayPal client credentials. Please check your Client ID and Secret.';
        } else if (error.response && error.response.error_description) {
          errorMessage = error.response.error_description;
        } else if (error.message) {
          errorMessage = error.message;
        }

        return res.status(400).json({
          success: false,
          message: errorMessage,
          details: error.response || error.message
        });
      }

      try {
        // Save order to database
        const newOrder = new Order({
          orderId: payment.id,
          customer: {
            fullName: customer.fullName || '',
            email: customer.email || '',
            phone: customer.phone || '',
            address: customer.address || '',
            city: customer.city || '',
            postalCode: customer.postalCode || '',
            country: customer.country || 'Italia',
            notes: customer.notes || ''
          },
          items: items.map(item => ({
            productId: item.productId,
            name: item.name,
            brand: item.brand || '',
            model: item.model || '',
            price: Number(item.price),
            quantity: Number(item.quantity),
            selectedLogo: item.selectedLogo || ''
          })),
          subtotal: Number(subtotal),
          shipping: Number(shipping),
          total: Number(total),
          paymentStatus: 'pending',
          paymentMethod: 'paypal',
          orderDate: new Date(),
          status: 'pending'
        });
        
        await newOrder.save();

        // Get approval URL
        const approvalUrl = payment.links.find(link => link.rel === 'approval_url');
        
        if (!approvalUrl) {
          return res.status(500).json({
            success: false,
            message: 'No approval URL found'
          });
        }

        res.json({
          success: true,
          approvalUrl: approvalUrl.href,
          paymentId: payment.id,
          orderId: newOrder._id
        });
      } catch (dbError) {
        console.error('❌ Database error:', dbError);
        res.status(500).json({
          success: false,
          message: 'Error saving order to database',
          error: dbError.message
        });
      }
    });
  } catch (error) {
    console.error('❌ Server error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating payment',
      error: error.message
    });
  }
};

// @desc    Handle PayPal success callback
// @route   GET /api/orders/success
// @access  Public
exports.paypalSuccess = async (req, res) => {
  const { paymentId, PayerID } = req.query;

  if (!paymentId || !PayerID) {
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5172'}/checkout?payment=failed`);
  }

  try {
    // Execute the payment
    const execute_payment_json = {
      payer_id: PayerID,
      transactions: [{
        amount: {
          currency: 'EUR',
          total: '0.00'
        }
      }]
    };

    paypal.payment.get(paymentId, async (error, payment) => {
      if (error) {
        console.error('❌ Error getting payment:', error);
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5172'}/checkout?payment=failed`);
      }

      const total = payment.transactions[0].amount.total;
      execute_payment_json.transactions[0].amount.total = total;

      paypal.payment.execute(paymentId, execute_payment_json, async (error, payment) => {
        if (error) {
          console.error('❌ Error executing payment:', error);
          return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5172'}/checkout?payment=failed`);
        }

        try {
          const order = await Order.findOne({ orderId: paymentId });
          if (order) {
            order.paymentStatus = 'completed';
            order.status = 'confirmed';
            order.payerId = PayerID;
            order.paymentDetails = payment;
            order.paymentDate = new Date();
            await order.save();
            
            return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5172'}/checkout?payment=success&orderId=${order._id}`);
          } else {
            return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5172'}/checkout?payment=success`);
          }
        } catch (dbError) {
          console.error('❌ Database error:', dbError);
          return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5172'}/checkout?payment=failed`);
        }
      });
    });
  } catch (error) {
    console.error('❌ Payment execution error:', error);
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5172'}/checkout?payment=failed`);
  }
};

// @desc    Handle PayPal cancel callback
// @route   GET /api/orders/cancel
// @access  Public
exports.paypalCancel = (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5172'}/checkout?payment=cancelled`);
};

// ============ ADMIN CONTROLLERS ============

// @desc    Get all orders with pagination and filters
// @route   GET /api/admin/orders
// @access  Private (Admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter
    const filter = {};
    
    // Search by order ID or customer name/email
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { orderId: searchRegex },
        { 'customer.fullName': searchRegex },
        { 'customer.email': searchRegex },
        { 'customer.phone': searchRegex }
      ];
    }
    
    // Filter by status
    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status;
    }
    
    // Filter by payment status
    if (req.query.paymentStatus && req.query.paymentStatus !== 'all') {
      filter.paymentStatus = req.query.paymentStatus;
    }
    
    // Filter by date range
    if (req.query.startDate) {
      filter.orderDate = { $gte: new Date(req.query.startDate) };
    }
    if (req.query.endDate) {
      filter.orderDate = { 
        ...filter.orderDate, 
        $lte: new Date(req.query.endDate) 
      };
    }
    
    // Filter by min/max total
    if (req.query.minTotal) {
      filter.total = { $gte: parseFloat(req.query.minTotal) };
    }
    if (req.query.maxTotal) {
      filter.total = { 
        ...filter.total, 
        $lte: parseFloat(req.query.maxTotal) 
      };
    }

    const orders = await Order.find(filter)
      .sort({ orderDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(filter);

    // Get statistics
    const stats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$total' },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          completedOrders: {
            $sum: { $cond: [{ $eq: ['$paymentStatus', 'completed'] }, 1, 0] }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats: stats[0] || {
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        completedOrders: 0
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// @desc    Get single order by ID
// @route   GET /api/admin/orders/:id
// @access  Private (Admin only)
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private (Admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }

    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.status = status;
    await order.save();

    res.json({
      success: true,
      data: order,
      message: `Order status updated to ${status}`
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
};

// @desc    Update order payment status
// @route   PUT /api/admin/orders/:id/payment
// @access  Private (Admin only)
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    
    if (!paymentStatus) {
      return res.status(400).json({
        success: false,
        message: 'Payment status is required'
      });
    }

    const validStatuses = ['pending', 'completed', 'failed', 'refunded'];
    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment status. Must be one of: ' + validStatuses.join(', ')
      });
    }

    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.paymentStatus = paymentStatus;
    if (paymentStatus === 'completed') {
      order.paymentDate = new Date();
    }
    await order.save();

    res.json({
      success: true,
      data: order,
      message: `Payment status updated to ${paymentStatus}`
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating payment status',
      error: error.message
    });
  }
};

// @desc    Delete order
// @route   DELETE /api/admin/orders/:id
// @access  Private (Admin only)
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    await order.deleteOne();

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting order',
      error: error.message
    });
  }
};

// @desc    Delete multiple orders
// @route   DELETE /api/admin/orders
// @access  Private (Admin only)
exports.deleteMultipleOrders = async (req, res) => {
  try {
    const { orderIds } = req.body;
    
    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of order IDs'
      });
    }

    const result = await Order.deleteMany({ _id: { $in: orderIds } });

    res.json({
      success: true,
      message: `${result.deletedCount} orders deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error deleting orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting orders',
      error: error.message
    });
  }
};

// @desc    Get order statistics
// @route   GET /api/admin/orders/stats
// @access  Private (Admin only)
exports.getOrderStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$total' },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          confirmedOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] }
          },
          shippedOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'shipped'] }, 1, 0] }
          },
          deliveredOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          },
          completedPayments: {
            $sum: { $cond: [{ $eq: ['$paymentStatus', 'completed'] }, 1, 0] }
          },
          pendingPayments: {
            $sum: { $cond: [{ $eq: ['$paymentStatus', 'pending'] }, 1, 0] }
          },
          failedPayments: {
            $sum: { $cond: [{ $eq: ['$paymentStatus', 'failed'] }, 1, 0] }
          },
          refundedPayments: {
            $sum: { $cond: [{ $eq: ['$paymentStatus', 'refunded'] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalOrders: 1,
          totalRevenue: 1,
          pendingOrders: 1,
          confirmedOrders: 1,
          shippedOrders: 1,
          deliveredOrders: 1,
          cancelledOrders: 1,
          completedPayments: 1,
          pendingPayments: 1,
          failedPayments: 1,
          refundedPayments: 1
        }
      }
    ]);

    // Get daily sales for chart (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailySales = await Order.aggregate([
      {
        $match: {
          orderDate: { $gte: sevenDaysAgo },
          paymentStatus: 'completed'
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$orderDate' } },
          date: { $first: '$orderDate' },
          totalRevenue: { $sum: '$total' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json({
      success: true,
      stats: stats[0] || {
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        confirmedOrders: 0,
        shippedOrders: 0,
        deliveredOrders: 0,
        cancelledOrders: 0,
        completedPayments: 0,
        pendingPayments: 0,
        failedPayments: 0,
        refundedPayments: 0
      },
      dailySales
    });
  } catch (error) {
    console.error('Error fetching order stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order statistics',
      error: error.message
    });
  }
};