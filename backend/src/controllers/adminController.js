const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Review = require('../models/Review');

/**
 * Get all users (admin only)
 * GET /api/admin/users
 */
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.role) {
      query.role = req.query.role;
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: users,
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
 * Get all jobs (admin only)
 * GET /api/admin/jobs
 */
exports.getAllJobsAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.status) {
      query.status = req.query.status;
    }

    const jobs = await Job.find(query)
      .populate('poster', 'name email')
      .populate('assignedWorker', 'name')
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
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get statistics (admin only)
 * GET /api/admin/statistics
 */
exports.getStatistics = async (req, res) => {
  try {
    // Count users by role
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });

    // Count jobs by status
    const totalJobs = await Job.countDocuments();
    const openJobs = await Job.countDocuments({ status: 'OPEN' });
    const assignedJobs = await Job.countDocuments({ status: 'ASSIGNED' });
    const completedJobs = await Job.countDocuments({ status: 'COMPLETED' });
    const cancelledJobs = await Job.countDocuments({ status: 'CANCELLED' });

    // Count applications
    const totalApplications = await Application.countDocuments();
    const pendingApplications = await Application.countDocuments({ status: 'PENDING' });
    const acceptedApplications = await Application.countDocuments({ status: 'ACCEPTED' });
    const rejectedApplications = await Application.countDocuments({ status: 'REJECTED' });

    // Count reviews
    const totalReviews = await Review.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          admins: totalAdmins
        },
        jobs: {
          total: totalJobs,
          open: openJobs,
          assigned: assignedJobs,
          completed: completedJobs,
          cancelled: cancelledJobs
        },
        applications: {
          total: totalApplications,
          pending: pendingApplications,
          accepted: acceptedApplications,
          rejected: rejectedApplications
        },
        reviews: {
          total: totalReviews
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
