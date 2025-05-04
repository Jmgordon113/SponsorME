const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const Sponsorship = require('../models/Sponsorship');

// GET /api/sponsorships/totals
router.get('/totals', requireAuth, async (req, res) => {
  try {
    const sponsorId = req.user._id;

    const totals = await Sponsorship.aggregate([
      { $match: { sponsorId } },
      {
        $group: {
          _id: null,
          totalSponsored: { $sum: '$amount' },
          opportunitiesSponsored: { $sum: 1 },
        },
      },
    ]);

    const result = totals[0] || { totalSponsored: 0, opportunitiesSponsored: 0 };
    res.json(result);
  } catch (err) {
    console.error('Error fetching sponsorship totals:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
