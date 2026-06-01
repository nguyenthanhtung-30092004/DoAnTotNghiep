import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
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

const Shop = () => {
  const { categorySlug } = useParams();
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [gridView, setGridView] = useState("grid"); // "grid" | "list"

  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

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

  const currentCategory = useMemo(() => {
    if (!categorySlug) return null;
    return categories.find(
      (c) => c.slug === categorySlug || c.nameSlug === categorySlug || c._id === categorySlug
    );
  }, [categories, categorySlug]);

  const currentCategoryTitle = search
    ? `Kết quả cho "${search}"`
    : currentCategory?.name || (categorySlug ? "Danh mục sản phẩm" : "Tất cả sản phẩm");

  const hasActiveFilter = filters.brand || filters.activePrice;

  const fetchBrands = async () => {
    try {
      const res = await brandService.getAllBrands();
      const data = res;
      setBrands(Array.isArray(data) ? data : []);
    } catch {
      setBrands([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getAllCategories({
        page: 1,
        limit: 200,
      });
      const data = res;
      const list = data?.categories || data?.category || data?.data || data || [];
      setCategories(Array.isArray(list) ? list : []);
    } catch {
      setCategories([]);
    } finally {
      setCategoriesLoaded(true);
    }
  };

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

  const handleSortChange = (sort) => setFilters((prev) => ({ ...prev, sort, page: 1 }));

  const handlePageChange = (page) => setFilters((prev) => ({ ...prev, page }));

  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categorySlug && !categoriesLoaded) return;

    let isActive = true;

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
        if (search) params.search = search;

        let res;

        if (currentCategory?._id) {
          res = await ProductService.getProductByCategory(currentCategory._id, params);
        } else {
          res = await ProductService.getAllProducts(params);
        }

        if (!isActive) return;

        const data = res;

        setProducts(data.products || []);

        setPagination(
          data.pagination || {
            currentPage: filters.page,
            totalPage: 1,
            totalProduct: 0,
            limit: filters.limit,
          }
        );
      } catch (error) {
        if (!isActive) return;
        console.error(error);
        toast.error(error.response?.data?.message || "Lấy sản phẩm thất bại");
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isActive = false;
    };
  }, [
    filters.brand,
    filters.minPrice,
    filters.maxPrice,
    filters.sort,
    filters.page,
    currentCategory?._id,
    search,
    categorySlug,
    categoriesLoaded,
  ]);

  return (
    <div className="min-h-screen bg-white">
      {/* ── Page header + breadcrumb ── */}
      <div className="border-b border-zinc-200 bg-white">
        <div className="container py-8 md:py-12">
          {/* Breadcrumb - Clean & Monospaced vibe */}
          <nav className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
            <Link to="/" className="hover:text-zinc-950 transition-colors">
              Trang chủ
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/shop" className="hover:text-zinc-950 transition-colors">
              Cửa hàng
            </Link>
            {categorySlug && (
              <>
                <ChevronRight className="h-3 w-3" />
                <span className="text-zinc-950">
                  {currentCategoryTitle}
                </span>
              </>
            )}
          </nav>

          {/* Title + Stats + Active Filters */}
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-black uppercase tracking-tighter text-zinc-950 md:text-5xl lg:text-6xl">
                {currentCategoryTitle}
              </h1>
              {pagination.totalProduct > 0 && (
                <p className="mt-4 text-sm font-medium text-zinc-500">
                  {pagination.totalProduct} sản phẩm được tìm thấy
                </p>
              )}
            </div>

            {/* Active filter pills */}
            {hasActiveFilter && (
              <div className="hidden md:flex flex-wrap items-center gap-2">
                {filters.activePrice && (
                  <span className="inline-flex h-8 items-center gap-1 border border-zinc-200 bg-zinc-50 pl-3 pr-1 text-[11px] font-bold uppercase tracking-wider text-zinc-950">
                    {filters.activePrice}
                    <button
                      type="button"
                      onClick={() =>
                        handleChangePrice({
                          label: "",
                          minPrice: "",
                          maxPrice: "",
                        })
                      }
                      className="flex h-6 w-6 items-center justify-center text-zinc-400 hover:text-teal-600 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {filters.brand && (
                  <span className="inline-flex h-8 items-center gap-1 border border-zinc-200 bg-zinc-50 pl-3 pr-1 text-[11px] font-bold uppercase tracking-wider text-zinc-950">
                    {brands.find((b) => b._id === filters.brand)?.nameBrand || "Thương hiệu"}
                    <button
                      type="button"
                      onClick={() => handleChangeBrand("")}
                      className="flex h-6 w-6 items-center justify-center text-zinc-400 hover:text-teal-600 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleResetFilter}
                  className="ml-2 text-[11px] font-bold uppercase tracking-wider text-zinc-400 hover:text-red-500 transition-colors"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="container py-10 md:py-16">
        <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">
          
          {/* ── Desktop Sidebar ── */}
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

          {/* ── Mobile Filter Drawer ── */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              {/* Backdrop */}
              <button
                type="button"
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Đóng bộ lọc"
              />

              {/* Drawer panel */}
              <div className="absolute left-0 top-0 bottom-0 w-[85vw] max-w-sm bg-white overflow-y-auto shadow-2xl animate-slide-in-left">
                {/* Drawer header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-5">
                  <div className="flex items-center gap-3">
                    <SlidersHorizontal className="h-5 w-5 text-zinc-950" />
                    <h2 className="text-sm font-black uppercase tracking-wider text-zinc-950">Bộ lọc</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-zinc-100 text-zinc-500 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Sidebar content */}
                <div className="px-6 py-6">
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
                <div className="sticky bottom-0 border-t border-zinc-200 bg-white p-6">
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex h-12 w-full items-center justify-center bg-teal-600 text-xs font-black uppercase tracking-[0.15em] text-white transition-colors hover:bg-teal-500 active:scale-[0.98]"
                  >
                    Xem kết quả
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
                className={`grid gap-4 md:gap-6 ${
                  gridView === "list" ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-3"
                }`}
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              /* ── Empty state (Editorial style) ── */
              <div className="flex min-h-[50vh] flex-col items-center justify-center border-y border-zinc-200 bg-white text-center px-6 py-20">
                <PackageSearch className="mb-6 h-12 w-12 text-zinc-300 stroke-[1.5]" />
                <h3 className="text-2xl font-black uppercase tracking-tight text-zinc-950">
                  Không tìm thấy sản phẩm
                </h3>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-500">
                  Thử thay đổi tiêu chí lọc hoặc tìm kiếm với một từ khóa khác.
                </p>
                {hasActiveFilter && (
                  <button
                    type="button"
                    onClick={handleResetFilter}
                    className="mt-8 flex h-12 items-center justify-center border border-zinc-950 bg-white px-8 text-xs font-black uppercase tracking-[0.15em] text-zinc-950 transition-all hover:bg-zinc-950 hover:text-white"
                  >
                    Xóa tất cả bộ lọc
                  </button>
                )}
              </div>
            ) : (
              <div
                className={`grid gap-4 md:gap-6 ${
                  gridView === "list" ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-3"
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
