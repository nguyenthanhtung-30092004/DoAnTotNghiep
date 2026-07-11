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

const validateImage = (file, { required = false } = {}) => {
  if (!file) {
    return required ? "Vui lòng upload ảnh danh mục" : "";
  }

  if (!/^image\//.test(file.mimetype || "")) {
    return "Ảnh danh mục không hợp lệ";
  }

  if (file.size > 2 * 1024 * 1024) {
    return "Ảnh danh mục không được vượt quá 2MB";
  }

  return "";
};

const normalizeCategoryBody = (body) => {
  const name = String(body.name || "").trim();
  const slug = String(body.slug || "").trim().toLowerCase();
  const parentId = String(body.parentId || "").trim();

  if (!name) return { error: "Vui lòng nhập tên danh mục" };
  if (!slug) return { error: "Vui lòng nhập slug danh mục" };

  if (parentId && !isObjectId(parentId)) {
    return { error: "Danh mục cha không hợp lệ" };
  }

  return {
    value: {
      ...body,
      name,
      slug,
      parentId,
      description: String(body.description || "").trim(),
    },
  };
};

const createCategory = createSchema((body, payload) => {
  const imageError = validateImage(payload.file, { required: true });
  if (imageError) return { error: imageError };

  return normalizeCategoryBody(body);
});

const updateCategory = createSchema((body, payload) => {
  const imageError = validateImage(payload.file);
  if (imageError) return { error: imageError };

  return normalizeCategoryBody(body);
});

module.exports = {
  createCategory,
  updateCategory,
};
