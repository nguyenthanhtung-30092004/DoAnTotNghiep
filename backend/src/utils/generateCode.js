const { nanoid } = require("nanoid");

const generateOrderCode = () => {
  return `ORD-${Date.now()}-${nanoid(6).toUpperCase()}`;
};

module.exports = {
  generateOrderCode,
};
