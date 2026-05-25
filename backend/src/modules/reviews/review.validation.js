const mongoose = require("mongoose");

const createSchema = (validator) => ({
  validate(payload = {}) {
    const result = validator({
      body: payload.body || {},
      params: payload.params || {},
      query: payload.query || {},
    });

    if (result.error) {
      return {
        error: {
          message: result.error,
        },
      };
    }

    return {
      value: {
        ...payload,
        body: result.value?.body || payload.body,
        params: result.value?.params || payload.params,
      },
    };
  },
});

const isObjectId = (value) => mongoose.Types.ObjectId.isValid(String(value));

const normalizeReviewId = (params = {}) => {
  const reviewId = String(params.reviewId || "").trim();

  if (!reviewId || !isObjectId(reviewId)) {
    return {
      error: "Đánh giá không hợp lệ",
    };
  }

  return {
    value: {
      ...params,
      reviewId,
    },
  };
};

const productReviews = createSchema(({ params }) => {
  const productId = String(params.productId || "").trim();

  if (!productId || !isObjectId(productId)) {
    return {
      error: "Sản phẩm không hợp lệ",
    };
  }

  return {
    value: {
      params: {
        ...params,
        productId,
      },
    },
  };
});

const validateRating = (rating) => {
  const value = Number(rating);

  if (!Number.isInteger(value) || value < 1 || value > 5) {
    return {
      error: "Rating phải từ 1 đến 5",
    };
  }

  return {
    value,
  };
};

const validateContent = (content = "") => {
  const value = String(content || "").trim();

  if (value.length > 1000) {
    return {
      error: "Nội dung đánh giá không được vượt quá 1000 ký tự",
    };
  }

  return {
    value,
  };
};

const createReview = createSchema(({ body }) => {
  const productId = String(body.productId || "").trim();
  const ratingResult = validateRating(body.rating);
  const contentResult = validateContent(body.content);

  if (!productId || !isObjectId(productId)) {
    return {
      error: "Sản phẩm không hợp lệ",
    };
  }

  if (ratingResult.error) return ratingResult;
  if (contentResult.error) return contentResult;

  return {
    value: {
      body: {
        productId,
        rating: ratingResult.value,
        content: contentResult.value,
      },
    },
  };
});

const updateReview = createSchema(({ body, params }) => {
  const paramsResult = normalizeReviewId(params);
  const nextBody = {};

  if (paramsResult.error) return paramsResult;

  if (body.rating !== undefined) {
    const ratingResult = validateRating(body.rating);
    if (ratingResult.error) return ratingResult;
    nextBody.rating = ratingResult.value;
  }

  if (body.content !== undefined) {
    const contentResult = validateContent(body.content);
    if (contentResult.error) return contentResult;
    nextBody.content = contentResult.value;
  }

  return {
    value: {
      params: paramsResult.value,
      body: nextBody,
    },
  };
});

const reviewIdParam = createSchema(({ params }) => {
  const paramsResult = normalizeReviewId(params);
  if (paramsResult.error) return paramsResult;

  return {
    value: {
      params: paramsResult.value,
    },
  };
});

const approveReview = createSchema(({ body, params }) => {
  const paramsResult = normalizeReviewId(params);
  if (paramsResult.error) return paramsResult;

  return {
    value: {
      params: paramsResult.value,
      body: {
        isApproved: body.isApproved === true || body.isApproved === "true",
      },
    },
  };
});

module.exports = {
  productReviews,
  createReview,
  updateReview,
  reviewIdParam,
  approveReview,
};
