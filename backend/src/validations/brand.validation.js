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

const validateLogo = (file, { required = false } = {}) => {
  if (!file) {
    return required ? "Vui lòng upload logo thương hiệu" : "";
  }

  if (!/^image\//.test(file.mimetype || "")) {
    return "Logo thương hiệu không hợp lệ";
  }

  if (file.size > 2 * 1024 * 1024) {
    return "Logo thương hiệu không được vượt quá 2MB";
  }

  return "";
};

const normalizeBrandBody = (body) => {
  const nameBrand = String(body.nameBrand || "").trim();
  const slugBrand = String(body.slugBrand || "").trim().toLowerCase();
  const description = String(body.description || "").trim();

  if (!nameBrand) return { error: "Vui lòng nhập tên thương hiệu" };
  if (!slugBrand) return { error: "Vui lòng nhập slug thương hiệu" };
  if (!description) return { error: "Vui lòng nhập mô tả thương hiệu" };

  return {
    value: {
      ...body,
      nameBrand,
      slugBrand,
      description,
      outStanding: body.outStanding === "true" || body.outStanding === true,
    },
  };
};

const createBrand = createSchema((body, payload) => {
  const logoError = validateLogo(payload.file, { required: true });
  if (logoError) return { error: logoError };

  return normalizeBrandBody(body);
});

const updateBrand = createSchema((body, payload) => {
  const logoError = validateLogo(payload.file);
  if (logoError) return { error: logoError };

  return normalizeBrandBody(body);
});

module.exports = {
  createBrand,
  updateBrand,
};
