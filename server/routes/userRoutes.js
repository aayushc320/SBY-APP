const express = require('express');
const { 
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadAvatar,
  removeAvatar,
  getNotificationSettings,
  updateNotificationSettings
} = require('../controllers/userController');

const User = require('../models/User');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply protection to all routes below
router.use(protect);

// User profile routes - accessible by all authenticated users
router.route('/upload-avatar').post(uploadAvatar);
router.route('/remove-avatar').delete(removeAvatar);
router.route('/notification-settings')
  .get(getNotificationSettings)
  .put(updateNotificationSettings);

// Admin only routes
router.use(authorize('admin'));

router.route('/')
  .get(advancedResults(User), getUsers)
  .post(createUser);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router; 