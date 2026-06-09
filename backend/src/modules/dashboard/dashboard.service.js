const Order = require("../../models/order.model");
const User = require("../../models/user.model");
const Product = require("../../models/product.model");

const getStats = async (query) => {
  const days = parseInt(query.days) || 30;
  
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);
  
  const prevEndDate = new Date(startDate);
  const prevStartDate = new Date(startDate);
  prevStartDate.setDate(prevStartDate.getDate() - days);

  const formatPercentage = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Number((((current - previous) / previous) * 100).toFixed(1));
  };

  // REVENUE (Delivered orders)
  const currentRevenueAggr = await Order.aggregate([
    { $match: { orderStatus: "DELIVERED", createdAt: { $gte: startDate, $lte: endDate } } },
    { $group: { _id: null, total: { $sum: "$finalPrice" } } }
  ]);
  const prevRevenueAggr = await Order.aggregate([
    { $match: { orderStatus: "DELIVERED", createdAt: { $gte: prevStartDate, $lte: prevEndDate } } },
    { $group: { _id: null, total: { $sum: "$finalPrice" } } }
  ]);
  
  const totalRevenue = currentRevenueAggr[0]?.total || 0;
  const prevRevenue = prevRevenueAggr[0]?.total || 0;
  const revenueGrowth = formatPercentage(totalRevenue, prevRevenue);

  // ORDERS
  const totalOrders = await Order.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } });
  const prevOrders = await Order.countDocuments({ createdAt: { $gte: prevStartDate, $lte: prevEndDate } });
  const ordersGrowth = formatPercentage(totalOrders, prevOrders);

  // USERS
  const newCustomers = await User.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } });
  const prevCustomers = await User.countDocuments({ createdAt: { $gte: prevStartDate, $lte: prevEndDate } });
  const customersGrowth = formatPercentage(newCustomers, prevCustomers);

  // PRODUCTS SOLD
  const currentProductsAggr = await Order.aggregate([
    { $match: { orderStatus: "DELIVERED", createdAt: { $gte: startDate, $lte: endDate } } },
    { $unwind: "$items" },
    { $group: { _id: null, total: { $sum: "$items.quantity" } } }
  ]);
  const prevProductsAggr = await Order.aggregate([
    { $match: { orderStatus: "DELIVERED", createdAt: { $gte: prevStartDate, $lte: prevEndDate } } },
    { $unwind: "$items" },
    { $group: { _id: null, total: { $sum: "$items.quantity" } } }
  ]);
  
  const soldProducts = currentProductsAggr[0]?.total || 0;
  const prevProducts = prevProductsAggr[0]?.total || 0;
  const productsGrowth = formatPercentage(soldProducts, prevProducts);

  // REVENUE CHART DATA (Daily)
  const dailyRevenue = await Order.aggregate([
    { $match: { orderStatus: "DELIVERED", createdAt: { $gte: startDate, $lte: endDate } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "Asia/Ho_Chi_Minh" } },
        revenue: { $sum: "$finalPrice" },
        orders: { $sum: 1 }
      }
    },
    { $sort: { "_id": 1 } }
  ]);

  // Fill missing dates
  const revenueData = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i + 1); // +1 because we go up to endDate
    const dateString = d.toLocaleDateString("en-CA", { timeZone: "Asia/Ho_Chi_Minh" }); // YYYY-MM-DD
    
    // Convert YYYY-MM-DD to DD/MM
    const [year, month, day] = dateString.split('-');
    const displayDate = `${day}/${month}`;
    
    const dayData = dailyRevenue.find(r => r._id === dateString);
    revenueData.push({
      date: displayDate,
      fullDate: dateString,
      revenue: dayData ? dayData.revenue : 0,
      orders: dayData ? dayData.orders : 0
    });
  }

  // ORDER STATUS DATA
  const orderStatusAggr = await Order.aggregate([
    { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
    { $group: { _id: "$orderStatus", count: { $sum: 1 } } }
  ]);

  const statusMap = {
    "PENDING": { name: "Chờ xác nhận", color: "#f59e0b" },
    "CONFIRMED": { name: "Đã xác nhận", color: "#3b82f6" },
    "PROCESSING": { name: "Đang xử lý", color: "#6366f1" },
    "SHIPPING": { name: "Đang giao", color: "#0ea5e9" },
    "DELIVERED": { name: "Đã giao", color: "#10b981" },
    "CANCELLED": { name: "Đã hủy", color: "#ef4444" },
    "RETURNED": { name: "Hoàn trả", color: "#8b5cf6" },
  };

  const orderStatusData = orderStatusAggr.map(item => ({
    name: statusMap[item._id]?.name || item._id,
    value: item.count,
    color: statusMap[item._id]?.color || "#cbd5e1"
  }));

  return {
    summary: {
      revenue: { total: totalRevenue, growth: revenueGrowth },
      orders: { total: totalOrders, growth: ordersGrowth },
      customers: { total: newCustomers, growth: customersGrowth },
      products: { total: soldProducts, growth: productsGrowth }
    },
    charts: {
      revenueData,
      orderStatusData
    }
  };
};

module.exports = {
  getStats
};
