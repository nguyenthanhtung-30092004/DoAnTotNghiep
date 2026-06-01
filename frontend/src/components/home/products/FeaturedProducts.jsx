import { ArrowRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import productService from "../../../services/product.service";
import ProductCard from "../../products/ProductCard";

const getList = (data) => {
  if (Array.isArray(data)) return data;
  return data?.products || data?.items || data?.data || [];
};

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

  if (loading) {
    return (
      <section className="bg-background py-24">
        <div className="container">
          <div className="mb-16 flex items-end justify-between border-b border-border pb-8">
            <div className="h-10 w-64 bg-muted animate-pulse" />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-muted mb-4" />
                <div className="space-y-3">
                  <div className="h-4 bg-muted w-3/4" />
                  <div className="h-3 bg-muted/50 w-1/2" />
                  <div className="h-5 bg-muted w-1/3" />
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
    <section className="bg-background py-24">
      <div className="container">
        {/* Section header */}
        <div className="mb-16 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end border-b border-border pb-8">
          <div>
            <h2 className="text-4xl font-black text-foreground md:text-5xl tracking-tighter uppercase">
              Hàng mới về
            </h2>
            <p className="mt-4 text-sm text-muted-foreground max-w-sm leading-relaxed">
              Những phát kiến mới nhất về tốc độ và sức bền. Được thử nghiệm bởi các vận động viên
              hàng đầu.
            </p>
          </div>

          <Link
            to="/shop"
            className="group inline-flex items-center gap-3 border border-foreground px-6 py-3 text-xs font-bold uppercase tracking-widest text-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            Xem tất cả
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:gap-x-8 lg:grid-cols-4">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
