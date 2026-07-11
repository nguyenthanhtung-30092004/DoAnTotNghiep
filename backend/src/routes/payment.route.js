const express = require("express");

const { asyncHandler } = require('../middlewares/checkAuth');
const paymentController = require('../controllers/payment.controller');

const router = express.Router();

router.get("/vnpay-return", asyncHandler(paymentController.vnpayReturn));

module.exports = router;
