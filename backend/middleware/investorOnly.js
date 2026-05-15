const User = require('../models/User');

/**
 * Middleware: blocks non-investor roles from investor-only routes.
 * Must run after the auth middleware (req.user is already set).
 */
module.exports = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select('role').lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'investor') {
      return res.status(403).json({ message: 'Access restricted to investors' });
    }

    next();
  } catch (error) {
    next(error);
  }
};