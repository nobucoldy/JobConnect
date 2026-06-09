const Job = require('../models/Job');
const Application = require('../models/Application');

const attachApplicationCounts = async (jobs) => {
  const plainJobs = jobs.map(job => job.toObject ? job.toObject() : job);
  const jobIds = plainJobs.map(job => job._id);

  const counts = await Application.aggregate([
    { $match: { job: { $in: jobIds } } },
    { $group: { _id: '$job', count: { $sum: 1 } } }
  ]);

  const countMap = new Map(counts.map(item => [item._id.toString(), item.count]));
  return plainJobs.map(job => ({
    ...job,
    applicationsCount: countMap.get(job._id.toString()) || 0
  }));
};

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

    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { location: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Lọc theo lương
    if (req.query.minSalary) {
      query.salary = { $gte: parseInt(req.query.minSalary) };
    }

    if (req.query.maxSalary) {
      query.salary = { ...query.salary, $lte: parseInt(req.query.maxSalary) };
    }

    // Chỉ lấy job còn hạn ứng tuyển
    if (req.query.activeOnly === 'true') {
      query.$and = [
        ...(query.$and || []),
        {
          $or: [
            { applicationDeadline: null },
            { applicationDeadline: { $gt: new Date() } }
          ]
        }
      ];
    }

    // Sắp xếp
    let sortOption = { createdAt: -1 };
    if (req.query.sortBy === 'salary') sortOption = { salary: -1 };
    if (req.query.sortBy === 'views') sortOption = { views: -1 };

    const jobs = await Job.find(query)
      .populate('poster', 'name averageRating')
      .sort(sortOption)
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

    // Tăng lượt xem
    await Job.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

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

    if (job.poster.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job'
      });
    }

    if (['COMPLETED', 'CANCELLED'].includes(job.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot edit completed or cancelled jobs'
      });
    }

    // Không cho phép sửa views và poster
    const { views, poster, ...updateData } = req.body;
    Object.assign(job, updateData);
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

    if (job.poster.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job'
      });
    }

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
    const jobsWithApplicationCounts = await attachApplicationCounts(jobs);

    const total = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      data: jobsWithApplicationCounts,
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

    if (job.poster.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

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
