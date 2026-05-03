const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true, // unique automatically creates an index
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['Student', 'Mentor', 'Investor', null],
    default: null,
    index: true // Added so you can quickly query "Find all Mentors" or "Find all Students"
  },
  bio: {
    type: String,
    maxlength: 500,
    default: 'Let`s connect'
  },
  skills: {
    type: [String],
    default: []
  },
  hasCompletedOnboarding: {
    type: Boolean,
    default: false
  },
  onboardingData: {
    type: Object,
    default: {}
  },
  college: String,
  location: String,
  profileImage: {
    type: String,
    default: 'https://img.freepik.com/premium-photo/memoji-emoji-handsome-smiling-man-white-background_826801-6987.jpg?semt=ais_hybrid&w=740&q=80'
  },
  linkedIn: String,
  github: String,
  website: String,
  coverImage: {
    type: String,
    default: ''
  },
  // --- Mentor-specific fields ---
  company: {
    type: String,
    default: 'FreeLancer'
  },
  expertise: {
    type: [String],
    default: []
  },
  category: {
    type: String,
    enum: ['Engineering', 'Product & Design', 'Business & Growth'],
    default: null,
    index: true // Added so you can quickly filter mentors by category
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  sessionsHeld: {
    type: Number,
    default: 0
  },
  responseTime: {
    type: String,
    default: '< 48 hrs'
  },
  isAlumni: {
    type: Boolean,
    default: false
  },
  gradYear: {
    type: String,
    default: null
  },
  mentorStatus: {
    type: String,
    enum: ['Accepting Mentees', 'Limited Capacity', 'Unavailable'],
    default: 'Accepting Mentees'
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);