import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Loader2, X } from "lucide-react";
import { toast } from "react-toastify";

import { Button } from "../../components/ui/Button";

import ProductService from "../../services/product.service";
import brandService from "../../services/brand.service";
import categoryService from "../../services/category.service";

import ProductCard from "../../components/products/ProductCard";
import ShopFilterSidebar from "../../components/products/ShopFilterSidebar";
import ShopToolbar from "../../components/products/ShopToolbar";
import ShopPagination from "../../components/products/ShopPagination";

const getResponseData = (res) => {
  return res.data?.metadata || res.data?.data || res.data;
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
