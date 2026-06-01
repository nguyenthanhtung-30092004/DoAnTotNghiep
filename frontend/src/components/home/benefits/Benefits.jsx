import React from "react";
import { ShieldCheck, RotateCcw, Truck, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Chính hãng 100%",
    desc: "Nhập khẩu trực tiếp. Đảm bảo chất lượng và nguồn gốc xuất xứ rõ ràng.",
  },
  {
    icon: Truck,
    title: "Giao nhanh toàn quốc",
    desc: "Giao hàng từ 1-3 ngày. Miễn phí vận chuyển cho các đơn hàng trên 500k.",
  },
  {
    icon: RotateCcw,
    title: "Đổi trả 30 ngày",
    desc: "Không vừa vặn? Hãy đổi trả miễn phí trong vòng 30 ngày kể từ ngày mua.",
  },
  {
    icon: MessageCircle,
    title: "Hỗ trợ chuyên sâu",
    desc: "Đội ngũ chuyên gia luôn sẵn sàng tư vấn thiết bị phù hợp nhất cho bạn.",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const Benefits = () => {
  return (
    <section className="bg-foreground text-background py-24">
      <div className="container">
        <div className="mb-16">
          <h2 className="text-4xl font-black md:text-5xl tracking-tighter uppercase max-w-2xl leading-none">
            Mua sắm không thỏa hiệp.
          </h2>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.title}
                variants={itemVariants}
                className="flex flex-col border-t border-background/20 pt-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <Icon className="h-8 w-8" strokeWidth={1.5} />
                  <span className="text-sm font-bold tracking-widest opacity-30">0{idx + 1}</span>
                </div>

                <h3 className="text-xl font-black uppercase tracking-tight mb-4">{b.title}</h3>
                <p className="text-sm leading-relaxed opacity-70">{b.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Benefits;
