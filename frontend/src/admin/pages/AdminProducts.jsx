import { ChevronDown, Pen, Plus, Search, Trash, Trash2, X } from "lucide-react";
import React, { useState } from "react";
import AddForm from "../components/ProductForm/AddForm";
import UpdateForm from "../components/ProductForm/UpdateForm";
import DeleteForm from "../components/ProductForm/DeleteForm";

const AdminProducts = () => {
  const [openForm, setOpenForm] = useState(false);
  const [openFormUpdate, setOpenFormUpdate] = useState(false);
  const [openFormDelete, setOpenFormDelete] = useState(false);
  console.log("openform", openForm);
  console.log("openFormUpdate", openFormUpdate);
  console.log("openFormDelete", openFormDelete);
  return (
    <div>
      <div className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Quản lý sản phẩm
            </h1>
            <p className="text-sm text-slate-500 mt-1">6 sản phẩm</p>
          </div>

          <button
            onClick={() => setOpenForm(true)}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 text-primary-foreground shadow-soft hover:shadow-card-hover h-10 px-5 py-2 bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="size-4" />
            Thêm sản phẩm
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-9"
                placeholder="Tìm theo tên hoặc slug..."
              />
            </div>
            <div className="w-full sm:w-64">
              <button className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1">
                <span className="pointer-events-none">Tất cả thương hiệu</span>
                <ChevronDown className="size-4 opacity-50" />
              </button>
            </div>
          </div>

          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-left">
                <tr>
                  <th className="px-5 py-3 font-semibold text-slate-700">
                    Sản phẩm
                  </th>
                  <th className="px-5 py-3 font-semibold text-slate-700">
                    Thương hiệu
                  </th>
                  <th className="px-5 py-3 font-semibold text-slate-700">
                    Giá
                  </th>
                  <th className="px-5 py-3 font-semibold text-slate-700 text-center">
                    Biến thể
                  </th>
                  <th className="px-5 py-3 font-semibold text-slate-700 text-center">
                    Tồn kho
                  </th>
                  <th className="px-5 py-3 font-semibold text-slate-700">
                    Trạng thái
                  </th>
                  <th className="px-5 py-3 font-semibold text-slate-700 text-right">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="">
                <tr className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-xl">
                        👟
                      </div>
                      <div className="">
                        <p className="font-medium text-slate-900">
                          RunVault Pulse Pro
                        </p>
                        <p className="text-xs text-slate-500">Giày road</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center">
                      <span className="text-sm text-slate-700">RunVault</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div>
                      <p className="font-semibold text-indigo-600">
                        2.690.000 ₫
                      </p>
                      <p className="text-xs text-slate-400 line-through">
                        3.200.000 ₫
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-center text-slate-700">4</td>
                  <td className="px-5 py-3 text-center">
                    <span className="text-slate-700">25</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                      Đang bán
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button className="size-8 rounded-md hover:bg-slate-200 flex items-center justify-center text-slate-600">
                        <Pen
                          onClick={() => setOpenFormUpdate(true)}
                          className="size-4"
                        />
                      </button>
                      <button className="h-8 w-8 rounded-md hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-slate-600">
                        <Trash2
                          onClick={() => setOpenFormDelete(true)}
                          className="size-4"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-xl">
                        🥾
                      </div>
                      <div className="">
                        <p className="font-medium text-slate-900">
                          Trail Storm X
                        </p>
                        <p className="text-xs text-slate-500">Giày trail</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center">
                      <span className="text-sm text-slate-700">
                        TrailMaster
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div>
                      <p className="font-semibold text-slate-900">
                        2.800.000 ₫
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-center text-slate-700">2</td>
                  <td className="px-5 py-3 text-center">
                    <span className="text-slate-700">34</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                      Đang bán
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button className="size-8 rounded-md hover:bg-slate-200 flex items-center justify-center text-slate-600">
                        <Pen className="size-4" />
                      </button>
                      <button className="h-8 w-8 rounded-md hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-slate-600">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-xl">
                        👕
                      </div>
                      <div className="">
                        <p className="font-medium text-slate-900">
                          Featherlight Tee
                        </p>
                        <p className="text-xs text-slate-500">Áo runner</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center">
                      <span className="text-sm text-slate-700">
                        Featherlight
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div>
                      <p className="font-semibold text-indigo-600">490.000 ₫</p>
                      <p className="text-xs text-slate-400 line-through">
                        590.000 ₫
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-center text-slate-700">3</td>
                  <td className="px-5 py-3 text-center">
                    <span className="text-slate-700">73</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                      Đang bán
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button className="size-8 rounded-md hover:bg-slate-200 flex items-center justify-center text-slate-600">
                        <Pen className="size-4" />
                      </button>
                      <button className="h-8 w-8 rounded-md hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-slate-600">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-xl">
                        🧴
                      </div>
                      <div className="">
                        <p className="font-medium text-slate-900">
                          HydroFlask 500ml
                        </p>
                        <p className="text-xs text-slate-500">Phụ kiện</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center">
                      <span className="text-sm text-slate-700">HydroPro</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div>
                      <p className="font-semibold text-slate-900">450.000 ₫</p>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-center text-slate-700">1</td>
                  <td className="px-5 py-3 text-center">
                    <span className="text-slate-700">50</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                      Nháp
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button className="size-8 rounded-md hover:bg-slate-200 flex items-center justify-center text-slate-600">
                        <Pen className="size-4" />
                      </button>
                      <button className="h-8 w-8 rounded-md hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-slate-600">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-xl">
                        🧦
                      </div>
                      <div className="">
                        <p className="font-medium text-slate-900">
                          GripSocks Pro
                        </p>
                        <p className="text-xs text-slate-500">Phụ kiện</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center">
                      <span className="text-sm text-slate-700">
                        Featherlight
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div>
                      <p className="font-semibold text-indigo-600">149.000 ₫</p>
                      <p className="text-xs text-slate-400 line-through">
                        180.000 ₫
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-center text-slate-700">1</td>
                  <td className="px-5 py-3 text-center">
                    <span className="text-slate-700">100</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                      Đang bán
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button className="size-8 rounded-md hover:bg-slate-200 flex items-center justify-center text-slate-600">
                        <Pen className="size-4" />
                      </button>
                      <button className="h-8 w-8 rounded-md hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-slate-600">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between p-4 border-t border-slate-200">
            <div className="text-sm text-slate-600">Trang 1 / 2</div>
            <div className="flex gap-1">
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold ring-offset-background transition-all duration-200 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">
                Trước
              </button>
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold ring-offset-background transition-all duration-200 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>

      {openForm && <AddForm onClose={() => setOpenForm(false)} />}
      {openFormUpdate && (
        <UpdateForm onClose={() => setOpenFormUpdate(false)} />
      )}
      {openFormDelete && (
        <DeleteForm onClose={() => setOpenFormDelete(false)} />
      )}
    </div>
  );
};

export default AdminProducts;
