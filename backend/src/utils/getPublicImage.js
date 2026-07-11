const { BadRequestError } = require('../core/error.response');

function getPublicId(url) {
  if (!url) return null;

  const parts = url.split("/");
  const uploadIndex = parts.indexOf("upload");

  if (uploadIndex === -1) {
    throw new BadRequestError("Đường dẫn ảnh không hợp lệ");
  }

  const pathParts = parts.slice(uploadIndex + 1);

  const pathWithoutVersion = pathParts[0].startsWith("v")
    ? pathParts.slice(1)
    : pathParts;

  const publicIdWithExt = pathWithoutVersion.join("/");

  return publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf("."));
}

module.exports = { getPublicId };
