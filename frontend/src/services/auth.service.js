import axiosClient from "./axiosClient";
import {
  API_FORGOT_PASSWORD,
  API_AUTH,
  API_LOGIN,
  API_LOGOUT,
  API_REGISTER,
  API_RESET_PASSWORD,
  API_VERIFY_OTP,
} from "../utils/constants/api";

const login = (data) => {
  return axiosClient.post(API_LOGIN, data);
};

const logout = () => {
  return axiosClient.post(API_LOGOUT, null);
};

const me = () => {
  return axiosClient.get(`${API_AUTH}/me`);
};

const register = (data) => {
  return axiosClient.post(API_REGISTER, data);
};

const forgotPassword = (data) => {
  return axiosClient.post(API_FORGOT_PASSWORD, data);
};

const verifyOtp = (data) => {
  return axiosClient.post(API_VERIFY_OTP, data);
};

const resetPassword = (data) => {
  return axiosClient.post(API_RESET_PASSWORD, data);
};

export default {
  login,
  logout,
  me,
  register,
  forgotPassword,
  verifyOtp,
  resetPassword,
};
