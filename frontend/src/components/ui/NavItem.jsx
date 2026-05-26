/**
 * NavItem — Legacy export (kept for backward compatibility)
 * Header now uses its own inline NavItem component.
 * This file re-exports a simple passthrough to avoid import errors.
 */
import { ChevronDown } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const NavItem = ({ item }) => {
  const hasMega = item?.children?.length > 0;

  return (
    <div className="group relative flex h-16 items-center">
      <Link
        to={item.to}
        className="relative flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-700 rounded-lg hover:text-slate-900 hover:bg-slate-50 transition-colors duration-150"
      >
        {item.label}
        {hasMega && (
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform duration-200 mt-px" />
        )}
      </Link>

      {hasMega && (
        <div className="pointer-events-none group-hover:pointer-events-auto absolute top-full left-1/2 -translate-x-1/2 z-50 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 ease-out">
          <div className="h-3 w-full" />
          <div className="w-[600px] rounded-2xl border border-slate-100 bg-white shadow-card-hover p-6">
            <div className="grid grid-cols-4 gap-5">
              {item.children.map((col) => (
                <div key={col.label}>
                  <Link
                    to={col.to}
                    className="block mb-2.5 text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors"
                  >
                    {col.label}
                  </Link>
                  {col.children && (
                    <div className="space-y-1.5">
                      {col.children.map((sub) => (
                        <Link
                          key={sub.label}
                          to={sub.to}
                          className="block text-sm text-slate-600 hover:text-primary transition-colors"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavItem;