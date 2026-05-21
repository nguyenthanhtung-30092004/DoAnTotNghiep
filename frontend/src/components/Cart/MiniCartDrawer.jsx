import { Loader2, Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

import CartService from "../../services/cart.service";
import {
  closeCartDrawer,
  decreaseQuantity,
  increaseQuantity,
  removeCartItem,
  setCart,
} from "../../redux/feature/cartSlice";

const getResponseData = (res) => {
  return res.data?.metadata || res.data?.data || res.data;
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(price || 0));
};

const getItemPrice = (item) => {
  const price = Number(item.price || 0);
  const salePrice = Number(item.salePrice || 0);

  return salePrice > 0 && salePrice < price ? salePrice : price;
};

const MiniCartDrawer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, isDrawerOpen } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState("");

  const getCartItemImage = (item) => {
    return (
      item.variantImage ||
      item.colorImage ||
      item.image ||
      item.thumbnail ||
      item.product?.thumbnail?.url ||
      item.product?.thumbnail ||
      ""
    );
  };

  const subtotal = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + getItemPrice(item) * Number(item.quantity || 0),
      0,
    );
  }, [items]);

  const fetchCart = async () => {
    if (!user || !isDrawerOpen) return;

    try {
      setLoading(true);
      const res = await CartService.getCart();
      dispatch(setCart(getResponseData(res) || { items: [] }));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => dispatch(closeCartDrawer());

  const handleQuantity = async (item, nextQuantity) => {
    if (nextQuantity < 1) return;

    if (!user) {
      if (nextQuantity > item.quantity) {
        dispatch(increaseQuantity(item.localId));
      } else {
        dispatch(decreaseQuantity(item.localId));
      }
      return;
    }

    try {
      setUpdatingId(item._id);
      const res = await CartService.updateQuantity(item._id, nextQuantity);
      dispatch(setCart(getResponseData(res) || { items: [] }));
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Cập nhật giỏ hàng thất bại",
      );
    } finally {
      setUpdatingId("");
    }
  };

  const handleRemove = async (item) => {
    if (!user) {
      dispatch(removeCartItem(item.localId));
      return;
    }

    try {
      setUpdatingId(item._id);
      const res = await CartService.removeFromCart(item._id);
      dispatch(setCart(getResponseData(res) || { items: [] }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Xóa sản phẩm thất bại");
    } finally {
      setUpdatingId("");
    }
  };

  const handleCheckout = () => {
    handleClose();
    navigate(user ? "/checkout" : "/login?redirect=/checkout");
  };

  useEffect(() => {
    fetchCart();
  }, [isDrawerOpen, user?._id, user?.id]);

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-[80]">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={handleClose}
        aria-label="Đóng giỏ hàng"
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Giỏ hàng</h2>
            <p className="text-sm text-gray-500">{items.length} sản phẩm</p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="flex size-10 items-center justify-center rounded-lg hover:bg-gray-100"
            aria-label="Đóng"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {loading ? (
            <div className="flex h-40 items-center justify-center text-gray-500">
              <Loader2 className="mr-2 size-5 animate-spin" />
              Đang tải giỏ hàng...
            </div>
          ) : items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-accent">
                <ShoppingCart className="size-7 text-primary" />
              </div>
              <p className="font-semibold text-gray-900">Giỏ hàng đang trống</p>
              <Link
                to="/shop"
                onClick={handleClose}
                className="mt-4 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const itemId = item._id || item.localId;
                const isUpdating = updatingId === itemId;
                const productLink = item.productSlug
                  ? `/product/${item.productSlug}`
                  : `/product/${item.product?._id || item.productId || item.product}`;

                return (
                  <div key={itemId} className="flex gap-3 border-b pb-4">
                    <Link
                      to={productLink}
                      onClick={handleClose}
                      className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100"
                    >
                      {getCartItemImage(item) ? (
                        <img
                          src={getCartItemImage(item)}
                          alt={item.productName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ShoppingCart className="size-6 text-gray-400" />
                      )}
                    </Link>

                    <div className="min-w-0 flex-1">
                      <Link
                        to={productLink}
                        onClick={handleClose}
                        className="line-clamp-2 text-sm font-semibold text-gray-900 hover:text-primary"
                      >
                        {item.productName || item.product?.name}
                      </Link>
                      <p className="mt-1 text-xs text-gray-500">
                        {item.color} / Size {item.size}
                      </p>
                      <p className="mt-2 text-sm font-bold text-red-500">
                        {formatPrice(getItemPrice(item))}
                      </p>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="inline-flex items-center rounded-lg border">
                          <button
                            type="button"
                            disabled={isUpdating || item.quantity <= 1}
                            onClick={() =>
                              handleQuantity(item, Number(item.quantity) - 1)
                            }
                            className="flex size-8 items-center justify-center disabled:opacity-40"
                          >
                            <Minus className="size-4" />
                          </button>
                          <span className="w-9 text-center text-sm font-semibold">
                            {isUpdating ? (
                              <Loader2 className="mx-auto size-4 animate-spin" />
                            ) : (
                              item.quantity
                            )}
                          </span>
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() =>
                              handleQuantity(item, Number(item.quantity) + 1)
                            }
                            className="flex size-8 items-center justify-center disabled:opacity-40"
                          >
                            <Plus className="size-4" />
                          </button>
                        </div>

                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => handleRemove(item)}
                          className="flex size-8 items-center justify-center rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600"
                          aria-label="Xóa sản phẩm"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-gray-500">Tạm tính</span>
              <span className="text-lg font-bold">{formatPrice(subtotal)}</span>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-primary font-semibold text-white hover:bg-secondary"
            >
              Thanh toán
            </button>

            <Link
              to="/cart"
              onClick={handleClose}
              className="mt-3 flex h-11 w-full items-center justify-center rounded-xl border font-semibold text-gray-900 hover:bg-gray-50"
            >
              Xem giỏ hàng
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
};

export default MiniCartDrawer;
