import { Calendar, Mail, Pen, Phone, User, Check, X, Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import authService from "../../services/auth.service";
import { setUser } from "../../redux/slices/authSlice";
import { toast } from "react-toastify";

const formatDate = (date) => {
  if (!date) return "Chưa cập nhật";

  return new Date(date).toLocaleDateString("vi-VN");
};

const Profile = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || user.name || "",
        phone: user.phone || "",
      });
    }
  }, [user, isEditing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const res = await authService.updateMe(formData);
      const updatedUser = res.metadata || res;
      dispatch(setUser({ ...user, ...updatedUser }));
      setIsEditing(false);
      toast.success("Cập nhật thông tin thành công");
    } catch (error) {
      toast.error(error.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const fullName = user?.fullName || user?.name || "Chưa cập nhật";
  const email = user?.email || "Chưa cập nhật";
  const phone = user?.phone || "Chưa cập nhật";
  const createdAt = user?.createdAt;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black uppercase tracking-widest text-zinc-950">Thông tin cá nhân</h2>

        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center justify-center whitespace-nowrap text-[10px] font-black uppercase tracking-[0.1em] transition-all duration-200 border border-zinc-200 bg-white hover:bg-zinc-50 h-10 px-4 gap-2">
            <Pen className="size-3" />
            Chỉnh sửa
          </button>
        ) : (
          <div className="flex gap-2">
            <button 
              onClick={() => setIsEditing(false)}
              disabled={isLoading}
              className="inline-flex items-center justify-center whitespace-nowrap text-[10px] font-black uppercase tracking-[0.1em] transition-all duration-200 border border-zinc-200 bg-white hover:bg-zinc-50 h-10 px-4 gap-2">
              <X className="size-3" />
              Hủy
            </button>
            <button 
              onClick={handleSave}
              disabled={isLoading}
              className="inline-flex items-center justify-center whitespace-nowrap text-[10px] font-black uppercase tracking-[0.1em] transition-all duration-200 border border-transparent bg-zinc-950 text-white hover:bg-zinc-800 h-10 px-4 gap-2">
              {isLoading ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3" />}
              Lưu
            </button>
          </div>
        )}
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
          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-500 flex items-center gap-2">
              <User className="size-3" /> Họ và tên
            </label>
            <input
              type="text"
              name="fullName"
              readOnly={!isEditing}
              onChange={handleChange}
              value={isEditing ? formData.fullName : fullName}
              className={`flex h-12 w-full px-4 py-2 text-xs font-bold text-zinc-950 border outline-none transition-colors ${isEditing ? "bg-white border-zinc-300 focus:border-zinc-950 shadow-sm" : "bg-zinc-50 border-zinc-200"}`}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-500 flex items-center gap-2">
              <Mail className="size-3" /> Email
            </label>
            <input
              type="text"
              readOnly
              value={email}
              className="flex h-12 w-full px-4 py-2 text-xs font-bold text-zinc-950 bg-zinc-50 border border-zinc-200 outline-none opacity-70"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-500 flex items-center gap-2">
              <Phone className="size-3" /> Số điện thoại
            </label>
            <input
              type="text"
              name="phone"
              readOnly={!isEditing}
              onChange={handleChange}
              value={isEditing ? formData.phone : phone === "Chưa cập nhật" ? "" : phone}
              placeholder="Chưa cập nhật"
              className={`flex h-12 w-full px-4 py-2 text-xs font-bold text-zinc-950 border outline-none transition-colors ${isEditing ? "bg-white border-zinc-300 focus:border-zinc-950 shadow-sm" : "bg-zinc-50 border-zinc-200"}`}
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-500 flex items-center gap-2">
              <Calendar className="size-3" /> Ngày tham gia
            </label>
            <input
              type="text"
              readOnly
              value={formatDate(createdAt)}
              className="flex h-12 w-full px-4 py-2 text-xs font-bold text-zinc-950 bg-zinc-50 border border-zinc-200 outline-none opacity-70"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
