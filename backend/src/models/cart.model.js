// models/Cart.js

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cartItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    variantId: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    sizeId: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    productName: {
      type: String,
      required: true,
    },

    productSlug: {
      type: String,
      required: true,
    },

    thumbnail: {
      type: String,
      default: "",
    },

    color: {
      type: String,
      required: true,
    },

    size: {
      type: String,
      required: true,
    },

    sku: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    salePrice: {
      type: Number,
      default: 0,
    },

    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },

    maxQuantity: {
      type: Number,
      default: 999,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: true,
    timestamps: true,
  },
);

const cartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    items: {
      type: [cartItemSchema],
      default: [],
    },

    totalQuantity: {
      type: Number,
      default: 0,
    },

    totalPrice: {
      type: Number,
      default: 0,
    },

    totalDiscount: {
      type: Number,
      default: 0,
    },

    finalPrice: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

cartSchema.pre("save", function (next) {
  let totalQuantity = 0;
  let totalPrice = 0;
  let totalDiscount = 0;

  this.items.forEach((item) => {
    const originalPrice = item.price * item.quantity;

    const finalItemPrice =
      (item.salePrice > 0 ? item.salePrice : item.price) * item.quantity;

    totalQuantity += item.quantity;
    totalPrice += originalPrice;
    totalDiscount += originalPrice - finalItemPrice;
  });

  this.totalQuantity = totalQuantity;
  this.totalPrice = totalPrice;
  this.totalDiscount = totalDiscount;
  this.finalPrice = totalPrice - totalDiscount;

  next();
});

module.exports = mongoose.model("Cart", cartSchema);
