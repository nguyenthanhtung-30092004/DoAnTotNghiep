import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  SlidersHorizontal,
  Star,
  X,
  Check,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";

import { Button } from "../components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/Select";

import ProductService from "../services/product.service";
import brandService from "../services/brand.service";
import categoryService from "../services/category.service";

const formatPrice = (price) => {
  if (price === undefined || price === null) return "Liên hệ";

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const getResponseData = (res) => {
  return res.data?.metadata || res.data?.data || res.data;
};

const getBrandName = (brand) => {
  if (!brand) return "Không có thương hiệu";
  if (typeof brand === "string") return brand;
  return brand.nameBrand || brand.name || "Không có thương hiệu";
};

const getProductImage = (product) => {
  return (
    product?.thumbnail?.url ||
    product?.variants?.[0]?.images?.[0]?.url ||
    "/placeholder-product.png"
  );
};

const getProductPrice = (product) => {
  return product?.minPrice ?? product?.variants?.[0]?.sizes?.[0]?.price ?? 0;
};

const getOriginalPrice = (product) => {
  const firstSize = product?.variants?.[0]?.sizes?.[0];

  if (!firstSize) return null;

  const price = Number(firstSize.price || 0);
  const salePrice = Number(firstSize.salePrice || 0);

  if (salePrice > 0 && salePrice < price) {
    return price;
  }

  return null;
};

const getSalePrice = (product) => {
  const firstSize = product?.variants?.[0]?.sizes?.[0];

  if (!firstSize) return getProductPrice(product);

  const price = Number(firstSize.price || 0);
  const salePrice = Number(firstSize.salePrice || 0);

  if (salePrice > 0 && salePrice < price) {
    return salePrice;
  }

  return product?.minPrice ?? price;
};

const priceOptions = [
  {
    label: "Dưới 500.000đ",
    minPrice: "",
    maxPrice: 500000,
  },
  {
    label: "500.000đ - 1.000.000đ",
    minPrice: 500000,
    maxPrice: 1000000,
  },
  {
    label: "1.000.000đ - 2.000.000đ",
    minPrice: 1000000,
    maxPrice: 2000000,
  },
  {
    label: "Trên 2.000.000đ",
    minPrice: 2000000,
    maxPrice: "",
  },
];

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const image = getProductImage(product);
  const price = getSalePrice(product);
  const originalPrice = getOriginalPrice(product);

  const variants = Array.isArray(product.variants) ? product.variants : [];

  console.log(variants);

  return (
    <Link
      to={`/product/${product._id}`}
      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col border border-gray-100"
    >
      {product.isPublished === false && (
        <span className="absolute top-3 left-3 z-10 bg-gray-700 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
          Nháp
        </span>
      )}

      <div className="aspect-square bg-[#F8F9FA] overflow-hidden relative">
        <img
          src={image}
          alt={product.name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-black/10 transition-colors duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
          <Button
            type="button"
            size="sm"
            className="shadow-lg text-sm gap-1.5 bg-[#22C55E] hover:bg-[#1da850] text-white"
            onClick={() => navigate("/product/" + product._id)}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Thêm vào giỏ
          </Button>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1 bg-white">
        <p className="text-[12px] font-semibold uppercase tracking-wider text-gray-500">
          {getBrandName(product.brand)}
        </p>

        <h3 className="font-semibold text-[15px] leading-snug text-gray-900 line-clamp-2 min-h-[40px]">
          {product.name}
        </h3>

        {variants.length > 0 && (
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1.5">
              {variants.slice(0, 5).map((variant, index) => (
                <span
                  key={variant._id || index}
                  title={variant.color}
                  className="h-4 w-4 rounded-full border border-gray-300 shadow-sm"
                  style={{
                    backgroundColor: variant.colorCode || "#d1d5db",
                  }}
                />
              ))}

              {variants.length > 5 && (
                <span className="text-xs font-medium text-gray-500">
                  +{variants.length - 5}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-1 mt-auto pt-1">
          <Star className="h-3.5 w-3.5 fill-[#EAB308] text-[#EAB308]" />
          <span className="text-sm font-medium text-gray-700">
            {product.rating || 5}
          </span>
          <span className="text-sm text-gray-400">
            ({product.reviewCount || 0})
          </span>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <span className="font-bold text-red-500">{formatPrice(price)}</span>

          {originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

const ShopFilterSidebar = ({
  brands,
  activeBrand,
  activePrice,
  onChangeBrand,
  onChangePrice,
  onReset,
}) => {
  return (
    <div className="space-y-8 pr-4">
      <div>
        <h3 className="text-gray-900 font-bold text-sm uppercase tracking-wider mb-4">
          Mức Giá
        </h3>

        <div className="space-y-3">
          {priceOptions.map((price) => (
            <label
              key={price.label}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                  activePrice === price.label
                    ? "border-[#22C55E] bg-[#22C55E]"
                    : "border-gray-300 group-hover:border-[#22C55E]"
                }`}
              >
                {activePrice === price.label && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>

              <input
                type="radio"
                name="price"
                checked={activePrice === price.label}
                className="hidden"
                onChange={() => onChangePrice(price)}
              />

              <span
                className={`text-[14px] ${
                  activePrice === price.label
                    ? "text-gray-900 font-medium"
                    : "text-gray-600"
                }`}
              >
                {price.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="h-[1px] w-full bg-gray-100" />

      <div>
        <h3 className="text-gray-900 font-bold text-sm uppercase tracking-wider mb-4">
          Thương Hiệu
        </h3>

        <div className="space-y-3">
          {brands.length === 0 && (
            <p className="text-sm text-gray-500">Chưa có thương hiệu</p>
          )}

          {brands.map((brand) => (
            <label
              key={brand._id}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div
                className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                  activeBrand === brand._id
                    ? "border-[#22C55E] bg-[#22C55E]"
                    : "border-gray-300 group-hover:border-[#22C55E]"
                }`}
              >
                {activeBrand === brand._id && (
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                )}
              </div>

              <input
                type="checkbox"
                checked={activeBrand === brand._id}
                className="hidden"
                onChange={() =>
                  onChangeBrand(activeBrand === brand._id ? "" : brand._id)
                }
              />

              <span
                className={`text-[14px] ${
                  activeBrand === brand._id
                    ? "text-gray-900 font-medium"
                    : "text-gray-600"
                }`}
              >
                {brand.nameBrand || brand.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full mt-4 text-[#22C55E] border-[#22C55E] hover:bg-[#22C55E] hover:text-white transition-colors"
        onClick={onReset}
      >
        Xóa bộ lọc
      </Button>
    </div>
  );
};

const ShopToolbar = ({
  sort,
  onSortChange,
  onOpenMobileMenu,
  showingProduct,
  totalProduct,
}) => {
  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <Button
        variant="outline"
        className="lg:hidden gap-2"
        onClick={onOpenMobileMenu}
      >
        <SlidersHorizontal className="h-4 w-4" />
        Bộ lọc
      </Button>

      <p className="hidden lg:block text-sm text-gray-500">
        Hiển thị{" "}
        <span className="font-medium text-gray-900">{showingProduct}</span> /{" "}
        <span className="font-medium text-gray-900">{totalProduct}</span> sản
        phẩm
      </p>

      <Select value={sort} onValueChange={onSortChange}>
        <SelectTrigger className="w-48 bg-white border">
          <SelectValue placeholder="Sắp xếp theo" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="newest">Mới nhất</SelectItem>
          <SelectItem value="oldest">Cũ nhất</SelectItem>
          <SelectItem value="price_asc">Giá: Thấp → Cao</SelectItem>
          <SelectItem value="price_desc">Giá: Cao → Thấp</SelectItem>
          <SelectItem value="name_asc">Tên: A → Z</SelectItem>
          <SelectItem value="name_desc">Tên: Z → A</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

const ShopPagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

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
          className={`w-9 h-9 ${
            p === page ? "bg-[#22C55E] hover:bg-[#1da850] text-white" : ""
          }`}
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

const Shop = () => {
  const { categorySlug } = useParams();

  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPage: 1,
    totalProduct: 0,
    limit: 8,
  });

  const [filters, setFilters] = useState({
    brand: "",
    minPrice: "",
    maxPrice: "",
    activePrice: "",
    sort: "newest",
    page: 1,
    limit: 8,
  });

  const currentCategory = useMemo(() => {
    if (!categorySlug) return null;

    return categories.find(
      (category) =>
        category.slug === categorySlug ||
        category.nameSlug === categorySlug ||
        category._id === categorySlug,
    );
  }, [categories, categorySlug]);

  const currentCategoryTitle =
    currentCategory?.name ||
    (categorySlug ? "Danh mục sản phẩm" : "Tất cả sản phẩm");

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const params = {
        page: filters.page,
        limit: filters.limit,
        sort: filters.sort,
        isPublished: true,
      };

      if (filters.brand) params.brand = filters.brand;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (currentCategory?._id) params.category = currentCategory._id;

      const res = await ProductService.getAllProducts(params);
      const data = getResponseData(res);

      setProducts(data.products || []);

      setPagination(
        data.pagination || {
          currentPage: filters.page,
          totalPage: 1,
          totalProduct: 0,
          limit: filters.limit,
        },
      );
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Lấy sản phẩm thất bại");
    } finally {
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await brandService.getAllBrands();
      const data = getResponseData(res);

      setBrands(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
      setBrands([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getAllCategories({
        page: 1,
        limit: 100,
      });

      const data = getResponseData(res);
      const categoryList =
        data?.categories || data?.category || data?.data || data || [];

      setCategories(Array.isArray(categoryList) ? categoryList : []);
    } catch (error) {
      console.log(error);
      setCategories([]);
    }
  };

  const handleChangeBrand = (brandId) => {
    setFilters((prev) => ({
      ...prev,
      brand: brandId,
      page: 1,
    }));
  };

  const handleChangePrice = (price) => {
    setFilters((prev) => ({
      ...prev,
      minPrice: price.minPrice,
      maxPrice: price.maxPrice,
      activePrice: price.label,
      page: 1,
    }));
  };

  const handleResetFilter = () => {
    setFilters((prev) => ({
      ...prev,
      brand: "",
      minPrice: "",
      maxPrice: "",
      activePrice: "",
      page: 1,
    }));
  };

  const handleSortChange = (sort) => {
    setFilters((prev) => ({
      ...prev,
      sort,
      page: 1,
    }));
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [
    filters.brand,
    filters.minPrice,
    filters.maxPrice,
    filters.sort,
    filters.page,
    currentCategory?._id,
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1">
        <div className="bg-[#F8F9FA] border-b">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 uppercase">
              {currentCategoryTitle}
            </h1>

            <p className="text-sm text-gray-500 mt-2">
              Trang chủ / Cửa hàng /{" "}
              <span className="text-[#22C55E] font-medium">
                {currentCategoryTitle}
              </span>
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col lg:flex-row gap-10">
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24">
                <ShopFilterSidebar
                  brands={brands}
                  activeBrand={filters.brand}
                  activePrice={filters.activePrice}
                  onChangeBrand={handleChangeBrand}
                  onChangePrice={handleChangePrice}
                  onReset={handleResetFilter}
                />
              </div>
            </aside>

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

                  <ShopFilterSidebar
                    brands={brands}
                    activeBrand={filters.brand}
                    activePrice={filters.activePrice}
                    onChangeBrand={handleChangeBrand}
                    onChangePrice={handleChangePrice}
                    onReset={handleResetFilter}
                  />
                </div>
              </div>
            )}

            <div className="flex-1 min-w-0">
              <ShopToolbar
                sort={filters.sort}
                onSortChange={handleSortChange}
                onOpenMobileMenu={() => setMobileMenuOpen(true)}
                showingProduct={products.length}
                totalProduct={pagination.totalProduct}
              />

              {loading ? (
                <div className="min-h-[360px] flex flex-col items-center justify-center text-gray-500">
                  <Loader2 className="h-8 w-8 animate-spin mb-3" />
                  <p>Đang tải sản phẩm...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="min-h-[360px] flex flex-col items-center justify-center text-center border rounded-2xl bg-gray-50">
                  <p className="text-lg font-semibold text-gray-900">
                    Không có sản phẩm
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Thử đổi bộ lọc hoặc chọn danh mục khác.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mt-2">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              )}

              <ShopPagination
                page={pagination.currentPage}
                totalPages={pagination.totalPage}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Shop;
