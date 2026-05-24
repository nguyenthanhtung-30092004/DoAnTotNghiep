import { AlertTriangle, X } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";

const DeleteBrandForm = ({ onClose, onConfirm, brand }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);

      await onConfirm();

      toast.success("Xóa thương hiệu thành công");
      onClose();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Xóa thương hiệu thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Xóa thương hiệu</h2>

          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-500"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="p-5">
          <div className="flex gap-3">
            <div className="h-11 w-11 rounded-full bg-red-50 flex items-center justify-center shrink-0">
              <AlertTriangle className="size-6 text-red-600" />
            </div>

            <div>
              <p className="text-sm text-slate-700">
                Bạn có chắc chắn muốn xóa thương hiệu{" "}
                <span className="font-semibold text-slate-900">
                  {brand?.nameBrand}
                </span>
                ?
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Hành động này sẽ xóa thương hiệu khỏi hệ thống và không thể hoàn
                tác.
              </p>
            </div>
          </div>

          {brand?.logoBrand && (
            <div className="mt-4 flex items-center gap-3 rounded-lg border border-slate-200 p-3">
              <img
                src={brand.logoBrand}
                alt={brand.nameBrand}
                className="h-12 w-12 rounded-lg object-cover border border-slate-200"
              />

              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {brand.nameBrand}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {brand.slugBrand}
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="h-10 px-4 rounded-lg border border-slate-300 text-sm font-semibold hover:bg-slate-50 disabled:opacity-60"
            >
              Hủy
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="h-10 px-5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-60"
            >
              {loading ? "Đang xóa..." : "Xóa"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteBrandForm;
