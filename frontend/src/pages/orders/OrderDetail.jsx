import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Copy,
  Loader2,
} from "lucide-react";
import OrderProgress from "../../components/orders/OrderProgress";
import OrderItems from "../../components/orders/OrderItems";
import OrderShippingInfo from "../../components/orders/OrderShippingInfo";
import OrderSummary from "../../components/orders/OrderSummary";
import OrderActions from "../../components/orders/OrderActions";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import socket from "../../socket/socket";

import {
  ORDER_STATUS,
  ORDER_STATUS_LABELS,
} from "../../constants/order.constants";
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
            <OrderProgress currentStep={currentStep} />
          )}

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <OrderItems items={items} formatPrice={formatPrice} />
              <OrderShippingInfo order={order} shippingAddress={shippingAddress} />
            </div>

            <div className="space-y-6">
              <OrderSummary order={order} formatPrice={formatPrice} />
              <OrderActions
                canCancel={canCancel}
                isCancelling={isCancelling}
                handleCancelOrder={handleCancelOrder}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};



export default OrderDetail;

