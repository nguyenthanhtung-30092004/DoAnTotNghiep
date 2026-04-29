const usersRoutes = require("./user.routes");

function routes(app) {
  app.use("/v1/api/user", usersRoutes);
}

module.exports = routes;
