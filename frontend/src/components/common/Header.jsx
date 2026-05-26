import { Footprints, Menu, Search, ShoppingCart, User, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, setAuthLoading } from "../../redux/slices/authSlice";
import { openCartDrawer } from "../../redux/slices/cartSlice";
import { Dropdown } from "antd";
import { toast } from "react-toastify";
import authService from "../../services/auth.service";
import { LogoutOutlined, SettingOutlined } from "@ant-design/icons";

const navLinks = [
  { label: "Trang chủ", to: "/" },
  {
    label: "Sản phẩm",
    to: "/shop",
    children: [
      {
        label: "Giày Trail",
        to: "/shop/giay-trail",
        children: [
          { label: "Giày trail nam", to: "/shop/giay-trail-nam" },
          { label: "Giày trail nữ", to: "/shop/giay-trail-nu" },
        ],
      },
      {
        label: "Giày Road",
        to: "/shop/giay-road",
        children: [
          { label: "Giày road nam", to: "/shop/giay-road-nam" },
          { label: "Giày road nữ", to: "/shop/giay-road-nu" },
        ],
      },
      {
        label: "Áo",
        to: "/shop/ao",
        children: [
          { label: "Áo nam", to: "/shop/ao-nam" },
          { label: "Áo nữ", to: "/shop/ao-nu" },
        ],
      },
      {
        label: "Quần",
        to: "/shop/quan",
        children: [
          { label: "Quần nam", to: "/shop/quan-nam" },
          { label: "Quần nữ", to: "/shop/quan-nu" },
        ],
      },
      {
        label: "Phụ kiện",
        to: "/shop/phu-kien",
        children: [
          { label: "Mũ", to: "/shop/mu" },
          { label: "Băng đô", to: "/shop/bang-do" },
          { label: "Kính", to: "/shop/kinh" },
          { label: "Đèn trail", to: "/shop/den-trail" },
          { label: "Khăn ống", to: "/shop/khan-ong" },
          { label: "Gậy trail", to: "/shop/gay-trail" },
          { label: "Vest trail", to: "/shop/vest-trail" },
          { label: "Tất", to: "/shop/tat" },
          { label: "Bình mềm", to: "/shop/binh-mem" },
        ],
      },
      {
        label: "Thiết bị",
        to: "/shop/thiet-bi",
        children: [
          { label: "Đồng hồ", to: "/shop/dongho" },
          { label: "Tai nghe", to: "/shop/tai-nghe" },
          { label: "Máy massage", to: "/shop/may-massage" },
        ],
      },
      {
        label: "Dinh dưỡng",
        to: "/shop/dinh-duong",
        children: [
          { label: "Gel", to: "/shop/gel" },
          { label: "Năng lượng phục hồi", to: "/shop/nang-luong-phuc-hoi" },
          { label: "Muối điện giải", to: "/shop/muoi-sui-dien-giai" },
          { label: "Thanh năng lượng", to: "/shop/thanh-bar-banh-nang-luong" },
        ],
      },
    ],
  },
  { label: "Giới thiệu", to: "#" },
  { label: "Liên hệ", to: "#" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { totalQuantity } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleLogout = async () => {
    try {
      dispatch(setAuthLoading(true));
      await authService.logout();
      dispatch(clearUser());
      toast.info("Đã đăng xuất");
      navigate("/login");
    } catch (error) {
      const message = error.response?.data?.message;
      toast.error(message || "Đăng xuất thất bại");
    } finally {
      dispatch(setAuthLoading(false));
    }
  };

  const userMenuItems = [
    {
      key: "1",
      label: <Link to="/account">Hồ sơ cá nhân</Link>,
      icon: <SettingOutlined />,
    },
    { type: "divider" },
    {
      key: "2",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl shadow-soft border-b border-slate-100"
          : "bg-white border-b border-slate-100"
      }`}
    >
      <div className="container h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-xl shrink-0 group"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary text-white group-hover:bg-secondary transition-colors duration-200">
            <Footprints className="h-4 w-4" />
          </div>
          <span className="text-slate-900 tracking-tight">RunVault</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          {navLinks.map((item) => (
            <NavItem key={item.label} item={item} />
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Search — expandable on desktop */}
          <div className="hidden sm:flex items-center">
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center animate-fade-in">
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-52 h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-primary focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                  className="ml-1 p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                aria-label="Tìm kiếm"
              >
                <Search className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Cart */}
          <button
            type="button"
            id="header-cart-btn"
            onClick={() => dispatch(openCartDrawer())}
            className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            aria-label="Giỏ hàng"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalQuantity > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-primary px-1 text-[10px] font-bold text-white leading-none">
                {totalQuantity > 99 ? "99+" : totalQuantity}
              </span>
            )}
          </button>

          {/* User */}
          <div className="relative">
            {user ? (
              <Dropdown menu={{ items: userMenuItems }} trigger={["click"]}>
                <button
                  type="button"
                  className="flex items-center gap-2 p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                  aria-label="Tài khoản"
                >
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="hidden md:block text-sm font-medium text-slate-700 max-w-[80px] truncate">
                    {user.fullName?.split(" ").slice(-1)[0] || "Tài khoản"}
                  </span>
                </button>
              </Dropdown>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 h-9 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-secondary transition-colors"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:block">Đăng nhập</span>
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 top-16 bg-black/30 backdrop-blur-sm lg:hidden z-40"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer */}
          <nav className="fixed top-16 left-0 right-0 bottom-0 bg-white overflow-y-auto z-50 lg:hidden border-t border-slate-100 animate-slide-in-left">
            {/* Mobile search */}
            <div className="px-4 pt-4 pb-3 border-b border-slate-100">
              <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm..."
                  className="flex-1 h-10 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  className="px-4 h-10 rounded-xl bg-primary text-white text-sm font-semibold"
                >
                  Tìm
                </button>
              </form>
            </div>

            {/* Links */}
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <MobileNavSection
                  key={link.label}
                  link={link}
                  onClose={() => setMobileOpen(false)}
                />
              ))}
            </div>

            {/* Auth links at bottom */}
            {!user && (
              <div className="px-4 pb-8 pt-4 border-t border-slate-100 flex flex-col gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center h-12 rounded-2xl bg-primary text-white font-semibold"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center h-12 rounded-2xl border border-slate-200 text-slate-800 font-semibold"
                >
                  Tạo tài khoản
                </Link>
              </div>
            )}
          </nav>
        </>
      )}
    </header>
  );
};

/* ── Desktop Nav Item (với mega menu) ── */
const NavItem = ({ item }) => {
  const hasMega = item?.children?.length > 0;

  return (
    <div className="group relative flex h-16 items-center">
      <Link
        to={item.to}
        className="relative flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-700 rounded-lg hover:text-slate-900 hover:bg-slate-50 transition-colors duration-150"
      >
        {item.label}
        {hasMega && (
          <svg
            className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform duration-200 mt-px"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </Link>

      {/* Active indicator */}
      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary rounded-full group-hover:w-4 transition-all duration-200" />

      {/* Mega menu */}
      {hasMega && (
        <div className="pointer-events-none group-hover:pointer-events-auto absolute top-full left-1/2 -translate-x-1/2 z-50 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 ease-out">
          {/* Bridge gap */}
          <div className="h-3 w-full" />
          <div className="w-[680px] rounded-2xl border border-slate-100 bg-white shadow-card-hover p-6">
            <div className="grid grid-cols-4 gap-5">
              {item.children.map((col) => (
                <div key={col.label}>
                  <Link
                    to={col.to}
                    className="block mb-2.5 text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors"
                  >
                    {col.label}
                  </Link>
                  {col.children && (
                    <div className="space-y-1.5">
                      {col.children.map((sub) => (
                        <Link
                          key={sub.label}
                          to={sub.to}
                          className="block text-sm text-slate-600 hover:text-primary hover:translate-x-0.5 transition-all duration-150"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Footer of mega menu */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">Xem tất cả danh mục</span>
              <Link
                to="/shop"
                className="text-xs font-semibold text-primary hover:underline"
              >
                Vào cửa hàng →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Mobile Nav Section ── */
const MobileNavSection = ({ link, onClose }) => {
  const [open, setOpen] = useState(false);

  if (!link.children) {
    return (
      <Link
        to={link.to}
        onClick={onClose}
        className="flex items-center h-11 px-3 rounded-xl text-[15px] font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
      >
        {link.label}
      </Link>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full h-11 px-3 rounded-xl text-[15px] font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
      >
        <span>{link.label}</span>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="mt-1 pl-3 border-l-2 border-slate-100 ml-3 space-y-0.5 mb-2">
          {link.children.map((child) => (
            <div key={child.label}>
              <Link
                to={child.to}
                onClick={onClose}
                className="block py-1.5 px-3 text-sm font-semibold text-slate-700 hover:text-primary transition-colors"
              >
                {child.label}
              </Link>
              {child.children && (
                <div className="pl-3 space-y-0.5 mb-1">
                  {child.children.map((sub) => (
                    <Link
                      key={sub.label}
                      to={sub.to}
                      onClick={onClose}
                      className="block py-1 px-3 text-sm text-slate-500 hover:text-primary transition-colors"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Header;
