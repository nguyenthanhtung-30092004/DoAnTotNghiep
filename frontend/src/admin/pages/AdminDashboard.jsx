import React, { useMemo } from "react";
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

const revenueData = [
  { date: "01/04", revenue: 12000000, orders: 20 },
  { date: "02/04", revenue: 18000000, orders: 25 },
  { date: "03/04", revenue: 15000000, orders: 22 },
  { date: "04/04", revenue: 22000000, orders: 30 },
  { date: "05/04", revenue: 17000000, orders: 28 },
  { date: "06/04", revenue: 25000000, orders: 35 },
  { date: "07/04", revenue: 20000000, orders: 32 },
];

const orderStatusData = [
  { name: "Đã giao", value: 400, color: "#4f46e5" },
  { name: "Đang xử lý", value: 300, color: "#3b82f6" },
  { name: "Đã hủy", value: 100, color: "#ef4444" },
];

const formatVND = (value) => value.toLocaleString("vi-VN") + " ₫";

const AdminDashboard = () => {
  const data = useMemo(() => {
    return revenueData;
  }, []);

  const totalRevenue = data.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = data.reduce((s, d) => s + d.orders, 0);

  return (
    <div className="space-y-6 w-full">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Thống kê</h1>
          <p className="text-sm text-slate-500 mt-1">
            Tổng quan hoạt động kinh doanh
          </p>
        </div>

        <div className="flex bg-white border border-slate-200 rounded-lg p-1">
          <button className="px-4 py-1.5 text-sm font-medium text-slate-600">
            7 ngày
          </button>
          <button className="px-4 py-1.5 text-sm font-medium bg-indigo-600 text-white rounded-md">
            30 ngày
          </button>
          <button className="px-4 py-1.5 text-sm font-medium text-slate-600">
            90 ngày
          </button>
        </div>
      </div>

      {/* STAT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* DOANH THU */}
        <div className="bg-white rounded-xl p-5 border">
          <div className="flex justify-between">
            <div>
              <div className="text-sm text-slate-500">Doanh thu</div>
              <div className="text-2xl font-bold mt-1">
                {formatVND(totalRevenue)}
              </div>
            </div>
            <div className="size-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <DollarSign className="text-white size-5" />
            </div>
          </div>

          <div className="flex items-center gap-1 mt-3 text-xs">
            <TrendingUp className="text-emerald-600 size-3.5" />
            <span className="text-emerald-600 font-semibold">+12.5%</span>
            <span className="text-slate-500">so với kỳ trước</span>
          </div>
        </div>

        {/* ORDERS */}
        <div className="bg-white rounded-xl p-5 border">
          <div className="flex justify-between">
            <div>
              <div className="text-sm text-slate-500">Đơn hàng</div>
              <div className="text-2xl font-bold mt-1">{totalOrders}</div>
            </div>
            <div className="size-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <ShoppingBag className="text-white size-5" />
            </div>
          </div>

          <div className="flex items-center gap-1 mt-3 text-xs">
            <TrendingUp className="text-emerald-600 size-3.5" />
            <span className="text-emerald-600 font-semibold">+8.2%</span>
            <span className="text-slate-500">so với kỳ trước</span>
          </div>
        </div>

        {/* USERS */}
        <div className="bg-white rounded-xl p-5 border">
          <div className="flex justify-between">
            <div>
              <div className="text-sm text-slate-500">Khách hàng mới</div>
              <div className="text-2xl font-bold mt-1">124</div>
            </div>
            <div className="size-10 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Users className="text-white size-5" />
            </div>
          </div>

          <div className="flex items-center gap-1 mt-3 text-xs">
            <TrendingDown className="text-red-600 size-3.5" />
            <span className="text-red-600 font-semibold">-3.1%</span>
            <span className="text-slate-500">so với kỳ trước</span>
          </div>
        </div>

        {/* PRODUCTS */}
        <div className="bg-white rounded-xl p-5 border">
          <div className="flex justify-between">
            <div>
              <div className="text-sm text-slate-500">Sản phẩm bán</div>
              <div className="text-2xl font-bold mt-1">892</div>
            </div>
            <div className="size-10 bg-amber-600 rounded-lg flex items-center justify-center">
              <Package className="text-white size-5" />
            </div>
          </div>

          <div className="flex items-center gap-1 mt-3 text-xs">
            <TrendingUp className="text-emerald-600 size-3.5" />
            <span className="text-emerald-600 font-semibold">+15.7%</span>
            <span className="text-slate-500">so với kỳ trước</span>
          </div>
        </div>
      </div>

      {/* CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex justify-between mb-4">
            <h3 className="font-semibold">Doanh thu theo ngày</h3>
            <span className="text-xs text-slate-500">VNĐ</span>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="date" />

              <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />

              <Tooltip formatter={(v) => formatVND(v)} />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#4f46e5"
                strokeWidth={2.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="font-semibold text-slate-900 mb-4">
            Trạng thái đơn hàng
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                dataKey="value"
                paddingAngle={2}
              >
                {orderStatusData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: "12px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
