const Feedback = require('../models/Feedback');
const PulsePost = require('../models/PulsePost');
const Project = require('../models/Project');

// Returns all feedback for a specific project
exports.getProjectFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ project: req.params.projectId })
      .populate('author', 'name profileImage role college company')
      .sort({ createdAt: -1 });

    res.json(feedback);
  } catch (err) {
    console.error('GET feedback error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add feedback to a project
exports.addFeedback = async (req, res) => {
  try {
    const { content, feedbackType, rating, isPublic } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Content is required' });
    }

    if (content.length > 2000) {
      return res.status(400).json({ message: 'Content must be under 2000 characters' });
    }

    // Make sure project exists
    const project = await Project.findById(req.params.projectId)
      .populate('creator', 'name');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Create the feedback document
    const feedback = new Feedback({
      project: req.params.projectId,
      author: req.user.userId,
      content: content.trim(),
      feedbackType: feedbackType || 'general',
      rating: rating || null,
      isPublic: isPublic || false,
    });

    await feedback.save();

    // Cross-post to Pulse if isPublic = true
    if (isPublic) {
      const pulsePost = new PulsePost({
        author: req.user.userId,
        project: req.params.projectId,
        postType: 'feedback',
        headline: `Feedback on ${project.title}`,
        body: content.trim(),
        tags: [],
        sourceFeedbackId: feedback._id,
        targetAudience: 'anyone',
      });

      await pulsePost.save();

      // Link the pulse post back to the feedback document
      feedback.pulsePostId = pulsePost._id;
      await feedback.save();
    }

    // Return populated feedback
    const populated = await Feedback.findById(feedback._id)
      .populate('author', 'name profileImage role college company');

    res.status(201).json(populated);
  } catch (err) {
    console.error('POST feedback error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Edit your own feedback
exports.updateFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.feedbackId);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    if (feedback.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorised' });
    }

    const { content, feedbackType, rating } = req.body;

    if (content) feedback.content = content.trim();
    if (feedbackType) feedback.feedbackType = feedbackType;
    if (rating !== undefined) feedback.rating = rating;
    feedback.isEdited = true;

    // If this feedback is cross-posted to Pulse, sync the body there too
    if (feedback.pulsePostId && content) {
      await PulsePost.findByIdAndUpdate(feedback.pulsePostId, {
        body: content.trim(),
      });
    }

    await feedback.save();

    const populated = await Feedback.findById(feedback._id)
      .populate('author', 'name profileImage role college company');

    res.json(populated);
  } catch (err) {
    console.error('PUT feedback error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Author or project owner can delete feedback
exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.feedbackId)
      .populate('project', 'creator');

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    const isAuthor = feedback.author.toString() === req.user.userId;
    const isProjectOwner =
      feedback.project?.creator?.toString() === req.user.userId;

    if (!isAuthor && !isProjectOwner) {
      return res.status(403).json({ message: 'Not authorised' });
    }

    // If cross-posted to Pulse, remove that post too
    if (feedback.pulsePostId) {
      await PulsePost.findByIdAndDelete(feedback.pulsePostId);
    }

    await Feedback.findByIdAndDelete(req.params.feedbackId);

    res.json({ message: 'Feedback deleted' });
  } catch (err) {
    console.error('DELETE feedback error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};