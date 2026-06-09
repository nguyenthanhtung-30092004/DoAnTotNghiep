import { Footprints, Menu, Search, ShoppingCart, User, X } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, setAuthLoading } from "../../redux/slices/authSlice";
import { clearCartRedux, openCartDrawer } from "../../redux/slices/cartSlice";
import { Dropdown } from "antd";
import { toast } from "react-toastify";
import authService from "../../services/auth.service";
import categoryService from "../../services/category.service";
import productService from "../../services/product.service";
import {
  LogoutOutlined,
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
  if (typeof category.parentCategory === "string")
    return category.parentCategory;

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
      { label: "Giới thiệu", to: "/about" },
      { label: "Liên hệ", to: "/contact" },
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

        const parents = flatList.filter((c) => !c.parentId || c.level === 0);
        const children = flatList.filter((c) => c.parentId && c.level !== 0);

        const tree = parents.map((parent) => {
          const parentId = parent._id?.toString?.() || parent._id;

          const subs = children.filter((child) => {
            const childParentId =
              typeof child.parentId === "object"
                ? child.parentId?._id?.toString?.() ||
                  child.parentId?.toString?.()
                : child.parentId?.toString?.();

            return childParentId === parentId;
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

        setCategoryTree(tree);
      } catch (error) {
        console.log("Lỗi lấy danh mục:", error);
        setCategoryTree([]);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };

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

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);

      try {
        const res = await productService.getAllProducts({
          search: searchQuery,
          limit: 5,
        });

        const data = res;
        const products = Array.isArray(data)
          ? data
          : data?.products || data?.items || [];

        setSearchResults(products);
      } catch (error) {
        console.error("Lỗi tìm kiếm:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
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
      dispatch(clearCartRedux());
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
      key: "profile",
      label: <Link to="/account">Hồ sơ cá nhân</Link>,
      icon: <UserOutlined />,
    },
    { type: "divider" },
    {
      key: "logout",
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
      <div className="container h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold shrink-0 group min-w-0"
          onClick={() => setMobileOpen(false)}
        >
          <div className="flex items-center justify-center w-8 h-8 bg-zinc-950 text-white transition-colors duration-200 shrink-0">
            <Footprints className="h-4 w-4" />
          </div>

          <span className="text-foreground tracking-tight text-base sm:text-xl truncate">
            RunVault
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          {navLinks.map((item) => (
            <NavItem key={item.label} item={item} />
          ))}
        </nav>

        <div className="flex items-center justify-end gap-1 sm:gap-2 shrink-0">
          <div
            className="hidden sm:flex items-center relative"
            ref={searchContainerRef}
          >
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
                    className="w-64 h-10 border border-zinc-200 bg-zinc-50 px-4 pr-10 text-sm outline-none focus:border-teal-600 focus:bg-white focus:ring-1 focus:ring-teal-600 transition-all"
                  />

                  {isSearching && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  )}

                  {!isSearching && searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label="Xóa tìm kiếm"
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

                {searchQuery && searchResults.length > 0 && (
                  <div className="absolute top-full right-10 mt-2 w-80 bg-popover border border-border rounded-xl shadow-lg shadow-black/5 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-muted/50 border-b border-border">
                      Sản phẩm gợi ý
                    </div>

                    <ul className="max-h-80 overflow-y-auto">
                      {searchResults.map((product) => (
                        <li
                          key={product._id}
                          className="border-b border-border last:border-0"
                        >
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
                              <p className="text-sm font-bold text-zinc-950 truncate">
                                {product.name}
                              </p>

                              <p className="text-xs font-bold text-teal-600">
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
                    <p className="text-sm text-muted-foreground">
                      Không tìm thấy "{searchQuery}"
                    </p>
                  </div>
                )}
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="p-2.5 text-zinc-950 hover:bg-zinc-100 transition-colors"
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
            className="relative flex h-10 w-10 items-center justify-center text-zinc-950 hover:bg-zinc-100 transition-colors"
            aria-label="Giỏ hàng"
          >
            <ShoppingCart className="h-5 w-5" />

            {totalQuantity > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-teal-600 px-1 text-[10px] font-bold text-white leading-none">
                {totalQuantity > 99 ? "99+" : totalQuantity}
              </span>
            )}
          </button>

          <div className="relative shrink-0">
            {user ? (
              <Dropdown menu={{ items: userMenuItems }} trigger={["click"]}>
                <button
                  type="button"
                  className="flex items-center justify-center sm:justify-start gap-2 h-10 w-10 sm:w-auto sm:px-3 border border-zinc-200 hover:border-zinc-950 hover:bg-zinc-50 transition-colors"
                  aria-label="Tài khoản"
                >
                  <div className="w-6 h-6 bg-teal-600 flex items-center justify-center shrink-0">
                    <User className="h-3 w-3 text-white" />
                  </div>

                  <span className="hidden md:block text-sm font-semibold text-foreground max-w-[80px] truncate">
                    {user.fullName?.split(" ").slice(-1)[0] || "Tài khoản"}
                  </span>
                </button>
              </Dropdown>
            ) : (
              <Link
                to="/login"
                className="flex items-center justify-center h-10 px-3 sm:px-6 bg-zinc-950 text-white text-[10px] sm:text-xs font-black uppercase tracking-[0.08em] sm:tracking-[0.1em] hover:bg-teal-600 transition-colors whitespace-nowrap"
              >
                Đăng nhập
              </Link>
            )}
          </div>

          <button
            type="button"
            className="lg:hidden flex h-10 w-10 items-center justify-center text-foreground hover:bg-muted transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 top-14 sm:top-16 bg-black/30 backdrop-blur-sm lg:hidden z-40"
            onClick={() => setMobileOpen(false)}
          />

          <nav className="fixed top-14 sm:top-16 left-0 right-0 bottom-0 bg-white overflow-y-auto z-50 lg:hidden border-t border-slate-100 animate-slide-in-left">
            <div className="px-4 pt-4 pb-3 border-b border-slate-100">
              <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm..."
                  className="flex-1 min-w-0 h-12 border border-zinc-200 bg-zinc-50 px-4 text-sm outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                />

                <button
                  type="submit"
                  className="px-5 h-12 bg-zinc-950 text-white text-xs font-black uppercase tracking-[0.1em] hover:bg-teal-600 transition-colors shrink-0"
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
                  className="flex items-center justify-center h-14 bg-zinc-950 text-white text-xs font-black uppercase tracking-[0.1em] hover:bg-teal-600 transition-colors"
                >
                  Đăng nhập
                </Link>

                <Link
                  to="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center h-14 border border-zinc-200 bg-zinc-50 text-zinc-950 text-xs font-black uppercase tracking-[0.1em] hover:border-zinc-950 hover:bg-white transition-colors"
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

  return (
    <div className="group flex h-16 items-center px-2">
      <Link
        to={item.to}
        className="relative flex items-center gap-1.5 px-3 py-2 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-200"
      >
        {item.label}

        {hasMega && (
          <svg
            className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground group-hover:rotate-180 transition-all duration-200 mt-px"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}

        <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-foreground scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      </Link>

      {hasMega && (
        <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute top-full left-0 w-full z-[999] bg-background border-b border-border shadow-2xl transition-all duration-200 ease-out">
          <div className="container py-12">
            {hasCategories ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-x-8 gap-y-12">
                {item.children.map((parent) => (
                  <CategoryColumn key={parent._categoryId} category={parent} />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center flex flex-col items-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-none bg-muted mb-4 border border-border">
                  <svg
                    className="w-5 h-5 text-muted-foreground"
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

                <p className="text-sm font-bold uppercase tracking-widest text-foreground">
                  Đang tải danh mục
                </p>

                <p className="mt-2 text-xs text-muted-foreground">
                  Vui lòng chờ trong giây lát.
                </p>
              </div>
            )}

            <div className="mt-12 pt-6 border-t border-border flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {hasCategories
                  ? `${item.children.length} danh mục`
                  : "RunVault"}
              </span>

              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground hover:text-muted-foreground transition-colors"
              >
                Xem tất cả bộ sưu tập
                <svg
                  className="w-3.5 h-3.5"
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

const CategoryColumn = ({ category }) => {
  const hasChildren = category?.children?.length > 0;

  return (
    <div className="min-w-0">
      <Link
        to={category.to}
        className="group/parent flex items-center gap-1.5 mb-6"
      >
        <span className="text-sm font-black uppercase tracking-tight text-foreground group-hover/parent:text-muted-foreground transition-colors leading-none whitespace-nowrap">
          {category.label}
        </span>

        <svg
          className="w-3 h-3 text-foreground group-hover/parent:text-muted-foreground transition-colors shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
          />
        </svg>
      </Link>

      {hasChildren ? (
        <ul className="space-y-3">
          {category.children.map((child) => (
            <li key={child._categoryId}>
              <Link
                to={child.to}
                className="block text-sm font-medium text-muted-foreground hover:text-foreground hover:translate-x-1 transition-all duration-200 leading-snug whitespace-nowrap"
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs font-medium text-muted-foreground">
          Khám phá ngay
        </p>
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
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="mt-1 pl-3 border-l-2 border-slate-100 ml-3 space-y-0.5 mb-2">
          {link.children.map((category) => (
            <MobileCategoryItem
              key={category._categoryId}
              category={category}
              onClose={onClose}
            />
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
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
