import axios from "axios";
import {
  API_FORGOT_PASSWORD,
  API_LOGIN,
  API_LOGOUT,
  API_REGISTER,
  API_RESET_PASSWORD,
  API_VERIFY_OTP,
} from "../utils/constants/api";

const login = (data) => {
  return axios.post(API_LOGIN, data, { withCredentials: true });
};

const logout = () => {
  return axios.post(API_LOGOUT, null, {
    withCredentials: true,
  });
};

const register = (data) => {
  return axios.post(API_REGISTER, data, {
    withCredentials: true,
  });
};

const forgotPassword = (data) => {
  return axios.post(API_FORGOT_PASSWORD, data, {
    withCredentials: true,
  });
};

const verifyOtp = (data) => {
  return axios.post(API_VERIFY_OTP, data, {
    withCredentials: true,
  });
};

const resetPassword = (data) => {
  return axios.post(API_RESET_PASSWORD, data, {
    withCredentials: true,
  });
};

export default {
  login,
  logout,
  register,
  forgotPassword,
  verifyOtp,
  resetPassword,
};
