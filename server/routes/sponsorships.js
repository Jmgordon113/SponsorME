const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const Sponsorship = require('../models/Sponsorship');
const Opportunity = require('../models/Opportunity');

// POST /api/sponsorships
router.post('/', requireAuth, async (req, res) => {
  try {
    console.log('Raw request body:', req.body); // Debug log

    const { opportunityId, level, amount, message } = req.body;

    console.log('Parsed request body:', { opportunityId, level, amount, message }); // Debug log

    console.log('Request body:', req.body); // Debug log
    console.log('Authenticated user:', req.user); // Debug log

    // Check if the sponsor already sponsored this opportunity
    const exists = await Sponsorship.findOne({
      sponsor: req.user._id,
      opportunity: opportunityId,
    });

    if (exists) {
      console.log('Sponsorship already exists'); // Debug log
      return res.status(400).json({ error: 'Already sponsored this opportunity' });
    }

    // Validate opportunityId
    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      console.log('Opportunity not found'); // Debug log
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    // Create a new sponsorship
    const sponsorship = new Sponsorship({
      sponsor: req.user._id,
      opportunity: opportunityId,
      level,
      amount,
      message,
    });

    await sponsorship.save();

    console.log('Sponsorship created:', sponsorship); // Debug log
    res.status(201).json({ message: 'Sponsorship created', sponsorship });
  } catch (err) {
    console.error('Sponsor creation error:', err); // Log the full error
    res.status(500).json({ error: 'Server error while creating sponsorship' });
  }
});

// GET sponsorship totals for logged-in user
router.get('/totals', requireAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;

    if (role === 'sponsee') {
      // Sponsee: show total raised across their own opportunities
      const opportunities = await Opportunity.find({ creator: userId }).select('_id');
      const opportunityIds = opportunities.map((opp) => opp._id);

      const total = await Sponsorship.aggregate([
        { $match: { opportunity: { $in: opportunityIds } } },
        { $group: { _id: null, totalRaised: { $sum: '$amount' } } },
      ]);

      return res.json({ total: total[0]?.totalRaised || 0 });
    }

    if (role === 'sponsor') {
      // Sponsor: total amount they’ve pledged
      const total = await Sponsorship.aggregate([
        { $match: { sponsor: userId } },
        { $group: { _id: null, totalSponsored: { $sum: '$amount' } } },
      ]);

      return res.json({ total: total[0]?.totalSponsored || 0 });
    }

    res.status(400).json({ error: 'Invalid role' });
  } catch (err) {
    console.error('Error calculating totals:', err);
    res.status(500).json({ error: 'Failed to calculate sponsorship totals' });
  }
});

module.exports = router;
