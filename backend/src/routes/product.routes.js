const express = require("express");

const router = express.Router();

const productController = require("../controllers/product.controller");

const { createUploader } = require("../configs/multer");
const { authAdmin } = require("../middlewares/authUser");
const { asyncHandler } = require("../auth/checkAuth");

const upload = createUploader("uploads/products");

router.get("/getAll", asyncHandler(productController.getAllProducts));
router.post(
  "/create",
  authAdmin,
  upload.any(),
  asyncHandler(productController.createProduct),
);

module.exports = router;
