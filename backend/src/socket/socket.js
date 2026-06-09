let io;
const chatService = require('../modules/chat/chat.service');

const initSocket = (server) => {
  const { Server } = require("socket.io");

  const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://runshopvn.store",
    "https://runshopvn.store",
    process.env.CLIENT_URL,
  ].filter(Boolean);

  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("join-user-room", (userId) => {
      if (!userId) return;

      socket.join(`user:${userId}`);
      console.log(`User joined room user:${userId}`);
    });

    socket.on("join-admin-room", () => {
      socket.join("admin:order");
      socket.join("admin:review");

      console.log("Admin joined rooms: admin:order, admin:review");
    });

    socket.on("join-product-room", (productId) => {
      if (!productId) return;

      socket.join(`product:${productId}`);
      console.log(`Socket joined room product:${productId}`);
    });

    socket.on("leave-product-room", (productId) => {
      if (!productId) return;

      socket.leave(`product:${productId}`);
      console.log(`Socket left room product:${productId}`);
    });

    // --- CHAT AI SYSTEM ---
    socket.on("join-chat", (data) => {
      const { userId, sessionId, role } = data;
      if (role === 'admin') {
        socket.join('admin:chat');
        console.log('Admin joined admin:chat room');
      } else {
        const room = userId ? `chat:user:${userId}` : `chat:session:${sessionId}`;
        socket.join(room);
        console.log(`User/Guest joined ${room}`);
      }
    });

    socket.on("send-message", async (data) => {
      const { conversationId, text, sender, userId, sessionId } = data;
      try {
        const savedMsg = await chatService.saveMessage(conversationId, sender, text);
        const room = userId ? `chat:user:${userId}` : `chat:session:${sessionId}`;

        io.to(room).emit("receive-message", savedMsg);
        io.to("admin:chat").emit("receive-message", savedMsg);

        // Auto reply with AI if sender is user
        if (sender === 'user') {
          // Kiểm tra xem admin đã từng trả lời trong cuộc hội thoại này chưa
          const messages = await chatService.getMessages(conversationId);
          const hasAdminReplied = messages.some(msg => msg.sender === 'admin');

          if (!hasAdminReplied) {
            const aiResponseText = await chatService.getGeminiResponse(conversationId, text);
            const aiMsg = await chatService.saveMessage(conversationId, 'ai', aiResponseText);
            io.to(room).emit("receive-message", aiMsg);
            io.to("admin:chat").emit("receive-message", aiMsg);
          }
        }
      } catch (err) {
        console.error("Socket send-message error:", err);
      }
    });
    // --- END CHAT AI ---

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id); 
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io chưa được khởi tạo");
  }

  return io;
};

module.exports = {
  initSocket,
  getIO,
};