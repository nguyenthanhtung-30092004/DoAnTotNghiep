const express = require("express");
const categoryController = require("./category.controller");
const { createUploader } = require("../../middlewares/upload");
const { authAdmin } = require("../../middlewares/authentication");
const asyncHandler = require("../../middlewares/asyncHandler");

const router = express.Router();
const upload = createUploader("uploads/categories");

router.get("/", asyncHandler(categoryController.getAllCategory));
router.post("/", authAdmin, upload.single("thumbnail"), asyncHandler(categoryController.createCategory));
router.put("/:id", authAdmin, upload.single("thumbnail"), asyncHandler(categoryController.updateCategory));
router.delete("/:id", authAdmin, asyncHandler(categoryController.deleteCategory));

module.exports = router;
