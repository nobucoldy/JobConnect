const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [20, 'Description must be at least 20 characters'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  requirements: {
    type: String,
    maxlength: [500, 'Requirements cannot exceed 500 characters'],
    default: ''
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Giao hàng', 'Dọn dẹp', 'Gia sư', 'Hỗ trợ kỹ thuật', 'Khác']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    minlength: [5, 'Location must be at least 5 characters'],
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  salary: {
    type: Number,
    required: [true, 'Salary is required'],
    min: [10000, 'Salary must be at least 10,000 VND']
  },
  salaryUnit: {
    type: String,
    enum: ['giờ', 'buổi', 'ngày', 'tuần', 'tháng', 'dự án'],
    default: 'ngày'
  },
  slots: {
    type: Number,
    default: 1,
    min: [1, 'Slots must be at least 1'],
    max: [100, 'Slots cannot exceed 100']
  },
  applicationDeadline: {
    type: Date,
    validate: {
      validator: function(value) {
        return !value || value > new Date();
      },
      message: 'Application deadline must be in the future'
    }
  },
  images: [{
    type: String
  }],
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  poster: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedWorker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  status: {
    type: String,
    enum: ['OPEN', 'ASSIGNED', 'COMPLETED', 'CANCELLED'],
    default: 'OPEN'
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Validation for dates
jobSchema.pre('save', function() {
  if (this.startDate && this.endDate && this.startDate >= this.endDate) {
    throw new Error('End date must be after start date');
  }
  if (this.startDate && this.startDate < new Date()) {
    throw new Error('Start date cannot be in the past');
  }
  if (this.applicationDeadline && this.startDate && this.applicationDeadline > this.startDate) {
    throw new Error('Application deadline must be before start date');
  }
});

// Virtual for applications
jobSchema.virtual('applications', {
  ref: 'Application',
  localField: '_id',
  foreignField: 'job'
});

// Virtual: check if still accepting applications
jobSchema.virtual('isAcceptingApplications').get(function() {
  if (this.status !== 'OPEN') return false;
  if (this.applicationDeadline && this.applicationDeadline < new Date()) return false;
  return true;
});

// Indexes
jobSchema.index({ poster: 1 });
jobSchema.index({ assignedWorker: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ category: 1 });
jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ applicationDeadline: 1 });
jobSchema.index({ views: -1 });

module.exports = mongoose.model('Job', jobSchema);