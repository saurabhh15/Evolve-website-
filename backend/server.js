require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('./config/passport');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);

// ── CORS Configuration ──
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

// ── Middleware ──
app.use(cors(corsOptions));
app.use(express.json());
app.use(passport.initialize());

// ── DB connection ──
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// ── Routes ──
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

// ── Socket.io Auth Middleware ──
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

// ── Socket.io Events ──
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