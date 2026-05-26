import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import brandService from "../../../services/brand.service";

const getResponseData = (res) =>
  res.data?.metadata || res.data?.data || res.data;

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
        const data = getResponseData(res);
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
    if (currentIndex <= 0) { setIsTransitioning(false); setCurrentIndex(brands.length); }
    if (currentIndex >= brands.length * 2) { setIsTransitioning(false); setCurrentIndex(brands.length); }
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
    <section className="bg-white py-10 border-y border-slate-100">
      <div className="container">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="mb-1.5 inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1">
              <Sparkles className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                Thương hiệu
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900 md:text-2xl">
              Đồng hành cùng thương hiệu hàng đầu
            </h2>
          </div>

          {/* Controls */}
          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={prevSlide}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
              aria-label="Trước"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
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
            style={{ transform: `translateX(-${currentIndex * (100 / VISIBLE)}%)` }}
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
    className="group relative flex flex-col items-center gap-2 rounded-2xl border border-slate-100 bg-white p-3 transition-all duration-200 hover:border-indigo-200 hover:shadow-soft"
  >
    {/* Only show Hot badge if outStanding flag is explicitly true */}
    {brand.outStanding === true && (
      <span className="absolute right-2 top-2 rounded-full bg-indigo-600 px-1.5 py-0.5 text-[9px] font-bold leading-tight text-white">
        Hot
      </span>
    )}
    <div className="flex h-10 w-full items-center justify-center">
      {brand.logoBrand ? (
        <img
          src={brand.logoBrand}
          alt={brand.nameBrand}
          className="max-h-9 max-w-full object-contain opacity-60 transition-opacity duration-200 group-hover:opacity-100"
        />
      ) : (
        <span className="text-2xl font-black text-slate-200 group-hover:text-indigo-300 transition-colors">
          {(brand.nameBrand || "B").slice(0, 1)}
        </span>
      )}
    </div>
    <p className="truncate text-center text-[11px] font-semibold text-slate-400 group-hover:text-indigo-600 transition-colors">
      {brand.nameBrand}
    </p>
  </Link>
);

export default Brands;
