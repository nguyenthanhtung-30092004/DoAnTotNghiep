const mongoose = require("mongoose");
const categoryModel = require("../../models/category.model");
const cloudinary = require("../../configs/cloudDinary");
const fs = require("fs/promises");
const { getPublicId } = require("../../utils/getPublicImage");
const {
  BadRequestError,
  ConflictRequestError,
  NotFoundError,
} = require("../../core/error.response");

class CategoryService {
  async getAllCategories(query = {}) {
    const { keyword = "", type = "", page = 1, limit = 10 } = query;

    const filter = {};

    if (keyword) {
      filter.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { slug: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    if (type === "root") {
      filter.parentId = null;
    }

    if (type === "child") {
      filter.parentId = { $ne: null };
    }

    const pageNumber = Math.max(Number(page) || 1, 1);
    const limitNumber = Math.max(Number(limit) || 10, 1);

    const categories = await categoryModel
      .find(filter)
      .populate("parentId", "name slug")
      .sort({ createdAt: 1 });

    const orderedCategories = buildCategoryTree(categories);

    const total = orderedCategories.length;
    const start = (pageNumber - 1) * limitNumber;
    const end = start + limitNumber;

    const paginatedCategories = orderedCategories.slice(start, end);

    return {
      data: paginatedCategories,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    };

    function getParentId(category) {
      if (!category.parentId) return null;

      if (typeof category.parentId === "object") {
        return category.parentId._id.toString();
      }

      return category.parentId.toString();
    }

    function buildCategoryTree(categories) {
      const plainCategories = categories.map((item) => item.toObject());

      const parents = plainCategories.filter((item) => !getParentId(item));
      const children = plainCategories.filter((item) => getParentId(item));

      const result = [];

      parents.forEach((parent) => {
        result.push({
          ...parent,
          level: 0,
          parentName: "Danh mục gốc",
        });

        const childList = children.filter(
          (child) => getParentId(child) === parent._id.toString(),
        );

        childList.forEach((child) => {
          result.push({
            ...child,
            level: 1,
            parentName: parent.name,
          });
        });
      });

      return result;
    }
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
        await cloudinary.uploader
          .destroy(uploadedImage.public_id)
          .catch(() => {});
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
        await cloudinary.uploader
          .destroy(uploadedImage.public_id)
          .catch(() => {});
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
