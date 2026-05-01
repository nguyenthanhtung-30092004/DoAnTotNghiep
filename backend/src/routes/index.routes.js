const usersRoutes = require("./user.routes");
const categoriesRoutes = require("./category.routes");
function routes(app) {
  app.use("/v1/api/user", usersRoutes);
  app.use("/v1/api/category", categoriesRoutes);
}

module.exports = routes;
