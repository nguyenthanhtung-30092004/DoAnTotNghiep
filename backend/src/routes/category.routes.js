const express = require("express");

const router = express.Router();

const categoryController = require("../controllers/category.controller");

const { createUploader } = require("../configs/multer");
const { authAdmin } = require("../middlewares/authUser");
const { asyncHandler } = require("../auth/checkAuth");

const upload = createUploader("uploads/categories");

// Public routes
router.get("/", asyncHandler(categoryController.getAllCategory));

// Admin routes
router.post(
  "/",
  authAdmin,
  upload.single("thumbnail"),
  asyncHandler(categoryController.createCategory),
);

router.put(
  "/:id",
  authAdmin,
  upload.single("thumbnail"),
  asyncHandler(categoryController.updateCategory),
);

router.delete(
  "/:id",
  authAdmin,
  asyncHandler(categoryController.deleteCategory),
);

module.exports = router;
