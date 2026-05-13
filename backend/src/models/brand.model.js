const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const brandSchema = new Schema(
  {
    nameBrand: {
      type: String,
      require: true,
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

brandSchema.pre("validate", function (next) {
  if (this.isModified("nameBrand")) {
    this.slugBrand = slugify(this.nameBrand, {
      lower: true,
      strict: true,
      locale: "vi",
    });
  }
});
module.exports = mongoose.model("Brand", brandSchema);
