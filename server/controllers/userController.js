const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const YogaClass = require('../models/YogaClass');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const multer = require('multer');

// Configure storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../public/uploads/avatars');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `user-${req.user.id}-${uniqueSuffix}${ext}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new ErrorResponse('Please upload an image file', 400), false);
  }
};

// Configure multer upload
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`No user found with id ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Create user
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user
  });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!user) {
    return next(new ErrorResponse(`No user found with id ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`No user found with id ${req.params.id}`, 404));
  }

  await user.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Upload user avatar
// @route   POST /api/users/upload-avatar
// @access  Private
exports.uploadAvatar = asyncHandler(async (req, res, next) => {
  // Use multer middleware
  upload.single('avatar')(req, res, async function(err) {
    if (err) {
      return next(new ErrorResponse(err.message, 400));
    }
    
    if (!req.file) {
      return next(new ErrorResponse('Please upload a file', 400));
    }
    
    const user = await User.findById(req.user.id);
    
    // If user has an existing avatar (not default), remove it
    if (user.avatar && user.avatar !== 'default.jpg') {
      const oldAvatarPath = path.join(__dirname, '../public/uploads/avatars', user.avatar);
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }
    
    // Update user with new avatar
    user.avatar = path.basename(req.file.path);
    await user.save();
    
    res.status(200).json({
      success: true,
      data: { 
        avatar: user.avatar 
      },
      message: 'Avatar uploaded successfully'
    });
  });
});

// @desc    Remove user avatar
// @route   DELETE /api/users/remove-avatar
// @access  Private
exports.removeAvatar = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  // If user has an existing avatar (not default), remove it
  if (user.avatar && user.avatar !== 'default.jpg') {
    const avatarPath = path.join(__dirname, '../public/uploads/avatars', user.avatar);
    if (fs.existsSync(avatarPath)) {
      fs.unlinkSync(avatarPath);
    }
  }
  
  // Reset avatar to default
  user.avatar = 'default.jpg';
  await user.save();
  
  res.status(200).json({
    success: true,
    data: { 
      avatar: user.avatar 
    },
    message: 'Avatar removed successfully'
  });
});

// @desc    Get notification settings
// @route   GET /api/users/notification-settings
// @access  Private
exports.getNotificationSettings = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  // If user doesn't have notification settings yet, return default settings
  if (!user.notificationSettings) {
    return res.status(200).json({
      success: true,
      data: {
        emailNotifications: {
          marketing: false,
          bookingReminders: true,
          classUpdates: false,
          accountAlerts: true
        },
        smsNotifications: {
          bookingReminders: false,
          promotions: false,
          accountAlerts: false
        }
      }
    });
  }
  
  res.status(200).json({
    success: true,
    data: user.notificationSettings
  });
});

// @desc    Update notification settings
// @route   PUT /api/users/notification-settings
// @access  Private
exports.updateNotificationSettings = asyncHandler(async (req, res, next) => {
  // Validate that the request body has the correct structure
  const { emailNotifications, smsNotifications } = req.body;
  
  if (!emailNotifications || !smsNotifications) {
    return next(new ErrorResponse('Invalid notification settings format', 400));
  }
  
  const user = await User.findByIdAndUpdate(
    req.user.id, 
    { notificationSettings: req.body },
    { new: true, runValidators: true }
  );
  
  res.status(200).json({
    success: true,
    data: user.notificationSettings,
    message: 'Notification settings updated successfully'
  });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    // Create fields to update
    const fieldsToUpdate = {
      name: req.body.name,
      bio: req.body.bio,
    };

    // Update profile image if provided
    if (req.body.profileImage) {
      fieldsToUpdate.profileImage = req.body.profileImage;
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message,
    });
  }
};

// @desc    Update user password
// @route   PUT /api/users/password
// @access  Private
exports.updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await user.matchPassword(req.body.currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Set new password
    user.password = req.body.newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating password',
      error: error.message,
    });
  }
};

// @desc    Get user's enrolled classes
// @route   GET /api/users/classes
// @access  Private
exports.getUserClasses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('enrolledClasses');

    res.status(200).json({
      success: true,
      count: user.enrolledClasses.length,
      data: user.enrolledClasses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving enrolled classes',
      error: error.message,
    });
  }
};

// @desc    Get instructor's classes
// @route   GET /api/users/classes/teaching
// @access  Private/Instructor
exports.getInstructorClasses = async (req, res) => {
  try {
    const classes = await YogaClass.find({ instructor: req.user.id });

    res.status(200).json({
      success: true,
      count: classes.length,
      data: classes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving instructor classes',
      error: error.message,
    });
  }
}; 