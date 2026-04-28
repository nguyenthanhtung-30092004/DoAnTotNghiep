import { ChevronDown, Plus, X } from "lucide-react";

const DeleteForm = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40">
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col space-y-2 text-center sm:text-left">
          <h2 className="text-lg font-semibold">Xóa sản phẩm</h2>
          <p className="text-sm text-muted-foreground">
            Hành động này không thể hoàn tác.
          </p>
        </div>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-5 py-2"
          >
            Hủy
          </button>
          <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 shadow-soft hover:shadow-card-hover h-10 px-5 py-2 bg-red-600 hover:bg-red-700 text-white">
            xóa
          </button>
        </div>
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity data-[state=open]:bg-accent data-[state=open]:text-muted-foreground hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
          <X className="size-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </div>
  );
};

export default DeleteForm;
