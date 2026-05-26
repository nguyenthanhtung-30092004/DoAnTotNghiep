import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";

const sortOptions = [
  { value: "newest", label: "Mới nhất" },
  { value: "oldest", label: "Cũ nhất" },
  { value: "price_asc", label: "Giá: Thấp → Cao" },
  { value: "price_desc", label: "Giá: Cao → Thấp" },
  { value: "name_asc", label: "Tên: A → Z" },
  { value: "name_desc", label: "Tên: Z → A" },
];

const ShopToolbar = ({
  sort,
  onSortChange,
  onOpenMobileMenu,
  showingProduct,
  totalProduct,
  gridView,
  onGridViewChange,
}) => {
  return (
    <div className="flex items-center justify-between gap-3 mb-6">
      {/* Left — mobile filter btn + count */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-all"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Bộ lọc
        </button>

        <p className="text-sm text-slate-500 hidden sm:block">
          <span className="font-semibold text-slate-800">{showingProduct}</span>
          {" / "}
          <span className="font-semibold text-slate-800">{totalProduct}</span>
          {" sản phẩm"}
        </p>
      </div>

      {/* Right — sort + grid toggle */}
      <div className="flex items-center gap-2">
        {/* Sort native select — works better than Radix on mobile */}
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="h-10 rounded-xl border border-slate-200 bg-white px-3 pr-8 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all appearance-none cursor-pointer"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 10px center",
          }}
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Grid view toggle — optional */}
        {onGridViewChange && (
          <div className="hidden sm:flex items-center rounded-xl border border-slate-200 bg-white overflow-hidden">
            <button
              type="button"
              onClick={() => onGridViewChange("grid")}
              className={`flex items-center justify-center h-10 w-10 transition-colors ${
                gridView === "grid"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
              aria-label="Dạng lưới"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onGridViewChange("list")}
              className={`flex items-center justify-center h-10 w-10 transition-colors ${
                gridView === "list"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
              aria-label="Dạng danh sách"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopToolbar;
