const mongoose = require('mongoose');

const ProjectActivitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true, // Add index to the user field
  },
  activityName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'in-progress', 'cancelled'],
    default: 'pending',
  },
  // Add other fields relevant to project activities based on frontend components
  // For example, project, location, etc.
  project: {
    type: String,
    required: false, // Assuming project might not always be required initially
  },
  location: {
    type: String,
    required: false,
  }
}, { timestamps: true });

module.exports = mongoose.model('ProjectActivity', ProjectActivitySchema);
