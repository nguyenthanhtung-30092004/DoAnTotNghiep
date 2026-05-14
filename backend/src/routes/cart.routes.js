const express = require("express");

const cartController = require("../controllers/cart.controller");
const { asyncHandler } = require("../auth/checkAuth");
const { authUser } = require("../middlewares/authUser");

const router = express.Router();

router.use(authUser);

// Add to cart
router.post("/add", asyncHandler(cartController.addToCart));

// Get cart
router.get("/", asyncHandler(cartController.getCart));

// Update quantity
router.put("/:itemId", asyncHandler(cartController.updateQuantity));

// Remove from cart
router.delete("/:itemId", asyncHandler(cartController.removeFromCart));

// Clear cart
router.delete("/", asyncHandler(cartController.clearCart));

// Sync cart
router.post("/sync", asyncHandler(cartController.syncCart));

module.exports = router;
