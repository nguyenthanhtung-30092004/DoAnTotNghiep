const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const brandModel = new Schema(
  {
    nameBrand: {
      type: String,
      require: true,
    },
    slugBrand: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    logoBrand: {
      type: String,
      require: true,
    },
    outStanding: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model("Brand", brandModel);
