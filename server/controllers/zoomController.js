const axios = require('axios');
const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const ClassSession = require('../models/ClassSession');
const Booking = require('../models/Booking');

// Zoom API credentials (should be stored in environment variables)
const ZOOM_API_KEY = process.env.ZOOM_API_KEY;
const ZOOM_API_SECRET = process.env.ZOOM_API_SECRET;
const ZOOM_EMAIL = process.env.ZOOM_EMAIL; // Email of the Zoom account owner

// Generate a Zoom API JWT token
const generateZoomToken = () => {
  const payload = {
    iss: ZOOM_API_KEY,
    exp: Math.floor(Date.now() / 1000) + 60 * 60, // Token expires in 1 hour
  };

  return jwt.sign(payload, ZOOM_API_SECRET);
};

// Create a Zoom API client
const zoomClient = axios.create({
  baseURL: 'https://api.zoom.us/v2',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add the token to each request
zoomClient.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${generateZoomToken()}`;
  return config;
});

// @desc    Create a Zoom meeting
// @route   POST /api/zoom/create-meeting
// @access  Private/Admin/Instructor
exports.createZoomMeeting = asyncHandler(async (req, res, next) => {
  const { topic, start_time, duration, type = 2, timezone = 'UTC' } = req.body;

  // Create Zoom meeting
  try {
    const response = await zoomClient.post(`/users/${ZOOM_EMAIL}/meetings`, {
      topic,
      type, // 2 is a scheduled meeting
      start_time,
      duration,
      timezone,
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: false,
        mute_upon_entry: true,
        waiting_room: true,
        approval_type: 0,
        auto_recording: 'none',
      },
    });

    // If this was called directly from API, return the response
    if (res) {
      return res.status(201).json({
        success: true,
        data: response.data,
      });
    }

    // If this was called internally, return the data
    return response.data;
  } catch (error) {
    console.error('Zoom API Error:', error.response ? error.response.data : error.message);
    
    // If this was called directly from API, return error response
    if (res) {
      return next(
        new ErrorResponse('Failed to create Zoom meeting', 500)
      );
    }
    
    // If this was called internally, throw the error
    throw error;
  }
});

// @desc    Get a Zoom meeting for a class
// @route   GET /api/zoom/meeting/:classId
// @access  Private
exports.getZoomMeeting = asyncHandler(async (req, res, next) => {
  const classSession = await ClassSession.findById(req.params.classId);

  if (!classSession) {
    return next(
      new ErrorResponse(`No class session found with id ${req.params.classId}`, 404)
    );
  }

  // Check if user is authorized to access this meeting
  // Admin, instructor, or user with a confirmed booking can access
  const isAdmin = req.user.role === 'admin';
  const isInstructor = classSession.instructor.toString() === req.user.id;
  
  // Check if user has booked this class
  const hasBooking = await Booking.exists({
    user: req.user.id,
    classSession: classSession._id,
    status: 'confirmed'
  });

  if (!isAdmin && !isInstructor && !hasBooking) {
    return next(
      new ErrorResponse('Not authorized to access this meeting', 401)
    );
  }

  // If class doesn't have a meeting link yet, create one
  if (!classSession.meetingLink && classSession.location === 'online') {
    try {
      const zoomMeeting = await this.createZoomMeeting({
        topic: classSession.title,
        start_time: classSession.startTime,
        duration: classSession.duration,
        type: 2, // Scheduled meeting
      });

      // Update class session with zoom link
      await ClassSession.findByIdAndUpdate(classSession._id, {
        meetingLink: zoomMeeting.join_url
      });

      classSession.meetingLink = zoomMeeting.join_url;
    } catch (err) {
      console.error('Error creating Zoom meeting:', err);
      return next(
        new ErrorResponse('Failed to create Zoom meeting', 500)
      );
    }
  }

  res.status(200).json({
    success: true,
    data: {
      meetingLink: classSession.meetingLink,
      startTime: classSession.startTime,
      endTime: classSession.endTime,
      title: classSession.title
    }
  });
}); 