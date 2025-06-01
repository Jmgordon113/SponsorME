const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const userRoutes = require('./routes/users');
const opportunityRoutes = require('./routes/opportunities');
const sponsorshipRoutes = require('./routes/sponsorships');
const messageRoutes = require('./routes/messages');
const requireAuth = require('./middleware/requireAuth');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/sponsorships', sponsorshipRoutes);
app.use('/api/messages', messageRoutes);

app.get('/', (req, res) => {
  res.send('SponsorMe API');
});

io.use((socket, next) => {
  requireAuth(socket.request, {}, next);
});

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.join(socket.request.user._id.toString());

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3000;

async function start() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/sponsorme');
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
start();