const { BadRequestError } = require("../core/error.response");
const fs = require("fs/promises");

const cleanupUploadedFiles = (req) => {
  const files = [];

  if (req.file) files.push(req.file);
  if (Array.isArray(req.files)) files.push(...req.files);

  if (req.files && !Array.isArray(req.files)) {
    Object.values(req.files).forEach((value) => {
      if (Array.isArray(value)) files.push(...value);
    });
  }

  files.forEach((file) => {
    if (file?.path) {
      fs.unlink(file.path).catch(() => {});
    }
  });
};

const validate = (schema) => {
  return (req, res, next) => {
    if (!schema) return next();

    const result = schema.validate({
      body: req.body,
      params: req.params,
      query: req.query,
      file: req.file,
      files: req.files,
    });

    if (result.error) {
      cleanupUploadedFiles(req);
      return next(new BadRequestError(result.error.message));
    }

    if (result.value?.body) req.body = result.value.body;
    if (result.value?.params) req.params = result.value.params;
    if (result.value?.query) req.query = result.value.query;

    return next();
  };
};

module.exports = validate;
