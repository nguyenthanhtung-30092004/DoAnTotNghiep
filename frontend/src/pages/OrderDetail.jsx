import React from "react";
import Header from "../components/Headers/Header";
import {
  ArrowLeft,
  Check,
  Copy,
  House,
  MessageCircle,
  RotateCcw,
  Truck,
} from "lucide-react";

const OrderDetail = () => {
  return (
    <div>
      <Header />
      <main className="flex-1">
        <div className="container py-8 md:py-12 max-w-4xl">
          <a
            href="/account"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="size-4" />
            Quay lại tài khoản
          </a>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-foreground">
                  Đơn hàng RV-2026-1847
                </h1>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <Copy className="size-4" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground">
                Đặt ngày 18 Thg 3, 2026 · Dự kiến giao 24 Thg 3, 2026
              </p>
            </div>
            <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-purple-50 text-purple-600">
              Đang giao
            </span>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-sm font-semibold text-foreground mb-6">
              Tiến trình đơn hàng
            </h2>

            <div className="hidden sm:flex items-start justify-between relative">
              <div className="absolute top-5 left-[calc(12.5%)] right-[calc(12.5%)] h-0.5 bg-border"></div>
              <div
                className="absolute top-5 left-[calc(12.5%)] h-0.5 bg-primary transition-all duration-500"
                style={{ width: "50%" }}
              ></div>

              <div className="flex flex-col items-center relative z-10 w-1/4">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-300 bg-primary text-primary-foreground shadow-md shadow-primary/20">
                  <Check className="size-5" />
                </div>
                <p className="text-xs font-semibold mt-3 text-foreground">
                  Chờ xử lý
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  18 Thg 3, 10:24 AM
                </p>
              </div>

              <div className="flex flex-col items-center relative z-10 w-1/4">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-300 bg-primary text-primary-foreground shadow-md shadow-primary/20">
                  <Check className="size-5" />
                </div>
                <p className="text-xs font-semibold mt-3 text-foreground">
                  Đã xác nhận
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  18 Thg 3, 11:02 AM
                </p>
              </div>

              <div className="flex flex-col items-center relative z-10 w-1/4">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-300 bg-primary text-primary-foreground ring-4 ring-primary/20 shadow-md shadow-primary/20">
                  <Truck className="size-5" />
                </div>
                <p className="text-xs font-semibold mt-3 text-primary">
                  Đang giao
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  19 Thg 3, 2:15 PM
                </p>
              </div>

              <div className="flex flex-col items-center relative z-10 w-1/4">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-300 bg-muted text-muted-foreground">
                  <House className="size-5" />
                </div>
                <p className="text-xs font-semibold mt-3 text-muted-foreground">
                  Đã giao
                </p>
              </div>
            </div>

            <div className="sm:hidden space-y-0">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition-all bg-primary text-primary-foreground">
                    <Check className="size-4" />
                  </div>
                  <div className="w-0.5 flex-1 min-h-[28px] bg-primary"></div>
                </div>

                <div className="pb-6">
                  <p className="text-sm font-semibold text-foreground">
                    Chờ xử lý
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    18 Thg 3, 10:24 AM
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition-all bg-primary text-primary-foreground">
                    <Check className="size-4" />
                  </div>
                  <div className="w-0.5 flex-1 min-h-[28px] bg-primary"></div>
                </div>

                <div className="pb-6">
                  <p className="text-sm font-semibold text-foreground">
                    Đã xác nhận
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    18 Thg 3, 11:02 AM
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition-all bg-primary text-primary-foreground ring-4 ring-primary/20">
                    <Truck className="size-4" />
                  </div>
                  <div className="w-0.5 flex-1 min-h-[28px] bg-border"></div>
                </div>

                <div className="pb-6">
                  <p className="text-sm font-semibold text-primary">
                    Đang giao
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    19 Thg 3, 2:15 PM
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition-all bg-muted text-muted-foreground">
                    <House className="size-4" />
                  </div>
                </div>

                <div className="pb-0">
                  <p className="text-sm font-semibold text-muted-foreground">
                    Đã giao
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="text-sm font-semibold text-foreground mb-4">
                  Sản phẩm (2)
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="size-16 rounded-xl bg-muted flex items-center justify-center text-2xl shrink-0">
                      👟
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        UltraBoost Runner Pro
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Size: US 10 | SL: 1
                      </p>
                    </div>

                    <p className="text-sm font-bold text-foreground">$159.99</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="size-16 rounded-xl bg-muted flex items-center justify-center text-2xl shrink-0">
                      🧦
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        Tất thể thao (3 đôi)
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Size: M | SL: 1
                      </p>
                    </div>

                    <p className="text-sm font-bold text-foreground">$30.00</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="text-sm font-semibold text-foreground mb-4">
                  Thông tin giao hàng
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">
                      Khách hàng
                    </p>
                    <p className="text-sm text-foreground font-medium">
                      Alex Runner
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">
                      Số điện thoại
                    </p>
                    <p className="text-sm text-foreground font-medium">
                      +1 (555) 123-4567
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">
                      Địa chỉ
                    </p>
                    <p className="text-sm text-foreground font-medium">
                      123 Marathon Lane, Apt 4B, Portland, OR 97201
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">
                      Phương thức
                    </p>
                    <p className="text-sm text-foreground font-medium">
                      Giao hàng nhanh
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">
                      Mã vận đơn
                    </p>
                    <p className="text-sm text-foreground font-medium font-mono text-xs">
                      1Z999AA10123456784
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="text-sm font-semibold text-foreground mb-4">
                  Tóm tắt đơn hàng
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tạm tính</span>
                    <span>$189.99</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Phí vận chuyển</span>
                    <span className="text-primary font-medium">Miễn phí</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Thuế</span>
                    <span>$15.20</span>
                  </div>
                  <div className="h-px bg-border my-1"></div>
                  <div className="flex justify-between text-foreground font-bold text-base">
                    <span>Tổng cộng</span>
                    <span>$205.19</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
                <h2 className="text-sm font-semibold text-foreground mb-1">
                  Thao tác
                </h2>

                <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold ring-offset-background transition-all duration-200 border border-input bg-background hover:bg-accent hover:text-accent-foreground px-5 py-2 w-full rounded-xl gap-2 h-10">
                  <RotateCcw className="size-4" />
                  Đặt lại
                </button>

                <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold ring-offset-background transition-all duration-200 hover:bg-accent hover:text-accent-foreground px-5 py-2 w-full rounded-xl gap-2 h-10 text-muted-foreground">
                  <MessageCircle className="size-4" />
                  Liên hệ hỗ trợ
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderDetail;
