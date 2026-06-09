import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const RevealStagger = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
};

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-24 pb-16 md:pt-32 md:pb-24 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <RevealStagger>
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
              Thiết kế tối giản cho cuộc sống hiện đại.
            </h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-[65ch]">
              Chúng tôi tin rằng những sản phẩm tốt nhất là những sản phẩm tĩnh lặng. Không cầu kỳ, không phô trương, chỉ tập trung vào việc giải quyết trọn vẹn nhu cầu của bạn mỗi ngày.
            </p>
            <div className="flex gap-4">
              <Link to="/shop" className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors">
                Xem sản phẩm
              </Link>
            </div>
          </div>
        </RevealStagger>
        <RevealStagger delay={0.2}>
          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
            <img 
              src="https://picsum.photos/seed/minimal-workspace/800/600" 
              alt="Không gian làm việc tối giản" 
              className="w-full h-full object-cover"
            />
          </div>
        </RevealStagger>
      </section>

      {/* Values Section - Bento Grid */}
      <section className="container mx-auto px-4 py-24 lg:px-8 border-t border-border">
        <RevealStagger>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-12">Giá trị cốt lõi</h2>
        </RevealStagger>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RevealStagger delay={0.1}>
            <div className="bg-muted/50 p-8 rounded-2xl h-full border border-border">
              <h3 className="text-xl font-bold mb-3">Chất lượng thực</h3>
              <p className="text-muted-foreground">
                Mỗi vật liệu được chọn lọc cẩn thận để đảm bảo độ bền bỉ qua năm tháng. Chúng tôi không thỏa hiệp với các vật liệu thay thế rẻ tiền.
              </p>
            </div>
          </RevealStagger>
          <RevealStagger delay={0.2}>
            <div className="bg-muted/50 p-8 rounded-2xl h-full border border-border">
              <h3 className="text-xl font-bold mb-3">Thẩm mỹ tĩnh lặng</h3>
              <p className="text-muted-foreground">
                Loại bỏ mọi chi tiết trang trí thừa. Vẻ đẹp đến từ tỷ lệ cân đối và bề mặt hoàn thiện xuất sắc.
              </p>
            </div>
          </RevealStagger>
          <RevealStagger delay={0.3}>
            <div className="bg-primary text-primary-foreground p-8 rounded-2xl h-full shadow-primary-glow">
              <h3 className="text-xl font-bold mb-3">Trách nhiệm</h3>
              <p className="text-primary-foreground/90">
                Sản xuất có đạo đức và quy trình tối ưu nhằm giảm thiểu tác động đến môi trường. Một sản phẩm tốt phải tốt cho tất cả.
              </p>
            </div>
          </RevealStagger>
        </div>
      </section>
      
      {/* Team / Origin Section */}
      <section className="container mx-auto px-4 py-24 lg:px-8 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <RevealStagger>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Bắt đầu từ một nhu cầu đơn giản.</h2>
              <p className="text-muted-foreground text-lg mb-6 max-w-[65ch]">
                Năm 2021, chúng tôi không thể tìm thấy những vật dụng văn phòng đáp ứng được yêu cầu về thẩm mỹ lẫn độ bền. Hầu hết các sản phẩm trên thị trường đều quá rườm rà hoặc quá nhanh hỏng.
              </p>
              <p className="text-muted-foreground text-lg max-w-[65ch]">
                Đó là lý do thương hiệu này ra đời. Từ một xưởng nhỏ, chúng tôi dần phát triển thành một đội ngũ những người đam mê thiết kế và chế tác.
              </p>
            </RevealStagger>
          </div>
          <div className="lg:col-span-7 order-1 lg:order-2">
            <RevealStagger delay={0.2}>
              <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-muted">
                <img 
                  src="https://picsum.photos/seed/craftsman-studio/1000/600" 
                  alt="Xưởng chế tác của chúng tôi" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </RevealStagger>
          </div>
        </div>
      </section>
    </div>
  );
}
