import { ArrowLeft, ArrowRight, Footprints } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Label } from "../../components/ui/Label";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { setAuthLoading } from "../../redux/slices/authSlice";
import { toast } from "react-toastify";
import authService from "../../services/auth.service";
import loginBg from "../../assets/login-bg.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.warning("Vui lòng nhập email!");
      return;
    }

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
            Đừng lo lắng.
          </h2>
          <p className="text-zinc-400 text-lg">
            Chúng tôi sẽ giúp bạn lấy lại quyền truy cập vào tài khoản để tiếp tục hành trình.
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
            <h1 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter text-zinc-950 mb-3">Quên mật khẩu?</h1>
            <p className="text-sm font-bold text-zinc-500">
              Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
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

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 rounded-none bg-zinc-950 text-white hover:bg-teal-600 text-xs font-black uppercase tracking-[0.15em] mt-4"
            >
              {isLoading ? "Đang gửi..." : "Gửi liên kết khôi phục"}
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 hover:text-zinc-950 transition-colors"
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

export default ForgotPassword;
