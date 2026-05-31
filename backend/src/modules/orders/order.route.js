const express = require("express");
const orderController = require("./order.controller");
const orderValidation = require("./order.validation");
const asyncHandler = require("../../middlewares/asyncHandler");
const { authUser, authAdmin, optionalAuth } = require("../../middlewares/authentication");
const validate = require("../../middlewares/validate");

const router = express.Router();

router.post(
  "/checkout",
  optionalAuth, // dùng optionalAuth để có thể checkout khi chưa đăng nhập
  validate(orderValidation.checkout),
  asyncHandler(orderController.checkout)
);

// lịch sử đơn hàng bắt buộc đăng nhập
router.get("/my-orders", authUser, asyncHandler(orderController.getMyOrders));
router.get(
  "/my-orders/:orderId",
  authUser,
  validate(orderValidation.orderIdParam),
  asyncHandler(orderController.getMyOrderDetail)
);
router.patch(
  "/my-orders/:orderId/cancel",
  authUser,
  validate(orderValidation.cancelOrder),
  asyncHandler(orderController.cancelMyOrder)
);

router.get("/admin/orders", authAdmin, asyncHandler(orderController.getAllOrders));
router.get(
  "/admin/orders/:orderId",
  authAdmin,
  validate(orderValidation.orderIdParam),
  asyncHandler(orderController.getOrderDetail)
);
router.patch(
  "/admin/orders/:orderId/status",
  authAdmin,
  validate(orderValidation.updateOrderStatus),
  asyncHandler(orderController.updateOrderStatus)
);
router.patch(
  "/admin/orders/:orderId/cancel",
  authAdmin,
  validate(orderValidation.cancelOrder),
  asyncHandler(orderController.adminCancelOrder)
);

module.exports = router;
