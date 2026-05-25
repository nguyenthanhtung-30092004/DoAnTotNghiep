import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Footprints, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Label } from "../../components/ui/Label";
import { Input } from "../../components/ui/Input";
import { useDispatch, useSelector } from "react-redux";
import { setAuthLoading, setUser } from "../../redux/slices/authSlice";
import { toast } from "react-toastify";
import google_icon from "../../assets/icon-google.png";
import { setCart } from "../../redux/slices/cartSlice";
import cartService from "../../services/cart.service";
import authService from "../../services/auth.service";

const emailRegex = /^\S+@\S+\.\S+$/;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
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
      const data = res.data?.metadata || res.data?.data || res.data;

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
      const userData = res.data?.metadata || res.data?.data || res.data;

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
    <div className="max-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[450px] h-[450px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[450px] h-[450px] rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="w-full max-w-xl relative z-10">
        <Link to="/" className="flex items-center justify-center gap-2 mb-10">
          <Footprints className="h-9 w-9 text-primary" />
          <span className="text-3xl font-semibold tracking-tight">
            RunVault
          </span>
        </Link>

        <div className="rounded-3xl border bg-card p-10 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold">Chào mừng trở lại</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Đăng nhập vào tài khoản của bạn để tiếp tục
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 mb-6">
            <Button
              variant="outline"
              className="h-12 w-full rounded-xl text-sm font-medium"
            >
              <div className="size-[30px] flex items-center justify-center overflow-hidden">
                <img
                  src={google_icon}
                  alt="Google"
                  className="block w-[70px] h-[70px] object-cover"
                />
              </div>
              Google
            </Button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-3 text-muted-foreground">
                Hoặc tiếp tục với email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="vidu@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 rounded-xl bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Mật khẩu</Label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 rounded-xl bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-full text-sm font-semibold mt-2 gap-2"
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              {!isLoading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Bạn chưa có tài khoản?{" "}
          <Link
            to="/signup"
            className="font-semibold text-primary hover:underline"
          >
            Tạo tài khoản mới
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
