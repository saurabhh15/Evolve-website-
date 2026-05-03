const Project = require('../models/Project');

/**
 * @desc    Create new project
 * @route   POST /api/projects
 * @access  Private
 */
exports.createProject = async (req, res, next) => {
  try {
    const project = new Project({
      ...req.body,
      creator: req.user.userId
    });

    await project.save();

    // Populate creator info before sending response
    await project.populate('creator', 'name role college');

    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all projects with optional filters
 * @route   GET /api/projects
 * @access  Public
 */
exports.getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.find()
      .populate('creator', 'name role college profileImage')
      .sort({ createdAt: -1 })
      .limit(100) // Prevent loading too many at once
      .lean(); // Optimization added here

    res.json(projects);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Search and filter projects
 * @route   GET /api/projects/search?category=AI/ML&stage=mvp&search=blockchain
 * @access  Public
 */
exports.searchProjects = async (req, res, next) => {
  try {
    const { category, stage, search, lookingFor, tags } = req.query;

    let query = {};

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by stage
    if (stage) {
      query.stage = stage;
    }

    // Filter by what they're looking for
    if (lookingFor) {
      query.lookingFor = { $in: [lookingFor] };
    }

    // Filter by tags
    if (tags) {
      const tagArray = tags.split(',');
      query.tags = { $in: tagArray };
    }

    // Text search in title, description, and tags
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tagline: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const projects = await Project.find(query)
      .populate('creator', 'name role college profileImage')
      .sort({ createdAt: -1 })
      .limit(100)
      .lean(); // Optimization added here

    res.json(projects);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single project by ID (and increment view count)
 * @route   GET /api/projects/:id
 * @access  Public
 */
exports.getProjectById = async (req, res, next) => {
  try {
    // Increment view count and return updated project
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewCount: 1, weeklyViews: 1 } },
      { new: true }
    )
      .populate('creator', 'name role college profileImage bio linkedIn github')
      .populate('teamMembers', 'name role profileImage')
      .lean(); // Optimization added here

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Project not found' });
    }
    next(error);
  }
};

/**
 * @desc    Update project
 * @route   PUT /api/projects/:id
 * @access  Private (Only creator)
 */
exports.updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is the creator
    if (project.creator.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }

    // Fields that can be updated
    const allowedUpdates = [
      'title', 'tagline', 'description', 'category', 'stage',
      'teamSize', 'lookingFor', 'tags', 'demoUrl', 'githubUrl', 'images'
    ];

    // Apply updates
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        project[key] = req.body[key];
      }
    });

    await project.save();

    await project.populate('creator', 'name role college');

    res.json(project);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete project
 * @route   DELETE /api/projects/:id
 * @access  Private (Only creator)
 */
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is the creator
    if (project.creator.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }

    await project.deleteOne();

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Like/Unlike a project (toggle)
 * @route   POST /api/projects/:id/like
 * @access  Private
 */
exports.toggleLike = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const userId = req.user.userId;
    const likeIndex = project.likes.findIndex(id => id.toString() === userId);

    let isLiked;

    if (likeIndex > -1) {
      project.likes.splice(likeIndex, 1);
      project.weeklyLikes = Math.max((project.weeklyLikes || 0) - 1, 0);
      isLiked = false;
    } else {
      project.likes.push(userId);
      project.weeklyLikes = (project.weeklyLikes || 0) + 1;
      isLiked = true;
    }

    await project.save();

    res.json({
      likes: project.likes.length,
      isLiked,
      message: isLiked ? 'Project liked' : 'Project unliked'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get projects created by current user
 * @route   GET /api/projects/my-projects
 * @access  Private
 */
exports.getMyProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ creator: req.user.userId })
      .sort({ createdAt: -1 })
      .lean(); // Optimization added here

    res.json(projects);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add team member to project
 * @route   POST /api/projects/:id/team
 * @access  Private (Only creator)
 */
exports.addTeamMember = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is the creator
    if (project.creator.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if user is already a team member
    if (project.teamMembers.includes(userId)) {
      return res.status(400).json({ message: 'User is already a team member' });
    }

    project.teamMembers.push(userId);
    await project.save();

    await project.populate('teamMembers', 'name role profileImage');

    res.json(project);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove team member from project
 * @route   DELETE /api/projects/:id/team/:userId
 * @access  Private (Only creator)
 */
exports.removeTeamMember = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is the creator
    if (project.creator.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Remove team member
    project.teamMembers = project.teamMembers.filter(
      id => id.toString() !== req.params.userId
    );

    await project.save();

    res.json({ message: 'Team member removed successfully' });
  } catch (error) {
    next(error);
  }
};