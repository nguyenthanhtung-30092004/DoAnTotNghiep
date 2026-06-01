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
import { useDispatch, useSelector } from "react-redux";
import { setCart as setCartRedux } from "../../redux/slices/cartSlice";

import CartService from "../../services/cart.service";
import useSelection from "antd/es/table/hooks/useSelection";

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

  // lấy user và cart từ local
  const { user } = useSelector((state) => state.auth);
  const cartRedux = useSelector((state) => state.cart);

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
    if (!user) {
      // nếu user là guest
      setCart({ items: cartRedux.items });
      return;
    }

    // nếu đã đăng nhập: gọi API như cũ
    try {
      setLoading(true);

      const res = await CartService.getCart();
      const data = res;
      console.log(data, "datadatad");

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

    if (!user) {
      if (newQuantity > item.quantity) {
        dispatch({ type: "cart/increaseQuantity", payload: item.localId });
      } else {
        dispatch({ type: "cart/decreaseQuantity", payload: item.localId });
      }
      return;
    }

    try {
      setUpdatingItemId(item._id);

      const res = await CartService.updateQuantity(item._id, newQuantity);
      const data = res;

      setCart(data || { items: [] });
      dispatch(setCartRedux(data || { items: [] }));

      localStorage.removeItem("appliedCoupon");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Cập nhật số lượng thất bại");
    } finally {
      setUpdatingItemId("");
    }
  };

  const handleRemoveItem = async (item) => {
    if (!user) {
      dispatch({ type: "cart/removeCartItem", payload: item.localId });
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
      return;
    }
    try {
      setUpdatingItemId(item._id);

      const res = await CartService.removeFromCart(item._id);
      const data = res;

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
    if (!user) return;
    try {
      const res = await CartService.syncCart();
      const data = res;

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

  // Thay đổi khi tăng giảm số lượng cho guest
  useEffect(() => {
    if (!user) {
      setCart({ items: cartRedux.items });
    }
  }, [cartRedux.items, user]);

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
      <div className="px-8 py-10 bg-white text-white">
        <div className="container">
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Giỏ hàng</h1>
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">
            {totalQuantity} sản phẩm
          </p>
        </div>
      </div>

      <div className="container py-8">
        {items.length === 0 ? (
          <div className="min-h-[45vh] flex flex-col items-center justify-center text-center">
            <div className="size-20 bg-zinc-50 flex items-center justify-center mb-5">
              <ShoppingCart className="size-9 text-zinc-300" />
            </div>

            <h2 className="text-sm font-black uppercase tracking-widest text-zinc-950">
              Giỏ hàng trống
            </h2>

            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mt-2 mb-8">
              Thêm sản phẩm vào giỏ nhé
            </p>

            <Link
              to="/shop"
              className="inline-flex items-center justify-center bg-zinc-950 text-white hover:bg-teal-600 transition-colors h-14 px-10 text-xs font-black uppercase tracking-[0.1em] gap-2"
            >
              <ShoppingCart className="size-5" />
              Khám phá ngay
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <div className="flex-1 min-w-0">
              <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto] gap-4 pb-4 border-b border-zinc-200 mb-2 text-[10px] font-black uppercase tracking-[0.15em] text-zinc-500">
                <span>Sản phẩm</span>
                <span className="w-28 text-center">Số lượng</span>
                <span className="w-28 text-right">Giá</span>
                <span className="w-10"></span>
              </div>

              <div className="divide-y divide-zinc-200">
                {items.map((item) => {
                  const itemPrice = getItemPrice(item);
                  const itemTotal = itemPrice * Number(item.quantity || 0);
                  const isUpdating = updatingItemId === (item._id || item.localId);
                  const productLink = item.productSlug
                    ? `/product/${item.productSlug}`
                    : `/product/${item.product?._id || item.product}`;

                  return (
                    <div
                      key={item._id || item.localId}
                      className={`grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto] gap-4 py-5 items-center ${
                        !item.isAvailable ? "opacity-60" : ""
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <Link
                          to={productLink}
                          className="shrink-0 w-[128px] h-[128px] bg-zinc-50 border border-zinc-200 flex items-center justify-center overflow-hidden"
                        >
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.productName}
                              className="h-full w-full object-cover mix-blend-multiply"
                            />
                          ) : (
                            <ShoppingCart className="size-8 text-zinc-300" />
                          )}
                        </Link>

                        <div className="min-w-0">
                          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-500 mb-1">
                            {item.color || "Sản phẩm"}
                          </p>

                          <Link
                            className="text-sm font-black uppercase tracking-widest text-zinc-950 hover:text-teal-600 transition-colors line-clamp-1"
                            to={productLink}
                          >
                            {item.productName || item.product?.name}
                          </Link>

                          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mt-2">
                            Size {item.size}
                          </p>

                          {!item.isAvailable && (
                            <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider mt-2">
                              Không khả dụng
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center sm:justify-center">
                        <div className="inline-flex items-center justify-center border border-zinc-200 bg-white h-10">
                          <button
                            type="button"
                            disabled={isUpdating || item.quantity <= 1}
                            onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                            className="size-10 flex items-center justify-center hover:bg-zinc-100 transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-500 hover:text-zinc-950"
                          >
                            <Minus className="size-3" />
                          </button>

                          <span className="w-10 text-center text-sm font-bold tabular-nums text-zinc-950">
                            {isUpdating ? (
                              <Loader2 className="size-4 animate-spin mx-auto" />
                            ) : (
                              item.quantity
                            )}
                          </span>

                          <button
                            type="button"
                            disabled={
                              isUpdating || (item.maxQuantity && item.quantity >= item.maxQuantity)
                            }
                            onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                            className="size-10 flex items-center justify-center hover:bg-zinc-100 transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-500 hover:text-zinc-950"
                          >
                            <Plus className="size-3" />
                          </button>
                        </div>
                      </div>

                      <div className="w-28 sm:text-right">
                        <p className="font-black text-teal-600 text-sm tabular-nums">
                          {formatPrice(itemTotal)}
                        </p>

                        {Number(item.salePrice || 0) > 0 &&
                          Number(item.salePrice) < Number(item.price) && (
                            <p className="text-[10px] font-bold text-zinc-400 line-through mt-1">
                              {formatPrice(Number(item.price || 0) * Number(item.quantity || 0))}
                            </p>
                          )}
                      </div>

                      <div>
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => handleRemoveItem(item)}
                          className="size-10 border border-zinc-200 flex items-center justify-center text-zinc-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center whitespace-nowrap text-[10px] font-black uppercase tracking-[0.15em] text-zinc-950 hover:text-teal-600 transition-colors h-14 gap-2 border-zinc-200"
                >
                  <ChevronLeft className="size-4" />
                  Tiếp tục mua sắm
                </Link>
              </div>
            </div>

            <div className="lg:w-96 shrink-0">
              <div className="border border-zinc-200 p-8 lg:sticky lg:top-24">
                <h2 className="text-sm font-black uppercase tracking-widest mb-6">
                  Tóm tắt đơn hàng
                </h2>

                <div className="space-y-4 text-sm font-bold">
                  <div className="flex justify-between items-center text-zinc-500">
                    <span className="text-[11px] uppercase tracking-wider">
                      Tạm tính ({totalQuantity} SP)
                    </span>
                    <span className="tabular-nums text-zinc-950">{formatPrice(subtotal)}</span>
                  </div>

                  {productDiscount > 0 && (
                    <div className="flex justify-between items-center text-zinc-500">
                      <span className="text-[11px] uppercase tracking-wider">Giảm giá</span>
                      <span className="text-red-500 tabular-nums">
                        -{formatPrice(productDiscount)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-zinc-500">
                    <span className="text-[11px] uppercase tracking-wider">Phí vận chuyển</span>
                    <span className="text-teal-600 tabular-nums">
                      {shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}
                    </span>
                  </div>

                  <div className="border-t border-zinc-200 pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] uppercase tracking-wider text-zinc-500">
                        Tổng cộng
                      </span>
                      <span className="text-xl font-black text-zinc-950 tabular-nums">
                        {formatPrice(finalPrice)}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="inline-flex items-center justify-center whitespace-nowrap text-xs font-black uppercase tracking-[0.1em] text-white bg-zinc-950 hover:bg-teal-600 transition-colors w-full mt-8 px-10 h-14 gap-2"
                >
                  <LockKeyhole className="size-4" />
                  Thanh toán
                </Link>

                <div className="flex items-center gap-3 mt-6 p-4 bg-teal-50 border border-teal-100 text-teal-700">
                  <Truck className="size-5 shrink-0" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    Miễn phí vận chuyển cho đơn hàng này
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
