const express = require('express');
const router = express.Router();
const {
  applyJob,
  getApplicationsForJob,
  getMyApplications,
  acceptApplication,
  rejectApplication,
  deleteApplication
} = require('../controllers/applicationController');
const { protect } = require('../middlewares/auth');

// All routes require authentication
router.use(protect);

// Apply to job
router.post('/', applyJob);

// Get my applications
router.get('/my', getMyApplications);

// Get applications for a job (poster only)
router.get('/job/:jobId', getApplicationsForJob);

// Accept application
router.put('/:id/accept', acceptApplication);

// Reject application
router.put('/:id/reject', rejectApplication);

// Delete/withdraw application
router.delete('/:id', deleteApplication);

module.exports = router;
