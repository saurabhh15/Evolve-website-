const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // What kind of feedback is this?
    // 'general'   — open-ended thoughts
    // 'technical' — code / architecture / stack review
    // 'ux'        — design / user experience
    // 'business'  — market fit, business model, monetisation
    // 'pitch'     — pitch deck / investor readiness
    feedbackType: {
      type: String,
      enum: ['general', 'technical', 'ux', 'business', 'pitch'],
      default: 'general',
      index: true,
    },

    content: {
      type: String,
      required: true,
      maxlength: 2000,
    },

    // Optional 1–5 rating for the project overall
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },

    // When true this feedback is cross-posted to the Pulse feed
    // and a PulsePost document is created that references this feedback
    isPublic: {
      type: Boolean,
      default: false,
      index: true,
    },

    // Filled in automatically when isPublic = true
    pulsePostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PulsePost',
      default: null,
    },

    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// One author can leave multiple feedback items per project
// but we index the pair for fast lookups
feedbackSchema.index({ project: 1, author: 1 });

module.exports = mongoose.model('Feedback', feedbackSchema);