import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import banner from "../../../assets/banner.png";

const BannerTop = () => {
  return (
    <section className="relative min-h-[680px] overflow-hidden bg-black">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${banner})`,
          backgroundPosition: "center 30%",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

      <div className="container relative z-10 flex min-h-[680px] items-center">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-white backdrop-blur">
            RunVault 2026 Collection
          </span>

          <h1 className="mt-6 text-5xl font-black leading-[1.02] text-white sm:text-6xl lg:text-7xl">
            Chạy xa hơn.
            <br />
            Bứt tốc mạnh hơn.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-white/80 sm:text-lg">
            Khám phá giày chạy bộ, trang phục và phụ kiện thể thao được chọn lọc
            cho hiệu suất, độ bền và sự thoải mái mỗi ngày.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/shop"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-primary px-7 font-bold text-primary-foreground shadow-xl transition hover:bg-secondary"
            >
              Mua sắm ngay
              <ArrowRight className="size-4" />
            </Link>

            <Link
              to="/shop?sort=newest"
              className="inline-flex h-14 items-center justify-center rounded-2xl border border-white/25 bg-white/10 px-7 font-bold text-white backdrop-blur transition hover:bg-white hover:text-black"
            >
              Hàng mới về
            </Link>
          </div>

          <div className="mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
            <Benefit icon={Truck} title="Giao nhanh" />
            <Benefit icon={RotateCcw} title="Đổi trả dễ dàng" />
            <Benefit icon={ShieldCheck} title="Hàng chính hãng" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Benefit = ({ icon: Icon, title }) => {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white backdrop-blur">
      <Icon className="size-5 text-primary" />
      <span className="text-sm font-semibold">{title}</span>
    </div>
  );
};

export default BannerTop;
