import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import bannerImg from "../../../assets/banner.png";
import heroShoeImg from "../../../assets/hero-shoe.png";

const HeroBanner = () => {
  return (
    <section className="relative min-h-[80vh] overflow-hidden bg-zinc-950">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity"
        style={{
          backgroundImage: `url(${bannerImg})`,
          backgroundPosition: "center 35%",
        }}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-zinc-950/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent" />

      {/* Content */}
      <div className="container relative z-10 flex min-h-[80vh] items-center py-16">
        <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Badge */}
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              RunVault · Bộ sưu tập 2026
            </span>

            {/* Headline */}
            <h1 className="mt-7 text-5xl font-black leading-[1.0] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl">
              Chạy xa hơn.
              <br />
              <span className="text-primary">Bứt tốc</span>
              <br />
              mạnh hơn.
            </h1>

            {/* Sub-headline */}
            <p className="mt-6 max-w-lg text-base leading-relaxed text-zinc-300 sm:text-lg">
              Giày chạy bộ, trang phục và phụ kiện thể thao được chọn lọc cho
              hiệu suất, độ bền và sự thoải mái trên mọi cung đường.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/shop"
                className="group inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-primary px-8 text-sm font-bold text-primary-foreground shadow-lg transition-all duration-300 hover:bg-primary/90 hover:scale-105 hover:shadow-primary/30"
              >
                Mua ngay
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>

              <Link
                to="/shop?sort=newest"
                className="inline-flex h-14 items-center justify-center rounded-full border border-white/15 bg-white/5 px-8 text-sm font-bold text-white backdrop-blur transition-all duration-300 hover:bg-white/10 hover:border-white/30 hover:scale-105"
              >
                Xem bộ sưu tập
              </Link>
            </div>

            {/* Stats row */}
            <div className="mt-12 flex items-center gap-0 divide-x divide-white/10">
              {[
                { num: "500+", label: "Sản phẩm" },
                { num: "50+", label: "Thương hiệu" },
                { num: "10K+", label: "Khách hàng" },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className={`${i === 0 ? "pr-8" : "px-8"}`}
                >
                  <p className="text-2xl font-black text-white">{stat.num}</p>
                  <p className="text-[11px] text-zinc-400 mt-1 uppercase tracking-widest font-semibold">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — hero shoe image */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex flex-col items-center justify-center gap-6"
          >
            <div className="relative">
              {/* Subtle radial glow behind shoe */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-primary/20 blur-[80px]" />
              <img
                src={heroShoeImg}
                alt="Giày chạy bộ RunVault"
                className="relative z-10 w-full max-w-lg object-contain drop-shadow-2xl mix-blend-normal"
              />
            </div>
            {/* Mini trust badge under shoe */}
            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 pl-2 pr-5 py-2 backdrop-blur">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                <svg
                  className="h-4 w-4 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </span>
              <div>
                <p className="text-[11px] font-bold text-white uppercase tracking-wider">Chính hãng 100%</p>
                <p className="text-[10px] text-zinc-400">
                  Nhập khẩu trực tiếp
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
      >
        <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-zinc-500">
          Cuộn xuống
        </span>
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="h-8 w-px bg-gradient-to-b from-zinc-500/60 to-transparent"
        />
      </motion.div>
    </section>
  );
};

export default HeroBanner;
