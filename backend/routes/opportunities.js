const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const Opportunity = require('../models/Opportunity');

// POST /api/opportunities
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, category, description, sponsorshipLevels } = req.body;
    const opportunity = new Opportunity({
      title,
      category,
      description,
      sponsorshipLevels,
      creator: req.user.id,
    });
    await opportunity.save();
    res.status(201).json(opportunity);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/opportunities
router.get('/', async (req, res) => {
  try {
    const opportunities = await Opportunity.find();
    res.json(opportunities);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/opportunities/:id
router.get('/:id', async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) return res.status(404).json({ error: 'Opportunity not found' });
    res.json(opportunity);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/opportunities/mine
router.get('/mine', requireAuth, async (req, res) => {
  try {
    const opportunities = await Opportunity.find({ creator: req.user.id });
    res.json(opportunities);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/opportunities/sponsorships/mine
router.get('/sponsorships/mine', requireAuth, async (req, res) => {
  try {
    const opportunities = await Opportunity.find({ sponsors: req.user.id });
    res.json(opportunities);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
