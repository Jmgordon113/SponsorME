const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const validateRole = require('../middleware/validateRole');
const Opportunity = require('../models/Opportunity');
const Sponsorship = require('../models/Sponsorship'); // Add missing import
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Configure multer for local uploads

// POST /api/opportunities
router.post('/', requireAuth, validateRole('sponsee'), async (req, res) => {
  try {
    const { title, description, category, sponsorshipLevels, image } = req.body;

    const opportunity = new Opportunity({
      title,
      description,
      category,
      sponsorshipLevels,
      image,
      sponseeId: req.user._id,
    });

    await opportunity.save();
    res.status(201).json(opportunity);
  } catch (err) {
    console.error('Error creating opportunity:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/opportunities
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.sponseeId) {
      filter.sponseeId = req.query.sponseeId; // Filter by sponseeId if provided
    }

    const opportunities = await Opportunity.find(filter)
      .sort({ createdAt: -1 }) // Sort by newest first
      .populate('sponseeId', 'name'); // Include sponsee name
    res.json(opportunities);
  } catch (err) {
    console.error('Error fetching opportunities:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/opportunities/:id
router.get('/:id', async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id)
      .populate('sponseeId', 'name'); // Only populate name
    if (!opportunity) return res.status(404).json({ error: 'Opportunity not found' });
    // Add organizer field for frontend compatibility
    const oppObj = opportunity.toObject();
    oppObj.organizer = opportunity.sponseeId?.name || '';
    res.json(oppObj);
  } catch (err) {
    console.error('Error fetching opportunity:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/opportunities/:id
router.put('/:id', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, sponsorshipLevels, category, tagline } = req.body;
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) return res.status(404).json({ error: 'Opportunity not found' });
    if (opportunity.sponseeId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    opportunity.title = title || opportunity.title;
    opportunity.description = description || opportunity.description;
    opportunity.category = category || opportunity.category;
    opportunity.tagline = tagline || opportunity.tagline;
    opportunity.sponsorshipLevels = sponsorshipLevels || opportunity.sponsorshipLevels;
    if (req.file) {
      opportunity.image = `/uploads/${req.file.filename}`;
    }

    await opportunity.save();
    res.json({ message: 'Opportunity updated', opportunity });
  } catch (err) {
    console.error('Error updating opportunity:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/opportunities/:id
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) return res.status(404).json({ error: 'Opportunity not found' });
    if (opportunity.sponseeId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await opportunity.remove();
    res.json({ message: 'Opportunity deleted successfully' });
  } catch (err) {
    console.error('Error deleting opportunity:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/opportunities/mine
router.get('/mine', requireAuth, async (req, res) => {
  if (req.user.role !== 'sponsee') {
    return res.status(403).json({ error: 'Only sponsees can view their opportunities.' });
  }
  try {
    const opportunities = await Opportunity.find({ sponseeId: req.user._id }).sort({ createdAt: -1 });
    res.json(opportunities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching your opportunities.' });
  }
});

router.get('/sponsorships/mine', requireAuth, async (req, res) => {
  if (req.user.role !== 'sponsor') {
    return res.status(403).json({ error: 'Only sponsors can access this route.' });
  }
  try {
    const sponsorships = await Sponsorship.find({ sponsor: req.user._id }).populate('opportunity');
    const sponsoredOpportunities = sponsorships.map(s => s.opportunity);
    res.json(sponsoredOpportunities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching sponsored opportunities.' });
  }
});

module.exports = router;
