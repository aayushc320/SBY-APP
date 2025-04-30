const express = require('express');
const {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
  cancelBooking,
  completeBooking,
  getMyBookings,
  getBookingsByClassSession,
  checkAvailability,
  getCalendarView
} = require('../controllers/bookingController');

const Booking = require('../models/Booking');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');

// Routes that apply to all users
router.route('/my-bookings')
  .get(protect, getMyBookings);

router.route('/calendar')
  .get(protect, getCalendarView);

// Public route for availability
router.route('/availability/:sessionId')
  .get(checkAvailability);

// Routes with specific IDs
router.route('/:id')
  .get(protect, getBooking)
  .put(protect, updateBooking)
  .delete(protect, deleteBooking);

router.route('/:id/cancel')
  .put(protect, cancelBooking);

router.route('/:id/complete')
  .put(protect, authorize('admin', 'instructor'), completeBooking);

// Routes for class session bookings
router.route('/class-session/:sessionId')
  .get(protect, authorize('admin', 'instructor'), getBookingsByClassSession);

// Main routes
router.route('/')
  .get(
    protect,
    authorize('admin'),
    advancedResults(Booking, [
      { path: 'user', select: 'name email' },
      { 
        path: 'classSession',
        select: 'title startTime endTime location meetingLink',
        populate: { path: 'course', select: 'title description' }
      },
      { path: 'instructor', select: 'name email' }
    ]),
    getBookings
  )
  .post(protect, createBooking);

module.exports = router; 