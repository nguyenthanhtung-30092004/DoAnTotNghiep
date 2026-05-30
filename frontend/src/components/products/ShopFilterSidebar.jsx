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
    <div className="border-b border-border py-4 last:border-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          {title}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && <div className="mt-4 space-y-3">{children}</div>}
    </div>
  );
};

/* ── RadioItem ── */
const RadioItem = ({ label, checked, onChange }) => (
  <label className="group flex cursor-pointer items-center gap-3">
    <div
      className={`flex h-4.5 w-4.5 items-center justify-center rounded-full border-2 transition-all ${
        checked
          ? "border-primary bg-primary shadow-sm"
          : "border-border bg-background group-hover:border-primary/50"
      }`}
      style={{ width: "18px", height: "18px", minWidth: "18px" }}
    >
      {checked && <div className="h-2 w-2 rounded-full bg-primary-foreground" />}
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
        checked
          ? "font-semibold text-foreground"
          : "font-medium text-muted-foreground group-hover:text-foreground"
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
      className={`flex items-center justify-center rounded-md border-2 transition-all ${
        checked
          ? "border-primary bg-primary shadow-sm"
          : "border-border bg-background group-hover:border-primary/50"
      }`}
      style={{ width: "18px", height: "18px", minWidth: "18px" }}
    >
      {checked && <Check className="h-3 w-3 text-primary-foreground" strokeWidth={3} />}
    </div>
    <input
      type="checkbox"
      checked={checked}
      className="sr-only"
      onChange={onChange}
    />
    <span
      className={`text-sm transition-colors ${
        checked
          ? "font-semibold text-foreground"
          : "font-medium text-muted-foreground group-hover:text-foreground"
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
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-bold text-foreground">Bộ lọc</h2>
        {hasActiveFilter && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-bold text-primary hover:bg-primary/10 transition-colors uppercase tracking-wider"
          >
            <RotateCcw className="h-3 w-3" />
            Xóa lọc
          </button>
        )}
      </div>

      {/* Active filters */}
      {hasActiveFilter && (
        <div className="mt-2 mb-2 flex flex-wrap gap-2">
          {activePrice && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1.5 text-[11px] font-bold text-primary">
              {activePrice}
              <button
                type="button"
                onClick={() =>
                  onChangePrice({ label: "", minPrice: "", maxPrice: "" })
                }
                className="ml-0.5 hover:text-primary/70"
              >
                ×
              </button>
            </span>
          )}
          {activeBrand && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1.5 text-[11px] font-bold text-primary">
              {brands.find((b) => b._id === activeBrand)?.nameBrand ||
                "Thương hiệu"}
              <button
                type="button"
                onClick={() => onChangeBrand("")}
                className="ml-0.5 hover:text-primary/70"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}

      {/* Divider */}
      <div className="mt-4 border-t border-border" />

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
          <p className="text-xs text-muted-foreground font-medium">Chưa có thương hiệu</p>
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
          <p className="text-[11px] font-bold text-primary uppercase tracking-wider cursor-pointer hover:underline mt-4">
            +{brands.length - 12} thương hiệu khác
          </p>
        )}
      </FilterSection>
    </div>
  );
};

export default ShopFilterSidebar;
