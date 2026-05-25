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
} from "lucide-react";
import { toast } from "react-toastify";

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

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

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
    toast.success("ÄÃ£ sao chÃ©p mÃ£ Ä‘Æ¡n hÃ ng");
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-soft">
        <div className="flex flex-col items-center text-muted-foreground">
          <Loader2 className="mb-3 size-9 animate-spin" />
          <p>Äang táº£i chi tiáº¿t Ä‘Æ¡n hÃ ng...</p>
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
          Quay láº¡i tÃ i khoáº£n
        </Link>

        <div className="mt-8 rounded-2xl border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">
            KhÃ´ng tÃ¬m tháº¥y Ä‘Æ¡n hÃ ng.
          </p>
        </div>
      </div>
    );
  }

  const shippingAddress = order.shippingAddress || {};
  const items = Array.isArray(order.items) ? order.items : [];
  const isCancelled = [ORDER_STATUS.CANCELLED, ORDER_STATUS.RETURNED].includes(order.orderStatus);

  return (
    <div>
      <main className="flex-1">
        <div className="container max-w-4xl py-8 md:py-12">
          <Link
            to="/account"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Quay láº¡i tÃ i khoáº£n
          </Link>

          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground">
                  ÄÆ¡n hÃ ng {order.orderCode}
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
                Äáº·t ngÃ y {formatDate(order.createdAt)}
              </p>
            </div>

            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {ORDER_STATUS_LABELS[order.orderStatus] || order.orderStatus}
            </span>
          </div>

          {!isCancelled && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-6 text-sm font-semibold text-foreground">
                Tiáº¿n trÃ¬nh Ä‘Æ¡n hÃ ng
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
                  Sáº£n pháº©m ({items.length})
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
                          "ðŸ‘Ÿ"
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {item.productName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Size: {item.size} | MÃ u: {item.color} | SL:{" "}
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
                  ThÃ´ng tin giao hÃ ng
                </h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InfoItem
                    label="KhÃ¡ch hÃ ng"
                    value={shippingAddress.fullName}
                  />

                  <InfoItem
                    label="Sá»‘ Ä‘iá»‡n thoáº¡i"
                    value={shippingAddress.phone}
                  />

                  <InfoItem
                    label="Äá»‹a chá»‰"
                    value={`${shippingAddress.detailAddress || ""}, ${
                      shippingAddress.ward || ""
                    }, ${shippingAddress.district || ""}, ${
                      shippingAddress.province || ""
                    }`}
                  />

                  <InfoItem
                    label="PhÆ°Æ¡ng thá»©c thanh toÃ¡n"
                    value={PAYMENT_METHOD_LABELS[order.paymentMethod]}
                  />

                  <InfoItem
                    label="Tráº¡ng thÃ¡i thanh toÃ¡n"
                    value={PAYMENT_STATUS_LABELS[order.paymentStatus]}
                  />

                  {order.transactionId && (
                    <InfoItem
                      label="MÃ£ giao dá»‹ch"
                      value={order.transactionId}
                    />
                  )}

                  {order.note && (
                    <InfoItem label="Ghi chÃº" value={order.note} />
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="mb-4 text-sm font-semibold text-foreground">
                  TÃ³m táº¯t Ä‘Æ¡n hÃ ng
                </h2>

                <div className="space-y-3 text-sm">
                  <SummaryRow
                    label="Táº¡m tÃ­nh"
                    value={formatPrice(order.totalPrice)}
                  />

                  {order.totalDiscount > 0 && (
                    <SummaryRow
                      label="Giáº£m sáº£n pháº©m"
                      value={`-${formatPrice(order.totalDiscount)}`}
                    />
                  )}

                  {order.couponDiscount > 0 && (
                    <SummaryRow
                      label={`MÃ£ giáº£m giÃ¡ ${
                        order.coupon?.code ? `(${order.coupon.code})` : ""
                      }`}
                      value={`-${formatPrice(order.couponDiscount)}`}
                    />
                  )}

                  <SummaryRow
                    label="PhÃ­ váº­n chuyá»ƒn"
                    value={
                      Number(order.shippingFee) === 0
                        ? "Miá»…n phÃ­"
                        : formatPrice(order.shippingFee)
                    }
                  />

                  <div className="my-1 h-px bg-border"></div>

                  <div className="flex justify-between text-base font-bold text-foreground">
                    <span>Tá»•ng cá»™ng</span>
                    <span>{formatPrice(order.finalPrice)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 rounded-2xl border border-border bg-card p-6">
                <h2 className="mb-1 text-sm font-semibold text-foreground">
                  Thao tÃ¡c
                </h2>

                <button className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-input bg-background px-5 py-2 text-sm font-semibold transition-all duration-200 hover:bg-accent hover:text-accent-foreground">
                  <RotateCcw className="size-4" />
                  Äáº·t láº¡i
                </button>

                <button className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-accent-foreground">
                  <MessageCircle className="size-4" />
                  LiÃªn há»‡ há»— trá»£
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

