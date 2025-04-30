const express = require('express');
const router = express.Router();
const {
  getClasses,
  getClass,
  createClass,
  updateClass,
  deleteClass,
  enrollInClass,
} = require('../controllers/classController');
const { protect, authorize } = require('../middleware/auth');

// Classes routes
router.route('/')
  .get(getClasses)
  .post(protect, authorize('instructor', 'admin'), createClass);

router.route('/:id')
  .get(getClass)
  .put(protect, authorize('instructor', 'admin'), updateClass)
  .delete(protect, authorize('instructor', 'admin'), deleteClass);

router.route('/:id/enroll')
  .post(protect, enrollInClass);

module.exports = router; 