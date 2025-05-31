const express = require('express');
const router = express.Router();
const multer = require('multer');
const requireAuth = require('../middleware/requireAuth');
const Opportunity = require('../models/Opportunity');
const Sponsorship = require('../models/Sponsorship');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');

// Multer config for /uploads/
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});
const upload = multer({ storage });

// POST /api/opportunities (sponsee only)
router.post('/', requireAuth, upload.single('image'), async (req, res) => {
  try {
    if (req.user.role !== 'sponsee') return res.status(403).json({ error: 'Only sponsees can create opportunities.' });
    const { title, tagline, description, category, sponsorshipLevels } = req.body;
    let image = req.file ? `/uploads/${req.file.filename}` : req.body.image;
    const levels = typeof sponsorshipLevels === 'string' ? JSON.parse(sponsorshipLevels) : sponsorshipLevels;
    const opportunity = await Opportunity.create({
      title, tagline, description, category, image,
      sponsorshipLevels: levels,
      creator: req.user.userId
    });
    res.status(201).json(opportunity);
  } catch (err) {
    res.status(400).json({ error: 'Could not create opportunity.' });
  }
});

// GET /api/opportunities (public, optional ?sponseeId)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.sponseeId) filter.creator = req.query.sponseeId;
    const opportunities = await Opportunity.find(filter)
      .sort({ createdAt: -1 })
      .populate('creator', 'name');
    res.json(opportunities);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch opportunities.' });
  }
});

// GET /api/opportunities/:id (public, populate organizer)
router.get('/:id', async (req, res) => {
  try {
    const opp = await Opportunity.findById(req.params.id).populate('creator', 'name');
    if (!opp) return res.status(404).json({ error: 'Not found.' });
    const result = opp.toObject();
    result.organizer = opp.creator;
    delete result.creator;
    res.json(result);
  } catch (err) {
    res.status(404).json({ error: 'Not found.' });
  }
});

// PUT /api/opportunities/:id (creator only, supports image upload)
router.put('/:id', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const opp = await Opportunity.findById(req.params.id);
    if (!opp) return res.status(404).json({ error: 'Not found.' });
    if (String(opp.creator) !== req.user.userId) return res.status(403).json({ error: 'Forbidden.' });

    const updates = { ...req.body };
    if (req.file) updates.image = `/uploads/${req.file.filename}`;
    if (updates.sponsorshipLevels) {
      updates.sponsorshipLevels = typeof updates.sponsorshipLevels === 'string'
        ? JSON.parse(updates.sponsorshipLevels)
        : updates.sponsorshipLevels;
    }
    Object.assign(opp, updates);
    await opp.save();
    res.json(opp);
  } catch (err) {
    res.status(400).json({ error: 'Update failed.' });
  }
});

// DELETE /api/opportunities/:id (creator only)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const opp = await Opportunity.findById(req.params.id);
    if (!opp) return res.status(404).json({ error: 'Not found.' });
    if (String(opp.creator) !== req.user.userId) return res.status(403).json({ error: 'Forbidden.' });
    await opp.deleteOne();
    res.json({ message: 'Opportunity deleted.' });
  } catch (err) {
    res.status(400).json({ error: 'Delete failed.' });
  }
});

// GET /api/opportunities/mine (sponsee only)
router.get('/mine', requireAuth, async (req, res) => {
  try {
    if (req.user.role !== 'sponsee') return res.status(403).json({ error: 'Only sponsees.' });
    const opportunities = await Opportunity.find({ creator: req.user.userId }).sort({ createdAt: -1 });
    res.json(opportunities);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch.' });
  }
});

// GET /api/opportunities/sponsorships/mine (sponsor only)
router.get('/sponsorships/mine', requireAuth, async (req, res) => {
  try {
    if (req.user.role !== 'sponsor') return res.status(403).json({ error: 'Only sponsors.' });
    const sponsorships = await Sponsorship.find({ sponsor: req.user.userId }).populate('opportunity');
    const opportunities = sponsorships.map(s => s.opportunity);
    res.json(opportunities);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch.' });
  }
});

module.exports = router;
