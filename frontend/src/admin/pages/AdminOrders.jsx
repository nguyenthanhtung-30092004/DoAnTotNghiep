import { Circle, CircleX, Eye, Search } from "lucide-react";
import React from "react";

const AdminOrders = () => {
  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Đơn hàng</h1>

          <p className="text-sm text-slate-500 mt-1">8 đơn</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex overflow-x-auto border-b border-slate-200 px-2">
          <button className="px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors border-indigo-600 text-indigo-600">
            Tất cả
            <span className="ml-1.5 text-xs text-slate-400">(8)</span>
          </button>
          <button className="px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors border-transparent text-slate-600 hover:text-slate-900">
            Chờ duyệt
            <span className="ml-1.5 text-xs text-slate-400">(2)</span>
          </button>
          <button className="px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors border-transparent text-slate-600 hover:text-slate-900">
            Đang giao
            <span className="ml-1.5 text-xs text-slate-400">(2)</span>
          </button>
          <button className="px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors border-transparent text-slate-600 hover:text-slate-900">
            Đã thanh toán
            <span className="ml-1.5 text-xs text-slate-400">(2)</span>
          </button>
          <button className="px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors border-transparent text-slate-600 hover:text-slate-900">
            Đã hủy
            <span className="ml-1.5 text-xs text-slate-400">(2)</span>
          </button>
        </div>

        <div className="p-4 border-b border-slate-200">
          <div className="relative max-w-sm">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-9"
              placeholder="Tìm mã đơn, khách hàng..."
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-left">
              <tr>
                <td className="px-5 py-3 font-semibold text-slate-700">
                  Mã đơn
                </td>
                <td className="px-5 py-3 font-semibold text-slate-700">
                  Khách hàng
                </td>
                <td className="px-5 py-3 font-semibold text-slate-700">Ngày</td>
                <td className="px-5 py-3 font-semibold text-slate-700">SP</td>
                <td className="px-5 py-3 font-semibold text-slate-700">Tổng</td>
                <td className="px-5 py-3 font-semibold text-slate-700">
                  Thanh toán
                </td>
                <td className="px-5 py-3 font-semibold text-slate-700">
                  Trạng thái
                </td>
                <td className="px-5 py-3 font-semibold text-slate-700">
                  Thao tác
                </td>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-5 py-3 font-mono text-xs font-semibold text-indigo-600">
                  RV-2026-1847
                </td>
                <td className="px-5 py-3">
                  <p className="font-medium text-slate-900">Nguyễn Văn An</p>
                  <p className="text-xs text-slate-500">an.nguyen@gmail.com</p>
                </td>
                <td className="px-5 py-3 text-slate-600">2026-04-22</td>
                <td className="px-5 py-3 text-slate-700 text-center">1</td>
                <td className="px-5 py-3 font-semibold text-slate-900">
                  2.690.000 ₫
                </td>
                <td className="px-5 py-3 text-slate-600">VNPay</td>
                <td className="px-5 py-3">
                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                    Đang giao
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <a
                      href=""
                      className="h-8 w-8 rounded-md hover:bg-slate-200 flex items-center justify-center text-slate-600"
                    >
                      <Eye className="size-4" />
                    </a>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-5 py-3 font-mono text-xs font-semibold text-indigo-600">
                  RV-2026-1846
                </td>
                <td className="px-5 py-3">
                  <p className="font-medium text-slate-900">Trần Thị Bình</p>
                  <p className="text-xs text-slate-500">binh.tran@mail.com</p>
                </td>
                <td className="px-5 py-3 text-slate-600">2026-04-21</td>
                <td className="px-5 py-3 text-slate-700 text-center">3</td>
                <td className="px-5 py-3 font-semibold text-slate-900">
                  1.180.000 ₫
                </td>
                <td className="px-5 py-3 text-slate-600">Momo</td>
                <td className="px-5 py-3">
                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                    Đã thanh toán
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <a
                      href=""
                      className="h-8 w-8 rounded-md hover:bg-slate-200 flex items-center justify-center text-slate-600"
                    >
                      <Eye className="size-4" />
                    </a>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-5 py-3 font-mono text-xs font-semibold text-indigo-600">
                  RV-2026-1845
                </td>
                <td className="px-5 py-3">
                  <p className="font-medium text-slate-900">Lê Hoàng Cường</p>
                  <p className="text-xs text-slate-500">cuong.le@mail.com</p>
                </td>
                <td className="px-5 py-3 text-slate-600">2026-04-21</td>
                <td className="px-5 py-3 text-slate-700 text-center">1</td>
                <td className="px-5 py-3 font-semibold text-slate-900">
                  590.000 ₫
                </td>
                <td className="px-5 py-3 text-slate-600">COD</td>
                <td className="px-5 py-3">
                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                    Chờ duyệt
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <a
                      href=""
                      className="h-8 w-8 rounded-md hover:bg-slate-200 flex items-center justify-center text-slate-600"
                    >
                      <Eye className="size-4" />
                    </a>
                    <button
                      className="h-8 w-8 rounded-md hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-slate-600"
                      title="Hủy đơn"
                    >
                      <CircleX className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-5 py-3 font-mono text-xs font-semibold text-indigo-600">
                  RV-2026-1844
                </td>
                <td className="px-5 py-3">
                  <p className="font-medium text-slate-900">Phạm Mỹ Duyên</p>
                  <p className="text-xs text-slate-500">duyen.pham@mail.com</p>
                </td>
                <td className="px-5 py-3 text-slate-600">2026-04-20</td>
                <td className="px-5 py-3 text-slate-700 text-center">2</td>
                <td className="px-5 py-3 font-semibold text-slate-900">
                  4.290.000 ₫
                </td>
                <td className="px-5 py-3 text-slate-600">VNPay</td>
                <td className="px-5 py-3">
                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                    Đã hủy
                  </span>
                  <p
                    className="text-xs text-slate-500 mt-1 max-w-[200px] truncate"
                    title="Khách đổi ý không mua nữa"
                  >
                    Lý do: Khách đổi ý không mua nữa
                  </p>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <a
                      href=""
                      className="h-8 w-8 rounded-md hover:bg-slate-200 flex items-center justify-center text-slate-600"
                    >
                      <Eye className="size-4" />
                    </a>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-5 py-3 font-mono text-xs font-semibold text-indigo-600">
                  RV-2026-1843
                </td>
                <td className="px-5 py-3">
                  <p className="font-medium text-slate-900">Hoàng Quốc Việt</p>
                  <p className="text-xs text-slate-500">viet.hoang@mail.com</p>
                </td>
                <td className="px-5 py-3 text-slate-600">2026-04-19</td>
                <td className="px-5 py-3 text-slate-700 text-center">1</td>
                <td className="px-5 py-3 font-semibold text-slate-900">
                  320.000 ₫
                </td>
                <td className="px-5 py-3 text-slate-600">Credit Card</td>
                <td className="px-5 py-3">
                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                    Đã thanh toán
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <a
                      href=""
                      className="h-8 w-8 rounded-md hover:bg-slate-200 flex items-center justify-center text-slate-600"
                    >
                      <Eye className="size-4" />
                    </a>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-5 py-3 font-mono text-xs font-semibold text-indigo-600">
                  RV-2026-1842
                </td>
                <td className="px-5 py-3">
                  <p className="font-medium text-slate-900">Vũ Thanh Hà</p>
                  <p className="text-xs text-slate-500">ha.vu@mail.com</p>
                </td>
                <td className="px-5 py-3 text-slate-600">2026-04-19</td>
                <td className="px-5 py-3 text-slate-700 text-center">1</td>
                <td className="px-5 py-3 font-semibold text-slate-900">
                  2.800.000 ₫
                </td>
                <td className="px-5 py-3 text-slate-600"> Momo</td>
                <td className="px-5 py-3">
                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                    Đang giao
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <a
                      href=""
                      className="h-8 w-8 rounded-md hover:bg-slate-200 flex items-center justify-center text-slate-600"
                    >
                      <Eye className="size-4" />
                    </a>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-5 py-3 font-mono text-xs font-semibold text-indigo-600">
                  RV-2026-1841
                </td>
                <td className="px-5 py-3">
                  <p className="font-medium text-slate-900">Đỗ Khánh Linh</p>
                  <p className="text-xs text-slate-500">linh.do@mail.com</p>
                </td>
                <td className="px-5 py-3 text-slate-600">2026-04-18</td>
                <td className="px-5 py-3 text-slate-700 text-center">2</td>
                <td className="px-5 py-3 font-semibold text-slate-900">
                  980.000 ₫
                </td>
                <td className="px-5 py-3 text-slate-600">COD</td>
                <td className="px-5 py-3">
                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                    Chờ duyệt
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <a
                      href=""
                      className="h-8 w-8 rounded-md hover:bg-slate-200 flex items-center justify-center text-slate-600"
                    >
                      <Eye className="size-4" />
                    </a>
                    <button
                      className="h-8 w-8 rounded-md hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-slate-600"
                      title="Hủy đơn"
                    >
                      <CircleX className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-5 py-3 font-mono text-xs font-semibold text-indigo-600">
                  RV-2026-1840
                </td>
                <td className="px-5 py-3">
                  <p className="font-medium text-slate-900">Bùi Anh Tuấn</p>
                  <p className="text-xs text-slate-500">tuan.bui@mail.com</p>
                </td>
                <td className="px-5 py-3 text-slate-600">2026-04-17</td>
                <td className="px-5 py-3 text-slate-700 text-center">1</td>
                <td className="px-5 py-3 font-semibold text-slate-900">
                  1.490.000 ₫
                </td>
                <td className="px-5 py-3 text-slate-600">VNPay</td>
                <td className="px-5 py-3">
                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                    Đã hủy
                  </span>
                  <p
                    className="text-xs text-slate-500 mt-1 max-w-[200px] truncate"
                    title="Hết hàng size yêu cầu"
                  >
                    Lý do: Hết hàng size yêu cầu
                  </p>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <a
                      href=""
                      className="h-8 w-8 rounded-md hover:bg-slate-200 flex items-center justify-center text-slate-600"
                    >
                      <Eye className="size-4" />
                    </a>
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

export default AdminOrders;
