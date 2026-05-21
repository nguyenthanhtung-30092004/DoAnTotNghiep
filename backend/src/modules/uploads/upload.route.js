const express = require("express");
const uploadController = require("./upload.controller");
const asyncHandler = require("../../middlewares/asyncHandler");
const { authAdmin } = require("../../middlewares/authentication");
const { createUploader } = require("../../middlewares/upload");

const router = express.Router();
const upload = createUploader("uploads");

router.post("/image", authAdmin, upload.single("image"), asyncHandler(uploadController.uploadSingleImage));

module.exports = router;
