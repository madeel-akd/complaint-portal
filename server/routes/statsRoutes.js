const express = require('express');
const router = express.Router();
const { getOfficerStats } = require('../controllers/statsController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/stats', protect, authorize('officer'), getOfficerStats);

module.exports = router;
