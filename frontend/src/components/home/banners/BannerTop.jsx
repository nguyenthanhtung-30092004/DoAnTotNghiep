import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import heroBg from "../../../assets/hero-bg-new.png";

const HeroBanner = () => {
  return (
    <section className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-zinc-950 lg:flex-row">
      {/* ─── Right: Full-bleed hero image (absolute, behind content) ─── */}
      <motion.div
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 lg:left-[42%]"
      >
        <img
          src={heroBg}
          alt="Runner athlete"
          className="h-full w-full object-cover object-center"
        />
        {/* Blend the image into the dark background on the left */}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/70 to-zinc-950/10" />
        {/* Bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
        {/* Top vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/40 via-transparent to-transparent" />
      </motion.div>

      {/* ─── Single accent glow — Electric Blue, restrained ─── */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[5%] top-[20%] h-[500px] w-[500px] rounded-full bg-teal-500/20 blur-[120px]"
      />

      {/* ─── Left: Content column ─── */}
      <div className="relative z-10 flex w-full flex-col justify-center px-6 py-24 sm:px-12 lg:w-[52%] lg:px-24 lg:py-0">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl"
        >
          {/* Eyebrow — one per hero, no more */}
          <span className="mb-8 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-teal-400">
            <span className="h-px w-6 bg-teal-400" />
            Bộ sưu tập 2026
          </span>

          {/* Headline — 2 lines max, tight tracking */}
          <h1 className="text-[clamp(3rem,6vw,5.5rem)] font-black uppercase leading-[0.92] tracking-[-0.04em] text-white">
            Chạy xa hơn.
            <br />
            <em className="not-italic text-teal-400">Mạnh mẽ hơn.</em>
          </h1>

          {/* Subtext — ≤ 20 words */}
          <p className="mt-8 max-w-[48ch] text-base leading-[1.7] text-zinc-400 lg:text-lg">
            Giày và trang phục thể thao được tuyển chọn cho hiệu suất tối đa trên mọi cung đường.
          </p>

          {/* CTAs — 1 primary + 1 secondary, different intents */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            {/* Primary */}
            <Link
              to="/shop"
              className="group inline-flex h-14 items-center gap-3 bg-teal-600 px-7 text-sm font-black uppercase tracking-[0.14em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-500 active:translate-y-0 active:scale-[0.97]"
            >
              Mua ngay
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>

            {/* Secondary */}
            <Link
              to="/shop?sort=newest"
              className="inline-flex h-14 items-center gap-2 border border-white/20 px-7 text-sm font-black uppercase tracking-[0.14em] text-white/80 transition-all duration-300 hover:border-white/40 hover:text-white active:scale-[0.97]"
            >
              Hàng mới về
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroBanner;
