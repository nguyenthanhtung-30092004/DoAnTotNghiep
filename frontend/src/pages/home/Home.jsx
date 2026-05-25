import React from "react";
import BannerTop from "../../components/home/banners/BannerTop";
import Brands from "../../components/home/brands/Brands";
import Categories from "../../components/home/categories/Categories";
import FeaturedProducts from "../../components/home/products/FeaturedProducts";

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
