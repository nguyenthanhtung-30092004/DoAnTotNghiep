import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import AddForm from "../components/Product/ProductForm/AddForm";
import DeleteForm from "../components/Product/ProductForm/DeleteForm";

import ProductStats from "../components/Product/ProductTable/ProductStats";
import ProductFilters from "../components/Product/ProductTable/ProductFilters";
import ProductPagination from "../components/Product/ProductTable/ProductPagination";

import ProductService from "../../services/product.service";
import brandService from "../../services/brand.service";
import categoryService from "../../services/category.service";
import ProductTable from "../components/Product/ProductTable/ProductTable";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);

  const [openProductForm, setOpenProductForm] = useState(false);
  const [openDeleteForm, setOpenDeleteForm] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPage: 1,
    totalProduct: 0,
    limit: 8,
  });

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    brand: "",
    minPrice: "",
    maxPrice: "",
    sort: "newest",
    page: 1,
    limit: 8,
  });

  const getResponseData = (res) => {
    return res.data?.metadata || res.data?.data || res.data;
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const params = {
        page: filters.page,
        limit: filters.limit,
        sort: filters.sort,
      };

      if (filters.search.trim()) params.search = filters.search.trim();
      if (filters.category) params.category = filters.category;
      if (filters.brand) params.brand = filters.brand;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;

      const res = await ProductService.getAllProducts(params);
      const data = getResponseData(res);
      console.log(data);

      setProducts(data.products || []);

      setPagination(
        data.pagination || {
          currentPage: 1,
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

      const brands = res.data.metadata || [];

      setBrands(Array.isArray(brands) ? brands : []);
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
        data?.categories || data?.category || data?.data || [];

      setCategories(Array.isArray(categoryList) ? categoryList : []);
    } catch (error) {
      console.log(error);
      setCategories([]);
    }
  };

  const handleChangeLimit = (limit) => {
    setFilters((prev) => ({
      ...prev,
      limit,
      page: 1,
    }));
  };

  const handleChangeFilter = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1,
    }));
  };

  const handleResetFilter = () => {
    setFilters({
      search: "",
      category: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      sort: "newest",
      page: 1,
      limit: 8,
    });
  };

  const handleOpenAdd = () => {
    setSelectedProduct(null);
    setOpenProductForm(true);
  };

  const handleOpenUpdate = (product) => {
    setSelectedProduct(product);
    setOpenProductForm(true);
  };

  const handleOpenDelete = (product) => {
    setSelectedProduct(product);
    setOpenDeleteForm(true);
  };

  const handleCloseProductForm = () => {
    setSelectedProduct(null);
    setOpenProductForm(false);
  };

  const handleCloseDeleteForm = () => {
    setSelectedProduct(null);
    setOpenDeleteForm(false);
  };

  const handleDeleteProduct = async () => {
    await ProductService.deleteProduct(selectedProduct._id);
    await fetchProducts();
  };

  const handlePrevPage = () => {
    if (pagination.currentPage <= 1) return;

    setFilters((prev) => ({
      ...prev,
      page: prev.page - 1,
    }));
  };

  const handleNextPage = () => {
    if (pagination.currentPage >= pagination.totalPage) return;

    setFilters((prev) => ({
      ...prev,
      page: prev.page + 1,
    }));
  };

  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Quản lý sản phẩm
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý sản phẩm, giá bán, tồn kho và trạng thái hiển thị
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="h-10 px-5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold flex items-center justify-center gap-2"
        >
          <Plus className="size-4" />
          Thêm sản phẩm
        </button>
      </div>

      <ProductStats
        totalProduct={pagination.totalProduct}
        showingProduct={products.length}
        totalBrand={brands.length}
        totalCategory={categories.length}
      />

      <ProductFilters
        filters={filters}
        brands={brands}
        categories={categories}
        limit={filters.limit}
        onChangeFilter={handleChangeFilter}
        onChangeLimit={handleChangeLimit}
        onReset={handleResetFilter}
      />

      <ProductTable
        products={products}
        loading={loading}
        onEdit={handleOpenUpdate}
        onDelete={handleOpenDelete}
      />

      <ProductPagination
        pagination={pagination}
        onPrev={handlePrevPage}
        onNext={handleNextPage}
      />

      {openProductForm && (
        <AddForm
          product={selectedProduct}
          brands={brands}
          categories={categories}
          onClose={handleCloseProductForm}
          onSuccess={fetchProducts}
        />
      )}

      {openDeleteForm && (
        <DeleteForm
          product={selectedProduct}
          onClose={handleCloseDeleteForm}
          onConfirm={handleDeleteProduct}
        />
      )}
    </div>
  );
};

export default AdminProducts;
