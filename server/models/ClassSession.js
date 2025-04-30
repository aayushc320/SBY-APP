const mongoose = require('mongoose');

const ClassSessionSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a class title']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startTime: {
    type: Date,
    required: [true, 'Please add a start time and date']
  },
  endTime: {
    type: Date,
    required: [true, 'Please add an end time and date']
  },
  duration: {
    type: Number,
    required: [true, 'Please add duration in minutes']
  },
  maxAttendees: {
    type: Number,
    required: [true, 'Please add a maximum attendee capacity']
  },
  currentAttendees: {
    type: Number,
    default: 0
  },
  location: {
    type: String,
    enum: ['online', 'in-studio', 'outdoor'],
    required: [true, 'Please specify the class location']
  },
  meetingLink: String,
  address: String,
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurrencePattern: {
    type: String,
    enum: ['daily', 'weekly', 'biweekly', 'monthly', null],
    default: null
  },
  recurrenceEndDate: {
    type: Date,
    default: null
  },
  isCancelled: {
    type: Boolean,
    default: false
  },
  equipment: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual field for bookings
ClassSessionSchema.virtual('bookings', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'classSession',
  justOne: false
});

// Check if the class is full
ClassSessionSchema.virtual('isFull').get(function() {
  return this.currentAttendees >= this.maxAttendees;
});

// Class status - upcoming, ongoing, completed
ClassSessionSchema.virtual('status').get(function() {
  const now = new Date();
  if (this.isCancelled) return 'cancelled';
  if (now < this.startTime) return 'upcoming';
  if (now >= this.startTime && now <= this.endTime) return 'ongoing';
  return 'completed';
});

module.exports = mongoose.model('ClassSession', ClassSessionSchema); 