require('dotenv').config({ path: '../server/.env' });
const mongoose = require('mongoose');

const testConnection = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in the .env file');
    }

    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to MongoDB');
    mongoose.disconnect();
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
};

testConnection();
