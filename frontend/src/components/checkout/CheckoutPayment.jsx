import React from 'react';
import { toast } from 'react-toastify';
import { PAYMENT_METHOD_LABELS, PAYMENT_METHODS } from "../../constants/payment.constants";
import { Banknote, CreditCard } from "lucide-react";

const paymentMethods = [
  {
    value: PAYMENT_METHODS.COD,
    title: PAYMENT_METHOD_LABELS.COD,
    description: "Thanh toán bằng tiền mặt khi đơn hàng được giao tới bạn",
    icon: Banknote,
    disabled: false,
  },
  {
    value: PAYMENT_METHODS.VNPAY,
    title: PAYMENT_METHOD_LABELS.VNPAY,
    description: "Thanh toán qua cổng VNPAY",
    icon: CreditCard,
    disabled: false,
  },
];

const CheckoutPayment = ({
  paymentMethod,
  setPaymentMethod,
  setStatus,
  handleNextToReview,
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4 border border-zinc-200 p-8 bg-white">
        <h2 className="text-sm font-black uppercase tracking-widest text-zinc-950">Phương thức thanh toán</h2>

        {paymentMethods.map((method) => {
          const Icon = method.icon;
          const isSelected = paymentMethod === method.value;

          return (
            <button
              key={method.value}
              type="button"
              disabled={method.disabled}
              onClick={() => {
                if (method.disabled) {
                  toast.info("Phương thức này sẽ được hỗ trợ sau");
                  return;
                }

                setPaymentMethod(method.value);
              }}
              className={`w-full flex items-center gap-4 border p-5 text-left duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${
                isSelected
                  ? "border-teal-600 bg-teal-50"
                  : "border-zinc-200 bg-zinc-50 hover:border-teal-600/50 hover:bg-white"
              }`}
            >
              <div
                className={`flex size-12 shrink-0 items-center justify-center ${
                  isSelected
                    ? "bg-teal-600 text-white"
                    : "bg-zinc-200 text-zinc-500"
                }`}
              >
                <Icon className="size-5" />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-[11px] font-black uppercase tracking-widest">{method.title}</p>

                  {method.disabled && (
                    <span className="bg-zinc-200 px-2 py-1 text-[8px] font-black uppercase tracking-widest text-zinc-500">
                      Sắp có
                    </span>
                  )}
                </div>

                <p className="mt-1 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{method.description}</p>
              </div>

              <div
                className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${
                  isSelected ? "border-teal-600" : "border-zinc-300"
                }`}
              >
                {isSelected && <div className="size-2.5 rounded-full bg-teal-600" />}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setStatus(1)}
          type="button"
          className="inline-flex h-14 flex-1 items-center justify-center border border-zinc-200 bg-white text-[10px] font-black uppercase tracking-widest transition-all duration-200 hover:bg-zinc-50"
        >
          Quay lại
        </button>

        <button
          onClick={handleNextToReview}
          type="button"
          className="inline-flex h-14 flex-1 items-center justify-center bg-zinc-950 text-white text-[10px] font-black uppercase tracking-widest transition-all duration-200 hover:bg-teal-600"
        >
          Xem lại đơn hàng
        </button>
      </div>
    </div>
  );
};

export default CheckoutPayment;
