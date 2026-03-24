import { ChevronRight } from "lucide-react";
import React from "react";
import { Link } from "react-router";

const NavItem = ({ item, level = 0 }) => {
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div className={`relative ${level === 0 ? "group/root" : "group/item"}`}>
      <Link
        to={item.to}
        className="flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-lg hover:bg-accent"
      >
        {item.label}

        {hasChildren && (
          <ChevronRight
            className={`
              size-4 transition-transform duration-200
              ${level === 0 ? "group-hover/root:rotate-90" : ""}
            `}
          />
        )}
      </Link>

      {hasChildren && (
        <div
          className={`
            absolute z-50 min-w-[200px] rounded-xl border bg-white shadow-xl p-2
            transition-all duration-200

            opacity-0 invisible
            ${
              level === 0
                ? "group-hover/root:opacity-100 group-hover/root:visible"
                : "group-hover/item:opacity-100 ml-2 group-hover/item:visible"
            }

            ${level === 0 ? "top-full left-0" : "top-0 left-full"}
          `}
        >
          {item.children.map((child) => (
            <NavItem key={child.label} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NavItem;
