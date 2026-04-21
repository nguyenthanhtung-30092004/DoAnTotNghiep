import React, { useState } from "react";
import { Link, useParams } from "react-router-dom"; // Nhớ import useParams
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  SlidersHorizontal,
  Star,
  X,
  Check,
} from "lucide-react";

// Tuỳ chỉnh lại đường dẫn import cho đúng dự án của bạn
import { Button } from "../components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/Select";
import Header from "../components/Headers/Header";

// ==========================================
// 1. TỪ ĐIỂN DỊCH URL SANG TÊN DANH MỤC
// ==========================================
const formatCategoryTitle = (slug) => {
  if (!slug) return "Tất cả sản phẩm";

  const titles = {
    // Giày
    "giay-trail": "Giày Trail",
    "giay-trail-nam": "Giày Trail Nam",
    "giay-trail-nu": "Giày Trail Nữ",
    "giay-road": "Giày Road",
    "giay-road-nam": "Giày Road Nam",
    "giay-road-nu": "Giày Road Nữ",
    // Áo, Quần
    ao: "Áo Thể Thao",
    "ao-nam": "Áo Nam",
    "ao-nu": "Áo Nữ",
    quan: "Quần Thể Thao",
    "quan-nam": "Quần Nam",
    "quan-nu": "Quần Nữ",
    // Phụ kiện
    "phu-kien": "Phụ Kiện",
    mu: "Mũ",
    "bang-do": "Băng Đô",
    kinh: "Kính",
    "den-trail": "Đèn Trail",
    "khan-ong": "Khăn Ống",
    "calf-tay": "Calf Tay",
    "calg-chan": "Calf Chân",
    "gay-trail": "Gậy Trail",
    "vest-trail": "Vest Trail",
    tat: "Tất",
    "binh-mem": "Bình Mềm",
    starbalm: "Starbalm",
    // Thiết bị
    "thiet-bi": "Thiết Bị",
    dongho: "Đồng Hồ",
    "phu-kien-dong-ho": "Phụ Kiện Đồng Hồ",
    "tai-nghe": "Tai Nghe",
    "may-massage": "Máy Massage",
    // Dinh dưỡng
    "dinh-duong": "Dinh Dưỡng",
    gel: "Gel",
    "nang-luong-phuc-hoi": "Năng Lượng Phục Hồi",
    "muoi-sui-dien-giai": "Muối - Sủi Điện Giải",
    "thanh-bar-banh-nang-luong": "Thanh Bar - Bánh Năng Lượng",
  };

  return titles[slug] || "Danh Mục Sản Phẩm";
};

// ==========================================
// 2. DỮ LIỆU TĨNH SẢN PHẨM & BỘ LỌC
// ==========================================
const allProducts = [
  {
    id: 1,
    name: "AeroStride Pro",
    brand: "RunVault",
    price: 159,
    rating: 4.8,
    reviews: 342,
    image: "🏃",
    tag: "Mới",
  },
  {
    id: 2,
    name: "TrailBlazer X",
    brand: "TrailCo",
    price: 189,
    originalPrice: 229,
    rating: 4.9,
    reviews: 278,
    image: "🥾",
  },
  {
    id: 3,
    name: "CloudRunner Elite",
    brand: "RunVault",
    price: 199,
    rating: 4.7,
    reviews: 156,
    image: "👟",
    tag: "Hot",
  },
  {
    id: 4,
    name: "SpeedForce Ultra",
    brand: "VeloMax",
    price: 175,
    rating: 4.6,
    reviews: 421,
    image: "⚡",
  },
  {
    id: 5,
    name: "VelocityMax 3",
    brand: "VeloMax",
    price: 185,
    rating: 4.9,
    reviews: 512,
    image: "🔥",
  },
  {
    id: 6,
    name: "EnduraPro Racer",
    brand: "EnduraFit",
    price: 165,
    rating: 4.8,
    reviews: 278,
    image: "🏆",
  },
  {
    id: 7,
    name: "NightTrail GTX",
    brand: "TrailCo",
    price: 210,
    rating: 4.9,
    reviews: 156,
    image: "🌙",
  },
  {
    id: 8,
    name: "TempoFly Knit",
    brand: "RunVault",
    price: 145,
    rating: 4.7,
    reviews: 389,
    image: "💨",
  },
];

const FILTER_DATA = {
  brands: ["RunVault", "TrailCo", "VeloMax", "EnduraFit", "Nike", "Adidas"],
  sizes: [38, 39, 40, 41, 42, 43, 44, 45],
  prices: ["Dưới $100", "$100 - $150", "$150 - $200", "Trên $200"],
};

// ==========================================
// 3. CÁC COMPONENT GIAO DIỆN NHỎ
// ==========================================

// --- Card Sản Phẩm ---
const ProductCard = ({ product }) => (
  <Link
    to={`/product/${product.id}`}
    className="group relative bg-card rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col border"
  >
    {product.tag && (
      <span className="absolute top-3 left-3 z-10 bg-[#22C55E] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
        {product.tag}
      </span>
    )}
    <div className="aspect-square bg-[#F8F9FA] flex items-center justify-center text-5xl sm:text-6xl group-hover:scale-105 transition-transform duration-500 relative">
      {product.image}
      <div className="absolute inset-0 bg-black/5 transition-colors duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
        <Button
          size="sm"
          className="shadow-lg text-xs gap-1.5 bg-[#22C55E] hover:bg-[#1da850] text-white"
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          Thêm vào giỏ
        </Button>
      </div>
    </div>
    <div className="p-4 flex flex-col gap-1.5 flex-1 bg-white">
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {product.brand}
      </p>
      <h3 className="font-semibold text-sm leading-snug text-gray-900">
        {product.name}
      </h3>
      <div className="flex items-center gap-1 mt-auto pt-1">
        <Star className="h-3.5 w-3.5 fill-[#EAB308] text-[#EAB308]" />
        <span className="text-xs font-medium text-gray-700">
          {product.rating}
        </span>
        <span className="text-xs text-muted-foreground">
          ({product.reviews})
        </span>
      </div>
      <div className="flex items-center gap-2 mt-1">
        <span className="font-bold text-[#22C55E]">${product.price}</span>
        {product.originalPrice && (
          <span className="text-sm text-muted-foreground line-through">
            ${product.originalPrice}
          </span>
        )}
      </div>
    </div>
  </Link>
);

// --- BỘ LỌC CÁC THUỘC TÍNH (ShopFilterSidebar) ---
const ShopFilterSidebar = () => {
  const [activeBrands, setActiveBrands] = useState([]);
  const [activeSizes, setActiveSizes] = useState([]);
  const [activePrice, setActivePrice] = useState("");

  const toggleBrand = (brand) => {
    setActiveBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  };

  const toggleSize = (size) => {
    setActiveSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  };

  return (
    <div className="space-y-8 pr-4">
      {/* Bộ lọc Giá */}
      <div>
        <h3 className="text-gray-900 font-bold text-sm uppercase tracking-wider mb-4">
          Mức Giá
        </h3>
        <div className="space-y-3">
          {FILTER_DATA.prices.map((price, idx) => (
            <label
              key={idx}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${activePrice === price ? "border-[#22C55E] bg-[#22C55E]" : "border-gray-300 group-hover:border-[#22C55E]"}`}
              >
                {activePrice === price && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              <input
                type="radio"
                name="price"
                className="hidden"
                onChange={() => setActivePrice(price)}
              />
              <span
                className={`text-[14px] ${activePrice === price ? "text-gray-900 font-medium" : "text-gray-600"}`}
              >
                {price}
              </span>
            </label>
          ))}
        </div>
      </div>
      <div className="h-[1px] w-full bg-gray-100" />

      {/* Bộ lọc Thương hiệu */}
      <div>
        <h3 className="text-gray-900 font-bold text-sm uppercase tracking-wider mb-4">
          Thương Hiệu
        </h3>
        <div className="space-y-3">
          {FILTER_DATA.brands.map((brand, idx) => (
            <label
              key={idx}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div
                className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${activeBrands.includes(brand) ? "border-[#22C55E] bg-[#22C55E]" : "border-gray-300 group-hover:border-[#22C55E]"}`}
              >
                {activeBrands.includes(brand) && (
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                )}
              </div>
              <input
                type="checkbox"
                className="hidden"
                onChange={() => toggleBrand(brand)}
              />
              <span
                className={`text-[14px] ${activeBrands.includes(brand) ? "text-gray-900 font-medium" : "text-gray-600"}`}
              >
                {brand}
              </span>
            </label>
          ))}
        </div>
      </div>
      <div className="h-[1px] w-full bg-gray-100" />

      {/* Bộ lọc Size */}
      <div>
        <h3 className="text-gray-900 font-bold text-sm uppercase tracking-wider mb-4">
          Kích Cỡ (Size)
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {FILTER_DATA.sizes.map((size, idx) => (
            <button
              key={idx}
              onClick={() => toggleSize(size)}
              className={`h-10 rounded-md border text-sm font-medium transition-all ${activeSizes.includes(size) ? "border-[#22C55E] bg-[#22C55E] text-white" : "border-gray-200 bg-white text-gray-700 hover:border-[#22C55E] hover:text-[#22C55E]"}`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full mt-4 text-[#22C55E] border-[#22C55E] hover:bg-[#22C55E] hover:text-white transition-colors"
        onClick={() => {
          setActiveBrands([]);
          setActiveSizes([]);
          setActivePrice("");
        }}
      >
        Xóa bộ lọc
      </Button>
    </div>
  );
};

// --- Thanh Công Cụ (Toolbar) ---
const ShopToolbar = ({ sort, onSortChange, onOpenMobileMenu }) => (
  <div className="flex items-center justify-between gap-4 mb-6">
    <Button
      variant="outline"
      className="lg:hidden gap-2"
      onClick={onOpenMobileMenu}
    >
      <SlidersHorizontal className="h-4 w-4" />
      Bộ lọc
    </Button>
    <p className="hidden lg:block text-sm text-muted-foreground">
      Hiển thị <span className="font-medium text-gray-900">8</span> sản phẩm
    </p>
    <Select value={sort} onValueChange={onSortChange}>
      <SelectTrigger className="w-48 bg-white border">
        <SelectValue placeholder="Sắp xếp theo" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="popular">Phổ biến nhất</SelectItem>
        <SelectItem value="newest">Mới nhất</SelectItem>
        <SelectItem value="price-asc">Giá: Thấp → Cao</SelectItem>
        <SelectItem value="price-desc">Giá: Cao → Thấp</SelectItem>
      </SelectContent>
    </Select>
  </div>
);

// --- Phân Trang ---
const ShopPagination = ({ page, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      <Button
        variant="outline"
        size="icon"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      {pages.map((p) => (
        <Button
          key={p}
          variant={p === page ? "default" : "outline"}
          size="icon"
          onClick={() => onPageChange(p)}
          className={`w-9 h-9 ${p === page ? "bg-[#22C55E] hover:bg-[#1da850] text-white" : ""}`}
        >
          {p}
        </Button>
      ))}
      <Button
        variant="outline"
        size="icon"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

// ==========================================
// 4. COMPONENT CHÍNH (TRANG SHOP)
// ==========================================
const Shop = () => {
  // Bắt cái URL hiện tại (Ví dụ: "ao-nam")
  const { categorySlug } = useParams();

  // Đổi nó thành Tiếng Việt ("Áo Nam")
  const currentCategory = formatCategoryTitle(categorySlug);

  const [sort, setSort] = useState("popular");
  const [page, setPage] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Banner tiêu đề */}
        <div className="bg-[#F8F9FA] border-b">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 uppercase">
              {currentCategory}
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Trang chủ / Cửa hàng /{" "}
              <span className="text-[#22C55E] font-medium">
                {currentCategory}
              </span>
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar Bộ Lọc (Desktop) */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24">
                <ShopFilterSidebar />
              </div>
            </aside>

            {/* Sidebar Bộ Lọc (Mobile Overlay) */}
            {mobileMenuOpen && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div
                  className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                  onClick={() => setMobileMenuOpen(false)}
                />
                <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white p-6 overflow-y-auto animate-in slide-in-from-left shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-bold text-lg text-gray-900">
                      Bộ Lọc Sản Phẩm
                    </h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <ShopFilterSidebar />
                </div>
              </div>
            )}

            {/* Khu vực Lưới Sản phẩm */}
            <div className="flex-1 min-w-0">
              <ShopToolbar
                sort={sort}
                onSortChange={setSort}
                onOpenMobileMenu={() => setMobileMenuOpen(true)}
              />

              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mt-2">
                {allProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              <ShopPagination
                page={page}
                totalPages={3}
                onPageChange={setPage}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Shop;
