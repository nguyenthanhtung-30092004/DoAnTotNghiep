const {
  BadRequestError,
  ConflictRequestError,
  NotFoundError,
} = require("../core/error.response");
const fs = require("fs/promises");
const brandModel = require("../models/brand.model");
const cloudinary = require("../configs/cloudDinary");
const { getPublicId } = require("../utils/getPublicImage");

class BrandService {
  async getAllBrands() {
    return await brandModel.find();
  }

  async createBrand({ file, nameBrand, slugBrand, description }) {
    let uploadImage = null;
    try {
      if (!file) {
        throw new BadRequestError("Vui lòng upload ảnh");
      }

      if (!nameBrand || !slugBrand || !description) {
        throw new BadRequestError("Điền thiếu trường thông tin");
      }

      const exist = await brandModel.findOne({ slugBrand });
      if (exist) {
        throw new ConflictRequestError("Slug đã tồn tại");
      }

      uploadImage = await cloudinary.uploader.upload(file.path, {
        folder: "brand",
        public_id: `brand/${slugBrand}-${Date.now()}`,
      });

      const newBrand = await brandModel.create({
        nameBrand,
        slugBrand,
        description,
        logoBrand: uploadImage.secure_url,
      });

      return newBrand;
    } catch (error) {
      if (uploadImage?.public_id) {
        await cloudinary.uploader.destroy(uploadImage.public_id).catch(() => {});
      }
      throw error;
    } finally {
      if (file?.path) {
        await fs.unlink(file.path).catch(() => {});
      }
    }
  }

  async updateBrand({ id, file, nameBrand, slugBrand, description, outStanding }) {
    let uploadedImage = null;
    try {
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

      if (file) {
        const oldLogoBrand = brand.logoBrand;
        uploadedImage = await cloudinary.uploader.upload(file.path, {
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

  async deleteBrand(id) {
    let publicId = null;
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
    return brand;
  }
}

module.exports = new BrandService();
