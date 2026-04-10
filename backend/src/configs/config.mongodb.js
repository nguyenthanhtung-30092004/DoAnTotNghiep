"use strict";

const dev = {
  app: {
    port: process.env.PORT || 3055,
  },
  db: {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 27017,
    name: process.env.DB_NAME || "shopRunner",
  },
};

const pro = {
  app: {
    port: process.env.PORT || 3000,
  },
  db: {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 27017,
    name: process.env.DB_NAME || "shopRunner",
  },
};
const config = { dev, pro };
const env = process.env.NODE_ENV || "dev";
module.exports = config[env];
