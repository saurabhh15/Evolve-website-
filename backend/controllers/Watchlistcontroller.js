const Watchlist = require('../models/Watchlist');
const Project = require('../models/Project');

/**
 * @desc    Add project to investor's watchlist
 * @route   POST /api/watchlist/:projectId
 * @access  Private (investor only)
 */
exports.addToWatchlist = async (req, res, next) => {
  try {
    const investorId = req.user.userId;
    const { projectId } = req.params;
    const { notes } = req.body;

    // Confirm project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Prevent duplicate — if already saved, just return it
    const existing = await Watchlist.findOne({ investor: investorId, project: projectId });
    if (existing) {
      return res.status(400).json({ message: 'Project already in watchlist', watchlist: existing });
    }

    const watchlistEntry = new Watchlist({
      investor: investorId,
      project: projectId,
      notes: notes || '',
    });

    await watchlistEntry.save();

    // Populate project for the response
    await watchlistEntry.populate('project', 'title description category stage creator');

    res.status(201).json({
      message: 'Project added to watchlist',
      watchlist: watchlistEntry,
    });

  } catch (error) {
    // Mongo duplicate key error (race condition)
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Project already in watchlist' });
    }
    next(error);
  }
};

/**
 * @desc    Remove project from investor's watchlist
 * @route   DELETE /api/watchlist/:projectId
 * @access  Private (investor only)
 */
exports.removeFromWatchlist = async (req, res, next) => {
  try {
    const investorId = req.user.userId;
    const { projectId } = req.params;

    const entry = await Watchlist.findOneAndDelete({
      investor: investorId,
      project: projectId,
    });

    if (!entry) {
      return res.status(404).json({ message: 'Project not found in watchlist' });
    }

    res.json({ message: 'Project removed from watchlist', projectId });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get investor's full watchlist
 * @route   GET /api/watchlist
 * @access  Private (investor only)
 */
exports.getWatchlist = async (req, res, next) => {
  try {
    const investorId = req.user.userId;

    const watchlist = await Watchlist.find({ investor: investorId })
      .populate({
        path: 'project',
        select: 'title description category stage tags creator teamMembers likes views createdAt',
        populate: {
          path: 'creator',
          select: 'name profileImage college role',
        },
      })
      .sort({ createdAt: -1 })
      .lean();

    // Filter out any entries where the project was deleted
    const valid = watchlist.filter(entry => entry.project !== null);

    res.json(valid);

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Check if a specific project is in the investor's watchlist
 * @route   GET /api/watchlist/check/:projectId
 * @access  Private (investor only)
 */
exports.checkWatchlist = async (req, res, next) => {
  try {
    const investorId = req.user.userId;
    const { projectId } = req.params;

    const entry = await Watchlist.findOne({
      investor: investorId,
      project: projectId,
    }).lean();

    res.json({ saved: !!entry, entry: entry || null });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update private notes on a watchlist entry
 * @route   PATCH /api/watchlist/:projectId/notes
 * @access  Private (investor only)
 */
exports.updateNotes = async (req, res, next) => {
  try {
    const investorId = req.user.userId;
    const { projectId } = req.params;
    const { notes } = req.body;

    if (typeof notes !== 'string') {
      return res.status(400).json({ message: 'Notes must be a string' });
    }

    const entry = await Watchlist.findOneAndUpdate(
      { investor: investorId, project: projectId },
      { notes: notes.slice(0, 500) },
      { new: true }
    ).lean();

    if (!entry) {
      return res.status(404).json({ message: 'Project not found in watchlist' });
    }

    res.json({ message: 'Notes updated', entry });

  } catch (error) {
    next(error);
  }
};