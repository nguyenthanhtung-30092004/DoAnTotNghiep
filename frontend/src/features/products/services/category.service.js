import axiosClient from "../../../services/axiosClient";
import { API_CATEGORY } from "../../../utils/constants/api";

const formDataConfig = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};

const getAllCategories = (params = {}) => {
  return axiosClient.get(API_CATEGORY, { params });
};

const createCategory = (formData) => {
  return axiosClient.post(API_CATEGORY, formData, formDataConfig);
};

const updateCategory = (id, formData) => {
  return axiosClient.put(`${API_CATEGORY}/${id}`, formData, formDataConfig);
};

const deleteCategory = (id) => {
  return axiosClient.delete(`${API_CATEGORY}/${id}`);
};

const categoryService = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default categoryService;
