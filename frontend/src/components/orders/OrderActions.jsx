import React from 'react';
import { MessageCircle, RotateCcw, XCircle } from "lucide-react";

const OrderActions = ({ canCancel, isCancelling, handleCancelOrder }) => {
  return (
    <div className="space-y-4 border border-zinc-200 bg-white p-8">
      <h2 className="mb-4 text-[11px] font-black uppercase tracking-[0.15em] text-zinc-950">
        Thao tác
      </h2>

      <button className="inline-flex h-12 w-full items-center justify-center gap-2 border border-zinc-200 bg-zinc-50 px-5 text-[10px] font-black uppercase tracking-[0.1em] text-zinc-950 transition-all duration-200 hover:bg-white hover:border-zinc-300">
        <RotateCcw className="size-4" />
        Đặt lại
      </button>

      {canCancel && (
        <button
          onClick={handleCancelOrder}
          disabled={isCancelling}
          className="inline-flex h-12 w-full items-center justify-center gap-2 border border-red-200 bg-red-50 px-5 text-[10px] font-black uppercase tracking-[0.1em] text-red-600 transition-all duration-200 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <XCircle className="size-4" />
          {isCancelling ? "Đang hủy..." : "Hủy đơn hàng"}
        </button>
      )}

      <button className="inline-flex h-12 w-full items-center justify-center gap-2 bg-zinc-950 px-5 text-[10px] font-black uppercase tracking-[0.1em] text-white transition-all duration-200 hover:bg-teal-600">
        <MessageCircle className="size-4" />
        Liên hệ hỗ trợ
      </button>
    </div>
  );
};

export default OrderActions;
