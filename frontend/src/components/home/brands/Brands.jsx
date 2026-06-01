import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import brandService from "../../../services/brand.service";

const getList = (data) => {
  if (Array.isArray(data)) return data;
  return data?.brands || data?.items || data?.data || [];
};

const Brands = () => {
  const [brands, setBrands] = useState([]);
  
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await brandService.getAllBrands();
        const data = Array.isArray(res) ? res : res?.metadata || res?.data || res;
        const list = getList(data).filter((b) => !b.isDeleted);
        setBrands(list);
      } catch (err) {
        console.error(err);
        setBrands([]);
      }
    };
    fetchBrands();
  }, []);

  if (!brands.length) return null;

  // Duplicate multiple times to ensure enough content for seamless scroll
  const marqueeBrands = [...brands, ...brands, ...brands, ...brands, ...brands, ...brands];

  return (
    <section className="bg-background py-16 border-b border-border overflow-hidden">
      <div className="container mb-12">
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
          Thương hiệu hàng đầu
        </h2>
      </div>

      <div className="relative flex overflow-x-hidden group border-y border-border py-8 bg-zinc-50 dark:bg-zinc-900/20">
        <div className="animate-marquee group-hover:[animation-play-state:paused]">
          {marqueeBrands.map((brand, index) => (
            <Link
              key={`${brand._id}-${index}`}
              to={`/shop?brand=${brand.slugBrand || brand._id}`}
              className="flex w-40 sm:w-56 flex-col items-center justify-center mx-6 transition-opacity hover:opacity-50"
            >
              <div className="h-12 w-full flex items-center justify-center mb-3">
                {brand.logoBrand ? (
                  <img
                    src={brand.logoBrand}
                    alt={brand.nameBrand}
                    className="max-h-full max-w-full object-contain grayscale"
                  />
                ) : (
                  <span className="text-2xl font-black text-foreground uppercase tracking-tighter">
                    {brand.nameBrand}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">
                  {brand.nameBrand}
                </span>
                {brand.outStanding && (
                  <span className="text-[8px] font-bold uppercase tracking-widest text-background bg-foreground px-1.5 py-0.5 rounded-none">
                    Hot
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: scroll-marquee 40s linear infinite;
        }
        @keyframes scroll-marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}} />
    </section>
  );
};

export default Brands;
