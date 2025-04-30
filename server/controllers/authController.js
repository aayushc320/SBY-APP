const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const sendSMS = require('../utils/sendSMS');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// Initialize Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// @desc    Register user with email/password
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, phoneNumber, countryCode } = req.body;

  // Check if user exists with email
  if (email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return next(new ErrorResponse('Email already in use', 400));
    }
  }

  // Check if user exists with phone number
  if (phoneNumber) {
    const phoneExists = await User.findOne({ phoneNumber });
    if (phoneExists) {
      return next(new ErrorResponse('Phone number already in use', 400));
    }
  }

  // Create user object with provided fields
  const userData = { 
    name, 
    password,
    credits: 20, // Set default credits to 20
    subscription: {
      type: 'none',
      status: 'none',
      plan: 'none'
    }
  };
  
  // Add email if provided
  if (email) {
    userData.email = email;
  }
  
  // Add phone number and country code if provided
  if (phoneNumber) {
    userData.phoneNumber = phoneNumber;
    if (countryCode) {
      userData.countryCode = countryCode;
    }
  }

  // Create user
  const user = await User.create(userData);

  // Skip email verification for now
  // Set user as verified by default to avoid email sending issues
  user.isEmailVerified = true;
  await user.save({ validateBeforeSave: false });

  // Generate token
  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      countryCode: user.countryCode,
      role: user.role,
      isEmailVerified: user.isEmailVerified
    },
  });
});

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
exports.verifyEmail = asyncHandler(async (req, res, next) => {
  // Get token from params
  const { token } = req.params;

  // Hash the token
  const emailVerificationToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  // Find user by token
  const user = await User.findOne({
    emailVerificationToken,
    emailVerificationExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse('Invalid or expired token', 400));
  }

  // Set user as verified
  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Email verified successfully',
  });
});

// @desc    Login user with email/password
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Update last login
  user.lastLogin = Date.now();
  await user.save({ validateBeforeSave: false });

  sendTokenResponse(user, 200, res);
});

// @desc    Request OTP for phone login
// @route   POST /api/auth/phone/request-otp
// @access  Public
exports.requestPhoneOtp = asyncHandler(async (req, res, next) => {
  const { phoneNumber, countryCode = '+1' } = req.body;

  if (!phoneNumber) {
    return next(new ErrorResponse('Please provide a phone number', 400));
  }
  
  // Normalize phone number - remove any non-numeric characters except leading +
  const normalizedPhone = phoneNumber.replace(/\D(?!\+)/g, '');
  
  // Check if user exists
  let user = await User.findOne({ phoneNumber: normalizedPhone });

  // If user doesn't exist, create a new one
  if (!user) {
    user = await User.create({
      name: `User-${Date.now().toString().slice(-6)}`, // Temporary name
      phoneNumber: normalizedPhone,
      countryCode,
      credits: 20,
      subscription: {
        type: 'none',
        status: 'none',
        plan: 'none'
      }
    });
  }

  // Generate OTP
  const otp = user.generatePhoneOtp();
  await user.save({ validateBeforeSave: false });

  // For development, send OTP in response
  const devMode = process.env.NODE_ENV === 'development';

  try {
    // In production, send OTP via SMS
    if (!devMode) {
      await sendSMS({
        to: user.getFullPhoneNumber(),
        message: `Your Strong By Yoga verification code is: ${otp}. Valid for 10 minutes.`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent to your phone number',
      ...(devMode && { otp }) // Only include OTP in development
    });
  } catch (err) {
    user.phoneOtp = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Could not send OTP. Please try again.', 500));
  }
});

// @desc    Verify OTP and login
// @route   POST /api/auth/phone/verify-otp
// @access  Public
exports.verifyPhoneOtp = asyncHandler(async (req, res, next) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    return next(new ErrorResponse('Please provide phone number and OTP', 400));
  }
  
  // Normalize phone number
  const normalizedPhone = phoneNumber.replace(/\D(?!\+)/g, '');

  // Find user by phone
  const user = await User.findOne({ phoneNumber: normalizedPhone });

  if (!user) {
    return next(new ErrorResponse('Invalid phone number', 401));
  }

  // Verify OTP
  if (!user.verifyPhoneOtp(otp)) {
    return next(new ErrorResponse('Invalid or expired OTP', 401));
  }

  // Mark phone as verified and clear OTP
  user.phoneVerified = true;
  user.phoneOtp = undefined;
  user.lastLogin = Date.now();
  
  await user.save({ validateBeforeSave: false });

  sendTokenResponse(user, 200, res);
});

// @desc    Google OAuth login
// @route   POST /api/auth/google
// @access  Public
exports.googleLogin = asyncHandler(async (req, res, next) => {
  const { idToken } = req.body;

  if (!idToken) {
    return next(new ErrorResponse('Please provide an ID token', 400));
  }

  try {
    // Verify token
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // Update OAuth info if not already set
      if (!user.oauthProvider) {
        user.oauthProvider = 'google';
        user.oauthId = googleId;
        user.avatar = picture || user.avatar;
        user.isEmailVerified = true;
        await user.save({ validateBeforeSave: false });
      }
    } else {
      // Create new user
      user = await User.create({
        name,
        email,
        oauthProvider: 'google',
        oauthId: googleId,
        avatar: picture || 'default.jpg',
        isEmailVerified: true,
        credits: 20,
        subscription: {
          type: 'none',
          status: 'none',
          plan: 'none'
        }
      });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 200, res);
  } catch (err) {
    return next(new ErrorResponse('Invalid Google token', 401));
  }
});

// @desc    Facebook OAuth login
// @route   POST /api/auth/facebook
// @access  Public
exports.facebookLogin = asyncHandler(async (req, res, next) => {
  const { accessToken } = req.body;

  if (!accessToken) {
    return next(new ErrorResponse('Please provide an access token', 400));
  }

  try {
    // Verify token with Facebook
    const fbResponse = await axios.get(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`
    );

    const { id: facebookId, email, name, picture } = fbResponse.data;

    if (!email) {
      return next(new ErrorResponse('Email not provided by Facebook', 400));
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // Update OAuth info if not already set
      if (!user.oauthProvider) {
        user.oauthProvider = 'facebook';
        user.oauthId = facebookId;
        user.avatar = picture?.data?.url || user.avatar;
        user.isEmailVerified = true;
        await user.save({ validateBeforeSave: false });
      }
    } else {
      // Create new user
      user = await User.create({
        name,
        email,
        oauthProvider: 'facebook',
        oauthId: facebookId,
        avatar: picture?.data?.url || 'default.jpg',
        isEmailVerified: true,
        credits: 20,
        subscription: {
          type: 'none',
          status: 'none',
          plan: 'none'
        }
      });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 200, res);
  } catch (err) {
    return next(new ErrorResponse('Invalid Facebook token', 401));
  }
});

// @desc    Apple OAuth login
// @route   POST /api/auth/apple
// @access  Public
exports.appleLogin = asyncHandler(async (req, res, next) => {
  const { idToken, user: appleUser } = req.body;

  if (!idToken || !appleUser) {
    return next(new ErrorResponse('Please provide all required Apple sign-in data', 400));
  }

  try {
    // In a real app, you would verify the idToken with Apple
    // This is a simplified version
    const { email, name } = JSON.parse(appleUser);
    const appleId = idToken.sub; // Extract user ID from token

    // Check if user exists
    let user = await User.findOne({ 
      $or: [
        { email },
        { oauthId: appleId, oauthProvider: 'apple' }
      ]
    });

    if (user) {
      // Update OAuth info if not already set
      if (!user.oauthProvider) {
        user.oauthProvider = 'apple';
        user.oauthId = appleId;
        user.isEmailVerified = true;
        await user.save({ validateBeforeSave: false });
      }
    } else {
      // Create new user
      user = await User.create({
        name: name || `User-${Date.now().toString().slice(-6)}`,
        email,
        oauthProvider: 'apple',
        oauthId: appleId,
        isEmailVerified: true,
        credits: 20,
        subscription: {
          type: 'none',
          status: 'none',
          plan: 'none'
        }
      });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 200, res);
  } catch (err) {
    return next(new ErrorResponse('Invalid Apple sign-in data', 401));
  }
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  // Find user
  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorResponse('User not found with this email', 404));
  }

  // Generate reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Create reset URL
  const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;

  // Create message
  const message = `
    You are receiving this email because you (or someone else) has requested the reset of a password. 
    Please click on the link to reset your password: \n\n ${resetUrl}
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Token',
      message,
    });

    res.status(200).json({
      success: true,
      message: 'Password reset email sent',
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get token from params
  const { token } = req.params;
  const { password } = req.body;

  // Hash the token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  // Find user by token
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse('Invalid or expired token', 400));
  }

  // Set new password
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password reset successful',
  });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Update user details
// @route   PUT /api/auth/update-details
// @access  Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    address: req.body.address
  };

  // Remove undefined fields
  Object.keys(fieldsToUpdate).forEach(
    key => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
  );

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  // Get user with password
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  const isMatch = await user.matchPassword(currentPassword);

  if (!isMatch) {
    return next(new ErrorResponse('Current password is incorrect', 401));
  }

  // Set new password
  user.password = newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

// @desc    Firebase phone authentication
// @route   POST /api/auth/phone/firebase-auth
// @access  Public
exports.firebasePhoneAuth = asyncHandler(async (req, res, next) => {
  const { phoneNumber, firebaseUid } = req.body;

  if (!phoneNumber || !firebaseUid) {
    return next(new ErrorResponse('Please provide phoneNumber and firebaseUid', 400));
  }

  // Normalize phone number
  const normalizedPhone = phoneNumber.replace(/\D(?!\+)/g, '');
  
  // Check if user exists
  let user = await User.findOne({ phoneNumber: normalizedPhone });

  if (!user) {
    // Create a new user with the phone number
    user = await User.create({
      name: `User-${Date.now().toString().slice(-6)}`,
      phoneNumber: normalizedPhone,
      phoneVerified: true,
      firebaseUid,
      credits: 20,
      subscription: {
        type: 'none',
        status: 'none',
        plan: 'none'
      }
    });
  } else {
    // Update existing user with Firebase UID and mark as verified
    user.phoneVerified = true;
    user.firebaseUid = firebaseUid;
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });
  }

  sendTokenResponse(user, 200, res);
});

// Helper function to send token response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = generateToken(user._id);

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      phoneVerified: user.phoneVerified,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      avatar: user.avatar,
      oauthProvider: user.oauthProvider
    },
  });
}; 