import {
  Banknote,
  Check,
  ChevronRight,
  CreditCard,
  Dot,
  Loader2,
  LockKeyhole,
  RotateCcw,
  Shield,
  ShoppingCart,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

import CartService from "../../../features/cart/services/cart.service";

import { setCart as setCartRedux } from "../../../features/cart/slice/cartSlice";
import orderService from "../../../features/checkout/services/order.service";
import couponService from "../../../features/checkout/services/coupon.service";
import addressService from "../../../features/account/services/address.service";
import CheckoutAddress from "../components/CheckoutAddress";
import CheckoutSummary from "../components/CheckoutSummary";

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

const paymentMethods = [
  {
    value: "COD",
    title: "Thanh toán khi nhận hàng",
    description: "Thanh toán bằng tiền mặt khi đơn hàng được giao tới bạn",
    icon: Banknote,
    disabled: false,
  },
  {
    value: "VNPAY",
    title: "Thanh toán VNPAY",
    description: "Thanh toán qua cổng VNPAY",
    icon: CreditCard,
    disabled: false,
  },
];
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
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [addressErrors, setAddressErrors] = useState({});
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [addressLoading, setAddressLoading] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    detailAddress: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      const res = await couponService.validateCoupon(code);
      const data = getResponseData(res);

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
    setAddressErrors((prev) => ({ ...prev, province: "", district: "", ward: "" }));

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
      };

      const res = await orderService.checkout(payload);
      const data = getResponseData(res);

      if (data?.paymentUrl) {
        window.location.href = data.paymentUrl;
        return;
      }

      toast.success(data?.message || "Đặt hàng thành công");

      localStorage.removeItem("appliedCoupon");
      setAppliedCoupon(null);

      await fetchCart();

      const order = data?.order || data;

      navigate("/account", {
        state: {
          order,
          orderSuccess: true,
        },
      });
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

          <h1 className="text-2xl font-bold">
            Không có sản phẩm để thanh toán
          </h1>

          <p className="mt-2 text-muted-foreground">
            Vui lòng thêm sản phẩm vào giỏ hàng trước.
          </p>

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
            <div className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-soft transition-all duration-300">
              {status > 1 ? <Check className="size-4" /> : 1}
            </div>

            <span className="hidden text-sm font-medium text-foreground sm:block">
              Giao hàng
            </span>
          </div>

          <div
            className={`mx-3 h-0.5 w-12 rounded-full transition-colors duration-300 sm:w-20 ${status > 1 ? "bg-primary" : "bg-border"
              }`}
          />
        </div>

        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <div
              className={`flex size-8 items-center justify-center rounded-full text-xs font-bold shadow-soft transition-all duration-300 ${status >= 2
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
                }`}
            >
              {status > 2 ? <Check className="size-4" /> : 2}
            </div>

            <span
              className={`hidden text-sm font-medium sm:block ${status >= 2 ? "text-foreground" : "text-muted-foreground"
                }`}
            >
              Thanh toán
            </span>
          </div>

          <div
            className={`mx-3 h-0.5 w-12 rounded-full transition-colors duration-300 sm:w-20 ${status > 2 ? "bg-primary" : "bg-border"
              }`}
          />
        </div>

        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <div
              className={`flex size-8 items-center justify-center rounded-full text-xs font-bold shadow-soft transition-all duration-300 ${status >= 3
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
                }`}
            >
              3
            </div>

            <span
              className={`hidden text-sm font-medium sm:block ${status >= 3 ? "text-foreground" : "text-muted-foreground"
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
            <div className="space-y-6">
              <div className="space-y-4 rounded-2xl bg-card p-6 shadow-card">
                <h2 className="text-lg font-bold">Phương thức thanh toán</h2>

                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  const isSelected = paymentMethod === method.value;

                  return (
                    <button
                      key={method.value}
                      type="button"
                      disabled={method.disabled}
                      onClick={() => {
                        if (method.disabled) {
                          toast.info("Phương thức này sẽ được hỗ trợ sau");
                          return;
                        }

                        setPaymentMethod(method.value);
                      }}
                      className={`w-full active:scale-[0.99] flex items-center gap-4 rounded-xl border-2 p-4 text-left shadow-soft duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${isSelected
                        ? "border-primary bg-accent"
                        : "border-border bg-background hover:border-primary/60"
                        }`}
                    >
                      <div
                        className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-accent text-foreground"
                          }`}
                      >
                        <Icon className="size-5" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold">
                            {method.title}
                          </p>

                          {method.disabled && (
                            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                              Sắp có
                            </span>
                          )}
                        </div>

                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {method.description}
                        </p>
                      </div>

                      <div
                        className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${isSelected ? "border-primary" : "border-border"
                          }`}
                      >
                        {isSelected && (
                          <div className="size-2.5 rounded-full bg-primary" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStatus(1)}
                  type="button"
                  className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-input bg-background px-8 text-sm font-semibold transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
                >
                  Quay lại
                </button>

                <button
                  onClick={handleNextToReview}
                  type="button"
                  className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-input bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg transition-all duration-200 hover:bg-secondary hover:shadow-xl"
                >
                  Xem lại đơn hàng
                </button>
              </div>
            </div>
          ) : status === 3 ? (
            <div className="space-y-6">
              <div className="rounded-2xl bg-card p-6 shadow-card">
                <h2 className="mb-4 text-lg font-bold">Xem lại đơn hàng</h2>

                <div className="mb-4 flex items-start justify-between border-b border-border pb-4">
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Giao tới
                    </p>
                    <p className="text-sm font-medium">
                      {shippingAddress.fullName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {shippingAddress.phone}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {shippingAddress.detailAddress}, {shippingAddress.ward},{" "}
                      {shippingAddress.district}, {shippingAddress.province}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStatus(1)}
                    className="text-xs text-primary underline-offset-4 hover:underline"
                  >
                    Chỉnh sửa
                  </button>
                </div>

                <div className="mb-4 flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Thanh toán
                    </p>
                    <p className="text-sm font-medium">
                      {paymentMethod === "COD" && "Thanh toán khi nhận hàng"}
                      {paymentMethod === "VNPAY" && "Thanh toán VNPAY"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStatus(2)}
                    className="text-xs text-primary underline-offset-4 hover:underline"
                  >
                    Sửa
                  </button>
                </div>

                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Sản phẩm ({totalQuantity})
                </p>

                <div className="space-y-3">
                  {items.map((item) => {
                    const itemPrice = getItemPrice(item);
                    const itemTotal = itemPrice * Number(item.quantity || 0);

                    return (
                      <div key={item._id} className="flex items-center gap-3">
                        <Link
                          to={getProductLink(item)}
                          className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-accent"
                        >
                          {item.thumbnail ? (
                            <img
                              src={item.thumbnail}
                              alt={item.productName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ShoppingCart className="size-5 text-muted-foreground" />
                          )}
                        </Link>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {item.productName || item.product?.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Size {item.size} | SL {item.quantity}
                          </p>
                        </div>

                        <p className="shrink-0 text-sm font-semibold tabular-nums">
                          {formatPrice(itemTotal)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={placingOrder}
                className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary px-10 text-base font-semibold text-primary-foreground shadow-lg transition-all duration-200 hover:bg-secondary hover:shadow-xl disabled:opacity-60"
              >
                {placingOrder ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <LockKeyhole className="size-5" />
                )}
                {paymentMethod === "COD"
                  ? "Đặt hàng COD"
                  : "Thanh toán VNPAY"}
              </button>
            </div>
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
