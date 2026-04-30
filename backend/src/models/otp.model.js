const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const otpModel = new Schema(
  {
    otp: { type: String, required: true },
    email: { type: String, required: true },
    createdAt: { type: Date, default: Date.now1`` },
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
