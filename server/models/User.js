const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['sponsor', 'sponsee'], required: true },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
