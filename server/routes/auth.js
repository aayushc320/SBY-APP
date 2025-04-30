const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  getMe, 
  verifyEmail,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  logout,
  requestPhoneOtp,
  verifyPhoneOtp,
  firebasePhoneAuth,
  googleLogin,
  facebookLogin,
  appleLogin
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Email/password authentication
router.post('/register', register);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);

// Password reset
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

// Phone OTP authentication
router.post('/phone/request-otp', requestPhoneOtp);
router.post('/phone/verify-otp', verifyPhoneOtp);
router.post('/phone/firebase-auth', firebasePhoneAuth);

// OAuth routes
router.post('/google', googleLogin);
router.post('/facebook', facebookLogin);
router.post('/apple', appleLogin);

// Protected routes
router.get('/me', protect, getMe);
router.put('/update-details', protect, updateDetails);
router.put('/update-password', protect, updatePassword);
router.get('/logout', protect, logout);

module.exports = router; 