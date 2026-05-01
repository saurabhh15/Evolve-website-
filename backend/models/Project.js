// backend/models/Project.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  tagline: {
    type: String,
    required: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['AI/ML', 'Web Dev', 'Mobile App', 'IoT', 'Blockchain', 'HealthTech', 'EdTech', 'FinTech', 'Other'],
    required: true
  },
  stage: {
    type: String,
    enum: ['idea', 'prototype', 'mvp', 'launched'],
    default: 'idea'
  },
  teamSize: {
    type: Number,
    default: 1
  },
  lookingFor: [{
    type: String,
    enum: ['mentor', 'co-founder', 'investor', 'feedback','team-member']
  }],
  tags: [String],
  demoUrl: String,
  githubUrl: String,
  images: [String],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  teamMembers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  viewCount: {
    type: Number,
    default: 0
  },
  weeklyViews: {
    type: Number,
    default: 0
  },
  weeklyLikes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);