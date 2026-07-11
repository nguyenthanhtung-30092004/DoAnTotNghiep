const getFinalPrice = (price, salePrice) => {
  if (salePrice > 0 && salePrice < price) return salePrice;
  return price;
};

const calculateShippingFee = (subtotalAfterDiscount) => {
  return subtotalAfterDiscount >= 1000000 ? 0 : 30000;
};

module.exports = {
  getFinalPrice,
  calculateShippingFee,
};
