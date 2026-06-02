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
  return !(
    category.parent ||
    category.parentId ||
    category.parentCategory ||
    category.parent?._id
  );
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

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

  return (
    <section className="bg-white py-20 md:py-32 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-16 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end border-b border-border pb-8">
          <div>
            <h2 className="text-4xl font-black text-foreground md:text-5xl tracking-tighter uppercase">
              Danh mục nổi bật
            </h2>
            <p className="mt-4 text-sm text-muted-foreground max-w-sm leading-relaxed">
              Tuyển tập trang bị chạy bộ cao cấp được tuyển chọn dành cho mọi
              cung đường. Từ luyện tập hàng ngày đến những cuộc đua quan trọng.
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

        {/* Desktop */}
        <div className="hidden lg:grid grid-cols-12 gap-12 items-start">
          {/* Left */}
          <div className="col-span-5">
            <div className="sticky top-32 h-[60vh] min-h-[460px] rounded-[32px] overflow-hidden bg-zinc-50">
              {visibleCategories.map((category, index) => {
                const image = getCategoryImage(category, index);
                const isActive = index === activeIndex;

                return (
                  <div
                    key={`img-${getCategorySlug(category)}`}
                    className={`absolute inset-0 flex items-center justify-center p-10 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isActive
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-95 pointer-events-none"
                    }`}
                  >
                    <img
                      src={image}
                      alt={getCategoryName(category)}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right */}
          <div className="col-span-7">
            <div className="flex flex-col">
              {visibleCategories.map((category, index) => {
                const slug = getCategorySlug(category);
                const name = getCategoryName(category);
                const isActive = activeIndex === index;

                return (
                  <Link
                    key={slug}
                    to={`/shop?category=${slug}`}
                    onMouseEnter={() => setActiveIndex(index)}
                    className="group flex items-center justify-between border-b border-zinc-200 py-7"
                  >
                    <span
                      className={`font-black uppercase tracking-[-0.04em] transition-all duration-500 ${
                        isActive
                          ? "text-zinc-950 text-5xl"
                          : "text-zinc-300 text-4xl group-hover:text-zinc-500"
                      }`}
                    >
                      {name}
                    </span>

                    <span
                      className={`flex items-center justify-center rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isActive
                          ? "h-14 w-14 bg-zinc-950 text-white -rotate-45"
                          : "h-14 w-14 bg-transparent text-transparent translate-x-4"
                      }`}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile */}
        <div className="grid grid-cols-1 gap-5 lg:hidden">
          {visibleCategories.map((category, index) => {
            const name = getCategoryName(category);
            const slug = getCategorySlug(category);
            const image = getCategoryImage(category, index);

            return (
              <Link
                key={slug}
                to={`/shop?category=${slug}`}
                className="group relative overflow-hidden rounded-[24px] bg-zinc-50 border border-zinc-100 h-[340px]"
              >
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <img
                    src={image}
                    alt={name}
                    className="h-[75%] w-[75%] object-contain mix-blend-multiply transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  />
                </div>

                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  <div className="flex justify-end">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md transition-transform duration-300 group-hover:-rotate-45">
                      <ArrowRight className="h-5 w-5" />
                    </span>
                  </div>

                  <h3 className="text-3xl font-black uppercase tracking-[-0.04em] text-zinc-950">
                    {name}
                  </h3>
                </div>
              </Link>
            );
          })}

          <Link
            to="/shop"
            className="mt-4 inline-flex h-14 items-center justify-center gap-3 rounded-full bg-zinc-950 text-sm font-black uppercase tracking-[0.15em] text-white"
          >
            Tất cả danh mục
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

const CategoriesSkeleton = () => {
  return (
    <section className="bg-white py-24 md:py-40">
      <div className="container mx-auto px-4">
        <div className="mb-16 md:mb-24 max-w-4xl">
          <div className="h-16 w-3/4 animate-pulse rounded-xl bg-zinc-100" />
          <div className="mt-8 h-6 w-1/2 animate-pulse rounded-xl bg-zinc-100" />
        </div>

        <div className="hidden lg:grid grid-cols-12 gap-12">
          <div className="col-span-5 h-[600px] animate-pulse rounded-[32px] bg-zinc-100" />
          <div className="col-span-7 flex flex-col gap-10 pt-12">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-20 w-full animate-pulse rounded-xl bg-zinc-100"
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:hidden">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-[380px] w-full animate-pulse rounded-[24px] bg-zinc-100"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
