const mongoose = require('mongoose');

const sponsorshipSchema = new mongoose.Schema({
  sponsor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  opportunity: { type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity', required: true },
  level: { type: String },
  amount: { type: Number },
  message: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Sponsorship', sponsorshipSchema);
