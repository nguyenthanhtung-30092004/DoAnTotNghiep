const chatService = require('../services/chat.service');

const getMyChat = async (req, res) => {
  try {
    const userId = req.user ? req.user.id || req.user._id : null;
    // Lấy sessionId từ header hoặc query
    const sessionId = req.headers['x-session-id'] || req.query.sessionId;
    
    if (!userId && !sessionId) {
      return res.status(400).json({ success: false, message: "Missing identifier (userId or sessionId)" });
    }

    const conversation = await chatService.getOrCreateConversation(userId, sessionId);
    const messages = await chatService.getMessages(conversation._id);
    
    res.status(200).json({ success: true, metadata: { conversation, messages } });
  } catch (error) {
    console.error("getMyChat Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getAdminConversations = async (req, res) => {
  try {
    const conversations = await chatService.getAllActiveConversations();
    res.status(200).json({ success: true, metadata: conversations });
  } catch (error) {
    console.error("getAdminConversations Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getConversationMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const messages = await chatService.getMessages(id);
    res.status(200).json({ success: true, metadata: messages });
  } catch (error) {
    console.error("getConversationMessages Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  getMyChat,
  getAdminConversations,
  getConversationMessages
};
