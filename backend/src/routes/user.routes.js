const express = require("express");
const router = express.Router();

const usersController = require("../controllers/users.controller");
const { asyncHandler } = require("../auth/checkAuth");

router.post("/register", asyncHandler(usersController.register));

module.exports = router;
