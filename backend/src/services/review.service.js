const { BadRequestError, NotFoundError } = require("../core/error.response");

const reviewModel = require("../models/review.model");
const productModel = require("../models/product.model");
const orderModel = require("../models/order.model");

class ReviewService {
  async updateProductRating(productId) {
    const result = await reviewModel.aggregate([
      {
        $match: {
          product: productId,
          isDeleted: false,
          isApproved: true,
        },
      },
      {
        $group: {
          _id: "$product",
          ratingAverage: {
            $avg: "$rating",
          },
          ratingCount: {
            $sum: 1,
          },
        },
      },
    ]);

    const ratingAverage = result[0]?.ratingAverage || 0;
    const ratingCount = result[0]?.ratingCount || 0;

    await productModel.findByIdAndUpdate(productId, {
      ratingAverage: Number(ratingAverage.toFixed(1)),
      ratingCount,
    });
  }

  async createReview({ userId, productId, orderId, rating, content = "" }) {
    if (!productId || !orderId || !rating) {
      throw new BadRequestError("Thiếu thông tin đánh giá");
    }

    rating = Number(rating);

    if (rating < 1 || rating > 5) {
      throw new BadRequestError("Rating phải từ 1 đến 5");
    }

    const product = await productModel.findOne({
      _id: productId,
      isDeleted: false,
    });

    if (!product) {
      throw new NotFoundError("Sản phẩm không tồn tại");
    }

    const order = await orderModel.findOne({
      _id: orderId,
      user: userId,
      orderStatus: "DELIVERED",
    });

    if (!order) {
      throw new BadRequestError("Bạn chỉ được đánh giá đơn hàng đã giao");
    }

    const boughtProduct = order.items.some(
      (item) => item.product.toString() === productId,
    );

    if (!boughtProduct) {
      throw new BadRequestError("Bạn chưa mua sản phẩm này trong đơn hàng");
    }

    const existingReview = await reviewModel.findOne({
      user: userId,
      product: productId,
      order: orderId,
      isDeleted: false,
    });

    if (existingReview) {
      throw new BadRequestError("Bạn đã đánh giá sản phẩm này rồi");
    }

    const review = await reviewModel.create({
      user: userId,
      product: productId,
      order: orderId,
      rating,
      content,
    });

    await this.updateProductRating(product._id);

    return review;
  }

  async getProductReviews({ productId, page = 1, limit = 10, rating }) {
    page = Number(page);
    limit = Number(limit);

    if (page < 1 || limit < 1) {
      throw new BadRequestError("Page hoặc limit không hợp lệ");
    }

    const filter = {
      product: productId,
      isDeleted: false,
      isApproved: true,
    };

    if (rating) {
      filter.rating = Number(rating);
    }

    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      reviewModel
        .find(filter)
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      reviewModel.countDocuments(filter),
    ]);

    return {
      reviews,
      pagination: {
        currentPage: page,
        totalPage: Math.ceil(total / limit),
        totalReview: total,
        limit,
      },
    };
  }

  async getMyReviews({ userId, page = 1, limit = 10 }) {
    page = Number(page);
    limit = Number(limit);

    const skip = (page - 1) * limit;

    const filter = {
      user: userId,
      isDeleted: false,
    };

    const [reviews, total] = await Promise.all([
      reviewModel
        .find(filter)
        .populate("product", "name slug thumbnail ratingAverage ratingCount")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      reviewModel.countDocuments(filter),
    ]);

    return {
      reviews,
      pagination: {
        currentPage: page,
        totalPage: Math.ceil(total / limit),
        totalReview: total,
        limit,
      },
    };
  }

  async updateMyReview({ userId, reviewId, rating, content }) {
    const review = await reviewModel.findOne({
      _id: reviewId,
      user: userId,
      isDeleted: false,
    });

    if (!review) {
      throw new NotFoundError("Đánh giá không tồn tại");
    }

    if (rating !== undefined) {
      rating = Number(rating);

      if (rating < 1 || rating > 5) {
        throw new BadRequestError("Rating phải từ 1 đến 5");
      }

      review.rating = rating;
    }

    if (content !== undefined) {
      review.content = content;
    }

    await review.save();

    await this.updateProductRating(review.product);

    return review;
  }

  async deleteMyReview({ userId, reviewId }) {
    const review = await reviewModel.findOne({
      _id: reviewId,
      user: userId,
      isDeleted: false,
    });

    if (!review) {
      throw new NotFoundError("Đánh giá không tồn tại");
    }

    review.isDeleted = true;

    await review.save();

    await this.updateProductRating(review.product);

    return {
      id: reviewId,
    };
  }

  async adminGetReviews({
    page = 1,
    limit = 10,
    product,
    user,
    isApproved,
    rating,
  }) {
    page = Number(page);
    limit = Number(limit);

    const filter = {
      isDeleted: false,
    };

    if (product) filter.product = product;
    if (user) filter.user = user;
    if (rating) filter.rating = Number(rating);

    if (isApproved !== undefined) {
      filter.isApproved = isApproved === "true";
    }

    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      reviewModel
        .find(filter)
        .populate("user", "name email")
        .populate("product", "name slug thumbnail")
        .populate("order", "orderCode orderStatus")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      reviewModel.countDocuments(filter),
    ]);

    return {
      reviews,
      pagination: {
        currentPage: page,
        totalPage: Math.ceil(total / limit),
        totalReview: total,
        limit,
      },
    };
  }

  async adminApproveReview({ reviewId, isApproved }) {
    const review = await reviewModel.findOne({
      _id: reviewId,
      isDeleted: false,
    });

    if (!review) {
      throw new NotFoundError("Đánh giá không tồn tại");
    }

    review.isApproved = Boolean(isApproved);

    await review.save();

    await this.updateProductRating(review.product);

    return review;
  }

  async adminDeleteReview(reviewId) {
    const review = await reviewModel.findOne({
      _id: reviewId,
      isDeleted: false,
    });

    if (!review) {
      throw new NotFoundError("Đánh giá không tồn tại");
    }

    review.isDeleted = true;

    await review.save();

    await this.updateProductRating(review.product);

    return {
      id: reviewId,
    };
  }
}

module.exports = new ReviewService();
