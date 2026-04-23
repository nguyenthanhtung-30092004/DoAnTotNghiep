import React from "react";
import Header from "../components/Headers/Header";
import {
  LockKeyhole,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  Truck,
} from "lucide-react";

const Cart = () => {
  return (
    <div>
      <Header />

      {/* Header */}
      <div className="px-8 py-10 bg-accent">
        <div className="container">
          <h1 className="text-3xl font-bold">Giỏ hàng</h1>
          <p>4 sản phẩm trong giỏ</p>
        </div>
      </div>

      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Danh sách sản phẩm */}
          <div className="flex-1 min-w-0">
            <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto] gap-4 pb-3 border-b border-border mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Sản phẩm</span>
              <span className="w-28 text-center">Số lượng</span>
              <span className="w-20 text-right">Giá</span>
              <span className="w-10"></span>
            </div>

            <div className="divide-y divide-border">
              {/* Item */}
              {[1, 2, 3].map((_, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto] gap-4 py-5 items-center"
                >
                  <div className="flex items-center gap-4">
                    <a
                      href="/product/1"
                      className="shrink-0 size-20 rounded-xl bg-accent flex items-center justify-center text-3xl hover:shadow-card-hover transition-shadow"
                    >
                      🔥
                    </a>

                    <div className="min-w-0">
                      <p className="text-[12px] font-medium uppercase tracking-wide text-muted-foreground">
                        WeloMax
                      </p>

                      <a
                        className="font-semibold text-sm hover:text-primary transition-colors line-clamp-1"
                        href="/product/1"
                      >
                        Giày chạy bộ VelocityMax
                      </a>

                      <p className="text-xs text-muted-foreground mt-0.5">
                        Kích thước: 10
                      </p>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center sm:justify-center">
                    <div className="inline-flex items-center justify-center border border-border rounded-xl">
                      <button className="size-9 flex items-center justify-center hover:bg-muted rounded-l-xl transition-colors active:scale-95">
                        <Minus />
                      </button>

                      <span className="w-10 text-center text-sm font-semibold tabular-nums">
                        1
                      </span>

                      <button className="size-9 flex items-center justify-center hover:bg-muted rounded-r-xl transition-colors active:scale-95">
                        <Plus />
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="w-20 text-right">
                    <p className="font-bold tabular-nums">399.000đ</p>
                  </div>

                  {/* Remove */}
                  <div>
                    <button className="size-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors active:scale-95">
                      <Trash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue shopping */}
            <div className="mt-6">
              <a
                href="/shop"
                className="inline-flex items-center justify-center whitespace-nowrap font-semibold text-white bg-primary hover:bg-primary/90 py-2 rounded-lg transition-colors w-full mt-5 px-10 h-14 gap-2"
              >
                <ShoppingCart className="size-5" />
                Tiếp tục mua sắm
              </a>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-96 shrink-0">
            <div className="bg-card rounded-2xl shadow-card p-6 lg:sticky lg:top-24">
              <h2 className="text-lg font-bold mb-5">Tóm tắt đơn hàng</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Tạm tính (4 sản phẩm)
                  </span>
                  <span className="font-medium tabular-nums">1.200.000đ</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phí vận chuyển</span>
                  <span className="font-medium text-primary">Miễn phí</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Thuế</span>
                  <span className="font-medium tabular-nums">96.000đ</span>
                </div>

                <div className="border-t border-border pt-3 mt-3">
                  <div className="flex justify-between font-bold">
                    <span>Tổng cộng</span>
                    <span className="tabular-nums">1.296.000đ</span>
                  </div>
                </div>
              </div>

              {/* Promo */}
              <div className="mt-5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nhập mã giảm giá"
                    className="flex-1 h-10 rounded-xl border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary transition-shadow"
                  />

                  <button className="inline-flex items-center justify-center rounded-lg text-sm font-semibold border border-input bg-background hover:bg-accent h-10 px-5">
                    Áp dụng
                  </button>
                </div>
              </div>

              {/* Checkout */}
              <a
                href="/checkout"
                className="inline-flex items-center justify-center whitespace-nowrap font-semibold text-white bg-primary hover:bg-primary/90 py-2 rounded-lg transition-colors w-full mt-5 px-10 h-14 gap-2"
              >
                <LockKeyhole className="size-5" />
                Thanh toán
              </a>

              {/* Shipping note */}
              <div className="flex items-center gap-2 mt-4 p-3 rounded-xl bg-accent text-xs">
                <Truck className="size-4 text-primary shrink-0" />
                <span className="text-primary font-medium">
                  Bạn đã được miễn phí vận chuyển 🎉
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
