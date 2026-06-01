import React, { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";

import AddForm from "../../components/admin/categories/AddCategoryForm";
import DeleteForm from "../../components/admin/categories/DeleteCategoryForm";

import CategoryStats from "../../components/admin/categories/CategoryStats";
import CategoryFilters from "../../components/admin/categories/CategoryFilters";
import CategoryTable from "../../components/admin/categories/CategoryTable";

import categoryService from "../../services/category.service";

const DEFAULT_PAGINATION = {
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
};

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);

  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);

  const [filters, setFilters] = useState({
    keyword: "",
    type: "",
  });

  const [openForm, setOpenForm] = useState(false);
  const [openDeleteForm, setOpenDeleteForm] = useState(false);

  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);

  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const params = {
        keyword: filters.keyword.trim(),
        type: filters.type,
        page: pagination.page,
        limit: pagination.limit,
      };

      const res = await categoryService.getAllCategories(params);

      setCategories(getCategoryList(res));
      setPagination(getPagination(res));
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Lỗi lấy danh sách danh mục",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCategories = async () => {
    try {
      const res = await categoryService.getAllCategories({
        page: 1,
        limit: 1000,
      });

      setAllCategories(getCategoryList(res));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [filters, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchAllCategories();
  }, []);

  const stats = useMemo(() => {
    const rootCount = allCategories.filter((item) => item.level === 0).length;
    const childCount = allCategories.filter((item) => item.level === 1).length;

    return {
      total: pagination.total,
      root: rootCount,
      child: childCount,
    };
  }, [allCategories, pagination.total]);

  const handleChangeFilter = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));

    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));
  };

  const handleChangeLimit = (limit) => {
    setPagination((prev) => ({
      ...prev,
      page: 1,
      limit,
    }));
  };

  const handleChangePage = (page) => {
    if (page < 1 || page > pagination.totalPages) return;

    setPagination((prev) => ({
      ...prev,
      page,
    }));
  };

  const handleResetFilter = () => {
    setFilters({
      keyword: "",
      type: "",
    });

    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));
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
      await fetchAllCategories();
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
    try {
      if (!deletingCategory?._id) return;

      await categoryService.deleteCategory(deletingCategory._id);
      toast.success("Xóa danh mục thành công");

      handleCloseDelete();

      await fetchCategories();
      await fetchAllCategories();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Xóa danh mục thất bại");
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Danh mục</h1>
          <p className="mt-1 text-sm text-slate-500">
            Quản lý danh mục sản phẩm, danh mục cha và danh mục con
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          <Plus className="size-4" />
          Thêm danh mục
        </button>
      </div>

      <CategoryStats
        total={stats.total}
        root={stats.root}
        child={stats.child}
      />

      <CategoryFilters
        filters={filters}
        limit={pagination.limit}
        onChangeFilter={handleChangeFilter}
        onChangeLimit={handleChangeLimit}
        onReset={handleResetFilter}
      />

      <CategoryTable
        categories={categories}
        loading={loading}
        pagination={pagination}
        onPageChange={handleChangePage}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      {openForm && (
        <AddForm
          onClose={handleCloseForm}
          onSubmit={handleSubmitForm}
          categories={allCategories}
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

const getCategoryList = (resData) => {
  if (Array.isArray(resData)) return resData;
  if (Array.isArray(resData?.categories)) return resData.categories;
  if (Array.isArray(resData?.category)) return resData.category;
  if (Array.isArray(resData?.data)) return resData.data;

  const metadata = resData?.metadata;
  if (Array.isArray(metadata?.data)) return metadata.data;
  if (Array.isArray(metadata)) return metadata;

  return [];
};

const getPagination = (resData) => {
  return (
    resData?.pagination ||
    resData?.metadata?.pagination || {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 1,
    }
  );
};

export default AdminCategories;
