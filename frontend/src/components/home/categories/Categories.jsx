import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

import giaytrail from "../../../assets/Giaytrail.png";
import giayroad from "../../../assets/Giayroad.png";
import aonam from "../../../assets/aonam.png";
import quannam from "../../../assets/quannam.png";
import dongho from "../../../assets/dongho.png";
import dinhduong from "../../../assets/dinhduong.png";
import CategoryService from "../../../services/category.service";

/* ── Helpers (giữ nguyên từ file cũ) ── */
const fallbackImages = [giayroad, giaytrail, aonam, quannam, dongho, dinhduong];

const fallbackDescriptions = [
  "Tốc độ. Êm ái. Bứt phá.",
  "Bám đường. Vượt mọi địa hình.",
  "Thoáng mát. Linh hoạt.",
  "Chuyển động thoải mái.",
  "Công nghệ. Hiệu suất.",
  "Năng lượng. Phục hồi.",
];

const getResponseData = (res) =>
  res.data?.metadata || res.data?.data || res.data;

const getList = (data) => {
  if (Array.isArray(data)) return data;
  return data?.categories || data?.items || data?.data || [];
};

const getCategoryName = (cat) =>
  cat.name || cat.nameCategory || cat.categoryName || cat.title || "Danh mục";

const getCategorySlug = (cat) =>
  cat.slug || cat.slugCategory || cat._id;

const getCategoryImage = (cat, index) =>
  cat.image?.url ||
  cat.image ||
  cat.thumbnail?.url ||
  cat.thumbnail ||
  cat.icon?.url ||
  cat.icon ||
  cat.imageCategory?.url ||
  cat.imageCategory ||
  fallbackImages[index % fallbackImages.length];

const isParentCategory = (cat) =>
  !(cat.parent || cat.parentId || cat.parentCategory || cat.parentCategoryId || cat.parent?._id);

/* ── Component chính ── */
const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await CategoryService.getAllCategories({ limit: 100 });
        const data = getResponseData(res);
        setCategories(getList(data));
      } catch (err) {
        console.error(err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const parentCategories = useMemo(
    () => categories.filter((c) => !c.isDeleted).filter(isParentCategory),
    [categories],
  );

  /* Loading skeleton */
  if (loading) {
    return (
      <section className="bg-white py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <div className="mx-auto mb-3 h-3 w-24 rounded-full bg-slate-100" />
            <div className="mx-auto h-9 w-72 rounded-xl bg-slate-100" />
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-52 rounded-3xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (parentCategories.length === 0) return null;

  /* Hiển thị tối đa 7 danh mục: 1 large + 6 small */
  const [heroCategory, ...restCategories] = parentCategories.slice(0, 7);

  return (
    <section className="bg-white py-16">
      <div className="container">
        {/* Section header */}
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-500">
              Danh mục
            </p>
            <h2 className="text-3xl font-black text-slate-900 md:text-4xl">
              Khám phá theo phong cách
            </h2>
            <p className="mt-2 text-sm text-slate-500 max-w-sm">
              Từ đường nhựa đến địa hình hiểm trở — chọn đúng trang bị cho mỗi chuyến chạy.
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            Tất cả danh mục
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Grid layout: 1 large + 4 small — balanced */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-12">
          {/* Hero tile (first category) — large */}
          {heroCategory && (
            <CategoryTile
              category={heroCategory}
              index={0}
              large
              className="col-span-2 md:col-span-5 h-[360px] md:h-[440px]"
            />
          )}

          {/* 4 smaller tiles — 2×2 on the right */}
          <div className="col-span-2 md:col-span-7 grid grid-cols-2 gap-3">
            {restCategories.slice(0, 4).map((cat, i) => (
              <CategoryTile
                key={cat._id || getCategorySlug(cat)}
                category={cat}
                index={i + 1}
                large={false}
                className="h-[170px] md:h-[210px]"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ── CategoryTile ── */
const CategoryTile = ({ category, index, large = false, className = "" }) => {
  const name = getCategoryName(category);
  const slug = getCategorySlug(category);
  const image = getCategoryImage(category, index);
  const description =
    category.description || fallbackDescriptions[index % fallbackDescriptions.length];

  return (
    <Link
      to={`/shop?category=${slug}`}
      className={`group relative overflow-hidden rounded-3xl ${className}`}
    >
      {/* Image */}
      <img
        src={image}
        alt={name}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />

      {/* Overlay gradient — rõ hơn để chữ dễ đọc */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
      <div className="absolute inset-0 bg-slate-900/15 transition-colors duration-500 group-hover:bg-slate-900/5" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-end p-5 md:p-6">
        <h3
          className={`font-black uppercase leading-none text-white ${
            large ? "text-3xl md:text-4xl lg:text-5xl" : "text-xl md:text-2xl"
          }`}
        >
          {name}
        </h3>

        {large && (
          <p className="mt-3 max-w-xs text-sm leading-6 text-white/75">
            {description}
          </p>
        )}

        <div className="mt-4 inline-flex w-fit items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-white/90 transition-colors group-hover:text-white">
          <span className="border-b border-indigo-400 pb-0.5">Xem ngay</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
};

export default Categories;
