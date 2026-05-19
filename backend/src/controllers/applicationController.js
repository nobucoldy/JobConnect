const Application = require('../models/Application');
const Job = require('../models/Job');
const mongoose = require('mongoose');

// @desc    Apply to a job
// @route   POST /api/applications
// @access  Private
exports.applyJob = async (req, res, next) => {
  try {
    const { jobId, coverLetter } = req.body;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if job is OPEN
    if (job.status !== 'OPEN') {
      return res.status(400).json({
        success: false,
        message: 'This job is not accepting applications'
      });
    }

    // Check if user is not the poster
    if (job.poster.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot apply to your own job'
      });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      worker: req.user._id
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this job'
      });
    }

    // Create application
    const application = await Application.create({
      job: jobId,
      worker: req.user._id,
      coverLetter,
      status: 'PENDING'
    });

    await application.populate('worker', 'name phone averageRating');
    await application.populate('job', 'title category');

    res.status(201).json({
      success: true,
      data: application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get applications for a job (poster only)
// @route   GET /api/applications/job/:jobId
// @access  Private
exports.getApplicationsForJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if user is the poster
    if (job.poster.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view applications'
      });
    }

    const query = { job: req.params.jobId };

    if (req.query.status) {
      query.status = req.query.status;
    }

    const applications = await Application.find(query)
      .populate('worker', 'name phone email averageRating totalReviews')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: applications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my applications (worker)
// @route   GET /api/applications/my
// @access  Private
exports.getMyApplications = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { worker: req.user._id };

    if (req.query.status) {
      query.status = req.query.status;
    }

    const applications = await Application.find(query)
      .populate({
        path: 'job',
        select: 'title category location salary status',
        populate: {
          path: 'poster',
          select: 'name averageRating'
        }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Application.countDocuments(query);

    res.status(200).json({
      success: true,
      data: applications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept application
// @route   PUT /api/applications/:id/accept
// @access  Private
exports.acceptApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    const job = await Job.findById(application.job);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if user is the poster
    if (job.poster.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Check if job is still OPEN
    if (job.status !== 'OPEN') {
      return res.status(400).json({
        success: false,
        message: 'Job is not accepting applications'
      });
    }

    // Check if application is PENDING
    if (application.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: 'Application is not pending'
      });
    }

    // Update application to ACCEPTED
    application.status = 'ACCEPTED';
    await application.save();

    // Update job status and assign worker
    job.status = 'ASSIGNED';
    job.assignedWorker = application.worker;
    await job.save();

    // Reject all other PENDING applications for this job
    await Application.updateMany(
      {
        job: job._id,
        _id: { $ne: application._id },
        status: 'PENDING'
      },
      { status: 'REJECTED' }
    );

    await application.populate('worker', 'name phone');

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject application
// @route   PUT /api/applications/:id/reject
// @access  Private
exports.rejectApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    const job = await Job.findById(application.job);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if user is the poster
    if (job.poster.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    application.status = 'REJECTED';
    await application.save();

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete application (worker can withdraw)
// @route   DELETE /api/applications/:id
// @access  Private
exports.deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user is the worker
    if (application.worker.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this application'
      });
    }

    // Can only delete PENDING applications
    if (application.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        message: 'Can only withdraw pending applications'
      });
    }

    await application.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Application withdrawn successfully'
    });
  } catch (error) {
    next(error);
  }
};
