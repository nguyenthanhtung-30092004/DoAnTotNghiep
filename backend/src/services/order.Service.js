// services/order.service.js

const { BadRequestError, NotFoundError } = require("../core/error.response");

const cartModel = require("../models/cart.model");
const productModel = require("../models/product.model");
const orderModel = require("../models/order.model");

class OrderService {
  async createOrderFromCart({
    userId,
    shippingAddress,
    paymentMethod = "COD",
    note = "",
  }) {
    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.province ||
      !shippingAddress.district ||
      !shippingAddress.ward ||
      !shippingAddress.detailAddress
    ) {
      throw new BadRequestError("Thiếu địa chỉ giao hàng");
    }

    const cart = await cartModel.findOne({ user: userId });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestError("Giỏ hàng trống");
    }

    const orderItems = [];

    let totalQuantity = 0;
    let totalPrice = 0;
    let totalDiscount = 0;

    for (const cartItem of cart.items) {
      const product = await productModel.findOne({
        _id: cartItem.product,
        isDeleted: false,
        isPublished: true,
      });

      if (!product) {
        throw new BadRequestError(
          `Sản phẩm ${cartItem.productName} không còn tồn tại`,
        );
      }

      const variant = product.variants.id(cartItem.variantId);

      if (!variant || !variant.isActive) {
        throw new BadRequestError(
          `Biến thể của ${cartItem.productName} không còn tồn tại`,
        );
      }

      const size = variant.sizes.id(cartItem.sizeId);

      if (!size) {
        throw new BadRequestError(
          `Size của ${cartItem.productName} không còn tồn tại`,
        );
      }

      if (size.stock < cartItem.quantity) {
        throw new BadRequestError(
          `${cartItem.productName} chỉ còn ${size.stock} sản phẩm`,
        );
      }

      const finalItemPrice =
        size.salePrice > 0 && size.salePrice < size.price
          ? size.salePrice
          : size.price;

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

        thumbnail: variant.images?.[0]?.url || product.thumbnail?.url || "",

        color: variant.color,

        size: size.size,

        sku: size.sku,

        price: size.price,

        salePrice: size.salePrice,

        quantity: cartItem.quantity,

        itemTotal,
      });

      size.stock -= cartItem.quantity;

      size.sold = (size.sold || 0) + cartItem.quantity;

      await product.save();
    }

    const shippingFee = totalPrice >= 1000000 ? 0 : 30000;

    const couponDiscount = 0;

    const finalPrice =
      totalPrice - totalDiscount + shippingFee - couponDiscount;

    const order = await orderModel.create({
      user: userId,

      items: orderItems,

      shippingAddress,

      paymentMethod,

      paymentStatus: "PENDING",

      orderStatus: "PENDING",

      totalQuantity,

      totalPrice,

      totalDiscount,

      shippingFee,

      couponDiscount,

      finalPrice,

      note,
    });

    cart.items = [];

    await cart.save();

    return order;
  }

  /* ======================================================
      GET MY ORDERS
  ====================================================== */

  async getMyOrders({ userId, page = 1, limit = 10, status }) {
    page = Number(page);
    limit = Number(limit);

    if (page < 1 || limit < 1) {
      throw new BadRequestError("Page hoặc limit không hợp lệ");
    }

    const filter = {
      user: userId,
    };

    if (status) {
      filter.orderStatus = status;
    }

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      orderModel
        .find(filter)
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

  /* ======================================================
      GET MY ORDER DETAIL
  ====================================================== */

  async getMyOrderDetail({ userId, orderId }) {
    const order = await orderModel.findOne({
      _id: orderId,
      user: userId,
    });

    if (!order) {
      throw new NotFoundError("Đơn hàng không tồn tại");
    }

    return order;
  }

  /* ======================================================
      USER CANCEL ORDER
      Không dùng transaction
  ====================================================== */

  async cancelMyOrder({ userId, orderId, reason = "" }) {
    const order = await orderModel.findOne({
      _id: orderId,
      user: userId,
    });

    if (!order) {
      throw new NotFoundError("Đơn hàng không tồn tại");
    }

    if (!["PENDING", "CONFIRMED"].includes(order.orderStatus)) {
      throw new BadRequestError("Không thể hủy đơn hàng ở trạng thái hiện tại");
    }

    for (const item of order.items) {
      const product = await productModel.findById(item.product);

      if (!product) continue;

      const variant = product.variants.id(item.variantId);

      if (!variant) continue;

      const size = variant.sizes.id(item.sizeId);

      if (!size) continue;

      size.stock += item.quantity;

      size.sold = Math.max((size.sold || 0) - item.quantity, 0);

      await product.save();
    }

    order.orderStatus = "CANCELLED";

    order.cancelReason = reason;

    order.cancelledBy = "USER";

    order.cancelledAt = new Date();

    await order.save();

    return order;
  }

  /* ======================================================
      ADMIN GET ALL ORDERS
  ====================================================== */

  async getAllOrders({ page = 1, limit = 10, status, keyword = "" }) {
    page = Number(page);
    limit = Number(limit);

    if (page < 1 || limit < 1) {
      throw new BadRequestError("Page hoặc limit không hợp lệ");
    }

    const filter = {};

    if (status) {
      filter.orderStatus = status;
    }

    if (keyword) {
      filter.$or = [
        {
          orderCode: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          "shippingAddress.fullName": {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          "shippingAddress.phone": {
            $regex: keyword,
            $options: "i",
          },
        },
      ];
    }

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      orderModel
        .find(filter)
        .populate("user", "name email")
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

  /* ======================================================
      ADMIN GET ORDER DETAIL
  ====================================================== */

  async getOrderDetail(orderId) {
    const order = await orderModel
      .findById(orderId)
      .populate("user", "name email phone");

    if (!order) {
      throw new NotFoundError("Đơn hàng không tồn tại");
    }

    return order;
  }

  /* ======================================================
      ADMIN UPDATE ORDER STATUS
  ====================================================== */

  async updateOrderStatus({ orderId, orderStatus }) {
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
      }
    }

    await order.save();

    return order;
  }

  /* ======================================================
      ADMIN CANCEL ORDER
      Không dùng transaction
  ====================================================== */

  async adminCancelOrder({ orderId, reason = "" }) {
    const order = await orderModel.findById(orderId);

    if (!order) {
      throw new NotFoundError("Đơn hàng không tồn tại");
    }

    if (["CANCELLED", "DELIVERED", "RETURNED"].includes(order.orderStatus)) {
      throw new BadRequestError("Không thể hủy đơn hàng này");
    }

    for (const item of order.items) {
      const product = await productModel.findById(item.product);

      if (!product) continue;

      const variant = product.variants.id(item.variantId);

      if (!variant) continue;

      const size = variant.sizes.id(item.sizeId);

      if (!size) continue;

      size.stock += item.quantity;

      size.sold = Math.max((size.sold || 0) - item.quantity, 0);

      await product.save();
    }

    order.orderStatus = "CANCELLED";

    order.cancelReason = reason;

    order.cancelledBy = "ADMIN";

    order.cancelledAt = new Date();

    await order.save();

    return order;
  }
}

module.exports = new OrderService();
