import axiosClient from "../../../services/axiosClient";
import {
  API_BRAND_CREATE,
  API_BRAND_DELETE,
  API_BRAND_LIST,
  API_BRAND_UPDATE,
} from "../../../utils/constants/api";

const getAllBrands = () => {
  return axiosClient.get(API_BRAND_LIST);
};

const createBrand = (formData) => {
  return axiosClient.post(API_BRAND_CREATE, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const updateBrand = (id, formData) => {
  return axiosClient.put(`${API_BRAND_UPDATE}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const deleteBrand = (id) => {
  return axiosClient.delete(`${API_BRAND_DELETE}/${id}`);
};

export default {
  getAllBrands,
  createBrand,
  updateBrand,
  deleteBrand,
};
