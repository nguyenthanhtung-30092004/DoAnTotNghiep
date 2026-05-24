import { Check } from "lucide-react";
import { Button } from "../../../components/ui/Button";

const priceOptions = [
  {
    label: "Dưới 500.000đ",
    minPrice: "",
    maxPrice: 500000,
  },
  {
    label: "500.000đ - 1.000.000đ",
    minPrice: 500000,
    maxPrice: 1000000,
  },
  {
    label: "1.000.000đ - 2.000.000đ",
    minPrice: 1000000,
    maxPrice: 2000000,
  },
  {
    label: "Trên 2.000.000đ",
    minPrice: 2000000,
    maxPrice: "",
  },
];

const ShopFilterSidebar = ({
  brands,
  activeBrand,
  activePrice,
  onChangeBrand,
  onChangePrice,
  onReset,
}) => {
  return (
    <div className="space-y-8 pr-4">
      <div>
        <h3 className="text-gray-900 font-bold text-sm uppercase tracking-wider mb-4">
          Mức Giá
        </h3>

        <div className="space-y-3">
          {priceOptions.map((price) => (
            <label
              key={price.label}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                  activePrice === price.label
                    ? "border-[#22C55E] bg-[#22C55E]"
                    : "border-gray-300 group-hover:border-[#22C55E]"
                }`}
              >
                {activePrice === price.label && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>

              <input
                type="radio"
                name="price"
                checked={activePrice === price.label}
                className="hidden"
                onChange={() => onChangePrice(price)}
              />

              <span
                className={`text-[14px] ${
                  activePrice === price.label
                    ? "text-gray-900 font-medium"
                    : "text-gray-600"
                }`}
              >
                {price.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="h-[1px] w-full bg-gray-100" />

      <div>
        <h3 className="text-gray-900 font-bold text-sm uppercase tracking-wider mb-4">
          Thương Hiệu
        </h3>

        <div className="space-y-3">
          {brands.length === 0 && (
            <p className="text-sm text-gray-500">Chưa có thương hiệu</p>
          )}

          {brands.map((brand) => (
            <label
              key={brand._id}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div
                className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                  activeBrand === brand._id
                    ? "border-[#22C55E] bg-[#22C55E]"
                    : "border-gray-300 group-hover:border-[#22C55E]"
                }`}
              >
                {activeBrand === brand._id && (
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                )}
              </div>

              <input
                type="checkbox"
                checked={activeBrand === brand._id}
                className="hidden"
                onChange={() =>
                  onChangeBrand(activeBrand === brand._id ? "" : brand._id)
                }
              />

              <span
                className={`text-[14px] ${
                  activeBrand === brand._id
                    ? "text-gray-900 font-medium"
                    : "text-gray-600"
                }`}
              >
                {brand.nameBrand || brand.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full mt-4 text-[#22C55E] border-[#22C55E] hover:bg-[#22C55E] hover:text-white transition-colors"
        onClick={onReset}
      >
        Xóa bộ lọc
      </Button>
    </div>
  );
};

export default ShopFilterSidebar;
