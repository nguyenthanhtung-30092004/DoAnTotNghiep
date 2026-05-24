import axiosClient from "../../../services/axiosClient";
import { API_ADMIN_COUPON, API_COUPON } from "../../../utils/constants/api";

const getCoupons = (params = {}) => {
  return axiosClient.get(API_ADMIN_COUPON, { params });
};

const getCouponDetail = (id) => {
  return axiosClient.get(`${API_ADMIN_COUPON}/${id}`);
};

const createCoupon = (data) => {
  return axiosClient.post(API_ADMIN_COUPON, data);
};

const updateCoupon = (id, data) => {
  return axiosClient.patch(`${API_ADMIN_COUPON}/${id}`, data);
};

const deleteCoupon = (id) => {
  return axiosClient.delete(`${API_ADMIN_COUPON}/${id}`);
};

const validateCoupon = (code) => {
  return axiosClient.post(`${API_COUPON}/coupons/validate`, { code });
};

const couponService = {
  getCoupons,
  getCouponDetail,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
};

export default couponService;
