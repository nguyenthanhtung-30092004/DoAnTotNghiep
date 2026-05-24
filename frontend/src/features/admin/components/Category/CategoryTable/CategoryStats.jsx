import React from "react";

const CategoryStats = ({ total = 0, root = 0, child = 0 }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mt-5">
      <StatCard label="Tổng danh mục" value={total} />
      <StatCard label="Danh mục gốc" value={root} />
      <StatCard label="Danh mục con" value={child} />
    </div>
  );
};

const StatCard = ({ label, value }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
};

export default CategoryStats;
