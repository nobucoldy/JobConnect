const Review = require('../models/Review');
const Job = require('../models/Job');
const reviewService = require('../services/reviewService');

/**
 * Create a new review for a completed job
 * POST /api/reviews
 * Protected route
 */
exports.createReview = async (req, res) => {
  try {
    const { jobId, rating, comment } = req.body;

    // Check if job exists and is COMPLETED
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.status !== 'COMPLETED') {
      return res.status(400).json({
        success: false,
        message: 'Can only review completed jobs'
      });
    }

    // Determine reviewer role and reviewee
    let reviewerRole, reviewee;

    if (job.poster.toString() === req.user._id.toString()) {
      // Poster reviewing worker
      reviewerRole = 'poster';
      reviewee = job.assignedWorker;

      if (!reviewee) {
        return res.status(400).json({
          success: false,
          message: 'Job has no assigned worker to review'
        });
      }
    } else if (job.assignedWorker?.toString() === req.user._id.toString()) {
      // Worker reviewing poster
      reviewerRole = 'worker';
      reviewee = job.poster;
    } else {
      return res.status(403).json({
        success: false,
        message: 'You did not work on this job'
      });
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({
      job: jobId,
      reviewer: req.user._id
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this job'
      });
    }

    // Create review
    const review = await Review.create({
      job: jobId,
      reviewer: req.user._id,
      reviewee,
      rating,
      comment,
      reviewerRole
    });

    // Update reviewee's rating
    await reviewService.updateUserRating(reviewee);

    await review.populate('reviewer', 'name');
    await review.populate('reviewee', 'name');
    await review.populate('job', 'title');

    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get all reviews for a specific user
 * GET /api/reviews/user/:userId
 * Public route
 */
exports.getReviewsForUser = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate('reviewer', 'name')
      .populate('job', 'title category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments({ reviewee: req.params.userId });

    res.status(200).json({
      success: true,
      data: reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get all reviews for a specific job (max 2: poster review + worker review)
 * GET /api/reviews/job/:jobId
 * Public route
 */
exports.getReviewsForJob = async (req, res) => {
  try {
    const reviews = await Review.find({ job: req.params.jobId })
      .populate('reviewer', 'name')
      .populate('reviewee', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
