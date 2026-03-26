import { ChevronDown } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const MegaNavItem = ({ item }) => {
  const hasMegaMenu = item?.children && item.children.length > 0;

  return (
    <div className="group h-full flex items-center">
      {/* Nút hiển thị trên Nav */}
      <Link
        to={item.to}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:text-foreground hover:bg-accent transition-colors"
      >
        {item.label}
        {hasMegaMenu && (
          <ChevronDown className="size-4 text-gray-500 transition-transform duration-300 group-hover:rotate-180" />
        )}
      </Link>

      {/* BẢNG MEGA MENU */}
      {hasMegaMenu && (
        <div
          className="
            /* --- 1. CẦU NỐI VÔ HÌNH (CHỐNG TRƯỢT CHUỘT) --- */
            /* Tạo một vùng trong suốt cao 32px (-top-8) và rộng full màn hình (w-full) ở sát mép trên của bảng */
            before:content-[''] before:absolute before:-top-8 before:left-0 before:w-full before:h-8 before:bg-transparent

            /* 2. Vị trí bảng: Dính chặt vào Header */
            absolute z-50 left-0 top-full w-full
            
            /* 3. Giao diện */
            bg-white shadow-xl border-t border-gray-200 py-8 px-6
            
            /* 4. Hiệu ứng Ẩn/Hiện */
            opacity-0 invisible pointer-events-none translate-y-2
            group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto group-hover:translate-y-0
            transition-all duration-300 ease-in-out
          "
        >
          {/* Vùng chứa nội dung chữ */}
          <div className="max-w-7xl mx-auto grid grid-cols-7 gap-6 divide-x divide-gray-100">
            {item.children.map((column, columnIndex) => (
              <div
                key={column.label}
                className={`flex flex-col ${columnIndex > 0 ? "pl-6" : "pl-0"}`}
              >
                {/* TIÊU ĐỀ CỘT */}
                <Link
                  to={column.to}
                  className="flex items-end pb-3 min-h-[3rem] font-bold text-primary text-lg uppercase tracking-wider border-b-2 border-gray-200 hover:border-green-400 transition-colors"
                >
                  {column.label}
                </Link>

                {/* DANH SÁCH CON */}
                {column.children && column.children.length > 0 && (
                  <div className="flex flex-col gap-1 mt-4">
                    {column.children.map((subItem) => (
                      <Link
                        key={subItem.label}
                        to={subItem.to}
                        className="px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-foreground hover:bg-accent hover:ml-2 transition-all duration-300"
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MegaNavItem;
