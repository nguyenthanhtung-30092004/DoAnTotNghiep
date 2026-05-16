import React from "react";
import { Search, X } from "lucide-react";

const CategoryFilters = ({
  filters,
  limit,
  onChangeFilter,
  onChangeLimit,
  onReset,
}) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 mt-5">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_200px_160px_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

          <input
            value={filters.keyword}
            onChange={(e) => onChangeFilter("keyword", e.target.value)}
            placeholder="Tìm danh mục..."
            className="h-10 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-indigo-500"
          />
        </div>

        <select
          value={filters.type}
          onChange={(e) => onChangeFilter("type", e.target.value)}
          className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500"
        >
          <option value="">Tất cả</option>
          <option value="root">Danh mục gốc</option>
          <option value="child">Danh mục con</option>
        </select>

        <select
          value={limit}
          onChange={(e) => onChangeLimit(Number(e.target.value))}
          className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500"
        >
          <option value={5}>5 dòng</option>
          <option value={10}>10 dòng</option>
          <option value={20}>20 dòng</option>
          <option value={50}>50 dòng</option>
        </select>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <X className="size-4" />
          Xóa lọc
        </button>
      </div>
    </div>
  );
};

export default CategoryFilters;
