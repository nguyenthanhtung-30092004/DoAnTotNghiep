import React, { useState } from "react";
import Header from "../components/Headers/Header";
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
import Profile from "../components/Account/Profile";
import Orders from "../components/Account/Orders";
import Address from "../components/Account/Address";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { clearUser, setAuthLoading } from "../redux/feature/authSlice";
import { toast } from "react-toastify";
import authService from "../services/auth.service";

const Account = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("profile");
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
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
          Tài khoản của tôi
        </h1>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:sticky md:top-24 md:w-64 shrink-0 self-start">
            <div className="rounded-2xl border border-border bg-card p-2">
              {/* User */}
              <div className="flex items-center gap-3 p-3 mb-1">
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="size-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {user?.fullName || user?.name || "Người dùng"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user?.email || "Chưa có email"}
                  </p>
                </div>
              </div>

              {/* Gạch chân */}
              <div className="h-px bg-border mx-2 mb-1"></div>

              {/* Menu */}
              <nav className="flex flex-grow md:flex-col gap-0.5 overflow-x-auto md:overflow-visible">
                <button
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors whitespace-normal w-full ${
                    activeTab === "profile"
                      ? "text-white bg-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                  onClick={() => setActiveTab("profile")}
                >
                  <User className="size-4" />
                  <span>Thông tin</span>
                </button>

                <button
                  onClick={() => setActiveTab("orders")}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors whitespace-normal w-full ${
                    activeTab === "orders"
                      ? "text-white bg-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <Package className="size-4" />
                  <span>Đơn hàng</span>
                </button>

                <button
                  onClick={() => setActiveTab("addresses")}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors whitespace-normal w-full ${
                    activeTab === "addresses"
                      ? "text-white bg-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <MapPin className="size-4" />
                  <span>Địa chỉ</span>
                </button>
              </nav>

              {/* Gạch chân 2 */}
              <div className="h-px bg-border mx-2 my-1 hidden md:block"></div>

              <button
                onClick={handleLogout}
                className="hidden md:flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full"
              >
                <LogOut className="size-4" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {activeTab === "profile" ? (
              <Profile user={user} />
            ) : activeTab === "orders" ? (
              <Orders />
            ) : (
              <Address user={user} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
