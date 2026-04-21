// ==========================================
// 1. DỮ LIỆU TĨNH (DATA)

import { Link } from "react-router";
import { Button } from "../components/ui/Button";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/Select";
import Header from "../components/Headers/Header";
import { useState } from "react";

// ==========================================
const categoriesData = [
  { title: "GIÀY TRAIL", items: ["Giày trail nam", "Giày trail nữ"] },
  { title: "GIÀY ROAD", items: ["Giày road nam", "Giày road nữ"] },
  { title: "ÁO", items: ["Áo nam", "Áo nữ"] },
  { title: "QUẦN", items: ["Quần nam", "Quần nữ"] },
  {
    title: "PHỤ KIỆN",
    items: [
      "Mũ",
      "Băng đô",
      "Kính",
      "Đèn trail",
      "Khăn ống",
      "Calf tay",
      "Calf chân",
      "Gậy trail",
      "Vest trail",
      "Tất",
      "Bình mềm",
      "Starbalm",
    ],
  },
  {
    title: "THIẾT BỊ",
    items: ["Đồng hồ", "Phụ kiện đồng hồ", "Tai nghe", "Máy massage"],
  },
  {
    title: "DINH DƯỠNG",
    items: [
      "Gel",
      "Năng lượng phục hồi",
      "Muối - sủi điện giải",
      "Thanh bar - Bánh năng lượng",
    ],
  },
];

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

// ==========================================
// 2. CÁC COMPONENT GIAO DIỆN NHỎ
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

// --- Cây Danh Mục (Sidebar) ---
const ShopSidebar = ({ selectedCategory, onSelectCategory }) => (
  <div className="space-y-8">
    {categoriesData.map((group, index) => (
      <div key={index} className="flex flex-col">
        <h3 className="text-[#22C55E] font-bold text-sm tracking-wider mb-3">
          {group.title}
        </h3>
        <div className="h-[1px] w-full bg-gray-100 mb-4" />
        <ul className="space-y-3">
          {group.items.map((item, idx) => (
            <li key={idx}>
              <button
                onClick={() => onSelectCategory(item)}
                className={`flex items-center group text-[14px] transition-colors w-full text-left ${
                  selectedCategory === item
                    ? "text-[#22C55E] font-semibold"
                    : "text-gray-600 hover:text-[#22C55E]"
                }`}
              >
                <ChevronRight
                  className={`h-3 w-3 mr-2 transition-all ${
                    selectedCategory === item
                      ? "opacity-100 text-[#22C55E]"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                />
                {item}
              </button>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);

// --- Thanh Công Cụ (Toolbar) ---
const ShopToolbar = ({ sort, onSortChange, onOpenMobileMenu }) => (
  <div className="flex items-center justify-between gap-4 mb-6">
    <Button
      variant="outline"
      className="lg:hidden gap-2"
      onClick={onOpenMobileMenu}
    >
      <SlidersHorizontal className="h-4 w-4" />
      Danh mục
    </Button>
    <p className="hidden lg:block text-sm text-muted-foreground">
      Hiển thị <span className="font-medium text-foreground">8</span> kết quả
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
// 3. COMPONENT CHÍNH (TRANG SHOP)
// ==========================================
const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState("Giày trail nam");
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
              Danh Mục Sản Phẩm
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Trang chủ / Cửa hàng /{" "}
              <span className="text-[#22C55E] font-medium">
                {selectedCategory}
              </span>
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar (Màn hình Desktop) */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24">
                <ShopSidebar
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />
              </div>
            </aside>

            {/* Sidebar (Màn hình Mobile Overlay) */}
            {mobileMenuOpen && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div
                  className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                  onClick={() => setMobileMenuOpen(false)}
                />
                <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white p-6 overflow-y-auto animate-in slide-in-from-left shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-bold text-lg text-gray-900">
                      Danh mục
                    </h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <ShopSidebar
                    selectedCategory={selectedCategory}
                    onSelectCategory={(cat) => {
                      setSelectedCategory(cat);
                      setMobileMenuOpen(false); // Tự đóng sau khi chọn
                    }}
                  />
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

              {/* In ra giao diện list sản phẩm tĩnh */}
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mt-2">
                {allProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {/* Phân trang tĩnh */}
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
