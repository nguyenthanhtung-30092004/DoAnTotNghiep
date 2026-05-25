const express = require("express");
const cartController = require("./cart.controller");
const cartValidation = require("./cart.validation");
const asyncHandler = require("../../middlewares/asyncHandler");
const { authUser } = require("../../middlewares/authentication");
const validate = require("../../middlewares/validate");

const router = express.Router();

router.use(authUser);

router.post(
  "/add",
  validate(cartValidation.addToCart),
  asyncHandler(cartController.addToCart),
);
router.get("/", asyncHandler(cartController.getCart));
router.put(
  "/:itemId",
  validate(cartValidation.updateQuantity),
  asyncHandler(cartController.updateQuantity),
);
router.delete(
  "/:itemId",
  validate(cartValidation.removeFromCart),
  asyncHandler(cartController.removeFromCart),
);
router.delete("/", asyncHandler(cartController.clearCart));
router.post("/sync", asyncHandler(cartController.syncCart));

module.exports = router;
