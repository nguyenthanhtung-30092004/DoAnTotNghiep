import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import CategoryService from "../../../services/category.service";

import giaytrail from "../../../assets/Giaytrail.png";
import giayroad from "../../../assets/Giayroad.png";
import aonam from "../../../assets/aonam.png";
import quannam from "../../../assets/quannam.png";
import dongho from "../../../assets/dongho.png";
import dinhduong from "../../../assets/dinhduong.png";

const fallbackImages = [giayroad, giaytrail, aonam, quannam, dongho, dinhduong];

const getList = (data) => {
  if (Array.isArray(data)) return data;
  return data?.categories || data?.items || data?.data || [];
};

const getCategoryName = (category) => {
  return category.name || category.nameCategory || category.title || "Danh mục";
};

const getCategorySlug = (category) => {
  return category.slug || category.slugCategory || category._id;
};

const getCategoryImage = (category, index) => {
  return (
    category.thumbnail?.url ||
    category.thumbnail ||
    category.image?.url ||
    category.image ||
    category.imageCategory?.url ||
    category.imageCategory ||
    fallbackImages[index % fallbackImages.length]
  );
};

const isParentCategory = (category) => {
  return !(category.parent || category.parentId || category.parentCategory || category.parent?._id);
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await CategoryService.getAllCategories({ limit: 100 });
        const list = getList(res);
        setCategories(list);
      } catch (err) {
        console.error(err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const parentCategories = useMemo(() => {
    return categories.filter((category) => {
      return !category.isDeleted && isParentCategory(category);
    });
  }, [categories]);

  if (loading) {
    return <CategoriesSkeleton />;
  }

  if (parentCategories.length === 0) return null;

  const visibleCategories = parentCategories.slice(0, 6);
  const [mainCategory, secondCategory, ...smallCategories] = visibleCategories;

  return (
    <section className="bg-white py-20 md:py-32">
      <div className="container">
        {/* Header - No eyebrow, split asymmetric layout */}
        <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-black tracking-[-0.04em] text-zinc-950 md:text-5xl lg:text-6xl">
              Danh mục nổi bật
            </h2>

            <p className="mt-6 max-w-lg text-base leading-[1.7] text-zinc-500">
              Tuyển tập trang bị chuyên nghiệp cho từng chặng chạy. Hiệu suất tối đa, trải nghiệm
              hoàn hảo.
            </p>
          </div>

          <Link
            to="/shop"
            className="group inline-flex h-12 w-fit items-center gap-3 border border-black bg-white px-6 text-xs font-black uppercase tracking-[0.16em] text-zinc-950 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-950 hover:bg-zinc-950 hover:text-white hover:shadow-md active:translate-y-0 active:scale-[0.98]"
          >
            Xem tất cả
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Bento Layout */}
        <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-12">
          {/* Main Large Card */}
          {mainCategory && (
            <CategoryTile
              category={mainCategory}
              index={0}
              size="large"
              className="lg:col-span-7"
            />
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:col-span-5">
            {/* Secondary Medium Card */}
            {secondCategory && (
              <CategoryTile
                category={secondCategory}
                index={1}
                size="medium"
                className="sm:col-span-2"
              />
            )}

            {/* Small Cards */}
            {smallCategories.slice(0, 4).map((category, index) => (
              <CategoryTile
                key={getCategorySlug(category)}
                category={category}
                index={index + 2}
                size="small"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const CategoryTile = ({ category, index, size = "small", className = "" }) => {
  const name = getCategoryName(category);
  const slug = getCategorySlug(category);
  const image = getCategoryImage(category, index);

  const sizeClass = {
    large: "min-h-[400px] md:min-h-[580px]",
    medium: "min-h-[260px] md:min-h-[280px]",
    small: "min-h-[220px] md:min-h-[240px]",
  };

  const titleClass = {
    large: "text-4xl md:text-5xl lg:text-[4.5rem]",
    medium: "text-3xl md:text-4xl",
    small: "text-2xl md:text-3xl",
  };

  // Bento Background Diversity: subtle variations of light grey/white to avoid a completely flat look
  const bgVariations = [
    "bg-zinc-100",
    "bg-zinc-50 border border-zinc-100",
    "bg-gradient-to-br from-zinc-50 to-zinc-100",
    "bg-stone-50",
  ];
  const bgClass = bgVariations[index % bgVariations.length];

  return (
    <Link
      to={`/shop?category=${slug}`}
      className={`
        group relative block overflow-hidden rounded-[28px]
        ${bgClass}
        transition-all duration-500 ease-out
        hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(0,0,0,0.06)]
        ${sizeClass[size]}
        ${className}
      `}
    >
      {/* Product image - using mix-blend-multiply which works beautifully on light backgrounds to remove any white bounding boxes */}
      <img
        src={image}
        alt={name}
        className={`
          absolute object-contain mix-blend-multiply
          transition-transform duration-700 ease-[0.16,1,0.3,1]
          group-hover:scale-105 group-hover:-translate-x-2
          ${
            size === "large"
              ? "bottom-12 right-[-5%] h-[75%] w-[85%]"
              : size === "medium"
                ? "bottom-4 right-[-5%] h-[80%] w-[60%]"
                : "bottom-[-5%] right-[-10%] h-[80%] w-[80%]"
          }
        `}
      />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-between p-6 md:p-8 lg:p-10">
        <div className="flex items-start justify-between">
          <span
            className="
              flex h-12 w-12 items-center justify-center rounded-full
              bg-white text-zinc-950 shadow-sm
              transition-all duration-300
              group-hover:-rotate-45 group-hover:bg-zinc-950 group-hover:text-white
            "
          >
            <ArrowRight className="h-5 w-5" />
          </span>
        </div>

        <div>
          <h3
            className={`
              max-w-[8ch] font-black uppercase leading-[0.9] tracking-[-0.04em] text-zinc-950
              ${titleClass[size]}
            `}
          >
            {name}
          </h3>

          <p className="mt-5 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 transition-colors duration-300 group-hover:text-zinc-950">
            Khám phá ngay
            <ArrowRight className="h-3 w-3" />
          </p>
        </div>
      </div>
    </Link>
  );
};

const CategoriesSkeleton = () => {
  return (
    <section className="bg-white py-20 md:py-32">
      <div className="container">
        <div className="mb-14 max-w-xl">
          <div className="h-12 w-3/4 animate-pulse rounded-xl bg-zinc-100" />
          <div className="mt-4 h-12 w-1/2 animate-pulse rounded-xl bg-zinc-100" />
          <div className="mt-6 h-5 w-full animate-pulse rounded-xl bg-zinc-100" />
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <div className="min-h-[430px] animate-pulse rounded-[28px] bg-zinc-100 md:min-h-[580px] lg:col-span-7" />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-5">
            <div className="min-h-[260px] animate-pulse rounded-[28px] bg-zinc-100 md:min-h-[280px] sm:col-span-2" />
            <div className="min-h-[220px] animate-pulse rounded-[28px] bg-zinc-100 md:min-h-[240px]" />
            <div className="min-h-[220px] animate-pulse rounded-[28px] bg-zinc-100 md:min-h-[240px]" />
            <div className="min-h-[220px] animate-pulse rounded-[28px] bg-zinc-100 md:min-h-[240px]" />
            <div className="min-h-[220px] animate-pulse rounded-[28px] bg-zinc-100 md:min-h-[240px]" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;
