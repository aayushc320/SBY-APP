const mongoose = require('mongoose');
const slugify = require('slugify');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a course title'],
    trim: true,
    unique: true,
    maxlength: [100, 'Course title cannot be more than 100 characters']
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  level: {
    type: String,
    required: [true, 'Please add a difficulty level'],
    enum: ['beginner', 'intermediate', 'advanced', 'all-levels']
  },
  duration: {
    type: Number,
    required: [true, 'Please add duration in minutes']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  discount: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    default: 'default-course.jpg'
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: [
      'vinyasa',
      'hatha',
      'yin',
      'ashtanga',
      'restorative',
      'prenatal',
      'meditation',
      'breathwork',
      'other'
    ]
  },
  benefits: [String],
  requirements: [String],
  isPublished: {
    type: Boolean,
    default: false
  },
  averageRating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  ratingsCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create course slug from the title
CourseSchema.pre('save', function(next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

// Cascade delete classes when a course is deleted
CourseSchema.pre('remove', async function(next) {
  await this.model('ClassSession').deleteMany({ course: this._id });
  next();
});

// Reverse populate with virtuals
CourseSchema.virtual('classSessions', {
  ref: 'ClassSession',
  localField: '_id',
  foreignField: 'course',
  justOne: false
});

CourseSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'course',
  justOne: false
});

module.exports = mongoose.model('Course', CourseSchema); 