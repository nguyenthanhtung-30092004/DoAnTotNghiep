const mongoose = require("mongoose");

const createSchema = (validator) => ({
  validate(payload = {}) {
    const body = payload.body || {};
    const result = validator(body, payload);

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
        body: result.value,
      },
    };
  },
});

const isObjectId = (value) => mongoose.Types.ObjectId.isValid(String(value));

const parseVariants = (variants) => {
  if (typeof variants === "string") {
    try {
      return { value: JSON.parse(variants) };
    } catch (error) {
      return { error: "Variants không hợp lệ" };
    }
  }

  return { value: variants };
};

const validateVariants = (variants, { required = false } = {}) => {
  if (variants === undefined || variants === null || variants === "") {
    return required
      ? { error: "Sản phẩm phải có ít nhất 1 biến thể" }
      : { value: undefined };
  }

  const parsed = parseVariants(variants);
  if (parsed.error) return parsed;

  if (!Array.isArray(parsed.value)) {
    return { error: "Variants phải là array" };
  }

  if (parsed.value.length === 0) {
    return { error: "Sản phẩm phải có ít nhất 1 biến thể" };
  }

  const skuSet = new Set();

  for (const variant of parsed.value) {
    if (!String(variant?.color || "").trim()) {
      return { error: "Vui lòng nhập màu hoặc tên biến thể" };
    }

    if (!Array.isArray(variant.sizes) || variant.sizes.length === 0) {
      return { error: "Mỗi biến thể phải có ít nhất 1 size" };
    }

    for (const size of variant.sizes) {
      const sizeName = String(size?.size || "").trim();
      const sku = String(size?.sku || "").trim();
      const price = Number(size?.price);
      const salePrice = Number(size?.salePrice || 0);
      const stock = Number(size?.stock);

      if (!sizeName) return { error: "Vui lòng nhập size" };
      if (!sku) return { error: "Vui lòng nhập SKU" };

      if (size?.price === undefined || size?.price === "") {
        return { error: "Vui lòng nhập giá" };
      }

      if (size?.stock === undefined || size?.stock === "") {
        return { error: "Vui lòng nhập tồn kho" };
      }

      if (!Number.isFinite(price) || !Number.isFinite(stock)) {
        return { error: "Giá và tồn kho phải là số hợp lệ" };
      }

      if (!Number.isFinite(salePrice)) {
        return { error: "Giá khuyến mãi phải là số hợp lệ" };
      }

      if (price < 0 || stock < 0 || salePrice < 0) {
        return { error: "Giá, giá khuyến mãi và tồn kho không được âm" };
      }

      if (salePrice > price) {
        return { error: "Giá khuyến mãi không được lớn hơn giá gốc" };
      }

      const normalizedSku = sku.toUpperCase();
      if (skuSet.has(normalizedSku)) {
        return { error: `SKU ${sku} bị trùng trong form` };
      }

      skuSet.add(normalizedSku);
    }
  }

  return { value: parsed.value };
};

const isValidImageFile = (file) => {
  return file && /^image\//.test(file.mimetype || "");
};

const createProduct = createSchema((body, payload) => {
  const name = String(body.name || "").trim();
  const category = String(body.category || "").trim();
  const brand = String(body.brand || "").trim();
  const variantsResult = validateVariants(body.variants, { required: true });
  const files = Array.isArray(payload.files) ? payload.files : [];
  const thumbnailFile = files.find((file) => file.fieldname === "thumbnail");

  if (!name) return { error: "Vui lòng nhập tên sản phẩm" };
  if (!category || !isObjectId(category)) return { error: "Danh mục không hợp lệ" };
  if (!brand || !isObjectId(brand)) return { error: "Thương hiệu không hợp lệ" };
  if (!thumbnailFile) return { error: "Vui lòng chọn ảnh đại diện sản phẩm" };
  if (!isValidImageFile(thumbnailFile)) return { error: "Ảnh đại diện không hợp lệ" };
  if (variantsResult.error) return variantsResult;

  return {
    value: {
      ...body,
      name,
      category,
      brand,
      variants: variantsResult.value,
    },
  };
});

const updateProduct = createSchema((body) => {
  const nextBody = { ...body };

  if (body.name !== undefined) {
    const name = String(body.name || "").trim();
    if (!name) return { error: "Vui lòng nhập tên sản phẩm" };
    nextBody.name = name;
  }

  if (body.category !== undefined) {
    const category = String(body.category || "").trim();
    if (!category || !isObjectId(category)) {
      return { error: "Danh mục không hợp lệ" };
    }
    nextBody.category = category;
  }

  if (body.brand !== undefined) {
    const brand = String(body.brand || "").trim();
    if (!brand || !isObjectId(brand)) {
      return { error: "Thương hiệu không hợp lệ" };
    }
    nextBody.brand = brand;
  }

  if (body.variants !== undefined) {
    const variantsResult = validateVariants(body.variants);
    if (variantsResult.error) return variantsResult;
    nextBody.variants = variantsResult.value;
  }

  return {
    value: nextBody,
  };
});

module.exports = {
  createProduct,
  updateProduct,
};
