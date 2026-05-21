require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUrl: process.env.MONGODB_URL,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtAccessExpire: process.env.JWT_ACCESS_EXPIRE,
  jwtRefreshExpire: process.env.JWT_REFRESH_EXPIRE,
};
