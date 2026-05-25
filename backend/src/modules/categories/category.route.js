const express = require("express");
const categoryController = require("./category.controller");
const categoryValidation = require("./category.validation");
const { createUploader } = require("../../middlewares/upload");
const { authAdmin } = require("../../middlewares/authentication");
const asyncHandler = require("../../middlewares/asyncHandler");
const validate = require("../../middlewares/validate");

const router = express.Router();
const upload = createUploader("uploads/categories");

router.get("/", asyncHandler(categoryController.getAllCategory));
router.post(
  "/",
  authAdmin,
  upload.single("thumbnail"),
  validate(categoryValidation.createCategory),
  asyncHandler(categoryController.createCategory),
);
router.put(
  "/:id",
  authAdmin,
  upload.single("thumbnail"),
  validate(categoryValidation.updateCategory),
  asyncHandler(categoryController.updateCategory),
);
router.delete("/:id", authAdmin, asyncHandler(categoryController.deleteCategory));

module.exports = router;
