import {
  Check,
  Search,
  SlidersHorizontal,
  Star,
  Trash2,
  X,
} from "lucide-react";
import React from "react";

const AdminReviews = () => {
  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Đánh giá</h1>

          <p className="text-sm text-slate-500 mt-1">10 đánh giá tổng cộng</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button className="inline-flex items-center gap-2 px-3.5 h-9 rounded-lg text-sm font-semibold border transition-colors bg-indigo-600 text-white border-indigo-600">
          Tất cả
          <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-white/20 text-white">
            10
          </span>
        </button>

        <button className="inline-flex items-center gap-2 px-3.5 h-9 rounded-lg text-sm font-semibold border transition-colors bg-white text-slate-600 border-slate-200 hover:border-indigo-300">
          Chờ duyệt
          <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-slate-100 text-slate-600">
            3
          </span>
        </button>

        <button className="inline-flex items-center gap-2 px-3.5 h-9 rounded-lg text-sm font-semibold border transition-colors bg-white text-slate-600 border-slate-200 hover:border-indigo-300">
          Đã duyệt
          <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-slate-100 text-slate-600">
            5
          </span>
        </button>

        <button className="inline-flex items-center gap-2 px-3.5 h-9 rounded-lg text-sm font-semibold border transition-colors bg-white text-slate-600 border-slate-200 hover:border-indigo-300">
          Từ chối
          <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-slate-100 text-slate-600">
            2
          </span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="Tìm theo nội dung, khách hàng, sản phẩm..."
            />
          </div>
          <select className="h-10 px-3 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:border-indigo-500">
            <option value="all">Tất cả sản phẩm</option>
            <option value="AeroFlex Shorts">AeroFlex Shorts</option>
            <option value="Featherlight Tee">Featherlight Tee</option>
            <option value="GripSocks Pro">GripSocks Pro</option>
            <option value="RunVault Pulse Pro">RunVault Pulse Pro</option>
            <option value="Trail Storm X">Trail Storm X</option>
          </select>
          <select className="h-10 px-3 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:border-indigo-500">
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="highest">Sao cao nhất</option>
            <option value="lowest">Sao thấp nhất</option>
          </select>
        </div>

        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 flex-wrap">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider inline-flex items-center gap-1">
            <SlidersHorizontal className="size-3.5" />
            Sao:
          </span>
          <button className="inline-flex items-center gap-1 h-8 px-3 rounded-full text-xs font-semibold border transition-colors bg-white border-slate-200 text-slate-600 hover:border-amber-300">
            5 <Star className="size-3 text-slate-400" />
          </button>
          <button className="inline-flex items-center gap-1 h-8 px-3 rounded-full text-xs font-semibold border transition-colors bg-white border-slate-200 text-slate-600 hover:border-amber-300">
            4 <Star className="size-3 text-slate-400" />
          </button>
          <button className="inline-flex items-center gap-1 h-8 px-3 rounded-full text-xs font-semibold border transition-colors bg-white border-slate-200 text-slate-600 hover:border-amber-300">
            3 <Star className="size-3 text-slate-400" />
          </button>
          <button className="inline-flex items-center gap-1 h-8 px-3 rounded-full text-xs font-semibold border transition-colors bg-white border-slate-200 text-slate-600 hover:border-amber-300">
            2 <Star className="size-3 text-slate-400" />
          </button>
          <button className="inline-flex items-center gap-1 h-8 px-3 rounded-full text-xs font-semibold border transition-colors bg-white border-slate-200 text-slate-600 hover:border-amber-300">
            1 <Star className="size-3 text-slate-400" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-slate-600">
          Hiển thị
          <span className="font-bold text-slate-900"> 10</span>/ 10 đánh giá
        </p>
      </div>

      <div className="space-y-3">
        <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-sm transition-shadow">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <p className="font-semibold text-slate-900">Trịnh Mai Anh</p>
                <span className="text-slate-300">•</span>
                <p className="text-sm text-slate-600">RunVault Pulse Pro</p>
                <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-emerald-100 text-emerald-700">
                  Đã duyệt
                </span>
              </div>

              <div className="flex items-center gap-1 mb-2">
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs text-slate-500 ml-2">2026-04-26</span>
              </div>

              <p className="text-sm text-slate-700">
                Đã mua lần 2, vẫn rất tốt
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <button
                className="h-8 w-8 rounded-md bg-slate-50 text-slate-600 hover:bg-slate-100 flex items-center justify-center"
                title="Từ chối"
              >
                <X className="size-4" />
              </button>

              <button
                className="h-8 w-8 rounded-md hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-slate-500"
                title="Xóa"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-sm transition-shadow">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <p className="font-semibold text-slate-900">Hoàng Thị Lan</p>
                <span className="text-slate-300">•</span>
                <p className="text-sm text-slate-600">GripSocks Pro</p>
                <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-amber-100 text-amber-700">
                  Chờ duyệt
                </span>
              </div>

              <div className="flex items-center gap-1 mb-2">
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs text-slate-500 ml-2">2026-04-25</span>
              </div>

              <p className="text-sm text-slate-700">Ổn trong tầm giá</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <button className="h-8 w-8 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center justify-center">
                <Check className="size-4" />
              </button>

              <button
                className="h-8 w-8 rounded-md bg-slate-50 text-slate-600 hover:bg-slate-100 flex items-center justify-center"
                title="Từ chối"
              >
                <X className="size-4" />
              </button>

              <button
                className="h-8 w-8 rounded-md hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-slate-500"
                title="Xóa"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-sm transition-shadow">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <p className="font-semibold text-slate-900">
                  RunVault Pulse Pro
                </p>
                <span className="text-slate-300">•</span>
                <p className="text-sm text-slate-600">GripSocks Pro</p>
                <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-red-100 text-red-700">
                  Từ chối
                </span>
              </div>

              <div className="flex items-center gap-1 mb-2">
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                <Star className="size-3.5 text-slate-300" />
                <Star className="size-3.5 text-slate-300" />
                <Star className="size-3.5 text-slate-300" />
                <Star className="size-3.5 text-slate-300" />
                <span className="text-xs text-slate-500 ml-2">2026-04-15</span>
              </div>

              <p className="text-sm text-slate-700">
                Đế bong sau 2 tuần, rất thất vọng
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <button className="h-8 w-8 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center justify-center">
                <Check className="size-4" />
              </button>

              <button
                className="h-8 w-8 rounded-md hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-slate-500"
                title="Xóa"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReviews;
