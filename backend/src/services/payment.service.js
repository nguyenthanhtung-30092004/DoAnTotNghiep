const { BadRequestError } = require('../core/error.response');
const codPayment = require('./methods/cod.payment');
const vnpayPayment = require('./methods/vnpay.payment');
const { PAYMENT_METHODS } = require('../constants/payment.constants');

class PaymentService {
  getPaymentHandler(paymentMethod) {
    const handlers = {
      [PAYMENT_METHODS.COD]: codPayment,
      [PAYMENT_METHODS.VNPAY]: vnpayPayment,
    };

    const handler = handlers[paymentMethod];

    if (!handler) {
      throw new BadRequestError("Phương thức thanh toán không hợp lệ");
    }

    return handler;
  }

  async createPayment({ paymentMethod, order, ipAddr }) {
    if (paymentMethod === PAYMENT_METHODS.COD) {
      return {
        paymentUrl: "",
      };
    }

    if (paymentMethod === PAYMENT_METHODS.VNPAY) {
      const paymentUrl = vnpayPayment.createPaymentUrl({
        order,
        ipAddr,
      });

      return {
        paymentUrl,
      };
    }

    throw new BadRequestError("Phương thức thanh toán không hợp lệ");
  }
}

module.exports = new PaymentService();
