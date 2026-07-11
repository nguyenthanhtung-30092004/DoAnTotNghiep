const { Created, OK } = require('../core/success.response');
const { BadRequestError } = require('../core/error.response');
const brandService = require('../services/brand.service');

class BrandController {
  async getAllBrand(req, res) {
    const brands = await brandService.getAllBrands();
    return new OK({
      message: "Lấy danh sách danh mục thành công",
      metadata: brands,
    }).send(res);
  }

  async createBrand(req, res) {
    const { nameBrand, slugBrand, description, outStanding } = req.body;
    const newBrand = await brandService.createBrand({
      file: req.file,
      nameBrand,
      slugBrand,
      description,
      outStanding,
    });

    return new Created({
      message: "Tạo thương hiệu thành công",
      metadata: newBrand,
    }).send(res);
  }

  async updateBrand(req, res) {
    const { id } = req.params;
    const { nameBrand, slugBrand, description, outStanding } = req.body;

    const updated = await brandService.updateBrand({
      id,
      file: req.file,
      nameBrand,
      slugBrand,
      description,
      outStanding,
    });

    return new OK({
      message: "Cập nhật danh mục thành công",
      metadata: updated,
    }).send(res);
  }

  async deleteBrand(req, res) {
    const { id } = req.params;
    if (!id) {
      throw new BadRequestError("Thiếu thông tin thương hiệu");
    }
    const brand = await brandService.deleteBrand(id);

    return new OK({
      message: "Xóa thương hiệu thành công",
      metadata: brand,
    }).send(res);
  }
}

module.exports = new BrandController();

