import axios from "axios";

const authService = {
  signUp: async (userData) => {
    return await axios.post("/user/signup", userData);
  },
  login: async (credentials) => {
    return await axios.post("/user/login", credentials);
  },
  logout: async () => {
    return await axios.post("/user/logout");
  },
  refreshToken: async () => {
    return await axios.post("/user/refresh-token");
  },
};
export default authService;
