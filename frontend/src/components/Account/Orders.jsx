import { ChevronRight, CircleCheck, Clock, Package, Truck } from "lucide-react";
import React from "react";

const Orders = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Order History</h2>
        <p className="text-sm text-muted-foreground">4 orders</p>
      </div>

      <div className="space-y-4">
        {/* Order 1 */}
        <a
          href=""
          className="block rounded-2xl border border-border bg-card p-5 hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-muted flex items-center justify-center">
                <Package className="size-4 text-muted-foreground" />
              </div>

              <div>
                <p className="text-sm font-semibold text-foreground">
                  RV-2026-1847
                </p>
                <p className="text-xs text-muted-foreground">Mar 18, 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-secondary/80 rounded-full gap-1 text-xs px-2.5 py-1 bg-primary/10 text-primary border-0">
                <CircleCheck className="size-3" />
                Delivered
              </div>
              <ChevronRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-lg">👟</span>
                <span className="text-foreground">UltraBoost Runner Pro</span>
                <span className="text-muted-foreground">x1</span>
              </div>
              <span className="font-medium text-foreground">$159.00</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-lg">🧦</span>
                <span className="text-foreground">
                  Performance Socks 3-Pack
                </span>
                <span className="text-muted-foreground">x1</span>
              </div>
              <span className="font-medium text-foreground">$30.00</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="text-base font-bold text-foreground">$189.99</span>
          </div>
        </a>

        {/* Order 2 */}
        <a
          href=""
          className="block rounded-2xl border border-border bg-card p-5 hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-muted flex items-center justify-center">
                <Package className="size-4 text-muted-foreground" />
              </div>

              <div>
                <p className="text-sm font-semibold text-foreground">
                  RV-2026-1720
                </p>
                <p className="text-xs text-muted-foreground">Mar 10, 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-secondary/80 rounded-full gap-1 text-xs px-2.5 py-1 bg-blue-50 text-blue-600 border-0">
                <Truck className="size-3" />
                Shipped
              </div>
              <ChevronRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-lg">👟</span>
                <span className="text-foreground">TrailBlazer X1</span>
                <span className="text-muted-foreground">x1</span>
              </div>
              <span className="font-medium text-foreground">$124.99</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="text-base font-bold text-foreground">$124.99</span>
          </div>
        </a>

        {/* Order 3 */}
        <a
          href=""
          className="block rounded-2xl border border-border bg-card p-5 hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-muted flex items-center justify-center">
                <Package className="size-4 text-muted-foreground" />
              </div>

              <div>
                <p className="text-sm font-semibold text-foreground">
                  RV-2026-1603
                </p>
                <p className="text-xs text-muted-foreground">Feb 28, 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-secondary/80 rounded-full gap-1 text-xs px-2.5 py-1 bg-amber-50 text-amber-600 border-0">
                <Clock className="size-3" />
                Processing
              </div>
              <ChevronRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-lg">👟</span>
                <span className="text-foreground">CloudStrike Elite</span>
                <span className="text-muted-foreground">x1</span>
              </div>
              <span className="font-medium text-foreground">$199.99</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-lg">🩳</span>
                <span className="text-foreground">Running Shorts</span>
                <span className="text-muted-foreground">x1</span>
              </div>
              <span className="font-medium text-foreground">$49.00</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="text-base font-bold text-foreground">$249.98</span>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Orders;
