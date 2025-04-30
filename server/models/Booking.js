const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  classSession: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ClassSession',
    required: true
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
  bookedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['paid', 'unpaid', 'refunded', 'free'],
    default: 'unpaid'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'paypal', 'apple_pay', 'google_pay', 'membership', 'free', null],
    default: null
  },
  paymentId: {
    type: String,
    default: null
  },
  price: {
    type: Number,
    default: 0
  },
  isPackageBooking: {
    type: Boolean,
    default: false
  },
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
    default: null
  },
  attendanceConfirmed: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    trim: true
  },
  cancelReason: {
    type: String,
    trim: true
  },
  cancelledAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  refundAmount: {
    type: Number,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Prevent user from booking the same class session more than once
BookingSchema.index({ user: 1, classSession: 1 }, { unique: true });

// Add additional indexes for common queries
BookingSchema.index({ user: 1, status: 1 });
BookingSchema.index({ classSession: 1 });
BookingSchema.index({ course: 1 });
BookingSchema.index({ instructor: 1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ createdAt: 1 });

// Pre-save hook to update class session attendee count
BookingSchema.pre('save', async function(next) {
  if (this.isNew && this.status === 'confirmed') {
    const ClassSession = this.model('ClassSession');
    
    // Check if class is full
    const classSession = await ClassSession.findById(this.classSession);
    if (classSession.currentAttendees >= classSession.maxAttendees) {
      const error = new Error('This class session is already full');
      return next(error);
    }
    
    // Increment attendee count
    await ClassSession.findByIdAndUpdate(
      this.classSession,
      { $inc: { currentAttendees: 1 } }
    );
  }
  next();
});

// Pre-save hook for handling cancellations
BookingSchema.pre('save', async function(next) {
  if (!this.isModified('status')) return next();
  
  if (this.status === 'cancelled' && this.isModified('status')) {
    this.cancelledAt = Date.now();
    
    // Decrement class attendee count if it was previously confirmed
    if (this._previousStatus === 'confirmed') {
      const ClassSession = this.model('ClassSession');
      await ClassSession.findByIdAndUpdate(
        this.classSession,
        { $inc: { currentAttendees: -1 } }
      );
    }
  }
  next();
});

// Store the previous status before saving
BookingSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this._previousStatus = this.status;
  }
  next();
});

module.exports = mongoose.model('Booking', BookingSchema); 