const YogaClass = require('../models/YogaClass');
const User = require('../models/User');

// @desc    Create a new yoga class
// @route   POST /api/classes
// @access  Private/Instructor
exports.createClass = async (req, res) => {
  try {
    // Add instructor to the class
    req.body.instructor = req.user.id;

    // Create class
    const yogaClass = await YogaClass.create(req.body);

    res.status(201).json({
      success: true,
      data: yogaClass,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating class',
      error: error.message,
    });
  }
};

// @desc    Get all yoga classes
// @route   GET /api/classes
// @access  Public
exports.getClasses = async (req, res) => {
  try {
    // Build query
    let query = YogaClass.find().populate({
      path: 'instructor',
      select: 'name profileImage bio',
    });

    // Filtering
    const { level, instructor, price, date } = req.query;

    // Filter by level
    if (level) {
      query = query.where('level').equals(level);
    }

    // Filter by instructor
    if (instructor) {
      query = query.where('instructor').equals(instructor);
    }

    // Filter by price range
    if (price) {
      const [min, max] = price.split('-');
      if (min && max) {
        query = query.where('price').gte(min).lte(max);
      }
    }

    // Filter by date
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      
      query = query.where('schedule.date').gte(startDate).lt(endDate);
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await YogaClass.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Execute query
    const classes = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: classes.length,
      pagination,
      data: classes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving classes',
      error: error.message,
    });
  }
};

// @desc    Get single yoga class
// @route   GET /api/classes/:id
// @access  Public
exports.getClass = async (req, res) => {
  try {
    const yogaClass = await YogaClass.findById(req.params.id).populate({
      path: 'instructor',
      select: 'name profileImage bio',
    });

    if (!yogaClass) {
      return res.status(404).json({
        success: false,
        message: 'Class not found',
      });
    }

    res.status(200).json({
      success: true,
      data: yogaClass,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving class',
      error: error.message,
    });
  }
};

// @desc    Update yoga class
// @route   PUT /api/classes/:id
// @access  Private/Instructor
exports.updateClass = async (req, res) => {
  try {
    let yogaClass = await YogaClass.findById(req.params.id);

    if (!yogaClass) {
      return res.status(404).json({
        success: false,
        message: 'Class not found',
      });
    }

    // Make sure user is the instructor of the class
    if (
      yogaClass.instructor.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this class',
      });
    }

    yogaClass = await YogaClass.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: yogaClass,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating class',
      error: error.message,
    });
  }
};

// @desc    Delete yoga class
// @route   DELETE /api/classes/:id
// @access  Private/Instructor
exports.deleteClass = async (req, res) => {
  try {
    const yogaClass = await YogaClass.findById(req.params.id);

    if (!yogaClass) {
      return res.status(404).json({
        success: false,
        message: 'Class not found',
      });
    }

    // Make sure user is the instructor of the class
    if (
      yogaClass.instructor.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this class',
      });
    }

    await yogaClass.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting class',
      error: error.message,
    });
  }
};

// @desc    Enroll in class (free classes or for admin testing)
// @route   POST /api/classes/:id/enroll
// @access  Private
exports.enrollInClass = async (req, res) => {
  try {
    const yogaClass = await YogaClass.findById(req.params.id);

    if (!yogaClass) {
      return res.status(404).json({
        success: false,
        message: 'Class not found',
      });
    }

    // Check if class is free or user is admin (for testing)
    if (yogaClass.price > 0 && req.user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Please complete payment to enroll in this class',
      });
    }

    // Check if class is full
    if (yogaClass.participants.length >= yogaClass.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: 'This class is already full',
      });
    }

    // Check if user is already enrolled
    if (yogaClass.participants.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this class',
      });
    }

    // Add user to class participants
    await YogaClass.findByIdAndUpdate(req.params.id, {
      $addToSet: { participants: req.user.id },
    });

    // Add class to user's enrolled classes
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { enrolledClasses: req.params.id },
    });

    res.status(200).json({
      success: true,
      message: 'Successfully enrolled in class',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error enrolling in class',
      error: error.message,
    });
  }
}; 