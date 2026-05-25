export const DISCOUNT_TYPE = {
  PERCENT: "PERCENT",
  FIXED: "FIXED",
};

export const COUPON_APPLY_TO = {
  ALL: "ALL",
  CATEGORIES: "CATEGORIES",
  BRANDS: "BRANDS",
  PRODUCTS: "PRODUCTS",
  USERS: "USERS",
};

export const DISCOUNT_TYPE_LABELS = {
  [DISCOUNT_TYPE.PERCENT]: "Phần trăm",
  [DISCOUNT_TYPE.FIXED]: "Số tiền cố định",
};

export const COUPON_APPLY_TO_LABELS = {
  [COUPON_APPLY_TO.ALL]: "Tất cả",
  [COUPON_APPLY_TO.CATEGORIES]: "Danh mục",
  [COUPON_APPLY_TO.BRANDS]: "Thương hiệu",
  [COUPON_APPLY_TO.PRODUCTS]: "Sản phẩm",
  [COUPON_APPLY_TO.USERS]: "Người dùng",
};

export const DISCOUNT_TYPE_OPTIONS = Object.values(DISCOUNT_TYPE).map(
  (value) => ({
    value,
    label: DISCOUNT_TYPE_LABELS[value],
  }),
);

export const DISCOUNT_TYPE_FILTER_OPTIONS = [
  {
    value: "",
    label: "Tất cả loại giảm",
  },
  ...DISCOUNT_TYPE_OPTIONS,
];

export const COUPON_APPLY_TO_OPTIONS = Object.values(COUPON_APPLY_TO).map(
  (value) => ({
    value,
    label: COUPON_APPLY_TO_LABELS[value],
  }),
);

export const COUPON_APPLY_TO_FILTER_OPTIONS = [
  {
    value: "",
    label: "Tất cả phạm vi",
  },
  ...COUPON_APPLY_TO_OPTIONS,
];

export const COUPON_APPLY_TO_FORM_OPTIONS = COUPON_APPLY_TO_OPTIONS.filter(
  (option) => option.value !== COUPON_APPLY_TO.USERS,
);

