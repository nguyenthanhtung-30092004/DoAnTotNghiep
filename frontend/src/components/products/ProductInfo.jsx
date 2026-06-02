import React from 'react';
import { Loader2, Minus, Plus, ShoppingCart, Star } from "lucide-react";

export const getBrandName = (brand) => {
  if (!brand) return "Không có thương hiệu";
  if (typeof brand === "string") return brand;

  return brand.nameBrand || brand.name || "Không có thương hiệu";
};

export const getCategoryName = (category) => {
  if (!category) return "Không có danh mục";
  if (typeof category === "string") return category;

  return category.name || "Không có danh mục";
};

const ProductInfo = ({
  product,
  variants,
  selectedVariantIndex,
  selectedVariant,
  selectedSizeId,
  quantity,
  selectedStock,
  displayPrice,
  originalPrice,
  ratingAverage,
  ratingCount,
  formatPrice,
  handlePreviewVariant,
  handleChangeVariant,
  setSelectedSizeId,
  setSizeChartOpen,
  setQuantity,
  handleDecreaseQuantity,
  handleIncreaseQuantity,
  handleAddToCart,
  addingToCart,
}) => {
  return (
    <div className="mb-8">
      <p className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-teal-600">
        {getBrandName(product.brand)}
      </p>

      <h1 className="text-2xl font-black leading-tight tracking-tighter text-zinc-950 sm:text-3xl lg:text-4xl">
        {product.name}
      </h1>

      <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-wider text-zinc-500">
        <div className="flex items-center gap-1.5">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-zinc-950">
            {ratingAverage > 0 ? ratingAverage.toFixed(1) : "0.0"}
          </span>
          <span>({ratingCount} đánh giá)</span>
        </div>

        <span className="h-1 w-1 bg-zinc-300" />

        <span>
          Danh mục:{" "}
          <span className="text-zinc-950">
            {getCategoryName(product.category)}
          </span>
        </span>
      </div>

      <div className="border-t border-zinc-200 py-8 mt-8">
        <div className="flex flex-wrap items-end gap-4">
          <p className="text-[28px] font-black tracking-tighter text-red-500">
            {formatPrice(displayPrice)}
          </p>

          {originalPrice && (
            <p className="mb-1 text-lg font-bold text-zinc-400 line-through">
              {formatPrice(originalPrice)}
            </p>
          )}
        </div>

        <div className="mt-5">
          <h3 className="text-xs font-black uppercase tracking-[0.15em] text-zinc-950">
            Màu sắc
          </h3>

          <div className="mt-4 flex flex-wrap gap-3">
            {variants.map((variant, index) => (
              <button
                key={variant._id || index}
                type="button"
                onMouseEnter={() => handlePreviewVariant(index)}
                onClick={() => handleChangeVariant(index)}
                className={`flex h-11 items-center gap-3 border px-5 text-xs font-bold uppercase tracking-wider transition-all ${
                  selectedVariantIndex === index
                    ? "border-zinc-950 bg-zinc-950 text-white"
                    : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-400 hover:text-zinc-950"
                }`}
              >
                <span
                  className={`h-4 w-4 rounded-full border shadow-sm ${
                    selectedVariantIndex === index
                      ? "border-zinc-700"
                      : "border-zinc-200"
                  }`}
                  style={{
                    backgroundColor: variant.colorCode || "#d1d5db",
                  }}
                />
                {variant.color}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-[0.15em] text-zinc-950">
              Kích cỡ
            </h3>

            <button
              type="button"
              onClick={() => setSizeChartOpen(true)}
              className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 underline transition-colors hover:text-teal-600"
            >
              Bảng size
            </button>
          </div>

          <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5 lg:grid-cols-4">
            {selectedVariant?.sizes?.map((item) => {
              const isOutOfStock = Number(item.stock || 0) <= 0;

              return (
                <button
                  key={item._id}
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => {
                    setSelectedSizeId(item._id);
                    setQuantity(1);
                  }}
                  className={`flex items-center justify-center border px-[7px] py-[10px] text-sm font-bold uppercase transition-all ${
                    selectedSizeId === item._id
                      ? "border-teal-600 bg-teal-600 text-white"
                      : "border-zinc-200 bg-white text-zinc-950 hover:border-zinc-950"
                  } ${
                    isOutOfStock
                      ? "cursor-not-allowed opacity-30 line-through hover:border-zinc-200"
                      : ""
                  }`}
                >
                  {item.size}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-[0.15em] text-zinc-950">
              Số lượng
            </h3>

            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              Còn lại:{" "}
              <span className="text-zinc-950">{selectedStock}</span>
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex h-14 w-full items-center border border-zinc-200 bg-white sm:w-36">
              <button
                type="button"
                onClick={handleDecreaseQuantity}
                className="flex h-full w-12 items-center justify-center text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-950"
              >
                <Minus className="h-4 w-4" />
              </button>

              <span className="flex-1 text-center font-bold text-zinc-950">
                {quantity}
              </span>

              <button
                type="button"
                onClick={handleIncreaseQuantity}
                className="flex h-full w-12 items-center justify-center text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-950"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap bg-zinc-950 px-4 text-[11px] font-black uppercase tracking-[0.08em] text-white transition-colors hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-50 sm:h-14 sm:flex-1 sm:gap-3 sm:px-8 sm:text-xs sm:tracking-[0.15em]"
            >
              {addingToCart ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <ShoppingCart className="h-5 w-5 shrink-0" />
              )}
              {addingToCart ? "Đang thêm..." : "Thêm vào giỏ"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
