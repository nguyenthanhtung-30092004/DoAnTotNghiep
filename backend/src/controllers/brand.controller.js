const {
  BadRequestError,
  ConflictRequestError,
  NotFoundError,
} = require("../core/error.response");
const fs = require("fs/promises");
const brandModel = require("../models/brand.model");
const cloudinary = require("../configs/cloudDinary");
const { Created, OK } = require("../core/success.response");
const { getPublicId } = require("../utils/getPublicImage");
const categoryModel = require("../models/category.model");

class BrandController {
  async getAllBrand(req, res) {
    const brands = await brandModel.find();
    return new OK({
      message: "Lấy danh sách danh mục thành công",
      metadata: brands,
    }).send(res);
  }

  async createBrand(req, res) {
    let uploadImage = null;
    try {
      if (!req.file) {
        throw new BadRequestError("Vui lòng upload ảnh");
      }

      let { nameBrand, slugBrand, description } = req.body;
      if (!nameBrand || !slugBrand || !description) {
        throw new BadRequestError("Điền thiếu trường thông tin");
      }

      const exist = await brandModel.findOne({ slugBrand });
      if (exist) {
        throw new ConflictRequestError("Slug đã tồn tại");
      }

      uploadImage = await cloudinary.uploader.upload(req.file.path, {
        folder: "brand",
        public_id: `brand/${slugBrand}-${Date.now()}`,
      });

      const newBrand = await brandModel.create({
        nameBrand,
        slugBrand,
        description,
        logoBrand: uploadImage.secure_url,
      });

      return new Created({
        message: "Tạo thương hiệu thành công",
        metadata: newBrand,
      }).send(res);
    } catch (error) {
      if (uploadImage?.public_id) {
        await cloudinary.uploader.destroy(uploadImage.public_id);
      }
      throw error;
    } finally {
      if (req.file?.path) {
        await fs.unlink(req.file.path).catch(() => {});
      }
    }
  }

  async updateBrand(req, res) {
    let uploadedImage = null;
    try {
      const { id } = req.params;
      let { nameBrand, slugBrand, description, outStanding } = req.body;

      const brand = await brandModel.findById(id);
      if (!brand) {
        throw new NotFoundError("Không tìm thấy thương hiệu");
      }

      if (slugBrand && slugBrand !== brand.slugBrand) {
        const existing = await brandModel.findOne({ slugBrand });
        if (existing) {
          throw new ConflictRequestError("Slug đã tồn tại");
        }
      }

      let logoBrand = brand.logoBrand;

      if (req.file) {
        const oldLogoBrand = brand.logoBrand;
        uploadedImage = await cloudinary.uploader.upload(req.file.path, {
          folder: "brand",
          public_id: `brand/${slugBrand || brand.slugBrand}-${Date.now()}`,
        });
        logoBrand = uploadedImage.secure_url;

        if (oldLogoBrand) {
          await cloudinary.uploader
            .destroy(getPublicId(oldLogoBrand))
            .catch(() => {});
        }
      }

      const updated = await brandModel.findByIdAndUpdate(
        id,
        {
          nameBrand,
          slugBrand,
          description,
          outStanding,
          logoBrand,
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

  async deleteBrand(req, res) {
    let publicId = null;
    try {
      const { id } = req.params;
      if (!id) {
        throw new BadRequestError("Thiếu thông tin thương hiệu");
      }
      const brand = await brandModel.findById(id);
      if (!brand) {
        throw new NotFoundError("Thương hiệu không tồn tại");
      }
      if (brand.logoBrand) {
        publicId = getPublicId(brand.logoBrand);
      }
      await brand.deleteOne();
      if (publicId) {
        await cloudinary.uploader.destroy(publicId).catch(() => {});
      }
      return new OK({
        message: "Xóa thương hiệu thành công",
        metadata: brand,
      }).send(res);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new BrandController();
