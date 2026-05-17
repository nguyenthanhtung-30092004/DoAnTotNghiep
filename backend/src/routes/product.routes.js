const express = require("express");

const router = express.Router();

const productController = require("../controllers/product.controller");

const { createUploader } = require("../configs/multer");
const { authAdmin } = require("../middlewares/authUser");
const { asyncHandler } = require("../auth/checkAuth");

const upload = createUploader("uploads/products");

router.get("/", asyncHandler(productController.getAllProducts));

router.get("/:id", asyncHandler(productController.getDetailProduct));
router.post(
  "/",
  authAdmin,
  upload.any(),
  asyncHandler(productController.createProduct),
);
router.put(
  "/:id",
  authAdmin,
  upload.any(),
  asyncHandler(productController.updateProduct),
);
router.delete("/:id", authAdmin, asyncHandler(productController.deleteProduct));

module.exports = router;
