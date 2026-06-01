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
      <div className="space-y-6">
        <div className="border border-zinc-200 p-8 lg:sticky lg:top-20 bg-white">
          <h2 className="mb-6 text-sm font-black uppercase tracking-widest text-zinc-950">Tóm tắt đơn hàng</h2>

          <div className="mb-4 space-y-3 border-b border-border pb-4">
            {items.map((item) => {
              const itemPrice = getItemPrice(item);
              const itemTotal = itemPrice * Number(item.quantity || 0);

              return (
                <div key={item._id} className="flex items-center gap-3">
                  <Link
                    to={getProductLink(item)}
                    className="flex size-14 shrink-0 items-center justify-center overflow-hidden border border-zinc-200 bg-zinc-50"
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="h-full w-full object-cover mix-blend-multiply"
                      />
                    ) : (
                      <ShoppingCart className="size-5 text-zinc-300" />
                    )}
                  </Link>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-black uppercase tracking-widest text-zinc-950">
                      {item.productName || item.product?.name}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mt-1">
                      Size {item.size} | SL {item.quantity}
                    </p>
                  </div>

                  <p className="shrink-0 text-sm font-black text-teal-600 tabular-nums">
                    {formatPrice(itemTotal)}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mb-6 border-b border-zinc-200 pb-6">
            {appliedCoupon ? (
              <div className="border border-teal-200 bg-teal-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-widest text-teal-700">
                      Đã áp dụng {appliedCoupon.code}
                    </p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-teal-600">
                      Giảm {formatPrice(couponDiscount)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-[10px] font-black uppercase tracking-widest text-teal-700 hover:text-red-600"
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
                  className="h-12 min-w-0 flex-1 border border-zinc-200 bg-zinc-50 px-4 text-xs font-bold uppercase tracking-widest outline-none focus:bg-white focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={applyingCoupon}
                  className="inline-flex h-12 items-center justify-center border border-zinc-950 bg-zinc-950 text-white px-6 text-[10px] font-black uppercase tracking-[0.1em] hover:bg-teal-600 hover:border-teal-600 transition-colors disabled:opacity-60"
                >
                  {applyingCoupon ? <Loader2 className="size-4 animate-spin" /> : "Áp dụng"}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4 text-sm font-bold">
            <div className="flex justify-between text-zinc-500">
              <span className="text-[11px] uppercase tracking-wider">Tạm tính ({totalQuantity})</span>
              <span className="tabular-nums text-zinc-950">{formatPrice(subtotal)}</span>
            </div>

            {productDiscount > 0 && (
              <div className="flex justify-between text-zinc-500">
                <span className="text-[11px] uppercase tracking-wider">Giảm sản phẩm</span>
                <span className="text-red-500 tabular-nums">
                  -{formatPrice(productDiscount)}
                </span>
              </div>
            )}

            {couponDiscount > 0 && (
              <div className="flex justify-between text-zinc-500">
                <span className="text-[11px] uppercase tracking-wider">
                  Mã giảm giá {appliedCoupon?.code && `(${appliedCoupon.code})`}
                </span>
                <span className="text-red-500 tabular-nums">
                  -{formatPrice(couponDiscount)}
                </span>
              </div>
            )}

            <div className="flex justify-between text-zinc-500">
              <span className="text-[11px] uppercase tracking-wider">Vận chuyển</span>
              <span className="text-teal-600 tabular-nums">
                {shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}
              </span>
            </div>

            <div className="mt-4 border-t border-zinc-200 pt-4">
              <div className="flex justify-between items-center text-zinc-500">
                <span className="text-[11px] font-black uppercase tracking-wider">Tổng cộng</span>
                <span className="text-xl font-black text-zinc-950 tabular-nums">{formatPrice(finalPrice)}</span>
              </div>
            </div>

            <p className="pt-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Tổng tiền cuối cùng sẽ được tính lại khi đặt hàng.
            </p>
          </div>
        </div>

        <div className="space-y-4 border border-zinc-200 p-6 bg-white">
          <div className="flex items-center gap-3">
            <Shield className="size-5 text-teal-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Bảo vệ người mua</span>
          </div>

          <div className="flex items-center gap-3">
            <RotateCcw className="size-5 text-teal-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Đổi trả trong 30 ngày</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSummary;
