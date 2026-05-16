import React, { useEffect, useMemo, useState } from "react";
import { UploadCloud, X } from "lucide-react";
import { toast } from "react-toastify";

const AddForm = ({
  onClose,
  onSubmit,
  categories = [],
  editingCategory = null,
}) => {
  const isEdit = Boolean(editingCategory);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [parentId, setParentId] = useState("");
  const [description, setDescription] = useState("");

  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!editingCategory) return;

    setName(editingCategory.name || "");
    setSlug(editingCategory.slug || "");
    setDescription(editingCategory.description || "");
    setPreview(editingCategory.thumbnail || "");
    setThumbnail(null);

    if (editingCategory.parentId) {
      setParentId(editingCategory.parentId._id || editingCategory.parentId);
    } else {
      setParentId("");
    }
  }, [editingCategory]);

  const parentCategories = useMemo(() => {
    return categories.filter((category) => {
      const isRootCategory = !category.parentId;
      const isCurrentCategory = category._id === editingCategory?._id;

      return isRootCategory && !isCurrentCategory;
    });
  }, [categories, editingCategory]);

  const handleChangeName = (e) => {
    const value = e.target.value;

    setName(value);
    setSlug(createSlug(value));
  };

  const handleChangeSlug = (e) => {
    setSlug(createSlug(e.target.value));
  };

  const handleChangeFile = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.warning("Ảnh không được vượt quá 2MB");
      return;
    }

    setThumbnail(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.warning("Vui lòng nhập tên danh mục");
      return;
    }

    if (!slug.trim()) {
      toast.warning("Vui lòng nhập slug");
      return;
    }

    if (!isEdit && !thumbnail) {
      toast.warning("Vui lòng chọn ảnh danh mục");
      return;
    }

    const formData = new FormData();

    formData.append("name", name.trim());
    formData.append("slug", slug.trim());
    formData.append("parentId", parentId || "");
    formData.append("description", description.trim());

    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    try {
      setLoading(true);
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {isEdit ? "Cập nhật danh mục" : "Thêm danh mục mới"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {isEdit
                ? "Chỉnh sửa thông tin danh mục hiện tại"
                : "Tạo danh mục mới cho sản phẩm"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:pointer-events-none"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="grid max-h-[70vh] grid-cols-1 gap-6 overflow-y-auto px-6 py-5 md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Tên danh mục <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                value={name}
                onChange={handleChangeName}
                placeholder="VD: Giày chạy bộ"
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Slug <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                value={slug}
                onChange={handleChangeSlug}
                placeholder="giay-chay-bo"
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-4 font-mono text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              />

              <p className="mt-1 text-xs text-slate-500">
                Slug tự động tạo từ tên danh mục.
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Danh mục cha
              </label>

              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              >
                <option value="">— Không có, là danh mục gốc —</option>

                {parentCategories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <p className="mt-1 text-xs text-slate-500">
                Chỉ danh mục gốc được chọn làm danh mục cha.
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Mô tả
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nhập mô tả ngắn cho danh mục..."
                className="mt-2 min-h-[115px] w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">
              Ảnh đại diện
            </label>

            <label className="mt-2 flex h-[300px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 text-center hover:border-indigo-300 hover:bg-indigo-50/50">
              {preview ? (
                <div className="w-full">
                  <img
                    src={preview}
                    alt="Preview"
                    className="mx-auto h-52 w-full rounded-xl object-cover shadow-sm"
                  />

                  <p className="mt-3 text-sm font-semibold text-indigo-600">
                    Click để đổi ảnh
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex size-14 items-center justify-center rounded-full bg-white shadow-sm">
                    <UploadCloud className="size-7 text-slate-400" />
                  </div>

                  <p className="mt-4 text-sm font-semibold text-slate-700">
                    Click để chọn ảnh
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    PNG, JPG tối đa 2MB
                  </p>
                </>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleChangeFile}
                className="hidden"
              />
            </label>

            <div className="mt-3 rounded-xl bg-indigo-50 px-4 py-3 text-xs text-indigo-700">
              Nên dùng ảnh vuông, rõ nét để hiển thị đẹp trên danh sách.
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-60"
          >
            Hủy
          </button>

          <button
            type="submit"
            disabled={loading}
            className="h-11 rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Đang xử lý..." : isEdit ? "Lưu thay đổi" : "Thêm mới"}
          </button>
        </div>
      </form>
    </div>
  );
};

const createSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

export default AddForm;
