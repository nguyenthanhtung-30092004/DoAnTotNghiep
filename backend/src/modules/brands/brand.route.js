const express = require("express");
const brandController = require("./brand.controller");
const { createUploader } = require("../../middlewares/upload");
const { authAdmin } = require("../../middlewares/authentication");
const asyncHandler = require("../../middlewares/asyncHandler");

const router = express.Router();
const upload = createUploader("uploads/brands");

router.get("/", asyncHandler(brandController.getAllBrand));
router.get("/listbrand", asyncHandler(brandController.getAllBrand));
router.post("/", authAdmin, upload.single("logoBrand"), asyncHandler(brandController.createBrand));
router.post("/create", authAdmin, upload.single("logoBrand"), asyncHandler(brandController.createBrand));
router.put("/:id", authAdmin, upload.single("logoBrand"), asyncHandler(brandController.updateBrand));
router.put("/update/:id", authAdmin, upload.single("logoBrand"), asyncHandler(brandController.updateBrand));
router.delete("/:id", authAdmin, asyncHandler(brandController.deleteBrand));
router.delete("/delete/:id", authAdmin, asyncHandler(brandController.deleteBrand));

module.exports = router;
