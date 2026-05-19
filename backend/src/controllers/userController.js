const User = require('../models/User');
const Job = require('../models/Job');
const Review = require('../models/Review');

/**
 * Get user profile with jobs and reviews
 * GET /api/users/:id
 * Public route
 */
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get jobs as poster
    const jobsAsPoster = await Job.find({ poster: user._id })
      .select('title status createdAt')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get jobs as worker
    const jobsAsWorker = await Job.find({
      assignedWorker: user._id,
      status: 'COMPLETED'
    })
      .select('title status createdAt')
      .populate('poster', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get reviews
    const reviews = await Review.find({ reviewee: user._id })
      .populate('reviewer', 'name')
      .populate('job', 'title')
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      data: {
        user,
        jobsAsPoster,
        jobsAsWorker,
        reviews
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
 * Update own profile
 * PUT /api/users/profile
 * Protected route
 */
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
