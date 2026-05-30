import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import bannerImg from "../../../assets/banner.png";

const stories = [
  {
    stat: "42km",
    label: "Marathon",
    desc: "Không phải ai sinh ra cũng là runner. Nhưng bất cứ ai cũng có thể trở thành một.",
  },
  {
    stat: "5AM",
    label: "Mỗi sáng",
    desc: "Chiếc giày đúng, áo đúng, khoảnh khắc đó là của bạn.",
  },
  {
    stat: "∞",
    label: "Cung đường",
    desc: "Từ đường nhựa thành phố đến đỉnh núi mây mù — RunVault đồng hành.",
  },
];

const StoryBanner = () => {
  return (
    <section className="relative overflow-hidden bg-zinc-950 py-20">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-luminosity"
        style={{ backgroundImage: `url(${bannerImg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-950/90 to-primary/10" />

      {/* Decorative blobs */}
      <div className="absolute -right-24 top-10 h-96 w-96 rounded-full bg-primary/15 blur-[100px]" />
      <div className="absolute -left-24 bottom-10 h-72 w-72 rounded-full bg-primary/10 blur-[80px]" />
      {/* Noise texture for depth */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="container relative z-10">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* Left — storytelling text */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-primary">
              Câu chuyện của chúng tôi
            </span>

            <h2 className="mt-7 text-4xl font-black leading-tight text-white md:text-5xl tracking-tight">
              Được tạo ra
              <br />
              <span className="text-primary">cho những người</span>
              <br />
              không bao giờ dừng lại.
            </h2>

            <p className="mt-6 max-w-md text-base leading-relaxed text-zinc-300">
              RunVault được xây dựng bởi những người chạy bộ, dành cho những
              người chạy bộ. Chúng tôi hiểu cảm giác của đôi giày hoàn hảo trên
              mỗi cung đường — và chúng tôi ở đây để giúp bạn tìm thấy nó.
            </p>

            <Link
              to="/shop"
              className="group mt-10 inline-flex items-center gap-3 rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:scale-105"
            >
              Khám phá bộ sưu tập
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Right — stat cards */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 gap-4"
          >
            {stories.map((s, i) => (
              <motion.div
                key={s.stat}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                className="flex items-center gap-5 rounded-2xl border border-white/5 bg-white/5 px-6 py-5 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-primary/10"
              >
                <div className="shrink-0 text-center min-w-[70px]">
                  <p className="text-3xl font-black text-white">{s.stat}</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                    {s.label}
                  </p>
                </div>
                <div className="h-12 w-px bg-white/10" />
                <p className="text-sm leading-relaxed text-zinc-300">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StoryBanner;
