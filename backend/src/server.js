const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors"); // ✅ THIẾU
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Connect DB
const connectDB = require("./configs/connectDB");

// Middleware (⚠️ CORS phải đặt trên cùng)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
const routes = require("./routes/index.routes");
routes(app);

// Error handler
app.use((err, req, res, next) => {
  console.error("ERROR ====>");
  console.error(err);
  console.error(err.stack);

  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
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
