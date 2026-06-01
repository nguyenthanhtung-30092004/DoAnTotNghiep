import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Footprints, Eye, EyeOff, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Label } from "../../components/ui/Label";
import { Input } from "../../components/ui/Input";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setAuthLoading } from "../../redux/slices/authSlice";
import authService from "../../services/auth.service";
import loginBg from "../../assets/login-bg.png";

const otpRegex = /^\d{6}$/;

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isLoading } = useSelector((state) => state.auth);

  const emailFromUrl = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailFromUrl);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }
  }, [emailFromUrl]);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Không tìm thấy thông tin email xác thực!");
      return;
    }

    if (!otpRegex.test(otp.trim())) {
      toast.error("Mã OTP phải gồm 6 chữ số");
      return;
    }

    if (password.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      dispatch(setAuthLoading(true));

      await authService.verifyOtp({ email, otp: otp.trim() });

      const res = await authService.resetPassword({ newPassword: password });

      toast.success(
        res.data?.message || "Cập nhật mật khẩu thành công! Đang chuyển hướng...",
      );

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      const message = error.response?.data?.message;
      toast.error(message || "Có lỗi xảy ra, vui lòng thử lại");
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
            Bảo mật hàng đầu.
          </h2>
          <p className="text-zinc-400 text-lg">
            Khôi phục quyền truy cập vào tài khoản của bạn một cách nhanh chóng và an toàn.
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
            <h1 className="text-3xl font-semibold tracking-tight mb-3">Đặt lại mật khẩu</h1>
            <p className="text-muted-foreground text-sm">
              Đang xác thực cho: <span className="font-medium text-foreground">{email}</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-sm font-medium">Mã xác nhận (OTP)</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Nhập 6 số OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="h-12 bg-transparent border-zinc-200 dark:border-zinc-800 focus-visible:ring-1 focus-visible:ring-foreground rounded-none tracking-widest"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Mật khẩu mới</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 bg-transparent border-zinc-200 dark:border-zinc-800 focus-visible:ring-1 focus-visible:ring-foreground rounded-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">Xác nhận mật khẩu</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12 bg-transparent border-zinc-200 dark:border-zinc-800 focus-visible:ring-1 focus-visible:ring-foreground rounded-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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
              className="w-full h-12 rounded-none bg-foreground text-background hover:bg-foreground/90 font-medium tracking-wide mt-4"
            >
              {isLoading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
