const { Parser } = require('json2csv');
const Complaint = require('../models/Complaint');
const { withPriority } = require('../utils/priority');

// @desc Create a complaint
// @route POST /api/complaints
const createComplaint = async (req, res, next) => {
  try {
    const { title, description, category, area, imageUrl } = req.body;
    if (!title || !description || !category || !area) {
      return res.status(400).json({ success: false, message: 'Please provide title, description, category and area' });
    }

    const complaint = await Complaint.create({
      title, description, category, area, imageUrl,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, data: withPriority(complaint) });
  } catch (err) {
    next(err);
  }
};

// @desc Get all complaints (public feed / officer dashboard), with filters.
// Also used for duplicate detection: ?category=&area=&status=pending,in-progress
// @route GET /api/complaints
const getComplaints = async (req, res, next) => {
  try {
    const {
      search = '', category = '', area = '', status = '', priority = '',
      sort = '-createdAt', page = 1, limit = 20,
    } = req.query;

    const query = {};
    if (search) query.$text = { $search: search };
    if (category) query.category = category;
    if (area) query.area = { $regex: area, $options: 'i' };
    if (status) {
      const statuses = status.split(',').map((s) => s.trim());
      query.status = statuses.length > 1 ? { $in: statuses } : statuses[0];
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.max(parseInt(limit, 10) || 20, 1);
    const skip = (pageNum - 1) * limitNum;

    const [complaintsRaw, total] = await Promise.all([
      Complaint.find(query).populate('createdBy', 'name email').sort(sort).skip(skip).limit(limitNum),
      Complaint.countDocuments(query),
    ]);

    let complaints = complaintsRaw.map(withPriority);

    // Optional priority filter (computed field, so filter in memory after fetch)
    if (priority) {
      complaints = complaints.filter((c) => c.priority === priority);
    }

    res.json({
      success: true,
      data: complaints,
      pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) || 1 },
    });
  } catch (err) {
    next(err);
  }
};

// @desc Get complaints filed by the logged-in citizen
// @route GET /api/complaints/mine
const getMyComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({ createdBy: req.user._id }).sort('-createdAt');
    res.json({ success: true, data: complaints.map(withPriority) });
  } catch (err) {
    next(err);
  }
};

// @desc Get one complaint
// @route GET /api/complaints/:id
const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate('createdBy', 'name email');
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });
    res.json({ success: true, data: withPriority(complaint) });
  } catch (err) {
    next(err);
  }
};

// @desc Upvote a complaint (one upvote per citizen)
// @route PATCH /api/complaints/:id/upvote
const upvoteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });

    if (complaint.upvotedBy.some((u) => String(u) === String(req.user._id))) {
      return res.status(400).json({ success: false, message: 'You have already upvoted this complaint' });
    }

    complaint.upvotes += 1;
    complaint.upvotedBy.push(req.user._id);
    await complaint.save();

    res.json({ success: true, data: withPriority(complaint) });
  } catch (err) {
    next(err);
  }
};

// @desc Update complaint status + remark (officer only)
// @route PATCH /api/complaints/:id/status
const updateStatus = async (req, res, next) => {
  try {
    const { status, remark } = req.body;
    if (!['Pending', 'In Progress', 'Resolved'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });

    complaint.status = status;
    if (remark !== undefined) complaint.officerRemark = remark;
    complaint.statusUpdatedAt = new Date();

    if (status === 'Resolved' && !complaint.feedbackGiven) {
      complaint.feedbackPending = true;
    }
    if (status !== 'Resolved') {
      complaint.feedbackPending = false;
    }

    await complaint.save();
    res.json({ success: true, data: withPriority(complaint) });
  } catch (err) {
    next(err);
  }
};

// @desc Citizen submits satisfaction feedback after resolution
// @route PATCH /api/complaints/:id/feedback
const submitFeedback = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Please provide a rating between 1 and 5' });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });
    if (String(complaint.createdBy) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'You can only rate your own complaints' });
    }

    complaint.feedbackRating = rating;
    complaint.feedbackComment = comment || '';
    complaint.feedbackGiven = true;
    complaint.feedbackPending = false;
    await complaint.save();

    res.json({ success: true, data: withPriority(complaint) });
  } catch (err) {
    next(err);
  }
};

// @desc Export filtered complaints as CSV (officer only)
// @route GET /api/complaints/export
const exportComplaints = async (req, res, next) => {
  try {
    const { search = '', category = '', area = '', status = '' } = req.query;
    const query = {};
    if (search) query.$text = { $search: search };
    if (category) query.category = category;
    if (area) query.area = { $regex: area, $options: 'i' };
    if (status) query.status = status;

    const complaintsRaw = await Complaint.find(query).populate('createdBy', 'name').sort('-createdAt');
    const complaints = complaintsRaw.map(withPriority);

    const rows = complaints.map((c) => ({
      ID: c._id,
      Title: c.title,
      Category: c.category,
      Area: c.area,
      Status: c.status,
      Priority: c.priority,
      Upvotes: c.upvotes,
      'Filed By': c.createdBy?.name || 'Unknown',
      'Filed On': new Date(c.createdAt).toISOString(),
      'Last Updated': new Date(c.statusUpdatedAt || c.updatedAt).toISOString(),
      'Officer Remark': c.officerRemark || '',
    }));

    const parser = new Parser({
      fields: ['ID', 'Title', 'Category', 'Area', 'Status', 'Priority', 'Upvotes', 'Filed By', 'Filed On', 'Last Updated', 'Officer Remark'],
    });
    const csv = parser.parse(rows);

    const dateStr = new Date().toISOString().slice(0, 10);
    res.header('Content-Type', 'text/csv');
    res.attachment(`complaints_export_${dateStr}.csv`);
    res.send(csv);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createComplaint, getComplaints, getMyComplaints, getComplaintById,
  upvoteComplaint, updateStatus, submitFeedback, exportComplaints,
};
