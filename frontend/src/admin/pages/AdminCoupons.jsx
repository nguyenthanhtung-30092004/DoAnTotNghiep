import { Copy, Plus, Trash2 } from "lucide-react";
import React from "react";

const AdminCoupons = () => {
  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mã giảm giá</h1>
          <p className="text-sm text-slate-500 mt-1">4 mã</p>
        </div>

        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 text-primary-foreground shadow-soft hover:shadow-card-hover h-10 px-5 py-2 bg-indigo-600 hover:bg-indigo-700">
          <Plus /> Tạo mã mới
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                <code className="text-lg font-bold font-mono text-indigo-600">
                  SUMMER25
                </code>

                <p className="text-slate-400 hover:text-indigo-600">
                  <Copy className="size-3.5" />
                </p>
              </div>

              <p className="text-2xl font-bold text-slate-900 mt-2">25%</p>
            </div>

            <button className="peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors">
              <span className="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform"></span>
            </button>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600 mb-4">
            <div className="flex justify-between">
              <span className="">Đơn tối thiểu:</span>
              <span className="font-medium text-slate-900">1.000.000 ₫</span>
            </div>

            <div className="flex justify-between">
              <span className="">Hết hạn:</span>
              <span className="font-medium text-slate-900">2026-08-31</span>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-600"></span>
              <span className="font-semibold text-slate-900">142/500</span>
            </div>

            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full"
                style={{ width: "28.4%" }}
              ></div>
            </div>
          </div>

          <button className="w-full text-xs font-medium text-slate-500 hover:text-red-600 flex items-center justify-center gap-1 py-1.5 rounded-md hover:bg-red-50">
            <Trash2 className="size-3.5" />
            Xóa mã
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                <code className="text-lg font-bold font-mono text-indigo-600">
                  FREESHIP
                </code>

                <p className="text-slate-400 hover:text-indigo-600">
                  <Copy className="size-3.5" />
                </p>
              </div>

              <p className="text-2xl font-bold text-slate-900 mt-2">50.000 ₫</p>
            </div>

            <button className="peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors">
              <span className="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform"></span>
            </button>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600 mb-4">
            <div className="flex justify-between">
              <span className="">Đơn tối thiểu:</span>
              <span className="font-medium text-slate-900">500.000 ₫</span>
            </div>

            <div className="flex justify-between">
              <span className="">Hết hạn:</span>
              <span className="font-medium text-slate-900">2026-12-31</span>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-600"></span>
              <span className="font-semibold text-slate-900">320/1000</span>
            </div>

            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full"
                style={{ width: "28.4%" }}
              ></div>
            </div>
          </div>

          <button className="w-full text-xs font-medium text-slate-500 hover:text-red-600 flex items-center justify-center gap-1 py-1.5 rounded-md hover:bg-red-50">
            <Trash2 className="size-3.5" />
            Xóa mã
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                <code className="text-lg font-bold font-mono text-indigo-600">
                  BLACKFRI
                </code>

                <p className="text-slate-400 hover:text-indigo-600">
                  <Copy className="size-3.5" />
                </p>
              </div>

              <p className="text-2xl font-bold text-slate-900 mt-2">40%</p>
            </div>

            <button className="peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors">
              <span className="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform"></span>
            </button>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600 mb-4">
            <div className="flex justify-between">
              <span className="">Đơn tối thiểu:</span>
              <span className="font-medium text-slate-900">2.000.000 ₫</span>
            </div>

            <div className="flex justify-between">
              <span className="">Hết hạn:</span>
              <span className="font-medium text-red-600">2025-11-30</span>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-600"></span>
              <span className="font-semibold text-slate-900">500/500</span>
            </div>

            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full"
                style={{ width: "100%" }}
              ></div>
            </div>
          </div>

          <button className="w-full text-xs font-medium text-slate-500 hover:text-red-600 flex items-center justify-center gap-1 py-1.5 rounded-md hover:bg-red-50">
            <Trash2 className="size-3.5" />
            Xóa mã
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminCoupons;
