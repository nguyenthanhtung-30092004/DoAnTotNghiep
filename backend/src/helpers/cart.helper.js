const getFinalItemPrice = (price, salePrice) => {
  if (salePrice > 0 && salePrice < price) return salePrice;
  return price;
};

const calculateCartTotal = (items = []) => {
  return items.reduce(
    (total, item) => {
      const originalPrice = item.price * item.quantity;
      const finalPrice = getFinalItemPrice(item.price, item.salePrice) * item.quantity;

      total.totalQuantity += item.quantity;
      total.totalPrice += originalPrice;
      total.totalDiscount += originalPrice - finalPrice;
      total.finalPrice += finalPrice;

      return total;
    },
    {
      totalQuantity: 0,
      totalPrice: 0,
      totalDiscount: 0,
      finalPrice: 0,
    },
  );
};

module.exports = {
  getFinalItemPrice,
  calculateCartTotal,
};
