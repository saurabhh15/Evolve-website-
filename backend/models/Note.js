const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true // Added to quickly fetch all notes written by a specific mentor
  },
  mentee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true // Added to quickly fetch all notes written about a specific mentee
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Note', noteSchema);