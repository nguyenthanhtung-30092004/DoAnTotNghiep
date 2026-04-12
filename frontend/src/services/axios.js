import axios from "axios";
const instance = axios.create({
  baseURL: "http://localhost:3055/v1/api",
  withCredentials: true,
  headers: {
    Content_Type: "application/json",
    x_api_key:
      "f2bf5ef588db7a0b88cc75c9d8b945a605a9d9474ca8b6fc35a9fc5f8b5fead0201cc06bfd17c61a187f80c4f01cbbe7970271dcfdc20f375e8e107d8d06393a",
  },
});
instance.interceptors.request.use((config) => {
  const userId = localStorage.getItem("userId");
  if (userId) {
    config.headers["x_client_id"] = userId;
  }
  return config;
});

export default instance;
