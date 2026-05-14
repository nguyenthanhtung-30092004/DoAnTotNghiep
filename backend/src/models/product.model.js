// models/Product.js

const mongoose = require("mongoose");
const slugify = require("slugify");
const { nanoid } = require("nanoid");

const Schema = mongoose.Schema;

const imageSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const sizeSchema = new Schema(
  {
    size: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    sku: {
      type: String,
      required: true,
      trim: true,
      unique: true,
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

      validate: {
        validator: function (value) {
          return value <= this.price;
        },
        message: "Sale price phải nhỏ hơn hoặc bằng price",
      },
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    sold: {
      type: Number,
      default: 0,
      min: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: true,
    timestamps: true,
  },
);

const variantSchema = new Schema(
  {
    color: {
      type: String,
      required: true,
      trim: true,
    },

    colorCode: {
      type: String,
      default: "",
    },

    images: {
      type: [imageSchema],
      default: [],
    },

    sizes: {
      type: [sizeSchema],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: true,
    timestamps: true,
  },
);

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Tên sản phẩm không được để trống"],
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    description: {
      type: String,
      default: "",
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },

    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
      index: true,
    },

    thumbnail: {
      type: imageSchema,
      required: true,
    },

    variants: {
      type: [variantSchema],
      default: [],
    },

    totalStock: {
      type: Number,
      default: 0,
    },

    totalSold: {
      type: Number,
      default: 0,
    },

    minPrice: {
      type: Number,
      default: 0,
    },

    maxPrice: {
      type: Number,
      default: 0,
    },

    ratingAverage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    ratingCount: {
      type: Number,
      default: 0,
    },

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

productSchema.pre("validate", function () {
  if (!this.slug) {
    this.slug =
      slugify(this.name, {
        lower: true,
        strict: true,
        locale: "vi",
      }) +
      "-" +
      nanoid(6);
  }
});

productSchema.pre("save", function () {
  let totalStock = 0;
  let totalSold = 0;

  let prices = [];

  this.variants.forEach((variant) => {
    variant.sizes.forEach((size) => {
      totalStock += size.stock;
      totalSold += size.sold;

      const finalPrice = size.salePrice > 0 ? size.salePrice : size.price;

      prices.push(finalPrice);
    });
  });

  this.totalStock = totalStock;
  this.totalSold = totalSold;

  this.minPrice = prices.length ? Math.min(...prices) : 0;
  this.maxPrice = prices.length ? Math.max(...prices) : 0;
});

productSchema.index({
  name: "text",
  description: "text",
});

module.exports = mongoose.model("Product", productSchema);
