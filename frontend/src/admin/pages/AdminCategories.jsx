import {
  FolderTree,
  ImageOff,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import AddForm from "../components/Category/CategoryForm/AddForm";
import DeleteForm from "../components/Category/CategoryForm/DeleteForm";
import categoryService from "../../services/category.service";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);

  const [openForm, setOpenForm] = useState(false);
  const [openDeleteForm, setOpenDeleteForm] = useState(false);

  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);

  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    keyword: "",
    type: "",
  });

  const normalizeCategories = (resData) => {
    const metadata = resData?.metadata;

    if (Array.isArray(metadata)) return metadata;
    if (Array.isArray(metadata?.data)) return metadata.data;
    if (Array.isArray(metadata?.categories)) return metadata.categories;
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

  const getParentName = (category) => {
    if (!category?.parentId) return "Danh mục gốc";

    if (typeof category.parentId === "object") {
      return category.parentId.name || "Không tìm thấy danh mục cha";
    }

    const parent = categories.find((item) => item._id === category.parentId);
    return parent?.name || "Không tìm thấy danh mục cha";
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const params = {
        keyword: filters.keyword.trim(),
        type: filters.type,
      };

      const res = await categoryService.getAllCategories(params);
      console.log(res.data);
      const data = normalizeCategories(res.data.metadata);
      setCategories(data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Lỗi lấy danh sách danh mục",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [filters]);

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
        parentName: getParentName(child),
      });
    });

    return result;
  }, [categories]);

  const stats = useMemo(() => {
    const rootCount = categories.filter((item) => !getParentId(item)).length;
    const childCount = categories.filter((item) => getParentId(item)).length;

    return {
      total: categories.length,
      root: rootCount,
      child: childCount,
    };
  }, [categories]);

  const handleChangeFilter = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResetFilter = () => {
    setFilters({
      keyword: "",
      type: "",
    });
  };

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
    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory._id, formData);
        toast.success("Cập nhật danh mục thành công");
      } else {
        await categoryService.createCategory(formData);
        toast.success("Thêm danh mục thành công");
      }

      handleCloseForm();
      await fetchCategories();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Lưu danh mục thất bại");
    }
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
    <div className="w-full space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Danh mục</h1>
          <p className="mt-1 text-sm text-slate-500">
            Quản lý danh mục sản phẩm, danh mục cha và danh mục con
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-soft transition-all duration-200 hover:bg-indigo-700"
        >
          <Plus className="size-4" />
          Thêm danh mục
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Tổng danh mục" value={stats.total} />
        <StatCard label="Danh mục gốc" value={stats.root} />
        <StatCard label="Danh mục con" value={stats.child} />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              value={filters.keyword}
              onChange={(e) => handleChangeFilter("keyword", e.target.value)}
              placeholder="Tìm theo tên, slug hoặc mô tả..."
              className="h-10 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={filters.type}
            onChange={(e) => handleChangeFilter("type", e.target.value)}
            className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500"
          >
            <option value="">Tất cả danh mục</option>
            <option value="root">Danh mục gốc</option>
            <option value="child">Danh mục con</option>
          </select>

          <button
            onClick={handleResetFilter}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <X className="size-4" />
            Xóa lọc
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-4">
          <FolderTree className="size-5 text-indigo-600" />

          <div>
            <h2 className="font-semibold text-slate-900">Danh sách danh mục</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Danh mục con được hiển thị thụt vào bên dưới danh mục cha
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr className="text-left">
                <TableHead>Danh mục</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Cấp danh mục</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead className="text-center">Sản phẩm</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <EmptyRow text="Đang tải danh mục..." />
              ) : displayCategories.length === 0 ? (
                <EmptyRow text="Không tìm thấy danh mục nào" />
              ) : (
                displayCategories.map((category) => (
                  <CategoryRow
                    key={category._id}
                    category={category}
                    onEdit={handleOpenEdit}
                    onDelete={handleOpenDelete}
                  />
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

const StatCard = ({ label, value }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
};

const TableHead = ({ children, className = "" }) => {
  return (
    <th className={`px-5 py-3 font-semibold text-slate-700 ${className}`}>
      {children}
    </th>
  );
};

const EmptyRow = ({ text }) => {
  return (
    <tr>
      <td colSpan="6" className="px-5 py-10 text-center text-slate-500">
        {text}
      </td>
    </tr>
  );
};

const CategoryRow = ({ category, onEdit, onDelete }) => {
  const isChild = category.level === 1;

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50">
      <td className="px-5 py-3">
        <div className="flex items-center gap-3">
          {isChild && <span className="ml-4 text-slate-400">└</span>}

          {category.thumbnail ? (
            <img
              src={category.thumbnail}
              alt={category.name}
              className="h-10 w-10 rounded-lg border border-slate-200 object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-100">
              <ImageOff className="size-4 text-slate-400" />
            </div>
          )}

          <div>
            <p className="font-medium text-slate-900">{category.name}</p>

            {isChild && (
              <p className="text-xs text-slate-500">
                Thuộc: {category.parentName}
              </p>
            )}
          </div>
        </div>
      </td>

      <td className="px-5 py-3 font-mono text-xs text-slate-600">
        {category.slug}
      </td>

      <td className="px-5 py-3">
        {isChild ? (
          <Badge>Danh mục con</Badge>
        ) : (
          <Badge active>Danh mục gốc</Badge>
        )}
      </td>

      <td className="max-w-xs truncate px-5 py-3 text-slate-600">
        {category.description || "Không có mô tả"}
      </td>

      <td className="px-5 py-3 text-center text-slate-700">
        {category.productCount || category.products?.length || 0}
      </td>

      <td className="px-5 py-3">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => onEdit(category)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-600 hover:bg-slate-200"
            title="Sửa danh mục"
          >
            <Pencil className="size-4" />
          </button>

          <button
            onClick={() => onDelete(category)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-600 hover:bg-red-50 hover:text-red-600"
            title="Xóa danh mục"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

const Badge = ({ children, active = false }) => {
  const className = active
    ? "bg-indigo-50 text-indigo-700"
    : "bg-slate-100 text-slate-700";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${className}`}
    >
      {children}
    </span>
  );
};

export default AdminCategories;
