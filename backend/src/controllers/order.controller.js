const { Created, OK } = require("../core/success.response");
const orderService = require("../services/order.service");

class OrderController {
  // user create order
  createOrderFromCart = async (req, res) => {
    new OK({
      message: "Tạo đơn hàng thành công",
      metadata: await orderService.createOrderFromCart({
        userId: req.user._id || req.user.userId,
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        note: req.body.note,
        couponCode: req.body.couponCode,
      }),
    }).send(res);
  };

  // user get my orders

  getMyOrders = async (req, res) => {
    new OK({
      message: "Lấy danh sách đơn hàng thành công",
      metadata: await orderService.getMyOrders({
        userId: req.user.userId,
        ...req.query,
      }),
    }).send(res);
  };

  // user get detail
  getMyOrderDetail = async (req, res) => {
    new OK({
      message: "Lấy chi tiết đơn hàng thành công",
      metadata: await orderService.getMyOrderDetail({
        userId: req.user.userId,
        orderId: req.params.orderId,
      }),
    }).send(res);
  };

  // user cancel order
  cancelMyOrder = async (req, res) => {
    new OK({
      message: "Hủy đơn hàng thành công",
      metadata: await orderService.cancelMyOrder({
        userId: req.user.userId,
        orderId: req.params.orderId,
        reason: req.body.reason,
      }),
    }).send(res);
  };

  getAllOrders = async (req, res) => {
    new OK({
      message: "Lấy danh sách đơn hàng thành công",
      metadata: await orderService.getAllOrders(req.query),
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
      metadata: await orderService.updateOrderStatus({
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
