const express = require('express');
const router = express.Router();
const { toggleBookmark, getSavedJobs } = require('../controllers/bookmarkController');

// ⚠️ Thay 'protect' bằng tên middleware auth của bạn (xem authRoutes.js)
const {  protect  }= require('../middlewares/auth');

router.use(protect);
router.post('/:jobId/toggle', toggleBookmark);
router.get('/', getSavedJobs);
module.exports = router;