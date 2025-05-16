const express = require('express');
const authRoutes = require('./routes/auth'); // Adjust path as needed
const messagesRoutes = require('./routes/messages'); // Import messages routes
const userRoutes = require('./routes/users');

const app = express();
app.use('/api/auth', authRoutes); // Ensure this line exists
app.use('/api/messages', messagesRoutes); // Register messages routes
app.use('/api/users', userRoutes);