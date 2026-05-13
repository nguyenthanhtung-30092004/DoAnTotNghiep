const { BadRequestError, NotFoundError } = require("../core/error.response");
const cartModel = require("../models/cart.model");

class CartService {
  // Add to cart
  async addToCard(userId, productId, variantId, sizeId, quantity) {
    // Validate
    if (!productId || !variantId || !sizeId || !quantity) {
      throw new BadRequestError("Thiếu thông tin");
    }

    if (quantity < 1) {
      throw new BadRequestError("Số lượng không hợp lệ");
    }

    // find product
    const product = await productModel.findById({
      _id: productId,
      isDeleted: false,
      isPublished: true,
    });

    if (!product) {
      throw new NotFoundError("Không tìm thấy sản phẩm");
    }

    // find variant
    const variant = product.variants.id(variantId);

    if (!variant || !variant.isActive) {
      throw new NotFoundError("Không tìm thấy biến thể");
    }

    // find size
    const size = variant.sizes.id(sizeId);

    if (!size || !size.isActive) {
      throw new NotFoundError("Không tìm thấy size");
    }

    // check stock
    if (size.stock < quantity) {
      throw new BadRequestError("Sản phẩm không đủ tồn kho");
    }

    // find or update cart item
    let cart = await cartModel.findOne({
      user: userId,
    });

    if (!cart) {
      cart = await cartModel.create({ user: userId, item: [] });
    }

    // check item exist
    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.variantId.toString() === variantId &&
        item.sizeId.toString() === sizeId,
    );

    // update existing item
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > size.stock) {
        throw new BadRequestError("Sản phẩm không đủ tồn kho");
      }

      existingItem.quantity = newQuantity;
      existingItem.maxQuantity = size.stock;
    }
    // create new item
    else {
      cart.item.push({
        product: product._id,
        variantId: variant._id,
        sizeId: size._id,
        productName: product.name,
        productSlug: product.slug,
        thumbnail: product.thumbnail.url || variant.images[0].url || "",
        color: variant.color,
        size: size.size,
        sku: size.sku,
        price: size.price,
        salePrice: size.salePrice,
        quantity,
        maxQuantity: size.stock,
        isAvailable: size.stock > 0,
      });
    }

    // save cart
    await cart.save();

    return cart;
  }

  // Get cart
  async getCart(userId) {
    const cart = await cartModel
      .findOne({
        user: userId,
      })
      .populate("product", "name slug thumbnail isPublished isDeleted")
      .lean();

    if (!cart) {
      return {
        items: [],
        totalQuantity: 0,
        totalPrice: 0,
        totalDiscount: 0,
        finalPrice: 0,
      };
    }

    return cart;
  }

  // Remove from cart
  async removeFromCart(userId, itemId) {
    const cart = await cartModel.findOne({
      user: userId,
    });

    if (!cart) {
      throw new NotFoundError("Giỏ hàng không tồn tại");
    }

    cart.items.pull(itemId);

    await cart.save();

    return cart;
  }

  // Update item quantity
  async updateItemQuantity(userId, itemId, quantity) {
    if (quantity < 1) {
      throw new BadRequestError("Số lượng không hợp lệ");
    }
    const cart = await cartModel.findOne({
      user: userId,
    });

    if (!cart) {
      throw new NotFoundError("Giỏ hàng không tồn tại");
    }

    const item = cart.items.id(itemId);

    if (!item) {
      throw new NotFoundError("Item không tồn tại trong giỏ hàng");
    }

    // check stock again
    const product = await productModel.findById(item.product);

    if (!product) {
      throw new NotFoundError("Sản phẩm không tồn tại");
    }
    const variant = product.variants.id(item.variantId);

    const size = variant?.sizes.id(item.sizeId);

    if (!size) {
      throw new NotFoundError("Size không tồn tại");
    }

    if (quantity > size.stock) {
      throw new BadRequestError(`Chỉ còn ${size.stock} sản phẩm`);
    }
    item.quantity = quantity;

    item.maxQuantity = size.stock;

    await cart.save();

    return cart;
  }

  // Clear cart
  async clearCart(userId) {
    const cart = await cartModel.findOne({
      user: userId,
    });

    if (!cart) {
      throw new NotFoundError("Cart không tồn tại");
    }

    cart.items = [];

    await cart.save();

    return {
      message: "Đã xóa toàn bộ giỏ hàng",
    };
  }

  async syncCart(userId) {
    const cart = await cartModel.findOne({
      user: userId,
    });

    if (!cart) {
      return null;
    }

    for (const item of cart.items) {
      const product = await productModel.findById(item.product);

      if (!product || product.isDeleted || !product.isPublished) {
        item.isAvailable = false;
        continue;
      }

      const variant = product.variants.id(item.variantId);

      if (!variant || !variant.isActive) {
        item.isAvailable = false;
        continue;
      }

      const size = variant.sizes.id(item.sizeId);
      if (!size || !size.isActive) {
        item.isAvailable = false;
        continue;
      }

      item.productName = product.name;
      item.productSlug = product.slug;

      item.thumbnail = variant.images?.[0]?.url || product.thumbnail?.url || "";

      item.color = variant.color;

      item.size = size.size;
      item.price = size.price;

      item.salePrice = size.salePrice;

      item.maxQuantity = size.stock;

      item.isAvailable = size.stock > 0;

      if (item.quantity > size.stock) {
        item.quantity = size.stock;
      }
    }

    cart.items = cart.items.filter((item) => item.quantity > 0);

    await cart.save();

    return cart;
  }
}

module.exports = new CartService();
