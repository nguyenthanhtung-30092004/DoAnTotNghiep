import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import bannerImg from "../../../assets/banner.png";
import heroShoeImg from "../../../assets/hero-shoe.png";

const HeroBanner = () => {
  return (
    <section className="relative min-h-[80vh] overflow-hidden bg-slate-950">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(${bannerImg})`, backgroundPosition: "center 35%" }}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/75 to-slate-950/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

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
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-300 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
              RunVault · Bộ sưu tập 2026
            </span>

            {/* Headline */}
            <h1 className="mt-7 text-5xl font-black leading-[1.0] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl">
              Chạy xa hơn.
              <br />
              <span className="text-indigo-400">Bứt tốc</span>
              <br />
              mạnh hơn.
            </h1>

            {/* Sub-headline */}
            <p className="mt-6 max-w-lg text-base leading-8 text-slate-300 sm:text-lg">
              Giày chạy bộ, trang phục và phụ kiện thể thao được chọn lọc
              cho hiệu suất, độ bền và sự thoải mái trên mọi cung đường.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/shop"
                className="group inline-flex h-14 items-center justify-center gap-2.5 rounded-2xl bg-indigo-600 px-8 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 transition-all duration-300 hover:bg-indigo-500 hover:shadow-indigo-500/50 hover:shadow-xl hover:-translate-y-0.5"
              >
                Mua ngay
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>

              <Link
                to="/shop?sort=newest"
                className="inline-flex h-14 items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-8 text-sm font-bold text-white backdrop-blur transition-all duration-300 hover:bg-white/12 hover:border-white/30"
              >
                Xem bộ sưu tập
              </Link>
            </div>

            {/* Stats row */}
            <div className="mt-10 flex items-center gap-0 divide-x divide-white/10">
              {[
                { num: "500+", label: "Sản phẩm" },
                { num: "50+", label: "Thương hiệu" },
                { num: "10K+", label: "Khách hàng" },
              ].map((stat, i) => (
                <div key={stat.label} className={`${i === 0 ? "pr-6" : "px-6"}`}>
                  <p className="text-xl font-black text-white">{stat.num}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — hero shoe image */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex flex-col items-center justify-center gap-4"
          >
            <div className="relative">
              {/* Subtle radial glow behind shoe */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-40 w-72 rounded-full bg-indigo-600/25 blur-3xl" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-20 w-48 rounded-full bg-indigo-400/20 blur-2xl" />
              <img
                src={heroShoeImg}
                alt="Giày chạy bộ RunVault"
                className="relative z-10 w-full max-w-md object-contain"
                style={{ filter: "drop-shadow(0 20px 40px rgba(99,102,241,0.35)) drop-shadow(0 4px 12px rgba(0,0,0,0.5))" }}
              />
            </div>
            {/* Mini trust badge under shoe */}
            <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/5 px-5 py-3 backdrop-blur">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600/30">
                <svg className="h-4 w-4 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </span>
              <div>
                <p className="text-xs font-bold text-white">Chính hãng 100%</p>
                <p className="text-[10px] text-slate-400">Nhập khẩu trực tiếp</p>
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
        <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-slate-600">Cuộn xuống</span>
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="h-6 w-px bg-gradient-to-b from-slate-500/60 to-transparent"
        />
      </motion.div>
    </section>
  );
};

export default HeroBanner;
