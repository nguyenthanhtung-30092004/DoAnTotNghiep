const express = require("express");

const { asyncHandler } = require("../auth/checkAuth");
const { authAdmin, authUser } = require("../middlewares/authUser");
const ReviewController = require("../controllers/review.controller");

const router = express.Router();

// Public: xem review của sản phẩm
router.get(
  "/products/:productId/reviews",
  asyncHandler(ReviewController.getProductReviews),
);

// User routes
router.post(
  "/",
  authUser,
  asyncHandler(ReviewController.createReview),
);

router.get(
  "/me",
  authUser,
  asyncHandler(ReviewController.getMyReviews),
);

// Admin routes nên đặt trước /:reviewId
router.get(
  "/admin",
  authUser,
  authAdmin,
  asyncHandler(ReviewController.adminGetReviews),
);

router.patch(
  "/admin/:reviewId/approve",
  authUser,
  authAdmin,
  asyncHandler(ReviewController.adminApproveReview),
);

router.delete(
  "/admin/:reviewId",
  authUser,
  authAdmin,
  asyncHandler(ReviewController.adminDeleteReview),
);

// User review detail routes đặt sau cùng
router.patch(
  "/:reviewId",
  authUser,
  asyncHandler(ReviewController.updateMyReview),
);

router.delete(
  "/:reviewId",
  authUser,
  asyncHandler(ReviewController.deleteMyReview),
);

module.exports = router;