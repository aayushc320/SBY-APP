const express = require('express');
const router = express.Router();
const {
  createPaymentIntent,
  createSubscription,
  handleWebhook,
  purchaseCredits,
  getPaymentHistory,
  generateInvoice,
  cancelSubscription
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

// Payment routes
router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/create-subscription', protect, createSubscription);
router.post('/purchase-credits', protect, purchaseCredits);
router.get('/history', protect, getPaymentHistory);
router.get('/invoice/:transactionId', protect, generateInvoice);
router.delete('/subscription', protect, cancelSubscription);

// Stripe webhook - needs raw body
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  handleWebhook
);

module.exports = router; 