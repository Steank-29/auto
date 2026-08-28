const paypal = require('paypal-rest-sdk');

// Debug: Log the credentials (remove in production)
console.log('=== PayPal Configuration ===');
console.log('PAYPAL_MODE:', process.env.PAYPAL_MODE);
console.log('PAYPAL_CLIENT_ID exists:', !!process.env.PAYPAL_CLIENT_ID);
console.log('PAYPAL_CLIENT_SECRET exists:', !!process.env.PAYPAL_CLIENT_SECRET);
console.log('PAYPAL_RETURN_URL:', process.env.PAYPAL_RETURN_URL);
console.log('PAYPAL_CANCEL_URL:', process.env.PAYPAL_CANCEL_URL);
console.log('=============================');

// Make sure the credentials are properly loaded
const clientId = 'BAA1RZOo3yNwYdN2S0PHcnVbizs7kj8V-oZ9NAqdkzEVU5EvaVMrxseckA1chrPKHy5jipQgNXpyixnYjI';
const clientSecret = 'EC0v9k8TNFuaCdOgjEO45ZFEOfo8maXJdVqt7D5BtxVSZTyEb-7iAiQ0NLRgBshTHCNyhsWDVXKb5gG_';

if (!clientId || !clientSecret) {
  console.error('❌ PayPal credentials missing! Please check your .env file');
  throw new Error('PayPal credentials are required');
}

// Configure PayPal
paypal.configure({
  mode: process.env.PAYPAL_MODE || 'live',
  client_id: clientId.trim(), // Remove any whitespace
  client_secret: clientSecret.trim(), // Remove any whitespace
});

console.log('✅ PayPal configured successfully');

module.exports = paypal;
