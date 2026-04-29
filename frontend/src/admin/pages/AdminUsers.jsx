import { Search } from "lucide-react";
import React from "react";

const AdminUsers = () => {
  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Nguời dùng</h1>
          <p className="text-sm text-slate-500 mt-1">7 tài khoản</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-4 border-b border-slate-200">
          <div className="relative max-w-sm">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-9"
              placeholder="Tìm theo tên hoặc email..."
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-left">
              <tr>
                <th className="px-5 py-3 font-semibold text-slate-700">
                  Người dùng
                </th>
                <th className="px-5 py-3 font-semibold text-slate-700">
                  Vai trò
                </th>
                <th className="px-5 py-3 font-semibold text-slate-700">
                  Tham gia
                </th>
                <th className="px-5 py-3 font-semibold text-slate-700 text-center">
                  Đơn hàng
                </th>
                <th className="px-5 py-3 font-semibold text-slate-700">
                  Trạng thái
                </th>
                <th className="px-5 py-3 font-semibold text-slate-700 text-right">
                  Kích hoạt
                </th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                      AR
                    </div>

                    <div>
                      <p className="font-medium text-slate-900 flex items-center gap-2">
                        Admin RunVault
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 font-semibold">
                          BẠN
                        </span>
                      </p>
                      <p className="text-xs text-slate-500">
                        admin@runvault.com
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                    Admin
                  </div>
                </td>
                <td className="px-5 py-3 text-slate-600">2025-01-01</td>
                <td className="px-5 py-3 text-center text-slate-700">0</td>
                <td className="px-5 py-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    Hoạt động
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end">
                    <button className="peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors">
                      <span className="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform"></span>
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                      VA
                    </div>

                    <div>
                      <p className="font-medium text-slate-900 flex items-center gap-2">
                        Nguyễn Văn An
                      </p>
                      <p className="text-xs text-slate-500">
                        an.nguyen@mail.com
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                    Khách hàng
                  </div>
                </td>
                <td className="px-5 py-3 text-slate-600">2025-08-12</td>
                <td className="px-5 py-3 text-center text-slate-700">7</td>
                <td className="px-5 py-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    Hoạt động
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end">
                    <button className="peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors">
                      <span className="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform"></span>
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                      TB
                    </div>

                    <div>
                      <p className="font-medium text-slate-900 flex items-center gap-2">
                        Trần Thị Bình
                      </p>
                      <p className="text-xs text-slate-500">
                        binh.tran@mail.com
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                    Khách hàng
                  </div>
                </td>
                <td className="px-5 py-3 text-slate-600">2025-09-04</td>
                <td className="px-5 py-3 text-center text-slate-700">12</td>
                <td className="px-5 py-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                    Đã khóa
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end">
                    <button className="peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors">
                      <span className="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform"></span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
