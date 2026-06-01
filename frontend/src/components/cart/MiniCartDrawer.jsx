import { Loader2, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
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
} from "../../redux/slices/cartSlice";

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

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + getItemPrice(item) * Number(item.quantity || 0), 0);
  }, [items]);

  const totalQty = useMemo(() => {
    return items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  }, [items]);

  const fetchCart = async () => {
    if (!user || !isDrawerOpen) return;
    try {
      setLoading(true);
      const res = await CartService.getCart();
      dispatch(setCart(res || { items: [] }));
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
      if (nextQuantity > item.quantity) dispatch(increaseQuantity(item.localId));
      else dispatch(decreaseQuantity(item.localId));
      return;
    }
    try {
      setUpdatingId(item._id);
      const res = await CartService.updateQuantity(item._id, nextQuantity);
      dispatch(setCart(res || { items: [] }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Cập nhật giỏ hàng thất bại");
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
      dispatch(setCart(res || { items: [] }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Xóa sản phẩm thất bại");
    } finally {
      setUpdatingId("");
    }
  };

  const handleCheckout = () => {
    handleClose();
    navigate("/checkout");
  };

  useEffect(() => {
    fetchCart();
  }, [isDrawerOpen, user?._id, user?.id]);

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-[80]">
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
        aria-label="Đóng giỏ hàng"
      />

      {/* Drawer panel */}
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-[420px] flex-col bg-white shadow-2xl animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-950 flex items-center justify-center">
              <ShoppingBag className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-zinc-950">Giỏ hàng</h2>
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{totalQty} sản phẩm</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
            aria-label="Đóng"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-zinc-950 mr-2" />
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Đang tải...</span>
            </div>
          ) : items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center py-16">
              <div className="w-20 h-20 bg-zinc-50 flex items-center justify-center mb-5">
                <ShoppingBag className="h-9 w-9 text-zinc-300" />
              </div>
              <p className="text-sm font-black uppercase tracking-widest text-zinc-950">Giỏ hàng trống</p>
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mt-2 mb-8">
                Thêm sản phẩm vào giỏ nhé
              </p>
              <Link
                to="/shop"
                onClick={handleClose}
                className="px-8 h-12 flex items-center justify-center bg-zinc-950 text-white text-xs font-black uppercase tracking-[0.1em] hover:bg-teal-600 transition-colors"
              >
                Khám phá ngay
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => {
                const itemId = item._id || item.localId;
                const isUpdating = updatingId === itemId;
                const productLink = item.productSlug
                  ? `/product/${item.productSlug}`
                  : `/product/${item.productId}`;
                const itemPrice = getItemPrice(item);

                return (
                  <div
                    key={itemId}
                    className={`flex gap-4 border-b border-zinc-200 pb-4 last:border-0 ${isUpdating ? "opacity-60" : ""}`}
                  >
                    {/* Image */}
                    <Link
                      to={productLink}
                      onClick={handleClose}
                      className="flex-shrink-0 w-[72px] h-[72px] rounded-xl bg-slate-50 overflow-hidden"
                    >
                      {item.image || item.thumbnail ? (
                        <img
                          src={item.image || item.thumbnail}
                          alt={item.productName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <ShoppingBag className="h-6 w-6 text-slate-300" />
                        </div>
                      )}
                    </Link>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <Link
                        to={productLink}
                        onClick={handleClose}
                        className="block text-xs font-black uppercase tracking-widest text-zinc-950 hover:text-teal-600 transition-colors line-clamp-1"
                      >
                        {item.productName || item.product?.name}
                      </Link>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mt-1">
                        {item.color} · Size {item.size}
                      </p>
                      <p className="text-sm font-black text-teal-600 mt-1">
                        {formatPrice(itemPrice)}
                      </p>

                      {/* Qty controls */}
                      <div className="flex items-center justify-between mt-2.5">
                        <div className="inline-flex items-center border border-zinc-200 bg-white h-8">
                          <button
                            type="button"
                            disabled={isUpdating || item.quantity <= 1}
                            onClick={() => handleQuantity(item, Number(item.quantity) - 1)}
                            className="w-8 h-8 flex items-center justify-center text-zinc-500 disabled:opacity-30 hover:bg-zinc-100 hover:text-zinc-950 transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-zinc-950">
                            {isUpdating ? (
                              <Loader2 className="h-3 w-3 animate-spin mx-auto" />
                            ) : (
                              item.quantity
                            )}
                          </span>
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => handleQuantity(item, Number(item.quantity) + 1)}
                            className="w-8 h-8 flex items-center justify-center text-zinc-500 disabled:opacity-30 hover:bg-zinc-100 hover:text-zinc-950 transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => handleRemove(item)}
                          className="w-8 h-8 flex items-center justify-center border border-zinc-200 text-zinc-400 hover:border-red-500 hover:bg-red-500 hover:text-white transition-colors"
                          aria-label="Xóa sản phẩm"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer CTA */}
        {items.length > 0 && (
          <div className="border-t border-slate-100 p-5 space-y-3">
            {/* Subtotal */}
            <div className="flex items-center justify-between py-1">
              <span className="text-[11px] font-black uppercase tracking-widest text-zinc-500">Tạm tính</span>
              <span className="text-xl font-black text-zinc-950">{formatPrice(subtotal)}</span>
            </div>

            <div className="flex items-center gap-2 px-4 py-3 bg-teal-50 border border-teal-100 text-teal-700">
              <span className="text-[10px] font-bold uppercase tracking-wider">🚚 Miễn phí vận chuyển cho đơn hàng này!</span>
            </div>

            <button
              type="button"
              id="mini-cart-checkout-btn"
              onClick={handleCheckout}
              className="w-full h-14 bg-teal-600 text-white font-black uppercase tracking-[0.15em] text-xs hover:bg-teal-700 transition-colors"
            >
              Thanh toán
            </button>

            <Link
              to="/cart"
              onClick={handleClose}
              className="flex items-center justify-center w-full h-12 border border-zinc-200 text-zinc-950 font-black uppercase tracking-[0.1em] text-xs hover:border-zinc-950 hover:bg-zinc-50 transition-colors"
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
