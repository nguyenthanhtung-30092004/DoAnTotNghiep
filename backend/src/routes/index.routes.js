const usersRoutes = require("./user.routes");
const categoriesRoutes = require("./category.routes");
const brandRoutes = require("./brand.routes");
const productRoutes = require("./product.routes");
const cartRoutes = require("./cart.routes");
const orderRouters = require("./order.routes");
const reviewRoutes = require("./review.routes");
function routes(app) {
  app.use("/v1/api/user", usersRoutes);
  app.use("/v1/api/category", categoriesRoutes);
  app.use("/v1/api/brand", brandRoutes);
  app.use("/v1/api/product", productRoutes);
  app.use("/v1/api/cart", cartRoutes);
  app.use("/v1/api/order", orderRouters);
  app.use("v1/api/review", reviewRoutes);
}

module.exports = routes;
