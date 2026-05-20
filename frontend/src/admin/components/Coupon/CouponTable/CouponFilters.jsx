import { RotateCcw, Search } from "lucide-react";
import React from "react";

const CouponFilters = ({
  filters,
  limit,
  onChangeFilter,
  onChangeLimit,
  onReset,
}) => {
  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr_1fr_1fr_auto_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

          <input
            value={filters.search}
            onChange={(e) => onChangeFilter("search", e.target.value)}
            placeholder="Tìm theo mã hoặc tên mã..."
            className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-4 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        <select
          value={filters.isActive}
          onChange={(e) => onChangeFilter("isActive", e.target.value)}
          className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="true">Đang hoạt động</option>
          <option value="false">Đã tắt</option>
        </select>

        <select
          value={filters.discountType}
          onChange={(e) => onChangeFilter("discountType", e.target.value)}
          className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
        >
          <option value="">Tất cả loại giảm</option>
          <option value="PERCENT">Phần trăm</option>
          <option value="FIXED">Số tiền cố định</option>
        </select>

        <select
          value={filters.applyTo}
          onChange={(e) => onChangeFilter("applyTo", e.target.value)}
          className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
        >
          <option value="">Tất cả phạm vi</option>
          <option value="ALL">Tất cả</option>
          <option value="CATEGORIES">Danh mục</option>
          <option value="BRANDS">Thương hiệu</option>
          <option value="PRODUCTS">Sản phẩm</option>
        </select>

        <select
          value={limit}
          onChange={(e) => onChangeLimit(Number(e.target.value))}
          className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
        >
          <option value={8}>8 / trang</option>
          <option value={12}>12 / trang</option>
          <option value={20}>20 / trang</option>
          <option value={50}>50 / trang</option>
        </select>

        <button
          onClick={onReset}
          className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          <RotateCcw className="size-4" />
          Reset
        </button>
      </div>
    </div>
  );
};

export default CouponFilters;
