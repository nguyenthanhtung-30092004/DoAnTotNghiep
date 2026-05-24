const reviewService = require("../services/review.service");
const { OK, Created } = require("../core/success.response");

class ReviewController {
  createReview = async (req, res) => {
    const userId = req.user?._id || req.user?.userId || req.user?.id;

    new Created({
      message: "Tạo đánh giá thành công",
      metadata: await reviewService.createReview({
        userId,
        productId: req.body.productId,
        rating: req.body.rating,
        content: req.body.content,
      }),
    }).send(res);
  };

  getProductReviews = async (req, res) => {
    new OK({
      message: "Lấy đánh giá sản phẩm thành công",
      metadata: await reviewService.getProductReviews({
        productId: req.params.productId,
        page: req.query.page,
        limit: req.query.limit,
        rating: req.query.rating,
      }),
    }).send(res);
  };

  getMyReviews = async (req, res) => {
    const userId = req.user?._id || req.user?.userId || req.user?.id;

    new OK({
      message: "Lấy đánh giá của tôi thành công",
      metadata: await reviewService.getMyReviews({
        userId,
        page: req.query.page,
        limit: req.query.limit,
      }),
    }).send(res);
  };

  updateMyReview = async (req, res) => {
    const userId = req.user?._id || req.user?.userId || req.user?.id;

    new OK({
      message: "Cập nhật đánh giá thành công",
      metadata: await reviewService.updateMyReview({
        userId,
        reviewId: req.params.reviewId,
        rating: req.body.rating,
        content: req.body.content,
      }),
    }).send(res);
  };

  deleteMyReview = async (req, res) => {
    const userId = req.user?._id || req.user?.userId || req.user?.id;

    new OK({
      message: "Xóa đánh giá thành công",
      metadata: await reviewService.deleteMyReview({
        userId,
        reviewId: req.params.reviewId,
      }),
    }).send(res);
  };

  adminGetReviews = async (req, res) => {
    new OK({
      message: "Admin lấy danh sách đánh giá thành công",
      metadata: await reviewService.adminGetReviews({
        page: req.query.page,
        limit: req.query.limit,
        product: req.query.product,
        user: req.query.user,
        isApproved: req.query.isApproved,
        rating: req.query.rating,
      }),
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