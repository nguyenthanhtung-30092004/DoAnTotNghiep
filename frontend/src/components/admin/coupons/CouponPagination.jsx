import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

const CouponPagination = ({ pagination, onPrev, onNext }) => {
  if (!pagination || pagination.totalPage <= 1) return null;

  return (
    <div className="mt-5 flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 sm:flex-row">
      <p className="text-sm text-slate-500">
        Trang{" "}
        <span className="font-bold text-slate-900">
          {pagination.currentPage}
        </span>{" "}
        /{" "}
        <span className="font-bold text-slate-900">{pagination.totalPage}</span>
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          disabled={pagination.currentPage <= 1}
          className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft className="size-4" />
          Trước
        </button>

        <button
          onClick={onNext}
          disabled={pagination.currentPage >= pagination.totalPage}
          className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Sau
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
};

export default CouponPagination;
