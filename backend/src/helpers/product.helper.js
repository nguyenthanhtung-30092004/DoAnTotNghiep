const {
  BadRequestError,
  ConflictRequestError,
} = require("../core/error.response");
const productModel = require("../models/product.model");

const validateVariants = async (variants, productId = null) => {
  if (!Array.isArray(variants) || variants.length === 0) {
    throw new BadRequestError("Sản phẩm phải có ít nhất 1 biến thể");
  }

  const skuList = [];

  for (const variant of variants) {
    if (!variant.color || !variant.color.trim()) {
      throw new BadRequestError("Vui lòng nhập màu hoặc tên biến thể");
    }

    if (!Array.isArray(variant.sizes) || variant.sizes.length === 0) {
      throw new BadRequestError("Mỗi biến thể phải có ít nhất 1 size");
    }

    for (const item of variant.sizes) {
      if (!item.size || !item.size.trim()) {
        throw new BadRequestError("Vui lòng nhập size");
      }

      if (!item.sku || !item.sku.trim()) {
        throw new BadRequestError("Vui lòng nhập SKU");
      }

      if (item.price === undefined || item.stock === undefined) {
        throw new BadRequestError("Vui lòng nhập giá và tồn kho");
      }

      if (Number(item.price) < 0 || Number(item.stock) < 0) {
        throw new BadRequestError("Giá và tồn kho không được âm");
      }

      if (Number(item.salePrice || 0) > Number(item.price)) {
        throw new BadRequestError("Giá khuyến mãi không được lớn hơn giá gốc");
      }

      skuList.push(item.sku.trim());
    }
  }

  const duplicateSkuInRequest = skuList.find(
    (sku, index) => skuList.indexOf(sku) !== index,
  );

  if (duplicateSkuInRequest) {
    throw new ConflictRequestError(
      `SKU ${duplicateSkuInRequest} bị trùng trong form`,
    );
  }

  const filter = {
    "variants.sizes.sku": { $in: skuList },
    isDeleted: false,
  };

  if (productId) {
    filter._id = { $ne: productId };
  }

  const existedProduct = await productModel.findOne(filter).lean();

  if (existedProduct) {
    throw new ConflictRequestError("SKU đã tồn tại");
  }
};

module.exports = {
  validateVariants,
};
