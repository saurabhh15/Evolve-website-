const PulsePost = require('../models/PulsePost');
const PulseReply = require('../models/PulseReply');

// ---------------------------------------------
// GET /api/pulse
// Global feed - latest 20 posts, paginated
// Optional query params:
//   ?type=update|help|milestone|feedback|question
//   ?tag=React
//   ?page=1  (default 1, 20 per page)
// ---------------------------------------------
exports.getGlobalFeed = async (req, res) => {
  try {
    const { type, tag, page = 1 } = req.query;
    const limit = 20;
    const skip = (parseInt(page) - 1) * limit;

    const query = { isHidden: false };
    if (type) query.postType = type;
    if (tag) query.tags = tag;

    const [posts, total] = await Promise.all([
      PulsePost.find(query)
        .populate('author', 'name profileImage role college company firmName')
        .populate('project', 'title category stage')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      PulsePost.countDocuments(query),
    ]);

    // Attach reply counts without fetching all replies
    const postIds = posts.map((p) => p._id);
    const replyCounts = await PulseReply.aggregate([
      { $match: { post: { $in: postIds } } },
      { $group: { _id: '$post', count: { $sum: 1 } } },
    ]);

    const replyCountMap = {};
    replyCounts.forEach((r) => {
      replyCountMap[r._id.toString()] = r.count;
    });

    const enriched = posts.map((p) => ({
      ...p.toObject(),
      replyCount: replyCountMap[p._id.toString()] || 0,
    }));

    res.json({
      posts: enriched,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error('GET /pulse error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ---------------------------------------------
// GET /api/pulse/stats
// Platform-wide stats for the sidebar widget
// ---------------------------------------------
exports.getStats = async (req, res) => {
  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000); // last 24 hrs

    const [totalToday, resolvedToday, milestones] = await Promise.all([
      PulsePost.countDocuments({ createdAt: { $gte: since }, isHidden: false }),
      PulsePost.countDocuments({
        postType: 'help',
        isResolved: true,
        updatedAt: { $gte: since },
      }),
      PulsePost.countDocuments({
        postType: 'milestone',
        createdAt: { $gte: since },
      }),
    ]);

    res.json({ totalToday, resolvedToday, milestones });
  } catch (err) {
    console.error('GET /pulse/stats error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ---------------------------------------------
// GET /api/pulse/:postId
// Single post with replies
// ---------------------------------------------
exports.getPostById = async (req, res) => {
  try {
    const post = await PulsePost.findById(req.params.postId)
      .populate('author', 'name profileImage role college company firmName')
      .populate('project', 'title category stage');

    if (!post || post.isHidden) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const replies = await PulseReply.find({ post: req.params.postId })
      .populate('author', 'name profileImage role college company')
      .sort({ createdAt: 1 });

    res.json({ post, replies });
  } catch (err) {
    console.error('GET /pulse/:postId error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ---------------------------------------------
// POST /api/pulse
// Create a new Pulse post
// ---------------------------------------------
exports.createPost = async (req, res) => {
  try {
    const {
      postType,
      headline,
      body,
      projectId,
      urgency,
      targetAudience,
      milestoneType,
      tags,
      attachmentUrl,
    } = req.body;

    if (!postType || !headline?.trim() || !body?.trim()) {
      return res.status(400).json({
        message: 'postType, headline, and body are required',
      });
    }

    if (!['update', 'help', 'milestone', 'feedback', 'question'].includes(postType)) {
      return res.status(400).json({ message: 'Invalid postType' });
    }

    // Enforce max 5 tags
    const cleanTags = Array.isArray(tags)
      ? tags.slice(0, 5).map((t) => t.trim()).filter(Boolean)
      : [];

    const post = new PulsePost({
      author: req.user.userId,
      project: projectId || null,
      postType,
      headline: headline.trim(),
      body: body.trim(),
      urgency: postType === 'help' ? urgency || null : null,
      targetAudience: postType === 'feedback' ? targetAudience || 'anyone' : null,
      milestoneType: postType === 'milestone' ? milestoneType || null : null,
      tags: cleanTags,
      attachmentUrl: attachmentUrl || null,
    });

    await post.save();

    const populated = await PulsePost.findById(post._id)
      .populate('author', 'name profileImage role college company firmName')
      .populate('project', 'title category stage');

    res.status(201).json({ ...populated.toObject(), replyCount: 0 });
  } catch (err) {
    console.error('POST /pulse error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ---------------------------------------------
// PUT /api/pulse/:postId
// Edit your own post
// ---------------------------------------------
exports.updatePost = async (req, res) => {
  try {
    const post = await PulsePost.findById(req.params.postId);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorised' });
    }

    const { headline, body, tags, attachmentUrl, urgency } = req.body;

    if (headline) post.headline = headline.trim();
    if (body) post.body = body.trim();
    if (tags) post.tags = tags.slice(0, 5);
    if (attachmentUrl !== undefined) post.attachmentUrl = attachmentUrl;
    if (urgency !== undefined) post.urgency = urgency;

    await post.save();

    const populated = await PulsePost.findById(post._id)
      .populate('author', 'name profileImage role college company firmName')
      .populate('project', 'title category stage');

    res.json(populated);
  } catch (err) {
    console.error('PUT /pulse/:postId error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ---------------------------------------------
// DELETE /api/pulse/:postId
// Author can delete their own post
// ---------------------------------------------
exports.deletePost = async (req, res) => {
  try {
    const post = await PulsePost.findById(req.params.postId);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorised' });
    }

    await PulsePost.findByIdAndDelete(req.params.postId);
    // Cascade delete all replies on this post
    await PulseReply.deleteMany({ post: req.params.postId });

    res.json({ message: 'Post deleted' });
  } catch (err) {
    console.error('DELETE /pulse/:postId error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ---------------------------------------------
// POST /api/pulse/:postId/upvote
// Toggle upvote 
// ---------------------------------------------
exports.toggleUpvote = async (req, res) => {
  try {
    const post = await PulsePost.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const userId = req.user.userId;
    const alreadyUpvoted = post.upvotes.some((id) => id.toString() === userId);

    if (alreadyUpvoted) {
      post.upvotes = post.upvotes.filter((id) => id.toString() !== userId);
    } else {
      post.upvotes.push(userId);
    }

    await post.save();
    res.json({ upvotes: post.upvotes.length, upvoted: !alreadyUpvoted });
  } catch (err) {
    console.error('POST /pulse/:postId/upvote error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ---------------------------------------------
// POST /api/pulse/:postId/resolve
// Mark a help post as resolved (author only)
// ---------------------------------------------
exports.resolvePost = async (req, res) => {
  try {
    const post = await PulsePost.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorised' });
    }

    post.isResolved = !post.isResolved;
    await post.save();

    res.json({ isResolved: post.isResolved });
  } catch (err) {
    console.error('POST /pulse/:postId/resolve error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ---------------------------------------------
// POST /api/pulse/:postId/replies
// Add a reply
// ---------------------------------------------
exports.addReply = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const post = await PulsePost.findById(req.params.postId);
    if (!post || post.isHidden) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const reply = new PulseReply({
      post: req.params.postId,
      author: req.user.userId,
      content: content.trim(),
    });

    await reply.save();

    const populated = await PulseReply.findById(reply._id)
      .populate('author', 'name profileImage role college company');

    res.status(201).json(populated);
  } catch (err) {
    console.error('POST /pulse/:postId/replies error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ---------------------------------------------
// PUT /api/pulse/:postId/replies/:replyId
// Edit a reply
// ---------------------------------------------
exports.updateReply = async (req, res) => {
  try {
    const reply = await PulseReply.findById(req.params.replyId);
    if (!reply) return res.status(404).json({ message: 'Reply not found' });

    if (reply.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorised' });
    }

    reply.content = req.body.content?.trim() || reply.content;
    reply.isEdited = true;
    await reply.save();

    const populated = await PulseReply.findById(reply._id)
      .populate('author', 'name profileImage role college company');

    res.json(populated);
  } catch (err) {
    console.error('PUT reply error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ---------------------------------------------
// DELETE /api/pulse/:postId/replies/:replyId
// Delete a reply
// ---------------------------------------------
exports.deleteReply = async (req, res) => {
  try {
    const reply = await PulseReply.findById(req.params.replyId)
      .populate('post', 'author');

    if (!reply) return res.status(404).json({ message: 'Reply not found' });

    const isReplyAuthor = reply.author.toString() === req.user.userId;
    const isPostAuthor = reply.post?.author?.toString() === req.user.userId;

    if (!isReplyAuthor && !isPostAuthor) {
      return res.status(403).json({ message: 'Not authorised' });
    }

    await PulseReply.findByIdAndDelete(req.params.replyId);
    res.json({ message: 'Reply deleted' });
  } catch (err) {
    console.error('DELETE reply error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ---------------------------------------------
// POST /api/pulse/:postId/replies/:replyId/accept
// Mark a reply as the accepted answer
// ---------------------------------------------
exports.acceptReply = async (req, res) => {
  try {
    const post = await PulsePost.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorised' });
    }

    // Unmark any existing accepted answer on this post
    await PulseReply.updateMany(
      { post: req.params.postId },
      { isAcceptedAnswer: false }
    );

    const reply = await PulseReply.findByIdAndUpdate(
      req.params.replyId,
      { isAcceptedAnswer: true },
      { new: true }
    ).populate('author', 'name profileImage role college company');

    // Also mark the post as resolved
    post.isResolved = true;
    await post.save();

    res.json(reply);
  } catch (err) {
    console.error('POST accept reply error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};