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
      const data = res;

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

        <div className="mt-8 border border-zinc-200 bg-white p-12 text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
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
            className="mb-8 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 transition-colors hover:text-zinc-950"
          >
            <ArrowLeft className="size-4" />
            Quay lại tài khoản
          </Link>

          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <h1 className="text-2xl font-black uppercase tracking-widest text-zinc-950">
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

              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Đặt ngày {formatDate(order.createdAt)}
              </p>
            </div>

            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {ORDER_STATUS_LABELS[order.orderStatus] || order.orderStatus}
            </span>
          </div>

          {!isCancelled && (
            <div className="border border-zinc-200 bg-white p-8">
              <h2 className="mb-8 text-[11px] font-black uppercase tracking-[0.15em] text-zinc-950">
                Tiến trình đơn hàng
              </h2>

              <div className="hidden items-start justify-between sm:flex relative">
                <div className="absolute left-[calc(12.5%)] right-[calc(12.5%)] top-5 h-px bg-zinc-200"></div>

                <div
                  className="absolute left-[calc(12.5%)] top-5 h-px bg-teal-600 transition-all duration-500"
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
                        className={`flex size-10 items-center justify-center transition-all duration-300 ${
                          isActive
                            ? "bg-teal-600 text-white"
                            : "bg-zinc-50 text-zinc-400"
                        } ${isCurrent ? "ring-1 ring-teal-600 ring-offset-2" : ""}`}
                      >
                        {isDone ? (
                          <Check className="size-5" />
                        ) : (
                          <StepIcon className="size-5" />
                        )}
                      </div>

                      <p
                        className={`mt-4 text-[10px] font-black uppercase tracking-widest ${
                          isCurrent ? "text-teal-600" : "text-zinc-950"
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
                          className={`flex size-10 shrink-0 items-center justify-center transition-all ${
                            isActive
                              ? "bg-teal-600 text-white"
                              : "bg-zinc-50 text-zinc-400"
                          } ${isCurrent ? "ring-1 ring-teal-600 ring-offset-2" : ""}`}
                        >
                          {isDone ? (
                            <Check className="size-4" />
                          ) : (
                            <StepIcon className="size-4" />
                          )}
                        </div>

                        {index < steps.length - 1 && (
                          <div
                            className={`min-h-[28px] w-px flex-1 ${
                              index < currentStep ? "bg-teal-600" : "bg-zinc-200"
                            }`}
                          />
                        )}
                      </div>

                      <div className="pb-6">
                        <p
                          className={`text-[10px] font-black uppercase tracking-widest mt-2 ${
                            isCurrent
                              ? "text-teal-600"
                              : isActive
                                ? "text-zinc-950"
                                : "text-zinc-400"
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
              <div className="border border-zinc-200 bg-white p-8">
                <h2 className="mb-6 text-[11px] font-black uppercase tracking-[0.15em] text-zinc-950">
                  Sản phẩm ({items.length})
                </h2>

                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div
                      key={`${item.product}-${item.sizeId}-${index}`}
                      className="flex items-center gap-4"
                    >
                      <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden border border-zinc-200 bg-zinc-50 text-2xl">
                        {item.productThumbnail ? (
                          <img
                            src={item.productThumbnail}
                            alt={item.productName}
                            className="h-full w-full object-cover mix-blend-multiply"
                          />
                        ) : (
                          "👟"
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-black uppercase tracking-widest text-zinc-950">
                          {item.productName}
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mt-1">
                          Size: {item.size} | Màu: {item.color} | SL:{" "}
                          {item.quantity}
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                          SKU: {item.sku}
                        </p>
                      </div>

                      <p className="shrink-0 text-sm font-black text-teal-600">
                        {formatPrice(item.itemTotal)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-zinc-200 bg-white p-8">
                <h2 className="mb-6 text-[11px] font-black uppercase tracking-[0.15em] text-zinc-950">
                  Thông tin giao hàng
                </h2>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
              <div className="border border-zinc-200 bg-white p-8">
                <h2 className="mb-6 text-[11px] font-black uppercase tracking-[0.15em] text-zinc-950">
                  Tóm tắt đơn hàng
                </h2>

                <div className="space-y-4 text-[10px] font-bold uppercase tracking-wider">
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

                  <div className="my-4 h-px bg-zinc-200"></div>

                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-black uppercase tracking-widest text-zinc-500">Tổng cộng</span>
                    <span className="text-xl font-black text-zinc-950">{formatPrice(order.finalPrice)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 border border-zinc-200 bg-white p-8">
                <h2 className="mb-4 text-[11px] font-black uppercase tracking-[0.15em] text-zinc-950">
                  Thao tác
                </h2>

                <button className="inline-flex h-12 w-full items-center justify-center gap-2 border border-zinc-200 bg-zinc-50 px-5 text-[10px] font-black uppercase tracking-[0.1em] text-zinc-950 transition-all duration-200 hover:bg-white hover:border-zinc-300">
                  <RotateCcw className="size-4" />
                  Đặt lại
                </button>

                {canCancel && (
                  <button
                    onClick={handleCancelOrder}
                    disabled={isCancelling}
                    className="inline-flex h-12 w-full items-center justify-center gap-2 border border-red-200 bg-red-50 px-5 text-[10px] font-black uppercase tracking-[0.1em] text-red-600 transition-all duration-200 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <XCircle className="size-4" />
                    {isCancelling ? "Đang hủy..." : "Hủy đơn hàng"}
                  </button>
                )}

                <button className="inline-flex h-12 w-full items-center justify-center gap-2 bg-zinc-950 px-5 text-[10px] font-black uppercase tracking-[0.1em] text-white transition-all duration-200 hover:bg-teal-600">
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
      <p className="mb-2 text-[10px] font-black uppercase tracking-[0.15em] text-zinc-500">{label}</p>
      <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-950">
        {value || "Chưa cập nhật"}
      </p>
    </div>
  );
};

const SummaryRow = ({ label, value }) => {
  return (
    <div className="flex justify-between text-zinc-500">
      <span>{label}</span>
      <span className="text-zinc-950 tabular-nums">{value}</span>
    </div>
  );
};

export default OrderDetail;

