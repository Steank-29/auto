const express = require('express');
const router = express.Router();
const paypal = require('../config/paypalConfig');
const Order = require('../models/Order');

// Test endpoint to check PayPal configuration
router.get('/test-config', (req, res) => {
  try {
    res.json({
      success: true,
      message: 'PayPal configuration test',
      config: {
        mode: process.env.PAYPAL_MODE,
        client_id: process.env.PAYPAL_CLIENT_ID ? '✓ Set' : '✗ Missing',
        client_secret: process.env.PAYPAL_CLIENT_SECRET ? '✓ Set' : '✗ Missing',
        return_url: process.env.PAYPAL_RETURN_URL,
        cancel_url: process.env.PAYPAL_CANCEL_URL,
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create PayPal Order
router.post('/create-order', async (req, res) => {
  try {
    const { items, customer, subtotal, shipping, total } = req.body;
    
    console.log('📦 Creating PayPal order with:');
    console.log('Items:', items.length);
    console.log('Subtotal:', subtotal);
    console.log('Shipping:', shipping);
    console.log('Total:', total);

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

    console.log('📤 Sending payment request to PayPal...');

    // Create the payment
    paypal.payment.create(create_payment_json, async (error, payment) => {
      if (error) {
        console.error('❌ PayPal Error:', error);
        
        // Detailed error logging
        if (error.response) {
          console.error('Error Response:', error.response);
        }
        if (error.httpStatusCode) {
          console.error('HTTP Status:', error.httpStatusCode);
        }

        // Specific error handling
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

      console.log('✅ PayPal payment created successfully');
      console.log('Payment ID:', payment.id);

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
        console.log('💾 Order saved to database:', newOrder._id);

        // Get approval URL
        const approvalUrl = payment.links.find(link => link.rel === 'approval_url');
        
        if (!approvalUrl) {
          console.error('❌ No approval URL found in PayPal response');
          return res.status(500).json({
            success: false,
            message: 'No approval URL found'
          });
        }

        console.log('🔗 Approval URL:', approvalUrl.href);

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
});

// PayPal Success Callback
router.get('/success', async (req, res) => {
  const { paymentId, PayerID } = req.query;

  console.log('🔙 PayPal Success Callback:', { paymentId, PayerID });

  if (!paymentId || !PayerID) {
    console.error('❌ Missing paymentId or PayerID');
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout?payment=failed`);
  }

  try {
    // Execute the payment
    const execute_payment_json = {
      payer_id: PayerID,
      transactions: [{
        amount: {
          currency: 'EUR',
          total: '0.00' // Will be replaced
        }
      }]
    };

    // First get the payment to get the total
    paypal.payment.get(paymentId, async (error, payment) => {
      if (error) {
        console.error('❌ Error getting payment:', error);
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout?payment=failed`);
      }

      const total = payment.transactions[0].amount.total;
      execute_payment_json.transactions[0].amount.total = total;

      // Execute the payment
      paypal.payment.execute(paymentId, execute_payment_json, async (error, payment) => {
        if (error) {
          console.error('❌ Error executing payment:', error);
          return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout?payment=failed`);
        }

        try {
          // Update order in database
          const order = await Order.findOne({ orderId: paymentId });
          if (order) {
            order.paymentStatus = 'completed';
            order.status = 'confirmed';
            order.payerId = PayerID;
            order.paymentDetails = payment;
            order.paymentDate = new Date();
            await order.save();
            
            console.log('✅ Order updated successfully:', order._id);
            return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout?payment=success&orderId=${order._id}`);
          } else {
            console.warn('⚠️ Order not found in database:', paymentId);
            return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout?payment=success`);
          }
        } catch (dbError) {
          console.error('❌ Database error:', dbError);
          return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout?payment=failed`);
        }
      });
    });
  } catch (error) {
    console.error('❌ Payment execution error:', error);
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout?payment=failed`);
  }
});

// PayPal Cancel Callback
router.get('/cancel', (req, res) => {
  console.log('🔙 PayPal payment cancelled');
  res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout?payment=cancelled`);
});

module.exports = router;