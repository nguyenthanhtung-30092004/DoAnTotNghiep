import React from "react";
import { Link } from "react-router-dom";
import { Loader2, Shield, RotateCcw, ShoppingCart } from "lucide-react";

const CheckoutSummary = ({
  items,
  getProductLink,
  formatPrice,
  getItemPrice,
  totalQuantity,
  subtotal,
  productDiscount,
  appliedCoupon,
  couponDiscount,
  handleRemoveCoupon,
  couponCode,
  setCouponCode,
  handleApplyCoupon,
  applyingCoupon,
  shippingFee,
  finalPrice,
}) => {
  return (
    <div className="shrink-0 lg:w-80">
      <div className="space-y-4">
        <div className="rounded-2xl bg-card p-6 shadow-card lg:sticky lg:top-20">
          <h2 className="mb-4 text-lg font-bold">Tóm tắt đơn hàng</h2>

          <div className="mb-4 space-y-3 border-b border-border pb-4">
            {items.map((item) => {
              const itemPrice = getItemPrice(item);
              const itemTotal = itemPrice * Number(item.quantity || 0);

              return (
                <div key={item._id} className="flex items-center gap-3">
                  <Link
                    to={getProductLink(item)}
                    className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-accent"
                  >
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.productName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ShoppingCart className="size-4 text-muted-foreground" />
                    )}
                  </Link>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium">
                      {item.productName || item.product?.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Size {item.size} | SL {item.quantity}
                    </p>
                  </div>

                  <p className="shrink-0 text-xs font-semibold tabular-nums">
                    {formatPrice(itemTotal)}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mb-4 border-b border-border pb-4">
            {appliedCoupon ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-emerald-700">
                      Đã áp dụng {appliedCoupon.code}
                    </p>
                    <p className="mt-1 text-xs text-emerald-600">
                      Giảm {formatPrice(couponDiscount)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-xs font-semibold text-emerald-700 hover:text-red-600"
                  >
                    Bỏ mã
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Mã giảm giá"
                  className="h-10 min-w-0 flex-1 rounded-xl border border-border bg-background px-3 text-sm uppercase outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={applyingCoupon}
                  className="inline-flex h-10 items-center justify-center rounded-xl border px-4 text-sm font-semibold hover:bg-accent disabled:opacity-60"
                >
                  {applyingCoupon ? <Loader2 className="size-4 animate-spin" /> : "Áp dụng"}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tạm tính ({totalQuantity})</span>
              <span className="font-medium tabular-nums">{formatPrice(subtotal)}</span>
            </div>

            {productDiscount > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Giảm sản phẩm</span>
                <span className="font-medium text-red-500 tabular-nums">
                  -{formatPrice(productDiscount)}
                </span>
              </div>
            )}

            {couponDiscount > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Mã giảm giá {appliedCoupon?.code && `(${appliedCoupon.code})`}
                </span>
                <span className="font-medium text-red-500 tabular-nums">
                  -{formatPrice(couponDiscount)}
                </span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-muted-foreground">Vận chuyển</span>
              <span className="font-semibold text-primary">
                {shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}
              </span>
            </div>

            <div className="mt-2 border-t border-border pt-3">
              <div className="flex justify-between">
                <span className="font-bold">Tổng cộng</span>
                <span className="text-lg font-bold tabular-nums">{formatPrice(finalPrice)}</span>
              </div>
            </div>

            <p className="pt-2 text-xs text-muted-foreground">
              Tổng tiền cuối cùng sẽ được backend tính lại khi đặt hàng.
            </p>
          </div>
        </div>

        <div className="space-y-3 rounded-2xl bg-card p-5 shadow-card">
          <div className="flex items-center gap-3">
            <Shield className="size-4 text-primary" />
            <span className="text-xs text-muted-foreground">Bảo vệ người mua</span>
          </div>

          <div className="flex items-center gap-3">
            <RotateCcw className="size-4 text-primary" />
            <span className="text-xs text-muted-foreground">Đổi trả trong 30 ngày</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSummary;
