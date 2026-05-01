// backend/models/Connection.js
const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  type: {
    type: String,
    enum: ['mentor-request', 'investor-interest', 'cofounder-request', 'peer-request'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  message: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Connection', connectionSchema);