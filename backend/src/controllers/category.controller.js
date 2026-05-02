const cloudinary = require("../configs/cloudDinary");
const fs = require("fs/promises");
const categoryModel = require("../models/category.model");

const { Created } = require("../core/success.response");
const {
  BadRequestError,
  ConflictRequestError,
} = require("../core/error.response");

const mongoose = require("mongoose");

class CategoryController {
  async createCategory(req, res) {
    let uploadedImage = null;

    try {
      if (!req.file) {
        throw new BadRequestError("Vui lòng upload ảnh");
      }

      let { name, slug, parentId, description } = req.body;

      if (!name || !slug) {
        throw new BadRequestError("Thiếu name hoặc slug");
      }

      const existing = await categoryModel.findOne({ slug });
      if (existing) {
        throw new ConflictRequestError("Slug đã tồn tại");
      }

      if (!parentId || parentId === "") {
        parentId = undefined;
      } else {
        parentId = new mongoose.Types.ObjectId(parentId);
      }

      // upload ảnh
      uploadedImage = await cloudinary.uploader.upload(req.file.path, {
        public_id: `categories/${slug}-${Date.now()}`,
      });

      // tạo category
      const newCategory = await categoryModel.create({
        name,
        slug,
        parentId,
        description,
        thumbnail: uploadedImage.secure_url,
      });

      return new Created({
        message: "Tạo danh mục thành công",
        metadata: newCategory,
      }).send(res);
    } catch (error) {
      if (uploadedImage?.public_id) {
        await cloudinary.uploader.destroy(uploadedImage.public_id);
      }

      throw error;
    } finally {
      if (req.file?.path) {
        await fs.unlink(req.file.path).catch(() => {});
      }
    }
  }
}

module.exports = new CategoryController();
