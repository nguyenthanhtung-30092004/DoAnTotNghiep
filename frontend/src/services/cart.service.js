import axios from "axios";
import { API_CART } from "../utils/constants/api";

const axiosConfig = {
  withCredentials: true,
};

const addToCart = (data) => {
  return axios.post(`${API_CART}/add`, data, axiosConfig);
};

const getCart = () => {
  return axios.get(API_CART, axiosConfig);
};

const updateQuantity = (itemId, quantity) => {
  return axios.put(`${API_CART}/${itemId}`, { quantity }, axiosConfig);
};

const removeFromCart = (itemId) => {
  return axios.delete(`${API_CART}/${itemId}`, axiosConfig);
};

const clearCart = () => {
  return axios.delete(API_CART, axiosConfig);
};

const syncCart = () => {
  return axios.post(`${API_CART}/sync`, {}, axiosConfig);
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
