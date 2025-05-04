const express = require('express');
const router = express.Router();
const { getConversations } = require('../controllers/messageController');
const requireAuth = require('../middleware/requireAuth');

router.get('/conversations', requireAuth, getConversations);

module.exports = router;
