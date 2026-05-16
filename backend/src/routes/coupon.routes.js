const express = require("express");

const router = express.Router();
const couponController = require("../controllers/coupon.controller");

const { authUser, authAdmin } = require("../middlewares/authUser");
const { asyncHandler } = require("../auth/checkAuth");

router.use(authUser);

router.post(
  "/coupons/validate",
  asyncHandler(couponController.validateCouponForCart),
);
router.use(authAdmin);

router.post("/admin/coupons", asyncHandler(couponController.createCoupon));
router.get("/admin/coupons", asyncHandler(couponController.getCoupons));

router.get(
  "/admin/coupons/:id",
  asyncHandler(couponController.getCouponDetail),
);

router.patch("/admin/coupons/:id", asyncHandler(couponController.updateCoupon));

router.delete(
  "/admin/coupons/:id",
  asyncHandler(couponController.deleteCoupon),
);

module.exports = router;
