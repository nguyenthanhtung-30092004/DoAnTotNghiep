const express = require("express");
const brandController = require('../controllers/brand.controller');
const brandValidation = require('../validations/brand.validation');
const { createUploader } = require('../middlewares/upload');
const { authAdmin } = require('../middlewares/authentication');
const asyncHandler = require('../middlewares/asyncHandler');
const validate = require('../middlewares/validate');

const router = express.Router();
const upload = createUploader("uploads/brands");

router.get("/", asyncHandler(brandController.getAllBrand));
router.post(
  "/",
  authAdmin,
  upload.single("logoBrand"),
  validate(brandValidation.createBrand),
  asyncHandler(brandController.createBrand),
);
router.post(
  "/create",
  authAdmin,
  upload.single("logoBrand"),
  validate(brandValidation.createBrand),
  asyncHandler(brandController.createBrand),
);
router.put(
  "/:id",
  authAdmin,
  upload.single("logoBrand"),
  validate(brandValidation.updateBrand),
  asyncHandler(brandController.updateBrand),
);
router.put(
  "/update/:id",
  authAdmin,
  upload.single("logoBrand"),
  validate(brandValidation.updateBrand),
  asyncHandler(brandController.updateBrand),
);
router.delete("/:id", authAdmin, asyncHandler(brandController.deleteBrand));
router.delete("/delete/:id", authAdmin, asyncHandler(brandController.deleteBrand));

module.exports = router;
