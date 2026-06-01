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
    <div className="border-b border-zinc-200 py-6 last:border-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left group"
      >
        <span className="text-xs font-black uppercase tracking-[0.15em] text-zinc-950 transition-colors group-hover:text-teal-600">
          {title}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-zinc-400 transition-transform duration-300 group-hover:text-teal-600 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && <div className="mt-5 space-y-4">{children}</div>}
    </div>
  );
};

/* ── RadioItem ── */
const RadioItem = ({ label, checked, onChange }) => (
  <label className="group flex cursor-pointer items-start gap-4">
    <div
      className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
        checked
          ? "border-teal-600 bg-teal-600"
          : "border-zinc-300 bg-white group-hover:border-teal-600"
      }`}
      style={{ width: "18px", height: "18px" }}
    >
      {checked && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
    </div>
    <input
      type="radio"
      name="price"
      checked={checked}
      className="sr-only"
      onChange={onChange}
    />
    <span
      className={`text-sm leading-tight transition-colors duration-300 ${
        checked
          ? "font-bold text-teal-600"
          : "font-medium text-zinc-500 group-hover:text-zinc-950"
      }`}
    >
      {label}
    </span>
  </label>
);

/* ── CheckboxItem ── */
const CheckboxItem = ({ label, checked, onChange }) => (
  <label className="group flex cursor-pointer items-start gap-4">
    <div
      className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center border transition-all duration-300 ${
        checked
          ? "border-teal-600 bg-teal-600"
          : "border-zinc-300 bg-white group-hover:border-teal-600"
      }`}
      style={{ width: "18px", height: "18px" }}
    >
      {checked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
    </div>
    <input
      type="checkbox"
      checked={checked}
      className="sr-only"
      onChange={onChange}
    />
    <span
      className={`text-sm leading-tight transition-colors duration-300 ${
        checked
          ? "font-bold text-teal-600"
          : "font-medium text-zinc-500 group-hover:text-zinc-950"
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
      {/* Header (Desktop only, mobile hides this and uses its own) */}
      <div className="hidden lg:flex items-center justify-between mb-4 border-b border-zinc-200 pb-4">
        <h2 className="text-xl font-black uppercase tracking-tight text-zinc-950">Bộ lọc</h2>
        {hasActiveFilter && (
          <button
            type="button"
            onClick={onReset}
            className="group flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-zinc-400 hover:text-red-500 transition-colors"
          >
            <RotateCcw className="h-3 w-3 transition-transform duration-300 group-hover:-rotate-90" />
            Xóa lọc
          </button>
        )}
      </div>

      {/* Mức giá */}
      <FilterSection title="Khoảng giá">
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
          <p className="text-xs text-zinc-400 font-medium">Chưa có thương hiệu</p>
        ) : (
          brands
            .slice(0, 12)
            .map((brand) => (
              <CheckboxItem
                key={brand._id}
                label={brand.nameBrand || brand.name}
                checked={activeBrand === brand._id}
                onChange={() =>
                  onChangeBrand(activeBrand === brand._id ? "" : brand._id)
                }
              />
            ))
        )}
        {brands.length > 12 && (
          <button className="text-[11px] font-black uppercase tracking-[0.1em] text-zinc-950 hover:text-teal-600 transition-colors mt-2">
            + {brands.length - 12} thương hiệu khác
          </button>
        )}
      </FilterSection>
    </div>
  );
};

export default ShopFilterSidebar;
