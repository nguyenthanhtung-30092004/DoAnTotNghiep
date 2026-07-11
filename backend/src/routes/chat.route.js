const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const { authAdmin, optionalAuth } = require('../middlewares/authUser');

// Khách hoặc User
router.get('/my-chat', optionalAuth, chatController.getMyChat);

// Admin routes
router.use('/admin', authAdmin);
router.get('/admin/conversations', chatController.getAdminConversations);
router.get('/admin/:id', chatController.getConversationMessages);

module.exports = router;
