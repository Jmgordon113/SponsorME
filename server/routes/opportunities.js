const express = require('express');
const router = express.Router();
const Opportunity = require('../models/Opportunity');
const requireAuth = require('../middleware/requireAuth');


// 🔹 GET / → List all opportunities (public feed)
router.get('/', async (req, res) => {
  try {
    const opportunities = await Opportunity.find().sort({ createdAt: -1 });
    res.status(200).json(opportunities);
  } catch (err) {
    console.error('❌ Error fetching opportunities:', err);
    res.status(500).json({ error: 'Server error while fetching opportunities' });
  }
});


// 🔹 POST / → Create a new opportunity (sponsee only)
router.post('/', requireAuth, async (req, res) => {
  try {
    if (req.user.role !== 'sponsee') {
      return res.status(403).json({ error: 'Only sponsees can create opportunities' });
    }

    const { title, category, tagline, description, sponsorshipLevels } = req.body;

    const opportunity = await Opportunity.create({
      title,
      category,
      tagline,
      description,
      sponsorshipLevels,
      sponseeId: req.user._id
    });

    res.status(201).json({ message: 'Opportunity created', opportunity });
  } catch (err) {
    console.error('❌ Error creating opportunity:', err);
    res.status(500).json({ error: 'Server error while creating opportunity' });
  }
});


// 🔹 GET /sponsorships/mine → List opportunities sponsored by the logged-in sponsor
router.get('/sponsorships/mine', requireAuth, async (req, res) => {
  try {
    if (req.user.role !== 'sponsor') {
      return res.status(403).json({ error: 'Only sponsors can view their sponsored opportunities' });
    }
    // Find opportunities where any sponsorshipLevel is claimed by this sponsor
    const sponsored = await Opportunity.find({ 'sponsorshipLevels.sponsorId': req.user._id });
    res.status(200).json(sponsored);
  } catch (err) {
    console.error('❌ Error fetching sponsored opportunities:', err);
    res.status(500).json({ error: 'Server error while fetching sponsored opportunities' });
  }
});


// 🔹 GET /:id → Fetch a single opportunity by its ID
router.get('/:id', async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id).populate('creator', 'name');
    if (!opportunity) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }
    res.status(200).json({
      ...opportunity._doc,
      organizer: opportunity.creator.name
    });
  } catch (err) {
    console.error('❌ Error fetching opportunity by ID:', err);
    res.status(500).json({ error: 'Server error while fetching opportunity by ID' });
  }
});


module.exports = router;
