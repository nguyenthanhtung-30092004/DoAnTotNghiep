const { OK } = require("../core/success.response");
const reviewService = require("../services/review.service");

class ReviewController {
  createReview = async (req, res) => {
    new OK({
      message: "Đánh giá sản phẩm thành công",
      metadata: await reviewService.createReview({
        userId: req.user._id,
        productId: req.body.productId,
        orderId: req.body.orderId,
        rating: req.body.rating,
        content: req.body.content,
      }),
    }).send(res);
  };

  getProductReviews = async (req, res) => {
    new OK({
      message: "Lấy danh sách đánh giá sản phẩm thành công",
      metadata: await reviewService.getProductReviews({
        productId: req.params.productId,
        ...req.query,
      }),
    }).send(res);
  };

  getMyReviews = async (req, res) => {
    new OK({
      message: "Lấy đánh giá của tôi thành công",
      metadata: await reviewService.getMyReviews({
        userId: req.user._id,
        ...req.query,
      }),
    }).send(res);
  };

  updateMyReview = async (req, res) => {
    new OK({
      message: "Cập nhật đánh giá thành công",
      metadata: await reviewService.updateMyReview({
        userId: req.user._id,
        reviewId: req.params.reviewId,
        rating: req.body.rating,
        content: req.body.content,
      }),
    }).send(res);
  };

  deleteMyReview = async (req, res) => {
    new OK({
      message: "Xóa đánh giá thành công",
      metadata: await reviewService.deleteMyReview({
        userId: req.user._id,
        reviewId: req.params.reviewId,
      }),
    }).send(res);
  };

  adminGetReviews = async (req, res) => {
    new OK({
      message: "Admin lấy danh sách đánh giá thành công",
      metadata: await reviewService.adminGetReviews(req.query),
    }).send(res);
  };

  adminApproveReview = async (req, res) => {
    new OK({
      message: "Cập nhật trạng thái đánh giá thành công",
      metadata: await reviewService.adminApproveReview({
        reviewId: req.params.reviewId,
        isApproved: req.body.isApproved,
      }),
    }).send(res);
  };

  adminDeleteReview = async (req, res) => {
    new OK({
      message: "Admin xóa đánh giá thành công",
      metadata: await reviewService.adminDeleteReview(req.params.reviewId),
    }).send(res);
  };
}

module.exports = new ReviewController();
