const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const YogaClass = require('../models/YogaClass');
const Transaction = require('../models/Transaction');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

// Credit packages
const CREDIT_PACKAGES = {
  small: { credits: 10, price: 2000 },    // $20 for 10 credits
  medium: { credits: 25, price: 4500 },   // $45 for 25 credits
  large: { credits: 50, price: 8000 },    // $80 for 50 credits
  premium: { credits: 100, price: 15000 } // $150 for 100 credits
};

// Subscription plans
const SUBSCRIPTION_PLANS = {
  monthly: {
    basic: process.env.STRIPE_BASIC_MONTHLY_PRICE_ID,
    premium: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID,
  },
  biannual: {
    basic: process.env.STRIPE_BASIC_BIANNUAL_PRICE_ID,
    premium: process.env.STRIPE_PREMIUM_BIANNUAL_PRICE_ID,
  },
  annual: {
    basic: process.env.STRIPE_BASIC_ANNUAL_PRICE_ID,
    premium: process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID,
  }
};

// @desc    Create payment intent for class registration
// @route   POST /api/payments/create-payment-intent
// @access  Private
exports.createPaymentIntent = async (req, res) => {
  try {
    const { classId } = req.body;

    // Find the class
    const yogaClass = await YogaClass.findById(classId);

    if (!yogaClass) {
      return res.status(404).json({
        success: false,
        message: 'Yoga class not found',
      });
    }

    // Check if class is full
    if (yogaClass.participants.length >= yogaClass.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: 'This class is already full',
      });
    }

    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: yogaClass.price * 100, // Stripe uses cents
      currency: 'usd',
      metadata: {
        userId: req.user.id,
        classId: yogaClass._id.toString(),
        type: 'class_purchase'
      },
    });

    // Create a pending transaction
    await Transaction.create({
      user: req.user.id,
      type: 'class_purchase',
      amount: yogaClass.price,
      description: `Payment for class: ${yogaClass.title}`,
      stripePaymentIntentId: paymentIntent.id,
      metadata: { classId: yogaClass._id }
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing payment',
      error: error.message,
    });
  }
};

// @desc    Purchase credits
// @route   POST /api/payments/purchase-credits
// @access  Private
exports.purchaseCredits = async (req, res) => {
  try {
    const { packageType, paymentMethodId } = req.body;

    // Validate package type
    if (!CREDIT_PACKAGES[packageType]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credit package',
      });
    }

    const package = CREDIT_PACKAGES[packageType];
    const user = await User.findById(req.user.id);

    // Create or get customer
    let customerId = user.subscription?.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
      });
      customerId = customer.id;
      
      // Update user with customer ID
      await User.findByIdAndUpdate(req.user.id, {
        'subscription.stripeCustomerId': customerId
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: package.price,
      currency: 'usd',
      customer: customerId,
      payment_method: paymentMethodId,
      metadata: {
        userId: req.user.id,
        type: 'credit_purchase',
        credits: package.credits,
        packageType
      },
      confirm: true,
    });

    // Create a transaction
    const transaction = await Transaction.create({
      user: req.user.id,
      type: 'credit_purchase',
      amount: package.price / 100, // Convert from cents
      status: paymentIntent.status === 'succeeded' ? 'completed' : 'pending',
      description: `Purchase of ${package.credits} credits`,
      stripePaymentIntentId: paymentIntent.id,
      credits: package.credits,
      metadata: { packageType }
    });

    // If payment succeeded immediately, update user credits
    if (paymentIntent.status === 'succeeded') {
      await User.findByIdAndUpdate(req.user.id, {
        $inc: { credits: package.credits }
      });
    }

    res.status(200).json({
      success: true,
      paymentIntent,
      credits: package.credits,
      transaction
    });
  } catch (error) {
    console.error('Credit purchase error:', error);
    res.status(500).json({
      success: false,
      message: 'Error purchasing credits',
      error: error.message,
    });
  }
};

// @desc    Create a subscription
// @route   POST /api/payments/create-subscription
// @access  Private
exports.createSubscription = async (req, res) => {
  try {
    const { paymentMethodId, plan, tier } = req.body;

    // Validate plan and tier
    if (!SUBSCRIPTION_PLANS[plan] || !SUBSCRIPTION_PLANS[plan][tier]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subscription plan or tier',
      });
    }

    const priceId = SUBSCRIPTION_PLANS[plan][tier];
    
    // Get user
    const user = await User.findById(req.user.id);

    // If customer doesn't have a stripe customer ID, create one
    let customerId = user.subscription?.stripeCustomerId;

    if (!customerId) {
      // Create a new customer
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        payment_method: paymentMethodId,
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });

      customerId = customer.id;
    } else {
      // Update the customer's payment method
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });

      await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
    }

    // Create the subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        userId: req.user.id,
        plan,
        tier
      }
    });

    // Get payment method details
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
    
    // Update user's subscription details
    await User.findByIdAndUpdate(req.user.id, {
      'subscription.type': tier,
      'subscription.plan': plan,
      'subscription.startDate': new Date(),
      'subscription.status': subscription.status,
      'subscription.stripeCustomerId': customerId,
      'subscription.stripeSubscriptionId': subscription.id,
      $push: {
        paymentMethods: {
          stripePaymentMethodId: paymentMethodId,
          brand: paymentMethod.card.brand,
          last4: paymentMethod.card.last4,
          expMonth: paymentMethod.card.exp_month,
          expYear: paymentMethod.card.exp_year,
          isDefault: true
        }
      }
    });

    // Create transaction for the subscription
    await Transaction.create({
      user: req.user.id,
      type: 'subscription_payment',
      amount: subscription.latest_invoice.amount_paid / 100,
      status: 'completed',
      description: `${plan} subscription - ${tier} tier`,
      stripePaymentIntentId: subscription.latest_invoice.payment_intent?.id,
      stripeInvoiceId: subscription.latest_invoice.id,
      metadata: { plan, tier, subscriptionId: subscription.id }
    });

    res.status(200).json({
      success: true,
      subscription,
    });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating subscription',
      error: error.message,
    });
  }
};

// @desc    Get user payment history
// @route   GET /api/payments/history
// @access  Private
exports.getPaymentHistory = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment history',
      error: error.message
    });
  }
};

// @desc    Generate an invoice
// @route   GET /api/payments/invoice/:transactionId
// @access  Private
exports.generateInvoice = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.transactionId)
      .populate('user', 'name email address');
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }
    
    // Check if user is requesting their own transaction
    if (transaction.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this invoice'
      });
    }

    // Create invoice directory if it doesn't exist
    const invoiceDir = path.join(__dirname, '../public/invoices');
    if (!fs.existsSync(invoiceDir)) {
      fs.mkdirSync(invoiceDir, { recursive: true });
    }

    const invoiceNumber = `INV-${transaction._id.toString().slice(-6)}`;
    const invoicePath = path.join(invoiceDir, `${invoiceNumber}.pdf`);
    
    // Create PDF document
    const doc = new PDFDocument({ margin: 50 });
    
    // Pipe to file
    doc.pipe(fs.createWriteStream(invoicePath));
    
    // Add content
    doc.fontSize(20).text('Strong By Yoga', { align: 'center' });
    doc.fontSize(14).text('INVOICE', { align: 'center' });
    doc.moveDown();
    
    // Add invoice info
    doc.fontSize(10)
      .text(`Invoice Number: ${invoiceNumber}`)
      .text(`Date: ${new Date(transaction.createdAt).toLocaleDateString()}`)
      .text(`Customer: ${transaction.user.name}`)
      .text(`Email: ${transaction.user.email}`);
    
    doc.moveDown();
    
    // Add table header
    doc.fontSize(12)
      .text('Description', 50, doc.y, { width: 250 })
      .text('Amount', 300, doc.y, { width: 100 })
      .text('Status', 400, doc.y, { width: 100 });
    
    doc.moveDown();
    
    // Add transaction details
    doc.fontSize(10)
      .text(transaction.description, 50, doc.y, { width: 250 })
      .text(`$${transaction.amount.toFixed(2)}`, 300, doc.y, { width: 100 })
      .text(transaction.status, 400, doc.y, { width: 100 });
    
    doc.moveDown(2);
    
    // Add total
    doc.fontSize(12)
      .text('Total:', 300, doc.y)
      .text(`$${transaction.amount.toFixed(2)}`, 400, doc.y);
    
    // Finalize
    doc.end();
    
    // Return PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${invoiceNumber}.pdf`);
    fs.createReadStream(invoicePath).pipe(res);
    
  } catch (error) {
    console.error('Error generating invoice:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating invoice',
      error: error.message
    });
  }
};

// @desc    Cancel subscription
// @route   DELETE /api/payments/subscription
// @access  Private
exports.cancelSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user.subscription.stripeSubscriptionId) {
      return res.status(400).json({
        success: false,
        message: 'No active subscription found'
      });
    }
    
    // Cancel at period end
    await stripe.subscriptions.update(user.subscription.stripeSubscriptionId, {
      cancel_at_period_end: true
    });
    
    // Update user record
    await User.findByIdAndUpdate(req.user.id, {
      'subscription.autoRenew': false
    });
    
    res.status(200).json({
      success: true,
      message: 'Subscription will be canceled at the end of the billing period'
    });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Error canceling subscription',
      error: error.message
    });
  }
};

// @desc    Handle webhook events from Stripe
// @route   POST /api/payments/webhook
// @access  Public
exports.handleWebhook = async (req, res) => {
  const signature = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  // Handle specific events
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      await handleSuccessfulPayment(paymentIntent);
      break;
    case 'payment_intent.payment_failed':
      await handleFailedPayment(event.data.object);
      break;
    case 'invoice.payment_succeeded':
      await handleSuccessfulInvoicePayment(event.data.object);
      break;
    case 'invoice.payment_failed':
      await handleFailedInvoicePayment(event.data.object);
      break;
    case 'customer.subscription.updated':
      await handleSubscriptionUpdate(event.data.object);
      break;
    case 'customer.subscription.deleted':
      await handleCanceledSubscription(event.data.object);
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
};

// Helper function to handle successful payments
const handleSuccessfulPayment = async (paymentIntent) => {
  try {
    const { userId, type, credits, classId } = paymentIntent.metadata;

    if (!userId) return;

    // Update transaction
    await Transaction.findOneAndUpdate(
      { stripePaymentIntentId: paymentIntent.id },
      { status: 'completed' }
    );

    if (type === 'credit_purchase' && credits) {
      // Add credits to user account
      await User.findByIdAndUpdate(userId, {
        $inc: { credits: parseInt(credits) }
      });
    } else if (type === 'class_purchase' && classId) {
      // Add user to class participants
      await YogaClass.findByIdAndUpdate(classId, {
        $addToSet: { participants: userId },
      });

      // Add class to user's enrolled classes
      await User.findByIdAndUpdate(userId, {
        $addToSet: { enrolledClasses: classId },
      });
    }
  } catch (error) {
    console.error('Error handling successful payment:', error);
  }
};

// Helper function to handle failed payments
const handleFailedPayment = async (paymentIntent) => {
  try {
    await Transaction.findOneAndUpdate(
      { stripePaymentIntentId: paymentIntent.id },
      { status: 'failed' }
    );
  } catch (error) {
    console.error('Error handling failed payment:', error);
  }
};

// Helper function to handle successful invoice payments
const handleSuccessfulInvoicePayment = async (invoice) => {
  try {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
    const { userId, plan, tier } = subscription.metadata;

    if (!userId) return;

    // Create transaction record
    await Transaction.create({
      user: userId,
      type: 'subscription_payment',
      amount: invoice.amount_paid / 100,
      status: 'completed',
      description: plan && tier ? `${plan} subscription - ${tier} tier` : 'Subscription payment',
      stripeInvoiceId: invoice.id,
      stripePaymentIntentId: invoice.payment_intent,
      metadata: { subscriptionId: invoice.subscription }
    });

    // Update user's subscription status
    await User.findByIdAndUpdate(userId, {
      'subscription.status': subscription.status
    });
  } catch (error) {
    console.error('Error handling successful invoice payment:', error);
  }
};

// Helper function to handle failed invoice payments
const handleFailedInvoicePayment = async (invoice) => {
  try {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
    const { userId } = subscription.metadata;

    if (!userId) return;

    // Create transaction record
    await Transaction.create({
      user: userId,
      type: 'subscription_payment',
      amount: invoice.amount_due / 100,
      status: 'failed',
      description: 'Failed subscription payment',
      stripeInvoiceId: invoice.id,
      stripePaymentIntentId: invoice.payment_intent,
      metadata: { subscriptionId: invoice.subscription }
    });

    // Update user's subscription status
    await User.findByIdAndUpdate(userId, {
      'subscription.status': subscription.status
    });
  } catch (error) {
    console.error('Error handling failed invoice payment:', error);
  }
};

// Helper function to handle subscription updates
const handleSubscriptionUpdate = async (subscription) => {
  try {
    const { userId } = subscription.metadata;
    
    if (!userId) return;
    
    await User.findByIdAndUpdate(userId, {
      'subscription.status': subscription.status
    });
  } catch (error) {
    console.error('Error handling subscription update:', error);
  }
};

// Helper function to handle canceled subscriptions
const handleCanceledSubscription = async (subscription) => {
  try {
    // Find user with this subscription ID
    const user = await User.findOne({
      'subscription.stripeSubscriptionId': subscription.id,
    });

    if (!user) return;

    // Update user's subscription details
    await User.findByIdAndUpdate(user._id, {
      'subscription.type': 'none',
      'subscription.plan': 'none',
      'subscription.status': 'none',
      'subscription.endDate': new Date(),
      'subscription.autoRenew': false
    });
  } catch (error) {
    console.error('Error handling canceled subscription:', error);
  }
}; 