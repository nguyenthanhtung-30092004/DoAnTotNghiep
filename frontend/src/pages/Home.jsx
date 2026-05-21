import React from "react";
import BannerTop from "../components/Banners/BannerTop";
import Brands from "../components/Brands/Brands";
import Categories from "../components/Categories/Categories";
import FeaturedProducts from "../components/Products/FeaturedProducts";

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
