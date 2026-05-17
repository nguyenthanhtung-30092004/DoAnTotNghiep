import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AdminPagination = ({
  page = 1,
  totalPages = 1,
  total = 0,
  limit = 10,
  itemLabel,
  onPageChange,
  className = "",
}) => {
  if (total === 0) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div
      className={`flex flex-col gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <p className="text-sm text-slate-500">
        Hiển thị {start} - {end} trong {total} {itemLabel}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft className="size-4" />
          Trước
        </button>

        <span className="text-sm text-slate-600">
          Trang {page} / {totalPages}
        </span>

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Sau
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
};

export default AdminPagination;
