const express = require("express");
const reviewController = require("./review.controller");
const asyncHandler = require("../../middlewares/asyncHandler");
const { authUser, authAdmin } = require("../../middlewares/authentication");

const router = express.Router();

router.get("/products/:productId/reviews", asyncHandler(reviewController.getProductReviews));

router.use(authUser);

router.post("/", asyncHandler(reviewController.createReview));
router.get("/me", asyncHandler(reviewController.getMyReviews));
router.patch("/:reviewId", asyncHandler(reviewController.updateMyReview));
router.delete("/:reviewId", asyncHandler(reviewController.deleteMyReview));

router.use(authAdmin);

router.get("/admin", asyncHandler(reviewController.adminGetReviews));
router.patch("/admin/:reviewId/approve", asyncHandler(reviewController.adminApproveReview));
router.delete("/admin/:reviewId", asyncHandler(reviewController.adminDeleteReview));

module.exports = router;
