const { OK } = require("../../core/success.response");
const checkoutService = require("./checkout.service");
const orderService = require("./order.service");

const getUserId = (req) => req.user?._id || req.user?.userId;

class OrderController {
  checkout = async (req, res) => {
    new OK({
      message: "Tạo đơn hàng thành công",
      metadata: await checkoutService.checkout({
        userId: getUserId(req),
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        couponCode: req.body.couponCode,
        note: req.body.note,
        ipAddr:
          req.headers["x-forwarded-for"] ||
          req.socket.remoteAddress ||
          "127.0.0.1",
      }),
    }).send(res);
  };

  getMyOrders = async (req, res) => {
    new OK({
      message: "Lấy danh sách đơn hàng thành công",
      metadata: await orderService.getMyOrders({
        userId: getUserId(req),
        ...req.query,
      }),
    }).send(res);
  };

  getMyOrderDetail = async (req, res) => {
    new OK({
      message: "Lấy chi tiết đơn hàng thành công",
      metadata: await orderService.getMyOrderDetail({
        userId: getUserId(req),
        orderId: req.params.orderId,
      }),
    }).send(res);
  };

  cancelMyOrder = async (req, res) => {
    new OK({
      message: "Hủy đơn hàng thành công",
      metadata: await orderService.cancelOrderByUser({
        userId: getUserId(req),
        orderId: req.params.orderId,
        reason: req.body.reason,
      }),
    }).send(res);
  };

  getAllOrders = async (req, res) => {
    new OK({
      message: "Lấy danh sách đơn hàng thành công",
      metadata: await orderService.adminGetOrders(req.query),
    }).send(res);
  };

  getOrderDetail = async (req, res) => {
    new OK({
      message: "Lấy chi tiết đơn hàng thành công",
      metadata: await orderService.getOrderDetail(req.params.orderId),
    }).send(res);
  };

  updateOrderStatus = async (req, res) => {
    new OK({
      message: "Cập nhật trạng thái đơn hàng thành công",
      metadata: await orderService.adminUpdateOrderStatus({
        orderId: req.params.orderId,
        orderStatus: req.body.orderStatus,
      }),
    }).send(res);
  };

  adminCancelOrder = async (req, res) => {
    new OK({
      message: "Admin hủy đơn hàng thành công",
      metadata: await orderService.adminCancelOrder({
        orderId: req.params.orderId,
        reason: req.body.reason,
      }),
    }).send(res);
  };
}

module.exports = new OrderController();
