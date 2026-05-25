export const PAYMENT_METHODS = {
  COD: "COD",
  VNPAY: "VNPAY",
};

export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  PAID: "PAID",
  FAILED: "FAILED",
  RETURNED: "RETURNED",
};

export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHODS.COD]: "Thanh toán khi nhận hàng",
  [PAYMENT_METHODS.VNPAY]: "Thanh toán VNPAY",
};

export const PAYMENT_STATUS_LABELS = {
  [PAYMENT_STATUS.PENDING]: "Chưa thanh toán",
  [PAYMENT_STATUS.PAID]: "Đã thanh toán",
  [PAYMENT_STATUS.FAILED]: "Thanh toán thất bại",
  [PAYMENT_STATUS.RETURNED]: "Đã hoàn tiền",
};

export const PAYMENT_METHOD_OPTIONS = Object.values(PAYMENT_METHODS).map(
  (value) => ({
    value,
    label: value,
  }),
);

export const PAYMENT_METHOD_FILTER_OPTIONS = [
  {
    value: "",
    label: "Tất cả phương thức",
  },
  ...PAYMENT_METHOD_OPTIONS,
];

export const PAYMENT_STATUS_FILTER_OPTIONS = [
  {
    value: "",
    label: "Tất cả thanh toán",
  },
  ...Object.values(PAYMENT_STATUS).map((value) => ({
    value,
    label: PAYMENT_STATUS_LABELS[value],
  })),
];

