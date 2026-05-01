class CategoryController {
  async createCategory(req, res) {
    console.log(req.body);
    console.log(req.file);
  }
}
module.exports = new CategoryController();
