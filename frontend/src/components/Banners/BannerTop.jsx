import React from "react";
import { Button } from "../ui/Button";
import banner from "../../assets/banner.png";
import { motion } from "framer-motion";
const BannerTop = () => {
  return (
    <motion.section
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative overflow-hidden bg-accent min-h-[600px] flex items-center justify-center"
      style={{
        backgroundImage: `url(${banner})`,
        backgroundSize: "cover",
        backgroundPosition: "center 30%",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Lớp phủ (Overlay) giúp text dễ đọc hơn nếu ảnh quá sáng */}
      <div className="absolute inset-0 bg-white/20" />

      <div className="container relative z-10 py-16 md:py-24 lg:py-32 flex flex-col items-center text-center">
        {/* Text Content */}
        <div className="space-y-6 animate-fade-up max-w-3xl">
          <span className="inline-block text-xs text-white font-semibold uppercase tracking-widest text-primary bg-primary rounded-full px-3 py-1">
            New Arrivals 2026
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-[1.05] text-balance">
            Run Further.
            <br />
            Run <span className="text-primary">Faster.</span>
          </h1>

          <p className="text-lg text-white max-w-lg mx-auto leading-relaxed text-pretty">
            Engineered for performance. Built for comfort. Discover the latest
            in running technology that moves with you.
          </p>

          <div className="flex justify-center gap-3 pt-2">
            <Button
              variant="hero"
              className="text-black hover:text-white"
              size="xl"
            >
              Shop Now
            </Button>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default BannerTop;
