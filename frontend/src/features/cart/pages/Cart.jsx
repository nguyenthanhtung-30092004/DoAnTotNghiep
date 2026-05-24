import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  Loader2,
  LockKeyhole,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  Truck,
} from "lucide-react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setCart as setCartRedux } from "../../../features/cart/slice/cartSlice";

import CartService from "../../../features/cart/services/cart.service";

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

  if (salePrice > 0 && salePrice < price) {
    return salePrice;
  }

  return price;
};

const Cart = () => {
  const [cart, setCart] = useState({
    items: [],
  });
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [updatingItemId, setUpdatingItemId] = useState("");

  const items = Array.isArray(cart?.items) ? cart.items : [];

  const totalQuantity = useMemo(() => {
    return items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      return sum + getItemPrice(item) * Number(item.quantity || 0);
    }, 0);
  }, [items]);

  const totalOriginalPrice = useMemo(() => {
    return items.reduce((sum, item) => {
      return sum + Number(item.price || 0) * Number(item.quantity || 0);
    }, 0);
  }, [items]);

  const productDiscount = Math.max(totalOriginalPrice - subtotal, 0);
  const shippingFee = subtotal > 0 ? 0 : 0;
  const finalPrice = Math.max(subtotal + shippingFee, 0);

  const fetchCart = async () => {
    try {
      setLoading(true);

      const res = await CartService.getCart();
      const data = getResponseData(res);

      setCart(data || { items: [] });
      dispatch(setCartRedux(data || { items: [] }));
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Lấy giỏ hàng thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (item, newQuantity) => {
    if (newQuantity < 1) return;

    if (item.maxQuantity && newQuantity > item.maxQuantity) {
      toast.warning(`Chỉ còn ${item.maxQuantity} sản phẩm`);
      return;
    }

    try {
      setUpdatingItemId(item._id);

      const res = await CartService.updateQuantity(item._id, newQuantity);
      const data = getResponseData(res);

      setCart(data || { items: [] });
      dispatch(setCartRedux(data || { items: [] }));

      localStorage.removeItem("appliedCoupon");
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Cập nhật số lượng thất bại",
      );
    } finally {
      setUpdatingItemId("");
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      setUpdatingItemId(itemId);

      const res = await CartService.removeFromCart(itemId);
      const data = getResponseData(res);

      setCart(data || { items: [] });
      dispatch(setCartRedux(data || { items: [] }));

      localStorage.removeItem("appliedCoupon");

      toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Xóa sản phẩm thất bại");
    } finally {
      setUpdatingItemId("");
    }
  };

  const handleSyncCart = async () => {
    try {
      const res = await CartService.syncCart();
      const data = getResponseData(res);

      if (data) {
        setCart(data);
        dispatch(setCartRedux(data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCart();
    handleSyncCart();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center text-gray-500">
          <Loader2 className="h-9 w-9 animate-spin mb-3" />
          <p>Đang tải giỏ hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="px-8 py-10 bg-accent">
        <div className="container">
          <h1 className="text-3xl font-bold">Giỏ hàng</h1>
          <p>{totalQuantity} sản phẩm trong giỏ</p>
        </div>
      </div>

      <div className="container py-8">
        {items.length === 0 ? (
          <div className="min-h-[45vh] flex flex-col items-center justify-center text-center">
            <div className="size-20 rounded-full bg-accent flex items-center justify-center mb-4">
              <ShoppingCart className="size-9 text-primary" />
            </div>

            <h2 className="text-2xl font-bold">Giỏ hàng đang trống</h2>

            <p className="text-muted-foreground mt-2">
              Hãy thêm sản phẩm yêu thích vào giỏ hàng nhé.
            </p>

            <Link
              to="/shop"
              className="inline-flex items-center justify-center font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors mt-6 px-8 h-12 gap-2"
            >
              <ShoppingCart className="size-5" />
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <div className="flex-1 min-w-0">
              <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto] gap-4 pb-3 border-b border-border mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                <span>Sản phẩm</span>
                <span className="w-28 text-center">Số lượng</span>
                <span className="w-28 text-right">Giá</span>
                <span className="w-10"></span>
              </div>

              <div className="divide-y divide-border">
                {items.map((item) => {
                  const itemPrice = getItemPrice(item);
                  const itemTotal = itemPrice * Number(item.quantity || 0);
                  const isUpdating = updatingItemId === item._id;
                  const productLink = item.productSlug
                    ? `/product/${item.productSlug}`
                    : `/product/${item.product?._id || item.product}`;

                  return (
                    <div
                      key={item._id}
                      className={`grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto] gap-4 py-5 items-center ${
                        !item.isAvailable ? "opacity-60" : ""
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <Link
                          to={productLink}
                          className="shrink-0 w-[128px] h-[80px] rounded-xl bg-accent flex items-center justify-center overflow-hidden hover:shadow-card-hover transition-shadow"
                        >
                          {item.thumbnail ? (
                            <img
                              src={item.thumbnail}
                              alt={item.productName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ShoppingCart className="size-8 text-muted-foreground" />
                          )}
                        </Link>

                        <div className="min-w-0">
                          <p className="text-[12px] font-medium uppercase tracking-wide text-muted-foreground">
                            {item.color || "Sản phẩm"}
                          </p>

                          <Link
                            className="font-semibold text-sm hover:text-primary transition-colors line-clamp-1"
                            to={productLink}
                          >
                            {item.productName || item.product?.name}
                          </Link>

                          <p className="text-xs text-muted-foreground mt-0.5">
                            Size: {item.size}
                          </p>

                          {!item.isAvailable && (
                            <p className="text-xs text-red-500 font-medium mt-1">
                              Sản phẩm hiện không khả dụng
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center sm:justify-center">
                        <div className="inline-flex items-center justify-center border border-border rounded-xl">
                          <button
                            type="button"
                            disabled={isUpdating || item.quantity <= 1}
                            onClick={() =>
                              handleUpdateQuantity(item, item.quantity - 1)
                            }
                            className="size-7 flex items-center justify-center hover:bg-muted rounded-l-xl transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="size-4" />
                          </button>

                          <span className="w-10 text-center text-sm font-semibold tabular-nums">
                            {isUpdating ? (
                              <Loader2 className="size-4 animate-spin mx-auto" />
                            ) : (
                              item.quantity
                            )}
                          </span>

                          <button
                            type="button"
                            disabled={
                              isUpdating ||
                              (item.maxQuantity &&
                                item.quantity >= item.maxQuantity)
                            }
                            onClick={() =>
                              handleUpdateQuantity(item, item.quantity + 1)
                            }
                            className="size-7 flex items-center justify-center hover:bg-muted rounded-r-xl transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="size-4" />
                          </button>
                        </div>
                      </div>

                      <div className="w-28 sm:text-right">
                        <p className="font-bold text-red-500 text-sm tabular-nums">
                          {formatPrice(itemTotal)}
                        </p>

                        {Number(item.salePrice || 0) > 0 &&
                          Number(item.salePrice) < Number(item.price) && (
                            <p className="text-xs text-muted-foreground line-through">
                              {formatPrice(
                                Number(item.price || 0) *
                                  Number(item.quantity || 0),
                              )}
                            </p>
                          )}
                      </div>

                      <div>
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => handleRemoveItem(item._id)}
                          className="size-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="size-5 hover:text-red-600" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center whitespace-nowrap font-semibold text-black hover:text-slate-500 py-2 rounded-lg transition-colors h-14 gap-2"
                >
                  <ChevronLeft className="" />
                  Tiếp tục mua sắm
                </Link>
              </div>
            </div>

            <div className="lg:w-96 shrink-0">
              <div className="bg-card rounded-2xl shadow-card p-6 lg:sticky lg:top-24">
                <h2 className="text-lg font-bold mb-5">Tóm tắt đơn hàng</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Tạm tính ({totalQuantity} sản phẩm)
                    </span>
                    <span className="font-medium tabular-nums">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  {productDiscount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Giảm giá sản phẩm
                      </span>
                      <span className="font-medium text-red-500 tabular-nums">
                        -{formatPrice(productDiscount)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Phí vận chuyển
                    </span>
                    <span className="font-medium text-primary">
                      {shippingFee === 0
                        ? "Miễn phí"
                        : formatPrice(shippingFee)}
                    </span>
                  </div>

                  <div className="border-t border-border pt-3 mt-3">
                    <div className="flex justify-between font-bold">
                      <span>Tổng cộng</span>
                      <span className="tabular-nums">
                        {formatPrice(finalPrice)}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="inline-flex items-center justify-center whitespace-nowrap font-semibold text-white bg-primary hover:bg-primary/90 py-2 rounded-lg transition-colors w-full mt-5 px-10 h-14 gap-2"
                >
                  <LockKeyhole className="size-5" />
                  Thanh toán
                </Link>

                <div className="flex items-center gap-2 mt-4 p-3 rounded-xl bg-accent text-xs">
                  <Truck className="size-4 text-primary shrink-0" />
                  <span className="text-primary font-medium">
                    Bạn đã được miễn phí vận chuyển 🎉
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
