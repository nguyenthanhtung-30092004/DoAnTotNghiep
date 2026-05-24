import axiosClient from "../../../services/axiosClient";
import {
  API_ORDER_CHECKOUT,
  API_MY_ORDERS,
  API_ADMIN_ORDERS,
} from "../../../utils/constants/api";

const checkout = (data) => {
  return axiosClient.post(API_ORDER_CHECKOUT, data);
};

const getMyOrders = () => {
  return axiosClient.get(API_MY_ORDERS);
};

const getMyOrderDetail = (orderId) => {
  return axiosClient.get(`${API_MY_ORDERS}/${orderId}`);
};

const cancelMyOrder = (orderId, reason = "") => {
  return axiosClient.patch(
    `${API_MY_ORDERS}/${orderId}/cancel`,
    { reason },
  );
};

const getAllOrders = (params = {}) => {
  return axiosClient.get(API_ADMIN_ORDERS, { params });
};

const getOrderDetail = (orderId) => {
  return axiosClient.get(`${API_ADMIN_ORDERS}/${orderId}`);
};

const updateOrderStatus = (orderId, orderStatus) => {
  return axiosClient.patch(
    `${API_ADMIN_ORDERS}/${orderId}/status`,
    { orderStatus },
  );
};

const adminCancelOrder = (orderId, reason = "") => {
  return axiosClient.patch(
    `${API_ADMIN_ORDERS}/${orderId}/cancel`,
    { reason },
  );
};

const orderService = {
  checkout,
  getMyOrders,
  getMyOrderDetail,
  cancelMyOrder,

  getAllOrders,
  getOrderDetail,
  updateOrderStatus,
  adminCancelOrder,
};

export default orderService;
