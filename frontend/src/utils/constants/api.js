export const API_BASE = "http://localhost:3000/v1/api";
export const API_AUTH = `${API_BASE}/user`;
export const API_REGISTER = `${API_AUTH}/register`;
export const API_LOGIN = `${API_AUTH}/login`;
export const API_LOGOUT = `${API_AUTH}/logout`;
export const API_FORGOT_PASSWORD = `${API_AUTH}/forgot-password`;
export const API_VERIFY_OTP = `${API_AUTH}/verify-otp`;
export const API_RESET_PASSWORD = `${API_AUTH}/reset-password`;

// Category
export const API_CATEGORY = `${API_BASE}/category`;
export const API_CATEGORY_LIST = `${API_CATEGORY}/list`;
export const API_CATEGORY_CREATE = `${API_CATEGORY}/create`;
export const API_CATEGORY_UPDATE = `${API_CATEGORY}/update`;
export const API_CATEGORY_DELETE = `${API_CATEGORY}/delete`;

// Brand
export const API_BRAND = `${API_BASE}/brand`;
export const API_BRAND_LIST = `${API_BRAND}/listbrand`;
export const API_BRAND_CREATE = `${API_BRAND}/create`;
export const API_BRAND_UPDATE = `${API_BRAND}/update`;
export const API_BRAND_DELETE = `${API_BRAND}/delete`;
