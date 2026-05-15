const User = require('../models/User');

/**
 * @desc    Get user by ID
 * @route   GET /api/users/:id
 * @access  Public
 */
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password').lean(); 
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found' });
    }
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
exports.updateProfile = async (req, res, next) => {
  try {
    // Fields that can be updated (Added Investor fields here)
    const allowedUpdates = [
      'name', 'bio', 'skills', 'college', 'location', 
      'profileImage', 'linkedIn', 'github', 'website', 'coverImage', 
      'mentorStatus', 'firmName', 'ticketSize', 'sectorsOfInterest', 
      'investmentThesis', 'targetStages'
    ];
    
    // Filter out fields that shouldn't be updated
    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password').lean(); 
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Search/filter users
 * @route   GET /api/users/search?role=mentor&skill=React&location=Delhi
 * @access  Public
 */
exports.searchUsers = async (req, res, next) => {
  try {
    const { role, skill, location, search } = req.query;
    
    let query = {};
    
    // Filter by role
    if (role) {
      query.role = role;
    }
    
    // Filter by skill
    if (skill) {
      query.skills = { $in: [skill] };
    }
    
    // Filter by location (case-insensitive partial match)
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    
    // Search in name and bio
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } }
      ];
    }
    
    const users = await User.find(query)
      .select('-password')
      .limit(50)
      .sort({ createdAt: -1 })
      .lean(); 
    
    res.json(users);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all mentors with optional skill filter
 * @route   GET /api/users/mentors?skill=React
 * @access  Public
 */
exports.getMentors = async (req, res, next) => {
  try {
    const { skill } = req.query;
    
    let query = { role: 'mentor' };
    
    // Filter by skill if provided
    if (skill) {
      query.skills = { $in: [skill] };
    }
    
    const mentors = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .lean(); 
    
    res.json(mentors);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all investors with optional sector filter
 * @route   GET /api/users/investors?sector=AI
 * @access  Public
 */
exports.getInvestors = async (req, res, next) => {
  try {
    const { sector } = req.query;
    
    let query = { role: 'investor' };
    
    // Filter by sector if provided
    if (skill) {
      query.$or = [
        { skills: { $in: [skill] } },
        { sectorsOfInterest: { $in: [skill] } }
      ];
    }
    
    const investors = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .lean(); 
    
    res.json(investors);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get projects by specific user
 * @route   GET /api/users/:id/projects
 * @access  Public
 */
exports.getUserProjects = async (req, res, next) => {
  try {
    const Project = require('../models/Project');
    
    const projects = await Project.find({ creator: req.params.id })
      .populate('creator', 'name role')
      .sort({ createdAt: -1 })
      .lean(); 
    
    res.json(projects);
  } catch (error) {
    next(error);
  }
};