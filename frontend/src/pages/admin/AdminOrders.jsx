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

import {
  ORDER_STATUS,
  ORDER_STATUS_FILTER_OPTIONS,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_OPTIONS,
} from "../../constants/order.constants";
import {
  PAYMENT_METHOD_FILTER_OPTIONS,
  PAYMENT_STATUS,
  PAYMENT_STATUS_FILTER_OPTIONS,
  PAYMENT_STATUS_LABELS,
} from "../../constants/payment.constants";
import orderService from "../../services/order.service";
import socket from "../../socket/socket";

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

const orderStatusMap = {
  PENDING: {
    label: ORDER_STATUS_LABELS.PENDING,
    className: "bg-amber-100 text-amber-700",
    icon: Clock,
  },
  CONFIRMED: {
    label: ORDER_STATUS_LABELS.CONFIRMED,
    className: "bg-indigo-100 text-indigo-700",
    icon: CircleCheck,
  },
  PROCESSING: {
    label: ORDER_STATUS_LABELS.PROCESSING,
    className: "bg-purple-100 text-purple-700",
    icon: Package,
  },
  SHIPPING: {
    label: ORDER_STATUS_LABELS.SHIPPING,
    className: "bg-blue-100 text-blue-700",
    icon: Truck,
  },
  DELIVERED: {
    label: ORDER_STATUS_LABELS.DELIVERED,
    className: "bg-emerald-100 text-emerald-700",
    icon: CircleCheck,
  },
  CANCELLED: {
    label: ORDER_STATUS_LABELS.CANCELLED,
    className: "bg-red-100 text-red-700",
    icon: XCircle,
  },
  RETURNED: {
    label: ORDER_STATUS_LABELS.RETURNED,
    className: "bg-slate-100 text-slate-700",
    icon: XCircle,
  },
};

const paymentStatusMap = {
  PENDING: {
    label: PAYMENT_STATUS_LABELS.PENDING,
    className: "bg-amber-50 text-amber-700",
  },
  PAID: {
    label: PAYMENT_STATUS_LABELS.PAID,
    className: "bg-emerald-50 text-emerald-700",
  },
  FAILED: {
    label: PAYMENT_STATUS_LABELS.FAILED,
    className: "bg-red-50 text-red-700",
  },
  RETURNED: {
    label: PAYMENT_STATUS_LABELS.RETURNED,
    className: "bg-slate-50 text-slate-700",
  },
};

const canCancelOrder = (order) => {
  return ![
    ORDER_STATUS.CANCELLED,
    ORDER_STATUS.DELIVERED,
    ORDER_STATUS.RETURNED,
  ].includes(order.orderStatus);
};

const getCustomerName = (order) => {
  return (
    order.user?.fullName ||
    order.user?.name ||
    order.shippingAddress?.fullName ||
    "KhÃ´ng rÃµ"
  );
};

const getCustomerEmail = (order) => {
  return order.user?.email || "ChÆ°a cÃ³ email";
};

const getCustomerPhone = (order) => {
  return order.shippingAddress?.phone || "ChÆ°a cÃ³ SÄT";
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
      toast.error(error.response?.data?.message || "Láº¥y Ä‘Æ¡n hÃ ng tháº¥t báº¡i");
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
      pending: orders.filter((order) => order.orderStatus === ORDER_STATUS.PENDING).length,
      shipping: orders.filter((order) => order.orderStatus === ORDER_STATUS.SHIPPING)
        .length,
      paid: orders.filter((order) => order.paymentStatus === PAYMENT_STATUS.PAID).length,
      cancelled: orders.filter((order) => order.orderStatus === ORDER_STATUS.CANCELLED)
        .length,
    };
  }, [orders, pagination.total]);

  const handleChangeOrderStatus = async (orderId, nextStatus) => {
    if (!nextStatus) return;

    try {
      setUpdatingId(orderId);

      await orderService.updateOrderStatus(orderId, nextStatus);

      toast.success("Cáº­p nháº­t tráº¡ng thÃ¡i thÃ nh cÃ´ng");

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
        error.response?.data?.message || "Cáº­p nháº­t tráº¡ng thÃ¡i tháº¥t báº¡i",
      );
    } finally {
      setUpdatingId("");
    }
  };

  const handleCancelOrder = async (orderId) => {
    const reason = window.prompt("Nháº­p lÃ½ do há»§y Ä‘Æ¡n:");

    if (reason === null) return;

    if (!reason.trim()) {
      toast.warning("Vui lÃ²ng nháº­p lÃ½ do há»§y Ä‘Æ¡n");
      return;
    }

    try {
      setUpdatingId(orderId);

      await orderService.adminCancelOrder(orderId, reason.trim());

      toast.success("Há»§y Ä‘Æ¡n hÃ ng thÃ nh cÃ´ng");

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? {
              ...order,
              orderStatus: ORDER_STATUS.CANCELLED,
              cancelReason: reason.trim(),
              cancelledBy: "ADMIN",
            }
            : order,
        ),
      );
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Há»§y Ä‘Æ¡n hÃ ng tháº¥t báº¡i");
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
          <h1 className="text-2xl font-bold text-slate-900">ÄÆ¡n hÃ ng</h1>

          <p className="mt-1 text-sm text-slate-500">
            {pagination.total || filteredOrders.length} Ä‘Æ¡n hÃ ng
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex overflow-x-auto border-b border-slate-200 px-2">
          <OrderTab
            active={!orderStatus}
            label="Táº¥t cáº£"
            count={counts.all}
            onClick={() => handleTabClick("")}
          />

          <OrderTab
            active={orderStatus === ORDER_STATUS.PENDING}
            label="Chá» duyá»‡t"
            count={counts.pending}
            onClick={() => handleTabClick(ORDER_STATUS.PENDING)}
          />

          <OrderTab
            active={orderStatus === ORDER_STATUS.SHIPPING}
            label="Äang giao"
            count={counts.shipping}
            onClick={() => handleTabClick(ORDER_STATUS.SHIPPING)}
          />

          <button
            onClick={() => {
              setPaymentStatus((prev) =>
                prev === PAYMENT_STATUS.PAID ? "" : PAYMENT_STATUS.PAID,
              );
              setPage(1);
            }}
            className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${paymentStatus === PAYMENT_STATUS.PAID
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
          >
            ÄÃ£ thanh toÃ¡n
            <span className="ml-1.5 text-xs text-slate-400">
              ({counts.paid})
            </span>
          </button>

          <OrderTab
            active={orderStatus === ORDER_STATUS.CANCELLED}
            label="ÄÃ£ há»§y"
            count={counts.cancelled}
            onClick={() => handleTabClick(ORDER_STATUS.CANCELLED)}
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
              placeholder="TÃ¬m mÃ£ Ä‘Æ¡n, khÃ¡ch hÃ ng..."
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
            {ORDER_STATUS_FILTER_OPTIONS.map((item) => (
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
            {PAYMENT_STATUS_FILTER_OPTIONS.map((item) => (
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
            {PAYMENT_METHOD_FILTER_OPTIONS.map((item) => (
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
                  MÃ£ Ä‘Æ¡n
                </th>
                <th className="px-5 py-3 font-semibold text-slate-700">
                  KhÃ¡ch hÃ ng
                </th>
                <th className="px-5 py-3 font-semibold text-slate-700">NgÃ y</th>
                <th className="px-5 py-3 text-center font-semibold text-slate-700">
                  SP
                </th>
                <th className="px-5 py-3 font-semibold text-slate-700">Tá»•ng</th>
                <th className="px-5 py-3 font-semibold text-slate-700">
                  Thanh toÃ¡n
                </th>
                <th className="px-5 py-3 font-semibold text-slate-700">
                  Tráº¡ng thÃ¡i
                </th>
                <th className="px-5 py-3 text-right font-semibold text-slate-700">
                  Thao tÃ¡c
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                      <Loader2 className="size-4 animate-spin" />
                      Äang táº£i Ä‘Æ¡n hÃ ng...
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-10 text-center text-sm text-slate-500"
                  >
                    KhÃ´ng cÃ³ Ä‘Æ¡n hÃ ng nÃ o
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
                              LÃ½ do: {order.cancelReason}
                            </p>
                          )}

                          {![
                            ORDER_STATUS.CANCELLED,
                            ORDER_STATUS.DELIVERED,
                            ORDER_STATUS.RETURNED,
                          ].includes(
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
                                {ORDER_STATUS_OPTIONS.map((item) => (
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
                            title="Xem chi tiáº¿t"
                          >
                            <Eye className="size-4" />
                          </Link>

                          {canCancelOrder(order) && (
                            <button
                              onClick={() => handleCancelOrder(order._id)}
                              disabled={updatingId === order._id}
                              className="flex h-8 w-8 items-center justify-center rounded-md text-slate-600 hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
                              title="Há»§y Ä‘Æ¡n"
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
              TrÆ°á»›c
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

