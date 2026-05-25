import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";
import brandService from "../../../services/brand.service";

const getResponseData = (res) => {
  return res.data?.metadata || res.data?.data || res.data;
};

const getList = (data) => {
  if (Array.isArray(data)) return data;
  return data?.brands || data?.items || data?.data || [];
};

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const fetchBrands = async () => {
    try {
      const res = await brandService.getAllBrands();
      const data = getResponseData(res);

      const list = getList(data).filter((brand) => !brand.isDeleted);
      setBrands(list);
      setCurrentIndex(list.length);
    } catch (error) {
      console.log(error);
      setBrands([]);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const extendedBrands = [...brands, ...brands, ...brands];

  const nextSlide = () => {
    if (brands.length === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (brands.length === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

  const handleTransitionEnd = () => {
    if (brands.length === 0) return;

    if (currentIndex <= 0) {
      setIsTransitioning(false);
      setCurrentIndex(brands.length);
    }

    if (currentIndex >= brands.length * 2) {
      setIsTransitioning(false);
      setCurrentIndex(brands.length);
    }
  };

  useEffect(() => {
    if (!isTransitioning) {
      const timeout = setTimeout(() => setIsTransitioning(true), 50);
      return () => clearTimeout(timeout);
    }
  }, [isTransitioning]);

  useEffect(() => {
    if (isHovered || brands.length === 0) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
    }, 2800);

    return () => clearInterval(interval);
  }, [isHovered, brands.length]);

  if (brands.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-background-soft py-12">
      <div className="container relative z-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              <Sparkles className="size-3.5" />
              Thương hiệu nổi bật
            </div>

            <h2 className="text-2xl font-black text-foreground md:text-3xl">
              Đồng hành cùng thương hiệu hàng đầu
            </h2>
          </div>
        </div>

        <div
          className="relative mx-auto w-[90%] overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className={`flex ${
              isTransitioning
                ? "transition-transform duration-500 ease-in-out"
                : ""
            }`}
            style={{
              transform: `translateX(-${currentIndex * (100 / 5)}%)`,
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extendedBrands.map((brand, index) => (
              <div
                key={`${brand._id}-${index}`}
                className="w-1/5 flex-shrink-0 px-3"
              >
                <a
                  href={`/shop?brand=${brand.slugBrand || brand._id}`}
                  className="group block overflow-hidden rounded-2xl border border-border bg-card p-3 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                >
                  <div className="relative flex aspect-square items-center justify-center rounded-xl bg-white p-3">
                    {brand.outStanding && (
                      <span className="absolute right-3 top-3 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">
                        Hot
                      </span>
                    )}

                    {brand.logoBrand ? (
                      <img
                        src={brand.logoBrand}
                        alt={brand.nameBrand}
                        className="max-h-16 max-w-full object-contain transition duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <span className="text-4xl font-black text-primary">
                        {(brand.nameBrand || "B").slice(0, 1)}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-3 truncate text-center text-xs font-black text-foreground">
                    {brand.nameBrand}
                  </h3>
                </a>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-2 top-[58%] z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-card text-foreground shadow-soft transition hover:bg-primary hover:text-white"
        >
          <ChevronLeft />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-2 top-[58%] z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-card text-foreground shadow-soft transition hover:bg-primary hover:text-white"
        >
          <ChevronRight />
        </button>
      </div>
    </section>
  );
};

export default Brands;
