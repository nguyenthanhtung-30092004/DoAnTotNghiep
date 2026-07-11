const authRoutes = require('./auth.route');
const userRoutes = require('./user.route');
const categoryRoutes = require('./category.route');
const brandRoutes = require('./brand.route');
const productRoutes = require('./product.route');
const cartRoutes = require('./cart.route');
const couponRoutes = require('./coupon.route');
const orderRoutes = require('./order.route');
const paymentRoutes = require('./payment.route');
const reviewRoutes = require('./review.route');
const dashboardRoutes = require('./dashboard.route');
const chatRoutes = require('./chat.route');
function routes(app) {
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
  app.use("/api/dashboard", dashboardRoutes);
  app.use("/api/chats", chatRoutes);
}

module.exports = routes;
