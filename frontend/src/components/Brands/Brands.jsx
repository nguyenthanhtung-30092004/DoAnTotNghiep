import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";
import brandService from "../../services/brand.service";

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
    <section className="relative overflow-hidden bg-background-soft py-20">
      <div className="absolute left-0 top-0 size-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 size-72 rounded-full bg-secondary/10 blur-3xl" />

      <div className="container relative z-10">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              <Sparkles className="size-3.5" />
              Thương hiệu nổi bật
            </div>

            <h2 className="text-3xl font-black text-foreground md:text-4xl">
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
                  className="group block overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                >
                  <div className="relative flex aspect-square items-center justify-center rounded-2xl bg-white p-5">
                    {brand.outStanding && (
                      <span className="absolute right-3 top-3 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">
                        Hot
                      </span>
                    )}

                    {brand.logoBrand ? (
                      <img
                        src={brand.logoBrand}
                        alt={brand.nameBrand}
                        className="max-h-24 max-w-full object-contain transition duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <span className="text-4xl font-black text-primary">
                        {(brand.nameBrand || "B").slice(0, 1)}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-4 truncate text-center text-sm font-black text-foreground">
                    {brand.nameBrand}
                  </h3>
                </a>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-2 top-[58%] z-10 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-card text-foreground shadow-soft transition hover:bg-primary hover:text-white"
        >
          <ChevronLeft />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-2 top-[58%] z-10 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-card text-foreground shadow-soft transition hover:bg-primary hover:text-white"
        >
          <ChevronRight />
        </button>
      </div>
    </section>
  );
};

export default Brands;
