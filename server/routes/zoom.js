const express = require('express');
const router = express.Router();
const {
  createZoomMeeting,
  getZoomMeeting,
} = require('../controllers/zoomController');
const { protect, authorize } = require('../middleware/auth');

// Zoom routes
router.post(
  '/create-meeting',
  protect,
  authorize('instructor', 'admin'),
  createZoomMeeting
);
router.get('/meeting/:classId', protect, getZoomMeeting);

module.exports = router; 