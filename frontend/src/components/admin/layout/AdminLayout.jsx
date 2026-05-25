import {
  Bell,
  FileText,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Search,
  ShoppingCart,
  Star,
  Tags,
  Ticket,
  Users,
  X,
} from "lucide-react";
import React from "react";
import { useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router";
import { clearUser, setAuthLoading } from "../../../redux/slices/authSlice";
import { toast } from "react-toastify";
import authService from "../../../services/auth.service";

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      dispatch(setAuthLoading(true));
      await authService.logout();
      dispatch(clearUser());
      toast.info("Đã đăng xuất");
      navigate("/login");
    } catch (error) {
      const message = error.response?.data?.message;
      toast.error(message || "Đăng xuất thất bại");
    } finally {
      dispatch(setAuthLoading(false));
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 -translate-x-full lg:translate-x-0">
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
              T
            </div>
            <span className="font-bold text-slate-900">RunVault</span>
            <span className="text-xs px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 font-semibold">
              ADMIN
            </span>
          </div>
          <button className="lg:hidden text-slate-500">
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {/* Thống kê */}
          <a
            href="/admin"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors bg-indigo-50 text-indigo-700"
          >
            <LayoutDashboard className="size-4 shrink-0" />
            <span>Thống kê</span>
          </a>

          {/* Quản lý sản phẩm */}
          <a
            href="/admin/products"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            <Package className="size-4 shrink-0" />
            <span>Quản lý sản phẩm</span>
          </a>

          {/* Quản lý danh mục */}
          <a
            href="/admin/categories"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            <FolderTree className="size-4 shrink-0" />
            <span>Quản lý danh mục</span>
          </a>
          {/* Quản lý thương hiệu */}
          <a
            href="/admin/brands"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            <Tags className="size-4 shrink-0" />
            <span>Quản lý thương hiệu</span>
          </a>

          {/* Quản lý đơn hàng */}
          <a
            href="/admin/orders"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            <ShoppingCart className="size-4 shrink-0" />
            <span>Quản lý đơn hàng</span>
          </a>

          {/* Quản lý người dùng */}
          <a
            href="/admin/users"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            <Users className="size-4 shrink-0" />
            <span>Quản lý người dùng</span>
          </a>

          {/* Quản lý mã giảm giá */}
          <a
            href="/admin/coupons"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            <Ticket className="size-4 shrink-0" />
            <span>Quản lý mã giảm giá</span>
          </a>

          {/* Quản lý bài viết */}
          <a
            href="/admin/posts"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            <FileText className="size-4 shrink-0" />
            <span>Quản lý bài viết</span>
          </a>

          {/* Quản lý đánh giá */}
          <a
            href="/admin/reviews"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            <Star className="size-4 shrink-0" />
            <span>Quản lý đánh giá</span>
          </a>
        </nav>

        <div className="p-3 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="size-4" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {/* Header */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20">
          <div className="flex items-center gap-3 flex-1">
            <button className="lg:hidden text-slate-600">
              <Menu className="size-5" />
            </button>

            <div className="hidden sm:flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2 max-w-md flex-1">
              <Search className="size-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="bg-transparent text-sm outline-none flex-1 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative size-9 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600">
              <Bell className="size-5" />
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-500"></span>
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="size-9 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-semibold text-sm">
                AD
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-slate-900 leading-tight">
                  Admin
                </p>
                <p className="text-xs text-slate-500 leading-tight">
                  admin@runvault.com
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Main */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
