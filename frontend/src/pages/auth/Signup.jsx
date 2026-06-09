import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Footprints, ArrowRight, Check } from "lucide-react";

import { toast } from "react-toastify";
import { Button } from "../../components/ui/Button";
import { Label } from "../../components/ui/Label";
import { Input } from "../../components/ui/Input";
import { useDispatch, useSelector } from "react-redux";
import { setAuthLoading, setUser } from "../../redux/slices/authSlice";
import authService from "../../services/auth.service";
import signupBg from "../../assets/signup-bg.png";

const passwordRules = [
  { label: "Ít nhất 6 ký tự", test: (p) => p.length >= 6 },
];

const emailRegex = /^\S+@\S+\.\S+$/;

const Signup = () => {
  // State quản lý Form
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !password) {
      toast.warning("Vui lòng nhập đầy đủ họ tên, email và mật khẩu");
      return;
    }

    if (!emailRegex.test(email.trim())) {
      toast.warning("Email không hợp lệ");
      return;
    }

    if (password.length < 6) {
      toast.warning("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (!agreed) {
      toast.warning("Vui lòng đồng ý với Điều khoản dịch vụ");
      return;
    }

    try {
      dispatch(setAuthLoading(true));

      const res = await authService.register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
      });
      const userData = res.user || res;

      dispatch(setUser(userData));
      toast.success("Đăng ký thành công");
      navigate(userData?.role === "admin" ? "/admin" : "/");
    } catch (error) {
      const message = error.response?.data?.message;
      toast.error(message || "Đăng ký thất bại");
    } finally {
      dispatch(setAuthLoading(false));
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left side - Form */}
      <div className="w-full flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 order-2 lg:order-1">
        <div className="w-full max-w-[400px] mx-auto">
          {/* Header */}
          <div className="mb-12">
            <Link to="/" className="inline-flex items-center gap-2 mb-8 text-foreground hover:opacity-80 transition-opacity">
              <Footprints className="h-6 w-6" />
              <span className="text-xl font-semibold tracking-tight">RunVault</span>
            </Link>
            <h1 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter text-zinc-950 mb-3">Tạo tài khoản</h1>
            <p className="text-sm font-bold text-zinc-500">
              Tham gia cùng RunVault và bắt đầu hành trình của bạn.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="block text-[11px] font-black uppercase tracking-[0.15em] text-zinc-500 mb-2">Họ và tên</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Nguyễn Văn A"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-12 bg-zinc-50 border-zinc-200 focus-visible:ring-1 focus-visible:ring-teal-600 focus-visible:border-teal-600 focus-visible:bg-white rounded-none"
              />
            </div>

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
              <Label htmlFor="password" className="block text-[11px] font-black uppercase tracking-[0.15em] text-zinc-500 mb-2">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 bg-zinc-50 border-zinc-200 focus-visible:ring-1 focus-visible:ring-teal-600 focus-visible:border-teal-600 focus-visible:bg-white rounded-none"
              />
              
              {/* Password strength */}
              {password.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  {passwordRules.map((rule) => (
                    <div
                      key={rule.label}
                      className="flex items-center gap-2 text-xs"
                    >
                      <Check
                        className={`h-3 w-3 ${
                          rule.test(password)
                            ? "text-foreground"
                            : "text-muted-foreground/40"
                        }`}
                      />
                      <span
                        className={
                          rule.test(password)
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }
                      >
                        {rule.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 pt-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 h-4 w-4 rounded-none border-zinc-300 text-foreground focus:ring-foreground cursor-pointer accent-foreground"
              />
              <label
                htmlFor="terms"
                className="text-sm text-muted-foreground leading-relaxed cursor-pointer select-none"
              >
                Tôi đồng ý với{" "}
                <Link to="/terms" className="text-foreground font-medium hover:underline">
                  Điều khoản dịch vụ
                </Link>{" "}
                và{" "}
                <Link to="/privacy" className="text-foreground font-medium hover:underline">
                  Chính sách bảo mật
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 rounded-none bg-zinc-950 text-white hover:bg-teal-600 text-xs font-black uppercase tracking-[0.15em] mt-4"
            >
              {isLoading ? "Đang xử lý..." : "Đăng ký"}
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-center">
            <p className="text-sm text-muted-foreground">
              Đã có tài khoản?{" "}
              <Link
                to="/login"
                className="font-medium text-foreground hover:underline underline-offset-4"
              >
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block relative w-full h-full bg-zinc-950 order-1 lg:order-2">
        <img
          src={signupBg}
          alt="Runner lacing up shoes"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent" />
        <div className="absolute bottom-12 right-12 max-w-md text-right">
          <h2 className="text-4xl text-white font-medium tracking-tight mb-4">
            Bắt đầu từ đôi chân.
          </h2>
          <p className="text-zinc-400 text-lg">
            Khám phá những thiết bị chạy bộ hàng đầu để chinh phục mọi mục tiêu của bạn.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
