const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireAuth = require('../middleware/requireAuth');
const Opportunity = require('../models/Opportunity');
const Sponsorship = require('../models/Sponsorship');

// GET /api/sponsorships/totals
router.get('/totals', requireAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;

    if (role === 'sponsee') {
      // Find all opportunities created by this sponsee
      const opportunities = await Opportunity.find({ creator: mongoose.Types.ObjectId(userId) }, '_id');
      const opportunityIds = opportunities.map(o => o._id);

      if (opportunityIds.length === 0) {
        return res.json({ total: 0 });
      }

      // Aggregate total sponsorship amount for these opportunities
      const result = await Sponsorship.aggregate([
        { $match: { opportunity: { $in: opportunityIds } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);

      const total = result.length > 0 ? result[0].total : 0;
      return res.json({ total });
    } else if (role === 'sponsor') {
      // Aggregate total sponsorship amount by this sponsor
      const result = await Sponsorship.aggregate([
        { $match: { sponsor: mongoose.Types.ObjectId(userId) } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);

      const total = result.length > 0 ? result[0].total : 0;
      return res.json({ total });
    } else {
      return res.status(400).json({ error: 'Invalid role' });
    }
  } catch (err) {
    console.error('Error in /api/sponsorships/totals:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
