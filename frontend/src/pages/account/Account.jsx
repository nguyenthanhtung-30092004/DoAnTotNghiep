import React from "react";
import {
  Briefcase,
  Calendar,
  ChevronRight,
  CircleCheck,
  Clock,
  House,
  LogOut,
  Mail,
  MapPin,
  Package,
  Pen,
  Phone,
  Plus,
  Trash,
  Truck,
  User,
} from "lucide-react";
import Profile from "../../components/account/Profile";
import Orders from "../../components/account/Orders";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { clearUser, setAuthLoading } from "../../redux/slices/authSlice";
import { toast } from "react-toastify";
import authService from "../../services/auth.service";

const Account = () => {
  const { user } = useSelector((state) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "profile";

  const setActiveTab = (tab) => {
    setSearchParams({ tab });
  };

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
    <div>
      <div className="container py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-zinc-950 mb-8">
          Tài khoản của tôi
        </h1>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:sticky md:top-24 md:w-64 shrink-0 self-start">
            <div className="border border-zinc-200 bg-white p-6">
              {/* User */}
              <div className="flex items-center gap-4 mb-6">
                <div className="size-12 bg-zinc-50 border border-zinc-200 flex items-center justify-center shrink-0">
                  <User className="size-5 text-zinc-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-black uppercase tracking-widest text-zinc-950 truncate">
                    {user?.fullName || user?.name || "Người dùng"}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 truncate mt-1">
                    {user?.email || "Chưa có email"}
                  </p>
                </div>
              </div>

              {/* Gạch chân */}
              <div className="h-px bg-zinc-200 mb-6"></div>

              {/* Menu */}
              <nav className="flex flex-grow md:flex-col gap-2 overflow-x-auto md:overflow-visible">
                <button
                  className={`flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-[0.15em] transition-colors whitespace-nowrap w-full ${
                    activeTab === "profile"
                      ? "bg-zinc-950 text-white"
                      : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-950 border border-transparent hover:border-zinc-200"
                  }`}
                  onClick={() => setActiveTab("profile")}
                >
                  <User className="size-4 shrink-0" />
                  <span>Thông tin</span>
                </button>

                <button
                  onClick={() => setActiveTab("orders")}
                  className={`flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-[0.15em] transition-colors whitespace-nowrap w-full ${
                    activeTab === "orders"
                      ? "bg-zinc-950 text-white"
                      : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-950 border border-transparent hover:border-zinc-200"
                  }`}
                >
                  <Package className="size-4 shrink-0" />
                  <span>Đơn hàng</span>
                </button>
              </nav>

              {/* Gạch chân 2 */}
              <div className="h-px bg-zinc-200 my-6 hidden md:block"></div>

              <button
                onClick={handleLogout}
                className="hidden md:flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-[0.15em] text-red-500 hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-100 transition-colors w-full"
              >
                <LogOut className="size-4 shrink-0" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {activeTab === "profile" ? (
              <Profile user={user} />
            ) : (
              <Orders />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
