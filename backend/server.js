require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const passport = require('./config/passport');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const Message = require('./models/Message');

// --- Environment Variable Checks ---
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error('Missing MONGO_URI or JWT_SECRET in .env');
  process.exit(1);
}

const app = express();
app.set('trust proxy', 1);
const server = http.createServer(app);

// --- CORS Configuration ---
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'https://evolve-website-wheat.vercel.app' 
  ],
  credentials: true
};

const io = new Server(server, {
  cors: corsOptions
});

// Expose io to req.app.get('io') for use in other routes
app.set('io', io);

// --- Security & Utility Middleware ---
app.use(helmet());
app.use(cors(corsOptions));
app.use(compression());
app.use(express.json({ limit: '10kb' }));
app.use(passport.initialize());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// --- Rate Limiting ---
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many login attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// --- Input Sanitization ---
const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return;
  for (const key of Object.keys(obj)) {
    if (/[$.]/.test(key)) {
      delete obj[key];
    } else {
      sanitizeObject(obj[key]);
    }
  }
};

app.use((req, res, next) => {
  try {
    if (req.body && typeof req.body === 'object') {
      sanitizeObject(req.body);
    }
    if (req.params && typeof req.params === 'object') {
      sanitizeObject(req.params);
    }
  } catch (err) {
    console.error("Sanitize Error:", err);
  }
  next();
});

// --- DB connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('DB Error:', err.message);
    process.exit(1);
  });

// --- Base & Health Check Routes ---
app.get('/', (req, res) => {
  res.json({ message: 'Evolve API running', version: '1.0.0' });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: process.uptime(),
  });
});

// Cold Start Fix endpoint for cron-job.org / UptimeRobot
app.get('/api/health', (req, res) => {
  res.status(200).send('Server is awake');
});

// --- Routes ---
app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/connections', require('./routes/connections'));
app.use('/api/projects/:id/comments', require('./routes/comments'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/learning-goals', require('./routes/learningGoals'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/applications', require('./routes/applications'));

// Catch-all 404 handler modified to pass to global error handler
app.use((req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  res.status(404);
  next(error);
});

// Global error handler
app.use(require('./middleware/errorHandler'));

// --- Socket.io Auth Middleware ---
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('No token'));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId;
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
});

// --- Socket.io Events ---
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.userId}`);

  // Join personal room
  socket.join(socket.userId);

  // Send message
  socket.on('send_message', async ({ recipientId, content }) => {
    try {
      const message = new Message({
        sender: socket.userId,
        recipient: recipientId,
        content: content.trim()
      });
      await message.save();
      await message.populate('sender recipient', 'name profileImage');

      // Emit to recipient
      io.to(recipientId).emit('message_received', message);

      // Emit back to sender (so other tabs/devices get it too)
      socket.emit('message_sent', message);

    } catch (err) {
      console.error('Socket send error:', err);
      socket.emit('message_error', { message: 'Failed to send message' });
    }
  });

  // Typing indicators
  socket.on('typing', ({ recipientId }) => {
    io.to(recipientId).emit('user_typing', { userId: socket.userId });
  });

  socket.on('stop_typing', ({ recipientId }) => {
    io.to(recipientId).emit('user_stop_typing', { userId: socket.userId });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.userId}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});