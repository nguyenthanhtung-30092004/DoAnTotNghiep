const express = require("express");
const cartController = require("./cart.controller");
const asyncHandler = require("../../middlewares/asyncHandler");
const { authUser } = require("../../middlewares/authentication");

const router = express.Router();

router.use(authUser);

router.post("/add", asyncHandler(cartController.addToCart));
router.get("/", asyncHandler(cartController.getCart));
router.put("/:itemId", asyncHandler(cartController.updateQuantity));
router.delete("/:itemId", asyncHandler(cartController.removeFromCart));
router.delete("/", asyncHandler(cartController.clearCart));
router.post("/sync", asyncHandler(cartController.syncCart));

module.exports = router;
