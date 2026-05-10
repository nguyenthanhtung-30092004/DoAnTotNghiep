const {
  BadRequestError,
  ConflictRequestError,
} = require("../core/error.response");
const productModel = require("../models/product.model");

/**
 * Validate variants array for Product (both Create and Update)
 * @param {Array} variants - Array of variant objects
 * @param {String} excludeProductId - Product ID to exclude when checking for SKU uniqueness (used in Update)
 */
async function validateVariants(variants, excludeProductId = null) {
  if (!Array.isArray(variants) || variants.length === 0) {
    throw new BadRequestError("Sản phẩm phải có ít nhất 1 màu sắc (variant)");
  }

  const variantKeys = new Set();

  for (const variant of variants) {
    if (!variant.color) {
      throw new BadRequestError("Biến thể phải có màu sắc");
    }

    if (!Array.isArray(variant.sizes) || variant.sizes.length === 0) {
      throw new BadRequestError(`Màu ${variant.color} phải có ít nhất 1 kích cỡ`);
    }

    if (!variant.images) {
      variant.images = [];
    }

    for (const sizeItem of variant.sizes) {
      if (
        sizeItem.price === undefined ||
        sizeItem.price === null ||
        sizeItem.price < 0
      ) {
        throw new BadRequestError(
          `Giá của size ${sizeItem.size} màu ${variant.color} không hợp lệ`
        );
      }

      if (
        sizeItem.salePrice !== undefined &&
        sizeItem.salePrice > sizeItem.price
      ) {
        throw new BadRequestError("Giá khuyến mãi phải nhỏ hơn giá gốc");
      }

      if (sizeItem.stock !== undefined && sizeItem.stock < 0) {
        throw new BadRequestError("Số lượng tồn kho không hợp lệ");
      }

      const variantKey = `${variant.color}-${sizeItem.size}`;
      if (variantKeys.has(variantKey)) {
        throw new ConflictRequestError(`Phân loại bị trùng lặp: ${variantKey}`);
      }
      variantKeys.add(variantKey);

      if (sizeItem.sku) {
        const query = { "variants.sizes.sku": sizeItem.sku };
        if (excludeProductId) {
          query._id = { $ne: excludeProductId };
        }
        
        const existingSku = await productModel.findOne(query);
        if (existingSku) {
          throw new ConflictRequestError(`SKU ${sizeItem.sku} đã tồn tại`);
        }
      }
    }
  }
}

module.exports = {
  validateVariants,
};
