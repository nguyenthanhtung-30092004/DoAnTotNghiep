const express = require("express");
const dashboardController = require('../controllers/dashboard.controller');
const asyncHandler = require('../middlewares/asyncHandler');
const { authAdmin } = require('../middlewares/authentication');

const router = express.Router();

router.get("/stats", authAdmin, asyncHandler(dashboardController.getDashboardStats));

module.exports = router;
