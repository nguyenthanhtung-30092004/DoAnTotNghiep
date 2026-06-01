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

const getCategoryName = (cat) => cat.name || cat.nameCategory || cat.title || "Danh mục";
const getCategorySlug = (cat) => cat.slug || cat.slugCategory || cat._id;
const getCategoryImage = (cat, index) =>
  cat.image?.url || cat.image || cat.imageCategory?.url || cat.imageCategory || fallbackImages[index % fallbackImages.length];

const isParentCategory = (cat) => !(cat.parent || cat.parentId || cat.parentCategory || cat.parent?._id);

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await CategoryService.getAllCategories({ limit: 100 });
        setCategories(getList(res));
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

  if (loading) {
    return (
      <section className="bg-background py-24">
        <div className="container">
          <div className="h-10 w-48 bg-muted animate-pulse mb-12 rounded-none" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            <div className="h-[400px] bg-muted animate-pulse" />
            <div className="grid grid-cols-2 gap-1">
              <div className="h-[198px] bg-muted animate-pulse" />
              <div className="h-[198px] bg-muted animate-pulse" />
              <div className="h-[198px] bg-muted animate-pulse" />
              <div className="h-[198px] bg-muted animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (parentCategories.length === 0) return null;

  const [heroCategory, ...restCategories] = parentCategories.slice(0, 5);

  return (
    <section className="bg-background py-24 border-b border-border">
      <div className="container">
        <div className="mb-16 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-4xl font-black text-foreground md:text-5xl tracking-tighter uppercase">
              Danh mục
            </h2>
            <p className="mt-4 text-sm text-muted-foreground max-w-sm leading-relaxed">
              Từ đường nhựa thành phố đến địa hình đồi núi — trang bị của bạn bắt đầu từ đây.
            </p>
          </div>
          <Link
            to="/shop"
            className="group inline-flex items-center gap-3 border border-foreground px-6 py-3 text-xs font-bold uppercase tracking-widest text-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            Tất cả danh mục
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Brutalist Grid Layout: Uses 1px gaps for sharp borders */}
        <div className="grid grid-cols-1 gap-1 md:grid-cols-2 bg-border border border-border">
          {heroCategory && (
            <CategoryTile
              category={heroCategory}
              index={0}
              large
              className="h-[400px] md:h-[500px] bg-background"
            />
          )}

          <div className="grid grid-cols-2 gap-1 bg-border">
            {restCategories.slice(0, 4).map((cat, i) => (
              <CategoryTile
                key={getCategorySlug(cat)}
                category={cat}
                index={i + 1}
                className="h-[200px] md:h-[250px] bg-background"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const CategoryTile = ({ category, index, large = false, className = "" }) => {
  const name = getCategoryName(category);
  const slug = getCategorySlug(category);
  const image = getCategoryImage(category, index);

  return (
    <Link
      to={`/shop?category=${slug}`}
      className={`group relative overflow-hidden block ${className}`}
    >
      <img
        src={image}
        alt={name}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105 grayscale group-hover:grayscale-0"
      />
      <div className="absolute inset-0 bg-black/50 transition-colors duration-500 group-hover:bg-black/20" />
      
      <div className="relative z-10 flex h-full flex-col justify-between p-6 md:p-8">
        <div className="flex justify-end">
          <ArrowRight className="h-6 w-6 text-white opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:-rotate-45" />
        </div>
        
        <div>
          <h3
            className={`font-black uppercase tracking-tighter text-white leading-none ${
              large ? "text-4xl md:text-6xl" : "text-2xl md:text-3xl"
            }`}
          >
            {name}
          </h3>
        </div>
      </div>
    </Link>
  );
};

export default Categories;
