const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: [
      'comment',
      'connection_request',
      'connection_accepted',
      'project_like',
      'new_application',
      'application_accepted',
      'application_rejected'
    ],
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  },
  role: {
    type: String,
    default: null
  },
  read: {
    type: Boolean,
    default: false,
    index: true
  },
  message: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);