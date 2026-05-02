import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Footprints, Lock, Eye, EyeOff, Hash, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Label } from "../components/ui/Label";
import { Input } from "../components/ui/Input";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword, verifyOtp } from "../redux/feature/authSlice";
// Import các action từ authSlice của bạn

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // THIẾU DÒNG NÀY dẫn đến hàm handleSubmit bị lỗi
  const [searchParams] = useSearchParams();
  const { isLoading } = useSelector((state) => state.auth);

  // Lấy email trực tiếp từ URL param
  const emailFromUrl = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailFromUrl);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Cập nhật email nếu URL thay đổi hoặc lúc component mount
  useEffect(() => {
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }
  }, [emailFromUrl]);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Validate căn bản
    if (!email) {
      toast.error("Không tìm thấy thông tin email xác thực!");
      return;
    }

    if (otp.length < 4) {
      toast.error("Vui lòng nhập mã OTP hợp lệ");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      // 1. Verify OTP - Phải unwrap để bắt lỗi vào block catch
      await dispatch(verifyOtp({ email, otp })).unwrap();

      // 2. Reset password
      // Truyền email đi cùng nếu Backend yêu cầu xác định user
      await dispatch(resetPassword({ newPassword: password })).unwrap();

      toast.success("Cập nhật mật khẩu thành công! Đang chuyển hướng...");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      // Error ở đây thường là message từ rejectWithValue trong Slice
      toast.error(error || "Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <Footprints className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-foreground">RunVault</span>
        </Link>

        <div className="rounded-3xl border border-border bg-card p-8 shadow-lg">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              Đặt lại mật khẩu
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Đang xác thực cho:{" "}
              <span className="font-medium text-primary">{email}</span>
            </p>
          </div>

          <form className="space-y-5">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Mã xác nhận (OTP)
              </Label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Nhập mã OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="pl-10 rounded-xl h-11 bg-muted/50 border-0 focus-visible:ring-primary"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Mật khẩu mới
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 rounded-xl h-11 bg-muted/50 border-0 focus-visible:ring-primary"
                  required
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

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Xác nhận mật khẩu
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10 rounded-xl h-11 bg-muted/50 border-0 focus-visible:ring-primary"
                  required
                />
              </div>
            </div>

            <Button
              type="button"
              onClick={handleResetPassword}
              disabled={isLoading}
              className="w-full rounded-xl h-11 text-sm font-semibold mt-2"
            >
              {isLoading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
            </Button>
          </form>
        </div>

        <Link
          to="/login"
          className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-6 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại đăng nhập
        </Link>
      </div>
    </div>
  );
};

export default ResetPassword;
