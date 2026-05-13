const mongoose = require("mongoose");
const slugify = require("slugify");

const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Tên danh mục không được để trống"],
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    description: {
      type: String,
      default: "",
    },

    thumbnail: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

categorySchema.pre("save", function () {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
      locale: "vi",
    });
  }
});

categorySchema.pre("findOneAndUpdate", function () {
  const update = this.getUpdate();

  if (update.name) {
    update.slug = slugify(update.name, {
      lower: true,
      strict: true,
      locale: "vi",
    });
  }
});

module.exports = mongoose.model("Category", categorySchema);
