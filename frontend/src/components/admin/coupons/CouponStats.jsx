import { BadgePercent, CheckCircle2, Clock, Ticket } from "lucide-react";
import React from "react";

const CouponStats = ({
  totalCoupon = 0,
  showingCoupon = 0,
  activeCoupon = 0,
  expiredCoupon = 0,
}) => {
  const stats = [
    {
      label: "Tổng mã",
      value: totalCoupon,
      icon: Ticket,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Đang hiển thị",
      value: showingCoupon,
      icon: BadgePercent,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Đang hoạt động",
      value: activeCoupon,
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Hết hạn",
      value: expiredCoupon,
      icon: Clock,
      color: "bg-red-50 text-red-600",
    },
  ];

  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {item.label}
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {item.value}
                </p>
              </div>

              <div
                className={`flex size-12 items-center justify-center rounded-xl ${item.color}`}
              >
                <Icon className="size-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CouponStats;
