const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema(
  {
    investor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    notes: {
      type: String,
      maxlength: 500,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// One investor can save a project only once
watchlistSchema.index({ investor: 1, project: 1 }, { unique: true });

module.exports = mongoose.model('Watchlist', watchlistSchema);