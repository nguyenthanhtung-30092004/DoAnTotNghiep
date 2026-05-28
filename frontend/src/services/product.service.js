import axiosClient from "./axiosClient";
import {
  API_PRODUCT,
  API_PRODUCT_BY_BRAND,
  API_PRODUCT_BY_CATEGORY,
} from "../utils/constants/api";

const formDataConfig = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};

const getAllProducts = (params = {}) => {
  return axiosClient.get(API_PRODUCT, { params });
};

const getProductByCategory = (categoryId, params = {}) => {
  return axiosClient.get(API_PRODUCT_BY_CATEGORY(categoryId), { params });
};

const getProductByBrand = (brandId, params = {}) => {
  return axiosClient.get(API_PRODUCT_BY_BRAND(brandId), { params });
};

const getDetailProduct = (id) => {
  return axiosClient.get(`${API_PRODUCT}/${id}`);
};

const createProduct = (formData) => {
  return axiosClient.post(`${API_PRODUCT}`, formData, formDataConfig);
};

const updateProduct = (id, formData) => {
  return axiosClient.put(`${API_PRODUCT}/${id}`, formData, formDataConfig);
};

const deleteProduct = (id) => {
  return axiosClient.delete(`${API_PRODUCT}/${id}`);
};

const productService = {
  getAllProducts,
  getDetailProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductByCategory,
  getProductByBrand,
};

export default productService;
