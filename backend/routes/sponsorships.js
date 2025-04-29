const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const Sponsorship = require('../models/Sponsorship');

// GET /api/sponsorships/totals
router.get('/totals', requireAuth, async (req, res) => {
  try {
    const total = await Sponsorship.aggregate([
      { $match: { sponsor: req.user.id } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    res.json({ total: total[0]?.total || 0 });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
