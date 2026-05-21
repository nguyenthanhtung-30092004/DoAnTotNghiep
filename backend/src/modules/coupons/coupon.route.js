const express = require("express");
const couponController = require("./coupon.controller");
const asyncHandler = require("../../middlewares/asyncHandler");
const { authUser, authAdmin } = require("../../middlewares/authentication");

const router = express.Router();

router.use(authUser);

router.post("/coupons/validate", asyncHandler(couponController.validateCouponForCart));
router.post("/validate", asyncHandler(couponController.validateCouponForCart));

router.use(authAdmin);

router.post("/admin/coupons", asyncHandler(couponController.createCoupon));
router.get("/admin/coupons", asyncHandler(couponController.getCoupons));
router.get("/admin/coupons/:id", asyncHandler(couponController.getCouponDetail));
router.patch("/admin/coupons/:id", asyncHandler(couponController.updateCoupon));
router.delete("/admin/coupons/:id", asyncHandler(couponController.deleteCoupon));

router.post("/", asyncHandler(couponController.createCoupon));
router.get("/", asyncHandler(couponController.getCoupons));
router.get("/:id", asyncHandler(couponController.getCouponDetail));
router.patch("/:id", asyncHandler(couponController.updateCoupon));
router.delete("/:id", asyncHandler(couponController.deleteCoupon));

module.exports = router;
