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
import orderService from "../../features/checkout/services/order.service";
import socket from "../../socket/socket";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

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

const statusMap = {
  PENDING: {
    label: "Chờ xác nhận",
    icon: Clock,
    className: "bg-amber-50 text-amber-600",
  },
  CONFIRMED: {
    label: "Đã xác nhận",
    icon: CircleCheck,
    className: "bg-primary/10 text-primary",
  },
  PROCESSING: {
    label: "Đang xử lý",
    icon: Clock,
    className: "bg-amber-50 text-amber-600",
  },
  SHIPPING: {
    label: "Đang giao",
    icon: Truck,
    className: "bg-blue-50 text-blue-600",
  },
  DELIVERED: {
    label: "Đã giao",
    icon: CircleCheck,
    className: "bg-green-50 text-green-600",
  },
  CANCELLED: {
    label: "Đã hủy",
    icon: XCircle,
    className: "bg-red-50 text-red-600",
  },
  RETURNED: {
    label: "Đã trả hàng",
    icon: XCircle,
    className: "bg-red-50 text-red-600",
  },
};

const Orders = () => {
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user?._id && !user?.id) return;

    const userId = user._id || user.id;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join-user-room", userId);

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
      socket.off("order:updated", handleOrderUpdated);
    };
  }, [user?._id, user?.id]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await orderService.getMyOrders();
      const data = getResponseData(res);
      console.log(data)

      const list = Array.isArray(data)
        ? data
        : data?.orders || data?.items || data?.data || [];

      setOrders(list);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (!user?._id && !user?.id) return;

    if (!socket.connected) {
      socket.connect();
    }

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
      socket.off("order:updated", handleOrderUpdated);
    };
  }, [user?._id, user?.id]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        Đang tải đơn hàng...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="space-y-6"> 
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">
            Lịch sử đơn hàng
          </h2>
          <p className="text-sm text-muted-foreground">0 đơn hàng</p>
        </div>

        <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-accent">
            <Package className="size-6 text-muted-foreground" />
          </div>

          <h3 className="text-base font-semibold text-foreground">
            Bạn chưa có đơn hàng nào
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Các đơn hàng sau khi mua sẽ hiển thị tại đây.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Lịch sử đơn hàng</h2>
        <p className="text-sm text-muted-foreground">
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
              className="block rounded-2xl border border-border bg-card p-5 hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-muted flex items-center justify-center">
                    <Package className="size-4 text-muted-foreground" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {order.orderCode}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`inline-flex items-center font-semibold rounded-full gap-1 text-xs px-2.5 py-1 ${status.className}`}
                  >
                    <StatusIcon className="size-3" />
                    {status.label}
                  </div>

                  <ChevronRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </div>

              <div className="space-y-2">
                {firstItems.map((item, index) => (
                  <div
                    key={`${item.product}-${item.sizeId}-${index}`}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      {item.productThumbnail ? (
                        <img
                          src={item.productThumbnail}
                          alt={item.productName}
                          className="size-8 rounded-lg object-cover"
                        />
                      ) : (
                        <span className="text-lg">👟</span>
                      )}

                      <span className="truncate text-foreground">
                        {item.productName}
                      </span>

                      <span className="shrink-0 text-muted-foreground">
                        x{item.quantity}
                      </span>
                    </div>

                    <span className="shrink-0 font-medium text-foreground">
                      {formatPrice(item.itemTotal)}
                    </span>
                  </div>
                ))}

                {order.items?.length > 3 && (
                  <p className="text-xs text-muted-foreground">
                    +{order.items.length - 3} sản phẩm khác
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tổng tiền</span>
                <span className="text-base font-bold text-foreground">
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
