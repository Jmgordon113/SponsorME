require('dotenv').config({ path: '../server/.env' }); // Explicitly specify the path to the .env file
const mongoose = require('mongoose');
const User = require('../server/models/User');

const listUsers = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in the .env file');
    }

    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 }); // Add timeout for connection
    console.log('Connected to MongoDB');

    const users = await User.find({}, { name: 1, email: 1, role: 1 });
    console.log('Registered Users:', users);

    mongoose.disconnect();
  } catch (err) {
    console.error('Error fetching users:', err);
  }
};

listUsers();
