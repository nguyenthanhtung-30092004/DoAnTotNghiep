import axios from "axios";
import {
  API_CATEGORY_CREATE,
  API_CATEGORY_DELETE,
  API_CATEGORY_LIST,
  API_CATEGORY_UPDATE,
} from "../utils/constants/api";

const getAllCategories = () => {
  return axios.get(API_CATEGORY_LIST, {
    withCredentials: true,
  });
};

const createCategory = (formData) => {
  return axios.post(API_CATEGORY_CREATE, formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const updateCategory = (id, formData) => {
  return axios.put(`${API_CATEGORY_UPDATE}/${id}`, formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const deleteCategory = (id) => {
  return axios.delete(`${API_CATEGORY_DELETE}/${id}`, {
    withCredentials: true,
  });
};

export default {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
