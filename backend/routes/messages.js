const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireAuth = require('../middleware/requireAuth');
const Message = require('../models/Message');
const User = require('../models/User');

// Static route for message previews
router.get('/preview', requireAuth, (req, res) => {
  return res.json([
    { id: 1, sender: 'SponsorOne', lastMessage: 'Can I sponsor this?' },
    { id: 2, sender: 'SponsorTwo', lastMessage: 'Please send me details.' },
  ]);
});

// POST /api/messages
router.post('/', requireAuth, async (req, res) => {
  try {
    const { receiverId, text, opportunityId } = req.body;
    const senderId = req.user._id;
    const senderRole = req.user.role;

    if (!receiverId || !text) {
      return res.status(400).json({ error: 'receiverId and text are required' });
    }

    // Only sponsors can initiate conversations
    if (senderRole === 'sponsee') {
      // Check if a message already exists between sponsor and sponsee
      const existing = await Message.findOne({
        $or: [
          { sender: receiverId, recipient: senderId },
          { sender: senderId, recipient: receiverId }
        ]
      });
      if (!existing) {
        return res.status(403).json({ error: 'Sponsees can only reply to existing conversations' });
      }
    }

    // Save the message
    const message = new Message({
      sender: senderId,
      recipient: receiverId,
      content: text,
      opportunityId: opportunityId ? mongoose.Types.ObjectId(opportunityId) : undefined,
      read: false
    });
    await message.save();

    // Populate sender and recipient for response
    await message.populate('sender', 'name');
    await message.populate('recipient', 'name');

    // Emit real-time event to recipient
    const io = req.app.get('io');
    if (io) {
      io.to(receiverId.toString()).emit('receive-message', message);
    }

    res.json(message);
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/messages/conversations
router.get('/conversations', requireAuth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all messages involving this user
    const messages = await Message.find({
      $or: [{ sender: userId }, { recipient: userId }]
    })
      .populate('sender', 'name')
      .populate('recipient', 'name')
      .populate('opportunityId', 'title')
      .sort({ createdAt: 1 });

    // Group messages by the other user
    const threads = {};
    messages.forEach(msg => {
      const otherUser = msg.sender._id.equals(userId) ? msg.recipient : msg.sender;
      const key = otherUser._id.toString();
      if (!threads[key]) {
        threads[key] = {
          user: { _id: otherUser._id, name: otherUser.name },
          messages: []
        };
      }
      threads[key].messages.push(msg);
    });

    res.json(Object.values(threads));
  } catch (err) {
    console.error('Error fetching conversations:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/messages/conversations/:userId
router.get('/conversations/:userId', requireAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const otherUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: otherUserId },
        { sender: otherUserId, recipient: userId }
      ]
    })
      .populate('sender', 'name')
      .populate('recipient', 'name')
      .populate('opportunityId', 'title')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error('Error fetching conversation:', err);
    res.status(500).json({ error: 'Server error' });
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

module.exports = router;
