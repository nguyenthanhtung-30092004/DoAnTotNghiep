import { ArrowRight, ShoppingBag, Star, Zap } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import productService from "../../../services/product.service";

/* ── Helpers (giữ nguyên logic) ── */
const getResponseData = (res) =>
  res.data?.metadata || res.data?.data || res.data;

const getList = (data) => {
  if (Array.isArray(data)) return data;
  return data?.products || data?.items || data?.data || [];
};

const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    Number(price || 0),
  );

const getMinPrice = (product) => {
  const variants = Array.isArray(product.variants) ? product.variants : [];
  const prices = variants.flatMap((v) =>
    (Array.isArray(v.sizes) ? v.sizes : []).map((s) => {
      const p = Number(s.price || 0);
      const sp = Number(s.salePrice || 0);
      return sp > 0 && sp < p ? sp : p;
    }),
  );
  const valid = prices.filter((p) => p > 0);
  if (valid.length === 0) return product.price || product.salePrice || 0;
  return Math.min(...valid);
};

const getOriginalPrice = (product) => {
  const firstSize = product?.variants?.[0]?.sizes?.[0];
  if (!firstSize) return null;
  const p = Number(firstSize.price || 0);
  const sp = Number(firstSize.salePrice || 0);
  return sp > 0 && sp < p ? p : null;
};

const getProductImage = (product) =>
  product.thumbnail?.url ||
  product.thumbnail ||
  product.images?.[0]?.url ||
  product.images?.[0] ||
  "";

const getBrandName = (brand) => {
  if (!brand) return "";
  if (typeof brand === "string") return brand;
  return brand.nameBrand || brand.name || "";
};

/* ── Main component ── */
const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await productService.getAllProducts({
          limit: 8,
          sort: "-createdAt",
          isPublished: true,
        });
        const data = getResponseData(res);
        setProducts(getList(data));
      } catch (err) {
        console.error(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  /* Skeleton loading */
  if (loading) {
    return (
      <section className="bg-slate-50 py-20">
        <div className="container">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <div className="mb-3 h-3 w-20 rounded-full bg-slate-200 animate-pulse" />
              <div className="h-9 w-60 rounded-xl bg-slate-200 animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-3xl bg-white border border-slate-100 overflow-hidden animate-pulse">
                <div className="aspect-square bg-slate-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-slate-200 rounded-full w-3/4" />
                  <div className="h-3 bg-slate-100 rounded-full w-1/2" />
                  <div className="h-5 bg-slate-200 rounded-full w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="bg-slate-50 py-16">
      <div className="container">
        {/* Section header */}
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1">
              <Zap className="h-3.5 w-3.5 text-indigo-500" />
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-indigo-600">
                Mới nhất
              </span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 md:text-4xl">
              Gợi ý dành cho bạn
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Những sản phẩm mới nhất, được runner Việt lựa chọn nhiều nhất.
            </p>
          </div>

          <Link
            to="/shop"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
          >
            Xem tất cả
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

/* ── ProductCard ── */
const ProductCard = ({ product }) => {
  const image = getProductImage(product);
  const price = getMinPrice(product);
  const originalPrice = getOriginalPrice(product);
  const brandName = getBrandName(product.brand);
  const isOnSale = originalPrice !== null;
  const variants = Array.isArray(product.variants) ? product.variants : [];

  return (
    <Link
      to={`/product/${product.slug || product._id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover hover:border-slate-200"
    >
      {/* Image area — object-contain, light bg, fixed aspect */}
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-slate-200" />
          </div>
        )}

        {/* Top-left badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {isOnSale ? (
            <span className="inline-flex items-center rounded-lg bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
              Sale
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-lg bg-white/90 px-2 py-0.5 text-[10px] font-bold text-slate-700 shadow-sm backdrop-blur">
              <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
              Mới
            </span>
          )}
        </div>

        {/* Hover CTA overlay */}
        <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center bg-slate-900/85 py-3 transition-transform duration-300 group-hover:translate-y-0">
          <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-white">
            <ArrowRight className="h-3.5 w-3.5" />
            Xem chi tiết
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        {/* Brand */}
        {brandName && (
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {brandName}
          </p>
        )}

        {/* Name */}
        <h3 className="line-clamp-2 flex-1 text-sm font-bold leading-snug text-slate-800">
          {product.name}
        </h3>

        {/* Color swatches */}
        {variants.length > 0 && (
          <div className="mt-2.5 flex items-center gap-1.5">
            {variants.slice(0, 5).map((v, i) => (
              <span
                key={v._id || i}
                title={v.color}
                className="h-3.5 w-3.5 rounded-full border border-slate-200 shadow-sm"
                style={{ backgroundColor: v.colorCode || "#e2e8f0" }}
              />
            ))}
            {variants.length > 5 && (
              <span className="text-[10px] font-semibold text-slate-400">
                +{variants.length - 5}
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-base font-black text-indigo-600">
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

export default FeaturedProducts;
