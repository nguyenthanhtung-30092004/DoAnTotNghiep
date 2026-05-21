const { BadRequestError } = require("../core/error.response");

const validate = (schema) => {
  return (req, res, next) => {
    if (!schema) return next();

    const result = schema.validate({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (result.error) {
      return next(new BadRequestError(result.error.message));
    }

    if (result.value?.body) req.body = result.value.body;
    if (result.value?.params) req.params = result.value.params;
    if (result.value?.query) req.query = result.value.query;

    return next();
  };
};

module.exports = validate;
