import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import brandService from "../../../services/brand.service";

const getList = (data) => {
  if (Array.isArray(data)) return data;
  return data?.brands || data?.items || data?.data || [];
};

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await brandService.getAllBrands();
        const data = res;
        const list = getList(data).filter((b) => !b.isDeleted);
        setBrands(list);
        setCurrentIndex(list.length);
      } catch (err) {
        console.error(err);
        setBrands([]);
      }
    };
    fetchBrands();
  }, []);

  const extendedBrands = [...brands, ...brands, ...brands];
  const VISIBLE = 6;

  const nextSlide = () => {
    if (!brands.length) return;
    setIsTransitioning(true);
    setCurrentIndex((p) => p + 1);
  };

  const prevSlide = () => {
    if (!brands.length) return;
    setIsTransitioning(true);
    setCurrentIndex((p) => p - 1);
  };

  const handleTransitionEnd = () => {
    if (!brands.length) return;
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
      const t = setTimeout(() => setIsTransitioning(true), 50);
      return () => clearTimeout(t);
    }
  }, [isTransitioning]);

  useEffect(() => {
    if (isHovered || !brands.length) return;
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex((p) => p + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, [isHovered, brands.length]);

  if (!brands.length) return null;

  return (
    <section className="bg-background py-16 border-b border-border">
      <div className="container">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1">
              <Sparkles className="h-3 w-3 text-muted-foreground" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">
                Thương hiệu
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Đồng hành cùng thương hiệu hàng đầu
            </h2>
          </div>

          {/* Controls */}
          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={prevSlide}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-all hover:border-foreground/20 hover:text-foreground"
              aria-label="Trước"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-all hover:border-foreground/20 hover:text-foreground"
              aria-label="Tiếp"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Slider */}
        <div
          className="overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className={`flex ${isTransitioning ? "transition-transform duration-500 ease-in-out" : ""}`}
            style={{
              transform: `translateX(-${currentIndex * (100 / VISIBLE)}%)`,
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extendedBrands.map((brand, index) => (
              <div
                key={`${brand._id}-${index}`}
                className="shrink-0 px-2"
                style={{ width: `${100 / VISIBLE}%` }}
              >
                <BrandCard brand={brand} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ── BrandCard ── */
const BrandCard = ({ brand }) => (
  <Link
    to={`/shop?brand=${brand.slugBrand || brand._id}`}
    className="group relative flex flex-col items-center gap-3 rounded-2xl border border-transparent bg-zinc-50/50 p-5 transition-all duration-300 hover:border-border hover:bg-card"
  >
    {/* Only show Hot badge if outStanding flag is explicitly true */}
    {brand.outStanding === true && (
      <span className="absolute right-3 top-3 rounded bg-primary px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-primary-foreground">
        Hot
      </span>
    )}
    <div className="flex h-12 w-full items-center justify-center">
      {brand.logoBrand ? (
        <img
          src={brand.logoBrand}
          alt={brand.nameBrand}
          className="max-h-full max-w-full object-contain opacity-50 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0 mix-blend-multiply"
        />
      ) : (
        <span className="text-3xl font-black text-muted transition-colors group-hover:text-foreground">
          {(brand.nameBrand || "B").slice(0, 1)}
        </span>
      )}
    </div>
    <p className="truncate text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors group-hover:text-foreground">
      {brand.nameBrand}
    </p>
  </Link>
);

export default Brands;
