const express = require("express");
const authController = require('../controllers/users.controller');
const authValidation = require('../validations/auth.validation');
const asyncHandler = require('../middlewares/asyncHandler');
const { authUser } = require('../middlewares/authentication');
const validate = require('../middlewares/validate');

const router = express.Router();

router.post(
  "/register",
  validate(authValidation.register),
  asyncHandler(authController.register),
);
router.post(
  "/login",
  validate(authValidation.login),
  asyncHandler(authController.login),
);
router.post("/refresh-token", asyncHandler(authController.refreshToken));
router.post("/logout", asyncHandler(authController.logout));
router.get("/me", authUser, asyncHandler(authController.me));
router.patch("/me", authUser, asyncHandler(authController.updateMe));
router.post(
  "/forgot-password",
  validate(authValidation.forgotPassword),
  asyncHandler(authController.forgotPassword),
);
router.post(
  "/verify-otp",
  validate(authValidation.verifyOtp),
  asyncHandler(authController.verifyOtp),
);
router.post(
  "/reset-password",
  validate(authValidation.resetPassword),
  asyncHandler(authController.resetPassword),
);

module.exports = router;
