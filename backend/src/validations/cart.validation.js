const mongoose = require("mongoose");

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

const normalizeQuantity = (quantity) => {
  const value = Number(quantity);

  if (!Number.isInteger(value) || value < 1) {
    return {
      error: "Số lượng phải là số nguyên lớn hơn 0",
    };
  }

  return {
    value,
  };
};

const addToCart = createSchema(({ body }) => {
  const productId = String(body.productId || "").trim();
  const variantId = String(body.variantId || "").trim();
  const sizeId = String(body.sizeId || "").trim();
  const quantityResult = normalizeQuantity(body.quantity);

  if (!productId || !isObjectId(productId)) {
    return { error: "Sản phẩm không hợp lệ" };
  }

  if (!variantId || !isObjectId(variantId)) {
    return { error: "Biến thể không hợp lệ" };
  }

  if (!sizeId || !isObjectId(sizeId)) {
    return { error: "Size không hợp lệ" };
  }

  if (quantityResult.error) return quantityResult;

  return {
    value: {
      body: {
        productId,
        variantId,
        sizeId,
        quantity: quantityResult.value,
      },
    },
  };
});

const updateQuantity = createSchema(({ body, params }) => {
  const itemId = String(params.itemId || "").trim();
  const quantityResult = normalizeQuantity(body.quantity);

  if (!itemId || !isObjectId(itemId)) {
    return { error: "Sản phẩm trong giỏ hàng không hợp lệ" };
  }

  if (quantityResult.error) return quantityResult;

  return {
    value: {
      params: {
        ...params,
        itemId,
      },
      body: {
        quantity: quantityResult.value,
      },
    },
  };
});

const removeFromCart = createSchema(({ params }) => {
  const itemId = String(params.itemId || "").trim();

  if (!itemId || !isObjectId(itemId)) {
    return { error: "Sản phẩm trong giỏ hàng không hợp lệ" };
  }

  return {
    value: {
      params: {
        ...params,
        itemId,
      },
    },
  };
});

module.exports = {
  addToCart,
  updateQuantity,
  removeFromCart,
};
