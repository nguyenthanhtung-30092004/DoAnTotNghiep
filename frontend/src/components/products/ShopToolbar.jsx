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
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 pb-6 mb-8">
      {/* Left — mobile filter btn + count */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden inline-flex items-center gap-2 border border-zinc-950 bg-white px-5 py-2.5 text-xs font-black uppercase tracking-wider text-zinc-950 transition-all hover:bg-zinc-950 hover:text-white"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Bộ lọc
        </button>

        <p className="hidden text-sm font-medium text-zinc-500 sm:block">
          Hiển thị <span className="font-bold text-zinc-950">{showingProduct}</span> trên tổng số{" "}
          <span className="font-bold text-zinc-950">{totalProduct}</span>
        </p>
      </div>

      {/* Right — sort + grid toggle */}
      <div className="flex items-center gap-4">
        {/* Sort select — Editorial style border-bottom */}
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="h-10 w-40 appearance-none border-0 border-b border-zinc-300 bg-transparent px-0 py-2 pr-8 text-xs font-black uppercase tracking-wider text-zinc-950 outline-none transition-all focus:border-zinc-950 focus:ring-0 cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right center",
            }}
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="font-sans font-medium capitalize">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Grid view toggle */}
        {onGridViewChange && (
          <div className="hidden sm:flex items-center gap-1">
            <button
              type="button"
              onClick={() => onGridViewChange("grid")}
              className={`flex h-10 w-10 items-center justify-center transition-colors ${
                gridView === "grid"
                  ? "text-teal-600"
                  : "text-zinc-400 hover:text-zinc-950"
              }`}
              aria-label="Dạng lưới"
            >
              <LayoutGrid className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => onGridViewChange("list")}
              className={`flex h-10 w-10 items-center justify-center transition-colors ${
                gridView === "list"
                  ? "text-teal-600"
                  : "text-zinc-400 hover:text-zinc-950"
              }`}
              aria-label="Dạng danh sách"
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopToolbar;
