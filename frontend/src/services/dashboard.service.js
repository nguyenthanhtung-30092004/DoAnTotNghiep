import axiosClient from "./axiosClient";
import { API_DASHBOARD_STATS } from "../utils/constants/api";

const getStats = (params = { days: 30 }) => {
  return axiosClient.get(API_DASHBOARD_STATS, { params });
};

const dashboardService = {
  getStats,
};

export default dashboardService;
