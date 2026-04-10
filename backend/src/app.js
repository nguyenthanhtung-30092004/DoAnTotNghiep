require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const app = express();

// init midlleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// init db
require("./dbs/init.mongodb");

// init routes
app.get("/", (req, res, next) => {
  const strCompress = "Hello World!";
  return res.status(200).json({
    success: true,
    message: "Hello World!",
    metadata: strCompress.repeat(1000), // Tạo một chuỗi dài để kiểm tra tính năng nén
  });
});

// handling error

module.exports = app;
