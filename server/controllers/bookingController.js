const Booking = require('../models/Booking');
const ClassSession = require('../models/ClassSession');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { createZoomMeeting } = require('./zoomController');

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
exports.getBookings = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id)
    .populate({
      path: 'user',
      select: 'name email'
    })
    .populate({
      path: 'classSession',
      populate: {
        path: 'course',
        select: 'title description'
      }
    })
    .populate({
      path: 'instructor',
      select: 'name email'
    });

  if (!booking) {
    return next(new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is booking owner or admin
  if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to view this booking`, 401));
  }

  res.status(200).json({
    success: true,
    data: booking
  });
});

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  // Check for existing booking
  const existingBooking = await Booking.findOne({
    user: req.user.id,
    classSession: req.body.classSession
  });

  if (existingBooking) {
    return next(new ErrorResponse(`You have already booked this class session`, 400));
  }

  // Get the class session
  const classSession = await ClassSession.findById(req.body.classSession)
    .populate('course');

  if (!classSession) {
    return next(new ErrorResponse(`Class session not found with id of ${req.body.classSession}`, 404));
  }

  // Check if class is full
  if (classSession.isFull) {
    return next(new ErrorResponse(`This class session is already full`, 400));
  }

  // Check if class is in the past
  if (new Date(classSession.startTime) < new Date()) {
    return next(new ErrorResponse(`Cannot book a class that has already started`, 400));
  }

  // Set instructor from class session
  req.body.instructor = classSession.instructor;
  req.body.course = classSession.course._id;

  // Check if user has enough credits for booking
  const user = await User.findById(req.user.id);
  
  // Calculate credits needed 
  let creditsNeeded = 0;
  
  if (classSession.course.isOneOnOne) {
    creditsNeeded = classSession.course.creditCost || 0;
  } else {
    // For group classes, check if user has unlimited access
    if (!user.membership.unlimitedGroupClasses) {
      creditsNeeded = classSession.course.creditCost || 0;
    }
  }
  
  // Check if user has enough credits
  if (creditsNeeded > 0 && user.credits < creditsNeeded) {
    return next(new ErrorResponse(`You don't have enough credits for this booking. Required: ${creditsNeeded}, Available: ${user.credits}`, 400));
  }

  // Create the booking
  const booking = await Booking.create(req.body);
  
  // Deduct credits from user if needed
  if (creditsNeeded > 0) {
    await User.findByIdAndUpdate(req.user.id, { 
      $inc: { credits: -creditsNeeded } 
    });
  }

  // Generate zoom link for online sessions
  if (classSession.location === 'online' && !classSession.meetingLink) {
    try {
      // Create a zoom meeting
      const zoomMeeting = await createZoomMeeting({
        topic: classSession.title,
        start_time: classSession.startTime,
        duration: classSession.duration,
        type: 2, // Scheduled meeting
        timezone: 'UTC'
      });

      // Update class session with zoom link
      await ClassSession.findByIdAndUpdate(classSession._id, {
        meetingLink: zoomMeeting.join_url
      });
    } catch (err) {
      console.error('Error creating Zoom meeting:', err);
      // Don't fail the booking if zoom creation fails
    }
  }

  res.status(201).json({
    success: true,
    data: booking
  });
});

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private/Admin
exports.updateBooking = asyncHandler(async (req, res, next) => {
  let booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is booking owner or admin
  if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this booking`, 401));
  }

  booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: booking
  });
});

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
exports.deleteBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is booking owner or admin
  if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this booking`, 401));
  }

  await booking.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is booking owner or admin
  if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to cancel this booking`, 401));
  }

  // Get the class session to check cancellation policy
  const classSession = await ClassSession.findById(booking.classSession);
  
  // Check if cancellation is within allowed time period (e.g. 24 hours before class)
  const cancellationDeadline = new Date(classSession.startTime);
  cancellationDeadline.setHours(cancellationDeadline.getHours() - 24);
  
  const now = new Date();
  
  // If past cancellation deadline and not admin
  if (now > cancellationDeadline && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Cancellation is only allowed up to 24 hours before class start time`, 400));
  }

  // Set status to cancelled and update other fields
  booking.status = 'cancelled';
  booking.cancelReason = req.body.reason || 'User cancelled';
  booking.cancelledAt = Date.now();

  await booking.save();

  // Refund credits if applicable
  if (booking.status === 'confirmed') {
    const user = await User.findById(booking.user);
    
    // Get class credit cost
    const course = await Course.findById(booking.course);
    
    if (course && course.creditCost > 0) {
      // Check if the class is one-on-one or group
      if (course.isOneOnOne || !user.membership.unlimitedGroupClasses) {
        await User.findByIdAndUpdate(booking.user, { 
          $inc: { credits: course.creditCost } 
        });
      }
    }
  }

  res.status(200).json({
    success: true,
    data: booking
  });
});

// @desc    Mark booking as completed
// @route   PUT /api/bookings/:id/complete
// @access  Private/Instructor/Admin
exports.completeBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is instructor for this class or admin
  if (booking.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to complete this booking`, 401));
  }

  booking.status = 'completed';
  booking.completedAt = Date.now();
  booking.attendanceConfirmed = true;

  await booking.save();

  res.status(200).json({
    success: true,
    data: booking
  });
});

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getMyBookings = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id })
    .populate({
      path: 'classSession',
      select: 'title startTime endTime location meetingLink',
      populate: {
        path: 'course',
        select: 'title description'
      }
    })
    .populate({
      path: 'instructor',
      select: 'name email'
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings
  });
});

// @desc    Get bookings for a specific class session
// @route   GET /api/bookings/class-session/:sessionId
// @access  Private/Instructor/Admin
exports.getBookingsByClassSession = asyncHandler(async (req, res, next) => {
  const classSession = await ClassSession.findById(req.params.sessionId);

  if (!classSession) {
    return next(
      new ErrorResponse(`No class session found with id ${req.params.sessionId}`, 404)
    );
  }

  // Check if user is instructor for this class or admin
  if (classSession.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to view bookings for this class session`,
        401
      )
    );
  }

  const bookings = await Booking.find({ classSession: req.params.sessionId })
    .populate({
      path: 'user',
      select: 'name email'
    });

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings
  });
});

// @desc    Check availability for a class session
// @route   GET /api/bookings/availability/:sessionId
// @access  Public
exports.checkAvailability = asyncHandler(async (req, res, next) => {
  const classSession = await ClassSession.findById(req.params.sessionId);

  if (!classSession) {
    return next(
      new ErrorResponse(`No class session found with id ${req.params.sessionId}`, 404)
    );
  }

  const spotsTotal = classSession.maxAttendees;
  const spotsBooked = classSession.currentAttendees;
  const spotsAvailable = spotsTotal - spotsBooked;

  res.status(200).json({
    success: true,
    data: {
      sessionId: classSession._id,
      spotsTotal,
      spotsBooked,
      spotsAvailable,
      isFull: spotsAvailable <= 0,
      startTime: classSession.startTime,
      endTime: classSession.endTime
    }
  });
});

// @desc    Get upcoming classes calendar view
// @route   GET /api/bookings/calendar
// @access  Private
exports.getCalendarView = asyncHandler(async (req, res, next) => {
  // Get start and end date from query params
  const { start, end } = req.query;
  
  // Default to current month if not provided
  const startDate = start ? new Date(start) : new Date();
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = end ? new Date(end) : new Date(startDate);
  if (!end) {
    endDate.setMonth(endDate.getMonth() + 1);
  }
  endDate.setHours(23, 59, 59, 999);
  
  // Get all class sessions in the date range
  const classSessions = await ClassSession.find({
    startTime: { $gte: startDate, $lte: endDate },
    isCancelled: false
  })
  .populate({
    path: 'course',
    select: 'title description isOneOnOne creditCost'
  })
  .populate({
    path: 'instructor',
    select: 'name'
  });
  
  // Get user's bookings in the same date range
  const myBookings = await Booking.find({
    user: req.user.id,
    classSession: { $in: classSessions.map(session => session._id) }
  });
  
  // Format data for calendar view
  const calendarEvents = classSessions.map(session => {
    // Check if user has booked this session
    const booking = myBookings.find(
      booking => booking.classSession.toString() === session._id.toString()
    );
    
    return {
      id: session._id,
      title: session.title,
      start: session.startTime,
      end: session.endTime,
      classType: session.course.isOneOnOne ? 'one-on-one' : 'group',
      instructor: session.instructor.name,
      location: session.location,
      description: session.description,
      isFull: session.isFull,
      spotsAvailable: session.maxAttendees - session.currentAttendees,
      isBooked: !!booking,
      bookingId: booking ? booking._id : null,
      bookingStatus: booking ? booking.status : null,
      creditCost: session.course.creditCost,
      color: booking 
        ? (booking.status === 'confirmed' ? '#4CAF50' : '#FFC107') 
        : (session.isFull ? '#F44336' : '#2196F3')
    };
  });
  
  res.status(200).json({
    success: true,
    count: calendarEvents.length,
    data: calendarEvents
  });
}); 