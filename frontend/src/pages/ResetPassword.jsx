import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Footprints,
  Lock,
  Eye,
  EyeOff,
  Hash,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Label } from "../components/ui/Label";
import { Input } from "../components/ui/Input";
import { toast } from "sonner"; // Hoặc react-toastify tùy dự án của bạn

const ResetPassword = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    if (otp.length < 4) {
      toast.warning("Vui lòng nhập mã xác nhận hợp lệ.");
      return;
    }

    // Giả lập xử lý API
    setSubmitted(true);
    toast.success("Đặt lại mật khẩu thành công!");

    // Tự động chuyển hướng sau 3 giây
    setTimeout(() => {
      navigate("/login");
    }, 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
      {/* Background hiệu ứng blur */}
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
          {!submitted ? (
            <>
              <div className="text-center mb-8">
                <div className="mx-auto mb-4 h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">
                  Đặt lại mật khẩu
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Vui lòng nhập mã OTP đã nhận và mật khẩu mới của bạn.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Mã xác nhận OTP */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Mã xác nhận (OTP)
                  </Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Nhập mã 6 chữ số"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="pl-10 rounded-xl h-11 bg-muted/50 border-0 focus-visible:ring-primary"
                      required
                    />
                  </div>
                </div>

                {/* Mật khẩu mới */}
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

                {/* Xác nhận mật khẩu */}
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
                  type="submit"
                  className="w-full rounded-xl h-11 text-sm font-semibold mt-2"
                >
                  Cập nhật mật khẩu
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-7 w-7 text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">
                Thành công!
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Mật khẩu của bạn đã được cập nhật. Hệ thống sẽ tự động chuyển về
                trang đăng nhập.
              </p>
              <Link to="/login">
                <Button className="w-full rounded-xl h-11 text-sm font-semibold">
                  Đăng nhập ngay
                </Button>
              </Link>
            </div>
          )}
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
