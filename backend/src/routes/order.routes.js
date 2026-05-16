const express = require("express");

const { asyncHandler } = require("../auth/checkAuth");
const { authAdmin, authUser } = require("../middlewares/authUser");
const orderController = require("../controllers/order.controller");
const couponService = require("../services/coupon.service");

const router = express.Router();
router.use(authUser);

// create order

router.post("/checkout", asyncHandler(orderController.createOrderFromCart));

router.get("/my-orders", asyncHandler(orderController.getMyOrders));

router.get(
  "/my-orders/:orderId",
  asyncHandler(orderController.getMyOrderDetail),
);

router.patch(
  "/my-orders/:orderId/cancel",
  asyncHandler(orderController.cancelMyOrder),
);

// Admin routes
router.get(
  "/admin/orders",
  authAdmin,
  asyncHandler(orderController.getAllOrders),
);

router.get(
  "/admin/orders/:orderId",
  authAdmin,
  asyncHandler(orderController.getOrderDetail),
);

router.patch(
  "/admin/orders/:orderId/status",
  authAdmin,
  asyncHandler(orderController.updateOrderStatus),
);

router.patch(
  "/admin/orders/:orderId/cancel",
  authAdmin,
  asyncHandler(orderController.adminCancelOrder),
);

module.exports = router;
