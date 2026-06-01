import { Footprints, Menu, Search, ShoppingCart, User, X } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, setAuthLoading } from "../../redux/slices/authSlice";
import { openCartDrawer } from "../../redux/slices/cartSlice";
import { Dropdown } from "antd";
import { toast } from "react-toastify";
import authService from "../../services/auth.service";
import categoryService from "../../services/category.service";
import productService from "../../services/product.service";
import {
  LogoutOutlined,
  SettingOutlined,
  DashboardOutlined,
  UserOutlined,
} from "@ant-design/icons";

const getCategoryId = (category) => {
  return category?._id || category?.id;
};

const getParentId = (category) => {
  if (!category) return null;

  if (typeof category.parent === "string") return category.parent;
  if (typeof category.parentId === "string") return category.parentId;
  if (typeof category.parentCategory === "string") return category.parentCategory;

  if (category.parent?._id) return category.parent._id;
  if (category.parent?.id) return category.parent.id;

  if (category.parentId?._id) return category.parentId._id;
  if (category.parentId?.id) return category.parentId.id;

  if (category.parentCategory?._id) return category.parentCategory._id;
  if (category.parentCategory?.id) return category.parentCategory.id;

  return null;
};

const getCategoryName = (category) => {
  return category?.name || category?.title || category?.label || "Danh mục";
};

const getCategorySlug = (category) => {
  return category?.slug || getCategoryId(category);
};

const buildCategoryTree = (categories = []) => {
  const map = new Map();
  const roots = [];

  categories.forEach((category) => {
    const id = getCategoryId(category);

    if (!id) return;

    map.set(id, {
      ...category,
      _categoryId: id,
      label: getCategoryName(category),
      to: `/shop?category=${encodeURIComponent(getCategorySlug(category))}`,
      children: [],
    });
  });

  categories.forEach((category) => {
    const id = getCategoryId(category);
    const parentId = getParentId(category);
    const current = map.get(id);

    if (!current) return;

    if (parentId && map.has(parentId)) {
      map.get(parentId).children.push(current);
    } else {
      roots.push(current);
    }
  });

  return roots;
};

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [categoryTree, setCategoryTree] = useState([]);

  const searchRef = useRef(null);
  const searchContainerRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { totalQuantity } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const navLinks = useMemo(
    () => [
      { label: "Trang chủ", to: "/" },
      {
        label: "Sản phẩm",
        to: "/shop",
        children: categoryTree,
      },
      { label: "Giới thiệu", to: "#" },
      { label: "Liên hệ", to: "#" },
    ],
    [categoryTree]
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getAllCategories({ limit: 200 });
        const data = res;

        const flatList = Array.isArray(data)
          ? data
          : data?.data || data?.categories || data?.items || data?.docs || [];

        console.log("[Header] Raw category data:", flatList);

        // Build cây 2 cấp từ flat array (backend đã có level & parentId)
        const parents = flatList.filter((c) => !c.parentId || c.level === 0);
        const children = flatList.filter((c) => c.parentId && c.level !== 0);

        const tree = parents.map((parent) => {
          const parentId = parent._id?.toString?.() || parent._id;
          const subs = children.filter((child) => {
            const cParent =
              typeof child.parentId === "object"
                ? child.parentId?._id?.toString?.() || child.parentId?.toString?.()
                : child.parentId?.toString?.();
            return cParent === parentId;
          });

          return {
            ...parent,
            _categoryId: parentId,
            label: parent.name,
            to: `/shop/${parent.slug}`,
            children: subs.map((child) => ({
              ...child,
              _categoryId: child._id?.toString?.() || child._id,
              label: child.name,
              to: `/shop/${child.slug}`,
              children: [],
            })),
          };
        });

        console.log("[Header] Category tree:", tree);
        setCategoryTree(tree);
      } catch (error) {
        console.log("Lỗi lấy danh mục:", error);
        setCategoryTree([]);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      searchRef.current?.focus();
    } else {
      setSearchResults([]);
    }
  }, [searchOpen]);

  // Debounced Search Effect
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await productService.getAllProducts({
          search: searchQuery,
          limit: 5,
        });
        const data = res;
        setSearchResults(Array.isArray(data) ? data : data?.products || data?.items || []);
      } catch (error) {
        console.error("Lỗi tìm kiếm:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
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
    ...(user?.role === "admin"
      ? [
          {
            key: "admin",
            label: <Link to="/admin">Trang quản trị</Link>,
            icon: <DashboardOutlined />,
          },
          { type: "divider" },
        ]
      : []),
    {
      key: "1",
      label: <Link to="/account">Hồ sơ cá nhân</Link>,
      icon: <UserOutlined />,
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

    if (!searchQuery.trim()) return;

    navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
    setMobileOpen(false);
    setSearchQuery("");
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-xl shadow-sm border-b border-border"
          : "bg-background border-b border-transparent"
      }`}
    >
      <div className="container h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl shrink-0 group">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-foreground text-background group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
            <Footprints className="h-4 w-4" />
          </div>
          <span className="text-foreground tracking-tight">RunVault</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          {navLinks.map((item) => (
            <NavItem key={item.label} item={item} />
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center relative" ref={searchContainerRef}>
            {searchOpen ? (
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center animate-in fade-in slide-in-from-right-4 duration-300"
              >
                <div className="relative">
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm sản phẩm..."
                    className="w-64 h-10 rounded-full border border-border bg-muted/30 px-4 pr-10 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {!isSearching && searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="ml-2 p-2 rounded-full text-muted-foreground hover:bg-muted transition-colors"
                  aria-label="Đóng tìm kiếm"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Auto-complete Dropdown */}
                {searchQuery && searchResults.length > 0 && (
                  <div className="absolute top-full right-10 mt-2 w-80 bg-popover border border-border rounded-xl shadow-lg shadow-black/5 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-muted/50 border-b border-border">
                      Sản phẩm gợi ý
                    </div>
                    <ul className="max-h-80 overflow-y-auto">
                      {searchResults.map((product) => (
                        <li key={product._id} className="border-b border-border last:border-0">
                          <Link
                            to={`/product/${product.slug}`}
                            onClick={() => {
                              setSearchOpen(false);
                              setSearchQuery("");
                            }}
                            className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors"
                          >
                            <img
                              src={product.thumbnail?.url || product.thumbnail}
                              alt={product.name}
                              className="size-10 rounded-lg object-cover bg-muted"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {product.name}
                              </p>
                              <p className="text-xs font-semibold text-primary">
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(product.minPrice || 0)}
                              </p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="w-full p-3 text-sm font-semibold text-primary text-center hover:bg-muted/50 transition-colors border-t border-border"
                    >
                      Xem tất cả kết quả
                    </button>
                  </div>
                )}

                {searchQuery && searchResults.length === 0 && !isSearching && (
                  <div className="absolute top-full right-10 mt-2 w-80 bg-popover border border-border rounded-xl shadow-lg p-6 text-center z-50">
                    <p className="text-sm text-muted-foreground">Không tìm thấy "{searchQuery}"</p>
                  </div>
                )}
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="p-2.5 rounded-full text-foreground hover:bg-muted transition-colors"
                aria-label="Tìm kiếm"
              >
                <Search className="h-5 w-5" />
              </button>
            )}
          </div>

          <button
            type="button"
            id="header-cart-btn"
            onClick={() => dispatch(openCartDrawer())}
            className="relative p-2.5 rounded-full text-foreground hover:bg-muted transition-colors"
            aria-label="Giỏ hàng"
          >
            <ShoppingCart className="h-5 w-5" />

            {totalQuantity > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground leading-none">
                {totalQuantity > 99 ? "99+" : totalQuantity}
              </span>
            )}
          </button>

          <div className="relative">
            {user ? (
              <Dropdown menu={{ items: userMenuItems }} trigger={["click"]}>
                <button
                  type="button"
                  className="flex items-center gap-2 p-1.5 pl-2 pr-3 rounded-full border border-border hover:border-foreground/20 hover:bg-muted transition-colors"
                  aria-label="Tài khoản"
                >
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <User className="h-3 w-3 text-primary-foreground" />
                  </div>

                  <span className="hidden md:block text-sm font-semibold text-foreground max-w-[80px] truncate">
                    {user.fullName?.split(" ").slice(-1)[0] || "Tài khoản"}
                  </span>
                </button>
              </Dropdown>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-5 h-9 rounded-full bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition-colors ml-1"
              >
                <span className="hidden sm:block">Đăng nhập</span>
              </Link>
            )}
          </div>

          <button
            type="button"
            className="lg:hidden p-2.5 rounded-full text-foreground hover:bg-muted transition-colors ml-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 top-16 bg-black/30 backdrop-blur-sm lg:hidden z-40"
            onClick={() => setMobileOpen(false)}
          />

          <nav className="fixed top-16 left-0 right-0 bottom-0 bg-white overflow-y-auto z-50 lg:hidden border-t border-slate-100 animate-slide-in-left">
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

            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <MobileNavSection
                  key={link.label}
                  link={link}
                  onClose={() => setMobileOpen(false)}
                />
              ))}
            </div>

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

const NavItem = ({ item }) => {
  const isProductMenu = item.label === "Sản phẩm";
  const hasMega = isProductMenu || item?.children?.length > 0;
  const hasCategories = item?.children?.length > 0;

  // Tính số cột dựa theo số lượng parent categories
  const colClass = !hasCategories
    ? ""
    : item.children.length === 1
      ? "grid-cols-1 w-[280px]"
      : item.children.length === 2
        ? "grid-cols-2 w-[480px]"
        : item.children.length === 3
          ? "grid-cols-3 w-[600px]"
          : "grid-cols-7 w-max min-w-[760px] pr-4";

  return (
    <div className="group relative flex h-16 items-center">
      <Link
        to={item.to}
        className="relative flex items-center gap-1 px-4 py-2 text-sm font-semibold text-muted-foreground rounded-full hover:text-foreground hover:bg-muted/50 transition-colors duration-200"
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

      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary rounded-full group-hover:w-4 transition-all duration-200" />

      {hasMega && (
        <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute top-full left-1/2 -translate-x-1/2 z-[999] translate-y-2 group-hover:translate-y-0 transition-all duration-200 ease-out">
          {/* Buffer để không bị ẩn khi di chuột từ link xuống dropdown */}
          <div className="h-3 w-full" />

          <div
            className={`max-w-[calc(100vw-32px)] rounded-2xl border border-border bg-popover shadow-xl p-8 ${hasCategories ? colClass : "w-[340px]"}`}
          >
            {hasCategories ? (
              <div className={`grid gap-x-6 gap-y-2 ${colClass}`}>
                {item.children.map((parent) => (
                  <CategoryColumn key={parent._categoryId} category={parent} />
                ))}
              </div>
            ) : (
              <div className="py-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-3">
                  <svg
                    className="w-5 h-5 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                    />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-slate-700">Đang tải danh mục...</p>
                <p className="mt-1 text-xs text-slate-400">Vui lòng chờ trong giây lát.</p>
              </div>
            )}

            {/* Footer */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {hasCategories ? `${item.children.length} danh mục` : "Cửa hàng RunVault"}
              </span>
              <Link
                to="/shop"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                Xem tất cả
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Parent category = section header, children = danh sách link bên dưới
const CategoryColumn = ({ category }) => {
  const hasChildren = category?.children?.length > 0;

  return (
    <div className="min-w-0">
      {/* Parent category — header in hoa, có thể click */}
      <Link to={category.to} className="group/parent flex items-center gap-1.5 mb-3">
        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 group-hover/parent:text-primary transition-colors leading-none whitespace-nowrap">
          {category.label}
        </span>
        <svg
          className="w-2.5 h-2.5 text-slate-300 group-hover/parent:text-primary transition-colors shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
          />
        </svg>
      </Link>

      {/* Sub categories */}
      {hasChildren ? (
        <ul className="space-y-1.5">
          {category.children.map((child) => (
            <li key={child._categoryId}>
              <Link
                to={child.to}
                className="block text-sm text-slate-600 hover:text-primary hover:translate-x-0.5 transition-all duration-150 leading-snug whitespace-nowrap"
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        // Nếu parent không có con, hiển thị link đến chính nó
        <p className="text-xs text-slate-400 italic">Xem tất cả</p>
      )}
    </div>
  );
};

const MobileNavSection = ({ link, onClose }) => {
  const [open, setOpen] = useState(false);
  const hasChildren = link?.children?.length > 0;

  if (!hasChildren) {
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
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="mt-1 pl-3 border-l-2 border-slate-100 ml-3 space-y-0.5 mb-2">
          {link.children.map((category) => (
            <MobileCategoryItem key={category._categoryId} category={category} onClose={onClose} />
          ))}
        </div>
      )}
    </div>
  );
};

const MobileCategoryItem = ({ category, onClose, level = 0 }) => {
  const [open, setOpen] = useState(false);
  const hasChildren = category?.children?.length > 0;

  return (
    <div>
      <div className="flex items-center">
        <Link
          to={category.to}
          onClick={onClose}
          className={`flex-1 block py-1.5 px-3 text-sm transition-colors ${
            level === 0
              ? "font-semibold text-slate-700 hover:text-primary"
              : "text-slate-500 hover:text-primary"
          }`}
        >
          {category.label}
        </Link>

        {hasChildren && (
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50"
            aria-label={`Mở ${category.label}`}
          >
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>

      {hasChildren && open && (
        <div className="pl-3 space-y-0.5 mb-1">
          {category.children.map((child) => (
            <MobileCategoryItem
              key={child._categoryId}
              category={child}
              onClose={onClose}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Header;
