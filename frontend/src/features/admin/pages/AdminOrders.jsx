import {
  CircleCheck,
  CircleX,
  Clock,
  Eye,
  Loader2,
  Package,
  Search,
  Truck,
  XCircle,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import orderService from "../../../features/checkout/services/order.service";
import socket from "../../../socket/socket";

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

const getOrderList = (data) => {
  if (Array.isArray(data)) return data;
  return data?.orders || data?.items || data?.data || [];
};

const getPagination = (data) => {
  const pagination = data?.pagination || data;

  return {
    total:
      pagination?.total ||
      pagination?.totalOrders ||
      pagination?.totalOrder ||
      pagination?.count ||
      0,
    page: pagination?.page || pagination?.currentPage || 1,
    limit: pagination?.limit || 10,
    totalPages: pagination?.totalPages || pagination?.totalPage || pagination?.pages || 1,
  };
};

const orderStatusOptions = [
  {
    value: "",
    label: "Tất cả",
  },
  {
    value: "PENDING",
    label: "Chờ xác nhận",
  },
  {
    value: "CONFIRMED",
    label: "Đã xác nhận",
  },
  {
    value: "PROCESSING",
    label: "Đang xử lý",
  },
  {
    value: "SHIPPING",
    label: "Đang giao",
  },
  {
    value: "DELIVERED",
    label: "Đã giao",
  },
  {
    value: "CANCELLED",
    label: "Đã hủy",
  },
  {
    value: "RETURNED",
    label: "Đã trả hàng",
  },
];

const paymentStatusOptions = [
  {
    value: "",
    label: "Tất cả thanh toán",
  },
  {
    value: "PENDING",
    label: "Chưa thanh toán",
  },
  {
    value: "PAID",
    label: "Đã thanh toán",
  },
  {
    value: "FAILED",
    label: "Thanh toán lỗi",
  },
  {
    value: "RETURNED",
    label: "Đã hoàn tiền",
  },
];

const paymentMethodOptions = [
  {
    value: "",
    label: "Tất cả phương thức",
  },
  {
    value: "COD",
    label: "COD",
  },
  {
    value: "VNPAY",
    label: "VNPAY",
  },
];

const orderStatusMap = {
  PENDING: {
    label: "Chờ xác nhận",
    className: "bg-amber-100 text-amber-700",
    icon: Clock,
  },
  CONFIRMED: {
    label: "Đã xác nhận",
    className: "bg-indigo-100 text-indigo-700",
    icon: CircleCheck,
  },
  PROCESSING: {
    label: "Đang xử lý",
    className: "bg-purple-100 text-purple-700",
    icon: Package,
  },
  SHIPPING: {
    label: "Đang giao",
    className: "bg-blue-100 text-blue-700",
    icon: Truck,
  },
  DELIVERED: {
    label: "Đã giao",
    className: "bg-emerald-100 text-emerald-700",
    icon: CircleCheck,
  },
  CANCELLED: {
    label: "Đã hủy",
    className: "bg-red-100 text-red-700",
    icon: XCircle,
  },
  RETURNED: {
    label: "Đã trả hàng",
    className: "bg-slate-100 text-slate-700",
    icon: XCircle,
  },
};

const paymentStatusMap = {
  PENDING: {
    label: "Chưa thanh toán",
    className: "bg-amber-50 text-amber-700",
  },
  PAID: {
    label: "Đã thanh toán",
    className: "bg-emerald-50 text-emerald-700",
  },
  FAILED: {
    label: "Thanh toán lỗi",
    className: "bg-red-50 text-red-700",
  },
  RETURNED: {
    label: "Đã hoàn tiền",
    className: "bg-slate-50 text-slate-700",
  },
};

const canCancelOrder = (order) => {
  return !["CANCELLED", "DELIVERED", "RETURNED"].includes(order.orderStatus);
};

const getCustomerName = (order) => {
  return (
    order.user?.fullName ||
    order.user?.name ||
    order.shippingAddress?.fullName ||
    "Không rõ"
  );
};

const getCustomerEmail = (order) => {
  return order.user?.email || "Chưa có email";
};

const getCustomerPhone = (order) => {
  return order.shippingAddress?.phone || "Chưa có SĐT";
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState("");

  const [keyword, setKeyword] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [page, setPage] = useState(1);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const params = {
        page,
        limit: pagination.limit,
      };

      if (keyword.trim()) {
        params.keyword = keyword.trim();
        params.search = keyword.trim();
        params.q = keyword.trim();
      }

      if (orderStatus) {
        params.orderStatus = orderStatus;
      }

      if (paymentStatus) {
        params.paymentStatus = paymentStatus;
      }

      if (paymentMethod) {
        params.paymentMethod = paymentMethod;
      }

      const res = await orderService.getAllOrders(params);
      const data = getResponseData(res);

      const list = getOrderList(data);
      setOrders(list);
      setPagination(getPagination(data));
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Lấy đơn hàng thất bại");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, orderStatus, paymentStatus, paymentMethod]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchOrders();
    }, 500);

    return () => clearTimeout(timer);
  }, [keyword]);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join-admin-room");

    const handleAdminOrderUpdated = (payload) => {
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
    };

    socket.on("admin:order-updated", handleAdminOrderUpdated);

    return () => {
      socket.off("admin:order-updated", handleAdminOrderUpdated);
    };
  }, []);

  const filteredOrders = useMemo(() => {
    const searchText = keyword.trim().toLowerCase();

    return orders.filter((order) => {
      const matchedKeyword =
        !searchText ||
        order.orderCode?.toLowerCase().includes(searchText) ||
        getCustomerName(order).toLowerCase().includes(searchText) ||
        getCustomerEmail(order).toLowerCase().includes(searchText) ||
        getCustomerPhone(order).toLowerCase().includes(searchText);

      const matchedOrderStatus =
        !orderStatus || order.orderStatus === orderStatus;

      const matchedPaymentStatus =
        !paymentStatus || order.paymentStatus === paymentStatus;

      const matchedPaymentMethod =
        !paymentMethod || order.paymentMethod === paymentMethod;

      return (
        matchedKeyword &&
        matchedOrderStatus &&
        matchedPaymentStatus &&
        matchedPaymentMethod
      );
    });
  }, [orders, keyword, orderStatus, paymentStatus, paymentMethod]);

  const counts = useMemo(() => {
    return {
      all: pagination.total || orders.length,
      pending: orders.filter((order) => order.orderStatus === "PENDING").length,
      shipping: orders.filter((order) => order.orderStatus === "SHIPPING")
        .length,
      paid: orders.filter((order) => order.paymentStatus === "PAID").length,
      cancelled: orders.filter((order) => order.orderStatus === "CANCELLED")
        .length,
    };
  }, [orders, pagination.total]);

  const handleChangeOrderStatus = async (orderId, nextStatus) => {
    if (!nextStatus) return;

    try {
      setUpdatingId(orderId);

      await orderService.updateOrderStatus(orderId, nextStatus);

      toast.success("Cập nhật trạng thái thành công");

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? {
              ...order,
              orderStatus: nextStatus,
            }
            : order,
        ),
      );
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Cập nhật trạng thái thất bại",
      );
    } finally {
      setUpdatingId("");
    }
  };

  const handleCancelOrder = async (orderId) => {
    const reason = window.prompt("Nhập lý do hủy đơn:");

    if (reason === null) return;

    if (!reason.trim()) {
      toast.warning("Vui lòng nhập lý do hủy đơn");
      return;
    }

    try {
      setUpdatingId(orderId);

      await orderService.adminCancelOrder(orderId, reason.trim());

      toast.success("Hủy đơn hàng thành công");

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? {
              ...order,
              orderStatus: "CANCELLED",
              cancelReason: reason.trim(),
              cancelledBy: "ADMIN",
            }
            : order,
        ),
      );
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Hủy đơn hàng thất bại");
    } finally {
      setUpdatingId("");
    }
  };

  const handleTabClick = (status) => {
    setOrderStatus(status);
    setPage(1);
  };

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Đơn hàng</h1>

          <p className="mt-1 text-sm text-slate-500">
            {pagination.total || filteredOrders.length} đơn hàng
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex overflow-x-auto border-b border-slate-200 px-2">
          <OrderTab
            active={!orderStatus}
            label="Tất cả"
            count={counts.all}
            onClick={() => handleTabClick("")}
          />

          <OrderTab
            active={orderStatus === "PENDING"}
            label="Chờ duyệt"
            count={counts.pending}
            onClick={() => handleTabClick("PENDING")}
          />

          <OrderTab
            active={orderStatus === "SHIPPING"}
            label="Đang giao"
            count={counts.shipping}
            onClick={() => handleTabClick("SHIPPING")}
          />

          <button
            onClick={() => {
              setPaymentStatus((prev) => (prev === "PAID" ? "" : "PAID"));
              setPage(1);
            }}
            className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${paymentStatus === "PAID"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
          >
            Đã thanh toán
            <span className="ml-1.5 text-xs text-slate-400">
              ({counts.paid})
            </span>
          </button>

          <OrderTab
            active={orderStatus === "CANCELLED"}
            label="Đã hủy"
            count={counts.cancelled}
            onClick={() => handleTabClick("CANCELLED")}
          />
        </div>

        <div className="grid gap-3 border-b border-slate-200 p-4 lg:grid-cols-4">
          <div className="relative lg:col-span-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setPage(1);
              }}
              className="flex h-10 w-full rounded-md border border-slate-200 bg-background px-3 py-2 pl-9 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="Tìm mã đơn, khách hàng..."
            />
          </div>

          <select
            value={orderStatus}
            onChange={(e) => {
              setOrderStatus(e.target.value);
              setPage(1);
            }}
            className="h-10 rounded-md border border-slate-200 bg-background px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            {orderStatusOptions.map((item) => (
              <option key={item.value || "all"} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <select
            value={paymentStatus}
            onChange={(e) => {
              setPaymentStatus(e.target.value);
              setPage(1);
            }}
            className="h-10 rounded-md border border-slate-200 bg-background px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            {paymentStatusOptions.map((item) => (
              <option key={item.value || "all"} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <select
            value={paymentMethod}
            onChange={(e) => {
              setPaymentMethod(e.target.value);
              setPage(1);
            }}
            className="h-10 rounded-md border border-slate-200 bg-background px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            {paymentMethodOptions.map((item) => (
              <option key={item.value || "all"} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-left">
              <tr>
                <th className="px-5 py-3 font-semibold text-slate-700">
                  Mã đơn
                </th>
                <th className="px-5 py-3 font-semibold text-slate-700">
                  Khách hàng
                </th>
                <th className="px-5 py-3 font-semibold text-slate-700">Ngày</th>
                <th className="px-5 py-3 text-center font-semibold text-slate-700">
                  SP
                </th>
                <th className="px-5 py-3 font-semibold text-slate-700">Tổng</th>
                <th className="px-5 py-3 font-semibold text-slate-700">
                  Thanh toán
                </th>
                <th className="px-5 py-3 font-semibold text-slate-700">
                  Trạng thái
                </th>
                <th className="px-5 py-3 text-right font-semibold text-slate-700">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                      <Loader2 className="size-4 animate-spin" />
                      Đang tải đơn hàng...
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-10 text-center text-sm text-slate-500"
                  >
                    Không có đơn hàng nào
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const status =
                    orderStatusMap[order.orderStatus] || orderStatusMap.PENDING;

                  const StatusIcon = status.icon;

                  const paymentStatus =
                    paymentStatusMap[order.paymentStatus] ||
                    paymentStatusMap.PENDING;

                  return (
                    <tr
                      key={order._id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-5 py-3 font-mono text-xs font-semibold text-indigo-600">
                        {order.orderCode}
                      </td>

                      <td className="px-5 py-3">
                        <p className="font-medium text-slate-900">
                          {getCustomerName(order)}
                        </p>
                        <p className="text-xs text-slate-500">
                          {getCustomerEmail(order)}
                        </p>
                        <p className="text-xs text-slate-400">
                          {getCustomerPhone(order)}
                        </p>
                      </td>

                      <td className="px-5 py-3 text-slate-600">
                        {formatDate(order.createdAt)}
                      </td>

                      <td className="px-5 py-3 text-center text-slate-700">
                        {order.totalQuantity || order.items?.length || 0}
                      </td>

                      <td className="px-5 py-3 font-semibold text-slate-900">
                        {formatPrice(order.finalPrice)}
                      </td>

                      <td className="px-5 py-3">
                        <div className="space-y-1">
                          <p className="font-medium text-slate-700">
                            {order.paymentMethod}
                          </p>

                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${paymentStatus.className}`}
                          >
                            {paymentStatus.label}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-3">
                        <div className="space-y-2">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${status.className}`}
                          >
                            <StatusIcon className="size-3" />
                            {status.label}
                          </span>

                          {order.cancelReason && (
                            <p
                              className="max-w-[220px] truncate text-xs text-slate-500"
                              title={order.cancelReason}
                            >
                              Lý do: {order.cancelReason}
                            </p>
                          )}

                          {!["CANCELLED", "DELIVERED", "RETURNED"].includes(
                            order.orderStatus,
                          ) && (
                              <select
                                value={order.orderStatus}
                                disabled={updatingId === order._id}
                                onChange={(e) =>
                                  handleChangeOrderStatus(
                                    order._id,
                                    e.target.value,
                                  )
                                }
                                className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs outline-none focus:border-indigo-500"
                              >
                                {orderStatusOptions
                                  .filter((item) => item.value)
                                  .map((item) => (
                                    <option key={item.value} value={item.value}>
                                      {item.label}
                                    </option>
                                  ))}
                              </select>
                            )}
                        </div>
                      </td>

                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={`/admin/orders/${order._id}`}
                            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-600 hover:bg-slate-200"
                            title="Xem chi tiết"
                          >
                            <Eye className="size-4" />
                          </Link>

                          {canCancelOrder(order) && (
                            <button
                              onClick={() => handleCancelOrder(order._id)}
                              disabled={updatingId === order._id}
                              className="flex h-8 w-8 items-center justify-center rounded-md text-slate-600 hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
                              title="Hủy đơn"
                            >
                              {updatingId === order._id ? (
                                <Loader2 className="size-4 animate-spin" />
                              ) : (
                                <CircleX className="size-4" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Trang {pagination.page || page} / {pagination.totalPages || 1}
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1 || loading}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="h-9 rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Trước
            </button>

            <button
              disabled={page >= pagination.totalPages || loading}
              onClick={() =>
                setPage((prev) =>
                  Math.min(prev + 1, pagination.totalPages || prev + 1),
                )
              }
              className="h-9 rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderTab = ({ active, label, count, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${active
        ? "border-indigo-600 text-indigo-600"
        : "border-transparent text-slate-600 hover:text-slate-900"
        }`}
    >
      {label}
      <span className="ml-1.5 text-xs text-slate-400">({count})</span>
    </button>
  );
};

export default AdminOrders;
