const dashboardService = require("./dashboard.service");
const { OK } = require("../../core/success.response");

const getDashboardStats = async (req, res) => {
  const stats = await dashboardService.getStats(req.query);
  new OK({
    message: "Lấy thống kê thành công",
    metadata: stats,
  }).send(res);
};

module.exports = {
  getDashboardStats,
};
