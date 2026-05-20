import { AlertTriangle, X } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";

const DeleteForm = ({ onClose, onConfirm, coupon }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await onConfirm();
      onClose();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Xóa mã giảm giá thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start gap-4 px-6 pt-6">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-red-50">
            <AlertTriangle className="size-6 text-red-600" />
          </div>

          <div className="pr-8">
            <h2 className="text-xl font-bold text-slate-900">
              Xóa mã giảm giá
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Bạn có chắc muốn xóa mã{" "}
              <span className="font-bold text-slate-900">“{coupon?.code}”</span>{" "}
              không?
            </p>
          </div>
        </div>

        <div className="mx-6 mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
          <p className="text-sm leading-6 text-red-600">
            Hành động này sẽ đánh dấu mã là đã xóa và tắt trạng thái hoạt động.
            Mã này sẽ không còn được sử dụng cho đơn hàng.
          </p>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-60"
          >
            Hủy
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="h-11 rounded-xl bg-red-600 px-6 text-sm font-semibold text-white shadow-sm hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? "Đang xóa..." : "Xóa mã"}
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:pointer-events-none"
        >
          <X className="size-5" />
        </button>
      </div>
    </div>
  );
};

export default DeleteForm;
