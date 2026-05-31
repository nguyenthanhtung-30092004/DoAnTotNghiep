import React from "react";
import { FolderTree, ImageOff, Edit, Trash2 } from "lucide-react";
import Pagination from "./CategoryPagination";

const CategoryTable = ({
  categories = [],
  loading,
  pagination,
  onPageChange,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white mt-5">
      <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-4">
        <FolderTree className="size-5 text-indigo-600" />

        <div>
          <h2 className="font-semibold text-slate-900">Danh sách danh mục</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Danh mục cha hiển thị trước, danh mục con nằm ngay bên dưới
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr className="text-left">
              <TableHead>Danh mục</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Danh mục cha</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <EmptyRow text="Đang tải danh mục..." />
            ) : categories.length === 0 ? (
              <EmptyRow text="Không tìm thấy danh mục nào" />
            ) : (
              categories.map((category) => (
                <CategoryRow
                  key={category._id}
                  category={category}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination pagination={pagination} onPageChange={onPageChange} />
    </div>
  );
};

const CategoryRow = ({ category, onEdit, onDelete }) => {
  const isChild = category.level === 1;

  return (
    <tr className="border-b border-slate-100 transition hover:bg-slate-50">
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

      <td className="px-5 py-3 text-slate-600">
        {isChild ? category.parentName : "-"}
      </td>

      <td className="max-w-xs truncate px-5 py-3 text-slate-600">
        {category.description || "Không có mô tả"}
      </td>

      <td className="px-5 py-3">
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => onEdit(category)}
            className="flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
            title="Sửa danh mục"
          >
            <Edit className="size-4" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(category)}
            className="flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            title="Xóa danh mục"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </td>
    </tr>
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
      <td colSpan="6" className="px-5 py-12 text-center text-slate-500">
        {text}
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

export default CategoryTable;
