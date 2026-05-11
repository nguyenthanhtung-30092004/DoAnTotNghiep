import { ChevronDown } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const MegaNavItem = ({ item }) => {
  const hasMegaMenu = item?.children?.length > 0;

  return (
    <div className="group flex h-full items-center">
      {/* NAV LINK */}
      <Link
        to={item.to}
        className="
          relative flex items-center gap-2 px-3 py-2
          text-base font-medium rounded-lg
          hover:text-black
        "
      >
        {item.label}

        {hasMegaMenu && (
          <ChevronDown
            className="
              size-4 text-gray-500
              group-hover:rotate-180
              transition-transform duration-200
            "
          />
        )}

        {/* UNDERLINE */}
        <span
          className="
            absolute bottom-0 left-1/2 h-[2px]
            w-0 -translate-x-1/2 bg-black
            transition-all duration-200
            group-hover:w-full
          "
        />
      </Link>

      {/* MEGA MENU */}
      {hasMegaMenu && (
        <div
          className="
            hidden group-hover:block
            absolute top-full left-1/2 z-50
            w-screen -translate-x-1/2
            border-t bg-white shadow-xl
          "
        >
          {/* CẦU NỐI chống mất hover */}
          <div className="absolute -top-4 left-0 h-4 w-full bg-transparent" />

          {/* CONTENT */}
          <div
            className="
              mx-auto flex max-w-7xl
              items-start justify-center
              gap-4 px-10 py-8
            "
          >
            {item.children.map((column) => (
              <div
                key={column.label}
                className="flex min-w-[120px] flex-col"
              >
                {/* COLUMN TITLE */}
                <Link
                  to={column.to}
                  className="
                    mb-3 text-base font-bold
                    uppercase tracking-wide
                    hover:text-black
                  "
                >
                  {column.label}
                </Link>

                {/* SUB ITEMS */}
                {column.children && (
                  <div className="flex flex-col">
                    {column.children.map((subItem) => (
                      <Link
                        key={subItem.label}
                        to={subItem.to}
                        className="
                          py-1.5 text-sm text-gray-600
                          hover:text-black
                        "
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