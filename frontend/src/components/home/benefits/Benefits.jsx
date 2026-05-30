import React from "react";
import { ShieldCheck, RotateCcw, Truck, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Hàng chính hãng 100%",
    desc: "Tất cả sản phẩm được nhập khẩu trực tiếp và có giấy chứng nhận chính hãng rõ ràng.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Truck,
    title: "Giao nhanh toàn quốc",
    desc: "Giao hàng trong 1–3 ngày làm việc. Miễn phí vận chuyển cho đơn từ 500.000đ.",
    color: "text-emerald-600",
    bg: "bg-emerald-500/10",
  },
  {
    icon: RotateCcw,
    title: "Đổi trả trong 30 ngày",
    desc: "Không vừa size? Chúng tôi đổi trả miễn phí trong 30 ngày kể từ ngày mua.",
    color: "text-amber-600",
    bg: "bg-amber-500/10",
  },
  {
    icon: MessageCircle,
    title: "Tư vấn size miễn phí",
    desc: "Đội ngũ runner chuyên nghiệp sẵn sàng tư vấn chọn size, model phù hợp nhất cho bạn.",
    color: "text-rose-600",
    bg: "bg-rose-500/10",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const Benefits = () => {
  return (
    <section className="bg-background py-16 border-t border-border">
      <div className="container">
        {/* Section header */}
        <div className="mb-10 text-center">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-primary">
            Cam kết của chúng tôi
          </p>
          <h2 className="text-2xl font-black text-foreground md:text-3xl tracking-tight">
            Mua sắm không lo lắng
          </h2>
        </div>

        {/* Cards */}
        <motion.div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.title}
                variants={itemVariants}
                className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-border hover:shadow-md hover:-translate-y-1"
              >
                {/* Icon */}
                <div
                  className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl ${b.bg}`}
                >
                  <Icon className={`h-6 w-6 ${b.color}`} />
                </div>

                {/* Text */}
                <h3 className="text-[15px] font-bold text-foreground">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {b.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Benefits;
