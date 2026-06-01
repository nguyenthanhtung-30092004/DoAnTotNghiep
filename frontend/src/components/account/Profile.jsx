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
        <h2 className="text-xl font-black uppercase tracking-widest text-zinc-950">Thông tin cá nhân</h2>

        <button className="inline-flex items-center justify-center whitespace-nowrap text-[10px] font-black uppercase tracking-[0.1em] transition-all duration-200 border border-zinc-200 bg-white hover:bg-zinc-50 h-10 px-4 gap-2">
          <Pen className="size-3" />
          Chỉnh sửa
        </button>
      </div>

      <div className="border border-zinc-200 bg-white p-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="size-24 bg-zinc-50 border border-zinc-200 flex items-center justify-center shrink-0">
            <User className="size-8 text-zinc-400" />
          </div>

          <div className="text-center sm:text-left">
            <h3 className="text-lg font-black uppercase tracking-widest text-zinc-950">{fullName}</h3>

            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mt-2">
              Thành viên từ {formatDate(createdAt)}
            </p>

            <div className="mt-4 inline-flex items-center gap-2 bg-teal-50 border border-teal-100 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-teal-700">
              <span className="size-1.5 rounded-full bg-teal-600"></span>
              Đang hoạt động
            </div>
          </div>
        </div>
      </div>

      <div className="border border-zinc-200 bg-white p-8">
        <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-zinc-950 mb-6">
          Thông tin chi tiết
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
      <label className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-500 flex items-center gap-2">
        <Icon className="size-3" />
        {label}
      </label>

      <input
        type="text"
        readOnly
        className="flex h-12 w-full px-4 py-2 text-xs font-bold text-zinc-950 bg-zinc-50 border border-zinc-200 outline-none"
        value={value || "Chưa cập nhật"}
      />
    </div>
  );
};

export default Profile;
