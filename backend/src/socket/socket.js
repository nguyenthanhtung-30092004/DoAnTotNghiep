let io;

const initSocket = (server) => {
  const { Server } = require("socket.io");

  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
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