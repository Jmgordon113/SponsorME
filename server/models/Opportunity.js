const mongoose = require('mongoose');

const OpportunitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  tagline: { type: String },
  description: { type: String, required: true },
  sponsorshipLevels: [{
    level: { type: String, required: true },
    amount: { type: Number, required: true },
    benefits: { type: String, required: true },
    sponsorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Track sponsor
  }],
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Opportunity', OpportunitySchema);
