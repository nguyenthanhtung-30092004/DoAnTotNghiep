import axiosClient from "../../../services/axiosClient";
import {
  API_ADMIN_REVIEW_APPROVE,
  API_ADMIN_REVIEW_DETAIL,
  API_ADMIN_REVIEWS,
  API_MY_REVIEW_DETAIL,
  API_MY_REVIEWS,
  API_PRODUCT_REVIEWS,
  API_REVIEW_CREATE,
} from "../../../utils/constants/api";

const getProductReviews = (productId, params = {}) => {
  return axiosClient.get(API_PRODUCT_REVIEWS(productId), { params });
};

const createReview = (data) => {
  return axiosClient.post(API_REVIEW_CREATE, data);
};

const getMyReviews = (params = {}) => {
  return axiosClient.get(API_MY_REVIEWS, { params });
};

const updateMyReview = (reviewId, data) => {
  return axiosClient.patch(API_MY_REVIEW_DETAIL(reviewId), data);
};

const deleteMyReview = (reviewId) => {
  return axiosClient.delete(API_MY_REVIEW_DETAIL(reviewId));
};

const adminGetReviews = (params = {}) => {
  return axiosClient.get(API_ADMIN_REVIEWS, { params });
};

const adminApproveReview = (reviewId, isApproved) => {
  return axiosClient.patch(API_ADMIN_REVIEW_APPROVE(reviewId), {
    isApproved,
  });
};

const adminDeleteReview = (reviewId) => {
  return axiosClient.delete(API_ADMIN_REVIEW_DETAIL(reviewId));
};

const reviewService = {
  getProductReviews,
  createReview,
  getMyReviews,
  updateMyReview,
  deleteMyReview,
  adminGetReviews,
  adminApproveReview,
  adminDeleteReview,
};

export default reviewService;