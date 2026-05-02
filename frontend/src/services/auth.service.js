import axios from "axios";
import { API_LOGIN, API_LOGOUT, API_REGISTER } from "../utils/constants/api";

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

export default { login, logout };
