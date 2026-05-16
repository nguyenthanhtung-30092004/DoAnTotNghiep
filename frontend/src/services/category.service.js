import axios from "axios";
import { API_CATEGORY } from "../utils/constants/api";

const axiosConfig = {
  withCredentials: true,
};

const formDataConfig = {
  withCredentials: true,
  headers: {
    "Content-Type": "multipart/form-data",
  },
};

const getAllCategories = (params = {}) => {
  return axios.get(API_CATEGORY, {
    ...axiosConfig,
    params,
  });
};

const createCategory = (formData) => {
  return axios.post(API_CATEGORY, formData, formDataConfig);
};

const updateCategory = (id, formData) => {
  return axios.put(`${API_CATEGORY}/${id}`, formData, formDataConfig);
};

const deleteCategory = (id) => {
  return axios.delete(`${API_CATEGORY}/${id}`, axiosConfig);
};

const categoryService = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default categoryService;
