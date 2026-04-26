import { Calendar, Mail, Pen, Phone, User } from "lucide-react";
import React from "react";

const Profile = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Thông tin cá nhân</h2>
        <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold transition-all duration-200 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 gap-2 rounded-xl">
          <Pen className="size-4" />
          Chỉnh sửa
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="size-20 rounded-2xl bg-primary/10 flex items-center justify-center">
            <User className="size-10 text-primary" />
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-bold text-foreground">
              Nguyen Thanh Tung
            </h3>
            <p className="text-sm text-muted-foreground">
              Thành viên từ tháng 1, 2025
            </p>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
              <span className="size-1.5 rounded-full bg-primary"></span>
              Đang hoạt động
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Thông tin chi tiết
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground text-xs flex items-center gap-1.5">
              <User className="size-3" />
              Họ và tên
            </label>
            <input
              type="text"
              className="fkex h-10 w-full border-input px-3 py-2 text-base ring-offset-background file:border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md bg-muted/50 border-0"
              value="Nguyen Thanh Tung"
            />
          </div>

          <div className="space-y-2">
            <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground text-xs flex items-center gap-1.5">
              <Mail className="size-3" />
              Email
            </label>
            <input
              type="text"
              className="fkex h-10 w-full border-input px-3 py-2 text-base ring-offset-background file:border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md bg-muted/50 border-0"
              value="nguyenthanhtung@gmail.com"
            />
          </div>

          <div className="space-y-2">
            <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground text-xs flex items-center gap-1.5">
              <Phone className="size-3" />
              Số điện thoại
            </label>
            <input
              type="text"
              className="fkex h-10 w-full border-input px-3 py-2 text-base ring-offset-background file:border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md bg-muted/50 border-0"
              value="0123456789"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground text-xs flex items-center gap-1.5">
              <Calendar className="size-3" />
              Ngày sinh
            </label>
            <input
              type="text"
              className="fkex h-10 w-full border-input px-3 py-2 text-base ring-offset-background file:border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md bg-muted/50 border-0"
              value="30/09/2004"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
