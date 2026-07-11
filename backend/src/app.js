const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const env = require('./config/env');
const routes = require("./routes");
const errorHandler = require('./middlewares/errorHandler');

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://runshopvn.store",
  "https://runshopvn.store",
  "http://www.runshopvn.store",
  "https://www.runshopvn.store",
  env.clientUrl,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  }),
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

routes(app);

app.use(errorHandler);

module.exports = app;