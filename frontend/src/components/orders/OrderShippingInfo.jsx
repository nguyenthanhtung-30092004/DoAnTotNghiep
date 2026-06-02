import React from 'react';
import { PAYMENT_METHOD_LABELS, PAYMENT_STATUS_LABELS } from "../../constants/payment.constants";

const InfoItem = ({ label, value }) => {
  return (
    <div>
      <p className="mb-2 text-[10px] font-black uppercase tracking-[0.15em] text-zinc-500">{label}</p>
      <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-950">
        {value || "Chưa cập nhật"}
      </p>
    </div>
  );
};

const OrderShippingInfo = ({ order, shippingAddress }) => {
  return (
    <div className="border border-zinc-200 bg-white p-8">
      <h2 className="mb-6 text-[11px] font-black uppercase tracking-[0.15em] text-zinc-950">
        Thông tin giao hàng
      </h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <InfoItem
          label="Khách hàng"
          value={shippingAddress.fullName}
        />

        <InfoItem
          label="Số điện thoại"
          value={shippingAddress.phone}
        />

        <InfoItem
          label="Địa chỉ"
          value={`${shippingAddress.detailAddress || ""}, ${
            shippingAddress.ward || ""
          }, ${shippingAddress.district || ""}, ${
            shippingAddress.province || ""
          }`}
        />

        <InfoItem
          label="Phương thức thanh toán"
          value={PAYMENT_METHOD_LABELS[order.paymentMethod]}
        />

        <InfoItem
          label="Trạng thái thanh toán"
          value={PAYMENT_STATUS_LABELS[order.paymentStatus]}
        />

        {order.transactionId && (
          <InfoItem
            label="Mã giao dịch"
            value={order.transactionId}
          />
        )}

        {order.note && (
          <InfoItem label="Ghi chú" value={order.note} />
        )}
      </div>
    </div>
  );
};

export default OrderShippingInfo;
