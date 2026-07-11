const mongoose = require("mongoose");
const { ORDER_STATUS } = require('../constants/order.constants');
const { PAYMENT_METHODS } = require('../constants/payment.constants');

const phoneRegex = /^(0|\+84)\d{9,10}$/;

const createSchema = (validator) => ({
  validate(payload = {}) {
    const result = validator({
      body: payload.body || {},
      params: payload.params || {},
      query: payload.query || {},
    });

    if (result.error) {
      return {
        error: {
          message: result.error,
        },
      };
    }

    return {
      value: {
        ...payload,
        body: result.value?.body || payload.body,
        params: result.value?.params || payload.params,
      },
    };
  },
});

const isObjectId = (value) => mongoose.Types.ObjectId.isValid(String(value));

const normalizeOrderId = (params = {}) => {
  const orderId = String(params.orderId || "").trim();

  if (!orderId || !isObjectId(orderId)) {
    return {
      error: "Đơn hàng không hợp lệ",
    };
  }

  return {
    value: {
      ...params,
      orderId,
    },
  };
};

const normalizeShippingAddress = (shippingAddress) => {
  const requiredFields = [
    "fullName",
    "email",
    "phone",
    "province",
    "district",
    "ward",
    "detailAddress",
  ];

  const normalizedAddress = {};

  for (const field of requiredFields) {
    const value = String(shippingAddress?.[field] || "").trim();

    if (!value) {
      return {
        error: "Thiếu địa chỉ giao hàng",
      };
    }

    normalizedAddress[field] = value;
  }

  if (!phoneRegex.test(normalizedAddress.phone)) {
    return {
      error: "Số điện thoại không hợp lệ",
    };
  }

  return {
    value: normalizedAddress,
  };
};

const checkout = createSchema(({ body }) => {
  const shippingAddressResult = normalizeShippingAddress(body.shippingAddress);
  const paymentMethod = String(body.paymentMethod || PAYMENT_METHODS.COD)
    .trim()
    .toUpperCase();

  if (shippingAddressResult.error) return shippingAddressResult;

  if (!Object.values(PAYMENT_METHODS).includes(paymentMethod)) {
    return {
      error: "Phương thức thanh toán không hợp lệ",
    };
  }

  return {
    value: {
      body: {
        ...body,
        shippingAddress: shippingAddressResult.value,
        paymentMethod,
        couponCode: String(body.couponCode || "")
          .trim()
          .toUpperCase(),
        note: String(body.note || "").trim(),
      },
    },
  };
});

const orderIdParam = createSchema(({ params }) => {
  const paramsResult = normalizeOrderId(params);
  if (paramsResult.error) return paramsResult;

  return {
    value: {
      params: paramsResult.value,
    },
  };
});

const cancelOrder = createSchema(({ body, params }) => {
  const paramsResult = normalizeOrderId(params);
  if (paramsResult.error) return paramsResult;

  return {
    value: {
      params: paramsResult.value,
      body: {
        reason: String(body.reason || "").trim(),
      },
    },
  };
});

const updateOrderStatus = createSchema(({ body, params }) => {
  const paramsResult = normalizeOrderId(params);
  const orderStatus = String(body.orderStatus || "")
    .trim()
    .toUpperCase();

  if (paramsResult.error) return paramsResult;

  if (!Object.values(ORDER_STATUS).includes(orderStatus)) {
    return {
      error: "Trạng thái đơn hàng không hợp lệ",
    };
  }

  return {
    value: {
      params: paramsResult.value,
      body: {
        orderStatus,
      },
    },
  };
});

module.exports = {
  checkout,
  orderIdParam,
  cancelOrder,
  updateOrderStatus,
};
