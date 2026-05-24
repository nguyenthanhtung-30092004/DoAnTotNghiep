import axios from "axios";
import { clearUser } from "../features/users/slice/authSlice";
import store from "../app/store";
import { API_BASE } from "../utils/constants/api";

let isRedirectingToLogin = false;

const axiosClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(clearUser());
      localStorage.removeItem("user");

      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login" &&
        !isRedirectingToLogin
      ) {
        isRedirectingToLogin = true;
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
