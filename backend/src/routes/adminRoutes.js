const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getAllJobsAdmin,
  getStatistics
} = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/auth');

// All admin routes require authentication and admin role
router.use(protect, authorize('admin'));

router.get('/users', getAllUsers);
router.get('/jobs', getAllJobsAdmin);
router.get('/statistics', getStatistics);

module.exports = router;
