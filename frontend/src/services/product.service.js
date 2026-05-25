import axiosClient from "./axiosClient";
import { API_PRODUCT } from "../utils/constants/api";

const formDataConfig = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};

const getAllProducts = (params = {}) => {
  return axiosClient.get(API_PRODUCT, { params });
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
};

export default productService;
