import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Copy,
  House,
  Loader2,
  MessageCircle,
  RotateCcw,
  Truck,
  XCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import socket from "../../socket/socket";

import {
  ORDER_PROGRESS_STEPS,
  ORDER_STATUS,
  ORDER_STATUS_LABELS,
} from "../../constants/order.constants";
import {
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
} from "../../constants/payment.constants";
import orderService from "../../services/order.service";

const getResponseData = (res) => {
  return res.data?.metadata || res.data?.data || res.data;
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(price || 0));
};

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("vi-VN");
};

const steps = [
  {
    key: ORDER_PROGRESS_STEPS[0],
    label: ORDER_STATUS_LABELS[ORDER_PROGRESS_STEPS[0]],
    icon: Check,
  },
  {
    key: ORDER_PROGRESS_STEPS[1],
    label: ORDER_STATUS_LABELS[ORDER_PROGRESS_STEPS[1]],
    icon: Check,
  },
  {
    key: ORDER_PROGRESS_STEPS[2],
    label: ORDER_STATUS_LABELS[ORDER_PROGRESS_STEPS[2]],
    icon: Truck,
  },
  {
    key: ORDER_PROGRESS_STEPS[3],
    label: ORDER_STATUS_LABELS[ORDER_PROGRESS_STEPS[3]],
    icon: House,
  },
];

const getStepIndex = (orderStatus) => {
  if (orderStatus === ORDER_STATUS.PENDING) return 0;
  if ([ORDER_STATUS.CONFIRMED, ORDER_STATUS.PROCESSING].includes(orderStatus)) return 1;
  if (orderStatus === ORDER_STATUS.SHIPPING) return 2;
  if (orderStatus === ORDER_STATUS.DELIVERED) return 3;
  return 0;
};

const OrderDetail = () => {
  const { orderId } = useParams();
  const { user } = useSelector((state) => state.auth);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const currentStep = useMemo(() => {
    return getStepIndex(order?.orderStatus);
  }, [order]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);

      const res = await orderService.getMyOrderDetail(orderId);
      const data = getResponseData(res);

      setOrder(data?.order || data);
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Láº¥y chi tiáº¿t Ä‘Æ¡n hÃ ng tháº¥t báº¡i",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopyOrderCode = async () => {
    if (!order?.orderCode) return;

    await navigator.clipboard.writeText(order.orderCode);
    toast.success("Đã sao chép mã đơn hàng");
  };

  const handleCancelOrder = async () => {
    if (!order?._id) return;

    const confirmed = window.confirm("Bạn có chắc muốn hủy đơn hàng này không?");
    if (!confirmed) return;

    try {
      setIsCancelling(true);
      await orderService.cancelMyOrder(order._id, "Khách hàng tự hủy");
      toast.success("Hủy đơn hàng thành công");
      await fetchOrderDetail();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Hủy đơn hàng thất bại",
      );
    } finally {
      setIsCancelling(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId]);

  // Socket: lắng nghe cập nhật đơn hàng real-time, re-join khi reconnect
  useEffect(() => {
    if (!user?._id && !user?.id) return;

    const userId = user._id || user.id;

    const joinRoom = () => {
      socket.emit("join-user-room", userId);
    };

    if (!socket.connected) {
      socket.connect();
    } else {
      joinRoom();
    }

    socket.on("connect", joinRoom);

    const handleOrderUpdated = (payload) => {
      if (payload.orderId !== orderId) return;

      setOrder((prev) =>
        prev
          ? {
              ...prev,
              orderStatus: payload.orderStatus,
              paymentStatus: payload.paymentStatus,
              deliveredAt: payload.deliveredAt,
              cancelReason: payload.cancelReason,
              cancelledBy: payload.cancelledBy,
              cancelledAt: payload.cancelledAt,
              updatedAt: payload.updatedAt,
            }
          : prev,
      );

      toast.info("Đơn hàng của bạn vừa được cập nhật trạng thái");
    };

    socket.on("order:updated", handleOrderUpdated);

    return () => {
      socket.off("connect", joinRoom);
      socket.off("order:updated", handleOrderUpdated);
    };
  }, [user?._id, user?.id, orderId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-soft">
        <div className="flex flex-col items-center text-muted-foreground">
          <Loader2 className="mb-3 size-9 animate-spin" />
          <p>Đang tải chi tiết đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-12">
        <Link
          to="/account"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Quay lại tài khoản
        </Link>

        <div className="mt-8 rounded-2xl border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Không tìm thấy đơn hàng.
          </p>
        </div>
      </div>
    );
  }

  const shippingAddress = order.shippingAddress || {};
  const items = Array.isArray(order.items) ? order.items : [];
  const isCancelled = [ORDER_STATUS.CANCELLED, ORDER_STATUS.RETURNED].includes(order.orderStatus);
  const canCancel = [ORDER_STATUS.PENDING, ORDER_STATUS.CONFIRMED].includes(order.orderStatus);

  return (
    <div>
      <main className="flex-1">
        <div className="container max-w-4xl py-8 md:py-12">
          <Link
            to="/account"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Quay lại tài khoản
          </Link>

          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground">
                  Đơn hàng {order.orderCode}
                </h1>

                <button
                  type="button"
                  onClick={handleCopyOrderCode}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Copy className="size-4" />
                </button>
              </div>

              <p className="text-sm text-muted-foreground">
                Đặt ngày {formatDate(order.createdAt)}
              </p>
            </div>

            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {ORDER_STATUS_LABELS[order.orderStatus] || order.orderStatus}
            </span>
          </div>

          {!isCancelled && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-6 text-sm font-semibold text-foreground">
                Tiến trình đơn hàng
              </h2>

              <div className="hidden items-start justify-between sm:flex relative">
                <div className="absolute left-[calc(12.5%)] right-[calc(12.5%)] top-5 h-0.5 bg-border"></div>

                <div
                  className="absolute left-[calc(12.5%)] top-5 h-0.5 bg-primary transition-all duration-500"
                  style={{
                    width: `${(currentStep / (steps.length - 1)) * 75}%`,
                  }}
                ></div>

                {steps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isDone = index < currentStep;
                  const isCurrent = index === currentStep;
                  const isActive = index <= currentStep;

                  return (
                    <div
                      key={step.key}
                      className="relative z-10 flex w-1/4 flex-col items-center"
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                            : "bg-muted text-muted-foreground"
                        } ${isCurrent ? "ring-4 ring-primary/20" : ""}`}
                      >
                        {isDone ? (
                          <Check className="size-5" />
                        ) : (
                          <StepIcon className="size-5" />
                        )}
                      </div>

                      <p
                        className={`mt-3 text-xs font-semibold ${
                          isCurrent ? "text-primary" : "text-foreground"
                        }`}
                      >
                        {step.label}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-0 sm:hidden">
                {steps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isDone = index < currentStep;
                  const isCurrent = index === currentStep;
                  const isActive = index <= currentStep;

                  return (
                    <div key={step.key} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all ${
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          } ${isCurrent ? "ring-4 ring-primary/20" : ""}`}
                        >
                          {isDone ? (
                            <Check className="size-4" />
                          ) : (
                            <StepIcon className="size-4" />
                          )}
                        </div>

                        {index < steps.length - 1 && (
                          <div
                            className={`min-h-[28px] w-0.5 flex-1 ${
                              index < currentStep ? "bg-primary" : "bg-border"
                            }`}
                          />
                        )}
                      </div>

                      <div className="pb-6">
                        <p
                          className={`text-sm font-semibold ${
                            isCurrent
                              ? "text-primary"
                              : isActive
                                ? "text-foreground"
                                : "text-muted-foreground"
                          }`}
                        >
                          {step.label}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="mb-4 text-sm font-semibold text-foreground">
                  Sản phẩm ({items.length})
                </h2>

                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div
                      key={`${item.product}-${item.sizeId}-${index}`}
                      className="flex items-center gap-4"
                    >
                      <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted text-2xl">
                        {item.productThumbnail ? (
                          <img
                            src={item.productThumbnail}
                            alt={item.productName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          "👟"
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {item.productName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Size: {item.size} | Màu: {item.color} | SL:{" "}
                          {item.quantity}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          SKU: {item.sku}
                        </p>
                      </div>

                      <p className="shrink-0 text-sm font-bold text-foreground">
                        {formatPrice(item.itemTotal)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="mb-4 text-sm font-semibold text-foreground">
                  Thông tin giao hàng
                </h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InfoItem
                    label="Khách hàng"
                    value={shippingAddress.fullName}
                  />

                  <InfoItem
                    label="Số điện thoại"
                    value={shippingAddress.phone}
                  />

                  <InfoItem
                    label="Địa chỉ"
                    value={`${shippingAddress.detailAddress || ""}, ${
                      shippingAddress.ward || ""
                    }, ${shippingAddress.district || ""}, ${
                      shippingAddress.province || ""
                    }`}
                  />

                  <InfoItem
                    label="Phương thức thanh toán"
                    value={PAYMENT_METHOD_LABELS[order.paymentMethod]}
                  />

                  <InfoItem
                    label="Trạng thái thanh toán"
                    value={PAYMENT_STATUS_LABELS[order.paymentStatus]}
                  />

                  {order.transactionId && (
                    <InfoItem
                      label="Mã giao dịch"
                      value={order.transactionId}
                    />
                  )}

                  {order.note && (
                    <InfoItem label="Ghi chú" value={order.note} />
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="mb-4 text-sm font-semibold text-foreground">
                  Tóm tắt đơn hàng
                </h2>

                <div className="space-y-3 text-sm">
                  <SummaryRow
                    label="Tạm tính"
                    value={formatPrice(order.totalPrice)}
                  />

                  {order.totalDiscount > 0 && (
                    <SummaryRow
                      label="Giảm sản phẩm"
                      value={`-${formatPrice(order.totalDiscount)}`}
                    />
                  )}

                  {order.couponDiscount > 0 && (
                    <SummaryRow
                      label={`Mã giảm giá ${
                        order.coupon?.code ? `(${order.coupon.code})` : ""
                      }`}
                      value={`-${formatPrice(order.couponDiscount)}`}
                    />
                  )}

                  <SummaryRow
                    label="Phí vận chuyển"
                    value={
                      Number(order.shippingFee) === 0
                        ? "Miễn phí"
                        : formatPrice(order.shippingFee)
                    }
                  />

                  <div className="my-1 h-px bg-border"></div>

                  <div className="flex justify-between text-base font-bold text-foreground">
                    <span>Tổng cộng</span>
                    <span>{formatPrice(order.finalPrice)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 rounded-2xl border border-border bg-card p-6">
                <h2 className="mb-1 text-sm font-semibold text-foreground">
                  Thao tác
                </h2>

                <button className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-input bg-background px-5 py-2 text-sm font-semibold transition-all duration-200 hover:bg-accent hover:text-accent-foreground">
                  <RotateCcw className="size-4" />
                  Đặt lại
                </button>

                {canCancel && (
                  <button
                    onClick={handleCancelOrder}
                    disabled={isCancelling}
                    className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-destructive/40 bg-destructive/5 px-5 py-2 text-sm font-semibold text-destructive transition-all duration-200 hover:bg-destructive/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <XCircle className="size-4" />
                    {isCancelling ? "Đang hủy..." : "Hủy đơn hàng"}
                  </button>
                )}

                <button className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-accent-foreground">
                  <MessageCircle className="size-4" />
                  Liên hệ hỗ trợ
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const InfoItem = ({ label, value }) => {
  return (
    <div>
      <p className="mb-0.5 text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">
        {value || "ChÆ°a cáº­p nháº­t"}
      </p>
    </div>
  );
};

const SummaryRow = ({ label, value }) => {
  return (
    <div className="flex justify-between text-muted-foreground">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
};

export default OrderDetail;

