const mongoose = require('mongoose');

const YogaClassSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a class title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'all-levels'],
      default: 'all-levels',
    },
    duration: {
      type: Number, // in minutes
      required: [true, 'Please specify class duration'],
    },
    schedule: {
      date: {
        type: Date,
        required: [true, 'Please provide a date for the class'],
      },
      time: {
        type: String,
        required: [true, 'Please provide a time for the class'],
      },
      recurring: {
        type: Boolean,
        default: false,
      },
      recurrencePattern: {
        type: String,
        enum: ['daily', 'weekly', 'biweekly', 'monthly'],
      },
    },
    image: {
      type: String,
      default: 'default-class.jpg',
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
    },
    maxParticipants: {
      type: Number,
      default: 20,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    zoomMeeting: {
      meetingId: {
        type: String,
      },
      password: {
        type: String,
      },
      joinUrl: {
        type: String,
      },
      startUrl: {
        type: String,
      },
    },
    isLive: {
      type: Boolean,
      default: true,
    },
    tags: [String],
  },
  { timestamps: true }
);

// Virtual for checking if class is full
YogaClassSchema.virtual('isFull').get(function () {
  return this.participants.length >= this.maxParticipants;
});

// Virtual for checking number of available spots
YogaClassSchema.virtual('availableSpots').get(function () {
  return this.maxParticipants - this.participants.length;
});

module.exports = mongoose.model('YogaClass', YogaClassSchema); 