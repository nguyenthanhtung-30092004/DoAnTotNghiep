import axios from "axios";
import {
  API_BRAND_CREATE,
  API_BRAND_DELETE,
  API_BRAND_LIST,
  API_BRAND_UPDATE,
} from "../utils/constants/api";

const getAllBrands = () => {
  return axios.get(API_BRAND_LIST, {
    withCredentials: true,
  });
};

const createBrand = (formData) => {
  return axios.post(API_BRAND_CREATE, formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const updateBrand = (id, formData) => {
  return axios.put(`${API_BRAND_UPDATE}/${id}`, formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const deleteBrand = (id) => {
  return axios.delete(`${API_BRAND_DELETE}/${id}`, {
    withCredentials: true,
  });
};

export default {
  getAllBrands,
  createBrand,
  updateBrand,
  deleteBrand,
};
