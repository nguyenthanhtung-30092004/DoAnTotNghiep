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
          className="lg:hidden inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all shadow-sm"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Bộ lọc
        </button>

        <p className="text-sm font-medium text-muted-foreground hidden sm:block">
          <span className="font-bold text-foreground">{showingProduct}</span>
          {" / "}
          <span className="font-bold text-foreground">{totalProduct}</span>
          {" sản phẩm"}
        </p>
      </div>

      {/* Right — sort + grid toggle */}
      <div className="flex items-center gap-2">
        {/* Sort native select — works better than Radix on mobile */}
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="h-10 rounded-xl border border-border bg-card px-3 pr-8 text-sm font-semibold text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer shadow-sm hover:border-primary/50"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
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
          <div className="hidden sm:flex items-center rounded-xl border border-border bg-card overflow-hidden shadow-sm">
            <button
              type="button"
              onClick={() => onGridViewChange("grid")}
              className={`flex items-center justify-center h-10 w-10 transition-colors ${
                gridView === "grid"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
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
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
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
