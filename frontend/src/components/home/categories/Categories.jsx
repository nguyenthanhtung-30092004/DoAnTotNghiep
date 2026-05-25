import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

import giaytrail from "../../../assets/Giaytrail.png";
import giayroad from "../../../assets/Giayroad.png";
import aonam from "../../../assets/aonam.png";
import quannam from "../../../assets/quannam.png";
import dongho from "../../../assets/dongho.png";
import dinhduong from "../../../assets/dinhduong.png";
import CategoryService from "../../../services/category.service";

const fallbackImages = [giayroad, giaytrail, aonam, quannam, dongho, dinhduong];

const fallbackDescriptions = [
  "Tốc độ. Êm ái. Bứt phá.",
  "Bám đường. Vượt mọi địa hình.",
  "Thoáng mát. Linh hoạt.",
  "Chuyển động thoải mái.",
  "Công nghệ. Hiệu suất.",
  "Năng lượng. Phục hồi.",
];

const getResponseData = (res) => {
  return res.data?.metadata || res.data?.data || res.data;
};

const getList = (data) => {
  if (Array.isArray(data)) return data;
  return data?.categories || data?.items || data?.data || [];
};

const getCategoryName = (category) => {
  return (
    category.name ||
    category.nameCategory ||
    category.categoryName ||
    category.title ||
    "Danh mục"
  );
};

const getCategorySlug = (category) => {
  return category.slug || category.slugCategory || category._id;
};

const getCategoryImage = (category, index) => {
  return (
    category.image?.url ||
    category.image ||
    category.thumbnail?.url ||
    category.thumbnail ||
    category.icon?.url ||
    category.icon ||
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
    category.parentCategoryId ||
    category.parent?._id
  );
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const res = await CategoryService.getAllCategories({ limit: 100 });

      const data = getResponseData(res);
      console.log(data);
      setCategories(getList(data));
    } catch (error) {
      console.log(error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const parentCategories = useMemo(() => {
    return categories
      .filter((category) => !category.isDeleted)
      .filter(isParentCategory);
  }, [categories]);

  if (loading) {
    return (
      <section className="bg-background py-20">
        <div className="container flex justify-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Đang tải danh mục...
          </div>
        </div>
      </section>
    );
  }

  if (parentCategories.length === 0) return null;

  return (
    <section className="bg-background py-20">
      <div className="container">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-primary">
            Danh mục
          </p>

          <h2 className="text-4xl font-black uppercase leading-tight text-foreground md:text-5xl">
            Khám phá tất cả danh mục
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
            Tìm kiếm sản phẩm phù hợp với phong cách chạy bộ và luyện tập của
            bạn.
          </p>

        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          {parentCategories.map((category, index) => {
            let className = "";

            // 3 ô trên
            if (index === 0) {
              className = "md:col-span-5 h-[420px]";
            } else if (index === 1) {
              className = "md:col-span-3 h-[420px]";
            } else if (index === 2) {
              className = "md:col-span-4 h-[420px]";
            }

            // 4 ô dưới
            else {
              className = "md:col-span-3 h-[260px]";
            }

            return (
              <CategoryTile
                key={category._id || getCategorySlug(category)}
                category={category}
                index={index}
                large={index < 3}
                className={className}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

const CategoryTile = ({ category, index, className = "", large = false }) => {
  const name = getCategoryName(category);
  const slug = getCategorySlug(category);
  const image = getCategoryImage(category, index);

  const description =
    category.description ||
    fallbackDescriptions[index % fallbackDescriptions.length];

  return (
    <a
      href={`/shop?category=${slug}`}
      className={`group relative overflow-hidden rounded-[2rem] ${className}`}
    >
      <img
        src={image}
        alt={name}
        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-black/45 transition duration-500 group-hover:bg-black/30" />

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

      <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-8">
        <h3
          className={`font-black uppercase leading-none text-white ${
            large ? "text-4xl md:text-5xl" : "text-2xl md:text-3xl"
          }`}
        >
          {name}
        </h3>

        {large && (
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/80">
            {description}
          </p>
        )}

        <div className="mt-5 inline-flex w-fit items-center gap-2 border-b border-primary pb-1 text-xs font-black uppercase tracking-[0.2em] text-white">
          Chi tiết
          <ArrowRight className="size-4 transition group-hover:translate-x-1" />
        </div>
      </div>
    </a>
  );
};

export default Categories;
