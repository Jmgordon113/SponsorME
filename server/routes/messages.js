const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireAuth = require('../middleware/requireAuth');
const Message = require('../models/Message');
const User = require('../models/User');

// Static route for message previews
router.get('/preview', requireAuth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch all messages involving this user
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .sort({ timestamp: -1 })
      .limit(10)
      .populate('sender', 'name')
      .populate('receiver', 'name');

    const previews = messages.map((msg) => ({
      id: msg._id,
      senderName: msg.sender._id.toString() === userId.toString() ? msg.receiver.name : msg.sender.name,
      snippet: msg.text,
      timestamp: msg.timestamp,
    }));

    res.json(previews);
  } catch (err) {
    console.error('Error fetching message previews:', err);
    res.status(500).json({ error: 'Failed to load message previews' });
  }
});

// Dynamic route for fetching messages by senderId
router.get('/:senderId', requireAuth, async (req, res) => {
  try {
    const { senderId } = req.params;

    // Validate senderId
    if (!mongoose.Types.ObjectId.isValid(senderId)) {
      return res.status(400).json({ error: 'Invalid sender ID' });
    }

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: senderId },
        { sender: senderId, receiver: req.user._id },
      ],
    })
      .sort({ timestamp: 1 })
      .populate('sender', 'name')
      .populate('receiver', 'name')
      .populate('opportunityId', 'title');

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

    // Only allow sponsee to reply if a thread exists
    if (req.user.role === 'sponsee') {
      const existingThread = await Message.findOne({
        $or: [
          { sender: receiverId, receiver: req.user._id },
          { sender: req.user._id, receiver: receiverId },
        ],
      });

      if (!existingThread) {
        return res
          .status(403)
          .json({ error: 'You can only message a sponsor who has contacted you first.' });
      }
    }

    // Only sponsors can send the first message
    if (req.user.role !== 'sponsor') {
      const existingThread = await Message.findOne({
        $or: [
          { sender: receiverId, receiver: req.user._id },
          { sender: req.user._id, receiver: receiverId },
        ],
      });
      if (!existingThread) {
        return res.status(403).json({ error: 'Only sponsors can send the first message.' });
      }
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
    console.error('💥 Error sending message:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/messages/conversations
router.get('/conversations', requireAuth, async (req, res) => {
  try {
    const userId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: userId },
        { receiver: userId },
      ],
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
    console.error('❌ Error in /conversations:', err);
    res.status(500).json({ error: 'Failed to load conversations' });
  }
});

module.exports = router;
