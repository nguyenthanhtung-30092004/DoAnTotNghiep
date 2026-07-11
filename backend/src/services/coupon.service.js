const {
  BadRequestError,
  ConflictRequestError,
  NotFoundError,
} = require('../core/error.response');
const cartModel = require('../models/cart.model');
const couponModel = require('../models/coupon.model');
const productModel = require('../models/product.model');

class CouponService {
  normalizeCode(code) {
    return String(code || "")
      .trim()
      .toUpperCase();
  }

  async createCoupon(body) {
    let {
      code,
      name,
      description = "",
      discountType,
      discountValue,
      maxDiscount = 0,
      minOrderValue = 0,
      startAt,
      endAt,
      usageLimit = 0,
      usageLimitPerUser = 1,
      applyTo = "ALL",
      categories = [],
      brands = [],
      products = [],
      users = [],
      isActive = true,
    } = body;

    code = this.normalizeCode(code);

    if (!code || !name || !discountType || discountValue === undefined) {
      throw new BadRequestError("Thiếu thông tin mã giảm giá");
    }

    if (Number(discountValue) <= 0) {
      throw new BadRequestError("Giá trị giảm phải lớn hơn 0");
    }

    if (!["PERCENT", "FIXED"].includes(discountType)) {
      throw new BadRequestError("Loại giảm giá không hợp lệ");
    }

    if (discountType === "PERCENT" && Number(discountValue) > 100) {
      throw new BadRequestError("Giảm theo phần trăm không được vượt quá 100%");
    }

    if (!["ALL", "CATEGORIES", "BRANDS", "PRODUCTS", "USERS"].includes(applyTo)) {
      throw new BadRequestError("Phạm vi áp dụng không hợp lệ");
    }

    const existing = await couponModel.findOne({
      code,
      isDeleted: false,
    });

    if (existing) {
      throw new ConflictRequestError("Mã giảm giá đã tồn tại");
    }

    const coupon = await couponModel.create({
      code,
      name,
      description,
      discountType,
      discountValue: Number(discountValue),
      maxDiscount: Number(maxDiscount),
      minOrderValue: Number(minOrderValue),
      startAt,
      endAt,
      usageLimit: Number(usageLimit),
      usageLimitPerUser: Number(usageLimitPerUser),
      applyTo,
      categories,
      brands,
      products,
      users,
      isActive,
    });

    return coupon;
  }

  async getCoupons({
    page = 1,
    limit = 10,
    search = "",
    isActive,
    applyTo,
    discountType,
  }) {
    page = Number(page);
    limit = Number(limit);

    if (page < 1 || limit < 1) {
      throw new BadRequestError("Page hoặc limit không hợp lệ");
    }

    const filter = {
      isDeleted: false,
    };

    if (search) {
      filter.$or = [
        {
          code: {
            $regex: search,
            $options: "i",
          },
        },
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    if (applyTo) {
      filter.applyTo = applyTo;
    }

    if (discountType) {
      filter.discountType = discountType;
    }

    const skip = (page - 1) * limit;

    const [coupons, total] = await Promise.all([
      couponModel
        .find(filter)
        .populate("categories", "name")
        .populate("brands", "nameBrand")
        .populate("products", "name slug thumbnail")
        .populate("users", "fullName email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      couponModel.countDocuments(filter),
    ]);

    return {
      coupons,
      pagination: {
        currentPage: page,
        totalPage: Math.ceil(total / limit),
        totalCoupon: total,
        limit,
      },
    };
  }

  async getCouponDetail(id) {
    const coupon = await couponModel
      .findOne({
        _id: id,
        isDeleted: false,
      })
      .populate("categories", "name")
      .populate("brands", "nameBrand")
      .populate("products", "name slug thumbnail")
      .populate("users", "fullName email");

    if (!coupon) {
      throw new NotFoundError("Mã giảm giá không tồn tại");
    }

    return coupon;
  }

  async updateCoupon({ id, body }) {
    const coupon = await couponModel.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!coupon) {
      throw new NotFoundError("Mã giảm giá không tồn tại");
    }

    if (body.code) {
      const newCode = this.normalizeCode(body.code);

      const existing = await couponModel.findOne({
        code: newCode,
        _id: {
          $ne: id,
        },
        isDeleted: false,
      });

      if (existing) {
        throw new ConflictRequestError("Mã giảm giá đã tồn tại");
      }

      coupon.code = newCode;
    }

    const allowFields = [
      "name",
      "description",
      "discountType",
      "discountValue",
      "maxDiscount",
      "minOrderValue",
      "startAt",
      "endAt",
      "usageLimit",
      "usageLimitPerUser",
      "applyTo",
      "categories",
      "brands",
      "products",
      "users",
      "isActive",
    ];

    allowFields.forEach((field) => {
      if (body[field] !== undefined) {
        coupon[field] = body[field];
      }
    });

    if (Number(coupon.discountValue) <= 0) {
      throw new BadRequestError("Giá trị giảm phải lớn hơn 0");
    }

    if (coupon.discountType === "PERCENT" && coupon.discountValue > 100) {
      throw new BadRequestError("Giảm theo phần trăm không được vượt quá 100%");
    }

    if (coupon.startAt >= coupon.endAt) {
      throw new BadRequestError("Ngày bắt đầu phải nhỏ hơn ngày kết thúc");
    }

    await coupon.save();

    return coupon;
  }

  async deleteCoupon(id) {
    const coupon = await couponModel.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!coupon) {
      throw new NotFoundError("Mã giảm giá không tồn tại");
    }

    coupon.isDeleted = true;
    coupon.isActive = false;

    await coupon.save();

    return {
      id,
    };
  }

  checkCouponBase(coupon, userId, subtotal) {
    const now = new Date();

    if (!coupon || coupon.isDeleted) {
      throw new NotFoundError("Mã giảm giá không tồn tại");
    }

    if (!coupon.isActive) {
      throw new BadRequestError("Mã giảm giá đã bị tắt");
    }

    if (now < coupon.startAt) {
      throw new BadRequestError("Mã giảm giá chưa bắt đầu");
    }

    if (now > coupon.endAt) {
      throw new BadRequestError("Mã giảm giá đã hết hạn");
    }

    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      throw new BadRequestError("Mã giảm giá đã hết lượt sử dụng");
    }

    if (subtotal < coupon.minOrderValue) {
      throw new BadRequestError(
        `Đơn hàng tối thiểu phải từ ${coupon.minOrderValue}`,
      );
    }

    let usedInfo = null;
    if (userId) {
      usedInfo = coupon.usedBy.find(
        (item) => item.user.toString() === userId.toString(),
      );
    }

    if (usedInfo && usedInfo.count >= coupon.usageLimitPerUser) {
      throw new BadRequestError("Bạn đã dùng hết lượt mã giảm giá này");
    }
  }

  isItemMatchCoupon(coupon, item, product) {
    if (coupon.applyTo === "ALL") {
      return true;
    }

    if (coupon.applyTo === "PRODUCTS") {
      return coupon.products.some(
        (id) => id.toString() === product._id.toString(),
      );
    }

    if (coupon.applyTo === "CATEGORIES") {
      return coupon.categories.some(
        (id) => id.toString() === product.category.toString(),
      );
    }

    if (coupon.applyTo === "BRANDS") {
      return coupon.brands.some(
        (id) => id.toString() === product.brand.toString(),
      );
    }

    if (coupon.applyTo === "USERS") {
      if (!item.userId) return false;
      return coupon.users.some((id) => id.toString() === item.userId?.toString());
    }

    return false;
  }

  calculateDiscount(coupon, eligibleAmount) {
    let discount = 0;

    if (coupon.discountType === "PERCENT") {
      discount = eligibleAmount * (coupon.discountValue / 100);

      if (coupon.maxDiscount > 0) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    }

    if (coupon.discountType === "FIXED") {
      discount = coupon.discountValue;
    }

    discount = Math.min(discount, eligibleAmount);

    return Math.round(discount);
  }

  calculateCouponDiscount(coupon, eligibleAmount) {
    return this.calculateDiscount(coupon, eligibleAmount);
  }

  async validateCoupon(payload) {
    return this.validateCouponForItems(payload);
  }

  async validateCouponForItems({ userId, code, items, subtotal }) {
    code = this.normalizeCode(code);

    if (!code) {
      return {
        coupon: null,
        couponDiscount: 0,
        eligibleAmount: 0,
      };
    }

    const coupon = await couponModel.findOne({
      code,
      isDeleted: false,
    });

    this.checkCouponBase(coupon, userId, subtotal);

    let eligibleAmount = 0;

    for (const item of items) {
      const product = await productModel.findById(item.product);

      if (!product) continue;

      const itemForCoupon = item.toObject ? item.toObject() : item;
      const matched = this.isItemMatchCoupon(
        coupon,
        { ...itemForCoupon, userId },
        product,
      );

      if (!matched) continue;

      const finalItemPrice =
        item.salePrice > 0 && item.salePrice < item.price
          ? item.salePrice
          : item.price;

      eligibleAmount += finalItemPrice * item.quantity;
    }

    if (eligibleAmount <= 0) {
      throw new BadRequestError("Mã giảm giá không áp dụng cho sản phẩm này");
    }

    const couponDiscount = this.calculateDiscount(coupon, eligibleAmount);

    return {
      coupon,
      couponDiscount,
      eligibleAmount,
    };
  }

  async validateCouponForCart({ userId, code, items }) {
    let cartItems = items;

    if (userId && (!items || items.length === 0)) {
      const cart = await cartModel.findOne({
        user: userId,
      });

      if (cart && cart.items.length > 0) {
        cartItems = cart.items;
      }
    }

    if (!cartItems || cartItems.length === 0) {
      throw new BadRequestError("Giỏ hàng trống");
    }

    let subtotal = 0;

    for (const item of cartItems) {
      const finalItemPrice =
        item.salePrice > 0 && item.salePrice < item.price
          ? item.salePrice
          : item.price;

      subtotal += finalItemPrice * item.quantity;
    }

    const result = await this.validateCouponForItems({
      userId,
      code,
      items: cartItems,
      subtotal,
    });

    return {
      code: result.coupon.code,
      discountType: result.coupon.discountType,
      discountValue: result.coupon.discountValue,
      couponDiscount: result.couponDiscount,
      eligibleAmount: result.eligibleAmount,
      subtotal,
      finalPriceAfterCoupon: Math.max(subtotal - result.couponDiscount, 0),
    };
  }

  async increaseUsage({ couponId, userId }) {
    if (!couponId) return;

    const coupon = await couponModel.findById(couponId);

    if (!coupon) return;

    coupon.usedCount += 1;

    let usedInfo = null;
    if (userId) {
      usedInfo = coupon.usedBy.find(
        (item) => item.user.toString() === userId.toString(),
      );
    }

    if (usedInfo) {
      usedInfo.count += 1;
    } else if (userId) {
      coupon.usedBy.push({
        user: userId,
        count: 1,
      });
    }

    await coupon.save();
  }

  async increaseCouponUsage(payload) {
    return this.increaseUsage(payload);
  }

  async decreaseUsage({ couponId, userId }) {
    if (!couponId) return;

    const coupon = await couponModel.findById(couponId);

    if (!coupon) return;

    coupon.usedCount = Math.max(coupon.usedCount - 1, 0);

    let usedInfo = null;
    if (userId) {
      usedInfo = coupon.usedBy.find(
        (item) => item.user.toString() === userId.toString(),
      );
    }

    if (usedInfo) {
      usedInfo.count = Math.max(usedInfo.count - 1, 0);
    }

    coupon.usedBy = coupon.usedBy.filter((item) => item.count > 0);

    await coupon.save();
  }

  async rollbackCouponUsage(payload) {
    return this.decreaseUsage(payload);
  }
}

module.exports = new CouponService();
