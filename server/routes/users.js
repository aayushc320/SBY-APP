const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  updateProfile,
  updatePassword,
  getUserClasses,
  getInstructorClasses,
  getInstructors
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const mongoose = require('mongoose');

// IMPORTANT: Place public routes at the top, before any middleware

// Direct MongoDB access without authentication (for development only)
router.get('/mongodb-users', async (req, res) => {
  try {
    // Connect to MongoDB and fetch users from test.users collection
    const db = mongoose.connection.db;
    const users = await db.collection('users').find({}).toArray();
    
    res.status(200).json(users);
  } catch (error) {
    console.error('Error accessing MongoDB directly:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server Error', 
      message: 'Failed to fetch users from MongoDB'
    });
  }
});

// Get all instructors route - this needs to be before any ID routes
router.route('/instructors')
  .get(protect, getInstructors);

// Protected User routes below
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