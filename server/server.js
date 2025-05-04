require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
const authRoutes = require('./routes/auth');
const messagesRoutes = require('./routes/messages');
const opportunityRoutes = require('./routes/opportunities');
const sponsorshipRoutes = require('./routes/sponsorships');

app.use('/api/auth', authRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/sponsorships', sponsorshipRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('SponsorMe API is running');
});

// Socket.IO setup
io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room ${userId}`);
  });

  socket.on('send-message', ({ receiverId, message }) => {
    io.to(receiverId).emit('receive-message', message);
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

app.set('io', io); // Make io accessible in routes

// Start server
server.listen(PORT, () => {
  console.log(`✅ Server running with Socket.IO on port ${PORT}`);
});
