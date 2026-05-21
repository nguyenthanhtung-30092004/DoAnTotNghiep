const checkoutService = require("../modules/orders/checkout.service");
const orderService = require("../modules/orders/order.service");

class LegacyOrderService {
  async createOrderFromCart(payload) {
    return checkoutService.checkout(payload);
  }

  async getMyOrders(payload) {
    return orderService.getMyOrders(payload);
  }

  async getMyOrderDetail(payload) {
    return orderService.getMyOrderDetail(payload);
  }

  async cancelMyOrder(payload) {
    return orderService.cancelOrderByUser(payload);
  }

  async getAllOrders(payload) {
    return orderService.adminGetOrders(payload);
  }

  async getOrderDetail(orderId) {
    return orderService.getOrderDetail(orderId);
  }

  async updateOrderStatus(payload) {
    return orderService.adminUpdateOrderStatus(payload);
  }

  async adminCancelOrder(payload) {
    return orderService.adminCancelOrder(payload);
  }
}

module.exports = new LegacyOrderService();
