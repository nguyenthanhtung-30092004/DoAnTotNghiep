const express = require("express");
const orderController = require("./order.controller");
const asyncHandler = require("../../middlewares/asyncHandler");
const { authUser, authAdmin } = require("../../middlewares/authentication");

const router = express.Router();

router.use(authUser);

router.post("/checkout", asyncHandler(orderController.checkout));
router.get("/my-orders", asyncHandler(orderController.getMyOrders));
router.get("/my-orders/:orderId", asyncHandler(orderController.getMyOrderDetail));
router.patch("/my-orders/:orderId/cancel", asyncHandler(orderController.cancelMyOrder));

router.get("/admin/orders", authAdmin, asyncHandler(orderController.getAllOrders));
router.get("/admin/orders/:orderId", authAdmin, asyncHandler(orderController.getOrderDetail));
router.patch("/admin/orders/:orderId/status", authAdmin, asyncHandler(orderController.updateOrderStatus));
router.patch("/admin/orders/:orderId/cancel", authAdmin, asyncHandler(orderController.adminCancelOrder));

module.exports = router;
