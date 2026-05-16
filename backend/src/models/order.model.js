const mongoose = require("mongoose");
const { nanoid } = require("nanoid");
const Schema = mongoose.Schema;

const orderItemSchema = new Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    sizeId: {
      type: mongoose.Schema.Types.ObjectId,
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

    productThumbnail: {
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
      min: 0,
    },

    salePrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    itemTotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  },
);

// Shipping address snapshot

const shippingAddressSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    province: {
      type: String,
      required: true,
      trim: true,
    },

    district: {
      type: String,
      required: true,
      trim: true,
    },

    ward: {
      type: String,
      required: true,
      trim: true,
    },

    detailAddress: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  },
);

// Odder Schema
const orderSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    orderCode: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
      default: [],
    },

    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "VNPAY"],
      required: true,
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
      default: "PENDING",
    },
    orderStatus: {
      type: String,
      enum: [
        "PENDING",
        "CONFIRMED",
        "PROCESSING",
        "SHIPPING",
        "DELIVERED",
        "CANCELLED",
        "RETURNDED",
      ],
      default: "PENDING",
      index: true,
    },

    cancelledBy: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: null,
    },

    deliveredAt: {
      type: Date,
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    totalPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalDiscount: {
      type: Number,
      default: 0,
      min: 0,
    },

    shippingFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    couponDiscount: {
      type: Number,
      default: 0,
      min: 0,
    },

    coupon: {
      code: {
        type: String,
        default: "",
      },

      couponId: {
        type: Schema.Types.ObjectId,
        ref: "Coupon",
        default: null,
      },

      discountType: {
        type: String,
        enum: ["PERCENT", "FIXED", ""],
        default: "",
      },

      discountValue: {
        type: Number,
        default: 0,
      },
    },

    finalPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    note: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

// generate order code
orderSchema.pre("validate", function () {
  if (!this.orderCode) {
    this.orderCode = `ORD-${Date.now()}-${nanoid(6).toUpperCase()}`;
  }
});

module.exports = mongoose.model("Order", orderSchema);
