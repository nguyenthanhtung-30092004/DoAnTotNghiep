import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import heroBg from "../../../assets/hero-bg-new.png";

const HeroBanner = () => {
  return (
    <section className="relative min-h-[90vh] bg-background flex flex-col lg:flex-row overflow-hidden border-b border-border">
      {/* Left side - Typography & Content */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-20 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-block border border-foreground/10 bg-foreground/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-foreground mb-8">
            Bộ sưu tập 2026
          </span>

          <h1 className="text-6xl sm:text-7xl lg:text-[5.5rem] font-black leading-[0.9] tracking-tighter text-foreground mb-8 uppercase">
            Chạy xa hơn.
            <br />
            Bứt tốc.
            <br />
            Mạnh mẽ.
          </h1>

          <p className="max-w-md text-lg leading-relaxed text-muted-foreground mb-10">
            Giày chạy bộ và trang phục thể thao được tuyển chọn gắt gao. Hiệu suất tối đa, không
            thỏa hiệp.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/shop"
              className="group flex h-14 items-center justify-center gap-3 bg-foreground px-8 text-sm font-bold uppercase tracking-widest text-background transition-all hover:bg-foreground/90 rounded-none"
            >
              Mua ngay
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/shop?sort=newest"
              className="flex h-14 items-center justify-center border border-foreground px-8 text-sm font-bold uppercase tracking-widest text-foreground transition-all hover:bg-foreground/5 rounded-none"
            >
              Hàng mới về
            </Link>
          </div>

          {/* Stats */}
          {/* <div className="mt-16 flex items-center gap-8 border-t border-border pt-8">
            <div>
              <p className="text-3xl font-black text-foreground tracking-tighter">500+</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">
                Sản phẩm
              </p>
            </div>
            <div>
              <p className="text-3xl font-black text-foreground tracking-tighter">50+</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">
                Thương hiệu
              </p>
            </div>
            <div>
              <p className="text-3xl font-black text-foreground tracking-tighter">10K+</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">
                Khách hàng
              </p>
            </div>
          </div> */}
        </motion.div>
      </div>

      {/* Right side - Full Bleed Image */}
      <div className="w-full lg:w-1/2 h-[50vh] lg:h-auto relative bg-zinc-950">
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <img src={heroBg} alt="RunVault Hero" className="w-full h-full object-cover opacity-90" />
          {/* Subtle gradient to blend edges on mobile */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent lg:hidden" />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroBanner;
