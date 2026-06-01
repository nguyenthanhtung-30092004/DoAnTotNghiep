const { OK } = require("../../core/success.response");
const cartService = require("./cart.service");

class CartController {
  addToCart = async (req, res) => {
    new OK({
      message: "Thêm vào giỏ hàng thành công",
      metadata: await cartService.addToCart({
        userId: req.user.userId,
        ...req.body,
      }),
    }).send(res);
  };

  getCart = async (req, res) => {
    new OK({
      message: "Lấy giỏ hàng thành công",
      metadata: await cartService.getCart(req.user.userId),
    }).send(res);
  };

  updateQuantity = async (req, res) => {
    new OK({
      message: "Cập nhật số lượng thành công",
      metadata: await cartService.updateItemQuantity({
        userId: req.user.userId,
        itemId: req.params.itemId,
        quantity: req.body.quantity,
      }),
    }).send(res);
  };

  removeFromCart = async (req, res) => {
    new OK({
      message: "Xóa sản phẩm khỏi giỏ hàng thành công",
      metadata: await cartService.removeFromCart({
        userId: req.user.userId,
        itemId: req.params.itemId,
      }),
    }).send(res);
  };

  clearCart = async (req, res) => {
    new OK({
      message: "Đã xóa giỏ hàng",
      metadata: await cartService.clearCart(req.user.userId),
    }).send(res);
  };

  syncCart = async (req, res) => {
    new OK({
      message: "Sync cart thành công",
      metadata: await cartService.syncCart(req.user.userId),
    }).send(res);
  };
}
module.exports = new CartController();

