import {
  ChevronRight,
  CircleCheck,
  Clock,
  Package,
  Truck,
  XCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import orderService from "../../services/order.service";
import socket from "../../socket/socket";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ORDER_STATUS_LABELS } from "../../constants/order.constants";

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

const statusMap = {
  PENDING: {
    label: ORDER_STATUS_LABELS.PENDING,
    icon: Clock,
    className: "bg-amber-500/10 text-amber-600",
  },
  CONFIRMED: {
    label: ORDER_STATUS_LABELS.CONFIRMED,
    icon: CircleCheck,
    className: "bg-primary/10 text-primary",
  },
  PROCESSING: {
    label: ORDER_STATUS_LABELS.PROCESSING,
    icon: Clock,
    className: "bg-amber-500/10 text-amber-600",
  },
  SHIPPING: {
    label: ORDER_STATUS_LABELS.SHIPPING,
    icon: Truck,
    className: "bg-blue-500/10 text-blue-600",
  },
  DELIVERED: {
    label: ORDER_STATUS_LABELS.DELIVERED,
    icon: CircleCheck,
    className: "bg-emerald-500/10 text-emerald-600",
  },
  CANCELLED: {
    label: ORDER_STATUS_LABELS.CANCELLED,
    icon: XCircle,
    className: "bg-destructive/10 text-destructive",
  },
  RETURNED: {
    label: ORDER_STATUS_LABELS.RETURNED,
    icon: XCircle,
    className: "bg-destructive/10 text-destructive",
  },
};

const Orders = () => {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await orderService.getMyOrders();
      const data = res;

      const list = Array.isArray(data)
        ? data
        : data?.orders || data?.items || data?.data || [];

      setOrders(list);
    } catch (error) {
      console.error("Lỗi tải đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Socket: join room & lắng nghe cập nhật đơn hàng, tự re-join khi reconnect
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

    // Re-join room mỗi khi socket reconnect thành công
    socket.on("connect", joinRoom);

    const handleOrderUpdated = (payload) => {
      setOrders((prev) =>
        prev.map((order) =>
          order._id === payload.orderId
            ? {
                ...order,
                orderStatus: payload.orderStatus,
                paymentStatus: payload.paymentStatus,
                deliveredAt: payload.deliveredAt,
                cancelReason: payload.cancelReason,
                cancelledBy: payload.cancelledBy,
                cancelledAt: payload.cancelledAt,
              }
            : order,
        ),
      );

      toast.info(`Đơn hàng ${payload.orderCode} vừa được cập nhật`);
    };

    socket.on("order:updated", handleOrderUpdated);

    return () => {
      socket.off("connect", joinRoom);
      socket.off("order:updated", handleOrderUpdated);
    };
  }, [user?._id, user?.id]);

  if (loading) {
    return (
      <div className="border border-zinc-200 bg-white p-8 text-center text-[10px] font-black uppercase tracking-widest text-zinc-500">
        Đang tải đơn hàng...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black uppercase tracking-widest text-zinc-950">
            Lịch sử đơn hàng
          </h2>
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">0 đơn hàng</p>
        </div>

        <div className="border border-dashed border-zinc-200 bg-white p-12 text-center">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center bg-zinc-50">
            <Package className="size-6 text-zinc-400" />
          </div>

          <h3 className="text-xs font-black uppercase tracking-widest text-zinc-950">
            Bạn chưa có đơn hàng nào
          </h3>

          <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            Các đơn hàng sau khi mua sẽ hiển thị tại đây.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black uppercase tracking-widest text-zinc-950">Lịch sử đơn hàng</h2>
        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
          {orders.length} đơn hàng
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const status = statusMap[order.orderStatus] || statusMap.PENDING;
          const StatusIcon = status.icon;

          const firstItems = Array.isArray(order.items)
            ? order.items.slice(0, 3)
            : [];

          return (
            <Link
              key={order._id}
              to={`/orders/${order._id}`}
              className="block border border-zinc-200 bg-white p-6 hover:shadow-card-hover transition-shadow cursor-pointer group"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-4">
                  <div className="size-12 bg-zinc-50 flex items-center justify-center">
                    <Package className="size-5 text-zinc-400" />
                  </div>

                  <div>
                    <p className="text-sm font-black uppercase tracking-widest text-zinc-950">
                      {order.orderCode}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mt-1">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div
                    className={`inline-flex items-center font-black uppercase tracking-widest gap-1.5 text-[8px] px-3 py-1 ${status.className}`}
                  >
                    <StatusIcon className="size-3" />
                    {status.label}
                  </div>

                  <ChevronRight className="size-4 text-zinc-400 group-hover:text-zinc-950 transition-colors" />
                </div>
              </div>

              <div className="space-y-4">
                {firstItems.map((item, index) => (
                  <div
                    key={`${item.product}-${item.sizeId}-${index}`}
                    className="flex items-center justify-between gap-4 text-sm"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      {item.productThumbnail ? (
                        <img
                          src={item.productThumbnail}
                          alt={item.productName}
                          className="size-10 border border-zinc-200 object-cover mix-blend-multiply"
                        />
                      ) : (
                        <span className="text-lg">👟</span>
                      )}

                      <span className="truncate text-xs font-black uppercase tracking-widest text-zinc-950">
                        {item.productName}
                      </span>

                      <span className="shrink-0 text-[10px] font-bold text-zinc-500">
                        x{item.quantity}
                      </span>
                    </div>

                    <span className="shrink-0 text-sm font-black text-teal-600">
                      {formatPrice(item.itemTotal)}
                    </span>
                  </div>
                ))}

                {order.items?.length > 3 && (
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mt-2">
                    +{order.items.length - 3} sản phẩm khác
                  </p>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-200 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Tổng tiền</span>
                <span className="text-lg font-black text-teal-600 tabular-nums">
                  {formatPrice(order.finalPrice)}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
