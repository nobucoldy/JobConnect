const User = require('../models/User');

// Toggle bookmark (lưu / bỏ lưu)
const toggleBookmark = async (req, res) => {
  try {
    const { jobId } = req.params;
    const user = await User.findById(req.user.id);

    const index = user.savedJobs.findIndex(id => id.toString() === jobId);
    let saved;

    if (index > -1) {
      user.savedJobs.splice(index, 1);
      saved = false;
    } else {
      user.savedJobs.push(jobId);
      saved = true;
    }

    await user.save();
    res.json({
      success: true,
      saved,
      message: saved ? 'Đã lưu công việc' : 'Đã bỏ lưu công việc'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// Lấy danh sách việc đã lưu
const getSavedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'savedJobs',
      select: 'title salary salaryUnit location status category createdAt poster',
      populate: { path: 'poster', select: 'name averageRating' }
    });
    res.json({ success: true, data: user.savedJobs });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

module.exports = { toggleBookmark, getSavedJobs };