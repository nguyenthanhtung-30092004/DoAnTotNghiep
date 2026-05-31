import axios from "axios";
import { clearUser } from "../redux/slices/authSlice";
import store from "../redux/store";
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
        !window.location.pathname.startsWith("/cart") &&
        !window.location.pathname.startsWith("/checkout") &&
        !isRedirectingToLogin
      ) {
        isRedirectingToLogin = true;
        window.location.href = "/login";
        // Reset sau 3s để tránh flag bị kẹt nếu navigation thất bại
        setTimeout(() => {
          isRedirectingToLogin = false;
        }, 3000);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
