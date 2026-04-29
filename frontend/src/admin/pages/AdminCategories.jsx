import { Pencil, Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import AddForm from "../components/CategoryForm/AddForm";

const AdminCategories = () => {
  const [openForm, setOpenForm] = useState(false);
  return (
    <div>
      <div className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Danh mục</h1>
            <p className="text-sm text-slate-500  mt-1">
              Quản lý danh mục sản phẩm
            </p>
          </div>

          <button
            onClick={() => setOpenForm(true)}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 text-primary-foreground shadow-soft hover:shadow-card-hover h-10 px-5 py-2 bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="size-4" />
            Thêm danh mục
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-left">
                  <th className="px-5 py-3 font-semibold text-slate-700">
                    Tên danh mục
                  </th>
                  <th className="px-5 py-3 font-semibold text-slate-700">
                    Slug
                  </th>
                  <th className="px-5 py-3 font-semibold text-slate-700">
                    Mô tả
                  </th>
                  <th className="px-5 py-3 font-semibold text-slate-700 text-center">
                    Sản phẩm
                  </th>
                  <th className="px-5 py-3 font-semibold text-slate-700 text-right">
                    Thao tác
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">
                        Giày chạy bộ
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-600 font-mono text-xs">
                    giay-chay-bo
                  </td>
                  <td className="px-5 py-3 text-slate-600 max-w-xs truncate">
                    Giày chuyên dụng cho runner
                  </td>
                  <td className="px-5 py-3 text-center text-slate-700">24</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button className="h-8 w-8 rounded-md hover:bg-slate-200 flex items-center justify-center text-slate-600">
                        <Pencil className="size-4" />
                      </button>
                      <button className="h-8 w-8 rounded-md hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-slate-600">
                        <Trash2 />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 ml-4">└</span>
                      <span className="font-medium text-slate-900">
                        Giày road
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-600 font-mono text-xs">
                    giay-road
                  </td>
                  <td className="px-5 py-3 text-slate-600 max-w-xs truncate">
                    Chạy đường nhựa
                  </td>
                  <td className="px-5 py-3 text-center text-slate-700">12</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button className="h-8 w-8 rounded-md hover:bg-slate-200 flex items-center justify-center text-slate-600">
                        <Pencil className="size-4" />
                      </button>
                      <button className="h-8 w-8 rounded-md hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-slate-600">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 ml-4">└</span>
                      <span className="font-medium text-slate-900">
                        Giày trail
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-600 font-mono text-xs">
                    giay-trail
                  </td>
                  <td className="px-5 py-3 text-slate-600 max-w-xs truncate">
                    Chạy địa hình
                  </td>
                  <td className="px-5 py-3 text-center text-slate-700">8</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button className="h-8 w-8 rounded-md hover:bg-slate-200 flex items-center justify-center text-slate-600">
                        <Pencil className="size-4" />
                      </button>
                      <button className="h-8 w-8 rounded-md hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-slate-600">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">
                        Quần áo
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-600 font-mono text-xs">
                    quan-ao
                  </td>
                  <td className="px-5 py-3 text-slate-600 max-w-xs truncate">
                    Trang phục thể thao
                  </td>
                  <td className="px-5 py-3 text-center text-slate-700">18</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button className="h-8 w-8 rounded-md hover:bg-slate-200 flex items-center justify-center text-slate-600">
                        <Pencil className="size-4" />
                      </button>
                      <button className="h-8 w-8 rounded-md hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-slate-600">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 ml-4">└</span>
                      <span className="font-medium text-slate-900">
                        Áo runner
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-600 font-mono text-xs">
                    ao-runner
                  </td>
                  <td className="px-5 py-3 text-slate-600 max-w-xs truncate">
                    Áo thoáng khí
                  </td>
                  <td className="px-5 py-3 text-center text-slate-700">10</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button className="h-8 w-8 rounded-md hover:bg-slate-200 flex items-center justify-center text-slate-600">
                        <Pencil className="size-4" />
                      </button>
                      <button className="h-8 w-8 rounded-md hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-slate-600">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">
                        Phụ kiện
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-600 font-mono text-xs">
                    phu-kien
                  </td>
                  <td className="px-5 py-3 text-slate-600 max-w-xs truncate">
                    Tất, đồng hồ, bình nước
                  </td>
                  <td className="px-5 py-3 text-center text-slate-700">15</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button className="h-8 w-8 rounded-md hover:bg-slate-200 flex items-center justify-center text-slate-600">
                        <Pencil className="size-4" />
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
        </div>
      </div>

      {openForm && <AddForm onClose={() => setOpenForm(false)} />}
    </div>
  );
};

export default AdminCategories;
