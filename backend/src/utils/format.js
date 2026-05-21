const toBoolean = (value) => {
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  return value;
};

const toNumber = (value, defaultValue = 0) => {
  const number = Number(value);
  return Number.isNaN(number) ? defaultValue : number;
};

module.exports = {
  toBoolean,
  toNumber,
};
