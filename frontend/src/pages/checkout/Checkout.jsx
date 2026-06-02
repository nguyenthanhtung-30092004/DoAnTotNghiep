import {
  Check,
  ChevronRight,
  Loader2,
  ShoppingCart,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

import CartService from "../../services/cart.service";

import { setCart as setCartRedux } from "../../redux/slices/cartSlice";
import orderService from "../../services/order.service";
import couponService from "../../services/coupon.service";
import addressService from "../../services/address.service";
import CheckoutAddress from "../../components/checkout/CheckoutAddress";
import CheckoutSummary from "../../components/checkout/CheckoutSummary";
import CheckoutPayment from "../../components/checkout/CheckoutPayment";
import CheckoutReview from "../../components/checkout/CheckoutReview";
import { PAYMENT_METHOD_LABELS, PAYMENT_METHODS } from "../../constants/payment.constants";

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



const Checkout = () => {
  const [status, setStatus] = useState(1);
  const [loading, setLoading] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [cart, setCart] = useState({
    items: [],
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.COD);
  const [addressErrors, setAddressErrors] = useState({});
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [addressLoading, setAddressLoading] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    email: "",
    province: "",
    district: "",
    ward: "",
    detailAddress: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const cartRedux = useSelector((state) => state.cart);

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
  const couponDiscount = Number(appliedCoupon?.couponDiscount || 0);
  const shippingFee = subtotal > 0 ? 0 : 0;
  const finalPrice = Math.max(subtotal - couponDiscount + shippingFee, 0);

  const fetchCart = async () => {
    if (!user) {
      setCart({ items: cartRedux.items });
      setLoading(false);
      return;
    }
    try {
      setLoading(true);

      const res = await CartService.getCart();
      const data = res;

      setCart(data || { items: [] });
      dispatch(setCartRedux(data || { items: [] }));
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Lấy giỏ hàng thất bại");
    } finally {
      setLoading(false);
    }
  };

  const getProductLink = (item) => {
    if (item.productSlug) return `/product/${item.productSlug}`;
    return `/product/${item.product?._id || item.product}`;
  };

  const handleChangeShipping = (e) => {
    const { name, value } = e.target;

    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));

    setAddressErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateShippingAddress = () => {
    const errors = {};

    if (!shippingAddress.fullName.trim()) {
      errors.fullName = "Vui lòng nhập họ và tên";
    }

    if (!shippingAddress.email?.trim()) {
      errors.email = "Vui lòng nhập email để nhận thông báo";
    } else if (!/\S+@\S+\.\S+/.test(shippingAddress.email)) {
      errors.email = "Email không hợp lệ";
    }

    if (!shippingAddress.phone.trim()) {
      errors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^(0|\+84)\d{9,10}$/.test(shippingAddress.phone.trim())) {
      errors.phone = "Số điện thoại không hợp lệ";
    }

    if (!shippingAddress.province.trim()) {
      errors.province = "Vui lòng chọn tỉnh/thành phố";
    }

    if (!shippingAddress.district.trim()) {
      errors.district = "Vui lòng chọn quận/huyện";
    }

    if (!shippingAddress.ward.trim()) {
      errors.ward = "Vui lòng chọn phường/xã";
    }

    if (!shippingAddress.detailAddress.trim()) {
      errors.detailAddress = "Vui lòng nhập địa chỉ cụ thể";
    }

    setAddressErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.warning("Vui lòng kiểm tra thông tin giao hàng");
      return false;
    }

    return true;
  };

  const handleApplyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();

    if (!code) {
      toast.warning("Vui lòng nhập mã giảm giá");
      return;
    }

    try {
      setApplyingCoupon(true);
      const res = await couponService.validateCoupon({ code, items });
      const data = res;

      setAppliedCoupon(data);
      setCouponCode(data.code || code);
      localStorage.setItem("appliedCoupon", JSON.stringify(data));
      toast.success("Áp mã giảm giá thành công");
    } catch (error) {
      setAppliedCoupon(null);
      localStorage.removeItem("appliedCoupon");
      toast.error(error.response?.data?.message || "Mã giảm giá không hợp lệ");
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    localStorage.removeItem("appliedCoupon");
  };

  const selectProvince = async (e) => {
    const code = e.target.value;
    const province = provinces.find((item) => String(item.code) === code);

    setShippingAddress((prev) => ({
      ...prev,
      province: province?.name || "",
      district: "",
      ward: "",
    }));
    setDistricts([]);
    setWards([]);
    setAddressErrors((prev) => ({
      ...prev,
      province: "",
      district: "",
      ward: "",
    }));

    if (!code) return;

    try {
      setAddressLoading(true);
      const res = await addressService.getDistricts(code);
      setDistricts(res.data?.districts || []);
    } catch (error) {
      console.log(error);
      toast.error("Không tải được danh sách quận/huyện");
    } finally {
      setAddressLoading(false);
    }
  };

  const selectDistrict = async (e) => {
    const code = e.target.value;
    const district = districts.find((item) => String(item.code) === code);

    setShippingAddress((prev) => ({
      ...prev,
      district: district?.name || "",
      ward: "",
    }));
    setWards([]);
    setAddressErrors((prev) => ({ ...prev, district: "", ward: "" }));

    if (!code) return;

    try {
      setAddressLoading(true);
      const res = await addressService.getWards(code);
      setWards(res.data?.wards || []);
    } catch (error) {
      console.log(error);
      toast.error("Không tải được danh sách phường/xã");
    } finally {
      setAddressLoading(false);
    }
  };

  const selectWard = (e) => {
    const code = e.target.value;
    const ward = wards.find((item) => String(item.code) === code);

    setShippingAddress((prev) => ({
      ...prev,
      ward: ward?.name || "",
    }));
    setAddressErrors((prev) => ({ ...prev, ward: "" }));
  };

  const handleNextToPayment = () => {
    if (!validateShippingAddress()) return;
    setStatus(2);
  };

  const handleNextToReview = () => {
    if (!paymentMethod) {
      toast.warning("Vui lòng chọn phương thức thanh toán");
      return;
    }

    setStatus(3);
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      toast.warning("Giỏ hàng đang trống");
      navigate("/cart");
      return;
    }

    if (!validateShippingAddress()) {
      setStatus(1);
      return;
    }

    try {
      setPlacingOrder(true);

      const payload = {
        shippingAddress,
        paymentMethod,
        couponCode: appliedCoupon?.code || "",
        note: "",
        items: !user ? cartRedux.items : undefined,
      };

      const res = await orderService.checkout(payload);
      const data = res;

      if (data?.paymentUrl) {
        window.location.href = data.paymentUrl;
        return;
      }

      toast.success(data?.message || "Đặt hàng thành công");

      localStorage.removeItem("appliedCoupon");
      setAppliedCoupon(null);

      if (!user) {
        dispatch({ type: "cart/clearCartRedux" });
        localStorage.removeItem("guest_cart");
      } else {
        await fetchCart();
      }

      const order = data?.order || data;

      if (user) {
        navigate("/account", {
          state: {
            order,
            orderSuccess: true,
          },
        });
      } else {
        navigate(`/payment-result?status=success&method=${paymentMethod}&orderId=${order._id || order.orderCode || ""}`);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Đặt hàng thất bại");
    } finally {
      setPlacingOrder(false);
    }
  };

  useEffect(() => {
    fetchCart();

    const savedCoupon = localStorage.getItem("appliedCoupon");

    if (savedCoupon) {
      try {
        const parsedCoupon = JSON.parse(savedCoupon);
        setAppliedCoupon(parsedCoupon);
        setCouponCode(parsedCoupon.code || "");
      } catch (error) {
        console.log(error);
        localStorage.removeItem("appliedCoupon");
      }
    }
  }, []);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await addressService.getProvinces();
        setProvinces(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.log(error);
        toast.error("Không tải được danh sách tỉnh/thành phố");
      }
    };

    fetchProvinces();
  }, []);

  useEffect(() => {
    if (!user) {
      setCart({ items: cartRedux.items });
    }
  }, [cartRedux.items, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-soft">
        <div className="flex flex-col items-center text-muted-foreground">
          <Loader2 className="mb-3 size-9 animate-spin" />
          <p>Đang tải thông tin thanh toán...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background-soft">
        <div className="container flex min-h-screen flex-col items-center justify-center text-center">
          <div className="mb-4 flex size-20 items-center justify-center rounded-full bg-accent">
            <ShoppingCart className="size-9 text-primary" />
          </div>

          <h1 className="text-2xl font-bold">Không có sản phẩm để thanh toán</h1>

          <p className="mt-2 text-muted-foreground">Vui lòng thêm sản phẩm vào giỏ hàng trước.</p>

          <Link
            to="/cart"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 font-semibold text-white hover:bg-primary/90"
          >
            Quay lại giỏ hàng
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl py-8">
      <div className="flex items-center justify-between">
        <nav className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
          <Link to="/cart" className="transition-colors hover:text-foreground">
            Cart
          </Link>

          <ChevronRight className="size-4" />
          <span className="font-medium text-foreground">Checkout</span>
        </nav>

        <Link
          to="/cart"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Quay lại giỏ hàng
        </Link>
      </div>

      <div className="flex items-center justify-center gap-0">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center bg-zinc-950 text-[10px] font-black text-white transition-all duration-300">
              {status > 1 ? <Check className="size-4" /> : 1}
            </div>

            <span className="hidden text-[10px] font-black uppercase tracking-widest text-zinc-950 sm:block">Giao hàng</span>
          </div>

          <div
            className={`mx-3 h-px w-12 transition-colors duration-300 sm:w-20 ${
              status > 1 ? "bg-zinc-950" : "bg-zinc-200"
            }`}
          />
        </div>

        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <div
              className={`flex size-8 items-center justify-center text-[10px] font-black transition-all duration-300 ${
                status >= 2
                  ? "bg-zinc-950 text-white"
                  : "bg-zinc-100 text-zinc-400"
              }`}
            >
              {status > 2 ? <Check className="size-4" /> : 2}
            </div>

            <span
              className={`hidden text-[10px] font-black uppercase tracking-widest sm:block ${
                status >= 2 ? "text-zinc-950" : "text-zinc-400"
              }`}
            >
              Thanh toán
            </span>
          </div>

          <div
            className={`mx-3 h-px w-12 transition-colors duration-300 sm:w-20 ${
              status > 2 ? "bg-zinc-950" : "bg-zinc-200"
            }`}
          />
        </div>

        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <div
              className={`flex size-8 items-center justify-center text-[10px] font-black transition-all duration-300 ${
                status >= 3
                  ? "bg-zinc-950 text-white"
                  : "bg-zinc-100 text-zinc-400"
              }`}
            >
              3
            </div>

            <span
              className={`hidden text-[10px] font-black uppercase tracking-widest sm:block ${
                status >= 3 ? "text-zinc-950" : "text-zinc-400"
              }`}
            >
              Xác nhận
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:gap-12">
        <div className="min-w-0 flex-1">
          {status === 1 ? (
            <CheckoutAddress
              shippingAddress={shippingAddress}
              addressErrors={addressErrors}
              handleChangeShipping={handleChangeShipping}
              provinces={provinces}
              districts={districts}
              wards={wards}
              selectProvince={selectProvince}
              selectDistrict={selectDistrict}
              selectWard={selectWard}
              addressLoading={addressLoading}
              handleNextToPayment={handleNextToPayment}
            />
          ) : status === 2 ? (
            <CheckoutPayment
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              setStatus={setStatus}
              handleNextToReview={handleNextToReview}
            />
          ) : status === 3 ? (
            <CheckoutReview
              shippingAddress={shippingAddress}
              paymentMethod={paymentMethod}
              totalQuantity={totalQuantity}
              items={items}
              getItemPrice={getItemPrice}
              getProductLink={getProductLink}
              formatPrice={formatPrice}
              setStatus={setStatus}
              handlePlaceOrder={handlePlaceOrder}
              placingOrder={placingOrder}
            />
          ) : null}
        </div>

        <CheckoutSummary
          items={items}
          getProductLink={getProductLink}
          formatPrice={formatPrice}
          getItemPrice={getItemPrice}
          totalQuantity={totalQuantity}
          subtotal={subtotal}
          productDiscount={productDiscount}
          appliedCoupon={appliedCoupon}
          couponDiscount={couponDiscount}
          handleRemoveCoupon={handleRemoveCoupon}
          couponCode={couponCode}
          setCouponCode={setCouponCode}
          handleApplyCoupon={handleApplyCoupon}
          applyingCoupon={applyingCoupon}
          shippingFee={shippingFee}
          finalPrice={finalPrice}
        />
      </div>
    </div>
  );
};

export default Checkout;
