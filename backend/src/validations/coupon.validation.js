const mongoose = require("mongoose");
const { COUPON_APPLY_TO, DISCOUNT_TYPE } = require('../constants/common.constants');

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

const normalizeNumber = (value, fallback = 0) => {
  if (value === undefined || value === "") return fallback;
  return Number(value);
};

const normalizeArray = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];

  return [value];
};

const validateCouponBody = (body, { partial = false } = {}) => {
  const nextBody = { ...body };

  if (!partial || body.code !== undefined) {
    const code = String(body.code || "").trim().toUpperCase();
    if (!code) return { error: "Vui lòng nhập mã giảm giá" };
    nextBody.code = code;
  }

  if (!partial || body.name !== undefined) {
    const name = String(body.name || "").trim();
    if (!name) return { error: "Vui lòng nhập tên mã giảm giá" };
    nextBody.name = name;
  }

  if (body.description !== undefined) {
    nextBody.description = String(body.description || "").trim();
  }

  if (!partial || body.discountType !== undefined) {
    const discountType = String(body.discountType || "").trim().toUpperCase();
    if (!Object.values(DISCOUNT_TYPE).includes(discountType)) {
      return { error: "Loại giảm giá không hợp lệ" };
    }
    nextBody.discountType = discountType;
  }

  if (!partial || body.discountValue !== undefined) {
    const discountValue = Number(body.discountValue);
    const discountType = nextBody.discountType || body.discountType;

    if (!Number.isFinite(discountValue) || discountValue <= 0) {
      return { error: "Giá trị giảm phải lớn hơn 0" };
    }

    if (discountType === DISCOUNT_TYPE.PERCENT && discountValue > 100) {
      return { error: "Giảm phần trăm không được vượt quá 100%" };
    }

    nextBody.discountValue = discountValue;
  }

  for (const field of ["maxDiscount", "minOrderValue", "usageLimit"]) {
    if (body[field] !== undefined) {
      const value = normalizeNumber(body[field], 0);
      if (!Number.isFinite(value) || value < 0) {
        return { error: `${field} không hợp lệ` };
      }
      nextBody[field] = value;
    }
  }

  if (body.usageLimitPerUser !== undefined || !partial) {
    const usageLimitPerUser = normalizeNumber(body.usageLimitPerUser, 1);
    if (!Number.isFinite(usageLimitPerUser) || usageLimitPerUser < 1) {
      return { error: "Lượt dùng mỗi người phải lớn hơn hoặc bằng 1" };
    }
    nextBody.usageLimitPerUser = usageLimitPerUser;
  }

  if (!partial || body.startAt !== undefined) {
    if (!body.startAt) return { error: "Vui lòng chọn ngày bắt đầu" };
    nextBody.startAt = body.startAt;
  }

  if (!partial || body.endAt !== undefined) {
    if (!body.endAt) return { error: "Vui lòng chọn ngày kết thúc" };
    nextBody.endAt = body.endAt;
  }

  const startAt = nextBody.startAt ? new Date(nextBody.startAt) : null;
  const endAt = nextBody.endAt ? new Date(nextBody.endAt) : null;

  if (startAt && Number.isNaN(startAt.getTime())) {
    return { error: "Ngày bắt đầu không hợp lệ" };
  }

  if (endAt && Number.isNaN(endAt.getTime())) {
    return { error: "Ngày kết thúc không hợp lệ" };
  }

  if (startAt && endAt && startAt >= endAt) {
    return { error: "Ngày bắt đầu phải nhỏ hơn ngày kết thúc" };
  }

  if (body.applyTo !== undefined || !partial) {
    const applyTo = String(body.applyTo || COUPON_APPLY_TO.ALL).trim().toUpperCase();
    if (!Object.values(COUPON_APPLY_TO).includes(applyTo)) {
      return { error: "Phạm vi áp dụng không hợp lệ" };
    }
    nextBody.applyTo = applyTo;
  }

  for (const field of ["categories", "brands", "products", "users"]) {
    if (body[field] !== undefined) {
      const ids = normalizeArray(body[field]);
      const invalidId = ids.find((id) => !isObjectId(id));
      if (invalidId) return { error: `${field} chứa ID không hợp lệ` };
      nextBody[field] = ids;
    }
  }

  if (body.isActive !== undefined) {
    nextBody.isActive = body.isActive === true || body.isActive === "true";
  }

  return {
    value: {
      body: nextBody,
    },
  };
};

const createCoupon = createSchema(({ body }) => validateCouponBody(body));

const updateCoupon = createSchema(({ body, params }) => {
  const id = String(params.id || "").trim();
  if (!id || !isObjectId(id)) return { error: "Mã giảm giá không hợp lệ" };

  const result = validateCouponBody(body, { partial: true });
  if (result.error) return result;

  return {
    value: {
      params: {
        ...params,
        id,
      },
      body: result.value.body,
    },
  };
});

const couponIdParam = createSchema(({ params }) => {
  const id = String(params.id || "").trim();
  if (!id || !isObjectId(id)) return { error: "Mã giảm giá không hợp lệ" };

  return {
    value: {
      params: {
        ...params,
        id,
      },
    },
  };
});

const validateCouponForCart = createSchema(({ body }) => {
  const code = String(body.code || "").trim().toUpperCase();

  if (!code) return { error: "Vui lòng nhập mã giảm giá" };

  return {
    value: {
      body: {
        code,
      },
    },
  };
});

module.exports = {
  createCoupon,
  updateCoupon,
  couponIdParam,
  validateCouponForCart,
};
