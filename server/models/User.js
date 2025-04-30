const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: function() {
      // Email is required only if phoneNumber is not provided and not using OAuth
      return !this.phoneNumber && !this.oauthProvider;
    },
    unique: true,
    sparse: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: function() {
      // Password is required only if phoneNumber is not provided and not using OAuth
      return !this.phoneNumber && !this.oauthProvider;
    },
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'instructor', 'admin'],
    default: 'user'
  },
  avatar: {
    type: String,
    default: 'default.jpg'
  },
  countryCode: {
    type: String,
    default: '+1'
  },
  phoneNumber: {
    type: String,
    unique: true,
    sparse: true,
    required: function() {
      // Phone is required if email is not provided and not using OAuth
      return !this.email && !this.oauthProvider;
    }
  },
  phoneVerified: {
    type: Boolean,
    default: false
  },
  firebaseUid: {
    type: String,
    sparse: true,
    unique: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  oauthProvider: {
    type: String,
    enum: ['google', 'facebook', 'apple', null],
    default: null
  },
  oauthId: {
    type: String
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  emailVerificationToken: String,
  emailVerificationExpire: Date,
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
  },
  phoneOtp: {
    code: String,
    expiry: Date
  },
  credits: {
    type: Number,
    default: 20
  },
  subscription: {
    type: {
      type: String,
      enum: ['none', 'basic', 'premium'],
      default: 'none'
    },
    startDate: Date,
    endDate: Date,
    autoRenew: {
      type: Boolean,
      default: true
    },
    status: {
      type: String,
      enum: ['active', 'canceled', 'past_due', 'trialing', 'unpaid', 'none'],
      default: 'none'
    },
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    plan: {
      type: String,
      enum: ['monthly', 'biannual', 'annual', 'none'],
      default: 'none'
    }
  },
  paymentMethods: [{
    stripePaymentMethodId: String,
    brand: String,
    last4: String,
    expMonth: Number,
    expYear: Number,
    isDefault: {
      type: Boolean,
      default: false
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual field for bookings
UserSchema.virtual('bookings', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'user',
  justOne: false
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) {
    next();
    return;
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password reset token
UserSchema.methods.getResetPasswordToken = function() {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

// Generate email verification token
UserSchema.methods.getEmailVerificationToken = function() {
  // Generate token
  const verificationToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to emailVerificationToken field
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  // Set expire
  this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  return verificationToken;
};

// Generate OTP for phone verification
UserSchema.methods.generatePhoneOtp = function() {
  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Store hashed OTP and expiry
  this.phoneOtp = {
    code: crypto.createHash('sha256').update(otp).digest('hex'),
    expiry: Date.now() + 10 * 60 * 1000 // 10 minutes
  };
  
  return otp;
};

// Verify OTP
UserSchema.methods.verifyPhoneOtp = function(otp) {
  const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
  
  if (!this.phoneOtp || !this.phoneOtp.expiry || this.phoneOtp.expiry < Date.now()) {
    return false; // OTP expired or not set
  }
  
  return this.phoneOtp.code === hashedOtp;
};

// Get full phone number with country code
UserSchema.methods.getFullPhoneNumber = function() {
  return `${this.countryCode}${this.phoneNumber}`;
};

module.exports = mongoose.model('User', UserSchema); 