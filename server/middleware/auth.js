const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('./async');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if auth header exists and starts with Bearer
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Get token from header
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    // Or get token from cookie
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from the token
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ErrorResponse('User not found', 401));
    }

    // Check if token issued before password change
    if (user.passwordChangedAt) {
      const changedTimestamp = parseInt(
        user.passwordChangedAt.getTime() / 1000,
        10
      );

      // If password was changed after token was issued
      if (decoded.iat < changedTimestamp) {
        return next(
          new ErrorResponse('User recently changed password. Please log in again.', 401)
        );
      }
    }

    // Check if token was issued before last logout
    if (user.lastLogout && decoded.iat < parseInt(user.lastLogout.getTime() / 1000, 10)) {
      return next(
        new ErrorResponse('Session expired. Please log in again.', 401)
      );
    }

    // Store user in request
    req.user = user;
    next();
  } catch (error) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role '${req.user.role}' is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
}; 