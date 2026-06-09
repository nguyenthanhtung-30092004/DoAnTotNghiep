import React, { useState, useEffect } from "react";
import {
  DollarSign,
  ShoppingBag,
  TrendingDown,
  TrendingUp,
  Users,
  Package,
} from "lucide-react";

import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Legend,
  Cell,
} from "recharts";
import dashboardService from "../../services/dashboard.service";
import { toast } from "react-toastify";

const formatVND = (value) => {
  if (value === undefined || value === null) return "0 ₫";
  return value.toLocaleString("vi-VN") + " ₫";
};

const AdminDashboard = () => {
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    summary: {
      revenue: { total: 0, growth: 0 },
      orders: { total: 0, growth: 0 },
      customers: { total: 0, growth: 0 },
      products: { total: 0, growth: 0 },
    },
    charts: {
      revenueData: [],
      orderStatusData: [],
    },
  });

  useEffect(() => {
    fetchStats();
  }, [days]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await dashboardService.getStats({ days });
      if (res && (res.summary || res.metadata)) {
        setStats(res.summary ? res : res.metadata);
      }
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải dữ liệu thống kê");
    } finally {
      setLoading(false);
    }
  };

  const renderGrowth = (growth) => {
    if (growth > 0) {
      return (
        <div className="flex items-center gap-1 mt-3 text-xs">
          <TrendingUp className="text-emerald-600 size-4" strokeWidth={2.5} />
          <span className="text-emerald-600 font-semibold">+{growth}%</span>
          <span className="text-zinc-500 font-medium">kỳ trước</span>
        </div>
      );
    }
    if (growth < 0) {
      return (
        <div className="flex items-center gap-1 mt-3 text-xs">
          <TrendingDown className="text-rose-600 size-4" strokeWidth={2.5} />
          <span className="text-rose-600 font-semibold">{growth}%</span>
          <span className="text-zinc-500 font-medium">kỳ trước</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1 mt-3 text-xs">
        <span className="text-zinc-500 font-medium">
          Không đổi so với kỳ trước
        </span>
      </div>
    );
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500 px-2 sm:px-6 lg:px-8 py-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-4 border-b border-zinc-200">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
            Tổng quan
          </h1>
          <p className="text-sm text-zinc-500 mt-1.5 font-medium">
            Hiệu suất kinh doanh và đơn hàng của cửa hàng
          </p>
        </div>

        {/* TIME FILTER */}
        <div className="flex bg-zinc-100/80 p-1 rounded-md border border-zinc-200/50">
          {[
            { label: "7 ngày", value: 7 },
            { label: "30 ngày", value: 30 },
            { label: "90 ngày", value: 90 },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setDays(tab.value)}
              className={`px-4 py-1.5 text-sm font-medium rounded transition-all duration-200 ${
                days === tab.value
                  ? "bg-white text-zinc-950 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="size-8 border-2 border-zinc-200 border-t-zinc-800 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* STATS BENTO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* DOANH THU */}
            <div className="bg-white rounded-xl p-6 border border-zinc-200 shadow-sm relative overflow-hidden group">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-medium text-zinc-500 mb-2">
                    Doanh thu
                  </div>
                  <div className="text-2xl font-semibold text-zinc-900 tracking-tight">
                    {formatVND(stats.summary.revenue.total)}
                  </div>
                </div>
                <div className="size-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 transition-colors group-hover:bg-zinc-900 group-hover:text-white">
                  <DollarSign className="size-5" />
                </div>
              </div>
              {renderGrowth(stats.summary.revenue.growth)}
            </div>

            {/* ĐƠN HÀNG */}
            <div className="bg-white rounded-xl p-6 border border-zinc-200 shadow-sm relative overflow-hidden group">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-medium text-zinc-500 mb-2">
                    Đơn hàng
                  </div>
                  <div className="text-2xl font-semibold text-zinc-900 tracking-tight">
                    {stats.summary.orders.total.toLocaleString("vi-VN")}
                  </div>
                </div>
                <div className="size-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 transition-colors group-hover:bg-zinc-900 group-hover:text-white">
                  <ShoppingBag className="size-5" />
                </div>
              </div>
              {renderGrowth(stats.summary.orders.growth)}
            </div>

            {/* KHÁCH HÀNG */}
            <div className="bg-white rounded-xl p-6 border border-zinc-200 shadow-sm relative overflow-hidden group">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-medium text-zinc-500 mb-2">
                    Khách hàng mới
                  </div>
                  <div className="text-2xl font-semibold text-zinc-900 tracking-tight">
                    {stats.summary.customers.total.toLocaleString("vi-VN")}
                  </div>
                </div>
                <div className="size-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 transition-colors group-hover:bg-zinc-900 group-hover:text-white">
                  <Users className="size-5" />
                </div>
              </div>
              {renderGrowth(stats.summary.customers.growth)}
            </div>

            {/* SẢN PHẨM BÁN */}
            <div className="bg-white rounded-xl p-6 border border-zinc-200 shadow-sm relative overflow-hidden group">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-medium text-zinc-500 mb-2">
                    Sản phẩm đã bán
                  </div>
                  <div className="text-2xl font-semibold text-zinc-900 tracking-tight">
                    {stats.summary.products.total.toLocaleString("vi-VN")}
                  </div>
                </div>
                <div className="size-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 transition-colors group-hover:bg-zinc-900 group-hover:text-white">
                  <Package className="size-5" />
                </div>
              </div>
              {renderGrowth(stats.summary.products.growth)}
            </div>
          </div>

          {/* CHARTS BENTO */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* REVENUE LINE CHART */}
            <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-zinc-200 shadow-sm">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 tracking-tight">
                    Biểu đồ doanh thu
                  </h3>
                  <p className="text-sm text-zinc-500 font-medium mt-1">
                    Trong {days} ngày qua
                  </p>
                </div>
              </div>

              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={stats.charts.revenueData}
                    margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e4e4e7"
                    />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#71717a", fontSize: 12, fontWeight: 500 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#71717a", fontSize: 12, fontWeight: 500 }}
                      tickFormatter={(v) =>
                        v >= 1000000 ? `${(v / 1000000).toFixed(0)}M` : v
                      }
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow:
                          "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                      }}
                      formatter={(value, name) => [
                        name === "revenue" ? formatVND(value) : value,
                        name === "revenue" ? "Doanh thu" : "Đơn hàng",
                      ]}
                      labelStyle={{
                        fontWeight: 600,
                        color: "#18181b",
                        marginBottom: "4px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#09090b" // zinc-950 for pure aesthetic
                      strokeWidth={3}
                      dot={false}
                      activeDot={{
                        r: 6,
                        fill: "#09090b",
                        stroke: "#fff",
                        strokeWidth: 2,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ORDER STATUS PIE CHART */}
            <div className="bg-white rounded-xl p-6 border border-zinc-200 shadow-sm flex flex-col">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 tracking-tight">
                  Trạng thái đơn hàng
                </h3>
                <p className="text-sm text-zinc-500 font-medium mt-1">
                  Phân bổ theo số lượng
                </p>
              </div>

              <div className="flex-1 flex items-center justify-center h-[320px] mt-4">
                {stats.charts.orderStatusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.charts.orderStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        dataKey="value"
                        paddingAngle={4}
                        stroke="none"
                      >
                        {stats.charts.orderStatusData.map((entry, idx) => (
                          <Cell key={idx} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: "8px",
                          border: "none",
                          boxShadow:
                            "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                        }}
                        formatter={(value) => [`${value} đơn hàng`, ""]}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        wrapperStyle={{
                          fontSize: "13px",
                          fontWeight: 500,
                          color: "#52525b",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-zinc-400 text-sm font-medium">
                    Chưa có dữ liệu đơn hàng
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
