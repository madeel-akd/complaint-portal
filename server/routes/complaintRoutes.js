const express = require('express');
const router = express.Router();
const {
  createComplaint, getComplaints, getMyComplaints, getComplaintById,
  upvoteComplaint, updateStatus, submitFeedback, exportComplaints,
} = require('../controllers/complaintController');
const { protect, optionalAuth, authorize } = require('../middleware/authMiddleware');

// Order matters: static paths before /:id
router.get('/mine', protect, authorize('citizen'), getMyComplaints);
router.get('/export', protect, authorize('officer'), exportComplaints);

router.get('/', optionalAuth, getComplaints);
router.post('/', protect, authorize('citizen'), createComplaint);

router.get('/:id', optionalAuth, getComplaintById);
router.patch('/:id/upvote', protect, authorize('citizen'), upvoteComplaint);
router.patch('/:id/status', protect, authorize('officer'), updateStatus);
router.patch('/:id/feedback', protect, authorize('citizen'), submitFeedback);

module.exports = router;
