const express = require("express");
const reviewController = require("./review.controller");
const reviewValidation = require("./review.validation");
const asyncHandler = require("../../middlewares/asyncHandler");
const { authUser, authAdmin } = require("../../middlewares/authentication");
const validate = require("../../middlewares/validate");

const router = express.Router();

router.get(
  "/products/:productId/reviews",
  validate(reviewValidation.productReviews),
  asyncHandler(reviewController.getProductReviews),
);

router.use(authUser);

router.post(
  "/",
  validate(reviewValidation.createReview),
  asyncHandler(reviewController.createReview),
);
router.get("/me", asyncHandler(reviewController.getMyReviews));
router.patch(
  "/:reviewId",
  validate(reviewValidation.updateReview),
  asyncHandler(reviewController.updateMyReview),
);
router.delete(
  "/:reviewId",
  validate(reviewValidation.reviewIdParam),
  asyncHandler(reviewController.deleteMyReview),
);

router.use(authAdmin);

router.get("/admin", asyncHandler(reviewController.adminGetReviews));
router.patch(
  "/admin/:reviewId/approve",
  validate(reviewValidation.approveReview),
  asyncHandler(reviewController.adminApproveReview),
);
router.delete(
  "/admin/:reviewId",
  validate(reviewValidation.reviewIdParam),
  asyncHandler(reviewController.adminDeleteReview),
);

module.exports = router;
