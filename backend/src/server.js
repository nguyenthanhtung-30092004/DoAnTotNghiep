const app = require("./app");
const env = require("./configs/env");
const connectDatabase = require("./configs/database");
const http = require("http");
const { initSocket } = require("./socket/socket");

const startServer = async () => {
  try {
    await connectDatabase();
    const server = http.createServer(app);
    initSocket(server, env.clientUrl);

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(
          `[ERROR] Port ${env.port} dang bi chiem. Hay kill process cu roi chay lai.`
        );
        console.error(
          `[HINT] Chay lenh: npx kill-port ${env.port}`
        );
        process.exit(1);
      } else {
        console.error("[ERROR] Server error:", err);
        process.exit(1);
      }
    });

    server.listen(env.port, () => {
      console.log(`Server running at http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error("Khong the start server:", error);
    process.exit(1);
  }
};

startServer();
