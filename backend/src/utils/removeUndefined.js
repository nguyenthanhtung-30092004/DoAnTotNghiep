const removeUndefined = (object = {}) => {
  return Object.fromEntries(
    Object.entries(object).filter(([, value]) => value !== undefined),
  );
};

module.exports = removeUndefined;
