import { CalendarDays, Percent, Ticket, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import couponService from "../../../../services/coupon.service";

const initialForm = {
  code: "",
  name: "",
  description: "",
  discountType: "PERCENT",
  discountValue: "",
  maxDiscount: "",
  minOrderValue: "",
  startAt: "",
  endAt: "",
  usageLimit: "",
  usageLimitPerUser: 1,
  applyTo: "ALL",
  isActive: true,
};

const AddForm = ({ coupon = null, onClose, onSuccess }) => {
  const isEdit = Boolean(coupon);

  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!coupon) return;

    setFormData({
      code: coupon.code || "",
      name: coupon.name || "",
      description: coupon.description || "",
      discountType: coupon.discountType || "PERCENT",
      discountValue: coupon.discountValue || "",
      maxDiscount: coupon.maxDiscount || "",
      minOrderValue: coupon.minOrderValue || "",
      startAt: coupon.startAt ? coupon.startAt.slice(0, 10) : "",
      endAt: coupon.endAt ? coupon.endAt.slice(0, 10) : "",
      usageLimit: coupon.usageLimit || "",
      usageLimitPerUser: coupon.usageLimitPerUser || 1,
      applyTo: coupon.applyTo || "ALL",
      isActive: coupon.isActive ?? true,
    });
  }, [coupon]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleChangeCode = (e) => {
    setFormData((prev) => ({
      ...prev,
      code: e.target.value.toUpperCase(),
    }));
  };

  const validateForm = () => {
    if (!formData.code.trim()) {
      toast.warning("Vui lòng nhập mã giảm giá");
      return false;
    }

    if (!formData.name.trim()) {
      toast.warning("Vui lòng nhập tên mã giảm giá");
      return false;
    }

    if (!formData.discountValue) {
      toast.warning("Vui lòng nhập giá trị giảm");
      return false;
    }

    if (Number(formData.discountValue) <= 0) {
      toast.warning("Giá trị giảm phải lớn hơn 0");
      return false;
    }

    if (
      formData.discountType === "PERCENT" &&
      Number(formData.discountValue) > 100
    ) {
      toast.warning("Giảm phần trăm không được vượt quá 100%");
      return false;
    }

    if (!formData.startAt) {
      toast.warning("Vui lòng chọn ngày bắt đầu");
      return false;
    }

    if (!formData.endAt) {
      toast.warning("Vui lòng chọn ngày kết thúc");
      return false;
    }

    if (new Date(formData.startAt) >= new Date(formData.endAt)) {
      toast.warning("Ngày bắt đầu phải nhỏ hơn ngày kết thúc");
      return false;
    }

    if (Number(formData.usageLimitPerUser) < 1) {
      toast.warning("Lượt dùng mỗi người phải lớn hơn hoặc bằng 1");
      return false;
    }

    return true;
  };

  const buildPayload = () => {
    return {
      code: formData.code.trim().toUpperCase(),
      name: formData.name.trim(),
      description: formData.description.trim(),
      discountType: formData.discountType,
      discountValue: Number(formData.discountValue),
      maxDiscount: Number(formData.maxDiscount || 0),
      minOrderValue: Number(formData.minOrderValue || 0),
      startAt: formData.startAt,
      endAt: formData.endAt,
      usageLimit: Number(formData.usageLimit || 0),
      usageLimitPerUser: Number(formData.usageLimitPerUser || 1),
      applyTo: formData.applyTo,
      categories: [],
      brands: [],
      products: [],
      isActive: formData.isActive,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const payload = buildPayload();

      if (isEdit) {
        await couponService.updateCoupon(coupon._id, payload);
        toast.success("Cập nhật mã giảm giá thành công");
      } else {
        await couponService.createCoupon(payload);
        toast.success("Tạo mã giảm giá thành công");
      }

      await onSuccess();
      onClose();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-start gap-4">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Ticket className="size-6" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {isEdit ? "Cập nhật mã giảm giá" : "Thêm mã giảm giá mới"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {isEdit
                  ? "Chỉnh sửa thông tin mã giảm giá hiện tại"
                  : "Tạo mã giảm giá để áp dụng cho đơn hàng"}
              </p>
            </div>
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

        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-5">
              <div className="rounded-2xl border border-slate-200 p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Ticket className="size-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-900">Thông tin mã</h3>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Mã giảm giá <span className="text-red-500">*</span>
                    </label>

                    <input
                      name="code"
                      value={formData.code}
                      onChange={handleChangeCode}
                      placeholder="VD: SUMMER25"
                      className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-4 font-mono text-sm uppercase outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Tên mã <span className="text-red-500">*</span>
                    </label>

                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="VD: Giảm giá mùa hè"
                      className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Mô tả
                    </label>

                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Nhập mô tả ngắn cho mã giảm giá..."
                      className="mt-2 min-h-[100px] w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Percent className="size-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-900">
                    Thiết lập giảm giá
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Loại giảm
                    </label>

                    <select
                      name="discountType"
                      value={formData.discountType}
                      onChange={handleChange}
                      className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                    >
                      <option value="PERCENT">Giảm theo phần trăm</option>
                      <option value="FIXED">Giảm số tiền cố định</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Giá trị giảm <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="number"
                      name="discountValue"
                      value={formData.discountValue}
                      onChange={handleChange}
                      min="0"
                      placeholder={
                        formData.discountType === "PERCENT"
                          ? "VD: 25"
                          : "VD: 50000"
                      }
                      className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Đơn tối thiểu
                    </label>

                    <input
                      type="number"
                      name="minOrderValue"
                      value={formData.minOrderValue}
                      onChange={handleChange}
                      min="0"
                      placeholder="VD: 500000"
                      className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Giảm tối đa
                    </label>

                    <input
                      type="number"
                      name="maxDiscount"
                      value={formData.maxDiscount}
                      onChange={handleChange}
                      min="0"
                      placeholder="VD: 100000"
                      className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-2xl border border-slate-200 p-5">
                <div className="mb-4 flex items-center gap-2">
                  <CalendarDays className="size-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-900">
                    Thời gian & lượt dùng
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Ngày bắt đầu <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="date"
                      name="startAt"
                      value={formData.startAt}
                      onChange={handleChange}
                      className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Ngày kết thúc <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="date"
                      name="endAt"
                      value={formData.endAt}
                      onChange={handleChange}
                      className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Tổng lượt dùng
                    </label>

                    <input
                      type="number"
                      name="usageLimit"
                      value={formData.usageLimit}
                      onChange={handleChange}
                      min="0"
                      placeholder="0 là không giới hạn"
                      className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Lượt dùng mỗi người
                    </label>

                    <input
                      type="number"
                      name="usageLimitPerUser"
                      value={formData.usageLimitPerUser}
                      onChange={handleChange}
                      min="1"
                      placeholder="VD: 1"
                      className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Phạm vi áp dụng
                    </label>

                    <select
                      name="applyTo"
                      value={formData.applyTo}
                      onChange={handleChange}
                      className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                    >
                      <option value="ALL">Tất cả sản phẩm</option>
                      <option value="CATEGORIES">Theo danh mục</option>
                      <option value="BRANDS">Theo thương hiệu</option>
                      <option value="PRODUCTS">Theo sản phẩm</option>
                    </select>

                    <p className="mt-2 rounded-xl bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-700">
                      Hiện tại form chỉ gửi phạm vi. Nếu chọn danh mục, thương
                      hiệu hoặc sản phẩm thì cần làm thêm select chọn ID tương
                      ứng.
                    </p>
                  </div>

                  <label className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="size-4"
                    />
                    Kích hoạt mã sau khi lưu
                  </label>
                </div>
              </div>

              <div className="rounded-2xl bg-indigo-50 px-4 py-4 text-sm leading-6 text-indigo-700">
                <p className="font-bold">Gợi ý:</p>
                <p>
                  Mã phần trăm nên đặt giảm tối đa để tránh giảm quá nhiều cho
                  đơn hàng giá trị cao.
                </p>
              </div>
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

export default AddForm;
