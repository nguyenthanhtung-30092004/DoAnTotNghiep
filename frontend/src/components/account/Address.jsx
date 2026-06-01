import { Briefcase, House, Pen, Plus, Trash } from "lucide-react";
import React from "react";

const Address = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black uppercase tracking-widest text-zinc-950">Địa chỉ đã lưu</h2>

        <button className="inline-flex items-center justify-center whitespace-nowrap text-[10px] font-black uppercase tracking-[0.1em] transition-all duration-200 bg-zinc-950 text-white hover:bg-teal-600 h-10 px-4 gap-2">
          <Plus className="size-3" />
          Thêm địa chỉ
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="border bg-white p-6 relative transition-shadow hover:shadow-card-hover border-teal-600">
          <span className="absolute top-4 right-4 text-[8px] font-black uppercase tracking-widest bg-teal-600 text-white px-3 py-1">
            Mặc định
          </span>

          <div className="flex items-center gap-3 mb-4">
            <div className="size-10 bg-teal-50 flex items-center justify-center">
              <House className="size-4 text-teal-600" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest text-teal-600">
              Nhà riêng
            </span>
          </div>

          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 space-y-1">
            <p className="text-zinc-950 font-black">Nguyen Thanh Tung</p>
            <p>A51 Ngo Thi Nham, La Khe, Ha Dong, Ha Noi</p>
            <p>Căn hộ 4B</p>
            <p>Portland, OR 97201</p>
          </div>

          <div className="mt-6 flex gap-3">
            <button className="inline-flex items-center justify-center whitespace-nowrap text-[10px] font-black uppercase tracking-[0.1em] transition-all duration-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-950 px-4 gap-2 h-10">
              <Pen className="size-3" />
              Chỉnh sửa
            </button>

            <button className="inline-flex items-center justify-center whitespace-nowrap text-[10px] font-black uppercase tracking-[0.1em] transition-all duration-200 border border-zinc-200 hover:border-red-500 hover:bg-red-500 hover:text-white px-4 gap-2 text-red-500 h-10">
              <Trash className="size-3" />
              Xoá
            </button>
          </div>
        </div>

        <div className="border bg-white p-6 relative transition-shadow hover:shadow-card-hover border-zinc-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-10 bg-zinc-50 flex items-center justify-center">
              <Briefcase className="size-4 text-zinc-500" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest text-zinc-950">
              Văn phòng
            </span>
          </div>

          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 space-y-1">
            <p className="text-zinc-950 font-black">Nguyen Thanh Tung</p>
            <p>A51 Ngo Thi Nham, La Khe, Ha Dong, Ha Noi</p>
            <p>Căn hộ 4B</p>
            <p>Portland, OR 97201</p>
          </div>

          <div className="mt-6 flex gap-3">
            <button className="inline-flex items-center justify-center whitespace-nowrap text-[10px] font-black uppercase tracking-[0.1em] transition-all duration-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-950 px-4 gap-2 h-10">
              <Pen className="size-3" />
              Chỉnh sửa
            </button>

            <button className="inline-flex items-center justify-center whitespace-nowrap text-[10px] font-black uppercase tracking-[0.1em] transition-all duration-200 border border-zinc-200 hover:border-red-500 hover:bg-red-500 hover:text-white px-4 gap-2 text-red-500 h-10">
              <Trash className="size-3" />
              Xoá
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Address;
