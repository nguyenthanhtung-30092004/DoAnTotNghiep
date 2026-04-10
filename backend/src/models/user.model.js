"use strict";

const mongoose = require("mongoose");
const { Schema } = mongoose;
const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "users";

// Declare the Schema of the Mongo model
var userSchema = new Schema(
  {
    fullName: {
      type: String,
      trim: true,
      maxLength: 150,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
      default: "",
    },
    address: {
      type: String,
      trim: true,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true, // Mặc định tạo tài khoản là hoạt động
    },
    roles: {
      type: String,
      enum: ["CUSTOMER", "ADMIN"],
      default: "CUSTOMER",
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, userSchema);
