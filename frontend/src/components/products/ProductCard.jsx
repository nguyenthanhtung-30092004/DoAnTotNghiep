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
  product?.thumbnail?.url || product?.variants?.[0]?.images?.[0]?.url || "";

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
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-card transition-all duration-300 hover:-translate-y-1"
    >
      {/* ── Image ── */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-secondary/30 flex items-center justify-center p-6 sm:p-8">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-contain transition-transform duration-700 ease-out group-hover:scale-110 mix-blend-multiply"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ShoppingBag className="h-10 w-10 text-zinc-300" />
          </div>
        )}

        {/* Badges top-left */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5 z-10">
          {isDraft && (
            <span className="rounded bg-zinc-900 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              Nháp
            </span>
          )}
          {isOnSale && discountPct > 0 && (
            <span className="rounded bg-destructive px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-destructive-foreground">
              -{discountPct}%
            </span>
          )}
          {!isOnSale && !isDraft && (
            <span className="rounded bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-900">
              Mới
            </span>
          )}
        </div>

        {/* Hover CTA overlay */}
        <div className="absolute inset-x-0 bottom-4 flex justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10">
          <span className="rounded-full bg-zinc-900/95 backdrop-blur px-5 py-2.5 text-xs font-semibold tracking-wide text-white shadow-lg">
            Xem chi tiết
          </span>
        </div>
      </div>

      {/* ── Info ── */}
      <div className="flex flex-1 flex-col pt-4 pb-2">
        {/* Brand */}
        {brandName && (
          <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            {brandName}
          </p>
        )}

        {/* Name */}
        <h3 className="text-[15px] font-semibold leading-relaxed text-foreground line-clamp-2">
          {product.name}
        </h3>

        {/* Price & Rating Row */}
        <div className="mt-2.5 flex items-end justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span className={`text-base font-bold tracking-tight ${isOnSale ? "text-destructive" : "text-foreground"}`}>
                {formatPrice(price)}
              </span>
              {originalPrice && (
                <span className="text-[13px] text-muted-foreground line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
          </div>

          {(product.rating > 0 || product.reviewCount > 0) && (
            <div className="flex items-center gap-1 mb-0.5 shrink-0">
              <Star className="h-3.5 w-3.5 fill-zinc-900 text-zinc-900" />
              <span className="text-[13px] font-semibold text-foreground">
                {product.rating?.toFixed(1) || "5.0"}
              </span>
              <span className="text-[13px] text-muted-foreground">
                ({product.reviewCount || 0})
              </span>
            </div>
          )}
        </div>

        {/* Color swatches */}
        {variants.length > 0 && (
          <div className="mt-3.5 flex items-center gap-1.5">
            {variants.slice(0, 5).map((v, i) => (
              <span
                key={v._id || i}
                title={v.color}
                className="h-3.5 w-3.5 rounded-full border border-border shadow-sm"
                style={{ backgroundColor: v.colorCode || "#e2e8f0" }}
              />
            ))}
            {variants.length > 5 && (
              <span className="text-xs font-medium text-muted-foreground ml-1">
                +{variants.length - 5} màu
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
