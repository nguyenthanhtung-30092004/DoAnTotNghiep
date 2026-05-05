const cloudinary = require("../configs/cloudDinary");
const fs = require("fs/promises");
const categoryModel = require("../models/category.model");

const { Created, OK } = require("../core/success.response");
const {
  BadRequestError,
  ConflictRequestError,
  NotFoundError,
} = require("../core/error.response");

const mongoose = require("mongoose");

function getPublicId(url) {
  const parts = url.split("/");
  const uploadIndex = parts.indexOf("upload");
  if (uploadIndex === -1) {
    throw new BadRequestError("Đường dẫn ảnh không tồn tại");
  }
  const pathParts = parts.slice(uploadIndex + 1);
  const pathWithoutVersion = pathParts[0].startsWith("v")
    ? pathParts.slice(1)
    : pathParts;
  const publicIdWithExt = pathWithoutVersion.join("/");
  const publicId = publicIdWithExt.substring(
    0,
    publicIdWithExt.lastIndexOf("."),
  );

  return publicId;
}

class CategoryController {
  async getAllCategory(req, res) {
    const categories = await categoryModel.find();
    return new OK({
      message: "Lấy danh sách danh mục thành công",
      metadata: {
        data: categories,
      },
    }).send(res);
  }
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

      uploadedImage = await cloudinary.uploader.upload(req.file.path, {
        folder: "category",
        public_id: `category/${slug}-${Date.now()}`,
      });

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

  async updateCategory(req, res) {
    let uploadedImage = null;

    try {
      const { id } = req.params;
      let { name, slug, parentId, description } = req.body;

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

      if (!parentId || parentId === "") {
        parentId = undefined;
      } else {
        parentId = new mongoose.Types.ObjectId(parentId);
      }

      let thumbnail = category.thumbnail;

      if (req.file) {
        const oldThumbnail = category.thumbnail;

        uploadedImage = await cloudinary.uploader.upload(req.file.path, {
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
          parentId,
          description,
          thumbnail,
        },
        { new: true },
      );

      return new OK({
        message: "Cập nhật danh mục thành công",
        metadata: updated,
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

  async deleteCategory(req, res) {
    let publicId = null;
    try {
      const { id } = req.params;
      if (!id) {
        throw new BadRequestError("Thiếu thôn tin danh mục");
      }
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
      return new OK({
        message: "Xóa danh mục thành công",
        metadata: category,
      }).send(res);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new CategoryController();
