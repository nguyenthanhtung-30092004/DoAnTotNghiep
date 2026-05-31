const fs = require('fs');

const path = 'src/services/coupon.service.js';
let content = fs.readFileSync(path, 'utf8');

const target = `  async validateCouponForCart({ userId, code }) {
    const cart = await cartModel.findOne({
      user: userId,
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestError("Giỏ hàng trống");
    }

    let subtotal = 0;

    for (const item of cart.items) {
      const finalItemPrice =
        item.salePrice > 0 && item.salePrice < item.price
          ? item.salePrice
          : item.price;

      subtotal += finalItemPrice * item.quantity;
    }

    const result = await this.validateCouponForItems({
      userId,
      code,
      items: cart.items,
      subtotal,
    });`;

const replacement = `  async validateCouponForCart({ userId, code, items }) {
    let cartItems = items;

    if (userId && (!items || items.length === 0)) {
      const cart = await cartModel.findOne({
        user: userId,
      });

      if (cart && cart.items.length > 0) {
        cartItems = cart.items;
      }
    }

    if (!cartItems || cartItems.length === 0) {
      throw new BadRequestError("Giỏ hàng trống");
    }

    let subtotal = 0;

    for (const item of cartItems) {
      const finalItemPrice =
        item.salePrice > 0 && item.salePrice < item.price
          ? item.salePrice
          : item.price;

      subtotal += finalItemPrice * item.quantity;
    }

    const result = await this.validateCouponForItems({
      userId,
      code,
      items: cartItems,
      subtotal,
    });`;

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(path, content, 'utf8');
    console.log('SUCCESS');
} else {
    console.log('NOT FOUND');
}
