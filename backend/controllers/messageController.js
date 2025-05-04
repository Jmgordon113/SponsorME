const Message = require('../models/Message');

const getConversations = async (req, res) => {
  const { sponsorId, sponseeId } = req.query;

  if (!sponsorId && !sponseeId) {
    return res.status(400).json({ error: 'SponsorId or SponseeId is required' });
  }

  try {
    const conversations = await Message.find({
      $or: [
        { sender: sponsorId },
        { receiver: sponsorId },
        { sender: sponseeId },
        { receiver: sponseeId },
      ],
    })
      .populate('sender', 'name')
      .populate('receiver', 'name')
      .populate('opportunityId', 'title')
      .sort({ timestamp: -1 });

    res.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getConversations };
