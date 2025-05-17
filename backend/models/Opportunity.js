const mongoose = require('mongoose');

const OpportunitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  tagline: { type: String }, // Add tagline
  description: { type: String, required: true },
  category: { type: String, required: true },
  sponsorshipLevels: [
    {
      level: { type: String, required: true },
      amount: { type: Number, required: true },
      benefits: { type: String, required: true },
      sponsorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // Claimed by
    },
  ],
  image: { type: String, required: false },
  sponseeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Opportunity', OpportunitySchema);
