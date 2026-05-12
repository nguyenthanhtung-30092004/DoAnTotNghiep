const mongoose = require("mongoose");
const slugify = require("slugify");
const { nanoid } = require("nanoid");

const Schema = mongoose.Schema;

const imageSchema = new Schema(
  {
    url: String,
    publicId: String,
  },
  { _id: false },
);

const sizeSchema = new Schema(
  {
    size: {
      type: String,
      required: true,
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      sparse: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    salePrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: true },
);

const variantSchema = new Schema(
  {
    color: {
      type: String,
      required: true,
      trim: true,
    },
    colorCode: { type: String },
    images: [imageSchema],
    sizes: [sizeSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { _id: true },
);

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
    },
    description: {
      type: String,
      default: "",
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    thumbnail: imageSchema,
    variants: [variantSchema],
    isPublished: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

productSchema.pre("save", function () {
  if (this.isModified("name")) {
    this.slug =
      slugify(this.name, {
        lower: true,
        strict: true,
      }) +
      "-" +
      nanoid(6);
  }
});

productSchema.index({ name: "text" });

module.exports = mongoose.model("Product", productSchema);
