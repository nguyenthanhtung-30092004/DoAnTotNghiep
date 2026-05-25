import { CalendarDays, Percent, Ticket, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  COUPON_APPLY_TO,
  COUPON_APPLY_TO_FORM_OPTIONS,
  DISCOUNT_TYPE,
  DISCOUNT_TYPE_OPTIONS,
} from "../../../constants/coupon.constants";
import couponService from "../../../services/coupon.service";

const initialForm = {
  code: "",
  name: "",
  description: "",
  discountType: DISCOUNT_TYPE.PERCENT,
  discountValue: "",
  maxDiscount: "",
  minOrderValue: "",
  startAt: "",
  endAt: "",
  usageLimit: "",
  usageLimitPerUser: 1,
  applyTo: COUPON_APPLY_TO.ALL,
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
      discountType: coupon.discountType || DISCOUNT_TYPE.PERCENT,
      discountValue: coupon.discountValue || "",
      maxDiscount: coupon.maxDiscount || "",
      minOrderValue: coupon.minOrderValue || "",
      startAt: coupon.startAt ? coupon.startAt.slice(0, 10) : "",
      endAt: coupon.endAt ? coupon.endAt.slice(0, 10) : "",
      usageLimit: coupon.usageLimit || "",
      usageLimitPerUser: coupon.usageLimitPerUser || 1,
      applyTo: coupon.applyTo || COUPON_APPLY_TO.ALL,
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
      toast.warning("Vui lÃ²ng nháº­p mÃ£ giáº£m giÃ¡");
      return false;
    }

    if (!formData.name.trim()) {
      toast.warning("Vui lÃ²ng nháº­p tÃªn mÃ£ giáº£m giÃ¡");
      return false;
    }

    if (!formData.discountValue) {
      toast.warning("Vui lÃ²ng nháº­p giÃ¡ trá»‹ giáº£m");
      return false;
    }

    if (Number(formData.discountValue) <= 0) {
      toast.warning("GiÃ¡ trá»‹ giáº£m pháº£i lá»›n hÆ¡n 0");
      return false;
    }

    if (
      formData.discountType === DISCOUNT_TYPE.PERCENT &&
      Number(formData.discountValue) > 100
    ) {
      toast.warning("Giáº£m pháº§n trÄƒm khÃ´ng Ä‘Æ°á»£c vÆ°á»£t quÃ¡ 100%");
      return false;
    }

    if (!formData.startAt) {
      toast.warning("Vui lÃ²ng chá»n ngÃ y báº¯t Ä‘áº§u");
      return false;
    }

    if (!formData.endAt) {
      toast.warning("Vui lÃ²ng chá»n ngÃ y káº¿t thÃºc");
      return false;
    }

    if (new Date(formData.startAt) >= new Date(formData.endAt)) {
      toast.warning("NgÃ y báº¯t Ä‘áº§u pháº£i nhá» hÆ¡n ngÃ y káº¿t thÃºc");
      return false;
    }

    if (Number(formData.usageLimitPerUser) < 1) {
      toast.warning("LÆ°á»£t dÃ¹ng má»—i ngÆ°á»i pháº£i lá»›n hÆ¡n hoáº·c báº±ng 1");
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
        toast.success("Cáº­p nháº­t mÃ£ giáº£m giÃ¡ thÃ nh cÃ´ng");
      } else {
        await couponService.createCoupon(payload);
        toast.success("Táº¡o mÃ£ giáº£m giÃ¡ thÃ nh cÃ´ng");
      }

      await onSuccess();
      onClose();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "CÃ³ lá»—i xáº£y ra");
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
                {isEdit ? "Cáº­p nháº­t mÃ£ giáº£m giÃ¡" : "ThÃªm mÃ£ giáº£m giÃ¡ má»›i"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {isEdit
                  ? "Chá»‰nh sá»­a thÃ´ng tin mÃ£ giáº£m giÃ¡ hiá»‡n táº¡i"
                  : "Táº¡o mÃ£ giáº£m giÃ¡ Ä‘á»ƒ Ã¡p dá»¥ng cho Ä‘Æ¡n hÃ ng"}
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
                  <h3 className="font-bold text-slate-900">ThÃ´ng tin mÃ£</h3>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      MÃ£ giáº£m giÃ¡ <span className="text-red-500">*</span>
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
                      TÃªn mÃ£ <span className="text-red-500">*</span>
                    </label>

                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="VD: Giáº£m giÃ¡ mÃ¹a hÃ¨"
                      className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700">
                      MÃ´ táº£
                    </label>

                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Nháº­p mÃ´ táº£ ngáº¯n cho mÃ£ giáº£m giÃ¡..."
                      className="mt-2 min-h-[100px] w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Percent className="size-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-900">
                    Thiáº¿t láº­p giáº£m giÃ¡
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Loáº¡i giáº£m
                    </label>

                    <select
                      name="discountType"
                      value={formData.discountType}
                      onChange={handleChange}
                      className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                    >
                      {DISCOUNT_TYPE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      GiÃ¡ trá»‹ giáº£m <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="number"
                      name="discountValue"
                      value={formData.discountValue}
                      onChange={handleChange}
                      min="0"
                      placeholder={
                        formData.discountType === DISCOUNT_TYPE.PERCENT
                          ? "VD: 25"
                          : "VD: 50000"
                      }
                      className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      ÄÆ¡n tá»‘i thiá»ƒu
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
                      Giáº£m tá»‘i Ä‘a
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
                    Thá»i gian & lÆ°á»£t dÃ¹ng
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      NgÃ y báº¯t Ä‘áº§u <span className="text-red-500">*</span>
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
                      NgÃ y káº¿t thÃºc <span className="text-red-500">*</span>
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
                      Tá»•ng lÆ°á»£t dÃ¹ng
                    </label>

                    <input
                      type="number"
                      name="usageLimit"
                      value={formData.usageLimit}
                      onChange={handleChange}
                      min="0"
                      placeholder="0 lÃ  khÃ´ng giá»›i háº¡n"
                      className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      LÆ°á»£t dÃ¹ng má»—i ngÆ°á»i
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
                      Pháº¡m vi Ã¡p dá»¥ng
                    </label>

                    <select
                      name="applyTo"
                      value={formData.applyTo}
                      onChange={handleChange}
                      className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                    >
                      {COUPON_APPLY_TO_FORM_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>

                    <p className="mt-2 rounded-xl bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-700">
                      Hiá»‡n táº¡i form chá»‰ gá»­i pháº¡m vi. Náº¿u chá»n danh má»¥c, thÆ°Æ¡ng
                      hiá»‡u hoáº·c sáº£n pháº©m thÃ¬ cáº§n lÃ m thÃªm select chá»n ID tÆ°Æ¡ng
                      á»©ng.
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
                    KÃ­ch hoáº¡t mÃ£ sau khi lÆ°u
                  </label>
                </div>
              </div>

              <div className="rounded-2xl bg-indigo-50 px-4 py-4 text-sm leading-6 text-indigo-700">
                <p className="font-bold">Gá»£i Ã½:</p>
                <p>
                  MÃ£ pháº§n trÄƒm nÃªn Ä‘áº·t giáº£m tá»‘i Ä‘a Ä‘á»ƒ trÃ¡nh giáº£m quÃ¡ nhiá»u cho
                  Ä‘Æ¡n hÃ ng giÃ¡ trá»‹ cao.
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
            Há»§y
          </button>

          <button
            type="submit"
            disabled={loading}
            className="h-11 rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Äang xá»­ lÃ½..." : isEdit ? "LÆ°u thay Ä‘á»•i" : "ThÃªm má»›i"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddForm;

