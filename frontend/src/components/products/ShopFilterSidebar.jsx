import { Check, RotateCcw, ChevronDown } from "lucide-react";
import { useState } from "react";

/* ── Dải giá — giữ nguyên data shape để không vỡ API ── */
const priceOptions = [
  { label: "Dưới 500.000đ", minPrice: "", maxPrice: 500000 },
  { label: "500.000đ – 1.000.000đ", minPrice: 500000, maxPrice: 1000000 },
  { label: "1.000.000đ – 2.000.000đ", minPrice: 1000000, maxPrice: 2000000 },
  { label: "Trên 2.000.000đ", minPrice: 2000000, maxPrice: "" },
];

/* ── FilterSection: collapsible group ── */
const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-100 py-4 last:border-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
          {title}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && <div className="mt-4 space-y-2.5">{children}</div>}
    </div>
  );
};

/* ── RadioItem ── */
const RadioItem = ({ label, checked, onChange }) => (
  <label className="group flex cursor-pointer items-center gap-3">
    <div
      className={`flex h-4.5 w-4.5 items-center justify-center rounded-full border-2 transition-colors ${
        checked
          ? "border-indigo-600 bg-indigo-600"
          : "border-slate-300 group-hover:border-indigo-400"
      }`}
      style={{ width: "18px", height: "18px", minWidth: "18px" }}
    >
      {checked && <div className="h-2 w-2 rounded-full bg-white" />}
    </div>
    <input
      type="radio"
      name="price"
      checked={checked}
      className="sr-only"
      onChange={onChange}
    />
    <span
      className={`text-sm transition-colors ${
        checked ? "font-semibold text-slate-800" : "text-slate-600 group-hover:text-slate-800"
      }`}
    >
      {label}
    </span>
  </label>
);

/* ── CheckboxItem ── */
const CheckboxItem = ({ label, checked, onChange }) => (
  <label className="group flex cursor-pointer items-center gap-3">
    <div
      className={`flex items-center justify-center rounded-md border-2 transition-colors ${
        checked
          ? "border-indigo-600 bg-indigo-600"
          : "border-slate-300 group-hover:border-indigo-400"
      }`}
      style={{ width: "18px", height: "18px", minWidth: "18px" }}
    >
      {checked && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
    </div>
    <input type="checkbox" checked={checked} className="sr-only" onChange={onChange} />
    <span
      className={`text-sm transition-colors ${
        checked ? "font-semibold text-slate-800" : "text-slate-600 group-hover:text-slate-800"
      }`}
    >
      {label}
    </span>
  </label>
);

/* ── Main ShopFilterSidebar ── */
const ShopFilterSidebar = ({
  brands,
  activeBrand,
  activePrice,
  onChangeBrand,
  onChangePrice,
  onReset,
}) => {
  const hasActiveFilter = activeBrand || activePrice;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-sm font-bold text-slate-800">Bộ lọc</h2>
        {hasActiveFilter && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            Xóa bộ lọc
          </button>
        )}
      </div>

      {/* Active filters */}
      {hasActiveFilter && (
        <div className="mt-2 mb-1 flex flex-wrap gap-1.5">
          {activePrice && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
              {activePrice}
              <button
                type="button"
                onClick={() => onChangePrice({ label: "", minPrice: "", maxPrice: "" })}
                className="ml-0.5 hover:text-indigo-900"
              >
                ×
              </button>
            </span>
          )}
          {activeBrand && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
              {brands.find((b) => b._id === activeBrand)?.nameBrand || "Thương hiệu"}
              <button
                type="button"
                onClick={() => onChangeBrand("")}
                className="ml-0.5 hover:text-indigo-900"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}

      {/* Divider */}
      <div className="mt-3 border-t border-slate-100" />

      {/* Mức giá */}
      <FilterSection title="Mức giá">
        {priceOptions.map((price) => (
          <RadioItem
            key={price.label}
            label={price.label}
            checked={activePrice === price.label}
            onChange={() =>
              activePrice === price.label
                ? onChangePrice({ label: "", minPrice: "", maxPrice: "" })
                : onChangePrice(price)
            }
          />
        ))}
      </FilterSection>

      {/* Thương hiệu */}
      <FilterSection title="Thương hiệu">
        {brands.length === 0 ? (
          <p className="text-xs text-slate-400">Chưa có thương hiệu</p>
        ) : (
          brands.slice(0, 12).map((brand) => (
            <CheckboxItem
              key={brand._id}
              label={brand.nameBrand || brand.name}
              checked={activeBrand === brand._id}
              onChange={() => onChangeBrand(activeBrand === brand._id ? "" : brand._id)}
            />
          ))
        )}
        {brands.length > 12 && (
          <p className="text-xs text-indigo-600 font-semibold cursor-pointer hover:underline">
            +{brands.length - 12} thương hiệu khác
          </p>
        )}
      </FilterSection>
    </div>
  );
};

export default ShopFilterSidebar;
