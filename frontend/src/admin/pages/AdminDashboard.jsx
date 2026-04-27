import React from "react";

const ranges = [
  {
    value: "7d",
    label: "7 ngày",
    value: "30d",
    label: "30 ngày",
    value: "90d",
    label: "90 ngày",
  },
];

const AdminDashboard = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Thống kê</h1>
          <p className="text-sm text-slate-500 mt-1">
            Tổng quan hoạt động kinh doanh
          </p>
        </div>
        <div className="flex bg-white border border-slate-200 rounded-lg p-1">
          <button className="px-4 py-1.5 text-sm font-medium rounded-md transition-colors text-slate-600 hover:text-slate-900">
            7 ngày
          </button>
          <button className="px-4 py-1.5 text-sm font-medium rounded-md transition-colors bg-indigo-600 text-white">
            30 ngày
          </button>
          <button className="px-4 py-1.5 text-sm font-medium rounded-md transition-colors text-slate-600 hover:text-slate-900">
            90 ngày
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>

      <div></div>
    </div>
  );
};

export default AdminDashboard;
