const { BadRequestError } = require('../core/error.response');
const cartService = require('./cart.service');
const couponService = require('./coupon.service');
const paymentService = require('./payment.service');
const { PAYMENT_METHODS } = require('../constants/payment.constants');
const orderService = require('./order.service');
const { calculateShippingFee } = require('../helpers/order.helper');
const sendOrderStatusEmail = require('../utils/sendOrderStatusEmail');

class CheckoutService {
  async checkout({
    userId,
    items, // THÊM items VÀO THAM SỐ
    shippingAddress,
    paymentMethod = PAYMENT_METHODS.COD,
    couponCode = "",
    note = "",
    ipAddr = "127.0.0.1",
  }) {
    const selectedPaymentMethod = this.normalizePaymentMethod(paymentMethod);
    this.validatePaymentMethod(selectedPaymentMethod);
    orderService.validateShippingAddress(shippingAddress);

    let orderSummary;

    if (!userId) {
      // Dành cho Guest Checkout
      if (!Array.isArray(items) || items.length === 0) {
        throw new BadRequestError("Giỏ hàng trống");
      }
      // Tính toán giá trị đơn hàng trực tiếp từ mảng items của Frontend gửi lên
      orderSummary = await orderService.buildOrderItemsFromCart({ cart: { items } });
    } else {
      // Dành cho User (Đã đăng nhập)
      const cart = await cartService.getCartDocument({ userId });
      if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
        throw new BadRequestError("Giỏ hàng trống");
      }
      orderSummary = await orderService.buildOrderItemsFromCart({ cart });
    }

    const { orderItems, totalQuantity, totalPrice, totalDiscount } = orderSummary;

    const subtotalAfterProductDiscount = Math.max(totalPrice - totalDiscount, 0);

    const couponResult = await this.applyCouponIfNeeded({
      userId,
      couponCode,
      orderItems,
      subtotalAfterProductDiscount,
    });

    const shippingFee = calculateShippingFee(subtotalAfterProductDiscount);

    const finalPrice = Math.max(
      subtotalAfterProductDiscount + shippingFee - couponResult.couponDiscount,
      0
    );

    const order = await orderService.createOrder({
      orderData: {
        user: userId || undefined, // Nếu là null thì gán undefined để Mongoose bỏ qua
        items: orderItems,
        shippingAddress,
        paymentMethod: selectedPaymentMethod,
        paymentStatus: "PENDING",
        orderStatus: "PENDING",
        totalQuantity,
        totalPrice,
        totalDiscount,
        shippingFee,
        couponDiscount: couponResult.couponDiscount,
        coupon: couponResult.couponData,
        finalPrice,
        note,
      },
    });

    if (selectedPaymentMethod === PAYMENT_METHODS.COD) {
      return this.handleCodCheckout({
        userId,
        order,
        couponId: couponResult.couponData.couponId,
      });
    }

    return this.handleVnpayCheckout({
      order,
      ipAddr,
    });
  }

  normalizePaymentMethod(paymentMethod) {
    return String(paymentMethod || PAYMENT_METHODS.COD)
      .trim()
      .toUpperCase();
  }

  validatePaymentMethod(paymentMethod) {
    const allowedPaymentMethods = Object.values(PAYMENT_METHODS);

    if (!allowedPaymentMethods.includes(paymentMethod)) {
      throw new BadRequestError("Phương thức thanh toán không hợp lệ");
    }
  }

  async applyCouponIfNeeded({ userId, couponCode, orderItems, subtotalAfterProductDiscount }) {
    const defaultCouponData = {
      code: "",
      couponId: null,
      discountType: "",
      discountValue: 0,
    };

    if (!couponCode) {
      return {
        couponDiscount: 0,
        couponData: defaultCouponData,
      };
    }

    const couponResult = await couponService.validateCouponForItems({
      userId,
      code: couponCode,
      items: orderItems,
      subtotal: subtotalAfterProductDiscount,
    });

    return {
      couponDiscount: Number(couponResult.couponDiscount || 0),
      couponData: {
        code: couponResult.coupon.code,
        couponId: couponResult.coupon._id,
        discountType: couponResult.coupon.discountType,
        discountValue: couponResult.coupon.discountValue,
      },
    };
  }

  async handleCodCheckout({ userId, order, couponId }) {
    await orderService.deductStockForOrder({ order });
    order.stockDeducted = true;

    if (couponId) {
      await couponService.increaseUsage({
        couponId,
        userId,
      });
    }

    // CHÈN THÊM DÒNG if (userId) NÀY:
    if (userId) {
      await cartService.clearCartByUser({ userId });
    }

    order.cartCleared = true;
    await order.save();

    if (order.shippingAddress?.email) {
      sendOrderStatusEmail(order.shippingAddress.email, order, "PENDING");
    }

    return {
      order,
      paymentMethod: PAYMENT_METHODS.COD,
      paymentUrl: "",
      message: "Đặt hàng COD thành công",
    };
  }

  async handleVnpayCheckout({ order, ipAddr }) {
    const payment = await paymentService.createPayment({
      paymentMethod: PAYMENT_METHODS.VNPAY,
      order,
      ipAddr,
    });

    order.paymentUrl = payment.paymentUrl || "";

    await order.save();

    if (order.shippingAddress?.email) {
      sendOrderStatusEmail(order.shippingAddress.email, order, "PENDING");
    }

    return {
      order,
      paymentMethod: PAYMENT_METHODS.VNPAY,
      paymentUrl: order.paymentUrl,
      message: "Tạo link thanh toán VNPAY thành công",
    };
  }
}

module.exports = new CheckoutService();
