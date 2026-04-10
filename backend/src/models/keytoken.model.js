"use strict";

const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const DOCUMENT_NAME = "KeyToken";
const COLLECTION_NAME = "keytokens";
// Declare the Schema of the Mongo model
var keytokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    publicKey: {
      type: String,
      required: true,
    },
    refreshToken: {
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
module.exports = model(DOCUMENT_NAME, keytokenSchema);
