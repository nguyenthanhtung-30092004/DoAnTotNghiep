const express = require("express");
const authController = require("./auth.controller");
const asyncHandler = require("../../middlewares/asyncHandler");

const router = express.Router();

router.post("/register", asyncHandler(authController.register));
router.post("/login", asyncHandler(authController.login));
router.post("/refresh-token", asyncHandler(authController.refreshToken));
router.post("/logout", asyncHandler(authController.logout));
router.post("/forgot-password", asyncHandler(authController.forgotPassword));
router.post("/verify-otp", asyncHandler(authController.verifyOtp));
router.post("/reset-password", asyncHandler(authController.resetPassword));

module.exports = router;
