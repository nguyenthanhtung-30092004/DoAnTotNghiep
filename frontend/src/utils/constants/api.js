export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/v1/api";
export const API_AUTH = `${API_BASE}/users`;
export const API_REGISTER = `${API_AUTH}/register`;
export const API_LOGIN = `${API_AUTH}/login`;
export const API_LOGOUT = `${API_AUTH}/logout`;
export const API_FORGOT_PASSWORD = `${API_AUTH}/forgot-password`;
export const API_VERIFY_OTP = `${API_AUTH}/verify-otp`;
export const API_RESET_PASSWORD = `${API_AUTH}/reset-password`;

// Categories
export const API_CATEGORY = `${API_BASE}/categories`;
export const API_CATEGORY_LIST = `${API_CATEGORY}/`;
export const API_CATEGORY_CREATE = `${API_CATEGORY}/`;
export const API_CATEGORY_UPDATE = `${API_CATEGORY}/`;
export const API_CATEGORY_DELETE = `${API_CATEGORY}/`;

// Brand
export const API_BRAND = `${API_BASE}/brands`;
export const API_BRAND_LIST = `${API_BRAND}`;
export const API_BRAND_CREATE = `${API_BRAND}/create`;
export const API_BRAND_UPDATE = `${API_BRAND}/update`;
export const API_BRAND_DELETE = `${API_BRAND}/delete`;

// Product
export const API_PRODUCT = `${API_BASE}/products`;

// Cart
export const API_CART = `${API_BASE}/carts`;

// Coupon
export const API_COUPON = `${API_BASE}/coupon`;
export const API_COUPON_VALIDATE = `${API_COUPON}/coupons/validate`;
export const API_ADMIN_COUPON = `${API_COUPON}/admin/coupons`;

// Order
export const API_ORDER = `${API_BASE}/orders`;
export const API_ORDER_CHECKOUT = `${API_ORDER}/checkout`;
export const API_MY_ORDERS = `${API_ORDER}/my-orders`;
export const API_ADMIN_ORDERS = `${API_ORDER}/admin/orders`;

// Review 
// Review
export const API_REVIEW = `${API_BASE}/reviews`;

export const API_PRODUCT_REVIEWS = (productId) =>
  `${API_REVIEW}/products/${productId}/reviews`;

export const API_REVIEW_CREATE = `${API_REVIEW}/`;

export const API_MY_REVIEWS = `${API_REVIEW}/me`;

export const API_MY_REVIEW_DETAIL = (reviewId) =>
  `${API_REVIEW}/${reviewId}`;

export const API_ADMIN_REVIEWS = `${API_REVIEW}/admin`;

export const API_ADMIN_REVIEW_APPROVE = (reviewId) =>
  `${API_REVIEW}/admin/${reviewId}/approve`;

export const API_ADMIN_REVIEW_DETAIL = (reviewId) =>
  `${API_REVIEW}/admin/${reviewId}`;