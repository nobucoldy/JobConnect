const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Tiêu đề là bắt buộc'],
    trim: true,
    minlength: [5, 'Tiêu đề phải có ít nhất 5 ký tự'],
    maxlength: [100, 'Tiêu đề không được vượt quá 100 ký tự']
  },
  description: {
    type: String,
    required: [true, 'Mô tả là bắt buộc'],
    minlength: [20, 'Mô tả phải có ít nhất 20 ký tự'],
    maxlength: [1000, 'Mô tả không được vượt quá 1000 ký tự']
  },
  requirements: {
    type: String,
    maxlength: [500, 'Yêu cầu không được vượt quá 500 ký tự'],
    default: ''
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Giao hàng', 'Dọn dẹp', 'Gia sư', 'Hỗ trợ kỹ thuật', 'Khác']
  },
  location: {
    type: String,
    required: [true, 'Cần có thông tin về địa điểm.'],
    trim: true,
    minlength: [5, 'Địa điểm phải có ít nhất 5 ký tự.'],
    maxlength: [200, 'Địa điểm không được vượt quá 200 ký tự.']
  },
  salary: {
    type: Number,
    required: [true, 'Mức lương được yêu cầu điền'],
    min: [10000, 'Mức lương phải ít nhất 10,000 VND']
  },
  salaryUnit: {
    type: String,
    enum: ['giờ', 'buổi', 'ngày', 'tuần', 'tháng', 'dự án'],
    default: 'ngày'
  },
  slots: {
    type: Number,
    default: 1,
    min: [1, 'Số lượng vị trí phải tối thiểu là 1.'],
    max: [100, 'Số lượng vị trí không được vượt quá 100.']
  },
  applicationDeadline: {
    type: Date,
    validate: {
      validator: function(value) {
        if (!value) return true;
        if (!this.isNew && !this.isModified('applicationDeadline')) return true;
        return value >= new Date();
      },
      message: 'Hạn nộp đơn phải là ngày hiện tại hoặc sau ngày hiện tại'
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
  assignedWorkers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: []
  }],
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

jobSchema.methods.isApplicationDeadlineExpired = function() {
  return Boolean(this.applicationDeadline && this.applicationDeadline <= new Date());
};

jobSchema.methods.canReceiveApplications = function() {
  return this.status === 'OPEN' && !this.isApplicationDeadlineExpired();
};

// Validation for dates
jobSchema.pre('save', function() {
  if (this.startDate && this.endDate && this.endDate < this.startDate) {
    throw new Error('End date must be on or after start date');
  }
  if ((this.isNew || this.isModified('startDate')) && this.startDate && this.startDate < new Date()) {
    throw new Error('Start date cannot be in the past');
  }
  if (this.applicationDeadline && this.startDate && this.startDate <= this.applicationDeadline) {
    throw new Error('Start date must be after application deadline');
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
  return this.canReceiveApplications();
});

// Indexes
jobSchema.index({ poster: 1 });
jobSchema.index({ assignedWorker: 1 });
jobSchema.index({ assignedWorkers: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ category: 1 });
jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ applicationDeadline: 1 });
jobSchema.index({ views: -1 });

module.exports = mongoose.model('Job', jobSchema);
