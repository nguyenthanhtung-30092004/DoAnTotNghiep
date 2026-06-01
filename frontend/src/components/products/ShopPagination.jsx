import { ChevronLeft, ChevronRight } from "lucide-react";

const ShopPagination = ({ page, totalPages, onPageChange }) => {
  if (!totalPages || totalPages <= 1) return null;

  /* Tạo mảng số trang — hiện tối đa 7 nút (dấu ... nếu cần) */
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [];
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
      className="mt-16 flex flex-col items-center gap-6 border-t border-zinc-200 pt-10"
    >
      <div className="flex items-center justify-center gap-2">
        {/* Previous */}
        <button
          type="button"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="flex h-10 w-10 items-center justify-center border border-zinc-200 text-zinc-500 transition-all hover:border-zinc-950 hover:bg-zinc-950 hover:text-white disabled:pointer-events-none disabled:opacity-30"
          aria-label="Trang trước"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Page numbers */}
        {pageNumbers.map((p, i) =>
          p === "..." ? (
            <span
              key={`ellipsis-${i}`}
              className="flex h-10 w-10 items-center justify-center text-sm font-bold text-zinc-400"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              aria-current={p === page ? "page" : undefined}
              className={`flex h-10 w-10 items-center justify-center text-sm font-bold transition-all ${
                p === page
                  ? "border border-teal-600 bg-teal-600 text-white"
                  : "border border-transparent text-zinc-600 hover:border-zinc-200 hover:bg-zinc-50 hover:text-zinc-950"
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
          className="flex h-10 w-10 items-center justify-center border border-zinc-200 text-zinc-500 transition-all hover:border-zinc-950 hover:bg-zinc-950 hover:text-white disabled:pointer-events-none disabled:opacity-30"
          aria-label="Trang sau"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Page info */}
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
        Trang {page} / {totalPages}
      </span>
    </nav>
  );
};

export default ShopPagination;
