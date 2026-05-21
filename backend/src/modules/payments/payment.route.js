const express = require("express");

const { asyncHandler } = require("../../auth/checkAuth");
const paymentController = require("./payment.controller");

const router = express.Router();

router.get("/vnpay-return", asyncHandler(paymentController.vnpayReturn));

module.exports = router;
