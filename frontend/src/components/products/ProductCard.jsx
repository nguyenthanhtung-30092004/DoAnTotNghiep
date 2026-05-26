import { Link } from "react-router-dom";
import { ShoppingBag, Star } from "lucide-react";

/* ── Helpers (giữ nguyên data field names) ── */
const formatPrice = (price) => {
  if (price === undefined || price === null) return "Liên hệ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const getBrandName = (brand) => {
  if (!brand) return "";
  if (typeof brand === "string") return brand;
  return brand.nameBrand || brand.name || "";
};

const getProductImage = (product) =>
  product?.thumbnail?.url ||
  product?.variants?.[0]?.images?.[0]?.url ||
  "";

const getSalePrice = (product) => {
  const firstSize = product?.variants?.[0]?.sizes?.[0];
  if (!firstSize) return product?.minPrice ?? 0;
  const price = Number(firstSize.price || 0);
  const salePrice = Number(firstSize.salePrice || 0);
  if (salePrice > 0 && salePrice < price) return salePrice;
  return product?.minPrice ?? price;
};

const getOriginalPrice = (product) => {
  const firstSize = product?.variants?.[0]?.sizes?.[0];
  if (!firstSize) return null;
  const price = Number(firstSize.price || 0);
  const salePrice = Number(firstSize.salePrice || 0);
  return salePrice > 0 && salePrice < price ? price : null;
};

const calcDiscountPct = (original, sale) => {
  if (!original || !sale) return 0;
  return Math.round(((original - sale) / original) * 100);
};

/* ── ProductCard ── */
const ProductCard = ({ product }) => {
  const image = getProductImage(product);
  const price = getSalePrice(product);
  const originalPrice = getOriginalPrice(product);
  const discountPct = calcDiscountPct(originalPrice, price);
  const brandName = getBrandName(product.brand);
  const variants = Array.isArray(product.variants) ? product.variants : [];
  const isOnSale = !!originalPrice;
  const isDraft = product.isPublished === false;

  return (
    <Link
      to={`/product/${product.slug || product._id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover hover:border-slate-200"
    >
      {/* ── Image ── */}
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-contain p-3 transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ShoppingBag className="h-10 w-10 text-slate-200" />
          </div>
        )}

        {/* Badges top-left */}
        <div className="absolute left-2.5 top-2.5 flex flex-col gap-1.5">
          {isDraft && (
            <span className="rounded-lg bg-slate-700 px-2 py-0.5 text-[10px] font-bold text-white">
              Nháp
            </span>
          )}
          {isOnSale && discountPct > 0 && (
            <span className="rounded-lg bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
              -{discountPct}%
            </span>
          )}
          {!isOnSale && !isDraft && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-white/90 px-2 py-0.5 text-[10px] font-bold text-slate-700 shadow-sm backdrop-blur">
              <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
              Mới
            </span>
          )}
        </div>

        {/* Hover CTA overlay */}
        <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center bg-slate-900/85 py-3 transition-transform duration-300 group-hover:translate-y-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-white">
            Xem chi tiết →
          </span>
        </div>
      </div>

      {/* ── Info ── */}
      <div className="flex flex-1 flex-col p-3.5">
        {/* Brand */}
        {brandName && (
          <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {brandName}
          </p>
        )}

        {/* Name */}
        <h3 className="flex-1 text-sm font-semibold leading-snug text-slate-800 line-clamp-2 min-h-[40px]">
          {product.name}
        </h3>

        {/* Color swatches */}
        {variants.length > 0 && (
          <div className="mt-2 flex items-center gap-1.5">
            {variants.slice(0, 6).map((v, i) => (
              <span
                key={v._id || i}
                title={v.color}
                className="h-3.5 w-3.5 rounded-full border border-slate-200 shadow-sm"
                style={{ backgroundColor: v.colorCode || "#e2e8f0" }}
              />
            ))}
            {variants.length > 6 && (
              <span className="text-[10px] font-semibold text-slate-400">
                +{variants.length - 6}
              </span>
            )}
          </div>
        )}

        {/* Rating row */}
        {(product.rating > 0 || product.reviewCount > 0) && (
          <div className="mt-2 flex items-center gap-1">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold text-slate-700">
              {product.rating?.toFixed(1) || "5.0"}
            </span>
            <span className="text-xs text-slate-400">
              ({product.reviewCount || 0})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="mt-2.5 flex items-center gap-2">
          <span className={`text-base font-black ${isOnSale ? "text-red-500" : "text-indigo-600"}`}>
            {formatPrice(price)}
          </span>
          {originalPrice && (
            <span className="text-xs text-slate-400 line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
