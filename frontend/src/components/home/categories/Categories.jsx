import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
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
  return category.name || category.nameCategory || category.title || "Category";
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

const getBentoGridClasses = (index) => {
  switch (index) {
    case 0:
      return "md:col-span-7";
    case 1:
      return "md:col-span-5";
    case 2:
      return "md:col-span-5";
    case 3:
      return "md:col-span-7";
    default:
      return "md:col-span-12";
  }
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

  const visibleCategories = parentCategories.slice(0, 4);

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="mb-16 md:mb-24 max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-zinc-950">
            Danh mục nổi bật
          </h2>
          <p className="mt-6 text-lg text-zinc-600 leading-relaxed max-w-[65ch]">
            Tuyển tập các danh mục sản phẩm cốt lõi. Hiệu suất cao, thiết kế
            chuẩn xác dành cho cả tập luyện hàng ngày và thi đấu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          {visibleCategories.map((category, index) => {
            const name = getCategoryName(category);
            const slug = getCategorySlug(category);
            const image = getCategoryImage(category, index);
            const gridClass = getBentoGridClasses(index);

            return (
              <Link
                key={slug}
                to={`/shop?category=${slug}`}
                className={`group relative block h-[480px] md:h-[640px] w-full overflow-hidden bg-zinc-100 ${gridClass}`}
              >
                <img
                  src={image}
                  alt={name}
                  className="absolute inset-0 h-full w-full object-contain mix-blend-multiply transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-90" />
                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-8 md:p-10 z-10">
                  <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
                    {name}
                  </h3>

                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-zinc-950 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110">
                    <ArrowRight className="h-6 w-6 -rotate-45 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-0" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const CategoriesSkeleton = () => {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="mb-16 md:mb-24 max-w-2xl">
          <div className="h-16 w-3/4 animate-pulse bg-zinc-200" />
          <div className="mt-6 h-6 w-1/2 animate-pulse bg-zinc-100" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          <div className="md:col-span-8 h-[480px] md:h-[640px] w-full animate-pulse bg-zinc-100" />
          <div className="md:col-span-4 h-[480px] md:h-[640px] w-full animate-pulse bg-zinc-100" />
          <div className="md:col-span-5 h-[480px] md:h-[640px] w-full animate-pulse bg-zinc-100" />
          <div className="md:col-span-7 h-[480px] md:h-[640px] w-full animate-pulse bg-zinc-100" />
        </div>
      </div>
    </section>
  );
};

export default Categories;
