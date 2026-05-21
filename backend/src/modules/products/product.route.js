const express = require("express");
const productController = require("./product.controller");
const { createUploader } = require("../../middlewares/upload");
const { authAdmin } = require("../../middlewares/authentication");
const asyncHandler = require("../../middlewares/asyncHandler");

const router = express.Router();
const upload = createUploader("uploads/products");

router.get("/", asyncHandler(productController.getAllProducts));
router.get("/:idOrSlug", asyncHandler(productController.getDetailProduct));
router.post("/", authAdmin, upload.any(), asyncHandler(productController.createProduct));
router.put("/:id", authAdmin, upload.any(), asyncHandler(productController.updateProduct));
router.delete("/:id", authAdmin, asyncHandler(productController.deleteProduct));

module.exports = router;
