const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const Message = require('../models/Message');

// Static route for message previews
router.get('/preview', requireAuth, (req, res) => {
  return res.json([
    { id: 1, sender: 'SponsorOne', lastMessage: 'Can I sponsor this?' },
    { id: 2, sender: 'SponsorTwo', lastMessage: 'Please send me details.' },
  ]);
});

// GET /api/messages/conversations
router.get('/conversations', requireAuth, async (req, res) => {
  try {
    const userId = req.user._id;

    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate('sender', 'name')
      .populate('receiver', 'name')
      .sort({ timestamp: -1 });

    const conversations = {};
    messages.forEach((msg) => {
      const otherUser =
        msg.sender._id.toString() === userId.toString() ? msg.receiver : msg.sender;

      if (!conversations[otherUser._id]) {
        conversations[otherUser._id] = {
          user: otherUser,
          messages: [],
        };
      }

      conversations[otherUser._id].messages.push(msg);
    });

    res.json(Object.values(conversations));
  } catch (err) {
    console.error('Error fetching conversations:', err);
    res.status(500).json({ error: 'Failed to load conversations' });
  }
});

// GET /api/messages/conversations/:userId
router.get('/conversations/:userId', requireAuth, async (req, res) => {
  try {
    const userId = req.params.userId;

    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate('sender', 'name')
      .populate('receiver', 'name')
      .sort({ timestamp: 1 });

    const conversations = {};
    messages.forEach((msg) => {
      const otherUser =
        msg.sender._id.toString() === userId.toString() ? msg.receiver : msg.sender;

      if (!conversations[otherUser._id]) {
        conversations[otherUser._id] = {
          user: otherUser,
          messages: [],
        };
      }

      conversations[otherUser._id].messages.push(msg);
    });

    res.json(Object.values(conversations));
  } catch (err) {
    console.error('Error fetching conversations:', err);
    res.status(500).json({ error: 'Failed to load conversations' });
  }
});

// GET /api/messages/:senderId
router.get('/:senderId', requireAuth, async (req, res) => {
  try {
    const { senderId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: senderId },
        { sender: senderId, receiver: req.user._id },
      ],
    })
      .sort({ timestamp: 1 })
      .populate('sender', 'name')
      .populate('receiver', 'name');

    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Server error while retrieving messages' });
  }
});

// POST /api/messages
router.post('/', requireAuth, async (req, res) => {
  try {
    const { receiverId, text, opportunityId } = req.body;

    if (req.user.role !== 'sponsor') {
      return res.status(403).json({ error: 'Only sponsors can send the first message.' });
    }

    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      text,
      opportunityId,
      timestamp: new Date(),
    });

    const io = req.app.get('io');
    io.to(receiverId).emit('receive-message', message);

    res.status(201).json(message);
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
