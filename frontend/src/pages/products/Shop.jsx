import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronRight, PackageSearch, SlidersHorizontal, X } from "lucide-react";
import { toast } from "react-toastify";

import ProductService from "../../services/product.service";
import brandService from "../../services/brand.service";
import categoryService from "../../services/category.service";

import ProductCard from "../../components/products/ProductCard";
import ProductSkeleton from "../../components/products/ProductSkeleton";
import ShopFilterSidebar from "../../components/products/ShopFilterSidebar";
import ShopToolbar from "../../components/products/ShopToolbar";
import ShopPagination from "../../components/products/ShopPagination";

/* ── Helper ── */
const getResponseData = (res) =>
  res.data?.metadata || res.data?.data || res.data;

/* ══════════════════════════════════════════════════════════
   Shop page — giữ nguyên toàn bộ logic fetch/filter/sort
   Chỉ redesign UI wrapper và import skeleton
══════════════════════════════════════════════════════════ */
const Shop = () => {
  const { categorySlug } = useParams();

  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [gridView, setGridView] = useState("grid"); // "grid" | "list"

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPage: 1,
    totalProduct: 0,
    limit: 12,
  });

  const [filters, setFilters] = useState({
    brand: "",
    minPrice: "",
    maxPrice: "",
    activePrice: "",
    sort: "newest",
    page: 1,
    limit: 12,
  });

  /* ── Derived state ── */
  const currentCategory = useMemo(() => {
    if (!categorySlug) return null;
    return categories.find(
      (c) =>
        c.slug === categorySlug ||
        c.nameSlug === categorySlug ||
        c._id === categorySlug,
    );
  }, [categories, categorySlug]);

  const currentCategoryTitle =
    currentCategory?.name ||
    (categorySlug ? "Danh mục sản phẩm" : "Tất cả sản phẩm");

  const hasActiveFilter = filters.brand || filters.activePrice;

  /* ── Fetchers (không đổi) ── */
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
      console.error(error);
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
    } catch {
      setBrands([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getAllCategories({ page: 1, limit: 100 });
      const data = getResponseData(res);
      const list = data?.categories || data?.category || data?.data || data || [];
      setCategories(Array.isArray(list) ? list : []);
    } catch {
      setCategories([]);
    }
  };

  /* ── Handlers (không đổi tên/logic) ── */
  const handleChangeBrand = (brandId) =>
    setFilters((prev) => ({ ...prev, brand: brandId, page: 1 }));

  const handleChangePrice = (price) =>
    setFilters((prev) => ({
      ...prev,
      minPrice: price.minPrice,
      maxPrice: price.maxPrice,
      activePrice: price.label,
      page: 1,
    }));

  const handleResetFilter = () =>
    setFilters((prev) => ({
      ...prev,
      brand: "",
      minPrice: "",
      maxPrice: "",
      activePrice: "",
      page: 1,
    }));

  const handleSortChange = (sort) =>
    setFilters((prev) => ({ ...prev, sort, page: 1 }));

  const handlePageChange = (page) =>
    setFilters((prev) => ({ ...prev, page }));

  /* ── Effects ── */
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

  /* ── Render ── */
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page header + breadcrumb */}
      <div className="bg-white border-b border-slate-100">
        <div className="container py-6">
          {/* Breadcrumb */}
          <nav className="mb-3 flex items-center gap-1.5 text-xs text-slate-400">
            <Link to="/" className="hover:text-indigo-600 transition-colors">
              Trang chủ
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/shop" className="hover:text-indigo-600 transition-colors">
              Cửa hàng
            </Link>
            {categorySlug && (
              <>
                <ChevronRight className="h-3 w-3" />
                <span className="font-semibold text-slate-700 capitalize">
                  {currentCategoryTitle}
                </span>
              </>
            )}
          </nav>

          {/* Title + stats */}
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 md:text-3xl">
                {currentCategoryTitle}
              </h1>
              {pagination.totalProduct > 0 && (
                <p className="mt-1 text-sm text-slate-500">
                  {pagination.totalProduct} sản phẩm
                </p>
              )}
            </div>

            {/* Active filter pills */}
            {hasActiveFilter && (
              <div className="hidden md:flex items-center gap-2">
                {filters.activePrice && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                    {filters.activePrice}
                    <button
                      type="button"
                      onClick={() =>
                        handleChangePrice({ label: "", minPrice: "", maxPrice: "" })
                      }
                      className="hover:text-indigo-900 ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.brand && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                    {brands.find((b) => b._id === filters.brand)?.nameBrand || "Thương hiệu"}
                    <button
                      type="button"
                      onClick={() => handleChangeBrand("")}
                      className="hover:text-indigo-900 ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleResetFilter}
                  className="text-xs font-semibold text-slate-500 hover:text-red-500 transition-colors"
                >
                  Xóa tất cả
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container py-8">
        <div className="flex gap-8">
          {/* ── Desktop Sidebar ── */}
          <aside className="hidden lg:block w-56 xl:w-64 shrink-0">
            <div className="sticky top-24 rounded-2xl border border-slate-100 bg-white p-5 shadow-soft">
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

          {/* ── Mobile Filter Drawer ── */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              {/* Backdrop */}
              <button
                type="button"
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Đóng bộ lọc"
              />

              {/* Drawer panel */}
              <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[88vw] bg-white overflow-y-auto shadow-2xl animate-slide-in-left">
                {/* Drawer header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-indigo-600" />
                    <h2 className="font-bold text-slate-800">Bộ lọc sản phẩm</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Sidebar content */}
                <div className="px-5 py-4">
                  <ShopFilterSidebar
                    brands={brands}
                    activeBrand={filters.brand}
                    activePrice={filters.activePrice}
                    onChangeBrand={(id) => {
                      handleChangeBrand(id);
                      setMobileMenuOpen(false);
                    }}
                    onChangePrice={(p) => {
                      handleChangePrice(p);
                      setMobileMenuOpen(false);
                    }}
                    onReset={() => {
                      handleResetFilter();
                      setMobileMenuOpen(false);
                    }}
                  />
                </div>

                {/* Apply button */}
                <div className="sticky bottom-0 border-t border-slate-100 bg-white p-4">
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full h-11 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-500 transition-colors"
                  >
                    Áp dụng
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Product area ── */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <ShopToolbar
              sort={filters.sort}
              onSortChange={handleSortChange}
              onOpenMobileMenu={() => setMobileMenuOpen(true)}
              showingProduct={products.length}
              totalProduct={pagination.totalProduct}
              gridView={gridView}
              onGridViewChange={setGridView}
            />

            {/* Loading skeleton */}
            {loading ? (
              <div
                className={`grid gap-3 md:gap-4 ${
                  gridView === "list"
                    ? "grid-cols-1"
                    : "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                }`}
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              /* ── Empty state ── */
              <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-slate-100 bg-white text-center px-6 py-16">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50">
                  <PackageSearch className="h-10 w-10 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-700">
                  Không tìm thấy sản phẩm
                </h3>
                <p className="mt-2 max-w-xs text-sm text-slate-400 leading-6">
                  Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác.
                </p>
                {hasActiveFilter && (
                  <button
                    type="button"
                    onClick={handleResetFilter}
                    className="mt-6 rounded-xl border border-indigo-200 bg-indigo-50 px-6 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors"
                  >
                    Xóa bộ lọc
                  </button>
                )}
              </div>
            ) : (
              /* ── Product grid ── */
              <div
                className={`grid gap-3 md:gap-4 ${
                  gridView === "list"
                    ? "grid-cols-1"
                    : "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                }`}
              >
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            <ShopPagination
              page={pagination.currentPage}
              totalPages={pagination.totalPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
