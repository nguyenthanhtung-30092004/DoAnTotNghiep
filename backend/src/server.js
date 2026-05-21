const app = require("./app");
const env = require("./configs/env");
const connectDatabase = require("./configs/database");

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(env.port, () => {
      console.log(`Server running at http://localhost:${env.port}`);
    });
  } catch (error) {
    console.log("Khong the start server:", error);
  }
};

startServer();
