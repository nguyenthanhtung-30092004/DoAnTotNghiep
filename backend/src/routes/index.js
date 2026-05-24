const authRoutes = require("../modules/auth/auth.route");
const userRoutes = require("../modules/users/user.route");
const categoryRoutes = require("../modules/categories/category.route");
const brandRoutes = require("../modules/brands/brand.route");
const productRoutes = require("../modules/products/product.route");
const cartRoutes = require("../modules/cart/cart.route");
const couponRoutes = require("../modules/coupons/coupon.route");
const orderRoutes = require("../modules/orders/order.route");
const paymentRoutes = require("../modules/payments/payment.route");
const reviewRoutes = require("../modules/reviews/review.route");
const uploadRoutes = require("../modules/uploads/upload.route");

function routes(app) {
  // New module-based API paths
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/categories", categoryRoutes);
  app.use("/api/brands", brandRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/cart", cartRoutes);
  app.use("/api/coupons", couponRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/payments", paymentRoutes);
  app.use("/api/reviews", reviewRoutes);
  app.use("/api/uploads", uploadRoutes);

  // Backward-compatible paths for current frontend
  app.use("/v1/api/user", authRoutes);
  app.use("/v1/api/categories", categoryRoutes);
  app.use("/v1/api/brand", brandRoutes);
  app.use("/v1/api/products", productRoutes);
  app.use("/v1/api/cart", cartRoutes);
  app.use("/v1/api/coupon", couponRoutes);
  app.use("/v1/api/order", orderRoutes);
  app.use("/v1/api/orders", orderRoutes);

  // Payment routes
  app.use("/v1/api/payment", paymentRoutes);
  app.use("/v1/api/payments", paymentRoutes);

  app.use("/v1/api/reviews", reviewRoutes);
  app.use("/v1/api/uploads", uploadRoutes);
}

module.exports = routes;
