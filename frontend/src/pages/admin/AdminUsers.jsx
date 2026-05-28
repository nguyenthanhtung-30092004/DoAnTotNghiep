import {
  Loader2,
  Search,
  Shield,
  ShieldOff,
  Trash2,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import userService from "../../services/user.service";

// ─── Helpers ────────────────────────────────────────────────────────────────

const getResponseData = (res) =>
  res.data?.metadata || res.data?.data || res.data;

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

// ─── Confirm Dialog ──────────────────────────────────────────────────────────

const ConfirmDialog = ({ open, title, description, onConfirm, onCancel, danger = false }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in fade-in zoom-in-95">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="size-5" />
          </button>
        </div>
        <p className="text-sm text-slate-600 mb-6">{description}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
              danger
                ? "bg-red-600 hover:bg-red-700"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── User Detail Modal ───────────────────────────────────────────────────────

const UserDetailModal = ({ user, currentUserId, onClose, onRoleUpdated }) => {
  const [updating, setUpdating] = useState(false);
  const isCurrentUser = user?._id === currentUserId;
  const isAdmin = user?.role === "admin";

  const handleToggleRole = async () => {
    const newRole = isAdmin ? "customer" : "admin";
    try {
      setUpdating(true);
      const res = await userService.updateUserRole(user._id, newRole);
      const updated = getResponseData(res);
      toast.success(`Đã cập nhật quyền thành ${newRole === "admin" ? "Admin" : "Khách hàng"}`);
      onRoleUpdated(updated);
    } catch (err) {
      toast.error(err.response?.data?.message || "Cập nhật quyền thất bại");
    } finally {
      setUpdating(false);
    }
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <h3 className="text-base font-semibold text-slate-900">Chi tiết người dùng</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="size-5" />
          </button>
        </div>

        {/* Avatar + Name */}
        <div className="flex flex-col items-center text-center mb-6">
          <div
            className={`h-16 w-16 rounded-full bg-gradient-to-br ${getAvatarColor(user._id)} flex items-center justify-center text-white font-bold text-xl mb-3 shadow-md`}
          >
            {getInitials(user.fullName)}
          </div>
          <h4 className="font-semibold text-lg text-slate-900 flex items-center gap-2">
            {user.fullName}
            {isCurrentUser && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 font-semibold">
                BẠN
              </span>
            )}
          </h4>
          <p className="text-sm text-slate-500">{user.email}</p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs text-slate-500 mb-1">Vai trò</p>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                isAdmin
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              {isAdmin ? <Shield className="size-3" /> : <UserCheck className="size-3" />}
              {isAdmin ? "Admin" : "Khách hàng"}
            </span>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs text-slate-500 mb-1">Tham gia</p>
            <p className="text-sm font-medium text-slate-900">{formatDate(user.createdAt)}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 col-span-2">
            <p className="text-xs text-slate-500 mb-1">ID người dùng</p>
            <p className="text-xs font-mono text-slate-600 break-all">{user._id}</p>
          </div>
        </div>

        {/* Actions */}
        {!isCurrentUser && (
          <button
            onClick={handleToggleRole}
            disabled={updating}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isAdmin
                ? "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200"
            } disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {updating ? (
              <Loader2 className="size-4 animate-spin" />
            ) : isAdmin ? (
              <ShieldOff className="size-4" />
            ) : (
              <Shield className="size-4" />
            )}
            {updating
              ? "Đang cập nhật..."
              : isAdmin
              ? "Hạ xuống Khách hàng"
              : "Nâng lên Admin"}
          </button>
        )}
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────

const AdminUsers = () => {
  const currentUser = useSelector((state) => state.auth.user);

  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);

  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const debounceRef = useRef(null);

  // ─── Fetch ─────────────────────────────────────────────────────────────────

  const fetchUsers = async ({ p = page, kw = keyword, r = role } = {}) => {
    try {
      setLoading(true);
      const res = await userService.getAllUsers({ page: p, limit: 10, keyword: kw, role: r });
      const data = getResponseData(res);
      setUsers(data?.users || []);
      setPagination(
        data?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 }
      );
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Lấy danh sách người dùng thất bại");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers({ p: page, kw: keyword, r: role });
  }, [page, role]);

  const handleKeywordChange = (e) => {
    const val = e.target.value;
    setKeyword(val);
    setPage(1);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchUsers({ p: 1, kw: val, r: role });
    }, 450);
  };

  const handleRoleFilter = (e) => {
    setRole(e.target.value);
    setPage(1);
  };

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleRoleUpdated = (updatedUser) => {
    setUsers((prev) =>
      prev.map((u) => (u._id === updatedUser._id ? updatedUser : u))
    );
    setSelectedUser(updatedUser);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await userService.deleteUser(deleteTarget._id);
      toast.success("Đã xóa người dùng thành công");
      setUsers((prev) => prev.filter((u) => u._id !== deleteTarget._id));
      setPagination((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Xóa người dùng thất bại");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  // ─── Derived ───────────────────────────────────────────────────────────────

  const counts = useMemo(
    () => ({
      total: pagination.total,
      admins: users.filter((u) => u.role === "admin").length,
      customers: users.filter((u) => u.role === "customer").length,
    }),
    [users, pagination.total]
  );

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Người dùng</h1>
          <p className="text-sm text-slate-500 mt-1">
            {loading ? "Đang tải..." : `${pagination.total} tài khoản`}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          icon={<Users className="size-5 text-indigo-600" />}
          label="Tổng tài khoản"
          value={loading ? "–" : pagination.total}
          bg="bg-indigo-50"
        />
        <StatCard
          icon={<Shield className="size-5 text-violet-600" />}
          label="Quản trị viên"
          value={loading ? "–" : counts.admins}
          bg="bg-violet-50"
        />
        <StatCard
          icon={<UserCheck className="size-5 text-emerald-600" />}
          label="Khách hàng"
          value={loading ? "–" : counts.customers}
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
              id="user-search"
              type="text"
              value={keyword}
              onChange={handleKeywordChange}
              className="flex h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
              placeholder="Tìm theo tên hoặc email..."
            />
          </div>

          <select
            id="user-role-filter"
            value={role}
            onChange={handleRoleFilter}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
          >
            <option value="">Tất cả vai trò</option>
            <option value="admin">Admin</option>
            <option value="customer">Khách hàng</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-left">
              <tr>
                <th className="px-5 py-3 font-semibold text-slate-700">Người dùng</th>
                <th className="px-5 py-3 font-semibold text-slate-700">Vai trò</th>
                <th className="px-5 py-3 font-semibold text-slate-700">Tham gia</th>
                <th className="px-5 py-3 font-semibold text-slate-700 text-right">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                      <Loader2 className="size-4 animate-spin" />
                      Đang tải người dùng...
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-sm text-slate-500">
                    Không tìm thấy người dùng nào
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const isCurrentUser =
                    currentUser?._id === user._id ||
                    currentUser?.id === user._id;
                  const isAdmin = user.role === "admin";

                  return (
                    <tr
                      key={user._id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      {/* User Info */}
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-9 w-9 rounded-full bg-gradient-to-br ${getAvatarColor(user._id)} flex items-center justify-center text-white font-semibold text-sm shrink-0 shadow-sm`}
                          >
                            {getInitials(user.fullName)}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 flex items-center gap-2">
                              {user.fullName}
                              {isCurrentUser && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 font-semibold">
                                  BẠN
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            isAdmin
                              ? "bg-indigo-100 text-indigo-700"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {isAdmin ? <Shield className="size-3" /> : <UserCheck className="size-3" />}
                          {isAdmin ? "Admin" : "Khách hàng"}
                        </span>
                      </td>

                      {/* Joined */}
                      <td className="px-5 py-3 text-slate-600 text-sm">
                        {formatDate(user.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {/* View Detail */}
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                            title="Xem chi tiết & phân quyền"
                          >
                            <Shield className="size-4" />
                          </button>

                          {/* Delete */}
                          {!isCurrentUser && !isAdmin && (
                            <button
                              onClick={() => setDeleteTarget(user)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                              title="Xóa người dùng"
                            >
                              <Trash2 className="size-4" />
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

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-slate-200">
          <p className="text-sm text-slate-500">
            Trang {pagination.page} / {pagination.totalPages || 1} &nbsp;·&nbsp;{" "}
            {pagination.total} người dùng
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

      {/* User Detail Modal */}
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          currentUserId={currentUser?._id || currentUser?.id}
          onClose={() => setSelectedUser(null)}
          onRoleUpdated={handleRoleUpdated}
        />
      )}

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Xóa người dùng"
        description={
          deleteTarget
            ? `Bạn có chắc chắn muốn xóa tài khoản "${deleteTarget.fullName}" (${deleteTarget.email})? Hành động này không thể hoàn tác.`
            : ""
        }
        danger
        onConfirm={deleting ? undefined : handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

// ─── Stat Card ───────────────────────────────────────────────────────────────

const StatCard = ({ icon, label, value, bg }) => (
  <div className={`${bg} rounded-xl p-4 flex items-center gap-3 border border-white/60`}>
    <div className="flex-shrink-0">{icon}</div>
    <div>
      <p className="text-xs text-slate-500 mb-0.5">{label}</p>
      <p className="text-xl font-bold text-slate-900">{value}</p>
    </div>
  </div>
);

export default AdminUsers;
