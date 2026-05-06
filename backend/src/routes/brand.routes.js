const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");
const { authAdmin } = require("../middlewares/authUser");
const { asyncHandler } = require("../auth/checkAuth");
const brandController = require("../controllers/brand.controller");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/uploads/brands");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });
router.post(
  "/create",
  authAdmin,
  upload.single("logoBrand"),
  asyncHandler(brandController.createBrand),
);

router.put(
  "/update/:id",
  authAdmin,
  upload.single("logoBrand"),
  asyncHandler(brandController.updateBrand),
);

module.exports = router;
