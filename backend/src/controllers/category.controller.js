const { Created, OK } = require("../core/success.response");
const { BadRequestError } = require("../core/error.response");
const categoryService = require("../services/category.service");

class CategoryController {
  async getAllCategory(req, res) {
    const categories = await categoryService.getAllCategories();
    return new OK({
      message: "Lấy danh sách danh mục thành công",
      metadata: {
        data: categories,
      },
    }).send(res);
  }

  async createCategory(req, res) {
    const { name, slug, parentId, description } = req.body;
    const newCategory = await categoryService.createCategory({
      file: req.file,
      name,
      slug,
      parentId,
      description,
    });

    return new Created({
      message: "Tạo danh mục thành công",
      metadata: newCategory,
    }).send(res);
  }

  async updateCategory(req, res) {
    const { id } = req.params;
    const { name, slug, parentId, description } = req.body;

    const updated = await categoryService.updateCategory({
      id,
      file: req.file,
      name,
      slug,
      parentId,
      description,
    });

    return new OK({
      message: "Cập nhật danh mục thành công",
      metadata: updated,
    }).send(res);
  }

  async deleteCategory(req, res) {
    const { id } = req.params;
    if (!id) {
      throw new BadRequestError("Thiếu thông tin danh mục");
    }
    const category = await categoryService.deleteCategory(id);
    
    return new OK({
      message: "Xóa danh mục thành công",
      metadata: category,
    }).send(res);
  }
}

module.exports = new CategoryController();
