const mongoose = require("mongoose");
const { ErrorResponse } = require("../core/error.response");
const Schema = mongoose.Schema;

const couponSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    discountType: {
      type: String,
      enum: ["PERCENT", "FIXED"],
      required: true,
    },

    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    maxDiscount: {
      type: Number,
      default: 0,
      min: 0,
    },
    minOrderValue: {
      type: Number,
      default: 0,
      min: 0,
    },
    startAt: {
      type: Date,
      required: true,
    },
    endAt: {
      type: Date,
      required: true,
    },

    usageLimit: {
      type: Number,
      default: 0,
      min: 0,
    },
    usedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    usageLimitPerUser: {
      type: Number,
      default: 1,
      min: 1,
    },
    usedBy: {
      type: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          count: {
            type: Number,
            default: 1,
          },
        },
      ],
      default: [],
    },

    applyTo: {
      type: String,
      enum: ["ALL", "CATEGORIES", "BRANDS", "PRODUCTS", "USERS"],
      default: "ALL",
    },

    categories: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Category",
      default: [],
    },

    brands: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Brand",
      default: [],
    },

    products: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Product",
      default: [],
    },

    isActive: {
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

couponSchema.pre("validate", function () {
  if (this.code) {
    this.code = this.code.trim().toUpperCase();
  }
});

couponSchema.pre("save", function () {
  if (this.discountType === "PERCENT" && this.discountValue > 100) {
    throw new ErrorResponse("Mã giảm theo phần trăm không được vượt quá 100%");
  }
  if (this.startAt >= this.endAt) {
    throw new ErrorResponse(
      "Thời gian bắt đầu không được lớn hơn thời gian kết thúc",
    );
  }
});

module.exports = mongoose.model("Coupon", couponSchema);
