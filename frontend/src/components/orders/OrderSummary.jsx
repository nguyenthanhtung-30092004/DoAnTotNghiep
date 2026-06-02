import React from 'react';

const SummaryRow = ({ label, value }) => {
  return (
    <div className="flex justify-between text-zinc-500">
      <span>{label}</span>
      <span className="text-zinc-950 tabular-nums">{value}</span>
    </div>
  );
};

const OrderSummary = ({ order, formatPrice }) => {
  return (
    <div className="border border-zinc-200 bg-white p-8">
      <h2 className="mb-6 text-[11px] font-black uppercase tracking-[0.15em] text-zinc-950">
        Tóm tắt đơn hàng
      </h2>

      <div className="space-y-4 text-[10px] font-bold uppercase tracking-wider">
        <SummaryRow
          label="Tạm tính"
          value={formatPrice(order.totalPrice)}
        />

        {order.totalDiscount > 0 && (
          <SummaryRow
            label="Giảm sản phẩm"
            value={`-${formatPrice(order.totalDiscount)}`}
          />
        )}

        {order.couponDiscount > 0 && (
          <SummaryRow
            label={`Mã giảm giá ${
              order.coupon?.code ? `(${order.coupon.code})` : ""
            }`}
            value={`-${formatPrice(order.couponDiscount)}`}
          />
        )}

        <SummaryRow
          label="Phí vận chuyển"
          value={
            Number(order.shippingFee) === 0
              ? "Miễn phí"
              : formatPrice(order.shippingFee)
          }
        />

        <div className="my-4 h-px bg-zinc-200"></div>

        <div className="flex justify-between items-center">
          <span className="text-[11px] font-black uppercase tracking-widest text-zinc-500">Tổng cộng</span>
          <span className="text-xl font-black text-zinc-950">{formatPrice(order.finalPrice)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
