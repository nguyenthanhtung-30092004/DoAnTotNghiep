const express = require("express");
const userController = require('../controllers/users.controller');
const asyncHandler = require('../middlewares/asyncHandler');
const { authAdmin } = require('../middlewares/authentication');

const router = express.Router();

// Admin routes - quản lý người dùng
router.get("/admin/users", authAdmin, asyncHandler(userController.getAllUsers));
router.get("/admin/users/:userId", authAdmin, asyncHandler(userController.getUserById));
router.patch("/admin/users/:userId/role", authAdmin, asyncHandler(userController.updateUserRole));
router.delete("/admin/users/:userId", authAdmin, asyncHandler(userController.deleteUser));

module.exports = router;
