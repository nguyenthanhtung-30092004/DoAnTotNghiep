"use strict";

const { model, Schema, Types } = require("mongoose"); // Erase if already required
const DOCUEMNT_NAME = "User";
const COLLECTION_NAME = "users";

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
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
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    verify: {
      type: Schema.Types.Boolean,
      default: false,
    },
    roles: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

//Export the model
module.exports = mongoose.model(DOCUEMNT_NAME, userSchema);
