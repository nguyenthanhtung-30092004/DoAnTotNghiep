const usersRoutes = require("./user.routes");
const categoriesRoutes = require("./category.routes");
const brandRoutes = require("./brand.routes");
const productRoutes = require("./product.routes");
function routes(app) {
  app.use("/v1/api/user", usersRoutes);
  app.use("/v1/api/category", categoriesRoutes);
  app.use("/v1/api/brand", brandRoutes);
  app.use("/v1/api/product", productRoutes);
}

module.exports = routes;
