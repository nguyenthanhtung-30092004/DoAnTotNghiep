import React from "react";
import { Search, X } from "lucide-react";

const ProductFilters = ({
  filters,
  brands = [],
  categories = [],
  limit,
  onChangeFilter,
  onChangeLimit,
  onReset,
}) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 mt-5">
      <div className="space-y-3">
        {/* Hàng 1 */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_220px_220px_180px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

            <input
              value={filters.search}
              onChange={(e) => onChangeFilter("search", e.target.value)}
              placeholder="Tìm sản phẩm..."
              className="h-10 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={filters.brand}
            onChange={(e) => onChangeFilter("brand", e.target.value)}
            className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500"
          >
            <option value="">Tất cả thương hiệu</option>
            {brands.map((brand) => (
              <option key={brand._id} value={brand._id}>
                {brand.nameBrand || brand.name}
              </option>
            ))}
          </select>

          <select
            value={filters.category}
            onChange={(e) => onChangeFilter("category", e.target.value)}
            className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={limit}
            onChange={(e) => onChangeLimit(Number(e.target.value))}
            className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500"
          >
            <option value={8}>8 sản phẩm</option>
            <option value={12}>12 sản phẩm</option>
            <option value={16}>16 sản phẩm</option>
            <option value={20}>20 sản phẩm</option>
          </select>
        </div>

        {/* Hàng 2 */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[180px_180px_260px_auto]">
          <input
            type="number"
            value={filters.minPrice}
            onChange={(e) => onChangeFilter("minPrice", e.target.value)}
            placeholder="Giá từ"
            className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500"
          />

          <input
            type="number"
            value={filters.maxPrice}
            onChange={(e) => onChangeFilter("maxPrice", e.target.value)}
            placeholder="Giá đến"
            className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500"
          />

          <select
            value={filters.sort}
            onChange={(e) => onChangeFilter("sort", e.target.value)}
            className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500"
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="price_asc">Giá tăng dần</option>
            <option value="price_desc">Giá giảm dần</option>
            <option value="name_asc">Tên A-Z</option>
            <option value="name_desc">Tên Z-A</option>
            <option value="best_selling">Bán chạy nhất</option>
            <option value="stock_desc">Tồn kho giảm dần</option>
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
    </div>
  );
};

export default ProductFilters;
