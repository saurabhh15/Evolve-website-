const Comment = require('../models/Comment');
const Project = require('../models/Project');
const Notification = require('../models/Notification');

/**
 * @desc    Get all comments for a project
 * @route   GET /api/projects/:id/comments
 * @access  Public
 */
exports.getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ project: req.params.id })
      .populate('author', 'name role profileImage college')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add comment to a project
 * @route   POST /api/projects/:id/comments
 * @access  Private
 */
exports.addComment = async (req, res, next) => {
  try {
    const { content } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const comment = new Comment({
      project: req.params.id,
      author: req.user.userId,
      content: content.trim()
    });

    await comment.save();
    await comment.populate('author', 'name role profileImage college');

    // Create notification for project owner (if commenter is not the owner)
    if (project.creator.toString() !== req.user.userId) {
      const notification = new Notification({
        recipient: project.creator,
        sender: req.user.userId,
        type: 'comment',
        project: project._id,
        comment: comment._id,
        message: `commented on your project "${project.title}"`
      });
      await notification.save();
    }

    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Edit a comment
 * @route   PUT /api/comments/:commentId
 * @access  Private (Only comment author)
 */
exports.editComment = async (req, res, next) => {
  try {
    const { content } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Only author can edit
    if (comment.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to edit this comment' });
    }

    comment.content = content.trim();
    comment.isEdited = true;
    await comment.save();
    await comment.populate('author', 'name role profileImage college');

    res.json(comment);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a comment
 * @route   DELETE /api/comments/:commentId
 * @access  Private (Comment author or project owner)
 */
exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId)
      .populate('project', 'creator');

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const isAuthor = comment.author.toString() === req.user.userId;
    const isProjectOwner = comment.project.creator.toString() === req.user.userId;

    if (!isAuthor && !isProjectOwner) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();

    // Delete associated notification
    await Notification.deleteOne({
      comment: comment._id,
      type: 'comment'
    });

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    next(error);
  }
};