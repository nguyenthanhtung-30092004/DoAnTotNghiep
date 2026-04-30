const express = require("express");
const app = express();
const port = 3000;

const bodyParser = require("body-parser");

// Connect DB
const connectDB = require("./configs/connectDB");
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const routes = require("./routes/index.routes");
routes(app);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: err.message || "Lỗi server",
  });
});

// Run Server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.log("Không thể start server:", error);
  }
};

startServer();
