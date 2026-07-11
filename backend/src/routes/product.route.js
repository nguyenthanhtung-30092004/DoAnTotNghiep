const express = require("express");
const productController = require('../controllers/product.controller');
const productValidation = require('../validations/product.validation');
const { createUploader } = require('../middlewares/upload');
const { authAdmin } = require('../middlewares/authentication');
const asyncHandler = require('../middlewares/asyncHandler');
const validate = require('../middlewares/validate');

const router = express.Router();
const upload = createUploader("uploads/products");

router.get(
  "/category/:categoryId",
  asyncHandler(productController.getAllProducts),
);
router.get("/brand/:brandId", asyncHandler(productController.getAllProducts));
router.get("/", asyncHandler(productController.getAllProducts));
router.get("/:idOrSlug", asyncHandler(productController.getDetailProduct));
router.post(
  "/",
  authAdmin,
  upload.any(),
  validate(productValidation.createProduct),
  asyncHandler(productController.createProduct),
);
router.put(
  "/:id",
  authAdmin,
  upload.any(),
  validate(productValidation.updateProduct),
  asyncHandler(productController.updateProduct),
);
router.delete("/:id", authAdmin, asyncHandler(productController.deleteProduct));

module.exports = router;
