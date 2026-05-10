const mongoose = require("mongoose");
const categoryModel = require("../models/category.model");
const cloudinary = require("../configs/cloudDinary");
const fs = require("fs/promises");
const { getPublicId } = require("../utils/getPublicImage");
const {
  BadRequestError,
  ConflictRequestError,
  NotFoundError,
} = require("../core/error.response");

class CategoryService {
  async getAllCategories() {
    return await categoryModel.find();
  }

  async createCategory({ file, name, slug, parentId, description }) {
    let uploadedImage = null;
    try {
      if (!file) {
        throw new BadRequestError("Vui lòng upload ảnh");
      }

      if (!name || !slug) {
        throw new BadRequestError("Thiếu name hoặc slug");
      }

      const existing = await categoryModel.findOne({ slug });
      if (existing) {
        throw new ConflictRequestError("Slug đã tồn tại");
      }

      let parsedParentId = undefined;
      if (parentId && parentId !== "") {
        parsedParentId = new mongoose.Types.ObjectId(parentId);
      }

      uploadedImage = await cloudinary.uploader.upload(file.path, {
        folder: "category",
        public_id: `category/${slug}-${Date.now()}`,
      });

      const newCategory = await categoryModel.create({
        name,
        slug,
        parentId: parsedParentId,
        description,
        thumbnail: uploadedImage.secure_url,
      });

      return newCategory;
    } catch (error) {
      if (uploadedImage?.public_id) {
        await cloudinary.uploader.destroy(uploadedImage.public_id).catch(() => {});
      }
      throw error;
    } finally {
      if (file?.path) {
        await fs.unlink(file.path).catch(() => {});
      }
    }
  }

  async updateCategory({ id, file, name, slug, parentId, description }) {
    let uploadedImage = null;
    try {
      const category = await categoryModel.findById(id);
      if (!category) {
        throw new NotFoundError("Không tìm thấy danh mục");
      }

      if (slug && slug !== category.slug) {
        const existing = await categoryModel.findOne({ slug });
        if (existing) {
          throw new ConflictRequestError("Slug đã tồn tại");
        }
      }

      let parsedParentId = undefined;
      if (parentId && parentId !== "") {
        parsedParentId = new mongoose.Types.ObjectId(parentId);
      }

      let thumbnail = category.thumbnail;

      if (file) {
        const oldThumbnail = category.thumbnail;

        uploadedImage = await cloudinary.uploader.upload(file.path, {
          folder: "category",
          public_id: `category/${slug || category.slug}-${Date.now()}`,
        });

        thumbnail = uploadedImage.secure_url;

        if (oldThumbnail) {
          await cloudinary.uploader
            .destroy(getPublicId(oldThumbnail))
            .catch(() => {});
        }
      }

      const updated = await categoryModel.findByIdAndUpdate(
        id,
        {
          name,
          slug,
          parentId: parsedParentId,
          description,
          thumbnail,
        },
        { new: true },
      );

      return updated;
    } catch (error) {
      if (uploadedImage?.public_id) {
        await cloudinary.uploader.destroy(uploadedImage.public_id).catch(() => {});
      }
      throw error;
    } finally {
      if (file?.path) {
        await fs.unlink(file.path).catch(() => {});
      }
    }
  }

  async deleteCategory(id) {
    let publicId = null;
    const category = await categoryModel.findById(id);
    if (!category) {
      throw new NotFoundError("Danh mục không tồn tại");
    }
    const hasChild = await categoryModel.findOne({ parentId: id });
    if (hasChild) {
      throw new BadRequestError("Danh mục có danh mục con, không thể xóa");
    }
    if (category.thumbnail) {
      publicId = getPublicId(category.thumbnail);
    }
    await category.deleteOne();
    if (publicId) {
      await cloudinary.uploader.destroy(publicId).catch(() => {});
    }
    return category;
  }
}

module.exports = new CategoryService();
