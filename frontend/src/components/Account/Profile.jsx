import { Calendar, Mail, Pen, Phone, User } from "lucide-react";
import React from "react";

const formatDate = (date) => {
  if (!date) return "Chưa cập nhật";

  return new Date(date).toLocaleDateString("vi-VN");
};

const Profile = ({ user }) => {
  const fullName = user?.fullName || user?.name || "Chưa cập nhật";
  const email = user?.email || "Chưa cập nhật";
  const phone = user?.phone || "Chưa cập nhật";
  const birthday = user?.birthday || user?.dateOfBirth;
  const createdAt = user?.createdAt;

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
            <h3 className="text-lg font-bold text-foreground">{fullName}</h3>

            <p className="text-sm text-muted-foreground">
              Thành viên từ {formatDate(createdAt)}
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
          <InfoInput
            icon={User}
            label="Họ và tên"
            value={fullName}
            className="md:col-span-2"
          />

          <InfoInput icon={Mail} label="Email" value={email} />

          <InfoInput icon={Phone} label="Số điện thoại" value={phone} />

          <InfoInput
            icon={Calendar}
            label="Ngày sinh"
            value={formatDate(birthday)}
            className="sm:col-span-2"
          />
        </div>
      </div>
    </div>
  );
};

const InfoInput = ({ icon: Icon, label, value, className = "" }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="font-medium text-muted-foreground text-xs flex items-center gap-1.5">
        <Icon className="size-3" />
        {label}
      </label>

      <input
        type="text"
        readOnly
        className="flex h-10 w-full px-3 py-2 text-base rounded-md bg-muted/50 border-0 outline-none"
        value={value || "Chưa cập nhật"}
      />
    </div>
  );
};

export default Profile;
