const express = require("express");
const { asyncHandler } = require("../auth/checkAuth");
const { authAdmin } = require("../middlewares/authUser");
const categoryController = require("../controllers/category.controller");
const router = express.Router();

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/uploads/categories");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });
router.post(
  "/create",
  authAdmin,
  upload.single("thumbnail"),
  asyncHandler(categoryController.createCategory),
);

router.put(
  "/update/:id",
  authAdmin,
  upload.single("thumbnail"),
  asyncHandler(categoryController.updateCategory),
);
router.delete(
  "/delete/:id",
  authAdmin,
  upload.single("thumbnail"),
  asyncHandler(categoryController.deleteCategory),
);

router.get("/list", asyncHandler(categoryController.getAllCategory));

module.exports = router;
