import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/users/slice/authSlice"; // Đảm bảo đường dẫn đúng
import cartReducer from "../features/cart/slice/cartSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer, // Key này phải là 'auth' để dùng useSelector(state => state.auth)
    cart: cartReducer,
  },
});

export default store;
