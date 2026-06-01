import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Footprints, ArrowRight } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Label } from "../../components/ui/Label";
import { Input } from "../../components/ui/Input";
import { useDispatch, useSelector } from "react-redux";
import { setAuthLoading, setUser } from "../../redux/slices/authSlice";
import { toast } from "react-toastify";
import { setCart } from "../../redux/slices/cartSlice";
import cartService from "../../services/cart.service";
import authService from "../../services/auth.service";
import loginBg from "../../assets/login-bg.png";

const emailRegex = /^\S+@\S+\.\S+$/;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { isLoading } = useSelector((state) => state.auth);
  const guestCartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get("redirect") || "/";

  const syncCartAfterLogin = async () => {
    try {
      if (guestCartItems.length > 0) {
        await cartService.syncCart({
          items: guestCartItems,
        });
      }

      const res = await cartService.getCart();
      const data = res;

      dispatch(setCart(data));
    } catch (error) {
      console.log(error);
      toast.warning("Đăng nhập thành công, nhưng đồng bộ giỏ hàng chưa hoàn tất");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.warning("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (!emailRegex.test(email.trim())) {
      toast.warning("Email không hợp lệ");
      return;
    }

    try {
      dispatch(setAuthLoading(true));

      const res = await authService.login({ email: email.trim(), password });
      const userData = res;

      dispatch(setUser(userData));
      toast.success("Đăng nhập thành công");

      if (userData?.role === "admin") {
        navigate("/admin", { replace: true });
        return;
      }

      await syncCartAfterLogin();
      navigate(redirect, { replace: true });
    } catch (error) {
      const message = error.response?.data?.message;
      toast.error(message || "Đăng nhập thất bại");
    } finally {
      dispatch(setAuthLoading(false));
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left side - Image */}
      <div className="hidden lg:block relative w-full h-full bg-zinc-950">
        <img
          src={loginBg}
          alt="Athlete running at dawn"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent" />
        <div className="absolute bottom-12 left-12 max-w-md">
          <h2 className="text-4xl text-white font-medium tracking-tight mb-4">
            Bứt phá giới hạn.
          </h2>
          <p className="text-zinc-400 text-lg">
            Tham gia cộng đồng các vận động viên tin dùng đồ chạy bộ cao cấp từ RunVault.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12">
        <div className="w-full max-w-[400px] mx-auto">
          {/* Header */}
          <div className="mb-12">
            <Link to="/" className="inline-flex items-center gap-2 mb-8 text-foreground hover:opacity-80 transition-opacity">
              <Footprints className="h-6 w-6" />
              <span className="text-xl font-semibold tracking-tight">RunVault</span>
            </Link>
            <h1 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter text-zinc-950 mb-3">Đăng nhập</h1>
            <p className="text-sm font-bold text-zinc-500">
              Nhập email và mật khẩu của bạn để truy cập tài khoản.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="block text-[11px] font-black uppercase tracking-[0.15em] text-zinc-500 mb-2">Địa chỉ email</Label>
              <Input
                id="email"
                type="email"
                placeholder="vidu@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-zinc-50 border-zinc-200 focus-visible:ring-1 focus-visible:ring-teal-600 focus-visible:border-teal-600 focus-visible:bg-white rounded-none"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="password" className="block text-[11px] font-black uppercase tracking-[0.15em] text-zinc-500">Mật khẩu</Label>
                <Link
                  to="/forgot-password"
                  className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 hover:text-teal-600 transition-colors"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 bg-zinc-50 border-zinc-200 focus-visible:ring-1 focus-visible:ring-teal-600 focus-visible:border-teal-600 focus-visible:bg-white rounded-none"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 rounded-none bg-zinc-950 text-white hover:bg-teal-600 text-xs font-black uppercase tracking-[0.15em] mt-4"
            >
              {isLoading ? "Đang xử lý..." : "Đăng nhập"}
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-center">
            <p className="text-sm text-muted-foreground">
              Bạn chưa có tài khoản?{" "}
              <Link
                to="/signup"
                className="font-medium text-foreground hover:underline underline-offset-4"
              >
                Tạo tài khoản mới
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
