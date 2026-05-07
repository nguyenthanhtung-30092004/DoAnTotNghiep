const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { BadRequestError } = require("../core/error.response");

function createUploader(folder = "uploads") {
  const uploadPath = `src/${folder}`;

  // tạo folder nếu chưa có
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, {
      recursive: true,
    });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },

    filename: (req, file, cb) => {
      const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);

      cb(null, uniqueName + path.extname(file.originalname));
    },
  });

  const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new BadRequestError("Chỉ cho phép upload file ảnh"), false);
    }

    cb(null, true);
  };

  return multer({
    storage,
    fileFilter,

    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  });
}

module.exports = {
  createUploader,
};
