const orderModel = require("../../models/Order");

const cartService = require("../cart/cart.service");
const couponService = require("../coupons/coupon.service");
const orderService = require("../orders/order.service");

const vnpayPayment = require("./methods/vnpay.payment");

const { ORDER_STATUS } = require("../../constants/order.constants");
const { PAYMENT_STATUS } = require("./payment.constants");

const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

class PaymentController {
  vnpayReturn = async (req, res) => {
    const isValidSignature = vnpayPayment.verifyReturnUrl(req.query);

    const orderCode = req.query.vnp_TxnRef;
    const order = await orderModel.findOne({ orderCode });

    if (!isValidSignature) {
      return res.redirect(
        `${clientUrl}/payment-result?status=failed&method=VNPAY&message=invalid-signature`,
      );
    }

    if (!order) {
      return res.redirect(
        `${clientUrl}/payment-result?status=failed&method=VNPAY&message=order-not-found`,
      );
    }

    const isPaid =
      req.query.vnp_ResponseCode === "00" &&
      req.query.vnp_TransactionStatus === "00";

    if (isPaid) {
      await this.markOrderPaid({
        order,
        transactionId: req.query.vnp_TransactionNo || "",
      });

      return res.redirect(
        `${clientUrl}/payment-result?status=success&method=VNPAY&orderId=${order._id}`,
      );
    }

    await this.markOrderFailed({ order });

    return res.redirect(
      `${clientUrl}/payment-result?status=failed&method=VNPAY&orderId=${order._id}`,
    );
  };

  markOrderPaid = async ({ order, transactionId }) => {
    if (!order) return;

    if (order.paymentStatus === PAYMENT_STATUS.PAID) {
      return;
    }

    if (!order.stockDeducted) {
      await orderService.deductStockForOrder({ order });
      order.stockDeducted = true;
    }

    if (order.coupon?.couponId) {
      await couponService.increaseUsage({
        couponId: order.coupon.couponId,
        userId: order.user,
      });
    }

    if (!order.cartCleared) {
      await cartService.clearCartByUser({
        userId: order.user,
      });

      order.cartCleared = true;
    }

    order.paymentStatus = PAYMENT_STATUS.PAID;
    order.orderStatus = ORDER_STATUS.CONFIRMED;
    order.paidAt = new Date();
    order.transactionId = transactionId || "";

    await order.save();
  };

  markOrderFailed = async ({ order }) => {
    if (!order) return;

    if (order.paymentStatus === PAYMENT_STATUS.PAID) {
      return;
    }

    order.paymentStatus = PAYMENT_STATUS.FAILED;

    await order.save();
  };
}

module.exports = new PaymentController();
