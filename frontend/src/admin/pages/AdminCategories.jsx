import { FolderTree, ImageOff, Pencil, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import AddForm from "../components/CategoryForm/AddForm";
import DeleteForm from "../components/CategoryForm/DeleteForm";
import categoryService from "../../services/category.service";

const AdminCategories = () => {
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteForm, setOpenDeleteForm] = useState(false);

  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);

  const [loading, setLoading] = useState(false);

  const normalizeCategories = (resData) => {
    const metadata = resData?.metadata;

    if (Array.isArray(metadata)) return metadata;
    if (Array.isArray(metadata?.categories)) return metadata.categories;
    if (Array.isArray(metadata?.data)) return metadata.data;
    if (Array.isArray(resData?.data)) return resData.data;

    return [];
  };

  const getParentId = (category) => {
    if (!category?.parentId) return null;

    if (typeof category.parentId === "object") {
      return category.parentId._id;
    }

    return category.parentId;
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const res = await categoryService.getAllCategories();
      const data = normalizeCategories(res.data);

      setCategories(data);
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Lỗi lấy danh sách danh mục",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const displayCategories = useMemo(() => {
    if (!Array.isArray(categories)) return [];

    const parents = categories.filter((item) => !getParentId(item));
    const children = categories.filter((item) => getParentId(item));

    const result = [];

    parents.forEach((parent) => {
      result.push({
        ...parent,
        level: 0,
        parentName: "Danh mục gốc",
      });

      const childList = children.filter(
        (child) => getParentId(child) === parent._id,
      );

      childList.forEach((child) => {
        result.push({
          ...child,
          level: 1,
          parentName: parent.name,
        });
      });
    });

    const orphanChildren = children.filter((child) => {
      const parentId = getParentId(child);
      return !parents.some((parent) => parent._id === parentId);
    });

    orphanChildren.forEach((child) => {
      result.push({
        ...child,
        level: 1,
        parentName: "Không tìm thấy danh mục cha",
      });
    });

    return result;
  }, [categories]);

  const rootCount = useMemo(() => {
    return categories.filter((item) => !getParentId(item)).length;
  }, [categories]);

  const childCount = useMemo(() => {
    return categories.filter((item) => getParentId(item)).length;
  }, [categories]);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setOpenForm(true);
  };

  const handleOpenEdit = (category) => {
    setEditingCategory(category);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingCategory(null);
  };

  const handleSubmitForm = async (formData) => {
    if (editingCategory) {
      await categoryService.updateCategory(editingCategory._id, formData);
      await fetchCategories();
      return;
    }

    await categoryService.createCategory(formData);
    await fetchCategories();
  };

  const handleOpenDelete = (category) => {
    setDeletingCategory(category);
    setOpenDeleteForm(true);
  };

  const handleCloseDelete = () => {
    setDeletingCategory(null);
    setOpenDeleteForm(false);
  };

  const handleConfirmDelete = async () => {
    if (!deletingCategory?._id) return;

    await categoryService.deleteCategory(deletingCategory._id);
    await fetchCategories();
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Danh mục</h1>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý danh mục sản phẩm, danh mục cha và danh mục con
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 shadow-soft h-10 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <Plus className="size-4" />
          Thêm danh mục
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-sm text-slate-500">Tổng danh mục</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {categories.length}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-sm text-slate-500">Danh mục gốc</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{rootCount}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-sm text-slate-500">Danh mục con</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{childCount}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mt-5">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center gap-2">
          <FolderTree className="size-5 text-indigo-600" />
          <div>
            <h2 className="font-semibold text-slate-900">Danh sách danh mục</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Danh mục con được hiển thị thụt vào bên dưới danh mục cha
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-left">
                <th className="px-5 py-3 font-semibold text-slate-700">
                  Danh mục
                </th>
                <th className="px-5 py-3 font-semibold text-slate-700">Slug</th>
                <th className="px-5 py-3 font-semibold text-slate-700">
                  Cấp danh mục
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
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-10 text-center text-slate-500"
                  >
                    Đang tải danh mục...
                  </td>
                </tr>
              ) : displayCategories.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-10 text-center text-slate-500"
                  >
                    Chưa có danh mục nào
                  </td>
                </tr>
              ) : (
                displayCategories.map((category) => (
                  <tr
                    key={category._id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {category.level === 1 && (
                          <span className="text-slate-400 ml-4">└</span>
                        )}

                        {category.thumbnail ? (
                          <img
                            src={category.thumbnail}
                            alt={category.name}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
                            <ImageOff className="size-4 text-slate-400" />
                          </div>
                        )}

                        <div>
                          <p className="font-medium text-slate-900">
                            {category.name}
                          </p>
                          {category.level === 1 && (
                            <p className="text-xs text-slate-500">
                              Thuộc: {category.parentName}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3 text-slate-600 font-mono text-xs">
                      {category.slug}
                    </td>

                    <td className="px-5 py-3">
                      {category.level === 0 ? (
                        <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
                          Danh mục gốc
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                          Danh mục con
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-3 text-slate-600 max-w-xs truncate">
                      {category.description || "Không có mô tả"}
                    </td>

                    <td className="px-5 py-3 text-center text-slate-700">
                      {category.productCount || category.products?.length || 0}
                    </td>

                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(category)}
                          className="h-8 w-8 rounded-md hover:bg-slate-200 flex items-center justify-center text-slate-600"
                          title="Sửa danh mục"
                        >
                          <Pencil className="size-4" />
                        </button>

                        <button
                          onClick={() => handleOpenDelete(category)}
                          className="h-8 w-8 rounded-md hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-slate-600"
                          title="Xóa danh mục"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {openForm && (
        <AddForm
          onClose={handleCloseForm}
          onSubmit={handleSubmitForm}
          categories={categories}
          editingCategory={editingCategory}
        />
      )}

      {openDeleteForm && (
        <DeleteForm
          onClose={handleCloseDelete}
          onConfirm={handleConfirmDelete}
          category={deletingCategory}
        />
      )}
    </div>
  );
};

export default AdminCategories;
