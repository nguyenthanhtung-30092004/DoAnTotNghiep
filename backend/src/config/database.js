const mongoose = require("mongoose");
const env = require('./env');

const connectDatabase = async () => {
  try {
    await mongoose.connect(env.mongoUrl);
    console.log("Ket noi thanh cong den MongoDB");
  } catch (error) {
    console.log("Loi ket noi MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectDatabase;
