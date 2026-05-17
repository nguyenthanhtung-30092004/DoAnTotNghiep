import { AlertTriangle, ChevronDown, Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

const DeleteForm = ({ product, onClose, onConfirm }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await onConfirm();

      toast.success("Xóa sản phẩm thành công");
      onClose();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Xóa sản phẩm thất bại");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40">
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-white p-6 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="size-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
            <AlertTriangle className="size-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Xóa sản phẩm
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Bạn có chắc muốn xóa sản phẩm{" "}
              <span className="font-semibold text-slate-900">
                {product?.name}
              </span>{" "}
              không?
            </p>
            <p className="text-sm text-red-500 mt-2">
              Hành động này không thể hoàn tác.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="h-10 px-5 rounded-lg border text-sm font-semibold hover:bg-slate-100 disabled:opacity-60"
          >
            Hủy
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="h-10 px-5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? "Đang xóa..." : "Xóa"}
          </button>
        </div>

        <button
          onClick={onClose}
          disabled={loading}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-700"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
};

export default DeleteForm;
