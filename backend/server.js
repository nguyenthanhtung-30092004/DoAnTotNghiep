const app = require("./src/app");

const PORT = 3055 || process.env.PORT;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

process.on("SIGINT", () => {
  server.close(() => console.log("Exit Server Express"));
});
