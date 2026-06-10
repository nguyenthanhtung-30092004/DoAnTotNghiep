import axiosClient from "./axiosClient";
import { API_CART } from "../utils/constants/api";

const addToCart = (data) => {
  return axiosClient.post(`${API_CART}/add`, data);
};

const getCart = () => {
  return axiosClient.get(API_CART);
};

const updateQuantity = (itemId, quantity) => {
  return axiosClient.put(`${API_CART}/${itemId}`, { quantity });
};

const removeFromCart = (itemId) => {
  return axiosClient.delete(`${API_CART}/${itemId}`);
};

const clearCart = () => {
  return axiosClient.delete(API_CART);
};

const syncCart = (data = {}) => {
  return axiosClient.post(`${API_CART}/sync`, data);
};

const cartService = {
  addToCart,
  getCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  syncCart,
};

export default cartService;
