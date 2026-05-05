const {
  BadRequestError,
  ConflictRequestError,
} = require("../core/error.response");
const fs = require("fs/promises");
const brandModel = require("../models/brand.model");
const cloudinary = require("../configs/cloudDinary");
const { Created } = require("../core/success.response");

class BrandController {
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
    let uploadImage = null;
    try {
      const { id } = req.params;
      let { nameBrand, slugBrand, description, outStanding } = req.body;
    } catch (error) {}
  }
}

module.exports = new BrandController();
