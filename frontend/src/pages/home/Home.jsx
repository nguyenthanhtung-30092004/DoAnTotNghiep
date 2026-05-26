import React from "react";
import HeroBanner from "../../components/home/banners/BannerTop";
import Brands from "../../components/home/brands/Brands";
import Categories from "../../components/home/categories/Categories";
import FeaturedProducts from "../../components/home/products/FeaturedProducts";
import Benefits from "../../components/home/benefits/Benefits";
import StoryBanner from "../../components/home/storytelling/StoryBanner";

const Home = () => {
  return (
    <div className="bg-white">
      {/* 1. Hero — ấn tượng đầu tiên */}
      <HeroBanner />

      {/* 2. Brands carousel — tín nhiệm thương hiệu */}
      <Brands />

      {/* 3. Category grid — dẫn người dùng vào đúng ngách */}
      <Categories />

      {/* 4. Featured products — hàng nổi bật / mới nhất */}
      <FeaturedProducts />

      {/* 5. Benefits — xây dựng niềm tin */}
      <Benefits />

      {/* 6. Story Banner — lifestyle / brand storytelling */}
      <StoryBanner />
    </div>
  );
};

export default Home;
