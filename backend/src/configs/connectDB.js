const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Kết nối thành công đến MongoDB");
  } catch (error) {
    console.log("Lỗi kết nối MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
