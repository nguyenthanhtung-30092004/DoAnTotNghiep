import { Copy, Edit, Loader2, Trash2 } from "lucide-react";
import React from "react";

const CouponTable = ({
  coupons = [],
  loading = false,
  onEdit,
  onDelete,
  onToggleActive,
  onCopy,
}) => {
  const formatMoney = (value) => {
    if (!value) return "0 ₫";
    return Number(value).toLocaleString("vi-VN") + " ₫";
  };

  const formatDiscount = (coupon) => {
    if (coupon.discountType === "PERCENT") {
      return `${coupon.discountValue}%`;
    }

    return formatMoney(coupon.discountValue);
  };

  const formatDate = (date) => {
    if (!date) return "Không có";
    return date.slice(0, 10);
  };

  const isExpired = (date) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  const getApplyToText = (applyTo) => {
    const map = {
      ALL: "Tất cả",
      CATEGORIES: "Danh mục",
      BRANDS: "Thương hiệu",
      PRODUCTS: "Sản phẩm",
    };

    return map[applyTo] || applyTo || "Tất cả";
  };

  const getUsagePercent = (coupon) => {
    if (!coupon.usageLimit) return 0;
    return Math.min(((coupon.usedCount || 0) / coupon.usageLimit) * 100, 100);
  };

  if (loading) {
    return (
      <div className="mt-6 flex justify-center rounded-2xl border border-slate-200 bg-white py-16">
        <Loader2 className="size-7 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (coupons.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-12 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-slate-100">
          <span className="text-2xl">🎟️</span>
        </div>

        <h3 className="mt-4 text-base font-bold text-slate-900">
          Chưa có mã giảm giá
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Hãy tạo mã giảm giá đầu tiên cho cửa hàng của bạn.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] text-left">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                Mã giảm giá
              </th>

              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                Loại giảm
              </th>

              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                Điều kiện
              </th>

              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                Thời gian
              </th>

              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                Lượt dùng
              </th>

              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">
                Trạng thái
              </th>

              <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {coupons.map((coupon) => (
              <tr key={coupon._id} className="hover:bg-slate-50/80">
                <td className="px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      %
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <code className="font-mono text-sm font-bold text-indigo-600">
                          {coupon.code}
                        </code>

                        <button
                          type="button"
                          onClick={() => onCopy(coupon.code)}
                          className="text-slate-400 hover:text-indigo-600"
                        >
                          <Copy className="size-3.5" />
                        </button>
                      </div>

                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {coupon.name}
                      </p>

                      <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                        {coupon.description || "Không có mô tả"}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <p className="text-sm font-bold text-slate-900">
                    {formatDiscount(coupon)}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {coupon.discountType === "PERCENT"
                      ? "Giảm phần trăm"
                      : "Giảm tiền cố định"}
                  </p>

                  {coupon.discountType === "PERCENT" && (
                    <p className="mt-1 text-xs text-slate-500">
                      Tối đa:{" "}
                      <span className="font-semibold text-slate-700">
                        {coupon.maxDiscount
                          ? formatMoney(coupon.maxDiscount)
                          : "Không giới hạn"}
                      </span>
                    </p>
                  )}
                </td>

                <td className="px-5 py-4">
                  <p className="text-sm font-medium text-slate-900">
                    Từ {formatMoney(coupon.minOrderValue)}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Áp dụng: {getApplyToText(coupon.applyTo)}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Mỗi user: {coupon.usageLimitPerUser || 1} lần
                  </p>
                </td>

                <td className="px-5 py-4">
                  <p className="text-xs text-slate-500">
                    Bắt đầu:{" "}
                    <span className="font-semibold text-slate-700">
                      {formatDate(coupon.startAt)}
                    </span>
                  </p>

                  <p
                    className={`mt-1 text-xs ${
                      isExpired(coupon.endAt)
                        ? "text-red-600"
                        : "text-slate-500"
                    }`}
                  >
                    Kết thúc:{" "}
                    <span className="font-semibold">
                      {formatDate(coupon.endAt)}
                    </span>
                  </p>
                </td>

                <td className="px-5 py-4">
                  <div className="w-36">
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-slate-500">Đã dùng</span>

                      <span className="font-semibold text-slate-900">
                        {coupon.usedCount || 0}/{coupon.usageLimit || "∞"}
                      </span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-indigo-600"
                        style={{
                          width: `${getUsagePercent(coupon)}%`,
                        }}
                      />
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() => onToggleActive(coupon)}
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
                      coupon.isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {coupon.isActive ? "Đang bật" : "Đã tắt"}
                  </button>

                  {isExpired(coupon.endAt) && (
                    <p className="mt-2 inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
                      Hết hạn
                    </p>
                  )}
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(coupon)}
                      className="flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      <Edit className="size-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(coupon)}
                      className="flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CouponTable;
