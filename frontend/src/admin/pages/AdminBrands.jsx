import { Globe, Pencil, Plus, Search, Star, Trash } from "lucide-react";
import React from "react";

const AdminBrands = () => {
  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="">
          <h1 className="text-2xl font-bold text-slate-900">Thương hiệu</h1>
          <p className="text-sm text-slate-500 mt-1">
            5 thương hiệu đang quản lý
          </p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.97] text-primary-foreground shadow-soft hover:shadow-card-hover h-10 px-5 py-2 bg-indigo-600 hover:bg-indigo-700">
          <Plus className="size-4" /> Thêm thương hiệu
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-5">
        <div className="relative max-w-sm">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-9"
            placeholder="Tìm theo tên hoặc quốc gia..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 hover:border-indigo-300 hover:shadow-sm transition-all flex flex-col">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center text-2xl">
                🏃
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-slate-900">RunVault</h3>
                  <Star className="size-3.5 fill-amber-400 text-amber-400" />
                </div>

                <p className="text-xs text-slate-500">Việt Nam</p>
              </div>
            </div>

            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold">
              2 SP
            </span>
          </div>

          <p className="text-sm text-slate-600 mb-4 line-clamp-2 min-h-[2.5rem]">
            Thương hiệu giày chạy bộ nội địa cao cấp
          </p>

          <a
            href=""
            className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline mb-3 truncate"
          >
            <Globe className="size-3 shrink-0" />
            <span className="truncate">Runvailt.com</span>
          </a>
          <div className="flex items-center justify-between pt-3 mt-auto border-t border-slate-100">
            <span className="text-xs text-slate-400">Tạo 2025-01-10</span>
            <div className="flex gap-1">
              <button className="h-8 w-8 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-600">
                <Pencil className="size-4" />
              </button>
              <button className="h-8 w-8 rounded-md hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-slate-600">
                <Trash className="size-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 hover:border-indigo-300 hover:shadow-sm transition-all flex flex-col">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center text-2xl">
                ⛰️
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-slate-900">TrailMaster</h3>
                  <Star className="size-3.5 fill-amber-400 text-amber-400" />
                </div>

                <p className="text-xs text-slate-500">Hoa Kỳ</p>
              </div>
            </div>

            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold">
              1 SP
            </span>
          </div>

          <p className="text-sm text-slate-600 mb-4 line-clamp-2 min-h-[2.5rem]">
            Chuyên giày và thiết bị địa hình
          </p>

          <a
            href=""
            className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline mb-3 truncate"
          >
            <Globe className="size-3 shrink-0" />
            <span className="truncate">trailmaster.com</span>
          </a>
          <div className="flex items-center justify-between pt-3 mt-auto border-t border-slate-100">
            <span className="text-xs text-slate-400">Tạo 2025-02-04</span>
            <div className="flex gap-1">
              <button className="h-8 w-8 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-600">
                <Pencil className="size-4" />
              </button>
              <button className="h-8 w-8 rounded-md hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-slate-600">
                <Trash className="size-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 hover:border-indigo-300 hover:shadow-sm transition-all flex flex-col">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center text-2xl">
                🪶
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-slate-900">Featherlight</h3>
                  <Star className="size-3.5 fill-amber-400 text-amber-400" />
                </div>

                <p className="text-xs text-slate-500">Nhật Bản</p>
              </div>
            </div>

            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold">
              2 SP
            </span>
          </div>

          <p className="text-sm text-slate-600 mb-4 line-clamp-2 min-h-[2.5rem]">
            Trang phục siêu nhẹ cho runner
          </p>

          <a
            href=""
            className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline mb-3 truncate"
          >
            <Globe className="size-3 shrink-0" />
            <span className="truncate">featherlight.jp</span>
          </a>
          <div className="flex items-center justify-between pt-3 mt-auto border-t border-slate-100">
            <span className="text-xs text-slate-400">Tạo 2025-03-15</span>
            <div className="flex gap-1">
              <button className="h-8 w-8 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-600">
                <Pencil className="size-4" />
              </button>
              <button className="h-8 w-8 rounded-md hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-slate-600">
                <Trash className="size-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 hover:border-indigo-300 hover:shadow-sm transition-all flex flex-col">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center text-2xl">
                💧
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-slate-900">HydroPro</h3>
                  <Star className="size-3.5 fill-amber-400 text-amber-400" />
                </div>

                <p className="text-xs text-slate-500">Đức</p>
              </div>
            </div>

            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold">
              1 SP
            </span>
          </div>

          <p className="text-sm text-slate-600 mb-4 line-clamp-2 min-h-[2.5rem]">
            Phụ kiện hydration chuyên nghiệp
          </p>

          <a
            href=""
            className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline mb-3 truncate"
          >
            <Globe className="size-3 shrink-0" />
            <span className="truncate">hydropro.de</span>
          </a>
          <div className="flex items-center justify-between pt-3 mt-auto border-t border-slate-100">
            <span className="text-xs text-slate-400">Tạo 2025-04-20</span>
            <div className="flex gap-1">
              <button className="h-8 w-8 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-600">
                <Pencil className="size-4" />
              </button>
              <button className="h-8 w-8 rounded-md hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-slate-600">
                <Trash className="size-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5 hover:border-indigo-300 hover:shadow-sm transition-all flex flex-col">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center text-2xl">
                👑
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-slate-900">PaceKing</h3>
                  <Star className="size-3.5 fill-amber-400 text-amber-400" />
                </div>

                <p className="text-xs text-slate-500">Anh Quốc</p>
              </div>
            </div>

            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold">
              0 SP
            </span>
          </div>

          <p className="text-sm text-slate-600 mb-4 line-clamp-2 min-h-[2.5rem]">
            Đồng hồ và thiết bị đo nhịp
          </p>

          {/* <a
            href=""
            className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline mb-3 truncate"
          >
            <Globe className="size-3 shrink-0" />
            <span className="truncate">Runvailt.com</span>
          </a> */}
          <div className="flex items-center justify-between pt-3 mt-auto border-t border-slate-100">
            <span className="text-xs text-slate-400">Tạo 2025-05-08</span>
            <div className="flex gap-1">
              <button className="h-8 w-8 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-600">
                <Pencil className="size-4" />
              </button>
              <button className="h-8 w-8 rounded-md hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-slate-600">
                <Trash className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBrands;
