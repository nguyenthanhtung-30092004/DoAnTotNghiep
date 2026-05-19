import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/feature/authSlice"; // Đảm bảo đường dẫn đúng
import cartReducer from "../redux/feature/cartSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer, // Key này phải là 'auth' để dùng useSelector(state => state.auth)
    cart: cartReducer,
  },
});
