import axios from "axios";
import { API_ADMIN_COUPON, API_COUPON } from "../utils/constants/api";

const axiosConfig = {
  withCredentials: true,
};

const getCoupons = (params = {}) => {
  return axios.get(API_ADMIN_COUPON, {
    ...axiosConfig,
    params,
  });
};

const getCouponDetail = (id) => {
  return axios.get(`${API_ADMIN_COUPON}/${id}`, axiosConfig);
};

const createCoupon = (data) => {
  return axios.post(API_ADMIN_COUPON, data, axiosConfig);
};

const updateCoupon = (id, data) => {
  return axios.patch(`${API_ADMIN_COUPON}/${id}`, data, axiosConfig);
};

const deleteCoupon = (id) => {
  return axios.delete(`${API_ADMIN_COUPON}/${id}`, axiosConfig);
};

const validateCoupon = (code) => {
  return axios.post(`${API_COUPON}/coupons/validate`, { code }, axiosConfig);
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
