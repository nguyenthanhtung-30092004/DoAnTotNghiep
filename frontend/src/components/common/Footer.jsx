import React from "react";
import { Link } from "react-router-dom";
import { Footprints, Mail, Phone, MapPin } from "lucide-react";

/* Social icons as inline SVGs (lucide-react v1 doesn't export social icons) */
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
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
    className="h-3.5 w-3.5"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.45A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.97C5.12 20 12 20 12 20s6.88 0 8.59-.45a2.78 2.78 0 0 0 1.95-1.97A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
  </svg>
);

const footerLinks = {
  shop: {
    title: "Cửa hàng",
    links: [
      { label: "Giày Trail", to: "/shop/giay-trail" },
      { label: "Giày Road", to: "/shop/giay-road" },
      { label: "Áo & Quần", to: "/shop/ao" },
      { label: "Phụ kiện", to: "/shop/phu-kien" },
      { label: "Dinh dưỡng", to: "/shop/dinh-duong" },
      { label: "Thiết bị", to: "/shop/thiet-bi" },
    ],
  },
  support: {
    title: "Hỗ trợ",
    links: [
      { label: "Chính sách đổi trả", to: "#" },
      { label: "Hướng dẫn chọn size", to: "#" },
      { label: "Vận chuyển & giao hàng", to: "#" },
      { label: "Câu hỏi thường gặp", to: "#" },
      { label: "Liên hệ chúng tôi", to: "#" },
    ],
  },
  company: {
    title: "Về RunVault",
    links: [
      { label: "Giới thiệu", to: "#" },
      { label: "Blog chạy bộ", to: "#" },
      { label: "Sự kiện", to: "#" },
      { label: "Tuyển dụng", to: "#" },
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
    <footer className="bg-zinc-950 text-zinc-400">
      {/* Newsletter strip */}
      <div className="border-b border-zinc-900">
        <div className="container py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
              RunVault Newsletter
            </p>
            <h3 className="text-2xl md:text-3xl font-bold text-zinc-50 tracking-tight">
              Nhận ưu đãi độc quyền mỗi tuần
            </h3>
            <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
              Cập nhật sản phẩm mới, mẹo chạy bộ và khuyến mãi hấp dẫn.
            </p>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex gap-2 w-full md:w-auto"
          >
            <div className="relative flex-1 md:w-80">
              <input
                type="email"
                placeholder="Email của bạn..."
                aria-label="Nhập email nhận bản tin"
                className="w-full h-12 rounded-xl bg-zinc-900 border border-zinc-800 px-5 text-sm text-zinc-50 placeholder-zinc-500 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>
            <button
              type="submit"
              className="h-12 px-8 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shrink-0"
            >
              Đăng ký
            </button>
          </form>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="container py-16 grid grid-cols-2 md:grid-cols-5 gap-10">
        {/* Brand column */}
        <div className="col-span-2 md:col-span-2 pr-0 md:pr-10">
          <Link to="/" className="flex items-center gap-2 mb-6 group inline-flex">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center group-hover:bg-primary/90 transition-colors">
              <Footprints className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-zinc-50 font-bold text-xl tracking-tight">RunVault</span>
          </Link>

          <p className="text-sm text-zinc-400 leading-relaxed mb-8 max-w-sm">
            Đồng hành cùng runner Việt Nam trên mọi cung đường. Chạy xa hơn, bứt
            tốc mạnh hơn với những trang bị thể thao đỉnh cao.
          </p>

          <div className="space-y-4 text-sm">
            <a
              href="mailto:hello@runvault.vn"
              className="flex items-center gap-3 text-zinc-400 hover:text-zinc-50 transition-colors"
            >
              <Mail className="h-4 w-4 text-primary shrink-0" />
              hello@runvault.vn
            </a>
            <a
              href="tel:0901234567"
              className="flex items-center gap-3 text-zinc-400 hover:text-zinc-50 transition-colors"
            >
              <Phone className="h-4 w-4 text-primary shrink-0" />
              0901 234 567
            </a>
            <div className="flex items-start gap-3 text-zinc-400">
              <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span className="leading-relaxed">123 Đinh Tiên Hoàng, Q.1, TP.HCM</span>
            </div>
          </div>
        </div>

        {/* Link columns */}
        {Object.values(footerLinks).map((section) => (
          <div key={section.title}>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-100 mb-6">
              {section.title}
            </h4>
            <ul className="space-y-4">
              {section.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-zinc-400 hover:text-primary transition-colors inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-zinc-900">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} RunVault. All rights reserved.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-3">
            {socialLinks.map(({ icon: Icon, label, to }) => (
              <a
                key={label}
                href={to}
                aria-label={label}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-zinc-900 text-zinc-400 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-6 text-sm text-zinc-500">
            <Link to="#" className="hover:text-zinc-300 transition-colors">
              Chính sách bảo mật
            </Link>
            <Link to="#" className="hover:text-zinc-300 transition-colors">
              Điều khoản sử dụng
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
