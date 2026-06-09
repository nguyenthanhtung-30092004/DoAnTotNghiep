import React, { useState } from 'react';
import { motion } from 'framer-motion';

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

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Fake request
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="container mx-auto px-4 pt-24 pb-24 md:pt-32 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Info */}
          <div className="max-w-md">
            <RevealStagger>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-6">
                Liên hệ với chúng tôi.
              </h1>
              <p className="text-muted-foreground text-lg mb-12">
                Dù bạn có câu hỏi về sản phẩm, cần hỗ trợ kỹ thuật hay muốn hợp tác, đội ngũ của chúng tôi luôn sẵn sàng lắng nghe.
              </p>
            </RevealStagger>

            <div className="space-y-8">
              <RevealStagger delay={0.1}>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Trụ sở chính</h3>
                  <p className="text-lg">Tòa nhà Innovation, Tầng 4<br />Quận 1, Thành phố Hồ Chí Minh</p>
                </div>
              </RevealStagger>

              <RevealStagger delay={0.2}>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Liên lạc trực tiếp</h3>
                  <p className="text-lg mb-1">
                    <a href="mailto:hello@example.com" className="hover:text-primary transition-colors">hello@example.com</a>
                  </p>
                  <p className="text-lg">
                    <a href="tel:+84123456789" className="hover:text-primary transition-colors">+84 (123) 456 789</a>
                  </p>
                </div>
              </RevealStagger>
              
              <RevealStagger delay={0.3}>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Giờ làm việc</h3>
                  <p className="text-lg text-muted-foreground">Thứ Hai - Thứ Sáu, 9:00 sáng đến 6:00 chiều.</p>
                </div>
              </RevealStagger>
            </div>
          </div>

          {/* Form */}
          <div>
            <RevealStagger delay={0.2}>
              <div className="bg-card p-6 md:p-10 rounded-3xl shadow-soft border border-border">
                {success ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Tin nhắn đã được gửi</h3>
                    <p className="text-muted-foreground">
                      Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc.
                    </p>
                    <button 
                      onClick={() => setSuccess(false)}
                      className="mt-8 text-primary font-medium hover:underline"
                    >
                      Gửi tin nhắn khác
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label htmlFor="name" className="text-sm font-medium">Họ và tên</label>
                        <input 
                          type="text" 
                          id="name" 
                          name="name" 
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-sm font-medium">Email</label>
                        <input 
                          type="email" 
                          id="email" 
                          name="email" 
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label htmlFor="subject" className="text-sm font-medium">Chủ đề</label>
                      <input 
                        type="text" 
                        id="subject" 
                        name="subject" 
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                      />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label htmlFor="message" className="text-sm font-medium">Tin nhắn</label>
                      <textarea 
                        id="message" 
                        name="message" 
                        rows="5" 
                        required
                        value={formData.message}
                        onChange={handleChange}
                        className="px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none" 
                      ></textarea>
                      <p className="text-xs text-muted-foreground mt-1">Chúng tôi không chia sẻ thông tin của bạn với bên thứ ba.</p>
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-primary text-primary-foreground py-3.5 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-70 flex justify-center items-center"
                    >
                      {isSubmitting ? (
                        <span className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></span>
                      ) : (
                        "Gửi tin nhắn"
                      )}
                    </button>
                  </form>
                )}
              </div>
            </RevealStagger>
          </div>
        </div>
      </section>
    </div>
  );
}
