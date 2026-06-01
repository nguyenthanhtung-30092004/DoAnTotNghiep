const { BadRequestError, NotFoundError } = require("../../core/error.response");
const orderModel = require("../../models/order.model");
const productModel = require("../../models/product.model");
const couponService = require("../coupons/coupon.service");
const { getFinalPrice } = require("./order.helper");
const { createAccentRegex } = require("../../utils/format");
const { getIO } = require("../../socket/socket");
const sendOrderStatusEmail = require("../../utils/sendOrderStatusEmail");

const phoneRegex = /^(0|\+84)\d{9,10}$/;

class OrderService {
  validateShippingAddress(shippingAddress) {
    const requiredFields = [
      "fullName",
      "phone",
      "province",
      "district",
      "ward",
      "detailAddress",
    ];

    const missingField = requiredFields.find((field) => !shippingAddress?.[field]);

    if (missingField) {
      throw new BadRequestError("Thiếu địa chỉ giao hàng");
    }

    if (!phoneRegex.test(String(shippingAddress.phone || "").trim())) {
      throw new BadRequestError("Số điện thoại không hợp lệ");
    }
  }

  async buildOrderItemsFromCart({ cart }) {
    const orderItems = [];
    let totalQuantity = 0;
    let totalPrice = 0;
    let totalDiscount = 0;

    for (const cartItem of cart.items) {
      const productId = cartItem.product || cartItem.productId;
      const product = await productModel
        .findOne({
          _id: productId,
          isDeleted: false,
          isPublished: true,
        });

      if (!product) {
        throw new BadRequestError(`Sản phẩm ${cartItem.productName} không còn tồn tại`);
      }

      const variant = product.variants.id(cartItem.variantId);

      if (!variant || !variant.isActive) {
        throw new BadRequestError(`Biến thể của ${cartItem.productName} không còn tồn tại`);
      }

      const size = variant.sizes.id(cartItem.sizeId);

      if (!size || !size.isActive) {
        throw new BadRequestError(`Size của ${cartItem.productName} không còn tồn tại`);
      }

      if (size.stock < cartItem.quantity) {
        throw new BadRequestError(`${cartItem.productName} chỉ còn ${size.stock} sản phẩm`);
      }

      const finalItemPrice = getFinalPrice(size.price, size.salePrice);
      const itemTotal = finalItemPrice * cartItem.quantity;

      totalQuantity += cartItem.quantity;
      totalPrice += size.price * cartItem.quantity;
      totalDiscount += (size.price - finalItemPrice) * cartItem.quantity;

      orderItems.push({
        product: product._id,
        variantId: variant._id,
        sizeId: size._id,
        productName: product.name,
        productSlug: product.slug,
        productThumbnail: variant.images?.[0]?.url || product.thumbnail?.url || "",
        color: variant.color,
        size: size.size,
        sku: size.sku,
        price: size.price,
        salePrice: size.salePrice,
        quantity: cartItem.quantity,
        itemTotal,
      });
    }

    return {
      orderItems,
      totalQuantity,
      totalPrice,
      totalDiscount,
    };
  }

  async createOrder({ orderData }) {
    return orderModel.create(orderData);
  }

  async deductStockForOrder({ order }) {
    if (order.stockDeducted) return order;

    for (const item of order.items) {
      const product = await productModel.findById(item.product);

      if (!product) {
        throw new NotFoundError(`Sản phẩm ${item.productName} không còn tồn tại`);
      }

      const variant = product.variants.id(item.variantId);
      const size = variant?.sizes.id(item.sizeId);

      if (!variant || !size) {
        throw new BadRequestError(`Sản phẩm ${item.productName} không còn hợp lệ`);
      }

      if (size.stock < item.quantity) {
        throw new BadRequestError(`${item.productName} chỉ còn ${size.stock} sản phẩm`);
      }

      size.stock -= item.quantity;
      size.sold = (size.sold || 0) + item.quantity;

      await product.save();
    }

    order.stockDeducted = true;
    await order.save();

    return order;
  }

  async markPaymentPaid({ orderId, transactionId = "" }) {
    const order = await orderModel.findById(orderId);

    if (!order) {
      throw new NotFoundError("Đơn hàng không tồn tại");
    }

    order.paymentStatus = "PAID";
    order.paidAt = new Date();
    order.transactionId = transactionId;

    await order.save();

    return order;
  }

  async markPaymentFailed({ orderId, transactionId = "" }) {
    const order = await orderModel.findById(orderId);

    if (!order) {
      throw new NotFoundError("Đơn hàng không tồn tại");
    }

    order.paymentStatus = "FAILED";
    order.transactionId = transactionId;

    await order.save();

    return order;
  }

  async getMyOrders({ userId, page = 1, limit = 10, status }) {
    page = Number(page);
    limit = Number(limit);

    if (page < 1 || limit < 1) {
      throw new BadRequestError("Page hoặc limit không hợp lệ");
    }

    const filter = { user: userId };
    if (status) filter.orderStatus = status;

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      orderModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      orderModel.countDocuments(filter),
    ]);

    return {
      orders,
      pagination: {
        currentPage: page,
        totalPage: Math.ceil(total / limit),
        totalOrder: total,
        limit,
      },
    };
  }

  async getMyOrderDetail({ userId, orderId }) {
    const order = await orderModel.findOne({ _id: orderId, user: userId });

    if (!order) {
      throw new NotFoundError("Đơn hàng không tồn tại");
    }

    return order;
  }

  async getOrderDetail(orderId) {
    const order = await orderModel
      .findById(orderId)
      .populate("user", "fullName email");

    if (!order) {
      throw new NotFoundError("Đơn hàng không tồn tại");
    }

    return order;
  }

  async adminGetOrders({
    page = 1,
    limit = 10,
    status,
    orderStatus,
    paymentStatus,
    paymentMethod,
    keyword = "",
    search = "",
    q = "",
  }) {
    page = Number(page);
    limit = Number(limit);

    if (page < 1 || limit < 1) {
      throw new BadRequestError("Page hoặc limit không hợp lệ");
    }

    const filter = {};
    const selectedOrderStatus = orderStatus || status;
    const selectedKeyword = keyword || search || q;

    if (selectedOrderStatus) filter.orderStatus = selectedOrderStatus;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (paymentMethod) filter.paymentMethod = paymentMethod;

    if (selectedKeyword) {
      const regexPattern = createAccentRegex(selectedKeyword);
      filter.$or = [
        { orderCode: { $regex: regexPattern, $options: "i" } },
        { "shippingAddress.fullName": { $regex: regexPattern, $options: "i" } },
        { "shippingAddress.phone": { $regex: regexPattern, $options: "i" } },
        { "shippingAddress.email": { $regex: regexPattern, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      orderModel
        .find(filter)
        .populate("user", "fullName email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      orderModel.countDocuments(filter),
    ]);

    return {
      orders,
      pagination: {
        currentPage: page,
        totalPage: Math.ceil(total / limit),
        totalOrder: total,
        limit,
      },
    };
  }

  async restoreStockForOrder({ order }) {
    if (!order.stockDeducted) return order;

    for (const item of order.items) {
      const product = await productModel.findById(item.product);
      if (!product) continue;

      const variant = product.variants.id(item.variantId);
      const size = variant?.sizes.id(item.sizeId);
      if (!size) continue;

      size.stock += item.quantity;
      size.sold = Math.max((size.sold || 0) - item.quantity, 0);

      await product.save();
    }

    order.stockDeducted = false;
    await order.save();

    return order;
  }

  async cancelOrderByUser({ userId, orderId, reason = "" }) {
    const order = await orderModel.findOne({ _id: orderId, user: userId });

    if (!order) {
      throw new NotFoundError("Đơn hàng không tồn tại");
    }

    if (!["PENDING", "CONFIRMED"].includes(order.orderStatus)) {
      throw new BadRequestError("Không thể hủy đơn hàng ở trạng thái hiện tại");
    }

    await this.restoreStockForOrder({ order });

    order.orderStatus = "CANCELLED";
    order.cancelReason = reason;
    order.cancelledBy = "USER";
    order.cancelledAt = new Date();

    if (order.coupon?.couponId) {
      await couponService.decreaseUsage({
        couponId: order.coupon.couponId,
        userId: order.user,
      });
    }

    await order.save();

    if (order.shippingAddress?.email) {
      sendOrderStatusEmail(order.shippingAddress.email, order, "CANCELLED");
    }

    return order;
  }

  async adminUpdateOrderStatus({ orderId, orderStatus }) {
    const allowedStatus = [
      "PENDING",
      "CONFIRMED",
      "PROCESSING",
      "SHIPPING",
      "DELIVERED",
      "CANCELLED",
      "RETURNED",
    ];

    if (!allowedStatus.includes(orderStatus)) {
      throw new BadRequestError("Trạng thái đơn hàng không hợp lệ");
    }

    const order = await orderModel.findById(orderId);

    if (!order) {
      throw new NotFoundError("Đơn hàng không tồn tại");
    }

    if (order.orderStatus === "CANCELLED") {
      throw new BadRequestError("Đơn hàng đã hủy, không thể cập nhật");
    }

    if (order.orderStatus === "DELIVERED") {
      throw new BadRequestError("Đơn hàng đã giao, không thể cập nhật");
    }

    order.orderStatus = orderStatus;

    if (orderStatus === "DELIVERED") {
      order.deliveredAt = new Date();

      if (order.paymentMethod === "COD") {
        order.paymentStatus = "PAID";
        order.paidAt = new Date();
      }
    }

    await order.save();

    const io = getIO();

    if (order.user) {
      io.to(`user:${order.user.toString()}`).emit("order:updated", {
        orderId: order._id,
        orderCode: order.orderCode,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        deliveredAt: order.deliveredAt,
        updatedAt: order.updatedAt,
      });
    }

    if (order.shippingAddress?.email) {
      sendOrderStatusEmail(order.shippingAddress.email, order, orderStatus);
    }

    io.to("admin:order").emit("admin:order-updated", {
      orderId: order._id,
      orderCode: order.orderCode,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      deliveredAt: order.deliveredAt,
      updatedAt: order.updatedAt,
    });

    return order;
  }

  async adminCancelOrder({ orderId, reason = "" }) {
    const order = await orderModel.findById(orderId);

    if (!order) {
      throw new NotFoundError("Đơn hàng không tồn tại");
    }

    if (["CANCELLED", "DELIVERED", "RETURNED"].includes(order.orderStatus)) {
      throw new BadRequestError("Không thể hủy đơn hàng này");
    }

    await this.restoreStockForOrder({ order });

    order.orderStatus = "CANCELLED";
    order.cancelReason = reason;
    order.cancelledBy = "ADMIN";
    order.cancelledAt = new Date();

    if (order.coupon?.couponId && order.user) {
      await couponService.decreaseUsage({
        couponId: order.coupon.couponId,
        userId: order.user,
      });
    }

    await order.save();

    const io = getIO();

    if (order.user) {
      io.to(`user:${order.user.toString()}`).emit("order:updated", {
        orderId: order._id,
        orderCode: order.orderCode,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        cancelReason: order.cancelReason,
        cancelledBy: order.cancelledBy,
        cancelledAt: order.cancelledAt,
        updatedAt: order.updatedAt,
      });
    }

    if (order.shippingAddress?.email) {
      sendOrderStatusEmail(order.shippingAddress.email, order, "CANCELLED");
    }

    io.to("admin:order").emit("admin:order-updated", {
      orderId: order._id,
      orderCode: order.orderCode,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      cancelReason: order.cancelReason,
      cancelledBy: order.cancelledBy,
      cancelledAt: order.cancelledAt,
      updatedAt: order.updatedAt,
    });

    return order;
  }

  async updatePaymentStatus({
    orderId,
    paymentStatus,
    transactionId = "",
  }) {
    if (paymentStatus === "PAID") {
      return this.markPaymentPaid({ orderId, transactionId });
    }

    if (paymentStatus === "FAILED") {
      return this.markPaymentFailed({ orderId, transactionId });
    }

    const order = await orderModel.findById(orderId);

    if (!order) {
      throw new NotFoundError("Đơn hàng không tồn tại");
    }

    order.paymentStatus = paymentStatus;
    order.transactionId = transactionId;

    await order.save();

    return order;
  }
}

module.exports = new OrderService();
