const normalizeCouponCode = (code) => {
  return String(code || "")
    .trim()
    .toUpperCase();
};

const calculateCouponDiscount = (coupon, eligibleAmount) => {
  let discount = 0;

  if (coupon.discountType === "PERCENT") {
    discount = eligibleAmount * (coupon.discountValue / 100);

    if (coupon.maxDiscount > 0) {
      discount = Math.min(discount, coupon.maxDiscount);
    }
  }

  if (coupon.discountType === "FIXED") {
    discount = coupon.discountValue;
  }

  return Math.round(Math.min(discount, eligibleAmount));
};

module.exports = {
  normalizeCouponCode,
  calculateCouponDiscount,
};
