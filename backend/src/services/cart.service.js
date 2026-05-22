const { BadRequestError, NotFoundError } = require("../core/error.response");
const cartModel = require("../models/cart.model");
const productModel = require("../models/product.model");

const getImageUrl = (image) => {
  if (!image) return "";
  if (typeof image === "string") return image;

  return image.url || image.secure_url || "";
};

class CartService {
  getFinalPrice(size) {
    const price = Number(size.price || 0);
    const salePrice = Number(size.salePrice || 0);

    return salePrice > 0 && salePrice < price ? salePrice : price;
  }

  formatCartItem({ item, product, variant, size }) {
    const price = Number(size.price || 0);
    const salePrice = Number(size.salePrice || 0);
    const finalPrice = this.getFinalPrice(size);
    const stock = Number(size.stock || 0);

    return {
      _id: item._id,

      productId: product._id,
      productName: product.name,
      productSlug: product.slug,

      variantId: variant._id,
      color: variant.color,
      colorCode: variant.colorCode,

      sizeId: size._id,
      size: size.size,
      sku: size.sku,

      // Ảnh chuẩn cho FE: luôn lấy ảnh đầu tiên của variant theo màu
      image: getImageUrl(variant.images?.[0]),

      price,
      salePrice,
      finalPrice,

      quantity: Number(item.quantity || 0),
      maxQuantity: stock,
      stock,

      isAvailable:
        product.isPublished &&
        !product.isDeleted &&
        variant.isActive !== false &&
        size.isActive !== false &&
        stock > 0,
    };
  }

  async formatCart(cart) {
    if (!cart) {
      return {
        items: [],
        totalQuantity: 0,
        totalPrice: 0,
        totalDiscount: 0,
        finalPrice: 0,
      };
    }

    const formattedItems = [];

    for (const item of cart.items) {
      const product = await productModel.findById(item.product);

      if (!product || product.isDeleted) continue;

      const variant = product.variants.id(item.variantId);
      if (!variant) continue;

      const size = variant.sizes.id(item.sizeId);
      if (!size) continue;

      formattedItems.push(
        this.formatCartItem({
          item,
          product,
          variant,
          size,
        }),
      );
    }

    const totalQuantity = formattedItems.reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0,
    );

    const totalPrice = formattedItems.reduce((sum, item) => {
      return sum + Number(item.price || 0) * Number(item.quantity || 0);
    }, 0);

    const finalPrice = formattedItems.reduce((sum, item) => {
      return sum + Number(item.finalPrice || 0) * Number(item.quantity || 0);
    }, 0);

    const totalDiscount = totalPrice - finalPrice;

    return {
      _id: cart._id,
      user: cart.user,
      items: formattedItems,
      totalQuantity,
      totalPrice,
      totalDiscount,
      finalPrice,
    };
  }

  // Add to cart
  async addToCart({ userId, productId, variantId, sizeId, quantity }) {
    quantity = Number(quantity || 0);

    if (!userId || !productId || !variantId || !sizeId || !quantity) {
      throw new BadRequestError("Thiếu thông tin");
    }

    if (quantity < 1) {
      throw new BadRequestError("Số lượng không hợp lệ");
    }

    const product = await productModel.findOne({
      _id: productId,
      isDeleted: false,
      isPublished: true,
    });

    if (!product) {
      throw new NotFoundError("Không tìm thấy sản phẩm");
    }

    const variant = product.variants.id(variantId);

    if (!variant || variant.isActive === false) {
      throw new NotFoundError("Không tìm thấy biến thể");
    }

    const size = variant.sizes.id(sizeId);

    if (!size || size.isActive === false) {
      throw new NotFoundError("Không tìm thấy size");
    }

    const stock = Number(size.stock || 0);

    if (stock <= 0) {
      throw new BadRequestError("Sản phẩm đã hết hàng");
    }

    if (quantity > stock) {
      throw new BadRequestError("Sản phẩm không đủ tồn kho");
    }

    let cart = await cartModel.findOne({
      user: userId,
    });

    if (!cart) {
      cart = await cartModel.create({
        user: userId,
        items: [],
      });
    }

    const existingItem = cart.items.find((item) => {
      return (
        item.product.toString() === productId.toString() &&
        item.variantId.toString() === variantId.toString() &&
        item.sizeId.toString() === sizeId.toString()
      );
    });

    if (existingItem) {
      const newQuantity = Number(existingItem.quantity || 0) + quantity;

      if (newQuantity > stock) {
        throw new BadRequestError("Sản phẩm không đủ tồn kho");
      }

      existingItem.quantity = newQuantity;
      existingItem.maxQuantity = stock;
    } else {
      cart.items.push({
        product: product._id,
        variantId: variant._id,
        sizeId: size._id,

        // Các field này giữ lại để tương thích schema cũ nếu cartModel đang có
        productName: product.name,
        productSlug: product.slug,
        thumbnail: getImageUrl(variant.images?.[0]),
        color: variant.color,
        size: size.size,
        sku: size.sku,
        price: size.price,
        salePrice: size.salePrice,
        quantity,
        maxQuantity: stock,
        isAvailable: stock > 0,
      });
    }

    await cart.save();

    return this.formatCart(cart);
  }

  // Get cart
  async getCart(userId) {
    const cart = await cartModel.findOne({
      user: userId,
    });

    return this.formatCart(cart);
  }

  async getCartByUser(userId) {
    return this.getCart(userId);
  }

  async getCartDocument({ userId }) {
    return cartModel.findOne({ user: userId });
  }

  // Remove from cart
  async removeFromCart({ userId, itemId }) {
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

    item.deleteOne();

    await cart.save();

    return this.formatCart(cart);
  }

  async removeCartItem(payload) {
    return this.removeFromCart(payload);
  }

  // Update item quantity
  async updateItemQuantity({ userId, itemId, quantity }) {
    quantity = Number(quantity || 0);

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

    const product = await productModel.findOne({
      _id: item.product,
      isDeleted: false,
      isPublished: true,
    });

    if (!product) {
      throw new NotFoundError("Sản phẩm không tồn tại");
    }

    const variant = product.variants.id(item.variantId);

    if (!variant || variant.isActive === false) {
      throw new NotFoundError("Biến thể không tồn tại");
    }

    const size = variant.sizes.id(item.sizeId);

    if (!size || size.isActive === false) {
      throw new NotFoundError("Size không tồn tại");
    }

    const stock = Number(size.stock || 0);

    if (quantity > stock) {
      throw new BadRequestError(`Chỉ còn ${stock} sản phẩm`);
    }

    item.quantity = quantity;
    item.maxQuantity = stock;

    await cart.save();

    return this.formatCart(cart);
  }

  async updateCartItem(payload) {
    return this.updateItemQuantity(payload);
  }

  // Clear cart
  async clearCart(userId) {
    const cart = await cartModel.findOne({ user: userId });

    if (!cart) {
      throw new NotFoundError("Cart không tồn tại");
    }

    cart.items = [];

    await cart.save();

    return {
      items: [],
      totalQuantity: 0,
      totalPrice: 0,
      totalDiscount: 0,
      finalPrice: 0,
    };
  }

  async clearCartByUser({ userId }) {
    const cart = await cartModel.findOne({ user: userId });

    if (!cart) return null;

    cart.items = [];

    await cart.save();

    return {
      items: [],
      totalQuantity: 0,
      totalPrice: 0,
      totalDiscount: 0,
      finalPrice: 0,
    };
  }

  async syncCart(userId) {
    const cart = await cartModel.findOne({
      user: userId,
    });

    if (!cart) {
      return {
        items: [],
        totalQuantity: 0,
        totalPrice: 0,
        totalDiscount: 0,
        finalPrice: 0,
      };
    }

    for (const item of cart.items) {
      const product = await productModel.findById(item.product);

      if (!product || product.isDeleted || !product.isPublished) {
        item.isAvailable = false;
        continue;
      }

      const variant = product.variants.id(item.variantId);

      if (!variant || variant.isActive === false) {
        item.isAvailable = false;
        continue;
      }

      const size = variant.sizes.id(item.sizeId);

      if (!size || size.isActive === false) {
        item.isAvailable = false;
        continue;
      }

      const stock = Number(size.stock || 0);

      item.productName = product.name;
      item.productSlug = product.slug;

      item.thumbnail = getImageUrl(variant.images?.[0]);

      item.color = variant.color;
      item.size = size.size;
      item.sku = size.sku;
      item.price = size.price;
      item.salePrice = size.salePrice;
      item.maxQuantity = stock;
      item.isAvailable = stock > 0;

      if (item.quantity > stock) {
        item.quantity = stock;
      }
    }

    cart.items = cart.items.filter((item) => Number(item.quantity || 0) > 0);

    await cart.save();

    return this.formatCart(cart);
  }
}

module.exports = new CartService();