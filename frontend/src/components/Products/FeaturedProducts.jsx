import { ArrowRight, ShoppingBag, Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import productService from "../../services/product.service";

const getResponseData = (res) => {
  return res.data?.metadata || res.data?.data || res.data;
};

const getList = (data) => {
  if (Array.isArray(data)) return data;
  return data?.products || data?.items || data?.data || [];
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(price || 0));
};

const getMinPrice = (product) => {
  const variants = Array.isArray(product.variants) ? product.variants : [];

  const prices = variants.flatMap((variant) => {
    const sizes = Array.isArray(variant.sizes) ? variant.sizes : [];

    return sizes.map((size) => {
      const price = Number(size.price || 0);
      const salePrice = Number(size.salePrice || 0);

      if (salePrice > 0 && salePrice < price) return salePrice;
      return price;
    });
  });

  const validPrices = prices.filter((price) => price > 0);

  if (validPrices.length === 0) {
    return product.price || product.salePrice || 0;
  }

  return Math.min(...validPrices);
};

const getProductImage = (product) => {
  return (
    product.thumbnail?.url ||
    product.thumbnail ||
    product.images?.[0]?.url ||
    product.images?.[0] ||
    ""
  );
};

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await productService.getAllProducts({
        limit: 8,
        sort: "-createdAt",
      });

      const data = getResponseData(res);
      setProducts(getList(data));
    } catch (error) {
      console.log(error);
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="bg-background-soft py-20">
      <div className="container">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-primary">
              Sản phẩm mới
            </p>
            <h2 className="text-3xl font-black text-foreground md:text-4xl">
              Gợi ý dành cho bạn
            </h2>
          </div>

          <a
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
          >
            Xem tất cả
            <ArrowRight className="size-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 8).map((product) => {
            const image = getProductImage(product);
            const price = getMinPrice(product);

            return (
              <a
                key={product._id}
                href={`/product/${product.slug || product._id}`}
                className="group overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-card-hover"
              >
                <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-accent">
                  {image ? (
                    <img
                      src={image}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <ShoppingBag className="size-12 text-muted-foreground" />
                  )}

                  <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-foreground backdrop-blur">
                    <Star className="size-3 fill-primary text-primary" />
                    New
                  </div>
                </div>

                <div className="p-5">
                  <p className="line-clamp-2 min-h-10 text-sm font-bold text-foreground">
                    {product.name}
                  </p>

                  <p className="mt-2 text-xs text-muted-foreground">
                    {product.brand?.name ||
                      product.category?.name ||
                      "RunVault"}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-black text-primary">
                      {formatPrice(price)}
                    </span>

                    <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
                      Xem ngay
                    </span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
