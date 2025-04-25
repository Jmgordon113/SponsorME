const mongoose = require('mongoose');

const SponsorshipSchema = new mongoose.Schema(
  {
    sponsor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    opportunity: { type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity', required: true },
    level: { type: String }, // Optional: e.g., Gold, Silver
    amount: { type: Number }, // Optional: amount pledged
    message: { type: String }, // Optional: sponsor note to sponsee
  },
  { timestamps: true }
);

module.exports = mongoose.model('Sponsorship', SponsorshipSchema);
