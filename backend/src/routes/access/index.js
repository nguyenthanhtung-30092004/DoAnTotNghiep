"use strict";
const express = require("express");
const accessController = require("../../controllers/access.controller");

const { authentication } = require("../../auth/authUtils");
const { asyncHandler } = require("../../helpers/asyncHandler");
const router = express.Router();

router.post("/user/signup", asyncHandler(accessController.signUp));
router.post("/user/login", asyncHandler(accessController.login));
router.post(
  "/user/refresh-token",
  asyncHandler(accessController.handleRefreshToken),
); // Route mới

// Authenticated Routes
router.use(authentication);
router.post("/user/logout", asyncHandler(accessController.logout));

module.exports = router;
