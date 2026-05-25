import { ArrowLeft, ArrowRight, Footprints, Mail } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Label } from "../../components/ui/Label";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { setAuthLoading } from "../../redux/slices/authSlice";
import { toast } from "react-toastify";
import authService from "../../services/auth.service";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Check rỗng
    if (!email) {
      toast.warning("Vui lòng nhập email!");
      return;
    }

    // 2. Validate email
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      toast.error("Email không hợp lệ!");
      return;
    }

    try {
      dispatch(setAuthLoading(true));

      const res = await authService.forgotPassword({ email });
      toast.success(res.data?.message || "Đã gửi email");

      navigate(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (error) {
      const message = error.response?.data?.message;
      toast.error(message || "Gửi email thất bại");
    } finally {
      dispatch(setAuthLoading(false));
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
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              Quên mật khẩu?
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Nhập email của bạn để nhận mã xác nhận khôi phục mật khẩu.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="vidu@runvault.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 rounded-xl h-11 bg-muted/50 border-0 focus-visible:ring-primary"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl h-11 text-sm font-semibold gap-2"
            >
              {isLoading ? "Đang gửi..." : "Gửi mã xác nhận"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </div>

        <Link
          to="/login"
          className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-6 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại trang đăng nhập
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
