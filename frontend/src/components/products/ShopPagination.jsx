import { ChevronLeft, ChevronRight } from "lucide-react";

const ShopPagination = ({ page, totalPages, onPageChange }) => {
  if (!totalPages || totalPages <= 1) return null;

  /* Tạo mảng số trang — hiện tối đa 7 nút (dấu ... nếu cần) */
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [];
    // Always show first, last, current, current±1
    const range = new Set([1, totalPages, page, page - 1, page + 1].filter(
      (p) => p >= 1 && p <= totalPages,
    ));
    const sorted = [...range].sort((a, b) => a - b);
    let prev = 0;
    for (const p of sorted) {
      if (p - prev > 1) pages.push("...");
      pages.push(p);
      prev = p;
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav
      aria-label="Phân trang"
      className="flex items-center justify-center gap-1.5 mt-12 pt-8 border-t border-border"
    >
      {/* Previous */}
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary disabled:pointer-events-none disabled:opacity-40"
        aria-label="Trang trước"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Page numbers */}
      {pageNumbers.map((p, i) =>
        p === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="flex h-9 w-9 items-center justify-center text-sm font-medium text-muted-foreground"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-semibold transition-all ${
              p === page
                ? "bg-primary text-primary-foreground shadow-sm ring-1 ring-primary/20"
                : "border border-border text-foreground hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
            }`}
          >
            {p}
          </button>
        ),
      )}

      {/* Next */}
      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary disabled:pointer-events-none disabled:opacity-40"
        aria-label="Trang sau"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Page info */}
      <span className="ml-3 text-xs font-medium text-muted-foreground hidden sm:block">
        Trang {page} / {totalPages}
      </span>
    </nav>
  );
};

export default ShopPagination;
