const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: false, // Made false to support Google/GitHub OAuth flawlessly
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["student", "mentor", "investor", "unassigned"], // Added unassigned for OAuth flow
      default: null,
      lowercase: true,
      index: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      default: null,
    },
    bio: {
      type: String,
      maxlength: 500,
      default: "Let`s connect",
    },
    skills: {
      type: [String],
      default: [],
    },
    hasCompletedOnboarding: {
      type: Boolean,
      default: false,
    },
    onboardingData: {
      type: Object,
      default: {},
    },
    college: String,
    location: String,
    profileImage: {
      type: String,
      default: "",
    },
    linkedIn: String,
    github: String,
    website: String,
    coverImage: {
      type: String,
      default: "",
    },
    company: {
      type: String,
      default: "FreeLancer",
    },
    expertise: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      enum: ["Engineering", "Product & Design", "Business & Growth"],
      default: null,
      index: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    sessionsHeld: {
      type: Number,
      default: 0,
    },
    responseTime: {
      type: String,
      default: "< 48 hrs",
    },
    isAlumni: {
      type: Boolean,
      default: false,
    },
    gradYear: {
      type: String,
      default: null,
    },
    mentorStatus: {
      type: String,
      enum: ["Accepting Mentees", "Limited Capacity", "Unavailable"],
      default: "Accepting Mentees",
    },

    // ─── INVESTOR SPECIFIC FIELDS ───
    firmName: {
      type: String,
      default: "",
    },
    ticketSize: {
      type: String,
      default: "", // e.g., "$10k - $50k" or "$250k+"
    },
    sectorsOfInterest: {
      type: [String],
      default: [], // e.g., ["AI", "SaaS", "FinTech"]
    },
    investmentThesis: {
      type: String,
      default: "", // e.g., "Impact-driven", "Pure ROI"
    },
    targetStages: {
      type: [String],
      default: [], // e.g., ["Idea", "MVP", "Revenue"]
    },
    
    embedding: {
      type: [Number],
      default: [],
      select: false  // don't send to frontend
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);