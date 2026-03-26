import { ChevronRight, ChevronLeft } from "lucide-react"; // Cập nhật import ChevronLeft
import React, { useEffect, useState } from "react";

const categories = [
  { name: "Giày Trail", count: "64 sản phẩm", emoji: "🥾", bg: "bg-accent" },
  { name: "Giày Road", count: "60 sản phẩm", emoji: "👟", bg: "bg-primary/5" },
  { name: "Quần áo", count: "86 sản phẩm", emoji: "👕", bg: "bg-accent" },
  { name: "Phụ kiện", count: "53 sản phẩm", emoji: "🎒", bg: "bg-primary/5" },
  { name: "Thiết bị", count: "40 sản phẩm", emoji: "⌚", bg: "bg-accent" },
  { name: "Dinh dưỡng", count: "30 sản phẩm", emoji: "🥤", bg: "bg-primary/5" },
];

const Categories = () => {
  // Nhân bản mảng 3 lần để tạo hiệu ứng vòng lặp (giống prepent/append)
  const extendedCategories = [...categories, ...categories, ...categories];

  // Bắt đầu ở vị trí mảng giữa
  const [currentIndex, setCurrentIndex] = useState(categories.length);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Hàm next (Tương tự: Thêm phần tử đầu xuống cuối)
  const nextSlide = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  // Hàm pre (Tương tự: Prepend phần tử cuối lên đầu)
  const prevSlide = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

  // Xử lý khi trượt hết mảng (Tạo cảm giác infinite)
  const handleTransitionEnd = () => {
    if (currentIndex <= 0) {
      setIsTransitioning(false);
      setCurrentIndex(categories.length);
    } else if (currentIndex >= categories.length * 2) {
      setIsTransitioning(false);
      setCurrentIndex(categories.length);
    }
  };

  // Bật lại transition sau khi đã thực hiện "bước nhảy âm thầm"
  useEffect(() => {
    if (!isTransitioning) {
      const timeout = setTimeout(() => setIsTransitioning(true), 50);
      return () => clearTimeout(timeout);
    }
  }, [isTransitioning]);

  // 4. Xử lý Auto Slide & Đi vào sẽ không Auto
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <section className="py-20 w-full bg-background-soft">
      <div className="container relative flex flex-col items-center">
        {/* Title */}
        <div className="text-center w-full mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Browser
          </span>
          <h2 className="text-3xl font-bold mt-1">Shop by Category</h2>
        </div>

        {/* Content - Bọc ngoài cùng */}
        <div
          className="overflow-hidden w-[80%]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className={`flex ${isTransitioning ? "transition-transform duration-500 ease-in-out" : ""}`}
            style={{
              transform: `translateX(-${currentIndex * (100 / 3)}%)`,
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extendedCategories.map((cat, i) => (
              <div
                key={`${cat.name}-${i}`}
                className="w-1/3 flex-shrink-0 px-3"
              >
                <a
                  href="#"
                  className={`group ${cat.bg} rounded-2xl h-full p-8 flex flex-col items-center gap-4 hover:shadow-card-hover transition-all duration-300`}
                >
                  <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
                    {cat.emoji}
                  </span>
                  <div className="text-center">
                    <h3 className="font-bold text-lg">{cat.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {cat.count}
                    </p>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <button
          onClick={prevSlide}
          className="size-12 absolute top-1/2 translate-y-[30px] left-24 rounded-full flex items-center justify-center text-white bg-primary hover:bg-primary/90 transition-colors z-10"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={nextSlide}
          className="size-12 absolute top-1/2 translate-y-[30px] right-24 rounded-full flex items-center justify-center text-white bg-primary hover:bg-primary/90 transition-colors z-10"
        >
          <ChevronRight />
        </button>
      </div>
    </section>
  );
};

export default Categories;
