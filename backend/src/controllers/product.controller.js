const { Created, OK } = require('../core/success.response');
const productService = require('../services/product.service');

class ProductController {
  async createProduct(req, res) {
    const newProduct = await productService.createProduct({
      body: req.body,
      files: req.files,
    });

    return new Created({
      message: "Tạo sản phẩm thành công",
      metadata: newProduct,
    }).send(res);
  }

  async getAllProducts(req, res) {
    const data = await productService.getAllProducts({
      query: req.query,
      params: req.params,
    });

    return new OK({
      message: "Lấy danh sách sản phẩm thành công",
      metadata: data,
    }).send(res);
  }

  async getDetailProduct(req, res) {
    const idOrSlug = req.params.idOrSlug || req.params.id;
    const product = await productService.getDetailProduct(idOrSlug);

    return new OK({
      message: "Lấy chi tiết sản phẩm thành công",
      metadata: product,
    }).send(res);
  }

  async updateProduct(req, res) {
    const { id } = req.params;
    const updatedProduct = await productService.updateProduct({
      id,
      body: req.body,
      files: req.files,
    });

    return new OK({
      message: "Cập nhật sản phẩm thành công",
      metadata: updatedProduct,
    }).send(res);
  }

  async deleteProduct(req, res) {
    const { id } = req.params;
    const result = await productService.deleteProduct(id);

    return new OK({
      message: "Xóa sản phẩm thành công",
      metadata: result,
    }).send(res);
  }
}

module.exports = new ProductController();

