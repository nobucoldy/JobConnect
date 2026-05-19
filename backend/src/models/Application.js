const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, 'Job is required']
  },
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Worker is required']
  },
  coverLetter: {
    type: String,
    maxlength: [500, 'Cover letter cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
    default: 'PENDING'
  }
}, {
  timestamps: true
});

// Compound unique index: one user can only apply once to a job
applicationSchema.index({ job: 1, worker: 1 }, { unique: true });

// Other indexes for performance
applicationSchema.index({ job: 1 });
applicationSchema.index({ worker: 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ job: 1, status: 1 });

module.exports = mongoose.model('Application', applicationSchema);
