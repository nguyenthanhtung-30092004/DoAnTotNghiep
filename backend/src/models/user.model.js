const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userModel = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);
module.exports = mongoose.model("User", userModel);
