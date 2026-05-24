import React from "react";
import BannerTop from "../../../features/home/components/Banners/BannerTop";
import Brands from "../../../features/home/components/Brands/Brands";
import Categories from "../../../features/home/components/Categories/Categories";
import FeaturedProducts from "../../../features/home/components/Products/FeaturedProducts";

const Home = () => {
  return (
    <main className="bg-background">
      <BannerTop />
      <Brands />
      <Categories />
      <FeaturedProducts />
    </main>
  );
};

export default Home;
