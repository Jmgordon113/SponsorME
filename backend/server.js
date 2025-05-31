const express = require('express');
const authRoutes = require('./routes/auth');
const messagesRoutes = require('./routes/messages');
const userRoutes = require('./routes/users');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
app.set('io', io);

app.use('/api/auth', authRoutes);
app.use('/api/opportunities', require('./routes/opportunities'));
app.use('/api/messages', messagesRoutes);
app.use('/api/sponsorships', require('./routes/sponsorships'));
app.use('/api/users', userRoutes);
// Removed broken or unused admin route

const PORT = process.env.PORT || 3000;

async function start() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/sponsorme');
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

start();