const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slugify = require("slugify");

const brandSchema = new Schema(
  {
    nameBrand: {
      type: String,
      required: true,
      trim: true,
    },

    slugBrand: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    logoBrand: {
      type: String,
      required: true,
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

brandSchema.pre("validate", function () {
  if (this.isModified("nameBrand")) {
    this.slugBrand = slugify(this.nameBrand, {
      lower: true,
      strict: true,
      locale: "vi",
    });
  }
});

module.exports = mongoose.model("Brand", brandSchema);
