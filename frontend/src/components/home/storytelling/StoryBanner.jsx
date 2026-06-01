import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import storyBg from "../../../assets/story-bg.png";

const stories = [
  {
    stat: "42KM",
    label: "Giới hạn",
    desc: "Được sinh ra để phá vỡ.",
  },
  {
    stat: "5AM",
    label: "Bắt đầu",
    desc: "Khi cả thế giới còn đang ngủ.",
  },
  {
    stat: "∞",
    label: "Đam mê",
    desc: "Không có điểm dừng.",
  },
];

const StoryBanner = () => {
  return (
    <section className="relative overflow-hidden bg-zinc-950 h-screen min-h-[700px] flex items-center border-b border-border">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={storyBg}
          alt="RunVault Story"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/80 via-zinc-950/20 to-transparent" />
      </div>

      <div className="container relative z-10 w-full">
        <div className="grid grid-cols-1 items-end gap-16 lg:grid-cols-2">
          {/* Left — storytelling text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="pb-12 lg:pb-0"
          >
            <span className="inline-flex items-center gap-2 border border-white/20 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white mb-8">
              Triết lý RunVault
            </span>

            <h2 className="text-5xl font-black leading-[0.9] text-white md:text-7xl tracking-tighter uppercase">
              Không bao giờ
              <br />
              Dừng lại.
            </h2>

            <p className="mt-8 max-w-md text-base leading-relaxed text-zinc-400">
              Sứ mệnh của chúng tôi không chỉ là bán giày. 
              Chúng tôi đồng hành cùng bạn từ những bước chân đầu tiên đến vạch đích cuối cùng.
            </p>

            <Link
              to="/shop"
              className="group mt-10 inline-flex items-center gap-3 bg-white px-8 py-4 text-sm font-bold text-zinc-950 transition-colors hover:bg-zinc-200 uppercase tracking-widest"
            >
              Khám phá bộ sưu tập
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Right — stat cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 border-t lg:border-t-0 lg:border-l border-white/10 pt-12 lg:pt-0 lg:pl-12"
          >
            {stories.map((s, i) => (
              <div key={s.stat}>
                <p className="text-4xl font-black text-white tracking-tighter">{s.stat}</p>
                <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  {s.label}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                  {s.desc}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StoryBanner;
