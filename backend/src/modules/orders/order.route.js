const express = require("express");
const orderController = require("./order.controller");
const orderValidation = require("./order.validation");
const asyncHandler = require("../../middlewares/asyncHandler");
const { authUser, authAdmin } = require("../../middlewares/authentication");
const validate = require("../../middlewares/validate");

const router = express.Router();

router.use(authUser);

router.post(
  "/checkout",
  validate(orderValidation.checkout),
  asyncHandler(orderController.checkout),
);
router.get("/my-orders", asyncHandler(orderController.getMyOrders));
router.get(
  "/my-orders/:orderId",
  validate(orderValidation.orderIdParam),
  asyncHandler(orderController.getMyOrderDetail),
);
router.patch(
  "/my-orders/:orderId/cancel",
  validate(orderValidation.cancelOrder),
  asyncHandler(orderController.cancelMyOrder),
);

router.get("/admin/orders", authAdmin, asyncHandler(orderController.getAllOrders));
router.get(
  "/admin/orders/:orderId",
  authAdmin,
  validate(orderValidation.orderIdParam),
  asyncHandler(orderController.getOrderDetail),
);
router.patch(
  "/admin/orders/:orderId/status",
  authAdmin,
  validate(orderValidation.updateOrderStatus),
  asyncHandler(orderController.updateOrderStatus),
);
router.patch(
  "/admin/orders/:orderId/cancel",
  authAdmin,
  validate(orderValidation.cancelOrder),
  asyncHandler(orderController.adminCancelOrder),
);

module.exports = router;
