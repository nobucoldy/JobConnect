const Job = require('../models/Job');

exports.createJob = async (req, res, next) => {
  try {
    const jobData = {
      ...req.body,
      poster: req.user._id,
      status: 'OPEN'
    };

    const job = await Job.create(jobData);
    await job.populate('poster', 'name email phone averageRating');

    res.status(201).json({
      success: true,
      data: job
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllJobs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.location) {
      query.location = { $regex: req.query.location, $options: 'i' };
    }

    // Execute query
    const jobs = await Job.find(query)
      .populate('poster', 'name averageRating')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      data: jobs,
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

exports.getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('poster', 'name email phone averageRating totalReviews')
      .populate('assignedWorker', 'name phone averageRating');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    next(error);
  }
};

exports.updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check ownership
    if (job.poster.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job'
      });
    }

    // Cannot edit completed or cancelled jobs
    if (['COMPLETED', 'CANCELLED'].includes(job.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot edit completed or cancelled jobs'
      });
    }

    // Update job
    Object.assign(job, req.body);
    await job.save();

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check ownership
    if (job.poster.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job'
      });
    }

    // Can only delete OPEN jobs
    if (job.status !== 'OPEN') {
      return res.status(400).json({
        success: false,
        message: 'Can only delete OPEN jobs with no accepted applications'
      });
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.getMyJobs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { poster: req.user._id };

    if (req.query.status) {
      query.status = req.query.status;
    }

    const jobs = await Job.find(query)
      .populate('assignedWorker', 'name phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      data: jobs,
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

exports.markJobComplete = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check ownership
    if (job.poster.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Can only complete ASSIGNED jobs
    if (job.status !== 'ASSIGNED') {
      return res.status(400).json({
        success: false,
        message: 'Can only complete assigned jobs'
      });
    }

    job.status = 'COMPLETED';
    await job.save();

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    next(error);
  }
};
