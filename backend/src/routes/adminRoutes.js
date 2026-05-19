const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getAllJobsAdmin,
  getStatistics,
  createUser,
  deleteJob
} = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/auth');

// All admin routes require authentication and admin role
router.use(protect, authorize('admin'));

router.get('/users', getAllUsers);
router.post('/users', createUser);
router.get('/jobs', getAllJobsAdmin);
router.delete('/jobs/:id', deleteJob);
router.get('/statistics', getStatistics);

module.exports = router;
