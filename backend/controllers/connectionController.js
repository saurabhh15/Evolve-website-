const Connection = require('../models/Connection');
const { io } = require('../server');

/**
 * @desc    Send connection request
 * @route   POST /api/connections
 * @access  Private
 */
exports.sendConnectionRequest = async (req, res) => {
  try {
    const { to, type, projectId, message } = req.body;

    // Validation
    if (!to || !type) {
      return res.status(400).json({
        message: 'Recipient (to) and connection type are required'
      });
    }

    // Prevent self-connection
    if (to === req.user.userId) {
      return res.status(400).json({ message: 'Cannot connect with yourself' });
    }

    // Check if connection already exists
    const existingConnection = await Connection.findOne({
      from: req.user.userId,
      to,
      type,
      status: { $in: ['pending', 'accepted'] }
    });

    if (existingConnection) {
      return res.status(400).json({
        message: 'Connection request already sent',
        status: existingConnection.status
      });
    }

    // Delete any existing rejected connection before creating new one
    await Connection.deleteOne({
      from: req.user.userId,
      to,
      type,
      status: 'rejected'
    });

    // Create new connection
    const connection = new Connection({
      from: req.user.userId,
      to,
      type,
      projectId: projectId || null,
      message: message || ''
    });

    await connection.save();

    // Populate user details before sending response
    await connection.populate('from to', 'name role profileImage');

    io.to(to.toString()).emit('connection_request_received', {
      _id: connection._id,
      from: connection.from,
      type: connection.type,
      createdAt: connection.createdAt
    });

    if (projectId) {
      await connection.populate('projectId', 'title');
    }

    res.status(201).json(connection);

  } catch (error) {
    console.error('Send connection error:', error);
    res.status(500).json({
      message: 'Error sending connection request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get all connections for current user
 * @route   GET /api/connections?status=pending&type=mentor-request
 * @access  Private
 */
exports.getMyConnections = async (req, res, next) => {
  try {
    const { status, type } = req.query;

    // Base query - get connections where user is sender or receiver
    let query = {
      $or: [
        { from: req.user.userId },
        { to: req.user.userId }
      ]
    };

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    // Filter by type if provided
    if (type) {
      query.type = type;
    }

    const connections = await Connection.find(query)
      .populate('from', 'name role profileImage college')
      .populate('to', 'name role profileImage college')
      .populate('projectId', 'title category')
      .sort({ createdAt: -1 });

    res.json(connections);

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get received connection requests (pending)
 * @route   GET /api/connections/received
 * @access  Private
 */
exports.getReceivedRequests = async (req, res, next) => {
  try {
    const connections = await Connection.find({
      to: req.user.userId,
      status: 'pending'
    })
      .populate('from', 'name role profileImage college bio')
      .populate('projectId', 'title category')
      .sort({ createdAt: -1 });

    res.json(connections);

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get sent connection requests
 * @route   GET /api/connections/sent
 * @access  Private
 */
exports.getSentRequests = async (req, res, next) => {
  try {
    const connections = await Connection.find({
      from: req.user.userId
    })
      .populate('to', 'name role profileImage college')
      .populate('projectId', 'title category')
      .sort({ createdAt: -1 });

    res.json(connections);

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update connection status (accept/reject)
 * @route   PUT /api/connections/:id
 * @access  Private (Only receiver can update)
 */
exports.updateConnectionStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status
    if (!status || !['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        message: 'Status must be either "accepted" or "rejected"'
      });
    }

    const connection = await Connection.findById(req.params.id);

    if (!connection) {
      return res.status(404).json({ message: 'Connection request not found' });
    }

    // Only the receiver can accept/reject
    if (connection.to.toString() !== req.user.userId) {
      return res.status(403).json({
        message: 'Not authorized. Only the receiver can update this request.'
      });
    }

    // Check if already processed
    if (connection.status !== 'pending') {
      return res.status(400).json({
        message: `Request already ${connection.status}`
      });
    }

    connection.status = status;
    await connection.save();

    if (status === 'accepted') {
      io.to(connection.from.toString()).emit('notification_received', {
        type: 'connection_accepted',
        message: 'Your connection request was accepted',
        createdAt: new Date()
      });
    }

    // Populate before sending response
    await connection.populate('from to', 'name role profileImage');

    res.json(connection);

  } catch (error) {
    console.error('Update connection error:', error);
    res.status(500).json({ message: 'Error updating connection status' });
  }
};

/**
 * @desc    Delete/cancel connection
 * @route   DELETE /api/connections/:id
 * @access  Private (Only sender can delete)
 */
exports.deleteConnection = async (req, res, next) => {
  try {
    const connection = await Connection.findById(req.params.id);

    if (!connection) {
      return res.status(404).json({ message: 'Connection not found' });
    }

    // Only the sender can delete their request
    if (connection.from.toString() !== req.user.userId) {
      return res.status(403).json({
        message: 'Not authorized. Only the sender can delete this request.'
      });
    }

    await connection.deleteOne();

    res.json({ message: 'Connection request deleted successfully' });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get accepted connections (your network)
 * @route   GET /api/connections/network
 * @access  Private
 */
exports.getNetwork = async (req, res, next) => {
  try {
    const connections = await Connection.find({
      $or: [
        { from: req.user.userId },
        { to: req.user.userId }
      ],
      status: 'accepted'
    })
      .populate('from', 'name role profileImage college skills')
      .populate('to', 'name role profileImage college skills')
      .sort({ updatedAt: -1 });

    // Transform to get just the connected users (deduplicated)
    const seenIds = new Set();
    const network = [];

    connections.forEach(conn => {
      // Get the other person (not current user)
      const otherUser = conn.from._id.toString() === req.user.userId
        ? conn.to
        : conn.from;

      // Only add if we haven't seen this user before
      if (!seenIds.has(otherUser._id.toString())) {
        seenIds.add(otherUser._id.toString());
        network.push(otherUser);
      }
    });

    res.json(network);

  } catch (error) {
    next(error);
  }
};