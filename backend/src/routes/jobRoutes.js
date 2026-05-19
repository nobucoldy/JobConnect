const express = require('express');
const router = express.Router();
const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
  markJobComplete
} = require('../controllers/jobController');
const { protect } = require('../middlewares/auth');

router.get('/', getAllJobs);
router.get('/my/posted', protect, getMyJobs);
router.get('/:id', getJobById);
router.post('/', protect, createJob);
router.put('/:id', protect, updateJob);
router.delete('/:id', protect, deleteJob);
router.put('/:id/complete', protect, markJobComplete);

module.exports = router;
