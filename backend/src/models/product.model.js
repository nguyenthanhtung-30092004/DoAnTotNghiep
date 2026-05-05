const mongoose = require("mongoose");
const Schema = mongoose.Schema();

const productModel = new Schema(
  {
    imagesProduct: { type: Array, require: true },
    nameProduct: { type: String, require: true },
    slugProduct: { type: String, require: true },
    priceProduct: { type: Number, require: true },
    discountProduct: { type: Number, default: 0 },
    stockProduct: { type: Number, default: 0 },
    descriptionProduct: { type: String, require: true },
    categoryProduct: { type: Array },
    brandProduct: { type: mongoose.Schema.Types.ObjectId, ref: "brand" },
  },
  {},
);
