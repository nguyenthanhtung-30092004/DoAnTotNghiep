import { ImagePlus, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AddBrandForm = ({ onClose, onConfirm, brand }) => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");

  const [formData, setFormData] = useState({
    nameBrand: "",
    slugBrand: "",
    description: "",
    outStanding: false,
    logoBrand: null,
  });

  const slugify = (text) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  useEffect(() => {
    if (brand) {
      setFormData({
        nameBrand: brand.nameBrand || "",
        slugBrand: brand.slugBrand || "",
        description: brand.description || "",
        outStanding: Boolean(brand.outStanding),
        logoBrand: null,
      });

      setPreview(brand.logoBrand || "");
    }
  }, [brand]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      const file = files?.[0];

      setFormData((prev) => ({
        ...prev,
        logoBrand: file || null,
      }));

      if (file) {
        setPreview(URL.createObjectURL(file));
      }

      return;
    }

    if (name === "nameBrand") {
      setFormData((prev) => ({
        ...prev,
        nameBrand: value,
        slugBrand: slugify(value),
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nameBrand.trim()) {
      toast.error("Vui lòng nhập tên thương hiệu");
      return;
    }

    if (!formData.slugBrand.trim()) {
      toast.error("Slug thương hiệu không được để trống");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Vui lòng nhập mô tả thương hiệu");
      return;
    }

    if (!brand && !formData.logoBrand) {
      toast.error("Vui lòng upload logo thương hiệu");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append("nameBrand", formData.nameBrand.trim());
      data.append("slugBrand", formData.slugBrand.trim());
      data.append("description", formData.description.trim());
      data.append("outStanding", formData.outStanding ? "true" : "false");

      if (formData.logoBrand) {
        data.append("logoBrand", formData.logoBrand);
      }

      await onConfirm(data);

      toast.success(
        brand
          ? "Cập nhật thương hiệu thành công"
          : "Thêm thương hiệu thành công",
      );

      onClose();
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message ||
          (brand
            ? "Cập nhật thương hiệu thất bại"
            : "Thêm thương hiệu thất bại"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {brand ? "Cập nhật thương hiệu" : "Thêm thương hiệu"}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {brand
                ? "Chỉnh sửa thông tin thương hiệu"
                : "Tạo thương hiệu mới cho cửa hàng"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-500"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Logo thương hiệu
            </label>

            <label className="h-32 rounded-lg border border-dashed border-slate-300 hover:border-indigo-400 flex items-center justify-center cursor-pointer overflow-hidden bg-slate-50">
              {preview ? (
                <img
                  src={preview}
                  alt="Logo preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-center text-slate-500">
                  <ImagePlus className="size-7 mx-auto mb-2" />
                  <p className="text-sm font-medium">Chọn ảnh logo</p>
                  <p className="text-xs mt-1">PNG, JPG, JPEG</p>
                </div>
              )}

              <input
                type="file"
                name="logoBrand"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </label>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Tên thương hiệu
            </label>
            <input
              type="text"
              name="nameBrand"
              value={formData.nameBrand}
              onChange={handleChange}
              placeholder="VD: Nike Việt Nam"
              className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Slug thương hiệu
            </label>
            <input
              type="text"
              name="slugBrand"
              value={formData.slugBrand}
              readOnly
              placeholder="VD: nike-viet-nam"
              className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm outline-none bg-slate-50 text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Mô tả
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Nhập mô tả thương hiệu..."
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              name="outStanding"
              checked={formData.outStanding}
              onChange={handleChange}
              className="h-4 w-4 accent-indigo-600"
            />
            Đánh dấu là thương hiệu nổi bật
          </label>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="h-10 px-4 rounded-lg border border-slate-300 text-sm font-semibold hover:bg-slate-50 disabled:opacity-60"
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={loading}
              className="h-10 px-5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading
                ? "Đang lưu..."
                : brand
                  ? "Cập nhật"
                  : "Thêm thương hiệu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBrandForm;
