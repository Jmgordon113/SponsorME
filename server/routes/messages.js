const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const requireAuth = require('../middleware/requireAuth');

// ✅ Send a new message
router.post('/', requireAuth, async (req, res) => {
  try {
    const { recipientId, recipientEmail, content } = req.body;

    // Find the recipient by userId or email
    let recipient;
    if (recipientId) {
      recipient = await User.findById(recipientId);
    } else if (recipientEmail) {
      recipient = await User.findOne({ email: recipientEmail });
    }

    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    const message = new Message({
      sender: req.user._id,
      recipient: recipient._id,
      content,
    });

    await message.save();
    res.status(201).json({ message: 'Message sent successfully', data: message });
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ error: 'Server error while sending message' });
  }
});

// ✅ Get conversation with another user
router.get('/:userId', requireAuth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, recipient: req.params.userId },
        { sender: req.params.userId, recipient: req.user._id },
      ],
    })
      .sort({ createdAt: 1 })
      .populate('sender', 'name')
      .populate('recipient', 'name');

    res.json(messages);
  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({ error: 'Server error while retrieving messages' });
  }
});

// GET /api/messages/preview → list of people this user has messaged
router.get('/preview', requireAuth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch all messages involving this user
    const messages = await Message.find({
      $or: [{ sender: userId }, { recipient: userId }],
    });

    // Extract unique user IDs the user has communicated with
    const partnerIds = new Set();
    messages.forEach((msg) => {
      if (msg.sender.toString() !== userId.toString()) {
        partnerIds.add(msg.sender.toString());
      }
      if (msg.recipient.toString() !== userId.toString()) {
        partnerIds.add(msg.recipient.toString());
      }
    });

    const partners = await User.find({ _id: { $in: Array.from(partnerIds) } }).select('name _id');
    res.json(partners);
  } catch (err) {
    console.error('Preview message error:', err);
    res.status(500).json({ error: 'Failed to load message previews' });
  }
});

module.exports = router;
