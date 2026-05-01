const mongoose = require('mongoose');

const learningGoalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skill: {
    type: String,
    required: true,
    trim: true
  },
  target: {
    type: Number,
    required: true,
    min: 1,
    max: 20
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('LearningGoal', learningGoalSchema);