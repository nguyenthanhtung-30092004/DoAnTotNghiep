const slugifyPackage = require("slugify");

const slugifyText = (text) => {
  return slugifyPackage(text, {
    lower: true,
    strict: true,
    locale: "vi",
  });
};

module.exports = slugifyText;
