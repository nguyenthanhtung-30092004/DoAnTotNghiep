import React from "react";
import { Link } from "react-router-dom";
import { Footprints, Mail, Phone, MapPin, ArrowRight } from "lucide-react";

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const InstagramIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.45A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.97C5.12 20 12 20 12 20s6.88 0 8.59-.45a2.78 2.78 0 0 0 1.95-1.97A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
  </svg>
);

const footerLinks = {
  shop: {
    title: "Cửa hàng",
    links: [
      { label: "Tất cả sản phẩm", to: "/shop" },
      { label: "Giày chạy bộ", to: "/shop?category=giay-road" },
      { label: "Trang phục", to: "/shop?category=quan-ao" },
      { label: "Phụ kiện", to: "/shop?category=phu-kien" },
      { label: "Dinh dưỡng", to: "/shop?category=dinh-duong" },
    ],
  },
  support: {
    title: "Hỗ trợ",
    links: [
      { label: "Tài khoản của tôi", to: "/account" },
      { label: "Theo dõi đơn hàng", to: "/account" },
      { label: "Liên hệ", to: "/contact" },
      { label: "Chính sách bảo hành", to: "/about" },
      { label: "Hướng dẫn chọn size", to: "/about" },
    ],
  },
  company: {
    title: "Về RunVault",
    links: [
      { label: "Câu chuyện thương hiệu", to: "/about" },
      { label: "Blog chạy bộ", to: "/blog" },
      { label: "Hệ thống cửa hàng", to: "/contact" },
      { label: "Tuyển dụng", to: "/about" },
    ],
  },
};

const socialLinks = [
  { icon: FacebookIcon, label: "Facebook", to: "#" },
  { icon: InstagramIcon, label: "Instagram", to: "#" },
  { icon: YoutubeIcon, label: "Youtube", to: "#" },
];

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      {/* Newsletter strip - Brutalist */}
      <div className="border-b border-background/20">
        <div className="container py-24">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-12">
            <div className="max-w-2xl">
              <span className="inline-block border border-background/20 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-background mb-8">
                Bản tin RunVault
              </span>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-background leading-none">
                Đăng ký ngay. <br />
                Đừng bỏ lỡ.
              </h2>
            </div>
            
            <form onSubmit={(e) => e.preventDefault()} className="w-full lg:w-auto flex flex-col sm:flex-row gap-0">
              <input
                type="email"
                placeholder="EMAIL CỦA BẠN"
                aria-label="Nhập email nhận bản tin"
                className="w-full sm:w-[350px] h-16 bg-transparent border border-background/20 px-6 text-sm font-bold uppercase tracking-widest text-background placeholder-background/40 outline-none focus:border-background transition-colors rounded-none"
              />
              <button
                type="submit"
                className="h-16 px-10 bg-background text-foreground text-sm font-black uppercase tracking-widest hover:bg-background/90 transition-colors flex items-center justify-center gap-3 shrink-0 rounded-none border border-background group"
              >
                Gửi
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="container py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-y-16 gap-x-12">
          
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-8 group inline-flex">
              <div className="w-12 h-12 bg-background flex items-center justify-center transition-transform group-hover:-translate-y-1">
                <Footprints className="h-6 w-6 text-foreground" />
              </div>
              <span className="text-3xl font-black uppercase tracking-tighter text-background">
                RunVault
              </span>
            </Link>

            <p className="text-sm text-background/60 leading-relaxed mb-10 max-w-sm font-medium">
              Đồng hành cùng runner Việt Nam trên mọi cung đường. Chạy xa hơn, bứt tốc mạnh hơn với
              những trang bị thể thao đỉnh cao.
            </p>

            <div className="space-y-6 text-sm font-medium">
              <a
                href="mailto:hello@runvault.vn"
                className="flex items-center gap-4 text-background/60 hover:text-background transition-colors group"
              >
                <div className="w-10 h-10 border border-background/20 flex items-center justify-center group-hover:border-background transition-colors">
                  <Mail className="h-4 w-4" />
                </div>
                hello@runvault.vn
              </a>
              <a
                href="tel:0901234567"
                className="flex items-center gap-4 text-background/60 hover:text-background transition-colors group"
              >
                <div className="w-10 h-10 border border-background/20 flex items-center justify-center group-hover:border-background transition-colors">
                  <Phone className="h-4 w-4" />
                </div>
                0901 234 567
              </a>
              <div className="flex items-center gap-4 text-background/60 group">
                <div className="w-10 h-10 border border-background/20 flex items-center justify-center transition-colors">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="leading-relaxed">123 Đinh Tiên Hoàng, Q.1, TP.HCM</span>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h4 className="text-lg font-black uppercase tracking-tighter text-background mb-8 relative inline-block">
                {section.title}
                <span className="absolute -bottom-2 left-0 w-8 h-1 bg-background/20"></span>
              </h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm font-medium text-background/60 hover:text-background hover:translate-x-1 transition-all duration-200 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-background/20">
        <div className="container py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs font-bold uppercase tracking-widest text-background/40">
            © {new Date().getFullYear()} RunVault. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-background/40">
            <Link to="/about" className="hover:text-background transition-colors">
              Chính sách bảo mật
            </Link>
            <Link to="/about" className="hover:text-background transition-colors">
              Điều khoản
            </Link>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-4">
            {socialLinks.map(({ icon: Icon, label, to }) => (
              <a
                key={label}
                href={to}
                aria-label={label}
                className="text-background/40 hover:text-background transition-colors"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
