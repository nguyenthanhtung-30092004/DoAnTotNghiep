import { Briefcase, House, Pen, Plus, Trash } from "lucide-react";
import React from "react";

const Address = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Địa chỉ đã lưu</h2>

        <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold ring-offset-background transition-all duration-200 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 gap-2 rounded-xl">
          <Plus className="size-3.5" />
          Thêm địa chỉ
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border bg-card p-5 relative transition-shadow hover:shadow-md border-primary">
          <span className="absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-wider bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
            Mặc định
          </span>

          <div className="flex items-center gap-2 mb-3">
            <div className="size-8 rounded-lg bg-accent flex items-center justify-center">
              <House className="size-4 text-accent-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">
              Nhà riêng
            </span>
          </div>

          <div className="text-sm text-muted-foreground space-y-0.5">
            <p className="text-foreground font-medium">Nguyen Thanh Tung</p>
            <p>A51 Ngo Thi Nham, La Khe, Ha Dong, Ha Noi</p>
            <p>Căn hộ 4B</p>
            <p>Portland, OR 97201</p>
          </div>

          <div className="mt-4 flex gap-2">
            <button className="inline-flex items-center justify-center whitespace-nowrap font-semibold ring-offset-background transition-all duration-200 hover:bg-accent hover:text-accent-foreground px-3 gap-1.5 text-xs rounded-lg h-8">
              <Pen className="size-3" />
              Chỉnh sửa
            </button>

            <button class="inline-flex items-center justify-center whitespace-nowrap font-semibold ring-offset-background transition-all duration-200 hover:bg-accent px-3 gap-1.5 text-xs text-destructive hover:text-destructive rounded-lg h-8">
              <Trash className="size-3" />
              Xoá
            </button>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5 relative transition-shadow hover:shadow-md border-border">
          <div className="flex items-center gap-2 mb-3">
            <div className="size-8 rounded-lg bg-accent flex items-center justify-center">
              <Briefcase className="size-4 text-accent-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">
              Văn phòng
            </span>
          </div>

          <div className="text-sm text-muted-foreground space-y-0.5">
            <p className="text-foreground font-medium">Nguyen Thanh Tung</p>
            <p>A51 Ngo Thi Nham, La Khe, Ha Dong, Ha Noi</p>
            <p>Căn hộ 4B</p>
            <p>Portland, OR 97201</p>
          </div>

          <div className="mt-4 flex gap-2">
            <button className="inline-flex items-center justify-center whitespace-nowrap font-semibold ring-offset-background transition-all duration-200 hover:bg-accent hover:text-accent-foreground px-3 gap-1.5 text-xs rounded-lg h-8">
              <Pen className="size-3" />
              Chỉnh sửa
            </button>

            <button class="inline-flex items-center justify-center whitespace-nowrap font-semibold ring-offset-background transition-all duration-200 hover:bg-accent px-3 gap-1.5 text-xs text-destructive hover:text-destructive rounded-lg h-8">
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
