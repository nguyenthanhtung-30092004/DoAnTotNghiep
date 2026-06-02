import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import brandService from "../../../services/brand.service";

const getList = (data) => {
  if (Array.isArray(data)) return data;

  return data?.brands || data?.items || data?.data || [];
};

const getBrandLogo = (brand) => {
  if (!brand?.logoBrand) return "";

  if (typeof brand.logoBrand === "string") {
    return brand.logoBrand;
  }

  return brand.logoBrand.url || "";
};

const Brands = () => {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await brandService.getAllBrands();

        const data = Array.isArray(res) ? res : res?.metadata || res?.data || res;

        const list = getList(data).filter((brand) => !brand.isDeleted);

        setBrands(list);
      } catch (err) {
        console.error(err);
        setBrands([]);
      }
    };

    fetchBrands();
  }, []);

  const marqueeBrands = useMemo(() => {
    return [...brands, ...brands, ...brands, ...brands];
  }, [brands]);

  if (!brands.length) return null;

  return (
    <section className="overflow-hidden border-y border-zinc-100 bg-white py-16">
      <div className="container">
        {/* Header */}
        <div className="mb-16 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end border-b border-border pb-8">
          <div>
            <h2 className="text-4xl font-black text-foreground md:text-5xl tracking-tighter uppercase">
              Thương hiệu nổi bật
            </h2>
            <p className="mt-4 text-sm text-muted-foreground max-w-sm leading-relaxed">
              Khám phá các thương hiệu giày chạy bộ được yêu thích tại Runner Store.
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
      </div>

      {/* Marquee */}
      <div className="relative">
        {/* Fade left */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-white to-transparent md:w-40" />

        {/* Fade right */}
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-white to-transparent md:w-40" />

        <div className="group flex overflow-hidden py-2">
          <div className="flex w-max animate-brand-marquee items-center gap-5 group-hover:[animation-play-state:paused]">
            {marqueeBrands.map((brand, index) => {
              const logo = getBrandLogo(brand);
              const brandName = brand.nameBrand || brand.name || "Brand";
              const brandSlug = brand.slugBrand || brand._id;

              return (
                <Link
                  key={`${brand._id || brandName}-${index}`}
                  to={`/shop?brand=${brandSlug}`}
                  className="
                    flex h-32 w-52 shrink-0 flex-col items-center justify-center
                    rounded-3xl border border-zinc-100 bg-zinc-50/70 px-6
                    transition-all duration-300 ease-out
                    hover:-translate-y-1 hover:border-zinc-200 hover:bg-white
                    hover:shadow-[0_18px_45px_rgba(0,0,0,0.08)]
                    active:scale-[0.98]
                    sm:w-60
                  "
                >
                  <div className="flex h-14 w-full items-center justify-center">
                    {logo ? (
                      <img
                        src={logo}
                        alt={brandName}
                        className="
                          max-h-12 max-w-[130px] object-contain
                          opacity-70 grayscale
                          transition-all duration-300
                          group-hover:opacity-70
                        "
                      />
                    ) : (
                      <span className="line-clamp-1 text-2xl font-black uppercase tracking-tight text-zinc-950">
                        {brandName}
                      </span>
                    )}
                  </div>

                  <div className="mt-5 flex items-center justify-center gap-2">
                    <span className="line-clamp-1 text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">
                      {brandName}
                    </span>

                    {brand.outStanding && (
                      <span className="rounded-full bg-zinc-950 px-2 py-1 text-[8px] font-black uppercase tracking-[0.16em] text-white">
                        Hot
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .animate-brand-marquee {
              animation: brand-marquee 38s linear infinite;
            }

            @keyframes brand-marquee {
              from {
                transform: translateX(0);
              }

              to {
                transform: translateX(-50%);
              }
            }

            @media (prefers-reduced-motion: reduce) {
              .animate-brand-marquee {
                animation: none;
              }
            }
          `,
        }}
      />
    </section>
  );
};

export default Brands;
