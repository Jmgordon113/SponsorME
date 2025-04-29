const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const Message = require('../models/Message');

// GET /api/messages
router.get('/', requireAuth, async (req, res) => {
  try {
    const messages = await Message.find({ recipient: req.user.id });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/messages/preview
router.get('/preview', requireAuth, async (req, res) => {
  try {
    const messages = await Message.find({ recipient: req.user.id }).limit(5);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
