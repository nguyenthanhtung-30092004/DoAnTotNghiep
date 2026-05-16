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
router.use(authUser);

router.post("/", asyncHandler(ReviewController.createReview));

router.get("/me", asyncHandler(ReviewController.getMyReviews));

router.patch("/:reviewId", asyncHandler(ReviewController.updateMyReview));

router.delete("/:reviewId", asyncHandler(ReviewController.deleteMyReview));

// Admin routes
router.use(authAdmin);

router.get("/admin", asyncHandler(ReviewController.adminGetReviews));

router.patch(
  "/admin/:reviewId/approve",
  asyncHandler(ReviewController.adminApproveReview),
);

router.delete(
  "/admin/:reviewId",
  asyncHandler(ReviewController.adminDeleteReview),
);

module.exports = router;
