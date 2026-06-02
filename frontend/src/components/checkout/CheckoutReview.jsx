import React from 'react';
import { Link } from "react-router-dom";
import { Loader2, LockKeyhole, ShoppingCart } from "lucide-react";
import { PAYMENT_METHOD_LABELS, PAYMENT_METHODS } from "../../constants/payment.constants";

const CheckoutReview = ({
  shippingAddress,
  paymentMethod,
  totalQuantity,
  items,
  getItemPrice,
  getProductLink,
  formatPrice,
  setStatus,
  handlePlaceOrder,
  placingOrder,
}) => {
  return (
    <div className="space-y-6">
      <div className="border border-zinc-200 p-8 bg-white">
        <h2 className="mb-6 text-sm font-black uppercase tracking-widest text-zinc-950">Xem lại đơn hàng</h2>

        <div className="mb-6 flex items-start justify-between border-b border-zinc-200 pb-6">
          <div>
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.15em] text-zinc-500">
              Giao tới
            </p>
            <p className="text-[11px] font-black uppercase tracking-widest text-zinc-950">{shippingAddress.fullName}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mt-1">{shippingAddress.phone}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mt-1">
              {shippingAddress.detailAddress}, {shippingAddress.ward},{" "}
              {shippingAddress.district}, {shippingAddress.province}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setStatus(1)}
            className="text-[10px] font-black uppercase tracking-widest text-teal-600 hover:text-teal-700"
          >
            Chỉnh sửa
          </button>
        </div>

        <div className="mb-6 flex items-center justify-between border-b border-zinc-200 pb-6">
          <div>
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.15em] text-zinc-500">
              Thanh toán
            </p>
            <p className="text-[11px] font-black uppercase tracking-widest text-zinc-950">{PAYMENT_METHOD_LABELS[paymentMethod]}</p>
          </div>

          <button
            type="button"
            onClick={() => setStatus(2)}
            className="text-[10px] font-black uppercase tracking-widest text-teal-600 hover:text-teal-700"
          >
            Sửa
          </button>
        </div>

        <p className="mb-4 text-[10px] font-black uppercase tracking-[0.15em] text-zinc-500">
          Sản phẩm ({totalQuantity})
        </p>

        <div className="space-y-4">
          {items.map((item) => {
            const itemPrice = getItemPrice(item);
            const itemTotal = itemPrice * Number(item.quantity || 0);

            return (
              <div key={item._id} className="flex items-center gap-4">
                <Link
                  to={getProductLink(item)}
                  className="flex size-16 shrink-0 items-center justify-center overflow-hidden border border-zinc-200 bg-zinc-50"
                >
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.productName}
                      className="h-full w-full object-cover mix-blend-multiply"
                    />
                  ) : (
                    <ShoppingCart className="size-6 text-zinc-300" />
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
      </div>

      <button
        onClick={handlePlaceOrder}
        disabled={placingOrder}
        className="inline-flex h-14 w-full items-center justify-center gap-2 bg-zinc-950 text-white font-black uppercase tracking-[0.1em] text-xs transition-all duration-200 hover:bg-teal-600 disabled:opacity-60"
      >
        {placingOrder ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <LockKeyhole className="size-4" />
        )}
        {paymentMethod === PAYMENT_METHODS.COD ? "Đặt hàng COD" : "Thanh toán VNPAY"}
      </button>
    </div>
  );
};

export default CheckoutReview;
