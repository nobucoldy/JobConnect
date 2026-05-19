const express = require('express');
const router = express.Router();
const {
  createReview,
  getReviewsForUser,
  getReviewsForJob
} = require('../controllers/reviewController');
const { protect } = require('../middlewares/auth');

// Public routes
router.get('/user/:userId', getReviewsForUser);
router.get('/job/:jobId', getReviewsForJob);

// Protected routes
router.post('/', protect, createReview);

module.exports = router;
