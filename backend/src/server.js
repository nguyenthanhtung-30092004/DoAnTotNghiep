const app = require("./app");
const env = require("./configs/env");
const connectDatabase = require("./configs/database");
const http = require("http");
const { initSocket } = require("./socket/socket")

const startServer = async () => {
  try {
    await connectDatabase();
    const server = http.createServer(app);
    initSocket(server, env.clientUrl);
    server.listen(env.port, () => {
      console.log(`Server running at http://localhost:${env.port}`);
    });
  } catch (error) {
    console.log("Khong the start server:", error);
  }
};

startServer();
