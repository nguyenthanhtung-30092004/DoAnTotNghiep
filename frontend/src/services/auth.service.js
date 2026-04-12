import instance from "./axios";
import {
  API_LOGIN,
  API_LOGOUT,
  API_REFRESH_TOKEN,
  API_SIGNUP,
} from "../utils/constants/api";

const authService = {
  signUp: async (userData) => {
    const res = await instance.post(API_SIGNUP, userData);
    return res.data;
  },
  login: async (credentials) => {
    const res = await instance.post(API_LOGIN, credentials);
    console.log(res.data);
    return res.data;
  },
  logout: async () => {
    const res = await instance.post(API_LOGOUT);
    console.log(res.data);
    return res.data;
  },
  refreshToken: async () => {
    const res = await instance.post(API_REFRESH_TOKEN);
    return res.data;
  },
};
export default authService;
