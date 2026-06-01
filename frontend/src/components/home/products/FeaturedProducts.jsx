import { ArrowRight, Zap } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import productService from "../../../services/product.service";
import ProductCard from "../../products/ProductCard";

/* ── Helpers ── */
const getList = (data) => {
  if (Array.isArray(data)) return data;
  return data?.products || data?.items || data?.data || [];
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
        const data = res;
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
      <section className="bg-zinc-50/50 py-20">
        <div className="container">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <div className="mb-3 h-3 w-20 rounded-full bg-muted animate-pulse" />
              <div className="h-9 w-60 rounded-xl bg-muted animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-card border border-border overflow-hidden animate-pulse"
              >
                <div className="aspect-[4/5] bg-muted" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-muted rounded-full w-3/4" />
                  <div className="h-3 bg-muted/50 rounded-full w-1/2" />
                  <div className="h-5 bg-muted rounded-full w-1/3" />
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
    <section className="bg-zinc-50/50 py-16">
      <div className="container">
        {/* Section header */}
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1">
              <Zap className="h-3 w-3 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                Mới nhất
              </span>
            </div>
            <h2 className="text-3xl font-black text-foreground md:text-4xl tracking-tight">
              Gợi ý dành cho bạn
            </h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Những sản phẩm mới nhất, được runner Việt lựa chọn nhiều nhất.
            </p>
          </div>

          <Link
            to="/shop"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
          >
            Xem tất cả
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
