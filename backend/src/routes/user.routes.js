const express = require("express");
const router = express.Router();

const usersController = require("../controllers/users.controller");
const { asyncHandler } = require("../auth/checkAuth");

router.post("/register", asyncHandler(usersController.register));
router.post("/login", asyncHandler(usersController.login));
router.post("/refresh-token", asyncHandler(usersController.refreshToken));
router.post("/logout", asyncHandler(usersController.logout));
router.post("/forgot-password", asyncHandler(usersController.forgotPassword));
router.post("/verify-otp", asyncHandler(usersController.verifyOtp));
router.post("/reset-password", asyncHandler(usersController.resetPassword));
module.exports = router;
