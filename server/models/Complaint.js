const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    description: { type: String, required: [true, 'Description is required'] },
    category: { type: String, enum: ['Road', 'Garbage', 'Water', 'Electricity', 'Other'], required: true, index: true },
    area: { type: String, required: [true, 'Area is required'], trim: true, index: true },
    imageUrl: { type: String, default: '' },
    status: { type: String, enum: ['Pending', 'In Progress', 'Resolved'], default: 'Pending', index: true },
    upvotes: { type: Number, default: 0 },
    upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    officerRemark: { type: String, default: '' },
    statusUpdatedAt: { type: Date, default: Date.now },

    // Feedback
    feedbackPending: { type: Boolean, default: false },
    feedbackGiven: { type: Boolean, default: false },
    feedbackRating: { type: Number, min: 1, max: 5 },
    feedbackComment: { type: String, default: '' },
  },
  { timestamps: true }
);

complaintSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Complaint', complaintSchema);
