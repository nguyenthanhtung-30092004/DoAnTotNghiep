import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Star } from "lucide-react";

/* =========================
   Helpers
========================= */

const formatPrice = (price) => {
  if (price === undefined || price === null) return "Liên hệ";

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(price || 0));
};

const getBrandName = (brand) => {
  if (!brand) return "";
  if (typeof brand === "string") return brand;

  return brand.nameBrand || brand.name || "";
};

const getProductImage = (product) => {
  return (
    product?.thumbnail?.url ||
    product?.thumbnail ||
    product?.variants?.[0]?.images?.[0]?.url ||
    product?.variants?.[0]?.images?.[0] ||
    ""
  );
};

const getVariantImage = (variant) => {
  return variant?.images?.[0]?.url || variant?.images?.[0] || "";
};

const getSalePrice = (product) => {
  const firstSize = product?.variants?.[0]?.sizes?.[0];

  if (!firstSize) return product?.minPrice ?? 0;

  const price = Number(firstSize.price || 0);
  const salePrice = Number(firstSize.salePrice || 0);

  if (salePrice > 0 && salePrice < price) {
    return salePrice;
  }

  return product?.minPrice ?? price;
};

const getOriginalPrice = (product) => {
  const firstSize = product?.variants?.[0]?.sizes?.[0];

  if (!firstSize) return null;

  const price = Number(firstSize.price || 0);
  const salePrice = Number(firstSize.salePrice || 0);

  if (salePrice > 0 && salePrice < price) {
    return price;
  }

  return null;
};

const calcDiscountPct = (original, sale) => {
  if (!original || !sale) return 0;

  return Math.round(((original - sale) / original) * 100);
};

/* =========================
   ProductCard
========================= */

const ProductCard = ({ product }) => {
  const defaultImage = useMemo(() => getProductImage(product), [product]);

  const [currentImage, setCurrentImage] = useState(defaultImage);
  const [activeVariantIndex, setActiveVariantIndex] = useState(null);

  const price = getSalePrice(product);
  const originalPrice = getOriginalPrice(product);
  const discountPct = calcDiscountPct(originalPrice, price);

  const brandName = getBrandName(product?.brand);
  const variants = Array.isArray(product?.variants) ? product.variants : [];

  const isOnSale = Boolean(originalPrice);
  const isDraft = product?.isPublished === false;

  const productUrl = `/product/${product?.slug || product?._id}`;

  const handleHoverVariant = (variant, index) => {
    const image = getVariantImage(variant);

    setActiveVariantIndex(index);

    if (image) {
      setCurrentImage(image);
    }
  };

  const handleLeaveVariantArea = () => {
    setActiveVariantIndex(null);
    setCurrentImage(defaultImage);
  };

  return (
    <div className="group flex h-full flex-col">
      {/* Image box */}
      <Link
        to={productUrl}
        className="
          relative block aspect-[4/4.55] overflow-hidden rounded-2xl
          border border-black/[0.06] bg-white
          shadow-[0_10px_35px_rgba(0,0,0,0.04)]
          transition-all duration-300 ease-out
          hover:-translate-y-1 hover:border-black/[0.1]
          hover:shadow-[0_24px_60px_rgba(0,0,0,0.12)]
        "
      >
        {currentImage ? (
          <div className="flex h-full w-full items-center justify-center px-8 pb-16 pt-12 sm:px-10">
            <img
              src={currentImage}
              alt={product?.name || "Sản phẩm"}
              className="
                h-full w-full object-contain mix-blend-multiply
                transition-transform duration-500 ease-out
                group-hover:scale-[1.05]
              "
            />
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white">
            <ShoppingBag className="h-10 w-10 text-zinc-300" />
          </div>
        )}

        {/* Soft hover layer */}
        <div className="pointer-events-none absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/[0.02]" />

        {/* Badges */}
        <div className="absolute left-5 top-5 z-20 flex flex-col gap-2">
          {isDraft && (
            <span className="rounded-full bg-zinc-950 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-white shadow-sm">
              Nháp
            </span>
          )}

          {isOnSale && discountPct > 0 && (
            <span className="rounded-full bg-red-500 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-white shadow-sm">
              -{discountPct}%
            </span>
          )}

          {!isOnSale && !isDraft && (
            <span className="rounded-full bg-white px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-zinc-950 shadow-sm ring-1 ring-black/10">
              Mới
            </span>
          )}
        </div>

        {/* Quick button */}
        <div
          className="
            pointer-events-none absolute inset-x-5 bottom-5 z-20
            translate-y-3 opacity-0
            transition-all duration-300 ease-out
            group-hover:translate-y-0 group-hover:opacity-100
          "
        >
          <div
            className="
              rounded-full bg-zinc-950 px-5 py-3
              text-center text-[11px] font-black uppercase tracking-[0.2em] text-white
              shadow-[0_16px_35px_rgba(0,0,0,0.22)]
            "
          >
            Xem chi tiết
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            {brandName && (
              <p className="mb-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">
                {brandName}
              </p>
            )}

            <Link
              to={productUrl}
              className="
                line-clamp-2 text-[15px] font-black leading-snug text-zinc-950
                transition hover:text-zinc-600
              "
            >
              {product?.name}
            </Link>
          </div>

          {(product?.rating > 0 || product?.reviewCount > 0) && (
            <div className="mt-0.5 flex shrink-0 items-center gap-1 rounded-full bg-zinc-100 px-2 py-1">
              <Star className="h-3 w-3 fill-black text-black" />
              <span className="text-xs font-bold text-zinc-950">
                {product?.rating?.toFixed(1) || "5.0"}
              </span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="mt-3 flex flex-wrap items-end gap-2">
          <span className="text-[16px] font-black tracking-tight text-zinc-950">
            {formatPrice(price)}
          </span>

          {originalPrice && (
            <span className="text-xs font-medium text-zinc-400 line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>

        {/* Colors */}
        {variants.length > 0 && (
          <div
            className="mt-4 flex flex-wrap items-center gap-2"
            onMouseLeave={handleLeaveVariantArea}
          >
            {variants.slice(0, 5).map((variant, index) => {
              const isActive = activeVariantIndex === index;

              return (
                <button
                  key={variant._id || index}
                  type="button"
                  title={variant.color || "Màu sản phẩm"}
                  onMouseEnter={() => handleHoverVariant(variant, index)}
                  onClick={(event) => event.preventDefault()}
                  className={[
                    "h-5 w-5 rounded-full border transition duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2",
                    isActive
                      ? "scale-110 border-black ring-2 ring-black ring-offset-2"
                      : "border-zinc-300 hover:scale-110 hover:border-black",
                  ].join(" ")}
                  style={{
                    backgroundColor: variant.colorCode || "#e5e7eb",
                  }}
                  aria-label={`Màu ${variant.color || index + 1}`}
                />
              );
            })}

            {variants.length > 5 && (
              <span className="ml-1 text-[11px] font-bold text-zinc-400">
                +{variants.length - 5}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
