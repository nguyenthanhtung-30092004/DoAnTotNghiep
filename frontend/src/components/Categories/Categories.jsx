import React from "react";
import giaytrail from "../../assets/Giaytrail.png";
import giayroad from "../../assets/Giayroad.png";
import aonam from "../../assets/aonam.png";
import quannam from "../../assets/quannam.png";
import dongho from "../../assets/dongho.png";
import dinhduong from "../../assets/dinhduong.png";
const categories = [
  {
    name: "Giày Trail",
    count: "64 sản phẩm",
    emoji: "🥾",
    bg: "bg-accent",
    image: giaytrail,
  },
  {
    name: "Giày Road",
    count: "60 sản phẩm",
    emoji: "👟",
    bg: "bg-primary/5",
    image: giayroad,
  },
  {
    name: "Áo",
    count: "86 sản phẩm",
    emoji: "👕",
    bg: "bg-accent",
    image: aonam,
  },
  {
    name: "Quần",
    count: "86 sản phẩm",
    emoji: "👖",
    bg: "bg-accent",
    image: quannam,
  },
  {
    name: "Thiết bị",
    count: "40 sản phẩm",
    emoji: "⌚",
    bg: "bg-accent",
    image: dongho,
  },
  {
    name: "Dinh dưỡng",
    count: "30 sản phẩm",
    emoji: "🥤",
    bg: "bg-primary/5",
    image: dinhduong,
  }, // Hiện chưa có ảnh
];

const Categories = () => {
  return (
    <section className="border-t">
      <div className="container w-full flex items-center flex-wrap gap-6">
        {categories.map((item, i) => (
          <a
            key={item.name}
            href=""
            className="h-[500px] w-[calc((100% - 48px) / 3)] bg-accent group border flex flex-col justify-center rounded-lg items-center  overflow-hidden hover:shadow-card-hover"
          >
            <span className="transition-all duration-200 hover:text-white hover:bg-primary z-10 bg-white/80 px-4 py-2 rounded font-bold">
              {item.name}
            </span>
            <img
              src={item.image}
              alt={item.name}
              className="group-hover:scale-105 bg-transparent transition-all duration-300 inset-0 w-full h-full object-cover"
            />
          </a>
        ))}
      </div>
    </section>
  );
};

export default Categories;
