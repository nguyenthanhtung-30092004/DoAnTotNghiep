import axiosClient from "./axiosClient";
import {
  API_ADMIN_USERS,
  API_ADMIN_USER_DETAIL,
  API_ADMIN_USER_ROLE,
} from "../utils/constants/api";

// Admin: Lấy danh sách người dùng (có phân trang, search, filter role)
const getAllUsers = (params = {}) => {
  return axiosClient.get(API_ADMIN_USERS, { params });
};

// Admin: Xem chi tiết người dùng
const getUserById = (userId) => {
  return axiosClient.get(API_ADMIN_USER_DETAIL(userId));
};

// Admin: Cập nhật quyền người dùng
const updateUserRole = (userId, role) => {
  return axiosClient.patch(API_ADMIN_USER_ROLE(userId), { role });
};

// Admin: Xóa người dùng
const deleteUser = (userId) => {
  return axiosClient.delete(API_ADMIN_USER_DETAIL(userId));
};

const userService = {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
};

export default userService;
