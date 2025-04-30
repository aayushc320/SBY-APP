const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  updateProfile,
  updatePassword,
  getUserClasses,
  getInstructorClasses,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// User routes
router.route('/')
  .get(protect, authorize('admin'), getUsers);

router.route('/:id')
  .get(protect, authorize('admin'), getUser);

router.route('/profile')
  .put(protect, updateProfile);

router.route('/password')
  .put(protect, updatePassword);

router.route('/classes')
  .get(protect, getUserClasses);

router.route('/classes/teaching')
  .get(protect, authorize('instructor', 'admin'), getInstructorClasses);

module.exports = router; 