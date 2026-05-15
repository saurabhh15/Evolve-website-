const mongoose = require('mongoose');

const pulsePostSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // Optional — not every post is tied to a project
    // (e.g. an investor asking a general question)
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null,
      index: true,
    },

    // 'update'    — student sharing build progress
    // 'help'      — someone is stuck and needs help
    // 'milestone' — celebrating a win
    // 'feedback'  — requesting community feedback
    // 'question'  — open question (mentor / investor / student)
    postType: {
      type: String,
      enum: ['update', 'help', 'milestone', 'feedback', 'question'],
      required: true,
      index: true,
    },

    headline: {
      type: String,
      required: true,
      maxlength: 120,
    },

    body: {
      type: String,
      required: true,
      maxlength: 2000,
    },

    // For 'help' posts only
    urgency: {
      type: String,
      enum: ['low', 'medium', 'high', null],
      default: null,
    },

    // For 'help' posts — marked true when the problem is solved
    isResolved: {
      type: Boolean,
      default: false,
      index: true,
    },

    // For 'feedback' posts — who should ideally respond
    targetAudience: {
      type: String,
      enum: ['anyone', 'mentors', 'investors', 'peers', null],
      default: 'anyone',
    },

    // For 'milestone' posts
    milestoneType: {
      type: String,
      enum: [
        'users',
        'revenue',
        'hackathon',
        'first_customer',
        'partnership',
        'open_source',
        'press',
        'other',
        null,
      ],
      default: null,
    },

    // Searchable tags — max 5 enforced at route level
    tags: {
      type: [String],
      default: [],
    },

    // Optional attachment (image or link)
    attachmentUrl: {
      type: String,
      default: null,
    },

    // Upvotes — array of user IDs (like your likes system on Project)
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    // When this post was auto-generated from a Feedback document
    // (isPublic = true on Feedback), we store the source feedback ID
    sourceFeedbackId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Feedback',
      default: null,
    },

    // Soft-delete — hidden from feed but not hard-deleted
    isHidden: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    // Virtual for reply count — replies stored in PulseReply collection
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound index for the global feed query:
// non-hidden posts sorted by newest first
pulsePostSchema.index({ isHidden: 1, createdAt: -1 });

// Index for filtering by type
pulsePostSchema.index({ postType: 1, createdAt: -1 });

// Index for filtering by project
pulsePostSchema.index({ project: 1, createdAt: -1 });

module.exports = mongoose.model('PulsePost', pulsePostSchema);