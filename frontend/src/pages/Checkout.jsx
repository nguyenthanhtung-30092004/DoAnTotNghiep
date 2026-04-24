import {
  Check,
  ChevronRight,
  CreditCard,
  Dot,
  LockKeyhole,
  RotateCcw,
  Shield,
} from "lucide-react";
import React, { useState } from "react";

const Checkout = () => {
  const [status, setStatus] = useState(1);
  const setPlusStatus = (newStatus) => {
    setStatus(newStatus);
  };
  console.log(status);
  return (
    <div className="min-h-screen bg-background-soft">
      {/* Header */}
      <div className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="container flex py-5 items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-2 font-bold text-lg tracking-tight"
          >
            <Dot className="text-primary size-[30px]" />
            RunVault
          </a>
          <a
            href="/cart"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Back to Cart
          </a>
        </div>
      </div>

      {/* Main */}
      <div className="container max-w-5xl py-8 ">
        <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
          <a href="/cart" className="hover:text-foreground transition-colors">
            Cart
          </a>
          <ChevronRight className="size-4" />
          <span className="text-foreground font-medium">Checkout</span>
        </nav>

        <div className="flex items-center gap-0 justify-center">
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 bg-primary text-primary-foreground shadow-soft">
                {status > 1 ? <Check className="size-4" /> : 1}
              </div>
              <span
                className="
            text-sm font-medium hidden sm:block text-foreground"
              >
                Shipping
              </span>
            </div>

            <div
              className={`w-12 sm:w-20 h-0.5 mx-3 rounded-full transition-colors duration-300 ${status > 1 ? "bg-primary" : "bg-border"}`}
            ></div>
          </div>

          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={`size-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${status >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}  shadow-soft`}
              >
                {status > 2 ? <Check className="size-4" /> : 2}
              </div>
              <span
                className={`text-sm font-medium hidden sm:block ${status >= 2 ? "text-foreground" : "text-muted-foreground"}`}
              >
                Payment
              </span>
            </div>

            <div
              className={`w-12 sm:w-20 h-0.5 mx-3 rounded-full transition-colors duration-300 ${status > 2 ? "bg-primary" : "bg-border"}`}
            ></div>
          </div>

          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={`size-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${status >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}  shadow-soft`}
              >
                {status > 3 ? <Check className="size-4" /> : 3}
              </div>
              <span
                className={`text-sm font-medium hidden sm:block ${status >= 3 ? "text-foreground" : "text-muted-foreground"}`}
              >
                Review
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mt-8">
          <div className="flex-1 min-w-0">
            {status === 1 ? (
              <form className="bg-card rounded-2xl shadow-card p-6 space-y-5">
                <h2 className="text-lg font-bold">Shipping Information</h2>

                <div>
                  <label className="block text-xs font-semibold mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full h-11 rounded-xl border px-4 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-primary bg-background border-border 
                  "
                  />
                  <p></p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full h-11 rounded-xl border px-4 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-primary bg-background border-border 
                  "
                    />
                    <p></p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5">
                      Phone
                    </label>
                    <input
                      type="tel"
                      className="w-full h-11 rounded-xl border px-4 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-primary bg-background border-border 
                  "
                    />
                    <p></p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5">
                    Street Address
                  </label>
                  <input
                    type="text"
                    className="w-full h-11 rounded-xl border px-4 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-primary bg-background border-border 
                  "
                  />
                  <p></p>
                </div>

                <div className="">
                  <label className="block text-xs font-semibold mb-1.5">
                    Country
                  </label>
                  <select className="w-full h-11 rounded-xl border px-4 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-primary bg-background border-border">
                    <option>United States</option>
                    <option>Canada</option>
                    <option>Mexico</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => setPlusStatus(2)}
                  className="inline-flex items-center justify-center gap-2 font-semibold bg-primary text-primary-foreground hover:bg-secondary shadow-lg hover:shadow-xl h-14 rounded-xl px-10 text-base w-full transition-all duration-200"
                >
                  Continue to Payment
                </button>
              </form>
            ) : status === 2 ? (
              <div className="space-y-6">
                <div className="bg-card rounded-2xl shadow-card p-6 space-y-4">
                  <h2 className="text-lg font-bold">Payment Method</h2>
                  <div className="space-y-3">
                    <button className="w-full flex items-center gap-4 p-4 rounded-xl border-2 translate-all duration-200 text-left active:scale-[0.99] border-primary bg-accent shadow-soft">
                      <div className="size-10 rounded-lg flex items-center justify-center shrink-0 bg-primary text-primary-foreground">
                        <CreditCard />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">
                          Credit / Debit Card
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Visa, Mastercard, Amex
                        </p>
                      </div>
                      <div className="size-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors border-primary">
                        <div className="size-2.5 rounded-full bg-primary"></div>
                      </div>
                    </button>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-border">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        className="w-full h-11 rounded-xl border border-border px-4 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-primary bg-background"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1.5">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM / YY"
                          maxLength="7"
                          className="w-full h-11 rounded-xl border border-border px-4 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-primary bg-background"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5">
                          CVC
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          maxLength="4"
                          className="w-full h-11 rounded-xl border border-border px-4 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-primary bg-background"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5">
                        Name on Card
                      </label>
                      <input
                        type="text"
                        id="cardholder-name"
                        placeholder="Full name as shown on card"
                        className="w-full h-11 rounded-xl border border-border px-4 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-primary bg-background"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setPlusStatus(1)}
                    type="button"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-all duration-200 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-12 rounded-xl px-8 flex-1"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setPlusStatus(3)}
                    type="button"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all duration-200 border border-input bg-primary hover:bg-secondary shadow-lg hover:shadow-xl text-base text-primary-foreground h-12 rounded-xl px-8 flex-1"
                  >
                    Review Order
                  </button>
                </div>
              </div>
            ) : status === 3 ? (
              <div className="space-y-6">
                <div className="bg-card rounded-2xl shadow-card p-6">
                  <h2 className="text-lg font-bold mb-4">Review Your Order</h2>
                  <div className="flex items-start justify-between pb-4 border-b border-border mb-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                        Shipping to
                      </p>
                      <p className="text-sm font-medium">Nguyễn Thanh Tùng</p>
                      <p className="text-sm text-muted-foreground">
                        Xã Lưu Hoàng
                      </p>
                      <p className="text-sm text-muted-foreground">
                        A51, Ngo Thi Nham, La Khe, Ha Dong, Ha Noi
                      </p>
                    </div>
                    <button
                      onClick={() => setPlusStatus(1)}
                      className="text-xs text-primary hover:underline underline-offset-4"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
                    <div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                          Payment
                        </p>
                        <p className="text-sm font-medium">
                          Credit / Debit Card
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setPlusStatus(2)}
                      className="text-xs text-primary hover:underline underline-offset-4
                  "
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    Items (3)
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-lg bg-accent flex items-center justify-center text-xl shrink-0">
                        🔥
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          velocityMax
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Size 10 | Qty 1
                        </p>
                      </div>
                      <p className="text-sm font-semibold tabular-nums shrink-0">
                        $370
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-lg bg-accent flex items-center justify-center text-xl shrink-0">
                        🔥
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          velocityMax
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Size 10 | Qty 1
                        </p>
                      </div>
                      <p className="text-sm font-semibold tabular-nums shrink-0">
                        $370
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-lg bg-accent flex items-center justify-center text-xl shrink-0">
                        🔥
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          velocityMax
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Size 10 | Qty 1
                        </p>
                      </div>
                      <p className="text-sm font-semibold tabular-nums shrink-0">
                        $370
                      </p>
                    </div>
                  </div>
                </div>

                <button className="inline-flex items-center justify-center whitespace-nowrap font-semibold transition-all duration-200 bg-primary text-primary-foreground hover:bg-secondary shadow-lg hover:shadow-xl h-14 rounded-xl px-10 text-base w-full gap-2">
                  Place Order
                </button>
              </div>
            ) : null}
          </div>
          <div className="lg:w-80 shrink-0">
            <div className="space-y-4">
              <div
                className="bg-card rounded-2xl shadow-card p-6 lg:sticky
             lg:top-20"
              >
                <h2 className="text-lg font-bold mb-4">Order Summary</h2>
                <div className="space-y-3 pb-4 border-b border-border mb-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-accent flex items-center justify-center text-lg shrink-0">
                      🔥
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">
                        VelocityMax
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Size 10 | Qty 1
                      </p>
                    </div>
                    <p className="text-xs font-semibold tabular-nums shrink-0">
                      $185
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-accent flex items-center justify-center text-lg shrink-0">
                      🔥
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">
                        VelocityMax
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Size 10 | Qty 1
                      </p>
                    </div>
                    <p className="text-xs font-semibold tabular-nums shrink-0">
                      $185
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-accent flex items-center justify-center text-lg shrink-0">
                      🔥
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">
                        VelocityMax
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Size 10 | Qty 1
                      </p>
                    </div>
                    <p className="text-xs font-semibold tabular-nums shrink-0">
                      $185
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal (4)</span>
                    <span className="font-medium tabular-nums">$713.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium tabular-nums">
                      <span className="text-primary font-semibold">Free</span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium tabular-nums">$57.04</span>
                  </div>
                  <div className="border-t border-border pt-3 mt-2">
                    <div className="flex justify-between">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-lg tabular-nums">
                        $780.04
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-2xl shadow-card p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <LockKeyhole className="size-4 text-primary" />
                  <span className="text-xs text-muted-foreground">
                    Secure 256-bit SSL encryption
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="size-4 text-primary" />
                  <span className="text-xs text-muted-foreground">
                    Purchase protection guarantee
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw className="size-4 text-primary" />
                  <span className="text-xs text-muted-foreground">
                    30-day hassle-free returns
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
