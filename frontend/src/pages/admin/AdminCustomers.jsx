import { Loader2, Mail, MapPin, Phone, Search, ShoppingBag, Users } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import orderService from "../../services/order.service";

// ─── Helpers ────────────────────────────────────────────────────────────────

const getResponseData = (res) => res.data?.metadata || res.data?.data || res.data;

const formatDate = (date) => {
  if (!date) return "–";
  return new Date(date).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const AVATAR_COLORS = [
  "from-violet-400 to-violet-600",
  "from-indigo-400 to-indigo-600",
  "from-sky-400 to-sky-600",
  "from-emerald-400 to-emerald-600",
  "from-amber-400 to-amber-600",
  "from-rose-400 to-rose-600",
  "from-pink-400 to-pink-600",
  "from-teal-400 to-teal-600",
];

const getAvatarColor = (id = "") => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

const getCustomerName = (order) => {
  return order.shippingAddress?.fullName || order.user?.fullName || order.user?.name || "Không rõ";
};

const getCustomerEmail = (order) => {
  return order.shippingAddress?.email || order.user?.email || "Chưa có email";
};

const getCustomerPhone = (order) => {
  return order.shippingAddress?.phone || "Chưa có SĐT";
};

const getFullAddress = (address) => {
  if (!address) return "Chưa có địa chỉ";
  const parts = [address.detailAddress, address.ward, address.district, address.province].filter(
    Boolean
  );
  return parts.join(", ");
};

// ─── Main Component ──────────────────────────────────────────────────────────

const AdminCustomers = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);

  const debounceRef = useRef(null);

  // ─── Fetch ─────────────────────────────────────────────────────────────────

  const fetchOrders = async ({ p = page, kw = keyword } = {}) => {
    try {
      setLoading(true);
      const params = {
        page: p,
        limit: pagination.limit || 10,
      };

      if (kw.trim()) {
        params.keyword = kw.trim();
        params.search = kw.trim();
        params.q = kw.trim();
      }

      const res = await orderService.getAllOrders(params);
      const data = getResponseData(res);

      const list = Array.isArray(data) ? data : data?.orders || data?.items || data?.data || [];

      const pg = data?.pagination || data;
      const total = pg?.total || pg?.totalOrders || pg?.totalOrder || pg?.count || 0;
      const totalPages = pg?.totalPages || pg?.totalPage || pg?.pages || 1;

      setOrders(list);
      setPagination({
        total,
        page: pg?.page || pg?.currentPage || 1,
        limit: pg?.limit || 10,
        totalPages,
      });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Lấy danh sách khách hàng thất bại");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders({ p: page, kw: keyword });
  }, [page]);

  const handleKeywordChange = (e) => {
    const val = e.target.value;
    setKeyword(val);
    setPage(1);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchOrders({ p: 1, kw: val });
    }, 450);
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Khách hàng</h1>
          <p className="text-sm text-slate-500 mt-1">
            {loading ? "Đang tải..." : `${pagination.total} lượt mua hàng`}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <StatCard
          icon={<Users className="size-5 text-indigo-600" />}
          label="Tổng lượt khách hàng mua"
          value={loading ? "–" : pagination.total}
          bg="bg-indigo-50"
        />
        <StatCard
          icon={<ShoppingBag className="size-5 text-emerald-600" />}
          label="Mã đơn hàng liên kết"
          value={loading ? "–" : pagination.total}
          bg="bg-emerald-50"
        />
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        {/* Filters */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={keyword}
              onChange={handleKeywordChange}
              className="flex h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
              placeholder="Tìm theo tên, email, SĐT hoặc mã đơn..."
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-left">
              <tr>
                <th className="px-5 py-3 font-semibold text-slate-700">Khách hàng</th>
                <th className="px-5 py-3 font-semibold text-slate-700">Liên hệ</th>
                <th className="px-5 py-3 font-semibold text-slate-700">Địa chỉ</th>
                <th className="px-5 py-3 font-semibold text-slate-700">Mã đơn hàng</th>
                <th className="px-5 py-3 font-semibold text-slate-700">Ngày mua</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                      <Loader2 className="size-4 animate-spin" />
                      Đang tải danh sách khách hàng...
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-500">
                    Không tìm thấy dữ liệu khách hàng nào
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const customerName = getCustomerName(order);
                  const isGuest = !order.user;

                  return (
                    <tr
                      key={order._id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      {/* Customer Info */}
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-9 w-9 rounded-full bg-gradient-to-br ${getAvatarColor(order.orderCode)} flex items-center justify-center text-white font-semibold text-sm shrink-0 shadow-sm`}
                          >
                            {getInitials(customerName)}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 flex items-center gap-2">
                              {customerName}
                              {isGuest && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold whitespace-nowrap">
                                  VÃNG LAI
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="px-5 py-3">
                        <div className="space-y-1">
                          <p className="flex items-center gap-2 text-slate-600 text-xs">
                            <Phone className="size-3 shrink-0" />
                            {getCustomerPhone(order)}
                          </p>
                          <p className="flex items-center gap-2 text-slate-600 text-xs">
                            <Mail className="size-3 shrink-0" />
                            <span
                              className="truncate max-w-[150px]"
                              title={getCustomerEmail(order)}
                            >
                              {getCustomerEmail(order)}
                            </span>
                          </p>
                        </div>
                      </td>

                      {/* Address */}
                      <td className="px-5 py-3">
                        <div className="flex items-start gap-2">
                          <MapPin className="size-3.5 shrink-0 text-slate-400 mt-0.5" />
                          <p className="text-slate-600 text-xs leading-relaxed max-w-xs">
                            {getFullAddress(order.shippingAddress)}
                          </p>
                        </div>
                      </td>

                      {/* Order Info */}
                      <td className="px-5 py-3">
                        <Link
                          to={`/admin/orders/${order._id}`}
                          className="font-mono text-xs font-semibold text-indigo-600 hover:underline inline-flex items-center gap-1.5"
                        >
                          <ShoppingBag className="size-3" />
                          {order.orderCode}
                        </Link>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-3 text-slate-600 text-sm">
                        {formatDate(order.createdAt)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-slate-200">
          <p className="text-sm text-slate-500">
            Trang {pagination.page} / {pagination.totalPages || 1} &nbsp;·&nbsp; {pagination.total}{" "}
            lượt mua
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="h-9 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
            >
              Trước
            </button>
            <button
              disabled={page >= pagination.totalPages || loading}
              onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages || p + 1))}
              className="h-9 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, bg }) => (
  <div className={`${bg} rounded-xl p-4 flex items-center gap-3 border border-white/60`}>
    <div className="flex-shrink-0">{icon}</div>
    <div>
      <p className="text-xs text-slate-500 mb-0.5">{label}</p>
      <p className="text-xl font-bold text-slate-900">{value}</p>
    </div>
  </div>
);

export default AdminCustomers;
