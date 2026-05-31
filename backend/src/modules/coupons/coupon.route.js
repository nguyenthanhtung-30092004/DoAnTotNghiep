const express = require("express");
const couponController = require("./coupon.controller");
const couponValidation = require("./coupon.validation");
const asyncHandler = require("../../middlewares/asyncHandler");
const { authUser, authAdmin, optionalAuth } = require("../../middlewares/authentication");
const validate = require("../../middlewares/validate");

const router = express.Router();

router.post(
  "/coupons/validate",
  optionalAuth,
  validate(couponValidation.validateCouponForCart),
  asyncHandler(couponController.validateCouponForCart),
);
router.post(
  "/validate",
  optionalAuth,
  validate(couponValidation.validateCouponForCart),
  asyncHandler(couponController.validateCouponForCart),
);

router.use(authAdmin);

router.post(
  "/admin/coupons",
  validate(couponValidation.createCoupon),
  asyncHandler(couponController.createCoupon),
);
router.get("/admin/coupons", asyncHandler(couponController.getCoupons));
router.get(
  "/admin/coupons/:id",
  validate(couponValidation.couponIdParam),
  asyncHandler(couponController.getCouponDetail),
);
router.patch(
  "/admin/coupons/:id",
  validate(couponValidation.updateCoupon),
  asyncHandler(couponController.updateCoupon),
);
router.delete(
  "/admin/coupons/:id",
  validate(couponValidation.couponIdParam),
  asyncHandler(couponController.deleteCoupon),
);

router.post(
  "/",
  validate(couponValidation.createCoupon),
  asyncHandler(couponController.createCoupon),
);
router.get("/", asyncHandler(couponController.getCoupons));
router.get(
  "/:id",
  validate(couponValidation.couponIdParam),
  asyncHandler(couponController.getCouponDetail),
);
router.patch(
  "/:id",
  validate(couponValidation.updateCoupon),
  asyncHandler(couponController.updateCoupon),
);
router.delete(
  "/:id",
  validate(couponValidation.couponIdParam),
  asyncHandler(couponController.deleteCoupon),
);

module.exports = router;
