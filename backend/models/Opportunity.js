const mongoose = require('mongoose');

const OpportunitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  sponsorshipLevels: [
    {
      level: { type: String, required: true },
      amount: { type: Number, required: true },
      benefits: { type: String, required: true },
    },
  ],
  image: { type: String, required: false }, // Optional field for image
  sponseeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Opportunity', OpportunitySchema);
