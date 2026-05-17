import axios from "axios";
import { API_PRODUCT } from "../utils/constants/api";

const axiosConfig = {
  withCredentials: true,
};

const formDataConfig = {
  withCredentials: true,
  headers: {
    "Content-Type": "multipart/form-data",
  },
};

const getAllProducts = (params = {}) => {
  return axios.get(API_PRODUCT, {
    ...axiosConfig,
    params,
  });
};

const getDetailProduct = (id) => {
  return axios.get(`${API_PRODUCT}/${id}`, axiosConfig);
};

const createProduct = (formData) => {
  return axios.post(`${API_PRODUCT}`, formData, formDataConfig);
};

const updateProduct = (id, formData) => {
  return axios.put(`${API_PRODUCT}/${id}`, formData, formDataConfig);
};

const deleteProduct = (id) => {
  return axios.delete(`${API_PRODUCT}/${id}`, axiosConfig);
};

const productService = {
  getAllProducts,
  getDetailProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};

export default productService;
